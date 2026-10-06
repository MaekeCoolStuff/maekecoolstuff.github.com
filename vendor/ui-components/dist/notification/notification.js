import { defineComponent, dispatchComponentEvent, html } from "../../../components/dist/index.js";
import { baseStyles } from "../shared-styles.js";
import { notificationOffsets, notificationPosition } from "./notification-position.js";
const tones = new Set([
  "info",
  "success",
  "warning",
  "danger"
]);
const defaultDuration = 5000;
const notificationTimers = new WeakMap();
const placements = new Map();
function layoutNotifications() {
  const items = [
    ...placements.values()
  ];
  const offsets = notificationOffsets(items.map(({ panel, position })=>({
      position,
      height: panel.getBoundingClientRect().height
    })));
  items.forEach(({ panel, position }, index)=>{
    if (position === "inline") return;
    const offset = `${offsets[index]}px`;
    panel.style.top = position.startsWith("top") ? offset : "auto";
    panel.style.bottom = position.startsWith("bottom") ? offset : "auto";
    panel.style.left = position.endsWith("left") ? "16px" : "auto";
    panel.style.right = position.endsWith("right") ? "16px" : "auto";
  });
}
function syncPlacement(element, value) {
  const placement = placements.get(element);
  if (!placement) return;
  const { panel } = placement;
  const position = notificationPosition(value);
  placement.position = position;
  if (position === "inline") {
    if (panel.matches(":popover-open")) panel.hidePopover();
    panel.removeAttribute("popover");
    for (const side of [
      "top",
      "right",
      "bottom",
      "left"
    ]){
      panel.style.removeProperty(side);
    }
  } else {
    panel.setAttribute("popover", "manual");
    if (!panel.matches(":popover-open")) panel.showPopover();
  }
  layoutNotifications();
}
function notificationDuration(duration) {
  if (duration === null) return defaultDuration;
  return Number.isFinite(duration) && duration >= 0 ? duration : defaultDuration;
}
function dismissNotification(element) {
  if (!element.isConnected) return;
  dispatchComponentEvent(element, "dismiss", {}, {
    bubbles: true,
    composed: true
  });
  element.remove();
}
defineComponent("nala-notification", {
  shadow: true,
  props: {
    tone: "string",
    duration: "number",
    position: "string"
  },
  styles: `${baseStyles}\n${":host {\n  display: block;\n}\n\n.notification {\n  display: flex;\n  align-items: flex-start;\n  gap: 0.85rem;\n  border: 1px solid var(--notification-accent);\n  border-inline-start-width: 0.3rem;\n  border-radius: var(--nala-ui-radius-medium, 6px);\n  padding: 0.85rem 0.9rem 0.85rem 1rem;\n  background: var(--nala-ui-color-surface, #fffefa);\n  color: var(--nala-ui-color-text, #18201d);\n  box-shadow: var(--nala-ui-shadow-raised, 0 1.25rem 3.5rem rgba(35, 48, 42, 0.18));\n}\n\n.notification[popover] {\n  position: fixed;\n  inset: auto;\n  margin: 0;\n  width: min(24rem, calc(100vw - 2rem));\n  max-height: calc(100dvh - 2rem);\n  overflow: auto;\n}\n\n.notification::backdrop {\n  background: transparent;\n  pointer-events: none;\n}\n\n.info, .success {\n  --notification-accent: var(--nala-ui-color-accent, #184d3b);\n}\n\n.warning {\n  --notification-accent: var(--nala-ui-color-warning, #f0b84b);\n}\n\n.danger {\n  --notification-accent: var(--nala-ui-color-danger, #a43f35);\n}\n\n.message {\n  min-width: 0;\n  flex: 1;\n  line-height: 1.5;\n  overflow-wrap: anywhere;\n}\n\n.dismiss {\n  flex: 0 0 auto;\n  border: 0;\n  border-radius: var(--nala-ui-radius-small, 4px);\n  padding: 0.15rem 0.35rem;\n  background: transparent;\n  color: var(--nala-ui-color-text-muted, #68716c);\n  font: inherit;\n  cursor: pointer;\n}\n\n.dismiss:hover,\n.dismiss:focus-visible {\n  background: var(--nala-ui-color-surface-muted, #f7f7f2);\n  color: var(--nala-ui-color-text, #18201d);\n  outline: 2px solid var(--notification-accent);\n  outline-offset: 1px;\n}\n"}`,
  template: (props)=>{
    const tone = props.tone && tones.has(props.tone) ? props.tone : "info";
    const role = tone === "warning" || tone === "danger" ? "alert" : "status";
    return html`
      <div class=${`notification ${tone}`} part="notification" role=${role}>
        <div class="message" part="message"><slot></slot></div>
        <button
          class="dismiss"
          part="dismiss"
          type="button"
          aria-label="Dismiss notification"
        >Dismiss</button>
      </div>
    `;
  },
  onAfterRender: ({ element, props })=>{
    notificationTimers.get(element)?.setDuration(props.duration);
    syncPlacement(element, props.position);
  },
  onConnect: ({ delegate, element, listen, onCleanup, query, props })=>{
    const notification = query(".notification");
    const slot = query("slot");
    if (!notification || !slot) {
      throw new Error("Notification is missing its message container");
    }
    placements.set(element, {
      panel: notification,
      position: "inline"
    });
    const resizeObserver = new ResizeObserver(layoutNotifications);
    onCleanup(()=>{
      resizeObserver.disconnect();
      if (notification.matches(":popover-open")) notification.hidePopover();
      placements.delete(element);
      layoutNotifications();
    });
    resizeObserver.observe(notification);
    listen(slot, "slotchange", layoutNotifications);
    listen(window, "resize", layoutNotifications);
    syncPlacement(element, props.position);
    let timeoutId;
    let startedAt = 0;
    let remaining = notificationDuration(props.duration);
    let configuredDuration = remaining;
    let paused = false;
    let hovered = false;
    let focused = false;
    const clearTimer = ()=>{
      if (timeoutId === undefined) return;
      clearTimeout(timeoutId);
      timeoutId = undefined;
    };
    const startTimer = ()=>{
      if (paused || !element.isConnected || configuredDuration === 0) return;
      if (remaining <= 0) {
        dismissNotification(element);
        return;
      }
      startedAt = performance.now();
      timeoutId = setTimeout(()=>dismissNotification(element), remaining);
    };
    const syncPauseState = ()=>{
      const shouldPause = hovered || focused;
      if (paused === shouldPause) return;
      paused = shouldPause;
      if (paused) {
        if (timeoutId === undefined) return;
        clearTimer();
        remaining = Math.max(0, remaining - (performance.now() - startedAt));
      } else {
        startTimer();
      }
    };
    const timer = {
      setDuration (duration) {
        const nextDuration = notificationDuration(duration);
        if (nextDuration === configuredDuration) return;
        configuredDuration = nextDuration;
        clearTimer();
        remaining = nextDuration;
        startTimer();
      },
      dispose: clearTimer
    };
    notificationTimers.set(element, timer);
    listen(notification, "pointerenter", ()=>{
      hovered = true;
      syncPauseState();
    });
    listen(notification, "pointerleave", ()=>{
      hovered = false;
      syncPauseState();
    });
    listen(notification, "focusin", ()=>{
      focused = true;
      syncPauseState();
    });
    listen(notification, "focusout", (event)=>{
      if (event.relatedTarget instanceof Node && notification.contains(event.relatedTarget)) return;
      focused = false;
      syncPauseState();
    });
    delegate("click", "[part=dismiss]", ()=>{
      dismissNotification(element);
    });
    startTimer();
    onCleanup(()=>{
      timer.dispose();
      notificationTimers.delete(element);
    });
  }
});
const notificationPrototype = customElements.get("nala-notification").prototype;
Object.defineProperty(notificationPrototype, "dismiss", {
  value () {
    dismissNotification(this);
  }
});
