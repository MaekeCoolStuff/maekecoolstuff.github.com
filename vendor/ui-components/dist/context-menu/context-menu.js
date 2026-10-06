import { defineComponent, dispatchComponentEvent, html, when } from "../../../components/dist/index.js";
import { baseStyles } from "../shared-styles.js";
function isMenuItem(element) {
  return element.localName === "nala-context-menu-item";
}
function menuItems(element) {
  const slot = element.shadowRoot?.querySelector("slot:not([name])");
  return slot?.assignedElements({
    flatten: true
  }).filter(isMenuItem) ?? [];
}
function positionPopup(element) {
  const trigger = element.shadowRoot?.querySelector(".trigger");
  const popup = element.shadowRoot?.querySelector(".popup");
  if (!trigger || !popup || popup.hidden) return;
  const triggerRect = trigger.getBoundingClientRect();
  const popupRect = popup.getBoundingClientRect();
  const edge = 8;
  const gap = 6;
  const maxLeft = Math.max(edge, window.innerWidth - popupRect.width - edge);
  const left = Math.min(Math.max(triggerRect.right - popupRect.width, edge), maxLeft);
  const below = triggerRect.bottom + gap;
  const above = triggerRect.top - popupRect.height - gap;
  const maxTop = Math.max(edge, window.innerHeight - popupRect.height - edge);
  const top = below <= maxTop ? below : above >= edge ? above : Math.min(Math.max(below, edge), maxTop);
  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
}
function setMenuOpen(element, open, focusLast = false) {
  const trigger = element.shadowRoot?.querySelector(".trigger");
  const popup = element.shadowRoot?.querySelector(".popup");
  if (!trigger || !popup) return;
  popup.hidden = !open;
  trigger.setAttribute("aria-expanded", String(open));
  element.toggleAttribute("open", open);
  if (open) {
    positionPopup(element);
    const enabled = menuItems(element).filter((item)=>!item.disabled);
    enabled[focusLast ? enabled.length - 1 : 0]?.focus();
  }
}
defineComponent("nala-context-menu-item", {
  shadow: true,
  props: {
    label: "string",
    value: "string",
    href: "string",
    disabled: "boolean",
    variant: "string"
  },
  styles: `${baseStyles}\n${":host {\n  display: block;\n  color: var(--nala-ui-color-text, #18201d);\n  outline: none;\n}\n\n:host([variant=\"danger\"]) {\n  color: var(--nala-ui-color-danger, #a43f35);\n}\n\n.action {\n  display: grid;\n  width: 100%;\n  grid-template-columns: 1.25rem minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.65rem;\n  border: 0;\n  border-radius: var(--nala-ui-radius-small, 4px);\n  padding: 0.6rem 0.75rem;\n  background: transparent;\n  color: inherit;\n  font: inherit;\n  text-align: left;\n  text-decoration: none;\n  cursor: pointer;\n}\n\n:host(:focus-visible) .action,\n.action:hover {\n  outline: none;\n  background: var(--nala-ui-color-surface-muted, #f7f7f2);\n}\n\n:host([disabled]) .action {\n  cursor: not-allowed;\n  opacity: 0.5;\n}\n\n.icon {\n  display: grid;\n  width: 1.1rem;\n  height: 1.1rem;\n  place-items: center;\n  color: var(--nala-ui-color-text-muted, #68716c);\n}\n\n.icon[hidden],\n.shortcut[hidden] {\n  display: none;\n}\n\n.icon ::slotted(*) {\n  display: block;\n  width: 1rem;\n  height: 1rem;\n}\n\n.shortcut {\n  color: var(--nala-ui-color-text-muted, #68716c);\n  font-size: 0.72rem;\n}\n"}`,
  template: (props)=>html`
      ${when(Boolean(props.href), ()=>html`
          <a
            class="action"
            href=${props.disabled ? null : props.href}
            tabindex="-1"
            aria-hidden="true"
          >
            <span class="icon" aria-hidden="true"><slot name="icon"></slot></span>
            <span>${props.label || "Action"}</span>
            <span class="shortcut"><slot name="shortcut"></slot></span>
          </a>
        `, ()=>html`
          <button
            class="action"
            type="button"
            tabindex="-1"
            aria-hidden="true"
            ?disabled=${props.disabled}
          >
            <span class="icon" aria-hidden="true"><slot name="icon"></slot></span>
            <span>${props.label || "Action"}</span>
            <span class="shortcut"><slot name="shortcut"></slot></span>
          </button>
        `)}
    `,
  onAfterRender: ({ element, props, root })=>{
    element.setAttribute("role", "menuitem");
    element.setAttribute("aria-label", props.label || "Action");
    element.setAttribute("aria-disabled", String(props.disabled));
    element.tabIndex = -1;
    const iconSlot = root.querySelector('slot[name="icon"]');
    const shortcutSlot = root.querySelector('slot[name="shortcut"]');
    const icon = root.querySelector(".icon");
    const shortcut = root.querySelector(".shortcut");
    if (iconSlot && icon) {
      icon.hidden = iconSlot.assignedNodes({
        flatten: true
      }).length === 0;
    }
    if (shortcutSlot && shortcut) {
      shortcut.hidden = shortcutSlot.assignedNodes({
        flatten: true
      }).length === 0;
    }
  },
  onConnect: ({ listen, query })=>{
    const iconSlot = query('slot[name="icon"]');
    const shortcutSlot = query('slot[name="shortcut"]');
    const icon = query(".icon");
    const shortcut = query(".shortcut");
    if (!iconSlot || !shortcutSlot || !icon || !shortcut) return;
    const syncSlots = ()=>{
      icon.hidden = iconSlot.assignedNodes({
        flatten: true
      }).length === 0;
      shortcut.hidden = shortcutSlot.assignedNodes({
        flatten: true
      }).length === 0;
    };
    listen(iconSlot, "slotchange", syncSlots);
    listen(shortcutSlot, "slotchange", syncSlots);
    syncSlots();
  }
});
const contextMenuItemPrototype = customElements.get("nala-context-menu-item").prototype;
Object.defineProperty(contextMenuItemPrototype, "activate", {
  value () {
    if (this.hasAttribute("disabled")) return;
    this.shadowRoot?.querySelector(".action")?.click();
  }
});
defineComponent("nala-context-menu", {
  shadow: true,
  props: {
    label: "string",
    "trigger-label": "string",
    "trigger-text": "string"
  },
  styles: `${baseStyles}\n${":host {\n  position: relative;\n  z-index: 0;\n  display: inline-block;\n  color: var(--nala-ui-color-text, #18201d);\n}\n\n:host([open]) {\n  z-index: 30;\n}\n\n.trigger {\n  min-height: 2.25rem;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-small, 4px);\n  padding: 0.35rem 0.65rem;\n  background: var(--nala-ui-color-surface, #fffefa);\n  color: inherit;\n  font: inherit;\n  cursor: pointer;\n}\n\n.trigger:hover,\n.trigger:focus-visible,\n.trigger[aria-expanded=\"true\"] {\n  border-color: var(--nala-ui-color-accent, #184d3b);\n  outline: 2px solid var(--nala-ui-color-accent-soft, #d8e8df);\n  outline-offset: 1px;\n}\n\n.popup {\n  position: fixed;\n  z-index: 1;\n  top: 0;\n  left: 0;\n  right: auto;\n  width: min(13rem, calc(100vw - 1rem));\n  max-height: min(22rem, calc(100dvh - 2rem));\n  overflow: auto;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-small, 4px);\n  padding: 0.3rem;\n  background: var(--nala-ui-color-surface, #fffefa);\n  box-shadow: var(--nala-ui-shadow-raised, 0 0.75rem 2rem rgba(35, 48, 42, 0.16));\n}\n\n.popup[hidden] {\n  display: none;\n}\n\n.items {\n  display: grid;\n}\n"}`,
  template: (props)=>html`
      <button
        class="trigger"
        type="button"
        aria-haspopup="menu"
        aria-expanded="false"
        aria-label=${props["trigger-label"] || "More actions"}
      >
        <slot name="trigger">${props["trigger-text"] || "More"}</slot>
      </button>
      <div
        class="popup"
        part="menu"
        role="menu"
        aria-label=${props.label || "Actions"}
        hidden
      >
        <div class="items"><slot></slot></div>
      </div>
    `,
  onAfterRender: ({ element, root })=>{
    const open = element.hasAttribute("open");
    const trigger = root.querySelector(".trigger");
    const popup = root.querySelector(".popup");
    if (!trigger || !popup) return;
    popup.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
  },
  onConnect: ({ delegate, element, listen, query })=>{
    const trigger = query(".trigger");
    const popup = query(".popup");
    const itemsSlot = query(".items slot");
    if (!trigger || !popup || !itemsSlot) return;
    const syncItems = ()=>{
      menuItems(element).forEach((item)=>{
        item.setAttribute("role", "menuitem");
        item.tabIndex = -1;
        item.setAttribute("aria-disabled", String(item.disabled));
      });
    };
    listen(itemsSlot, "slotchange", syncItems);
    syncItems();
    const reposition = ()=>positionPopup(element);
    listen(window, "resize", reposition);
    listen(window, "scroll", reposition, {
      passive: true
    });
    delegate("click", ".trigger", ()=>{
      setMenuOpen(element, !element.hasAttribute("open"));
    });
    listen(element, "click", (event)=>{
      const item = menuItems(element).find((candidate)=>event.composedPath().includes(candidate));
      if (!item) return;
      if (item.disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (!item.href) {
        dispatchComponentEvent(element, "select", {
          value: item.value
        }, {
          bubbles: true,
          composed: true
        });
      }
      setMenuOpen(element, false);
      trigger.focus();
    }, {
      capture: true
    });
    listen(element, "keydown", (event)=>{
      const keyEvent = event;
      const path = keyEvent.composedPath();
      const enabledItems = menuItems(element).filter((item)=>!item.disabled);
      const activeItem = enabledItems.find((item)=>path.includes(item));
      if (path.includes(trigger) && !element.hasAttribute("open")) {
        if (keyEvent.key === "ArrowDown" || keyEvent.key === "ArrowUp") {
          keyEvent.preventDefault();
          setMenuOpen(element, true, keyEvent.key === "ArrowUp");
        }
        return;
      }
      if (!element.hasAttribute("open")) return;
      if (keyEvent.key === "Escape") {
        keyEvent.preventDefault();
        setMenuOpen(element, false);
        trigger.focus();
        return;
      }
      if (keyEvent.key === "Tab") {
        setMenuOpen(element, false);
        return;
      }
      if (!activeItem) return;
      if (keyEvent.key === "Enter" || keyEvent.key === " ") {
        keyEvent.preventDefault();
        activeItem.activate();
        return;
      }
      const activeIndex = enabledItems.indexOf(activeItem);
      let nextIndex = null;
      if (keyEvent.key === "ArrowDown") {
        nextIndex = (activeIndex + 1) % enabledItems.length;
      } else if (keyEvent.key === "ArrowUp") {
        nextIndex = (activeIndex - 1 + enabledItems.length) % enabledItems.length;
      } else if (keyEvent.key === "Home") {
        nextIndex = 0;
      } else if (keyEvent.key === "End") {
        nextIndex = enabledItems.length - 1;
      }
      if (nextIndex !== null && enabledItems.length > 0) {
        keyEvent.preventDefault();
        enabledItems[nextIndex].focus();
      }
    });
    listen(document, "pointerdown", (event)=>{
      if (!event.composedPath().includes(element)) setMenuOpen(element, false);
    });
  }
});
const contextMenuPrototype = customElements.get("nala-context-menu").prototype;
Object.defineProperties(contextMenuPrototype, {
  open: {
    get () {
      return this.hasAttribute("open");
    }
  },
  show: {
    value () {
      setMenuOpen(this, true);
    }
  },
  close: {
    value () {
      setMenuOpen(this, false);
      this.shadowRoot?.querySelector(".trigger")?.focus();
    }
  }
});
