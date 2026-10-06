import { defineComponent, dispatchComponentEvent, html, when } from "../../../components/dist/index.js";
import { baseStyles } from "../shared-styles.js";
defineComponent("nala-dialog", {
  shadow: true,
  props: {
    title: "string",
    description: "string"
  },
  styles: `${baseStyles}\n${"dialog {\n  width: min(36rem, calc(100vw - 2rem));\n  max-width: none;\n  max-height: min(42rem, calc(100dvh - 2rem));\n  overflow: auto;\n  margin: auto;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-medium, 6px);\n  padding: 0;\n  background: var(--nala-ui-color-surface, #fffefa);\n  color: var(--nala-ui-color-text, #18201d);\n  box-shadow: var(--nala-ui-shadow-raised, 0 1.25rem 3.5rem rgba(35, 48, 42, 0.18));\n}\n\ndialog::backdrop {\n  background: rgba(15, 24, 20, 0.55);\n  backdrop-filter: blur(2px);\n}\n\nheader {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 1rem;\n  border-bottom: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  padding: 1.1rem 1.25rem;\n}\n\nh2 {\n  margin: 0;\n  font-family: var(--nala-ui-font-display, \"Baskerville\", \"Iowan Old Style\", serif);\n  font-size: 1.35rem;\n  font-weight: 600;\n  line-height: 1.2;\n}\n\n.close {\n  flex: 0 0 auto;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-small, 4px);\n  padding: 0.35rem 0.6rem;\n  background: var(--nala-ui-color-surface, #fffefa);\n  color: inherit;\n  font: inherit;\n  cursor: pointer;\n}\n\n.close:hover,\n.close:focus-visible {\n  border-color: var(--nala-ui-color-accent, #184d3b);\n  outline: 2px solid var(--nala-ui-color-accent-soft, #d8e8df);\n  outline-offset: 1px;\n}\n\n.content {\n  padding: 1.25rem;\n  line-height: 1.6;\n}\n\n.description {\n  margin: 0 0 1rem;\n  color: var(--nala-ui-color-text-muted, #68716c);\n}\n\nfooter {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.6rem;\n  border-top: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  padding: 0.8rem 1.25rem;\n  background: var(--nala-ui-color-surface-muted, #f7f7f2);\n}\n\nfooter[hidden] {\n  display: none;\n}\n"}`,
  template: (props)=>html`
      <dialog
        part="dialog"
        aria-labelledby="dialog-title"
        aria-describedby=${props.description ? "dialog-description" : null}
      >
        <header part="header">
          <h2 id="dialog-title" part="title">${props.title || "Dialog"}</h2>
          <button class="close" part="close" type="button" aria-label="Close dialog">
            Close
          </button>
        </header>
        <div class="content" part="content">
          ${when(Boolean(props.description), ()=>html`
              <p id="dialog-description" class="description"
                part="description">${props.description}</p>
            `)}
          <slot></slot>
        </div>
        <footer part="footer">
          <slot name="actions"></slot>
        </footer>
      </dialog>
    `,
  onConnect: ({ delegate, element, listen, onCleanup, query })=>{
    const dialog = query("dialog");
    const actions = query('slot[name="actions"]');
    const footer = query("footer");
    if (!dialog || !actions || !footer) return;
    const syncFooter = ()=>{
      footer.hidden = actions.assignedNodes({
        flatten: true
      }).length === 0;
    };
    listen(actions, "slotchange", syncFooter);
    syncFooter();
    delegate("click", "[part=close]", ()=>{
      element.close();
    });
    listen(dialog, "cancel", (event)=>{
      event.preventDefault();
      const canClose = dispatchComponentEvent(element, "cancel", {}, {
        bubbles: true,
        composed: true,
        cancelable: true
      });
      if (canClose) element.close(dialog.returnValue);
    });
    onCleanup(()=>{
      if (dialog.open) dialog.close();
    });
  }
});
const dialogPrototype = customElements.get("nala-dialog").prototype;
Object.defineProperties(dialogPrototype, {
  open: {
    get () {
      return Boolean(this.shadowRoot?.querySelector("dialog")?.open);
    }
  },
  show: {
    value () {
      this.shadowRoot?.querySelector("dialog")?.show();
    }
  },
  showModal: {
    value () {
      this.shadowRoot?.querySelector("dialog")?.showModal();
    }
  },
  close: {
    value (returnValue = "") {
      const dialog = this.shadowRoot?.querySelector("dialog");
      if (!dialog?.open) return;
      dialog.close(returnValue);
      dispatchComponentEvent(this, "close", {
        returnValue: dialog.returnValue
      }, {
        bubbles: true,
        composed: true
      });
    }
  }
});
