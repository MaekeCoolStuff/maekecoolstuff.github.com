import { dispatchComponentEvent } from "./events.js";
import { defineComponent } from "./define-component.js";
/** Defines a component with the common value and form-state properties. */ export function defineFormControl(tagName, config) {
  const { valueType = "string", props = {}, form, ...componentConfig } = config;
  if (form && config.formAssociated === false) {
    throw new TypeError("Form association cannot be disabled when form is configured");
  }
  const syncForm = (context)=>{
    if (!form) return;
    const internals = context.internals;
    if (!internals) throw new Error("Form control is missing ElementInternals");
    const value = form.value(context);
    internals.setFormValue(value, form.state ? form.state(context) : value);
    const validity = form.validity?.(context);
    internals.setValidity(validity?.flags ?? {}, validity?.message, validity?.anchor);
  };
  defineComponent(tagName, {
    ...componentConfig,
    formAssociated: form ? true : config.formAssociated,
    onAfterRender (context) {
      config.onAfterRender?.(context);
      syncForm(context);
    },
    onFormDisabled (context, disabled) {
      form?.disabled(context, disabled);
      config.onFormDisabled?.(context, disabled);
    },
    onFormReset (context) {
      form?.reset(context);
      config.onFormReset?.(context);
    },
    onFormStateRestore (context, state, mode) {
      form?.restore?.(context, state, mode);
      config.onFormStateRestore?.(context, state, mode);
    },
    props: {
      value: valueType,
      checked: "boolean",
      selected: "boolean",
      disabled: "boolean",
      readonly: "boolean",
      required: "boolean",
      ...props
    }
  });
}
/** Dispatches the standard input event shape with the current control value. */ export function dispatchFormInput(element, value, options = {}) {
  return dispatchComponentEvent(element, "input", {
    value
  }, {
    bubbles: true,
    composed: true,
    ...options
  });
}
/** Dispatches the standard change event shape with the current control value. */ export function dispatchFormChange(element, value, options = {}) {
  return dispatchComponentEvent(element, "change", {
    value
  }, {
    bubbles: true,
    composed: true,
    ...options
  });
}
