import { defineComponent, html, when } from "../../../components/dist/index.js";
import { baseStyles } from "../shared-styles.js";
defineComponent("nala-list-item", {
  shadow: true,
  props: {
    image: "string",
    "image-alt": "string"
  },
  styles: `${baseStyles}\n${":host {\n  display: block;\n}\n\n.item {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 1rem;\n  border-bottom: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  padding: 0.9rem 0.25rem;\n}\n\n.item.has-image {\n  grid-template-columns: 4rem minmax(0, 1fr) auto;\n}\n\n.media {\n  width: 4rem;\n  aspect-ratio: 3 / 4;\n  overflow: hidden;\n  margin: 0;\n  border-radius: var(--nala-ui-radius-small, 4px);\n  background: var(--nala-ui-color-surface-muted, #f7f7f2);\n}\n\nimg {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n\n.content {\n  min-width: 0;\n}\n\nh3 {\n  margin: 0;\n  color: var(--nala-ui-color-text, #18201d);\n  font-family: var(--nala-ui-font-display, \"Baskerville\", \"Iowan Old Style\", serif);\n  font-size: 1.15rem;\n  font-weight: 600;\n  line-height: 1.3;\n  overflow-wrap: anywhere;\n}\n\n.description {\n  margin-top: 0.3rem;\n  color: var(--nala-ui-color-text-muted, #68716c);\n  font-size: 0.84rem;\n  line-height: 1.5;\n}\n\n.description[hidden],\n.actions[hidden] {\n  display: none;\n}\n\n.actions {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 0.5rem;\n  min-width: 0;\n}\n\n@media (max-width: 36rem) {\n  .item,\n  .item.has-image {\n    grid-template-columns: 3.5rem minmax(0, 1fr);\n    gap: 0.75rem;\n  }\n\n  .media {\n    width: 3.5rem;\n  }\n\n  .actions {\n    grid-column: 2;\n    justify-content: flex-start;\n    flex-wrap: wrap;\n  }\n}\n"}`,
  template: (props)=>html`
      <article
        class=${props.image ? "item has-image" : "item"}
        part="item"
        role="listitem"
      >
        ${when(Boolean(props.image), ()=>html`
            <figure class="media" part="media">
              <img src=${props.image} alt=${props["image-alt"]} loading="lazy" />
            </figure>
          `)}
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
    if (!descriptionSlot || !actionsSlot || !description || !actions) return;
    const syncSlots = ()=>{
      description.hidden = descriptionSlot.assignedNodes({
        flatten: true
      }).length === 0;
      actions.hidden = actionsSlot.assignedNodes({
        flatten: true
      }).length === 0;
    };
    listen(descriptionSlot, "slotchange", syncSlots);
    listen(actionsSlot, "slotchange", syncSlots);
    syncSlots();
  }
});
defineComponent("nala-list-view", {
  shadow: true,
  props: {
    label: "string"
  },
  styles: `${baseStyles}\n${":host {\n  display: block;\n}\n\n.list {\n  display: grid;\n  gap: 0.25rem;\n  min-width: 0;\n}\n"}`,
  template: (props)=>html`
      <div
        class="list"
        part="list"
        role="list"
        aria-label=${props.label || "Items"}
      >
        <slot></slot>
      </div>
    `
});
