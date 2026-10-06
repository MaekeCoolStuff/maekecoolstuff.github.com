import { defineFormControl, dispatchFormChange, dispatchFormInput, html, when } from "../../../components/dist/index.js";
import { fieldStyles } from "../shared-styles.js";
import { nativeControlForm, submitFromInput, syncNativeForm } from "../native-form.js";
defineFormControl("nala-input", {
  shadow: true,
  form: nativeControlForm(),
  props: {
    label: "string",
    hint: "string",
    name: "string",
    placeholder: "string",
    type: "string",
    maxlength: "number",
    autocomplete: "string"
  },
  styles: `${fieldStyles}\n${"input {\n  padding: 0 0.8rem;\n}\n"}`,
  template: (props)=>html`
      <label class="field" part="field">
        ${when(Boolean(props.label), ()=>html`<span class="label" part="label">${props.label}</span>`)}
        <input
          class="control"
          part="control"
          type=${props.type || "text"}
          name=${props.name}
          placeholder=${props.placeholder}
          maxlength=${props.maxlength}
          autocomplete=${props.autocomplete}
          .value=${String(props.value ?? "")}
          ?disabled=${props.disabled}
          ?readonly=${props.readonly}
          ?required=${props.required}
        />
        ${when(Boolean(props.hint), ()=>html`<span class="hint" part="hint">${props.hint}</span>`)}
      </label>
    `,
  onAfterRender: syncNativeForm,
  onConnect: (context)=>{
    const { delegate, element } = context;
    syncNativeForm(context);
    delegate("input", "input", (event, target)=>{
      event.stopPropagation();
      const input = target;
      if (!input.validity.badInput) {
        element.value = input.value;
      }
      syncNativeForm(context);
      dispatchFormInput(element, input.value);
    });
    delegate("change", "input", (event, target)=>{
      event.stopPropagation();
      const input = target;
      const value = input.value;
      if (!input.validity.badInput) {
        element.value = value;
      }
      syncNativeForm(context);
      dispatchFormChange(element, value);
    });
    delegate("keydown", "input", (event)=>submitFromInput(context, event));
  }
});
