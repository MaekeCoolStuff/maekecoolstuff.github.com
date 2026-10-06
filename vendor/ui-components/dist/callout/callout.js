import { defineComponent, html } from "../../../components/dist/index.js";
import { baseStyles } from "../shared-styles.js";
const tones = new Set([
  "info",
  "success",
  "warning",
  "danger"
]);
defineComponent("nala-callout", {
  shadow: true,
  props: {
    tone: "string"
  },
  styles: `${baseStyles}\n${":host {\n  display: block;\n}\n\naside {\n  border-left: 0.3rem solid var(--callout-accent);\n  border-radius: var(--nala-ui-radius-small, 4px);\n  padding: 1rem 1.1rem;\n  background: var(--callout-background);\n  color: var(--nala-ui-color-text, #18201d);\n}\n\n.info, .success {\n  --callout-accent: var(--nala-ui-color-accent, #184d3b);\n  --callout-background: var(--nala-ui-color-accent-soft, #d8e8df);\n}\n\n.warning {\n  --callout-accent: var(--nala-ui-color-warning, #f0b84b);\n  --callout-background: color-mix(in srgb, var(--nala-ui-color-warning, #f0b84b) 18%, white);\n}\n\n.danger {\n  --callout-accent: var(--nala-ui-color-danger, #a43f35);\n  --callout-background: color-mix(in srgb, var(--nala-ui-color-danger, #a43f35) 10%, white);\n}\n\n.title {\n  margin-bottom: 0.3rem;\n  font-weight: 800;\n}\n\n.content {\n  color: var(--nala-ui-color-text-muted, #68716c);\n  line-height: 1.55;\n}\n"}`,
  template: (props)=>{
    const tone = tones.has(props.tone) ? props.tone : "info";
    return html`
      <aside part="callout" class=${tone}>
        <div class="title" part="title"><slot name="title"></slot></div>
        <div class="content" part="content"><slot></slot></div>
      </aside>
    `;
  }
});
