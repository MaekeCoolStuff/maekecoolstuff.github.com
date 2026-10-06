import { defineComponent, html, when } from "../../../components/dist/index.js";
import { baseStyles } from "../shared-styles.js";
defineComponent("nala-progress", {
  shadow: true,
  props: {
    label: "string",
    hint: "string",
    value: "number",
    max: "number"
  },
  styles: `${baseStyles}\n${":host {\n  display: block;\n}\n\n.field {\n  display: grid;\n  gap: 0.4rem;\n}\n\n.label {\n  color: var(--nala-ui-color-text, #18201d);\n  font-size: 0.84rem;\n  font-weight: 750;\n}\n\nprogress {\n  display: block;\n  width: 100%;\n  height: 0.7rem;\n  appearance: none;\n  overflow: hidden;\n  border: 0;\n  border-radius: 999px;\n  background: var(--nala-ui-color-surface-muted, #f7f7f2);\n  accent-color: var(--nala-ui-color-accent, #184d3b);\n}\n\nprogress::-webkit-progress-bar {\n  border-radius: 999px;\n  background: var(--nala-ui-color-surface-muted, #f7f7f2);\n}\n\nprogress::-webkit-progress-value {\n  border-radius: 999px;\n  background: var(--nala-ui-color-accent, #184d3b);\n  transition: width 180ms ease;\n}\n\nprogress::-moz-progress-bar {\n  border-radius: 999px;\n  background: var(--nala-ui-color-accent, #184d3b);\n}\n\n.hint {\n  color: var(--nala-ui-color-text-muted, #68716c);\n  font-size: 0.76rem;\n  line-height: 1.4;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  progress::-webkit-progress-value {\n    transition: none;\n  }\n}\n"}`,
  template: (props)=>html`
      <div class="field" part="field">
        <label class="label" part="label" for="progress">
          ${props.label || "Progress"}
        </label>
        <progress
          id="progress"
          part="control"
          max=${props.max > 0 ? props.max : 100}
          value=${props.value ?? null}
          aria-describedby=${props.hint ? "hint" : null}
        ></progress>
        ${when(Boolean(props.hint), ()=>html`<span id="hint" class="hint" part="hint">${props.hint}</span>`)}
      </div>
    `
});
