import { defineFormControl, dispatchFormChange, dispatchFormInput, html, when } from "../../../components/dist/index.js";
import { fieldStyles } from "../shared-styles.js";
defineFormControl("nala-textarea", {
  shadow: true,
  props: {
    label: "string",
    hint: "string",
    name: "string",
    placeholder: "string",
    rows: "number"
  },
  styles: `${fieldStyles}\n${"textarea {\n  min-height: 7rem;\n  padding: 0.65rem 0.8rem;\n  line-height: 1.5;\n  resize: vertical;\n}\n"}`,
  template: (props)=>html`
      <label class="field" part="field">
        ${when(Boolean(props.label), ()=>html`<span class="label" part="label">${props.label}</span>`)}
        <textarea
          class="control"
          part="control"
          name=${props.name}
          placeholder=${props.placeholder}
          rows=${props.rows || 4}
          .value=${String(props.value ?? "")}
          ?disabled=${props.disabled}
          ?readonly=${props.readonly}
          ?required=${props.required}
        ></textarea>
        ${when(Boolean(props.hint), ()=>html`<span class="hint" part="hint">${props.hint}</span>`)}
      </label>
    `,
  onConnect: ({ delegate, element })=>{
    delegate("input", "textarea", (event, target)=>{
      event.stopPropagation();
      dispatchFormInput(element, target.value);
    });
    delegate("change", "textarea", (event, target)=>{
      event.stopPropagation();
      const value = target.value;
      element.value = value;
      dispatchFormChange(element, value);
    });
  }
});
