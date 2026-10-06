import { defineComponent, html } from "../../../components/dist/index.js";
import { baseStyles } from "../shared-styles.js";
defineComponent("nala-nav-bar", {
  shadow: true,
  props: {
    sticky: "boolean"
  },
  styles: `${baseStyles}\n${":host {\n  display: block;\n  z-index: 20;\n}\n\n:host([sticky]) {\n  position: sticky;\n  top: 0;\n}\n\nheader {\n  display: grid;\n  min-height: 4.25rem;\n  grid-template-columns: minmax(10rem, auto) minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 1.5rem;\n  border-bottom: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  padding: 0 1.5rem;\n  background: color-mix(in srgb, var(--nala-ui-color-surface, #fffefa) 94%, transparent);\n  backdrop-filter: blur(12px);\n}\n\n.brand {\n  font-family: var(--nala-ui-font-display, \"Baskerville\", \"Iowan Old Style\", serif);\n  font-size: 1.15rem;\n  font-weight: 600;\n}\n\n.links {\n  min-width: 0;\n}\n\n.actions {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n\n::slotted([slot=\"brand\"]),\n::slotted([slot=\"links\"]),\n::slotted([slot=\"actions\"]) {\n  color: inherit;\n}\n\n@media (max-width: 44rem) {\n  header {\n    grid-template-columns: minmax(0, 1fr) auto;\n    padding: 0 1rem;\n  }\n\n  .links {\n    display: none;\n  }\n}\n"}`,
  template: ()=>html`
      <header part="bar">
        <div class="brand" part="brand"><slot name="brand"></slot></div>
        <nav class="links" part="links" aria-label="Primary navigation">
          <slot name="links"></slot>
        </nav>
        <div class="actions" part="actions"><slot name="actions"></slot></div>
      </header>
    `
});
