import { defineComponent, html } from "../../../components/dist/index.js";
import { baseStyles } from "../shared-styles.js";
const positions = new Set([
  "top",
  "right",
  "bottom",
  "left"
]);
let nextTooltipId = 0;
function tooltipPosition(position) {
  return position && positions.has(position) ? position : "top";
}
defineComponent("nala-tooltip", {
  shadow: true,
  props: {
    text: "string",
    position: "string"
  },
  styles: `${baseStyles}\n${":host {\n  position: relative;\n  display: inline-flex;\n  vertical-align: middle;\n}\n\n.trigger {\n  display: inline-flex;\n}\n\n::slotted(.nala-tooltip__description) {\n  position: absolute;\n  z-index: 1000;\n  width: max-content;\n  max-width: var(--nala-tooltip-max-width, min(18rem, calc(100vw - 2rem)));\n  border-radius: var(--nala-ui-radius-small, 4px);\n  padding: 0.45rem 0.65rem;\n  background: var(--nala-tooltip-background, var(--nala-ui-color-text, #18201d));\n  color: var(--nala-tooltip-color, var(--nala-ui-color-surface, #fffefa));\n  font-size: 0.75rem;\n  line-height: 1.4;\n  text-align: left;\n  white-space: normal;\n  visibility: hidden;\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity 120ms ease;\n}\n\n:host(:hover) ::slotted(.nala-tooltip__description),\n:host(:focus-within) ::slotted(.nala-tooltip__description) {\n  visibility: visible;\n  opacity: 1;\n}\n\n::slotted(.nala-tooltip__description.top) {\n  bottom: calc(100% + 0.5rem);\n  left: 50%;\n  transform: translateX(-50%);\n}\n\n::slotted(.nala-tooltip__description.right) {\n  top: 50%;\n  left: calc(100% + 0.5rem);\n  transform: translateY(-50%);\n}\n\n::slotted(.nala-tooltip__description.bottom) {\n  top: calc(100% + 0.5rem);\n  left: 50%;\n  transform: translateX(-50%);\n}\n\n::slotted(.nala-tooltip__description.left) {\n  top: 50%;\n  right: calc(100% + 0.5rem);\n  transform: translateY(-50%);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  ::slotted(.nala-tooltip__description) {\n    transition: none;\n  }\n}\n"}`,
  template: ()=>html`
      <span class="trigger" part="trigger"><slot></slot></span>
      <slot name="nala-tooltip-description"></slot>
    `,
  onAfterRender: ({ element, props })=>{
    const description = element.querySelector(".nala-tooltip__description");
    if (!description) return;
    description.textContent = props.text?.trim() ?? "";
    description.className = `nala-tooltip__description ${tooltipPosition(props.position)}`;
  },
  onConnect: ({ element, query, listen, onCleanup, props })=>{
    const slot = query("slot:not([name])");
    if (!slot) throw new Error("Tooltip is missing its trigger slot");
    let tooltipId;
    do {
      tooltipId = `nala-tooltip-description-${++nextTooltipId}`;
    }while (document.getElementById(tooltipId))
    const description = document.createElement("span");
    description.id = tooltipId;
    description.className = `nala-tooltip__description ${tooltipPosition(props.position)}`;
    description.setAttribute("slot", "nala-tooltip-description");
    description.setAttribute("role", "tooltip");
    description.textContent = props.text?.trim() ?? "";
    element.append(description);
    const describedTriggers = new Map();
    const removeDescription = (trigger, added)=>{
      if (!added) return;
      const descriptions = (trigger.getAttribute("aria-describedby") ?? "").split(/\s+/).filter((id)=>id && id !== tooltipId);
      if (descriptions.length) {
        trigger.setAttribute("aria-describedby", descriptions.join(" "));
      } else {
        trigger.removeAttribute("aria-describedby");
      }
    };
    const syncTriggers = ()=>{
      const assigned = new Set(slot.assignedElements({
        flatten: true
      }));
      for (const [trigger, added] of describedTriggers){
        if (!assigned.has(trigger)) {
          removeDescription(trigger, added);
          describedTriggers.delete(trigger);
        }
      }
      for (const trigger of assigned){
        if (describedTriggers.has(trigger)) continue;
        const descriptions = (trigger.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean);
        const added = !descriptions.includes(tooltipId);
        if (added) {
          trigger.setAttribute("aria-describedby", [
            ...descriptions,
            tooltipId
          ].join(" "));
        }
        describedTriggers.set(trigger, added);
      }
    };
    listen(slot, "slotchange", syncTriggers);
    syncTriggers();
    onCleanup(()=>{
      for (const [trigger, added] of describedTriggers){
        removeDescription(trigger, added);
      }
      describedTriggers.clear();
      description.remove();
    });
  }
});
