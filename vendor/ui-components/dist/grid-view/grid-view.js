import { defineComponent, html, when } from "../../../components/dist/index.js";
import { baseStyles } from "../shared-styles.js";
defineComponent("nala-grid-item", {
  shadow: true,
  props: {
    image: "string",
    "image-alt": "string",
    layout: "string"
  },
  styles: `${baseStyles}\n${":host {\n  display: block;\n  min-width: 0;\n}\n\n.tile {\n  display: grid;\n  grid-template-rows: auto auto auto;\n  align-content: start;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-medium, 6px);\n  background: var(--nala-ui-color-surface, #fffefa);\n}\n\n.media {\n  width: var(--nala-grid-item-media-width, min(100%, 12rem));\n  aspect-ratio: var(--nala-grid-item-media-ratio, 2 / 3);\n  justify-self: center;\n  overflow: hidden;\n  margin: 0;\n  padding-top: var(--nala-grid-item-media-padding, 0.75rem);\n  border-radius: var(--nala-ui-radius-medium, 6px)\n    var(--nala-ui-radius-medium, 6px) 0 0;\n  background: var(--nala-ui-color-surface-muted, #f7f7f2);\n}\n\n.media[hidden] {\n  display: none;\n}\n\nimg {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: var(--nala-grid-item-image-fit, contain);\n  background: var(--nala-ui-color-surface-muted, #f7f7f2);\n}\n\n.tile.square {\n  position: relative;\n  grid-template-rows: minmax(0, 1fr) auto;\n  align-content: stretch;\n  aspect-ratio: 1;\n}\n\n.tile.square .media {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  aspect-ratio: auto;\n  padding: 0;\n  border-radius: inherit;\n}\n\n.tile.square img {\n  object-fit: cover;\n}\n\n.tile.square .content {\n  position: relative;\n  z-index: 1;\n  align-self: end;\n  margin: 0 0.65rem 0.65rem;\n  border-radius: var(--nala-ui-radius-small, 4px);\n  padding: 0.65rem 0.75rem;\n  background: var(--nala-ui-color-surface, #fffefa);\n}\n\n.tile.square.has-actions .content {\n  padding-bottom: 3.1rem;\n}\n\n.tile.square .description {\n  display: -webkit-box;\n  overflow: hidden;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n}\n\n.tile.square .actions {\n  position: absolute;\n  z-index: 2;\n  right: 1.4rem;\n  bottom: 0.85rem;\n  left: 1.4rem;\n  justify-content: flex-end;\n  padding: 0;\n  background: transparent;\n}\n\n.content {\n  min-width: 0;\n  padding: 0.9rem 1rem;\n}\n\nh3 {\n  margin: 0;\n  color: var(--nala-ui-color-text, #18201d);\n  font-family: var(--nala-ui-font-display, \"Baskerville\", \"Iowan Old Style\", serif);\n  font-size: 1.1rem;\n  font-weight: 600;\n  line-height: 1.3;\n  overflow-wrap: anywhere;\n}\n\n.description {\n  margin-top: 0.35rem;\n  color: var(--nala-ui-color-text-muted, #68716c);\n  font-size: 0.82rem;\n  line-height: 1.5;\n}\n\n.description[hidden],\n.actions[hidden] {\n  display: none;\n}\n\n.actions {\n  display: flex;\n  min-width: 0;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0 0.9rem 0.9rem;\n}\n\n.actions ::slotted(nala-context-menu) {\n  margin-left: auto;\n}\n\n.tile.has-image .actions {\n  border-top: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  padding: 0.7rem 0.9rem;\n  background: var(--nala-ui-color-surface-muted, #f7f7f2);\n}\n"}`,
  template: (props)=>html`
      <article
        class=${`tile${props.image ? " has-image" : ""}${props.layout === "square" ? " square" : ""}`}
        part="item"
        role="listitem"
      >
        <figure class="media" part="media" ?hidden=${!props.image}>
          ${when(Boolean(props.image), ()=>html`
              <img src=${props.image} alt=${props["image-alt"]} loading="lazy" />
            `)}
        </figure>
        <div class="content" part="content">
          <h3 part="title"><slot name="title">Untitled game</slot></h3>
          <div class="description" part="description">
            <slot name="description"></slot>
          </div>
        </div>
        <div class="actions" part="actions">
          <slot name="actions"></slot>
        </div>
      </article>
    `,
  onConnect: ({ listen, query })=>{
    const descriptionSlot = query('slot[name="description"]');
    const actionsSlot = query('slot[name="actions"]');
    const description = query(".description");
    const actions = query(".actions");
    const tile = query(".tile");
    if (!descriptionSlot || !actionsSlot || !description || !actions || !tile) return;
    const syncSlots = ()=>{
      description.hidden = descriptionSlot.assignedNodes({
        flatten: true
      }).length === 0;
      const hasActions = actionsSlot.assignedNodes({
        flatten: true
      }).length > 0;
      actions.hidden = !hasActions;
      tile.classList.toggle("has-actions", hasActions);
    };
    listen(descriptionSlot, "slotchange", syncSlots);
    listen(actionsSlot, "slotchange", syncSlots);
    syncSlots();
  }
});
function syncItemLayout(element, root) {
  const slot = root.querySelector("slot");
  if (!slot) return;
  const layout = element.getAttribute("layout") === "square" ? "square" : "";
  slot.assignedElements({
    flatten: true
  }).forEach((item)=>{
    if (item.localName !== "nala-grid-item") return;
    if (item.getAttribute("layout") !== layout) {
      if (layout) item.setAttribute("layout", layout);
      else item.removeAttribute("layout");
    }
  });
}
defineComponent("nala-grid-view", {
  shadow: true,
  props: {
    label: "string",
    layout: "string"
  },
  styles: `${baseStyles}\n${":host {\n  display: block;\n}\n\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr));\n  align-items: stretch;\n  gap: 1rem;\n  min-width: 0;\n}\n\n.grid.masonry {\n  display: block;\n  column-width: 14rem;\n  column-gap: 1rem;\n}\n\n.grid.masonry slot {\n  display: block;\n}\n\n.grid.masonry slot::slotted(nala-grid-item) {\n  display: inline-block;\n  width: 100%;\n  margin-bottom: 1rem;\n  break-inside: avoid;\n  vertical-align: top;\n}\n"}`,
  template: (props)=>html`
      <div
        class=${props.layout === "square" ? "grid square" : props.layout === "masonry" ? "grid masonry" : "grid"}
        part="grid"
        role="list"
        aria-label=${props.label || "Items"}
      >
        <slot></slot>
      </div>
    `,
  onAfterRender: ({ element, root })=>syncItemLayout(element, root),
  onConnect: ({ element, listen, query, root })=>{
    const slot = query("slot");
    if (!slot) return;
    listen(slot, "slotchange", ()=>syncItemLayout(element, root));
    syncItemLayout(element, root);
  }
});
