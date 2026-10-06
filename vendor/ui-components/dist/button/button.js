import { defineComponent, html } from "../../../components/dist/index.js";
import { baseStyles } from "../shared-styles.js";
import { buttonPressed, buttonType } from "./button-state.js";
const variants = new Set([
  "primary",
  "secondary",
  "ghost",
  "danger"
]);
const states = new WeakMap();
function stateOf(element) {
  let state = states.get(element);
  if (!state) {
    state = {
      formDisabled: false
    };
    states.set(element, state);
  }
  return state;
}
function sync(element, root) {
  const state = stateOf(element);
  const button = root.querySelector("button");
  if (button) {
    button.disabled = element.hasAttribute("disabled") || state.formDisabled;
  }
  if (state.submitter) {
    state.submitter.type = buttonType(element.getAttribute("type"));
    state.submitter.disabled = element.hasAttribute("disabled") || state.formDisabled;
    const form = element.getAttribute("form");
    if (form === null) state.submitter.removeAttribute("form");
    else state.submitter.setAttribute("form", form);
  }
}
defineComponent("nala-button", {
  shadow: true,
  formAssociated: true,
  props: {
    disabled: "boolean",
    variant: "string",
    type: "string",
    form: "string",
    ariaPressed: {
      type: "string",
      attribute: "aria-pressed"
    }
  },
  styles: `${baseStyles}\n${":host {\n  display: inline-flex;\n}\n\nbutton {\n  min-height: 2.5rem;\n  border: 1px solid transparent;\n  border-radius: var(--nala-ui-radius-small, 4px);\n  padding: 0 1rem;\n  font: inherit;\n  font-weight: 750;\n  cursor: pointer;\n}\n\nbutton:focus-visible {\n  outline: 3px solid var(--nala-ui-color-accent-soft, #d8e8df);\n  outline-offset: 2px;\n}\n\nbutton:disabled {\n  cursor: not-allowed;\n  opacity: 0.5;\n}\n\n.primary {\n  background: var(--nala-ui-color-accent, #184d3b);\n  color: white;\n}\n\n.primary:hover:not(:disabled) {\n  background: var(--nala-ui-color-accent-strong, #10372a);\n}\n\n.secondary {\n  border-color: var(--nala-ui-color-border, #cbcfc8);\n  background: var(--nala-ui-color-surface, #fffefa);\n  color: var(--nala-ui-color-text, #18201d);\n}\n\n.ghost {\n  background: transparent;\n  color: var(--nala-ui-color-accent, #184d3b);\n}\n\n.danger {\n  background: var(--nala-ui-color-danger, #a43f35);\n  color: white;\n}\n"}`,
  template: (props)=>{
    const variant = variants.has(props.variant) ? props.variant : "primary";
    return html`
      <button part="button" class=${variant} type="button"
        aria-pressed=${buttonPressed(props.ariaPressed)} ?disabled=${props.disabled}>
        <slot></slot>
      </button>
    `;
  },
  onAfterRender: ({ element, root })=>sync(element, root),
  onFormDisabled: ({ element, root }, disabled)=>{
    stateOf(element).formDisabled = disabled;
    sync(element, root);
  },
  onConnect: ({ element, root, query, listen, onCleanup })=>{
    const button = query("button");
    if (!button) throw new Error("Nala button is missing its native button.");
    // A light-DOM submitter preserves native implicit submission across Shadow DOM.
    const submitter = document.createElement("button");
    submitter.hidden = true;
    submitter.tabIndex = -1;
    submitter.setAttribute("aria-hidden", "true");
    stateOf(element).submitter = submitter;
    element.append(submitter);
    sync(element, root);
    listen(submitter, "click", (event)=>{
      event.preventDefault();
      event.stopImmediatePropagation();
      button.click();
    });
    listen(button, "click", (event)=>{
      queueMicrotask(()=>{
        if (event.defaultPrevented || !element.isConnected || stateOf(element).submitter !== submitter || button.disabled || submitter.matches(":disabled")) return;
        const form = submitter.form;
        if (!form) return;
        if (submitter.type === "submit") form.requestSubmit(submitter);
        else if (submitter.type === "reset") form.reset();
      });
    });
    onCleanup(()=>{
      submitter.remove();
      stateOf(element).submitter = undefined;
    });
  }
});
