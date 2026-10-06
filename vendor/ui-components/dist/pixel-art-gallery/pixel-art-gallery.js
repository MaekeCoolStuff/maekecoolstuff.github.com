import { defineComponent, dispatchComponentEvent, html, render, repeat, when } from "../../../components/dist/index.js";
import "../button/button.js";
import "../pixel-art/pixel-art.js";
import { parsePixelArtData, pixelsToRgba } from "../pixel-art/pixel-art-data.js";
import { baseStyles } from "../shared-styles.js";
import { validatePreviewSize } from "./pixel-art-gallery-size.js";
import { createPixelArtGalleryStore } from "./pixel-art-gallery-state.js";
const stores = new WeakMap();
const loadedEditors = new WeakMap();
const paintedPreviews = new WeakMap();
function storeOf(element) {
  let store = stores.get(element);
  if (!store) {
    store = createPixelArtGalleryStore();
    stores.set(element, store);
  }
  return store;
}
function draw(element, root, state) {
  const draft = state.draft;
  render(html`
      <section part="base" aria-label=${element.label}
        data-preview-size=${element.previewSize}>
        <header class="header" part="header">
          <h2 tabindex="-1">${element.label}</h2>
          <span class="count" part="status" role="status">
            ${state.entries.length} saved
          </span>
        </header>
        ${when(draft !== null, ()=>html`
              <div part="editor" class="editor">
                <h3 tabindex="-1" class="editor-heading">
                  ${draft?.isNew ? "New pixel art" : `Edit pixel art ${state.entries.findIndex((entry)=>entry.id === draft?.id) + 1}`}
                </h3>
                <nala-pixel-art
                  .label=${`${element.label} drawing canvas`}
                  .disabled=${element.disabled}
                ></nala-pixel-art>
                <div class="actions" part="actions">
                  <nala-button class="save" ?disabled=${element.disabled}
                    exportparts="button:save">Save to gallery</nala-button>
                  <nala-button class="cancel" variant="ghost"
                    exportparts="button:cancel">Cancel</nala-button>
                </div>
              </div>
            `, ()=>html`
              <div class="actions" part="actions">
                <nala-button class="new" ?disabled=${element.disabled}
                  exportparts="button:new">New pixel art</nala-button>
              </div>
              ${when(state.entries.length === 0, ()=>html`
                    <p class="empty" part="empty">
                      No saved pixel art yet. Create a drawing to start your gallery.
                    </p>
                  `, ()=>html`
                    <ul class="gallery" part="gallery">
                      ${repeat(state.entries, (entry)=>entry.id, (entry, index)=>html`
                            <li class="card" part="card">
                              <button class="edit" part="item" type="button"
                                data-index=${index}
                                aria-label=${`Edit pixel art ${index + 1}`}
                                ?disabled=${element.disabled}>
                                <canvas part="preview" data-index=${index}
                                  aria-hidden="true"></canvas>
                                <span class="item-label">Pixel art ${index + 1}</span>
                                <span class="dimensions">
                                  ${entry.data.size} × ${entry.data.size} px
                                </span>
                              </button>
                              <button class="delete" part="delete" type="button"
                                data-index=${index}
                                aria-label=${`Delete pixel art ${index + 1}`}
                                ?disabled=${element.disabled}>Delete</button>
                            </li>
                          `)}
                    </ul>
                  `)}
            `)}
      </section>
    `, root);
  const editor = root.querySelector("nala-pixel-art");
  if (editor && draft && loadedEditors.get(editor) !== draft.data) {
    editor.fromJSON(draft.data);
    loadedEditors.set(editor, draft.data);
  }
  for (const canvas of root.querySelectorAll("canvas")){
    const data = state.entries[Number(canvas.dataset.index)].data;
    const resized = canvas.width !== data.size || canvas.height !== data.size;
    if (!resized && paintedPreviews.get(canvas) === data) continue;
    // Setting either canvas dimension clears its bitmap, even to the same value.
    if (canvas.width !== data.size) canvas.width = data.size;
    if (canvas.height !== data.size) canvas.height = data.size;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D rendering is unavailable");
    context.putImageData(new ImageData(new Uint8ClampedArray(pixelsToRgba(data.pixels, data.size)), data.size), 0, 0);
    paintedPreviews.set(canvas, data);
  }
}
function focusButton(root, selector) {
  const target = root.querySelector(selector);
  if (!target) throw new Error("Pixel art gallery focus target is missing");
  if (target.localName === "nala-button") {
    const button = target.shadowRoot?.querySelector("button");
    if (!button) throw new Error("Pixel art gallery button is missing");
    if (button.disabled) root.querySelector("h2")?.focus();
    else button.focus();
  } else if (target instanceof HTMLButtonElement && target.disabled) {
    root.querySelector("h2")?.focus();
  } else {
    target.focus();
  }
}
function notify(element, action, index) {
  dispatchComponentEvent(element, "gallery-change", {
    items: element.toJSON(),
    action,
    index
  }, {
    bubbles: true,
    composed: true
  });
}
defineComponent("nala-pixel-art-gallery", {
  shadow: true,
  props: {
    label: {
      type: "string",
      default: "Pixel art gallery"
    },
    previewSize: {
      type: "string",
      attribute: "preview-size",
      default: "small",
      validate: validatePreviewSize
    },
    disabled: "boolean"
  },
  styles: `${baseStyles}\n${":host {\n  display: block;\n  min-width: 0;\n}\n\n.header,\n.actions {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.75rem;\n  margin-bottom: 1rem;\n}\n\n.header {\n  justify-content: space-between;\n}\n\nh2,\nh3 {\n  margin: 0;\n}\n\n.count,\n.dimensions,\n.empty {\n  color: var(--nala-ui-color-text-muted, #68716c);\n}\n\n.gallery {\n  display: grid;\n  grid-template-columns: repeat(\n    auto-fill,\n    minmax(min(100%, var(--gallery-card-size, 10rem)), 1fr)\n  );\n  gap: 1rem;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n\n[data-preview-size=\"medium\"] {\n  --gallery-card-size: 8rem;\n  --gallery-card-padding: 0.75rem;\n}\n\n[data-preview-size=\"small\"] {\n  --gallery-card-size: 6rem;\n  --gallery-card-padding: 0.5rem;\n}\n\n.card {\n  display: grid;\n  min-width: 0;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-medium, 8px);\n  background: var(--nala-ui-color-surface, #fffefa);\n  overflow: hidden;\n}\n\n.edit,\n.delete {\n  color: inherit;\n  font: inherit;\n  cursor: pointer;\n}\n\n.edit {\n  display: grid;\n  gap: 0.5rem;\n  width: 100%;\n  border: 0;\n  padding: var(--gallery-card-padding, 1rem);\n  background: transparent;\n  text-align: start;\n}\n\ncanvas {\n  width: 100%;\n  height: auto;\n  aspect-ratio: 1;\n  image-rendering: pixelated;\n  background: conic-gradient(\n    #e4e6e1 25%,\n    #fbfbf8 0 50%,\n    #e4e6e1 0 75%,\n    #fbfbf8 0\n  ) 0 0 / 16px 16px;\n}\n\n.item-label {\n  font-weight: 600;\n}\n\n.dimensions {\n  font-size: 0.85rem;\n}\n\n.delete {\n  border: 0;\n  border-top: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  padding: 0.65rem 1rem;\n  background: transparent;\n  color: var(--nala-ui-color-danger, #a43f35);\n  text-align: start;\n}\n\n.edit:hover,\n.delete:hover {\n  background: color-mix(\n    in srgb,\n    var(--nala-ui-color-border, #cbcfc8) 20%,\n    transparent\n  );\n}\n\n.edit:focus-visible,\n.delete:focus-visible {\n  outline: 3px solid var(--nala-ui-color-accent, #184d3b);\n  outline-offset: -3px;\n}\n\nbutton:disabled {\n  cursor: not-allowed;\n  opacity: 0.5;\n}\n\n.editor {\n  display: grid;\n  gap: 1rem;\n  min-width: 0;\n}\n\n.editor .actions {\n  margin-bottom: 0;\n}\n"}`,
  template: ()=>html`<div class="content"></div>`,
  onAfterRender: ({ element, query })=>{
    const root = query(".content");
    if (!root) throw new Error("Pixel art gallery content is missing");
    draw(element, root, storeOf(element).state());
  },
  onConnect: ({ element, query, delegate, effect })=>{
    const gallery = element;
    // Replay property assignments made before custom-element registration.
    if (Object.hasOwn(gallery, "items")) {
      const items = Reflect.get(gallery, "items");
      Reflect.deleteProperty(gallery, "items");
      storeOf(gallery).actions.load(items);
    }
    const root = query(".content");
    if (!root) throw new Error("Pixel art gallery content is missing");
    const store = storeOf(gallery);
    effect(()=>draw(gallery, root, store.state()));
    delegate("click", ".new", ()=>{
      if (gallery.disabled) return;
      store.actions.create();
      focusButton(root, ".editor-heading");
    });
    delegate("click", ".edit", (_event, target)=>{
      if (gallery.disabled) return;
      store.actions.edit(Number(target.dataset.index));
      focusButton(root, ".editor-heading");
    });
    delegate("click", ".save", ()=>{
      if (gallery.disabled) return;
      const editor = root.querySelector("nala-pixel-art");
      const state = store.state();
      if (!editor || !state.draft) {
        throw new Error("Pixel art gallery has no editor or active draft");
      }
      const action = state.draft.isNew ? "create" : "update";
      const index = state.draft.isNew ? state.entries.length : state.entries.findIndex((entry)=>entry.id === state.draft?.id);
      store.actions.save(editor.toJSON());
      focusButton(root, `.edit[data-index="${index}"]`);
      notify(gallery, action, index);
    });
    delegate("click", ".cancel", ()=>{
      const state = store.state();
      const index = state.entries.findIndex((entry)=>entry.id === state.draft?.id);
      store.actions.cancel();
      focusButton(root, index < 0 ? ".new" : `.edit[data-index="${index}"]`);
    });
    delegate("click", ".delete", (_event, target)=>{
      if (gallery.disabled) return;
      const index = Number(target.dataset.index);
      store.actions.remove(index);
      const nextIndex = Math.min(index, store.state().entries.length - 1);
      focusButton(root, nextIndex < 0 ? ".new" : `.edit[data-index="${nextIndex}"]`);
      notify(gallery, "delete", index);
    });
  },
  onDisconnect: ({ element, query })=>{
    const editor = query("nala-pixel-art");
    if (editor) storeOf(element).actions.captureDraft(editor.toJSON());
  }
});
Object.defineProperties(customElements.get("nala-pixel-art-gallery").prototype, {
  items: {
    get () {
      return this.toJSON();
    },
    set (value) {
      storeOf(this).actions.load(value);
    }
  },
  toJSON: {
    value () {
      return storeOf(this).state().entries.map((entry)=>parsePixelArtData(entry.data));
    }
  },
  fromJSON: {
    value (value) {
      storeOf(this).actions.load(value);
    }
  }
});
