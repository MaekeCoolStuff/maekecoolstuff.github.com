import { defineComponent, html } from "../../../components/dist/index.js";
import { baseStyles } from "../shared-styles.js";
defineComponent("nala-page-outline", {
  shadow: true,
  styles: `${baseStyles}\n${":host {\n  position: fixed;\n  top: var(--nala-page-outline-top, 1rem);\n  right: var(--nala-page-outline-right, 1rem);\n  z-index: var(--nala-page-outline-layer, 20);\n}\n\n.toggle {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n  min-height: 2.75rem;\n  min-width: 2.75rem;\n  justify-content: center;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: 999px;\n  padding: 0 1rem;\n  background: var(--nala-ui-color-surface, #fffefa);\n  color: var(--nala-ui-color-text, #18201d);\n  box-shadow: var(--nala-ui-shadow-raised, 0 0.75rem 2rem rgba(35, 48, 42,\n    0.18));\n  font: inherit;\n  font-weight: 650;\n  cursor: pointer;\n}\n\n.toggle:hover,\n.toggle[aria-expanded=\"true\"] {\n  border-color: var(--nala-ui-color-accent, #276749);\n  color: var(--nala-ui-color-accent, #276749);\n}\n\n.toggle:focus-visible {\n  outline: 3px solid var(--nala-ui-color-accent, #276749);\n  outline-offset: 3px;\n}\n\nsvg {\n  width: 1.25rem;\n  height: 1.25rem;\n  flex: none;\n  fill: none;\n  stroke: currentColor;\n  stroke-width: 2;\n  stroke-linecap: round;\n}\n\n.panel {\n  position: fixed;\n  inset: auto;\n  top: calc(var(--nala-page-outline-top, 1rem) + 3.5rem);\n  right: var(--nala-page-outline-right, 1rem);\n  margin: 0;\n  width: var(--nala-page-outline-width, 18rem);\n  max-width: calc(100vw - 2rem);\n  max-height: calc(100dvh - var(--nala-page-outline-top, 1rem) - 5rem);\n  overflow: auto;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-medium, 6px);\n  padding: 1rem 1.25rem;\n  background: var(--nala-ui-color-surface, #fffefa);\n  color: var(--nala-ui-color-text, #18201d);\n  box-shadow: var(--nala-ui-shadow-raised, 0 1.25rem 3.5rem rgba(35, 48, 42,\n    0.18));\n  line-height: 1.5;\n}\n\n.heading {\n  margin: 0 0 0.75rem;\n  color: var(--nala-ui-color-text-muted, #59645e);\n  font-size: 0.75rem;\n  font-weight: 700;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n}\n\n::slotted(:is(ol, ul)) {\n  margin: 0;\n  padding-left: 1.5rem;\n}\n\n@media (max-width: 40rem) {\n  .toggle {\n    padding: 0;\n  }\n\n  .text {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    overflow: hidden;\n    clip-path: inset(50%);\n    white-space: nowrap;\n  }\n}\n\n@media (forced-colors: active) {\n  .toggle,\n  .panel {\n    border-color: CanvasText;\n  }\n}\n"}`,
  props: {
    label: {
      type: "string",
      default: "On this page"
    }
  },
  template: ({ label })=>html`
      <button type="button" class="toggle" part="button" popovertarget="panel"
        aria-controls="panel" aria-expanded="false">
        <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <path d="M3 5h2M8 5h9M3 10h2M8 10h9M3 15h2M8 15h9" />
        </svg>
        <span class="text">${label}</span>
      </button>
      <nav id="panel" class="panel" part="panel" popover="auto"
        aria-label=${label}>
        <p class="heading" part="heading" aria-hidden="true">${label}</p>
        <slot></slot>
      </nav>
    `,
  onConnect: ({ query, listen, delegate, onCleanup })=>{
    const button = query(".toggle");
    const panel = query(".panel");
    if (!button || !panel) {
      throw new Error("Page outline is missing its button or panel");
    }
    if (typeof panel.showPopover !== "function") {
      throw new Error("nala-page-outline requires browser support for the Popover API");
    }
    listen(panel, "beforetoggle", (event)=>{
      button.setAttribute("aria-expanded", String(event.newState === "open"));
    });
    // A followed in-page link has done its job; the native fragment
    // navigation still runs because the click is not prevented.
    delegate("click", "a[href]", ()=>{
      if (panel.matches(":popover-open")) panel.hidePopover();
    });
    onCleanup(()=>{
      if (panel.matches(":popover-open")) panel.hidePopover();
    });
  }
});
