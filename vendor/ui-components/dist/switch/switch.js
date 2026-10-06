import { defineFormControl, dispatchFormChange, dispatchFormInput, html, when } from "../../../components/dist/index.js";
import { baseStyles } from "../shared-styles.js";
defineFormControl("nala-switch", {
  shadow: true,
  props: {
    label: "string",
    hint: "string",
    name: "string"
  },
  styles: `${baseStyles}\n${":host {\n  display: block;\n}\n\n.field {\n  display: grid;\n  gap: 0.35rem;\n}\n\n.switch {\n  display: flex;\n  align-items: center;\n  gap: 0.7rem;\n  cursor: pointer;\n  font-size: 0.9rem;\n  font-weight: 700;\n  line-height: 1.35;\n}\n\ninput {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  clip-path: inset(50%);\n  white-space: nowrap;\n}\n\n.track {\n  position: relative;\n  width: 2.65rem;\n  height: 1.55rem;\n  flex: 0 0 auto;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: 999px;\n  background: var(--nala-ui-color-surface-muted, #f7f7f2);\n  transition: background-color 140ms ease, border-color 140ms ease;\n}\n\n.track::after {\n  position: absolute;\n  top: 0.18rem;\n  left: 0.18rem;\n  width: 1.05rem;\n  height: 1.05rem;\n  border-radius: 50%;\n  background: var(--nala-ui-color-surface, #fffefa);\n  box-shadow: 0 1px 3px rgba(24, 32, 29, 0.24);\n  content: \"\";\n  transition: transform 140ms ease;\n}\n\ninput:checked + .track {\n  border-color: var(--nala-ui-color-accent, #184d3b);\n  background: var(--nala-ui-color-accent, #184d3b);\n}\n\ninput:checked + .track::after {\n  transform: translateX(1.1rem);\n}\n\ninput:focus-visible + .track {\n  outline: 3px solid var(--nala-ui-color-accent-soft, #d8e8df);\n  outline-offset: 2px;\n}\n\ninput:disabled + .track,\ninput:disabled ~ .label-text {\n  cursor: not-allowed;\n  opacity: 0.55;\n}\n\n.hint {\n  padding-left: 3.35rem;\n  color: var(--nala-ui-color-text-muted, #68716c);\n  font-size: 0.76rem;\n  line-height: 1.4;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .track,\n  .track::after {\n    transition: none;\n  }\n}\n"}`,
  template: (props)=>html`
      <div class="field" part="field">
        <label class="switch" part="label">
          <input
            part="input"
            type="checkbox"
            role="switch"
            name=${props.name}
            aria-describedby=${props.hint ? "hint" : null}
            .checked=${props.checked}
            ?disabled=${props.disabled}
            ?required=${props.required}
          />
          <span class="track" part="control" aria-hidden="true"></span>
          <span class="label-text">${props.label}</span>
        </label>
        ${when(Boolean(props.hint), ()=>html`<span id="hint" class="hint" part="hint">${props.hint}</span>`)}
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
