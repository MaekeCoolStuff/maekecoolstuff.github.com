import { defineComponent, html } from "../../../components/dist/index.js";
let nextTabsId = 0;
function tabButtons(root) {
  const slot = root.querySelector('slot[name="tab"]');
  return slot?.assignedElements({
    flatten: true
  }).filter((element)=>element instanceof HTMLButtonElement) ?? [];
}
function tabPanels(root) {
  const slot = root.querySelector('slot[name="panel"]');
  return slot?.assignedElements({
    flatten: true
  }).filter((element)=>element instanceof HTMLElement) ?? [];
}
function syncTabs(element, root) {
  const buttons = tabButtons(root);
  const panels = tabPanels(root);
  const enabled = buttons.map((button, index)=>button.disabled ? -1 : index).filter((index)=>index >= 0);
  const requested = Number.isInteger(element.selected) ? element.selected : 0;
  const selected = enabled.includes(requested) ? requested : enabled[0] ?? 0;
  const groupId = element.id || `nala-tabs-${++nextTabsId}`;
  if (!element.id) element.id = groupId;
  buttons.forEach((button, index)=>{
    button.type = "button";
    button.id ||= `${groupId}-tab-${index}`;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(index === selected));
    button.tabIndex = index === selected ? 0 : -1;
    const panel = panels[index];
    if (panel) {
      panel.id ||= `${groupId}-panel-${index}`;
      button.setAttribute("aria-controls", panel.id);
      button.removeAttribute("aria-disabled");
    } else {
      button.removeAttribute("aria-controls");
      button.setAttribute("aria-disabled", "true");
    }
  });
  panels.forEach((panel, index)=>{
    panel.setAttribute("role", "tabpanel");
    panel.tabIndex = 0;
    panel.hidden = index !== selected || index >= buttons.length;
    const button = buttons[index];
    if (button) panel.setAttribute("aria-labelledby", button.id);
    else panel.removeAttribute("aria-labelledby");
  });
}
function selectTab(element, index) {
  if (element.selected === index) return;
  element.selected = index;
  element.dispatchEvent(new CustomEvent("change", {
    detail: {
      value: index
    },
    bubbles: true,
    composed: true
  }));
}
defineComponent("nala-tabs", {
  shadow: true,
  props: {
    label: "string",
    orientation: "string",
    selected: "number"
  },
  styles: ":host {\n  display: block;\n  color: var(--nala-ui-color-text, #18201d);\n}\n\n.tablist {\n  display: flex;\n  gap: 0.25rem;\n  overflow-x: auto;\n  border-bottom: 1px solid var(--nala-ui-color-border, #cbcfc8);\n}\n\n.tabs.vertical {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);\n}\n\n.tabs.vertical .tablist {\n  flex-direction: column;\n  overflow-x: hidden;\n  overflow-y: auto;\n  border-right: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-bottom: 0;\n}\n\n::slotted(button[slot=\"tab\"]) {\n  flex: 0 0 auto;\n  border: 0;\n  border-bottom: 3px solid transparent;\n  padding: 0.7rem 0.9rem calc(0.7rem - 3px);\n  background: transparent;\n  color: var(--nala-ui-color-text-muted, #68716c);\n  font: inherit;\n  cursor: pointer;\n}\n\n::slotted(button[slot=\"tab\"][aria-selected=\"true\"]) {\n  border-bottom-color: var(--nala-ui-color-accent, #184d3b);\n  color: var(--nala-ui-color-text, #18201d);\n  font-weight: 700;\n}\n\n.tabs.vertical ::slotted(button[slot=\"tab\"]) {\n  box-sizing: border-box;\n  width: 100%;\n  flex: 0 0 auto;\n  border-right: 3px solid transparent;\n  border-bottom: 0;\n  padding: 0.7rem calc(0.9rem - 3px) 0.7rem 0.9rem;\n  text-align: left;\n  white-space: normal;\n}\n\n.tabs.vertical ::slotted(button[slot=\"tab\"][aria-selected=\"true\"]) {\n  border-right-color: var(--nala-ui-color-accent, #184d3b);\n  border-bottom-color: transparent;\n}\n\n::slotted(button[slot=\"tab\"]:disabled) {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n\n::slotted(button[slot=\"tab\"]:focus-visible) {\n  outline: 2px solid var(--nala-ui-color-accent, #184d3b);\n  outline-offset: -2px;\n}\n\n::slotted([slot=\"panel\"]) {\n  padding: 1rem 0;\n}\n\n::slotted([slot=\"panel\"][hidden]) {\n  display: none !important;\n}\n",
  template: (props)=>html`
    <div class=${props.orientation === "vertical" ? "tabs vertical" : "tabs"}>
      <div class="tablist" part="tablist" role="tablist"
        aria-orientation=${props.orientation === "vertical" ? "vertical" : "horizontal"}
        aria-label=${props.label || "Tabs"}>
        <slot name="tab"></slot>
      </div>
      <div class="panels"><slot name="panel"></slot></div>
    </div>
  `,
  onAfterRender: ({ element, root })=>syncTabs(element, root),
  onConnect: ({ element, root, listen, delegate })=>{
    const tabsElement = element;
    const tabSlot = root.querySelector('slot[name="tab"]');
    const panelSlot = root.querySelector('slot[name="panel"]');
    const sync = ()=>syncTabs(tabsElement, root);
    if (tabSlot) listen(tabSlot, "slotchange", sync);
    if (panelSlot) listen(panelSlot, "slotchange", sync);
    delegate("click", 'button[slot="tab"]', (_event, target)=>{
      const index = tabButtons(root).indexOf(target);
      if (index >= 0 && tabsElement.selected !== index) {
        selectTab(tabsElement, index);
      }
    });
    delegate("keydown", 'button[slot="tab"]', (event, target)=>{
      const buttons = tabButtons(root);
      const current = buttons.indexOf(target);
      if (current < 0) return;
      const key = event.key;
      const vertical = tabsElement.getAttribute("orientation") === "vertical";
      const forwardKey = vertical ? "ArrowDown" : "ArrowRight";
      const backwardKey = vertical ? "ArrowUp" : "ArrowLeft";
      let next = current;
      if (key === "Home") {
        next = buttons.findIndex((button)=>!button.disabled);
      } else if (key === "End") {
        next = buttons.findLastIndex((button)=>!button.disabled);
      } else if (key === forwardKey || key === backwardKey) {
        const direction = key === forwardKey ? 1 : -1;
        for(let offset = 1; offset <= buttons.length; offset++){
          const candidate = (current + direction * offset + buttons.length) % buttons.length;
          if (!buttons[candidate].disabled) {
            next = candidate;
            break;
          }
        }
      } else {
        return;
      }
      if (next < 0 || buttons[next].disabled) return;
      event.preventDefault();
      if (next !== current) selectTab(tabsElement, next);
      buttons[next].focus();
    });
    if (!tabsElement.hasAttribute("selected")) tabsElement.selected = 0;
    sync();
  }
});
