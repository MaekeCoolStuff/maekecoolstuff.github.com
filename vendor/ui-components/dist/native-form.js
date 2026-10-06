const states = new WeakMap();
function stateOf(element) {
  let state = states.get(element);
  if (!state) {
    state = {
      initialValue: element.getAttribute("value") ?? "",
      formDisabled: false
    };
    states.set(element, state);
  }
  return state;
}
function controlOf(root) {
  const control = root.querySelector("input, select");
  if (!control) throw new Error("Form control is missing its native input.");
  return control;
}
function valueOf(control) {
  if (control instanceof HTMLSelectElement && control.selectedOptions[0]?.disabled) return null;
  return control.value;
}
export function validityFlags(validity) {
  return {
    badInput: validity.badInput,
    customError: validity.customError,
    patternMismatch: validity.patternMismatch,
    rangeOverflow: validity.rangeOverflow,
    rangeUnderflow: validity.rangeUnderflow,
    stepMismatch: validity.stepMismatch,
    tooLong: validity.tooLong,
    tooShort: validity.tooShort,
    typeMismatch: validity.typeMismatch,
    valueMissing: validity.valueMissing
  };
}
export function syncNativeForm(context) {
  const { element, root, internals } = context;
  if (!internals) throw new Error("Form control is missing ElementInternals.");
  const control = controlOf(root);
  control.disabled = element.hasAttribute("disabled") || stateOf(element).formDisabled;
  internals.setFormValue(valueOf(control), control.value);
  internals.setValidity(control.willValidate ? validityFlags(control.validity) : {}, control.willValidate ? control.validationMessage : "", control);
}
export function nativeControlForm() {
  return {
    value: ({ root })=>valueOf(controlOf(root)),
    state: ({ root })=>controlOf(root).value,
    validity: ({ root })=>{
      const control = controlOf(root);
      return {
        flags: control.willValidate ? validityFlags(control.validity) : {},
        message: control.willValidate ? control.validationMessage : "",
        anchor: control
      };
    },
    reset: ({ element })=>{
      element.setAttribute("value", stateOf(element).initialValue);
    },
    disabled: (context, disabled)=>{
      stateOf(context.element).formDisabled = disabled;
      syncNativeForm(context);
    },
    restore: ({ element }, state)=>{
      if (typeof state === "string") element.setAttribute("value", state);
    }
  };
}
export function blocksImplicitSubmission(type) {
  return [
    "text",
    "search",
    "url",
    "tel",
    "email",
    "password",
    "date",
    "month",
    "week",
    "time",
    "datetime-local",
    "number"
  ].includes(type);
}
export function submitFromInput(context, event) {
  if (event.key !== "Enter" || event.isComposing) return;
  const control = controlOf(context.root);
  if (!(control instanceof HTMLInputElement) || !blocksImplicitSubmission(control.type) || control.disabled) return;
  queueMicrotask(()=>{
    if (event.defaultPrevented || !context.element.isConnected || control.disabled) return;
    const form = context.internals?.form;
    if (!form) return;
    const submitter = Array.from(form.elements).find((element)=>element instanceof HTMLButtonElement && element.type === "submit" || element instanceof HTMLInputElement && (element.type === "submit" || element.type === "image"));
    if (submitter instanceof HTMLButtonElement || submitter instanceof HTMLInputElement) {
      if (!submitter.matches(":disabled")) submitter.click();
      return;
    }
    const blockers = Array.from(form.elements).filter((element)=>{
      if (element instanceof HTMLInputElement) {
        return blocksImplicitSubmission(element.type);
      }
      return element.localName === "nala-input" && blocksImplicitSubmission(element.shadowRoot?.querySelector("input")?.type || "text");
    });
    if (blockers.length <= 1) form.requestSubmit();
  });
}
