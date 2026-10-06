import { defineFormControl, dispatchFormChange, dispatchFormInput, html, when } from "../../../components/dist/index.js";
import { fieldStyles } from "../shared-styles.js";
defineFormControl("nala-date-picker", {
  shadow: true,
  props: {
    label: "string",
    hint: "string",
    name: "string",
    min: "string",
    max: "string",
    step: "number"
  },
  styles: `${fieldStyles}\n${"input {\n  padding: 0 0.8rem;\n}\n"}`,
  template: (props)=>html`
      <label class="field" part="field">
        ${when(Boolean(props.label), ()=>html`<span class="label" id="date-label" part="label">${props.label}</span>`)}
        <input
          class="control"
          part="control"
          type="date"
          name=${props.name}
          min=${props.min}
          max=${props.max}
          step=${props.step > 0 ? props.step : null}
          .value=${String(props.value ?? "")}
          ?disabled=${props.disabled}
          ?readonly=${props.readonly}
          ?required=${props.required}
          aria-labelledby=${props.label ? "date-label" : null}
          aria-describedby=${props.hint ? "date-hint" : null}
        />
        ${when(Boolean(props.hint), ()=>html`<span class="hint" id="date-hint" part="hint">${props.hint}</span>`)}
      </label>
    `,
  onConnect: ({ delegate, element })=>{
    delegate("input", "input[type=date]", (event, target)=>{
      event.stopPropagation();
      dispatchFormInput(element, target.value);
    });
    delegate("change", "input[type=date]", (event, target)=>{
      event.stopPropagation();
      const value = target.value;
      element.value = value;
      dispatchFormChange(element, value);
    });
  }
});
