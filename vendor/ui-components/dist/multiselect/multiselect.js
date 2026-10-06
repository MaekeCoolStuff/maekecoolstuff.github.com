import { defineComponent, dispatchFormChange, dispatchFormInput, html, when } from "../../../components/dist/index.js";
import { fieldStyles } from "../shared-styles.js";
function optionsOf(element) {
  return Array.from(element.children).filter((child)=>child instanceof HTMLOptionElement);
}
function syncOptions(element, root) {
  const list = root.querySelector(".options");
  const summary = root.querySelector(".selection");
  if (!list || !summary) return;
  const options = optionsOf(element);
  const current = Array.from(list.querySelectorAll("input"));
  if (current.length !== options.length || current.some((input, index)=>input.value !== options[index].value || input.nextElementSibling?.textContent !== options[index].textContent)) {
    list.replaceChildren(...options.map((option)=>{
      const label = document.createElement("label");
      const input = document.createElement("input");
      const text = document.createElement("span");
      input.type = "checkbox";
      input.value = option.value;
      input.disabled = option.disabled || element.hasAttribute("disabled");
      input.checked = option.selected;
      text.textContent = option.textContent;
      label.append(input, text);
      return label;
    }));
  } else {
    current.forEach((input, index)=>{
      input.checked = options[index].selected;
      input.disabled = options[index].disabled || element.hasAttribute("disabled");
    });
  }
  const selected = options.filter((option)=>option.selected);
  summary.textContent = selected.length ? selected.map((option)=>option.textContent).join(", ") : element.getAttribute("placeholder") || "Select options";
  root.querySelector("summary")?.setAttribute("aria-label", [
    element.getAttribute("label"),
    summary.textContent
  ].filter(Boolean).join(": "));
  if (element.hasAttribute("disabled")) {
    root.querySelector("details")?.removeAttribute("open");
  }
}
defineComponent("nala-multiselect", {
  shadow: true,
  props: {
    label: "string",
    hint: "string",
    placeholder: "string",
    disabled: "boolean"
  },
  styles: `${fieldStyles}\n${"details { position: relative; }\nsummary {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n  padding: 0.65rem 0.8rem;\n  cursor: pointer;\n  list-style: none;\n}\nsummary::-webkit-details-marker { display: none; }\nsummary::after {\n  content: \"\";\n  width: 0.55rem;\n  height: 0.55rem;\n  flex: 0 0 auto;\n  border-right: 2px solid currentColor;\n  border-bottom: 2px solid currentColor;\n  transform: translateY(-25%) rotate(45deg);\n}\n.selection { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.options {\n  position: absolute;\n  z-index: 10;\n  top: calc(100% + 0.25rem);\n  width: 100%;\n  max-height: 15rem;\n  overflow: auto;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-small, 4px);\n  background: var(--nala-ui-color-surface, #fffefa);\n  box-shadow: var(--nala-ui-shadow-raised, 0 1rem 2rem rgba(35, 48, 42, 0.12));\n}\n.options label { display: flex; align-items: center; gap: 0.65rem; padding: 0.6rem 0.8rem; cursor: pointer; }\n.options label:hover { background: var(--nala-ui-color-surface-muted, #f7f7f2); }\n.options input { accent-color: var(--nala-ui-color-accent, #184d3b); }\n:host([disabled]) summary { opacity: 0.55; cursor: not-allowed; }\n"}`,
  template: (props)=>html`
      <div class="field" part="field">
        ${when(Boolean(props.label), ()=>html`<span class="label" part="label">${props.label}</span>`)}
        <details>
          <summary class="control" part="control" aria-disabled=${String(props.disabled)}
            aria-label=${props.label || "Select options"}>
            <span class="selection"></span>
          </summary>
          <div class="options" part="options" role="group" aria-label=${props.label || "Options"}></div>
        </details>
        ${when(Boolean(props.hint), ()=>html`<span class="hint" part="hint">${props.hint}</span>`)}
      </div>
    `,
  onAfterRender: ({ element, root })=>syncOptions(element, root),
  onConnect: ({ element, root, delegate, listen, onCleanup })=>{
    delegate("click", "summary", (event)=>{
      if (element.hasAttribute("disabled")) event.preventDefault();
    });
    delegate("keydown", "summary", (event)=>{
      if (element.hasAttribute("disabled") && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
      }
    });
    delegate("input", ".options input", (event)=>event.stopPropagation());
    delegate("change", ".options input", (event, target)=>{
      event.stopPropagation();
      const input = target;
      const index = Array.from(root.querySelectorAll(".options input")).indexOf(input);
      const option = optionsOf(element)[index];
      if (!option) return;
      option.selected = input.checked;
      option.toggleAttribute("selected", input.checked);
      const values = element.values;
      dispatchFormInput(element, values);
      dispatchFormChange(element, values);
    });
    listen("keydown", (event)=>{
      if (event.key === "Escape") {
        const details = root.querySelector("details");
        if (details?.open) {
          details.open = false;
          root.querySelector("summary")?.focus();
        }
      }
    });
    listen(document, "pointerdown", (event)=>{
      if (!event.composedPath().includes(element)) {
        root.querySelector("details")?.removeAttribute("open");
      }
    });
    const observer = new MutationObserver(()=>syncOptions(element, root));
    observer.observe(element, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    });
    onCleanup(()=>observer.disconnect());
  }
});
Object.defineProperty(customElements.get("nala-multiselect").prototype, "values", {
  get () {
    return optionsOf(this).filter((option)=>option.selected).map((option)=>option.value);
  },
  set (values) {
    const selected = new Set(values);
    optionsOf(this).forEach((option)=>{
      option.selected = selected.has(option.value);
      option.toggleAttribute("selected", option.selected);
    });
  }
});
