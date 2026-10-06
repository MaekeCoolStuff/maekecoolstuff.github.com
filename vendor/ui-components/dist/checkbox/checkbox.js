import { defineFormControl, dispatchFormChange, dispatchFormInput, html, when } from "../../../components/dist/index.js";
import { baseStyles } from "../shared-styles.js";
defineFormControl("nala-checkbox", {
  shadow: true,
  props: {
    label: "string",
    hint: "string",
    name: "string"
  },
  styles: `${baseStyles}\n${":host {\n  display: block;\n}\n\n.field {\n  display: grid;\n  gap: 0.35rem;\n}\n\nlabel {\n  display: flex;\n  align-items: flex-start;\n  gap: 0.65rem;\n  cursor: pointer;\n  font-size: 0.9rem;\n  font-weight: 700;\n  line-height: 1.35;\n}\n\ninput {\n  width: 1.1rem;\n  height: 1.1rem;\n  flex: 0 0 auto;\n  margin: 0.05rem 0 0;\n  accent-color: var(--nala-ui-color-accent, #184d3b);\n}\n\ninput:focus-visible {\n  outline: 3px solid var(--nala-ui-color-accent-soft, #d8e8df);\n  outline-offset: 2px;\n}\n\ninput:disabled,\ninput:disabled + span {\n  cursor: not-allowed;\n  opacity: 0.55;\n}\n\n.hint {\n  padding-left: 1.75rem;\n  color: var(--nala-ui-color-text-muted, #68716c);\n  font-size: 0.76rem;\n  line-height: 1.4;\n}\n"}`,
  template: (props)=>html`
      <div class="field" part="field">
        <label part="label">
          <input
            part="control"
            type="checkbox"
            name=${props.name}
            .checked=${props.checked}
            ?disabled=${props.disabled}
            ?required=${props.required}
          />
          <span>${props.label}</span>
        </label>
        ${when(Boolean(props.hint), ()=>html`<span class="hint" part="hint">${props.hint}</span>`)}
      </div>
    `,
  onConnect: ({ delegate, element })=>{
    delegate("input", "input", (event, target)=>{
      event.stopPropagation();
      dispatchFormInput(element, target.checked);
    });
    delegate("change", "input", (event, target)=>{
      event.stopPropagation();
      const checked = target.checked;
      element.checked = checked;
      dispatchFormChange(element, checked);
    });
  }
});
