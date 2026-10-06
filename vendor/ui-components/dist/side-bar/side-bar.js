import { defineComponent, html } from "../../../components/dist/index.js";
import { baseStyles } from "../shared-styles.js";
defineComponent("nala-side-bar", {
  shadow: true,
  props: {
    label: "string",
    sticky: "boolean"
  },
  styles: `${baseStyles}\n${":host {\n  display: block;\n  min-width: 0;\n}\n\n:host([sticky]) aside {\n  position: sticky;\n  top: 5.5rem;\n  max-height: calc(100vh - 7rem);\n  overflow: auto;\n}\n\naside {\n  border-right: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  padding: 0.5rem 1.5rem 2rem 0;\n}\n\n::slotted(nav) {\n  display: grid;\n  gap: 0.2rem;\n}\n\n@media (max-width: 52rem) {\n  :host([sticky]) aside {\n    position: static;\n    max-height: none;\n  }\n\n  aside {\n    border-right: 0;\n    border-bottom: 1px solid var(--nala-ui-color-border, #cbcfc8);\n    padding: 0 0 1rem;\n  }\n}\n"}`,
  template: (props)=>html`
      <aside part="sidebar" aria-label=${props.label || "Secondary navigation"}>
        <slot></slot>
      </aside>
    `
});
