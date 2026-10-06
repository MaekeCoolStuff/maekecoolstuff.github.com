import { defineComponent, html } from "../../../components/dist/index.js";
import { baseStyles } from "../shared-styles.js";
defineComponent("nala-card", {
  shadow: true,
  props: {
    variant: "string"
  },
  styles: `${baseStyles}\n${":host {\n  display: block;\n}\n\narticle {\n  overflow: hidden;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-medium, 6px);\n  background: var(--nala-ui-color-surface, #fffefa);\n}\n\narticle.raised {\n  box-shadow: var(--nala-ui-shadow-raised, 0 1.25rem 3.5rem rgba(35, 48, 42, 0.12));\n}\n\narticle.accent {\n  border-top: 0.35rem solid var(--nala-ui-color-accent, #184d3b);\n}\n\nheader {\n  padding: 1.15rem 1.25rem 0;\n}\n\n.eyebrow {\n  margin-bottom: 0.25rem;\n  color: var(--nala-ui-color-accent, #184d3b);\n  font-size: 0.7rem;\n  font-weight: 800;\n  text-transform: uppercase;\n}\n\n.title {\n  color: var(--nala-ui-color-text, #18201d);\n  font-family: var(--nala-ui-font-display, \"Baskerville\", \"Iowan Old Style\", serif);\n  font-size: 1.25rem;\n  font-weight: 600;\n}\n\n.content {\n  padding: 1.15rem 1.25rem;\n  color: var(--nala-ui-color-text-muted, #68716c);\n  line-height: 1.65;\n}\n\nfooter {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.6rem;\n  border-top: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  padding: 0.8rem 1.25rem;\n  background: var(--nala-ui-color-surface-muted, #f7f7f2);\n}\n\nfooter[hidden] {\n  display: none;\n}\n"}`,
  template: (props)=>html`
      <article part="card" class=${props.variant || "outlined"}>
        <header part="header">
          <div class="eyebrow" part="eyebrow"><slot name="eyebrow"></slot></div>
          <div class="title" part="title"><slot name="title"></slot></div>
        </header>
        <div class="content" part="content"><slot></slot></div>
        <footer part="footer"><slot name="actions"></slot></footer>
      </article>
    `,
  onConnect: ({ listen, query })=>{
    const actions = query('slot[name="actions"]');
    const footer = query("footer");
    if (!actions || !footer) return;
    const sync = ()=>{
      footer.hidden = actions.assignedNodes({
        flatten: true
      }).length === 0;
    };
    listen(actions, "slotchange", sync);
    sync();
  }
});
