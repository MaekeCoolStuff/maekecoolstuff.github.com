import { defineFormControl, dispatchFormChange, dispatchFormInput, html, when } from "../../../components/dist/index.js";
import { fieldStyles } from "../shared-styles.js";
import { nativeControlForm, syncNativeForm } from "../native-form.js";
function syncOptions(element, root) {
  const select = root.querySelector("select");
  if (!select) return;
  const options = Array.from(element.children).filter((child)=>child instanceof HTMLOptionElement).map((option)=>option.cloneNode(true));
  select.replaceChildren(...options);
  select.value = element.getAttribute("value") ?? "";
}
defineFormControl("nala-select", {
  shadow: true,
  form: nativeControlForm(),
  props: {
    label: "string",
    hint: "string",
    name: "string"
  },
  styles: `${fieldStyles}\n${".select-wrap {\n  position: relative;\n}\n\nselect {\n  appearance: none;\n  padding: 0 2.5rem 0 0.8rem;\n}\n\n.chevron {\n  position: absolute;\n  top: 50%;\n  right: 0.85rem;\n  width: 0.55rem;\n  height: 0.55rem;\n  border-right: 2px solid var(--nala-ui-color-text-muted, #68716c);\n  border-bottom: 2px solid var(--nala-ui-color-text-muted, #68716c);\n  pointer-events: none;\n  transform: translateY(-70%) rotate(45deg);\n}\n"}`,
  template: (props)=>html`
      <label class="field" part="field">
        ${when(Boolean(props.label), ()=>html`<span class="label" part="label">${props.label}</span>`)}
        <span class="select-wrap">
          <select
            class="control"
            part="control"
            name=${props.name}
            ?disabled=${props.disabled}
            ?required=${props.required}
          ></select>
          <span class="chevron" aria-hidden="true"></span>
        </span>
        ${when(Boolean(props.hint), ()=>html`<span class="hint" part="hint">${props.hint}</span>`)}
      </label>
    `,
  onAfterRender: (context)=>{
    syncOptions(context.element, context.root);
    syncNativeForm(context);
  },
  onConnect: (context)=>{
    const { delegate, element, onCleanup, root } = context;
    delegate("input", "select", (event, target)=>{
      event.stopPropagation();
      const value = target.value;
      element.value = value;
      dispatchFormInput(element, value);
    });
    delegate("change", "select", (event, target)=>{
      event.stopPropagation();
      const value = target.value;
      element.value = value;
      dispatchFormChange(element, value);
    });
    const observer = new MutationObserver(()=>{
      syncOptions(element, root);
      syncNativeForm(context);
    });
    observer.observe(element, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    });
    onCleanup(()=>observer.disconnect());
  }
});
