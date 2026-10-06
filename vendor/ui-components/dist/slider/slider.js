import { defineFormControl, dispatchFormChange, dispatchFormInput, html, when } from "../../../components/dist/index.js";
import { fieldStyles } from "../shared-styles.js";
defineFormControl("nala-slider", {
  shadow: true,
  valueType: "number",
  props: {
    label: "string",
    hint: "string",
    name: "string",
    min: "number",
    max: "number",
    step: "number"
  },
  styles: `${fieldStyles}\n${".control {\n  min-height: 2.75rem;\n  margin: 0;\n  accent-color: var(--nala-ui-color-accent, #184d3b);\n  cursor: pointer;\n}\n\n.control:focus-visible {\n  outline: 3px solid var(--nala-ui-color-accent-soft, #d8e8df);\n  outline-offset: 3px;\n}\n\n.control:disabled {\n  cursor: not-allowed;\n}\n"}`,
  template: (props)=>html`
      <label class="field" part="field">
        ${when(Boolean(props.label), ()=>html`<span class="label" part="label">${props.label}</span>`)}
        <input
          class="control"
          part="control"
          type="range"
          name=${props.name}
          min=${props.min}
          max=${props.max}
          step=${props.step}
          .value=${props.value === null ? "" : String(props.value)}
          ?disabled=${props.disabled}
        />
        ${when(Boolean(props.hint), ()=>html`<span class="hint" part="hint">${props.hint}</span>`)}
      </label>
    `,
  onConnect: ({ delegate, element })=>{
    delegate("input", "input", (event, target)=>{
      event.stopPropagation();
      const value = Number(target.value);
      element.value = value;
      dispatchFormInput(element, value);
    });
    delegate("change", "input", (event, target)=>{
      event.stopPropagation();
      const value = Number(target.value);
      element.value = value;
      dispatchFormChange(element, value);
    });
  }
});
