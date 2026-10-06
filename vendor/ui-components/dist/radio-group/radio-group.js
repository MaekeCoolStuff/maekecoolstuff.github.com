import { defineFormControl, dispatchFormChange, dispatchFormInput, html, when } from "../../../components/dist/index.js";
import { fieldStyles } from "../shared-styles.js";
function optionsOf(element) {
  return Array.from(element.children).filter((child)=>child instanceof HTMLOptionElement);
}
function syncOptions(element, root) {
  const list = root.querySelector(".options");
  if (!list) return;
  const options = optionsOf(element);
  const selectedOption = options.find((option)=>option.selected);
  if (!element.hasAttribute("value") && selectedOption) {
    element.value = selectedOption.value;
    return;
  }
  let inputs = Array.from(list.querySelectorAll("input"));
  if (inputs.length !== options.length || inputs.some((input, index)=>input.value !== options[index].value || input.nextElementSibling?.textContent !== options[index].textContent)) {
    list.replaceChildren(...options.map((option)=>{
      const label = document.createElement("label");
      const input = document.createElement("input");
      const text = document.createElement("span");
      input.type = "radio";
      input.value = option.value;
      text.textContent = option.textContent;
      label.append(input, text);
      return label;
    }));
    inputs = Array.from(list.querySelectorAll("input"));
  }
  const value = element.getAttribute("value") ?? "";
  inputs.forEach((input, index)=>{
    input.checked = input.value === value;
    input.name = element.getAttribute("name") ?? "";
    input.disabled = options[index].disabled || element.hasAttribute("disabled");
    input.required = element.hasAttribute("required");
  });
}
defineFormControl("nala-radio-group", {
  shadow: true,
  props: {
    label: "string",
    hint: "string",
    name: "string"
  },
  styles: `${fieldStyles}\n${"fieldset {\n  min-width: 0;\n  margin: 0;\n  padding: 0;\n  border: 0;\n}\n\n.options {\n  display: grid;\n  gap: 0.6rem;\n}\n\n.options label {\n  display: flex;\n  align-items: flex-start;\n  gap: 0.65rem;\n  cursor: pointer;\n  font-size: 0.9rem;\n  font-weight: 600;\n  line-height: 1.35;\n}\n\n.options input {\n  width: 1.1rem;\n  height: 1.1rem;\n  flex: 0 0 auto;\n  margin: 0.05rem 0 0;\n  accent-color: var(--nala-ui-color-accent, #184d3b);\n}\n\n.options input:focus-visible {\n  outline: 3px solid var(--nala-ui-color-accent-soft, #d8e8df);\n  outline-offset: 2px;\n}\n\n.options input:disabled,\n.options input:disabled + span {\n  cursor: not-allowed;\n  opacity: 0.55;\n}\n"}`,
  template: (props)=>html`
      <div class="field" part="field">
        <fieldset aria-describedby=${props.hint ? "hint" : null}>
          <legend class="label" part="label">${props.label || "Choose an option"}</legend>
          <div class="options" part="options"></div>
        </fieldset>
        ${when(Boolean(props.hint), ()=>html`<span id="hint" class="hint" part="hint">${props.hint}</span>`)}
      </div>
    `,
  onAfterRender: ({ element, root })=>syncOptions(element, root),
  onConnect: ({ delegate, element, onCleanup, root })=>{
    delegate("input", ".options input", (event, target)=>{
      event.stopPropagation();
      dispatchFormInput(element, target.value);
    });
    delegate("change", ".options input", (event, target)=>{
      event.stopPropagation();
      const value = target.value;
      element.value = value;
      dispatchFormChange(element, value);
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
