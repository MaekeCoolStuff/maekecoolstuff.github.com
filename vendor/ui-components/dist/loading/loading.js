import { defineComponent, html, when } from "../../../components/dist/index.js";
import { baseStyles } from "../shared-styles.js";
defineComponent("nala-loading", {
  shadow: true,
  props: {
    label: "string",
    variant: "string",
    "show-label": "boolean"
  },
  styles: `${baseStyles}\n${":host {\n  display: block;\n}\n\n.status {\n  display: flex;\n  align-items: center;\n  gap: 0.7rem;\n  min-width: 0;\n}\n\n.spinner {\n  width: 1.35rem;\n  height: 1.35rem;\n  flex: 0 0 auto;\n  border: 2px solid var(--nala-ui-color-border, #cbcfc8);\n  border-top-color: var(--nala-ui-color-accent, #184d3b);\n  border-radius: 50%;\n  animation: spin 750ms linear infinite;\n}\n\n.bar {\n  position: relative;\n  width: min(100%, 20rem);\n  height: 0.45rem;\n  flex: 0 1 20rem;\n  overflow: hidden;\n  border-radius: 999px;\n  background: var(--nala-ui-color-surface-muted, #f7f7f2);\n}\n\n.bar::after {\n  position: absolute;\n  inset: 0 auto 0 0;\n  width: 35%;\n  border-radius: inherit;\n  background: var(--nala-ui-color-accent, #184d3b);\n  animation: travel 1.25s ease-in-out infinite alternate;\n  content: \"\";\n}\n\n.label {\n  min-width: 0;\n  color: var(--nala-ui-color-text-muted, #68716c);\n  font-size: 0.84rem;\n  line-height: 1.4;\n  overflow-wrap: anywhere;\n}\n\n@keyframes spin {\n  to { transform: rotate(360deg); }\n}\n\n@keyframes travel {\n  from { transform: translateX(-100%); }\n  to { transform: translateX(285%); }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .spinner,\n  .bar::after {\n    animation: none;\n  }\n\n  .bar::after {\n    transform: translateX(0);\n  }\n}\n"}`,
  template: (props)=>html`
      <div
        class="status"
        part="status"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label=${props.label || "Loading"}
      >
        ${props.variant === "bar" ? html`<span class="bar" part="indicator" aria-hidden="true"></span>` : html`<span class="spinner" part="indicator" aria-hidden="true"></span>`}
        ${when(props["show-label"], ()=>html`<span class="label" part="label">${props.label || "Loading"}</span>`)}
      </div>
    `
});
