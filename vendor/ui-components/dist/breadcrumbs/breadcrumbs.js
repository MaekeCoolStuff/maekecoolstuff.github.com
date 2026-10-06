import { defineComponent, html } from "../../../components/dist/index.js";
defineComponent("nala-breadcrumbs", {
  shadow: true,
  props: {
    label: "string"
  },
  styles: ":host {\n  display: block;\n  color: var(--nala-ui-color-text, #18201d);\n}\n\nol {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.5rem;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n\n::slotted(li) {\n  min-width: 0;\n}\n\n::slotted(li:not(:first-child)) {\n  border-inline-start: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  padding-inline-start: 0.5rem;\n}\n",
  template: (props)=>html`
    <nav part="navigation" aria-label=${props.label?.trim() || "Breadcrumb"}>
      <ol part="list"><slot></slot></ol>
    </nav>
  `
});
