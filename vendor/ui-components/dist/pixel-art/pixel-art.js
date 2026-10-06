import { defineComponent, dispatchComponentEvent, html, repeat } from "../../../components/dist/index.js";
import "../button/button.js";
import "../color-picker/color-picker.js";
import "../slider/slider.js";
import { baseStyles } from "../shared-styles.js";
import { colorValue } from "../color-picker/color-value.js";
import { addPaletteColor, fitPixels, paintPixel, parsePixelArtData, pixelArtExportScale, pixelArtMaxPreviewScale, pixelArtMaxSize, pixelArtMinSize, pixelArtPreviewScale, pixelArtSize, pixelsToRgba, pushRecentColor, resizePixels, validateColors, validatePixels } from "./pixel-art-data.js";
const activePixels = new WeakMap();
function range(length) {
  return Array.from({
    length
  }, (_, index)=>index);
}
function pixelLabel(x, y, pixel) {
  return `Pixel ${x + 1}, ${y + 1}: ${pixel ?? "transparent"}`;
}
function changePixels(element, pixels) {
  element.pixels = pixels;
  dispatchComponentEvent(element, "pixel-change", {
    pixels: element.pixels
  }, {
    bubbles: true,
    composed: true
  });
}
function swatches(colors, current, disabled, kind) {
  return repeat(colors, (color)=>color, (color)=>html`
      <button
        class="swatch"
        part=${`swatch ${kind}-swatch`}
        type="button"
        data-color=${color}
        title=${color}
        aria-label=${`Use color ${color}`}
        aria-pressed=${String(color === current)}
        style=${`background: ${color}`}
        ?disabled=${disabled}
      ></button>
    `);
}
defineComponent("nala-pixel-art", {
  shadow: true,
  props: {
    size: {
      type: "number",
      default: 16,
      validate: pixelArtSize
    },
    color: {
      type: "string",
      default: "#000000",
      validate: colorValue
    },
    label: {
      type: "string",
      default: "Pixel art canvas"
    },
    filename: {
      type: "string",
      default: "pixel-art.png"
    },
    exportScale: {
      type: "number",
      attribute: "export-scale",
      default: 1,
      validate: pixelArtExportScale
    },
    previewScale: {
      type: "number",
      attribute: "preview-scale",
      default: 4,
      validate: pixelArtPreviewScale
    },
    disabled: "boolean"
  },
  properties: {
    pixels: {
      default: ()=>[],
      validate: validatePixels
    },
    palette: {
      default: ()=>[],
      validate: validateColors
    },
    recentColors: {
      default: ()=>[],
      validate: validateColors
    }
  },
  styles: `${baseStyles}\n${":host {\n  display: block;\n  container-type: inline-size;\n  max-width: 60rem;\n  min-width: 0;\n}\n\n.pixel-art {\n  display: grid;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-medium, 8px);\n  background: var(--nala-ui-color-surface, #fffefa);\n  overflow: hidden;\n}\n\n.workspace {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr);\n}\n\n.stage {\n  display: grid;\n  place-items: center;\n  min-width: 0;\n  padding: 1rem;\n  background: color-mix(\n    in srgb,\n    var(--nala-ui-color-border, #cbcfc8) 25%,\n    transparent\n  );\n}\n\n.stage .canvas {\n  max-width: 36rem;\n  background: var(--nala-ui-color-surface, #fffefa);\n}\n\n.inspector {\n  display: grid;\n  align-content: start;\n  min-width: 0;\n  border-top: 1px solid var(--nala-ui-color-border, #cbcfc8);\n}\n\n.panel {\n  display: grid;\n  gap: 0.75rem;\n  min-width: 0;\n  padding: 1rem;\n}\n\n.panel + .panel {\n  border-top: 1px solid var(--nala-ui-color-border, #cbcfc8);\n}\n\n.panel-title {\n  margin: 0;\n  color: var(--nala-ui-color-text-muted, #68716c);\n  font-size: 0.75rem;\n  font-weight: 700;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n}\n\n.footer {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.75rem;\n  padding: 0.75rem 1rem;\n  border-top: 1px solid var(--nala-ui-color-border, #cbcfc8);\n}\n\n.status {\n  color: var(--nala-ui-color-text-muted, #68716c);\n  font-size: 0.85rem;\n  font-variant-numeric: tabular-nums;\n}\n\n.buttons {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n  margin-inline-start: auto;\n}\n\n@container (min-width: 40rem) {\n  .workspace {\n    grid-template-columns: minmax(0, 1fr) 17rem;\n  }\n\n  .inspector {\n    border-top: 0;\n    border-inline-start: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  }\n}\n\n.canvas {\n  display: grid;\n  grid-template-columns: repeat(var(--pixel-art-size, 16), minmax(0, 1fr));\n  width: 100%;\n  aspect-ratio: 1;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-small, 4px);\n  overflow: hidden;\n  touch-action: none;\n  user-select: none;\n  -webkit-user-select: none;\n}\n\n.row {\n  display: contents;\n}\n\n.pixel {\n  position: relative;\n  min-width: 0;\n  background: conic-gradient(\n    #e4e6e1 25%,\n    #fbfbf8 0 50%,\n    #e4e6e1 0 75%,\n    #fbfbf8 0\n  )\n    0 0 / 50% 50%;\n  box-shadow: inset 0 0 0 0.5px rgb(24 32 29 / 0.12);\n  cursor: crosshair;\n}\n\n.pixel:focus-visible {\n  z-index: 1;\n  outline: 3px solid var(--nala-ui-color-accent, #184d3b);\n  outline-offset: -3px;\n}\n\n:host([disabled]) .pixel {\n  cursor: not-allowed;\n}\n\n:host([disabled]) .canvas {\n  opacity: 0.75;\n}\n\n.swatches {\n  display: grid;\n  gap: 0.6rem;\n}\n\n.swatch-group {\n  display: grid;\n  gap: 0.35rem;\n}\n\n.swatch-label {\n  font-size: 0.85rem;\n  font-weight: 600;\n}\n\n.swatch-list {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.4rem;\n  min-height: 1.75rem;\n}\n\n.swatch,\n.add-color {\n  width: 1.75rem;\n  height: 1.75rem;\n  padding: 0;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-small, 4px);\n  cursor: pointer;\n}\n\n.swatch[aria-pressed=\"true\"] {\n  outline: 2px solid var(--nala-ui-color-text, #18201d);\n  outline-offset: 2px;\n}\n\n.add-color {\n  border-style: dashed;\n  background: var(--nala-ui-color-surface, #fffefa);\n  color: var(--nala-ui-color-text, #18201d);\n  font: inherit;\n  font-weight: 700;\n  line-height: 1;\n}\n\n.swatch:focus-visible,\n.add-color:focus-visible {\n  outline: 3px solid var(--nala-ui-color-accent, #184d3b);\n  outline-offset: 2px;\n}\n\n.swatch:disabled,\n.add-color:disabled {\n  cursor: not-allowed;\n  opacity: 0.5;\n}\n\n.swatch-empty {\n  color: var(--nala-ui-color-text-muted, #68716c);\n  font-size: 0.9rem;\n}\n\n.preview {\n  display: grid;\n  min-height: 9rem;\n  max-height: 17rem;\n  padding: 0.25rem;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-small, 4px);\n  background: color-mix(\n    in srgb,\n    var(--nala-ui-color-border, #cbcfc8) 20%,\n    transparent\n  );\n  overflow: auto;\n}\n\n.preview-canvas {\n  margin: auto;\n  height: auto;\n  background: conic-gradient(\n    #e4e6e1 25%,\n    #fbfbf8 0 50%,\n    #e4e6e1 0 75%,\n    #fbfbf8 0\n  )\n    0 0 / 16px 16px;\n  outline: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  outline-offset: 1px;\n  image-rendering: pixelated;\n}\n"}`,
  template: (props)=>{
    const size = props.size;
    const pixels = fitPixels(props.pixels, size);
    const color = colorValue(props.color);
    const painted = pixels.filter((pixel)=>pixel !== null).length;
    const previewSize = size * props.previewScale;
    const exportSize = size * props.exportScale;
    return html`
      <div class="pixel-art" part="base">
        <div class="workspace">
          <div class="stage" part="stage">
            <div
              class="canvas"
              part="canvas"
              role="grid"
              aria-label=${props.label}
              aria-disabled=${props.disabled ? "true" : null}
              style=${`--pixel-art-size: ${size}`}
            >
              ${repeat(range(size), (y)=>y, (y)=>html`
                  <div class="row" role="row">
                    ${repeat(range(size), (x)=>x, (x)=>{
        const index = y * size + x;
        const pixel = pixels[index];
        return html`
                        <div
                          class="pixel"
                          part="pixel"
                          role="gridcell"
                          tabindex="-1"
                          data-index=${index}
                          aria-label=${pixelLabel(x, y, pixel)}
                          style=${pixel ? `background: ${pixel}` : null}
                        ></div>
                      `;
      })}
                  </div>
                `)}
            </div>
          </div>
          <div class="inspector" part="inspector">
            <section class="panel" aria-labelledby="canvas-heading">
              <h3 class="panel-title" id="canvas-heading">Canvas</h3>
              <nala-slider
                class="size-control"
                exportparts="field:size-field"
                label=${`Size: ${size} × ${size} px`}
                min=${pixelArtMinSize}
                max=${pixelArtMaxSize}
                step="1"
                .value=${size}
                ?disabled=${props.disabled}
              ></nala-slider>
            </section>
            <section class="panel" aria-labelledby="color-heading">
              <h3 class="panel-title" id="color-heading">Color</h3>
              <nala-color-picker
                class="color-control"
                exportparts="field:color-field"
                label="Paint color"
                .value=${color}
                ?disabled=${props.disabled}
              ></nala-color-picker>
              <div class="swatches" part="swatches">
                <div class="swatch-group" role="group"
                  aria-labelledby="palette-label">
                  <span class="swatch-label" id="palette-label">Palette</span>
                  <div class="swatch-list">
                    ${swatches(props.palette, color, props.disabled, "palette")}
                    <button
                      class="add-color"
                      part="add-color"
                      type="button"
                      aria-label=${`Add ${color} to palette`}
                      title="Add current color to palette"
                      ?disabled=${props.disabled || props.palette.includes(color)}
                    >+</button>
                  </div>
                </div>
                <div class="swatch-group" role="group"
                  aria-labelledby="recent-label">
                  <span class="swatch-label" id="recent-label">Recent</span>
                  <div class="swatch-list">
                    ${props.recentColors.length ? swatches(props.recentColors, color, props.disabled, "recent") : html`<span class="swatch-empty">Paint to collect colors</span>`}
                  </div>
                </div>
              </div>
            </section>
            <section class="panel" aria-labelledby="preview-heading">
              <h3 class="panel-title" id="preview-heading">Preview</h3>
              <div class="preview" part="preview">
                <canvas
                  class="preview-canvas"
                  part="preview-canvas"
                  width=${size}
                  height=${size}
                  role="img"
                  aria-label=${`Preview at ${props.previewScale}× zoom, ${previewSize} × ${previewSize} screen pixels`}
                  style=${`width: ${previewSize}px`}
                ></canvas>
              </div>
              <nala-slider
                class="zoom-control"
                exportparts="field:zoom-field"
                label=${props.previewScale === 1 ? "Zoom: 1× (actual size)" : `Zoom: ${props.previewScale}×`}
                min="1"
                max=${pixelArtMaxPreviewScale}
                step="1"
                .value=${props.previewScale}
              ></nala-slider>
            </section>
          </div>
        </div>
        <div class="footer" part="footer actions">
          <span class="status" part="status">
            ${size} × ${size} px · ${painted} painted · PNG ${exportSize} × ${exportSize} px
          </span>
          <div class="buttons">
            <nala-button class="clear-action" variant="ghost"
              exportparts="button:clear" ?disabled=${props.disabled}>Clear</nala-button>
            <nala-button class="save-action" exportparts="button:save"
            >Save PNG</nala-button>
          </div>
        </div>
      </div>
    `;
  },
  onAfterRender: ({ element, root })=>{
    const art = element;
    const preview = root.querySelector(".preview-canvas");
    const context = preview?.getContext("2d");
    if (context) {
      context.putImageData(new ImageData(pixelsToRgba(art.pixels, art.size), art.size, art.size), 0, 0);
    }
    const lastIndex = art.size * art.size - 1;
    const active = Math.min(activePixels.get(element) ?? 0, lastIndex);
    activePixels.set(element, active);
    for (const pixel of root.querySelectorAll('.pixel[tabindex="0"]')){
      if (Number(pixel.dataset.index) !== active) {
        pixel.setAttribute("tabindex", "-1");
      }
    }
    root.querySelector(`.pixel[data-index="${active}"]`)?.setAttribute("tabindex", "0");
  },
  onUpdate: ({ element, props }, previous)=>{
    if (previous.size !== props.size) {
      element.pixels = resizePixels(previous.pixels, previous.size, props.size);
    }
  },
  onConnect: ({ element, root, query, delegate, listen })=>{
    const art = element;
    // undefined means no stroke is active; null erases pixels.
    let stroke;
    const setActive = (index, focus)=>{
      const previous = activePixels.get(element) ?? 0;
      activePixels.set(element, index);
      root.querySelector(`.pixel[data-index="${previous}"]`)?.setAttribute("tabindex", "-1");
      const next = root.querySelector(`.pixel[data-index="${index}"]`);
      next?.setAttribute("tabindex", "0");
      if (focus) next?.focus();
    };
    const paint = (index, color)=>{
      const pixels = fitPixels(art.pixels, art.size);
      if (color !== null) {
        art.recentColors = pushRecentColor(art.recentColors, color);
      }
      if (pixels[index] === color) return;
      changePixels(art, paintPixel(pixels, art.size, index, color));
    };
    const toggle = (index)=>{
      const color = colorValue(art.color);
      return fitPixels(art.pixels, art.size)[index] === color ? null : color;
    };
    const indexFromPoint = (event)=>{
      const canvas = query(".canvas");
      if (!canvas || canvas.clientWidth === 0) return null;
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((event.clientX - rect.left - canvas.clientLeft) / canvas.clientWidth * art.size);
      const y = Math.floor((event.clientY - rect.top - canvas.clientTop) / canvas.clientHeight * art.size);
      if (x < 0 || y < 0 || x >= art.size || y >= art.size) return null;
      return y * art.size + x;
    };
    delegate("pointerdown", ".pixel", (event, target)=>{
      if (art.disabled || event.button !== 0) return;
      event.preventDefault();
      const index = Number(target.dataset.index);
      stroke = toggle(index);
      setActive(index, true);
      paint(index, stroke);
    });
    delegate("pointermove", ".canvas", (event)=>{
      if (stroke === undefined) return;
      const index = indexFromPoint(event);
      if (index !== null) paint(index, stroke);
    });
    const endStroke = ()=>{
      stroke = undefined;
    };
    listen(window, "pointerup", endStroke);
    listen(window, "pointercancel", endStroke);
    delegate("keydown", ".pixel", (event, target)=>{
      const size = art.size;
      const index = Number(target.dataset.index);
      const x = index % size;
      const y = Math.floor(index / size);
      const moves = {
        ArrowLeft: x > 0 ? index - 1 : index,
        ArrowRight: x < size - 1 ? index + 1 : index,
        ArrowUp: y > 0 ? index - size : index,
        ArrowDown: y < size - 1 ? index + size : index,
        Home: y * size,
        End: y * size + size - 1
      };
      if (event.key in moves) {
        event.preventDefault();
        setActive(moves[event.key], true);
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (!art.disabled) paint(index, toggle(index));
      }
    });
    delegate("input", ".zoom-control", (event)=>{
      event.stopPropagation();
      art.previewScale = event.detail.value;
    });
    delegate("input", ".size-control", (event)=>{
      event.stopPropagation();
      art.size = event.detail.value;
    });
    delegate("input", "nala-color-picker", (event)=>{
      event.stopPropagation();
      art.color = event.detail.value;
    });
    delegate("change", "nala-slider, nala-color-picker", (event)=>{
      event.stopPropagation();
    });
    delegate("click", ".swatch", (_event, target)=>{
      if (art.disabled) return;
      art.color = target.dataset.color;
    });
    delegate("click", ".add-color", ()=>{
      if (art.disabled) return;
      const palette = addPaletteColor(art.palette, art.color);
      if (palette === art.palette) return;
      art.palette = palette;
      dispatchComponentEvent(art, "palette-change", {
        palette
      }, {
        bubbles: true,
        composed: true
      });
    });
    delegate("click", ".clear-action", ()=>{
      if (art.disabled) return;
      changePixels(art, []);
    });
    delegate("click", ".save-action", ()=>{
      art.save().catch((error)=>console.error(error));
    });
  }
});
const prototype = customElements.get("nala-pixel-art").prototype;
Object.defineProperties(prototype, {
  toJSON: {
    value () {
      return parsePixelArtData({
        version: 1,
        size: this.size,
        pixels: fitPixels(this.pixels, this.size),
        palette: this.palette,
        recentColors: this.recentColors,
        color: this.color,
        previewScale: this.previewScale,
        exportScale: this.exportScale
      });
    }
  },
  fromJSON: {
    value (value) {
      const data = parsePixelArtData(value);
      this.size = data.size;
      this.pixels = data.pixels;
      this.palette = data.palette;
      this.recentColors = data.recentColors;
      this.color = data.color;
      this.previewScale = data.previewScale;
      this.exportScale = data.exportScale;
    }
  },
  clear: {
    value () {
      this.pixels = [];
    }
  },
  toBlob: {
    value () {
      const width = this.size * this.exportScale;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = width;
      const context = canvas.getContext("2d");
      if (!context) {
        return Promise.reject(new Error("Canvas 2D rendering is unavailable"));
      }
      const data = pixelsToRgba(this.pixels, this.size, this.exportScale);
      context.putImageData(new ImageData(data, width, width), 0, 0);
      return new Promise((resolve, reject)=>{
        canvas.toBlob((blob)=>{
          if (blob) resolve(blob);
          else reject(new Error("Pixel art could not be encoded as PNG"));
        }, "image/png");
      });
    }
  },
  save: {
    async value () {
      const blob = await this.toBlob();
      const filename = this.filename || "pixel-art.png";
      const download = dispatchComponentEvent(this, "pixel-save", {
        blob,
        filename
      }, {
        bubbles: true,
        composed: true,
        cancelable: true
      });
      if (download) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        setTimeout(()=>URL.revokeObjectURL(url), 0);
      }
      return blob;
    }
  }
});
