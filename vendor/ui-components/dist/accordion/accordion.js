import { defineComponent, dispatchComponentEvent, html } from "../../../components/dist/index.js";
import { baseStyles } from "../shared-styles.js";
function detailsOf(element) {
  return Array.from(element.children).filter((child)=>child instanceof HTMLDetailsElement);
}
function syncSingleOpen(element) {
  if (element.getAttribute("mode") !== "single") return;
  let foundOpen = false;
  for (const details of detailsOf(element)){
    if (!details.open) continue;
    if (!foundOpen) foundOpen = true;
    else details.open = false;
  }
}
defineComponent("nala-accordion", {
  shadow: true,
  props: {
    label: "string",
    mode: "string"
  },
  styles: `${baseStyles}\n${":host {\n  display: block;\n}\n\n.items {\n  border-top: 1px solid var(--nala-ui-color-border, #cbcfc8);\n}\n\n::slotted(details) {\n  border-bottom: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  padding: 0.85rem 0.15rem;\n  color: var(--nala-ui-color-text, #18201d);\n}\n\n::slotted(details[open]) {\n  border-bottom-color: var(--nala-ui-color-accent, #184d3b);\n}\n"}`,
  template: (props)=>html`
      <section
        class="items"
        part="items"
        role="group"
        aria-label=${props.label || "Accordion"}
      >
        <slot></slot>
      </section>
    `,
  onAfterRender: ({ element })=>syncSingleOpen(element),
  onConnect: ({ element, listen, query })=>{
    const slot = query("slot");
    if (slot) listen(slot, "slotchange", ()=>syncSingleOpen(element));
    listen(element, "toggle", (event)=>{
      const target = event.target;
      if (!(target instanceof HTMLDetailsElement) || target.parentElement !== element) return;
      const items = detailsOf(element);
      if (target.open && element.getAttribute("mode") === "single") {
        items.forEach((item)=>{
          if (item !== target) item.open = false;
        });
      }
      dispatchComponentEvent(element, "change", {
        index: items.indexOf(target),
        open: target.open
      }, {
        bubbles: true,
        composed: true
      });
    }, {
      capture: true
    });
  }
});
