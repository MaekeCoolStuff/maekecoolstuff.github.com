import { defineComponent, dispatchComponentEvent, html, render, repeat, when } from "../../../components/dist/index.js";
import "../button/button.js";
import "../slider/slider.js";
import { parsePixelArtData, pixelsToRgba } from "../pixel-art/pixel-art-data.js";
import { baseStyles } from "../shared-styles.js";
import { createSpritesheetData, parseSpritesheetData, spritesheetColumns, spritesheetLayout, spritesheetMaxFrames, spritesheetRgba, spritesheetScale } from "./spritesheet-data.js";
import { createSpritesheetStore } from "./spritesheet-state.js";
const stores = new WeakMap();
const thumbnailData = new WeakMap();
const sheetData = new WeakMap();
function storeOf(element) {
  let store = stores.get(element);
  if (!store) {
    store = createSpritesheetStore();
    stores.set(element, store);
  }
  return store;
}
function paintCanvas(canvas, width, height, pixels) {
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D rendering is unavailable");
  context.putImageData(new ImageData(new Uint8ClampedArray(pixels), width, height), 0, 0);
}
function draw(element, root) {
  const state = storeOf(element).state();
  const sprites = state.frames.map((frame)=>frame.data);
  const layout = spritesheetLayout(sprites, element.columns, element.exportScale);
  const preview = spritesheetLayout(sprites, element.columns);
  render(html`
      <section part="base" aria-label=${element.label}>
        <header class="header" part="header">
          <h2>${element.label}</h2>
          <span part="status" role="status">
            ${sprites.length} frames · ${layout.width} × ${layout.height} PNG px
          </span>
        </header>
        <div class="controls" part="controls">
          <nala-slider class="columns" label=${`Columns: ${element.columns}`}
            min="1" max="32" step="1" .value=${element.columns}
            ?disabled=${element.disabled}></nala-slider>
          <nala-slider class="scale" label=${`PNG scale: ${element.exportScale}×`}
            min="1" max="8" step="1" .value=${element.exportScale}
            ?disabled=${element.disabled}></nala-slider>
        </div>
        <section class="panel" aria-labelledby="picker-heading" part="picker">
          <h3 id="picker-heading">Add from gallery</h3>
          <p>Choose a drawing to append a frame. You can add the same drawing more than once.</p>
          ${when(state.available.length === 0, ()=>html`<p part="empty">No gallery drawings loaded.</p>`, ()=>html`
                <ul class="picker-list">
                  ${repeat(state.available, (item)=>item.id, (item, index)=>html`
                      <li>
                        <button type="button" class="add" part="item"
                          data-index=${index} aria-label=${`Add pixel art ${index + 1} to spritesheet`}
                          ?disabled=${element.disabled || sprites.length >= spritesheetMaxFrames}>
                          <canvas class="thumbnail" part="thumbnail"
                            data-source="available" data-index=${index}
                            aria-hidden="true"></canvas>
                          <span>Pixel art ${index + 1}</span>
                          <small>${item.data.size} × ${item.data.size} px</small>
                        </button>
                      </li>
                    `)}
                </ul>
              `)}
        </section>
        <section class="panel" aria-labelledby="frames-heading" part="frames">
          <h3 id="frames-heading">Frame order</h3>
          ${when(sprites.length === 0, ()=>html`<p part="empty">Add drawings from the gallery to build your spritesheet.</p>`, ()=>html`
                <ol class="frame-list">
                  ${repeat(state.frames, (item)=>item.id, (_item, index)=>html`
                      <li class="frame" part="frame">
                        <canvas class="thumbnail" part="thumbnail"
                          data-source="frames" data-index=${index} aria-hidden="true"></canvas>
                        <div>
                          <strong>Frame ${index + 1}</strong>
                          <small>x ${layout.frames[index].x}, y ${layout.frames[index].y}
                            · ${layout.cellSize} × ${layout.cellSize} PNG px</small>
                          <div class="frame-actions">
                            <button type="button" class="earlier" part="move"
                              data-index=${index} aria-label=${`Move frame ${index + 1} earlier`}
                              ?disabled=${element.disabled || index === 0}>Earlier</button>
                            <button type="button" class="later" part="move"
                              data-index=${index} aria-label=${`Move frame ${index + 1} later`}
                              ?disabled=${element.disabled || index === sprites.length - 1}>Later</button>
                            <button type="button" class="remove" part="remove"
                              data-index=${index} aria-label=${`Remove frame ${index + 1}`}
                              ?disabled=${element.disabled}>Remove</button>
                          </div>
                        </div>
                      </li>
                    `)}
                </ol>
              `)}
        </section>
        <section class="panel" aria-labelledby="preview-heading" part="preview">
          <h3 id="preview-heading">Sheet preview</h3>
          <p>Original-resolution frames, shown at 4× zoom. Transparent cells are not stretched.</p>
          ${when(sprites.length > 0, ()=>html`
              <div class="preview-scroll">
                <canvas class="sheet" part="canvas" role="img"
                  aria-label=${`${element.label}: ${sprites.length} frames in ${preview.columns} columns`}
                  style=${`width: ${preview.width * 4}px; height: ${preview.height * 4}px`}></canvas>
              </div>
            `)}
        </section>
        <div class="actions" part="actions">
          <nala-button class="save-png" exportparts="button:save"
            ?disabled=${sprites.length === 0}>Save PNG</nala-button>
          <nala-button class="save-json" variant="secondary"
            exportparts="button:save-json"
          >Save JSON</nala-button>
          <nala-button class="clear" variant="ghost" exportparts="button:clear"
            ?disabled=${element.disabled || sprites.length === 0}>Clear sheet</nala-button>
        </div>
        <p class="feedback" part="feedback" role="status"></p>
      </section>
    `, root);
  for (const canvas of root.querySelectorAll(".thumbnail")){
    const entries = canvas.dataset.source === "available" ? state.available : state.frames;
    const data = entries[Number(canvas.dataset.index)].data;
    if (thumbnailData.get(canvas) === data && canvas.width === data.size && canvas.height === data.size) continue;
    paintCanvas(canvas, data.size, data.size, pixelsToRgba(data.pixels, data.size));
    thumbnailData.set(canvas, data);
  }
  const canvas = root.querySelector(".sheet");
  if (canvas) {
    const cached = sheetData.get(canvas);
    if (cached?.frames === state.frames && cached.columns === element.columns && canvas.width === preview.width && canvas.height === preview.height) return;
    const { pixels } = spritesheetRgba(sprites, element.columns);
    paintCanvas(canvas, preview.width, preview.height, pixels);
    sheetData.set(canvas, {
      frames: state.frames,
      columns: element.columns
    });
  }
}
function notify(element) {
  dispatchComponentEvent(element, "spritesheet-change", {
    data: element.toJSON()
  }, {
    bubbles: true,
    composed: true
  });
}
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(()=>URL.revokeObjectURL(url), 0);
}
function encode(data) {
  const { layout, pixels } = spritesheetRgba(data.sprites, data.columns, data.exportScale);
  const canvas = document.createElement("canvas");
  paintCanvas(canvas, layout.width, layout.height, pixels);
  return new Promise((resolve, reject)=>{
    canvas.toBlob((blob)=>{
      if (blob) resolve(blob);
      else reject(new Error("Spritesheet could not be encoded as PNG"));
    }, "image/png");
  });
}
defineComponent("nala-spritesheet", {
  shadow: true,
  props: {
    label: {
      type: "string",
      default: "Spritesheet"
    },
    filename: {
      type: "string",
      default: "spritesheet.png"
    },
    disabled: "boolean",
    columns: {
      type: "number",
      default: 4,
      validate: spritesheetColumns
    },
    exportScale: {
      type: "number",
      attribute: "export-scale",
      default: 1,
      validate: spritesheetScale
    }
  },
  styles: `${baseStyles}\n${":host {\n  display: block;\n  min-width: 0;\n}\n\nh2,\nh3,\np {\n  margin: 0;\n}\n\n.header,\n.actions,\n.frame-actions {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.75rem;\n}\n\n.header {\n  justify-content: space-between;\n}\n\nsection[part=\"base\"] {\n  display: grid;\n  gap: 1rem;\n  min-width: 0;\n}\n\n.controls {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));\n  gap: 1rem;\n}\n\n.panel {\n  display: grid;\n  gap: 0.75rem;\n  min-width: 0;\n  padding: 1rem;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-medium, 8px);\n  background: var(--nala-ui-color-surface, #fffefa);\n}\n\n.picker-list {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(min(100%, 6rem), 1fr));\n  gap: 0.75rem;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n\nbutton {\n  font: inherit;\n  color: inherit;\n  cursor: pointer;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-small, 4px);\n  background: var(--nala-ui-color-surface, #fffefa);\n  padding: 0.4rem 0.6rem;\n}\n\n.add {\n  display: grid;\n  gap: 0.5rem;\n  padding: 0.5rem;\n  width: 100%;\n  text-align: start;\n}\n\nsmall,\n.header span,\np {\n  color: var(--nala-ui-color-text-muted, #68716c);\n}\n\nsmall {\n  display: block;\n}\n\ncanvas {\n  image-rendering: pixelated;\n  background: conic-gradient(\n    #e4e6e1 25%, #fbfbf8 0 50%, #e4e6e1 0 75%, #fbfbf8 0\n  ) 0 0 / 16px 16px;\n}\n\n.thumbnail {\n  width: 100%;\n  height: auto;\n  aspect-ratio: 1;\n}\n\n.frame-list {\n  display: grid;\n  gap: 0.75rem;\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n\n.frame {\n  display: grid;\n  grid-template-columns: 3rem minmax(0, 1fr);\n  align-items: start;\n  gap: 0.75rem;\n}\n\n.frame-actions {\n  margin-top: 0.5rem;\n  gap: 0.4rem;\n}\n\n.remove {\n  color: var(--nala-ui-color-danger, #a43f35);\n}\n\n.preview-scroll {\n  min-width: 0;\n  max-height: 24rem;\n  overflow: auto;\n  padding: 0.25rem;\n}\n\n.sheet {\n  display: block;\n}\n\nbutton:focus-visible {\n  outline: 3px solid var(--nala-ui-color-accent, #184d3b);\n  outline-offset: 2px;\n}\n\nbutton:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n"}`,
  template: ()=>html`<div class="content"></div>`,
  onAfterRender: ({ element, query })=>{
    const root = query(".content");
    if (!root) throw new Error("Spritesheet content is missing");
    draw(element, root);
  },
  onConnect: ({ element, query, delegate, effect, onCleanup })=>{
    const sheet = element;
    const store = storeOf(sheet);
    for (const name of [
      "items",
      "sprites"
    ]){
      if (!Object.hasOwn(sheet, name)) continue;
      const value = Reflect.get(sheet, name);
      Reflect.deleteProperty(sheet, name);
      if (name === "items") store.actions.loadAvailable(value);
      else store.actions.loadFrames(value);
    }
    const root = query(".content");
    if (!root) throw new Error("Spritesheet content is missing");
    effect(()=>draw(sheet, root));
    const feedback = (message)=>{
      const node = root.querySelector(".feedback");
      if (!node) throw new Error("Spritesheet feedback is missing");
      node.textContent = message;
    };
    const focusAfterChange = (selector)=>{
      const target = root.querySelector(selector);
      if (!target) throw new Error("Spritesheet focus target is missing");
      target.focus();
    };
    delegate("click", ".add", (_event, target)=>{
      if (sheet.disabled || store.state().frames.length >= spritesheetMaxFrames) return;
      store.actions.add(Number(target.dataset.index));
      feedback(`Added frame ${store.state().frames.length}.`);
      notify(sheet);
    });
    delegate("click", ".remove", (_event, target)=>{
      if (sheet.disabled) return;
      const index = Number(target.dataset.index);
      store.actions.remove(index);
      const next = Math.min(index, store.state().frames.length - 1);
      if (next >= 0) focusAfterChange(`.remove[data-index="${next}"]`);
      else {
        const heading = root.querySelector("#frames-heading");
        if (!heading) throw new Error("Spritesheet frame heading is missing");
        heading.tabIndex = -1;
        heading.focus();
      }
      feedback(`Removed frame ${index + 1}.`);
      notify(sheet);
    });
    delegate("click", ".earlier, .later", (_event, target)=>{
      if (sheet.disabled || target.disabled) return;
      const index = Number(target.dataset.index);
      const destination = index + (target.classList.contains("earlier") ? -1 : 1);
      store.actions.move(index, destination);
      focusAfterChange(`.remove[data-index="${destination}"]`);
      feedback(`Moved frame ${index + 1} to position ${destination + 1}.`);
      notify(sheet);
    });
    delegate("input", ".columns, .scale", (event, target)=>{
      event.stopPropagation();
      if (sheet.disabled) return;
      const value = event.detail.value;
      if (target.classList.contains("columns")) sheet.columns = value;
      else sheet.exportScale = value;
      notify(sheet);
    });
    delegate("change", "nala-slider", (event)=>event.stopPropagation());
    delegate("click", ".clear", ()=>{
      if (sheet.disabled || store.state().frames.length === 0) return;
      store.actions.clear();
      feedback("Cleared the sheet. Gallery drawings are unchanged.");
      notify(sheet);
    });
    let connected = true;
    let saving = false;
    onCleanup(()=>{
      connected = false;
    });
    delegate("click", ".save-png", ()=>{
      if (saving || store.state().frames.length === 0) return;
      saving = true;
      const button = root.querySelector(".save-png");
      if (!button) throw new Error("Spritesheet PNG button is missing");
      button.disabled = true;
      feedback("Encoding PNG...");
      sheet.save().then(()=>{
        if (connected) feedback("PNG encoded successfully.");
      }).catch((error)=>{
        if (connected) {
          feedback(`Could not save PNG: ${error instanceof Error ? error.message : String(error)}`);
        } else console.error("Could not save spritesheet PNG", error);
      }).finally(()=>{
        saving = false;
        if (connected) button.disabled = store.state().frames.length === 0;
      });
    });
    delegate("click", ".save-json", ()=>{
      sheet.saveJSON();
      feedback("Exported spritesheet JSON.");
    });
  }
});
Object.defineProperties(customElements.get("nala-spritesheet").prototype, {
  items: {
    get () {
      return storeOf(this).state().available.map((item)=>parsePixelArtData(item.data));
    },
    set (value) {
      storeOf(this).actions.loadAvailable(value);
    }
  },
  sprites: {
    get () {
      return storeOf(this).state().frames.map((frame)=>parsePixelArtData(frame.data));
    },
    set (value) {
      storeOf(this).actions.loadFrames(value);
    }
  },
  toJSON: {
    value () {
      return createSpritesheetData(this.sprites, this.columns, this.exportScale);
    }
  },
  fromJSON: {
    value (value) {
      const data = parseSpritesheetData(value);
      this.columns = data.columns;
      this.exportScale = data.exportScale;
      storeOf(this).actions.loadFrames(data.sprites);
    }
  },
  toBlob: {
    async value () {
      return await encode(this.toJSON());
    }
  },
  save: {
    async value () {
      const data = this.toJSON();
      const filename = this.filename || "spritesheet.png";
      const blob = await encode(data);
      const shouldDownload = dispatchComponentEvent(this, "spritesheet-save", {
        blob,
        data,
        filename
      }, {
        bubbles: true,
        composed: true,
        cancelable: true
      });
      if (shouldDownload) downloadBlob(blob, filename);
      return blob;
    }
  },
  saveJSON: {
    value () {
      const data = this.toJSON();
      const json = JSON.stringify(data, null, 2);
      const filename = `${(this.filename || "spritesheet.png").replace(/\.png$/i, "")}.json`;
      const shouldDownload = dispatchComponentEvent(this, "spritesheet-json-save", {
        data,
        json,
        filename
      }, {
        bubbles: true,
        composed: true,
        cancelable: true
      });
      if (shouldDownload) {
        downloadBlob(new Blob([
          json
        ], {
          type: "application/json"
        }), filename);
      }
      return data;
    }
  }
});
