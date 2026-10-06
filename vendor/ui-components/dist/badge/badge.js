import { defineComponent, html } from "../../../components/dist/index.js";
import { baseStyles } from "../shared-styles.js";
const tones = new Set([
  "neutral",
  "accent",
  "success",
  "warning",
  "danger"
]);
defineComponent("nala-badge", {
  shadow: true,
  props: {
    tone: "string"
  },
  styles: `${baseStyles}\n${":host {\n  display: inline-flex;\n}\n\nspan {\n  display: inline-flex;\n  min-height: 1.55rem;\n  align-items: center;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: 999px;\n  padding: 0 0.55rem;\n  background: var(--nala-ui-color-surface-muted, #f7f7f2);\n  color: var(--nala-ui-color-text-muted, #68716c);\n  font-size: 0.7rem;\n  font-weight: 800;\n}\n\n.accent, .success {\n  border-color: var(--nala-ui-color-accent-soft, #d8e8df);\n  background: var(--nala-ui-color-accent-soft, #d8e8df);\n  color: var(--nala-ui-color-accent-strong, #10372a);\n}\n\n.warning {\n  border-color: var(--nala-ui-color-warning, #f0b84b);\n  background: color-mix(in srgb, var(--nala-ui-color-warning, #f0b84b) 24%, white);\n  color: var(--nala-ui-color-text, #18201d);\n}\n\n.danger {\n  border-color: color-mix(in srgb, var(--nala-ui-color-danger, #a43f35) 35%, white);\n  background: color-mix(in srgb, var(--nala-ui-color-danger, #a43f35) 12%, white);\n  color: var(--nala-ui-color-danger, #a43f35);\n}\n"}`,
  template: (props)=>{
    const tone = tones.has(props.tone) ? props.tone : "neutral";
    return html`<span part="badge" class=${tone}><slot></slot></span>`;
  }
});
