import { defineComponent, dispatchComponentEvent, html } from "../../../components/dist/index.js";
import { baseStyles } from "../shared-styles.js";
import { popoverCoordinates, popoverPosition } from "./popover-position.js";
function panelFor(element) {
  const panel = element.shadowRoot?.querySelector(".panel");
  if (!panel || !element.isConnected) {
    throw new Error("Popover must be connected before calling its methods");
  }
  return panel;
}
function triggerFor(element) {
  const slot = element.shadowRoot?.querySelector('slot[name="trigger"]');
  const trigger = slot?.assignedElements({
    flatten: true
  })[0] ?? slot?.querySelector("button");
  if (!(trigger instanceof HTMLButtonElement)) {
    throw new TypeError("nala-popover's trigger must be a native button");
  }
  return trigger;
}
function focusContent(element) {
  const slot = element.shadowRoot?.querySelector("slot:not([name])");
  for (const child of slot?.assignedElements({
    flatten: true
  }) ?? []){
    const autofocus = child.matches("[autofocus]") ? child : child.querySelector("[autofocus]");
    if (autofocus instanceof HTMLElement) {
      autofocus.focus();
      return;
    }
  }
}
function positionPanel(element) {
  const panel = element.shadowRoot?.querySelector(".panel");
  if (!panel?.matches(":popover-open")) return;
  const trigger = triggerFor(element);
  const coordinates = popoverCoordinates(trigger.getBoundingClientRect(), panel.getBoundingClientRect(), {
    width: globalThis.innerWidth,
    height: globalThis.innerHeight
  }, popoverPosition(element.getAttribute("position")));
  panel.style.left = `${coordinates.left}px`;
  panel.style.top = `${coordinates.top}px`;
}
defineComponent("nala-popover", {
  shadow: true,
  props: {
    label: "string",
    position: "string",
    "trigger-text": "string"
  },
  styles: `${baseStyles}\n${":host {\n  display: inline-block;\n}\n\n.trigger {\n  min-height: 2.5rem;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-small, 4px);\n  padding: 0 1rem;\n  background: var(--nala-ui-color-surface, #fffefa);\n  color: inherit;\n  font: inherit;\n  cursor: pointer;\n}\n\n.trigger:focus-visible {\n  outline: 3px solid var(--nala-ui-color-accent-soft, #d8e8df);\n  outline-offset: 2px;\n}\n\n.panel {\n  position: fixed;\n  inset: auto;\n  margin: 0;\n  width: var(--nala-popover-width, 20rem);\n  max-width: calc(100vw - 16px);\n  max-height: calc(100dvh - 16px);\n  overflow: auto;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-medium, 6px);\n  padding: 1rem;\n  background: var(--nala-ui-color-surface, #fffefa);\n  color: var(--nala-ui-color-text, #18201d);\n  box-shadow: var(--nala-ui-shadow-raised, 0 1.25rem 3.5rem rgba(35, 48, 42,\n    0.18));\n  line-height: 1.6;\n}\n"}`,
  template: (props)=>html`
      <slot name="trigger" part="trigger">
        <button type="button" class="trigger">${props["trigger-text"] || "Open popover"}</button>
      </slot>
      <div class="panel" part="panel" popover="auto" role="dialog"
        aria-label=${props.label || "Popover"}>
        <slot></slot>
      </div>
    `,
  onAfterRender: ({ element })=>positionPanel(element),
  onConnect: ({ element, query, listen, onCleanup })=>{
    const panel = query(".panel");
    const slot = query('slot[name="trigger"]');
    const fallback = query("button.trigger");
    if (!panel || !slot || !fallback) {
      throw new Error("Popover is missing its panel or trigger");
    }
    if (typeof panel.showPopover !== "function") {
      throw new Error("nala-popover requires browser support for the Popover API");
    }
    let active = true;
    let trigger = null;
    let restoreTrigger = null;
    const syncTrigger = ()=>{
      const assigned = slot.assignedElements({
        flatten: true
      });
      if (assigned.length > 1 || assigned.length === 1 && !(assigned[0] instanceof HTMLButtonElement)) {
        throw new TypeError("nala-popover's trigger slot accepts one native button");
      }
      const next = assigned[0] instanceof HTMLButtonElement ? assigned[0] : fallback;
      if (next === trigger) return;
      if (panel.matches(":popover-open")) panel.hidePopover();
      restoreTrigger?.();
      trigger = next;
      const previousTarget = trigger.popoverTargetElement;
      const previousTargetAttribute = trigger.getAttribute("popovertarget");
      const previousAction = trigger.getAttribute("popovertargetaction");
      const previousExpanded = trigger.getAttribute("aria-expanded");
      const previousHasPopup = trigger.getAttribute("aria-haspopup");
      const button = trigger;
      restoreTrigger = ()=>{
        button.popoverTargetElement = null;
        for (const [name, value] of [
          [
            "popovertarget",
            previousTargetAttribute
          ],
          [
            "popovertargetaction",
            previousAction
          ],
          [
            "aria-expanded",
            previousExpanded
          ],
          [
            "aria-haspopup",
            previousHasPopup
          ]
        ]){
          if (value === null) button.removeAttribute(name);
          else button.setAttribute(name, value);
        }
        if (previousTarget && !previousTargetAttribute) {
          button.popoverTargetElement = previousTarget;
        }
      };
      trigger.popoverTargetElement = trigger === fallback ? panel : null;
      trigger.popoverTargetAction = "toggle";
      trigger.setAttribute("aria-haspopup", "dialog");
      trigger.setAttribute("aria-expanded", "false");
    };
    onCleanup(()=>{
      active = false;
      if (panel.matches(":popover-open")) panel.hidePopover();
      restoreTrigger?.();
    });
    listen(slot, "slotchange", syncTrigger);
    listen(slot, "click", (event)=>{
      if (event.defaultPrevented || !trigger || trigger === fallback) return;
      event.preventDefault();
      panel.togglePopover({
        source: trigger
      });
      positionPanel(element);
    });
    listen(panel, "beforetoggle", (event)=>{
      const open = event.newState === "open";
      trigger?.setAttribute("aria-expanded", String(open));
      if (open) {
        // Opening layout is measurable only after beforetoggle has finished.
        queueMicrotask(()=>{
          if (!active) return;
          const opened = panel.matches(":popover-open");
          trigger?.setAttribute("aria-expanded", String(opened));
          if (opened) {
            positionPanel(element);
            focusContent(element);
          }
        });
      } else if (active && trigger?.isConnected && (document.activeElement !== element && document.activeElement !== trigger && element.contains(document.activeElement) || panel.contains(element.shadowRoot?.activeElement ?? null))) {
        trigger.focus();
      }
    });
    listen(panel, "toggle", ()=>{
      positionPanel(element);
      dispatchComponentEvent(element, "open-change", {
        open: panel.matches(":popover-open")
      }, {
        bubbles: true,
        composed: true
      });
    });
    const reposition = ()=>positionPanel(element);
    listen(window, "resize", reposition);
    listen(document, "scroll", reposition, {
      capture: true,
      passive: true
    });
    listen(element, "scroll", reposition, {
      capture: true,
      passive: true
    });
    const observer = new ResizeObserver(reposition);
    observer.observe(panel);
    observer.observe(element);
    onCleanup(()=>observer.disconnect());
    syncTrigger();
  }
});
const popoverPrototype = customElements.get("nala-popover").prototype;
Object.defineProperties(popoverPrototype, {
  open: {
    get () {
      return this.shadowRoot?.querySelector(".panel")?.matches(":popover-open") ?? false;
    }
  },
  show: {
    value () {
      const panel = panelFor(this);
      if (!panel.matches(":popover-open")) {
        panel.showPopover({
          source: triggerFor(this)
        });
      }
      positionPanel(this);
    }
  },
  close: {
    value () {
      const panel = panelFor(this);
      if (panel.matches(":popover-open")) panel.hidePopover();
    }
  },
  toggle: {
    value () {
      panelFor(this).togglePopover({
        source: triggerFor(this)
      });
      positionPanel(this);
    }
  }
});
