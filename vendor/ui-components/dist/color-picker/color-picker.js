import { defineFormControl, dispatchFormChange, dispatchFormInput, html, when } from "../../../components/dist/index.js";
import { fieldStyles } from "../shared-styles.js";
import { colorValue } from "./color-value.js";
defineFormControl("nala-color-picker", {
  shadow: true,
  props: {
    value: {
      type: "string",
      default: "#000000",
      validate: colorValue
    },
    label: "string",
    hint: "string",
    name: "string"
  },
  styles: `${fieldStyles}\n${".color-row {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  min-width: 0;\n}\n\n.control {\n  flex: 0 0 3.5rem;\n  width: 3.5rem;\n  height: 2.75rem;\n  padding: 0.25rem;\n  cursor: pointer;\n}\n\n.value {\n  color: var(--nala-ui-color-text-muted, #68716c);\n  font-family: monospace;\n  font-size: 0.9rem;\n}\n"}`,
  template: (props)=>{
    const value = colorValue(props.value);
    return html`
      <label class="field" part="field">
        ${when(Boolean(props.label), ()=>html`<span class="label" part="label">${props.label}</span>`)}
        <span class="color-row">
          <input
            class="control"
            part="control"
            type="color"
            name=${props.name}
            .value=${value}
            ?disabled=${props.disabled}
            aria-describedby=${props.hint ? "hint" : null}
          />
          <span class="value" part="value" aria-hidden="true">${value}</span>
        </span>
        ${when(Boolean(props.hint), ()=>html`<span id="hint" class="hint" part="hint">${props.hint}</span>`)}
      </label>
    `;
  },
  onConnect: ({ delegate, element })=>{
    delegate("input", "input", (event, target)=>{
      event.stopPropagation();
      const value = target.value;
      element.value = value;
      dispatchFormInput(element, value);
    });
    delegate("change", "input", (event, target)=>{
      event.stopPropagation();
      const value = target.value;
      element.value = value;
      dispatchFormChange(element, value);
    });
  }
});
