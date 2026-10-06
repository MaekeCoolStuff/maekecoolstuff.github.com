import { defineComponent, dispatchComponentEvent, html, render, repeat, when } from "../../../components/dist/index.js";
import { createSignal } from "../../../state/dist/index.js";
import "../button/button.js";
import "../slider/slider.js";
import { pixelsToRgba } from "../pixel-art/pixel-art-data.js";
import { parseSpritesheetData } from "../spritesheet/spritesheet-data.js";
import { baseStyles } from "../shared-styles.js";
import { levelDimension, levelLine, levelZoom, parseLevelData, parseLevelSpawn, validateLevelCollision, validateLevelTiles } from "./level-data.js";
import { createLevelStore } from "./level-state.js";
import { createPreviewPlayer, previewCamera, stepPreview } from "./level-preview.js";
function createRuntime() {
  return {
    store: createLevelStore(),
    selected: createSignal(null),
    tool: createSignal("tiles"),
    solid: createSignal(true),
    playing: createSignal(false),
    preview: null,
    startPreview: null,
    endPreview: null,
    x: 0,
    y: 0,
    spritesheet: null,
    images: [],
    stop: null
  };
}
const runtimes = new WeakMap();
function runtimeOf(element) {
  let runtime = runtimes.get(element);
  if (!runtime) {
    runtime = createRuntime();
    runtimes.set(element, runtime);
  }
  return runtime;
}
function tileSize(data) {
  return data.spritesheet?.sprites.reduce((size, sprite)=>Math.max(size, sprite.size), 0) || 16;
}
function syncImages(runtime, data) {
  if (runtime.spritesheet === data.spritesheet) return;
  runtime.spritesheet = data.spritesheet;
  runtime.images = (data.spritesheet?.sprites ?? []).map((sprite)=>{
    const canvas = document.createElement("canvas");
    canvas.width = sprite.size;
    canvas.height = sprite.size;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D rendering is unavailable");
    context.putImageData(new ImageData(new Uint8ClampedArray(pixelsToRgba(sprite.pixels, sprite.size)), sprite.size), 0, 0);
    return canvas;
  });
}
function required(root, selector) {
  const element = root.querySelector(selector);
  if (!element) throw new Error(`Level editor is missing ${selector}`);
  return element;
}
function paintViewport(element, root) {
  const runtime = runtimeOf(element);
  const data = runtime.store.state().data;
  const viewport = required(root, ".viewport");
  const canvas = required(root, ".map");
  const width = Math.max(1, viewport.clientWidth);
  const height = Math.max(1, viewport.clientHeight);
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D rendering is unavailable");
  syncImages(runtime, data);
  runtime.x = Math.min(runtime.x, data.width - 1);
  runtime.y = Math.min(runtime.y, data.height - 1);
  const step = tileSize(data) * element.zoom;
  const preview = runtime.preview;
  const camera = preview ? previewCamera(data, preview.player, width / step, height / step) : null;
  const left = camera ? camera.x * step : viewport.scrollLeft;
  const top = camera ? camera.y * step : viewport.scrollTop;
  const startX = Math.floor(left / step), startY = Math.floor(top / step);
  const endX = Math.min(data.width, Math.ceil((left + width) / step));
  const endY = Math.min(data.height, Math.ceil((top + height) / step));
  const theme = getComputedStyle(element);
  context.fillStyle = theme.getPropertyValue("--nala-ui-color-surface").trim() || "#fffefa";
  context.fillRect(0, 0, width, height);
  context.imageSmoothingEnabled = false;
  for(let y = startY; y < endY; y++){
    for(let x = startX; x < endX; x++){
      const frame = data.tiles[y * data.width + x];
      if (frame === null) continue;
      const image = runtime.images[frame];
      context.drawImage(image, x * step - left, y * step - top, image.width * element.zoom, image.height * element.zoom);
    }
  }
  if (!preview) {
    for(let y = startY; y < endY; y++){
      for(let x = startX; x < endX; x++){
        if (!data.collision[y * data.width + x]) continue;
        context.fillStyle = "#df62394d";
        context.fillRect(x * step - left, y * step - top, step, step);
        context.strokeStyle = "#b44220";
        context.lineWidth = 1;
        context.strokeRect(x * step - left + 2, y * step - top + 2, step - 4, step - 4);
      }
    }
    if (data.spawn) {
      const x = data.spawn.x * step - left, y = data.spawn.y * step - top;
      context.fillStyle = "#2374c9";
      context.fillRect(x + step * 0.25, y + step * 0.15, step * 0.5, step * 0.7);
      context.fillStyle = "#ffffff";
      context.font = `bold ${Math.max(8, step * 0.45)}px sans-serif`;
      context.textAlign = "center";
      context.fillText("S", x + step / 2, y + step * 0.65);
    }
  } else {
    const player = preview.player;
    const x = player.x * step - left, y = player.y * step - top;
    context.fillStyle = "#2374c9";
    context.fillRect(x, y, player.width * step, player.height * step);
    context.fillStyle = "#ffffff";
    context.fillRect(x + player.width * step * 0.6, y + player.height * step * 0.2, Math.max(1, step * 0.12), Math.max(1, step * 0.12));
    required(root, ".cursor-status").textContent = `Player: column ${Math.floor(player.x) + 1}, row ${Math.floor(player.y) + 1}. Respawns: ${player.respawns}.`;
    return;
  }
  context.strokeStyle = theme.getPropertyValue("--nala-ui-color-border").trim() || "#cbcfc8";
  context.lineWidth = 1;
  context.beginPath();
  for(let x = startX; x <= endX; x++){
    context.moveTo(x * step - left + 0.5, 0);
    context.lineTo(x * step - left + 0.5, Math.min(height, data.height * step - top));
  }
  for(let y = startY; y <= endY; y++){
    context.moveTo(0, y * step - top + 0.5);
    context.lineTo(Math.min(width, data.width * step - left), y * step - top + 0.5);
  }
  context.stroke();
  context.strokeStyle = theme.getPropertyValue("--nala-ui-color-accent").trim() || "#184d3b";
  context.lineWidth = 2;
  context.strokeRect(runtime.x * step - left + 1, runtime.y * step - top + 1, step - 2, step - 2);
  const frame = data.tiles[runtime.y * data.width + runtime.x];
  required(root, ".cursor-status").textContent = `Column ${runtime.x + 1}, row ${runtime.y + 1}: ${frame === null ? "empty" : `frame ${frame + 1}`}; ${data.collision[runtime.y * data.width + runtime.x] ? "solid" : "not solid"}${data.spawn?.x === runtime.x && data.spawn?.y === runtime.y ? "; player spawn" : ""}`;
}
function draw(element, root) {
  const runtime = runtimeOf(element);
  const state = runtime.store.state();
  const data = state.data;
  syncImages(runtime, data);
  const selected = runtime.selected[0]();
  const tool = runtime.tool[0]();
  const playing = runtime.playing[0]();
  const locked = element.disabled || playing;
  const erasing = tool === "collision" ? !runtime.solid[0]() : tool === "tiles" && selected === null;
  const size = tileSize(data), step = size * element.zoom;
  render(html`
      <section part="base" aria-label=${element.label}>
        <header class="header" part="header">
          <h2>${element.label}</h2>
          <span
            part="status">${data.width} × ${data.height} tiles · ${size}px tiles</span>
        </header>
        <div class="controls" part="controls">
          <label>Map columns <input class="width" type="number" min="1" max="128"
            .value=${String(data.width)} ?disabled=${locked}></label>
          <label>Map rows <input class="height" type="number" min="1" max="128"
            .value=${String(data.height)} ?disabled=${locked}></label>
          <nala-button class="resize" variant="secondary" ?disabled=${locked}
            exportparts="button:resize">Resize map</nala-button>
          <nala-slider class="zoom" label=${`Zoom: ${element.zoom}×`} min="1" max="8"
            step="1" .value=${element.zoom}></nala-slider>
        </div>
        <div class="tools" part="mode-tools" role="group" aria-label="Editing layer">
          <button type="button" class="tool" data-tool="tiles" part="tile-tool"
            aria-pressed=${String(tool === "tiles")} ?disabled=${locked}>Artwork</button>
          <button type="button" class="tool" data-tool="collision"
            part="collision-tool"
            aria-pressed=${String(tool === "collision")} ?disabled=${locked}>Collision</button>
          <button type="button" class="tool" data-tool="spawn" part="spawn-tool"
            aria-pressed=${String(tool === "spawn")} ?disabled=${locked}>Player spawn</button>
          <button type="button" class="play" part="play"
            aria-pressed=${String(playing)}>${playing ? "Stop preview" : "Play preview"}</button>
        </div>
        <div class="tools" part="tools">
          ${when(tool === "collision", ()=>html`
              <button type="button" class="solid" part="solid"
                aria-pressed=${String(!erasing)} ?disabled=${locked}>Solid cell</button>
            `)}
          <button type="button" class="eraser" part="eraser"
            aria-pressed=${String(erasing)} ?disabled=${locked}>Eraser</button>
          <button type="button" class="undo" part="undo"
            ?disabled=${locked || state.past.length === 0}>Undo</button>
          <button type="button" class="redo" part="redo"
            ?disabled=${locked || state.future.length === 0}>Redo</button>
          <button type="button" class="clear" part="clear"
            ?disabled=${locked || data.tiles.every((tile)=>tile === null) && data.collision.every((solid)=>!solid) && !data.spawn}>Clear map</button>
          <span>${tool === "spawn" ? "Place or move the player start" : tool === "collision" ? erasing ? "Erase collision" : "Paint solid cells" : selected === null ? "Eraser selected" : `Frame ${selected + 1} selected`}</span>
        </div>
        <section class="palette" part="palette" aria-labelledby="palette-heading">
          <h3 id="palette-heading">Spritesheet frames</h3>
          ${when(runtime.images.length === 0, ()=>html`<p part="empty">Load a spritesheet to start placing tiles.</p>`, ()=>html`
                <ul class="frames">
                  ${repeat(runtime.images, (image)=>image, (image, index)=>html`
                      <li><button class="frame" type="button" part="frame" data-index=${index}
                        aria-label=${`Select frame ${index + 1}`} aria-pressed=${String(selected === index)}
                        ?disabled=${locked}>${image}<span>Frame ${index + 1}</span></button></li>
                    `)}
                </ul>
              `)}
        </section>
        <p id="instructions">
          ${playing ? "Preview: focus the canvas, then use Left/Right or A/D to move, Space/Up/W to jump, R to respawn, Escape to stop. The preview pauses when focus leaves the canvas. Playing does not change the level." : tool === "collision" ? "Paint solid cells in orange; Eraser removes collision, not artwork. Collision is independent of sprites. Arrows move the cursor, Enter/Space paints, Delete erases." : tool === "spawn" ? "Click to place or move the blue player start. Choose a cell without collision. Enter/Space places at the cursor; Delete removes the spawn. Arrows move the cursor." : "Select a frame, then click or drag to paint artwork. Collision (orange) and player spawn (blue S) are separate layers. Scroll to explore. Arrows move the cursor, Enter/Space paints, Delete erases, Ctrl/Cmd+Z undoes."}
        </p>
        <p class="preview-status" part="preview-status" role="status"></p>
        <div class="viewport" part="viewport">
          <div class="world" style=${playing ? "width: 100%; height: 100%" : `width: ${data.width * step}px; height: ${data.height * step}px`}>
            <canvas class="map" part="canvas" tabindex="0"
              aria-label=${`${element.label} tile canvas`} aria-describedby="instructions cursor-status"
              aria-disabled=${String(element.disabled && !playing)}></canvas>
          </div>
        </div>
        <p id="cursor-status" class="cursor-status" part="cursor-status"
          role=${playing ? null : "status"}></p>
        <div class="actions" part="actions">
          <nala-button class="save"
            exportparts="button:save">Save level JSON</nala-button>
        </div>
        <p class="feedback" part="feedback" role="status"></p>
      </section>
    `, root);
  paintViewport(element, root);
}
function notify(element) {
  dispatchComponentEvent(element, "level-change", {
    data: element.toJSON()
  }, {
    bubbles: true,
    composed: true
  });
}
const propertySetters = {
  spritesheet (element, value) {
    const sheet = value === null ? null : parseSpritesheetData(value);
    const runtime = runtimeOf(element);
    runtime.stop?.(false);
    runtime.endPreview?.();
    runtime.store.actions.setSheet(sheet);
    runtime.selected[1](sheet?.sprites.length ? 0 : null);
  },
  tiles (element, value) {
    const runtime = runtimeOf(element);
    const data = runtime.store.state().data;
    validateLevelTiles(value, data.width, data.height, data.spritesheet?.sprites.length ?? 0);
    runtime.stop?.(false);
    runtime.endPreview?.();
    runtime.store.actions.setTiles(value);
  },
  collision (element, value) {
    const runtime = runtimeOf(element), data = runtime.store.state().data;
    validateLevelCollision(value, data.width, data.height);
    runtime.stop?.(false);
    runtime.endPreview?.();
    runtime.store.actions.setCollision(value);
  },
  spawn (element, value) {
    const runtime = runtimeOf(element), data = runtime.store.state().data;
    const spawn = parseLevelSpawn(value, data.width, data.height);
    runtime.stop?.(false);
    runtime.endPreview?.();
    runtime.store.actions.setSpawn(spawn);
  },
  tool (element, value) {
    if (value !== "tiles" && value !== "collision" && value !== "spawn") {
      throw new TypeError("Level tool must be tiles, collision, or spawn");
    }
    const runtime = runtimeOf(element);
    runtime.stop?.(true);
    runtime.tool[1](value);
    if (value === "collision") runtime.solid[1](true);
  },
  selectedFrame (element, value) {
    const runtime = runtimeOf(element);
    const count = runtime.store.state().data.spritesheet?.sprites.length ?? 0;
    if (value !== null && (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value >= count)) {
      throw new RangeError("Selected frame must be null (eraser) or a spritesheet frame index");
    }
    runtime.stop?.(true);
    runtime.selected[1](value);
  }
};
defineComponent("nala-level-editor", {
  shadow: true,
  props: {
    label: {
      type: "string",
      default: "Platform level"
    },
    filename: {
      type: "string",
      default: "level.json"
    },
    disabled: "boolean",
    zoom: {
      type: "number",
      default: 2,
      validate: levelZoom
    }
  },
  styles: `${baseStyles}\n${":host {\n  display: block;\n  min-width: 0;\n}\n\nsection[part=\"base\"] {\n  display: grid;\n  gap: 1rem;\n  min-width: 0;\n}\n\nh2,\nh3,\np {\n  margin: 0;\n}\n\n.header,\n.tools,\n.actions {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.75rem;\n}\n\n.header {\n  justify-content: space-between;\n}\n\n.controls {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 9rem), 1fr));\n  gap: 0.75rem;\n  align-items: end;\n}\n\nlabel {\n  display: grid;\n  gap: 0.4rem;\n}\n\ninput,\nbutton {\n  font: inherit;\n  color: inherit;\n  background: var(--nala-ui-color-surface, #fffefa);\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-small, 4px);\n  padding: 0.5rem;\n}\n\ninput {\n  width: 100%;\n  min-width: 0;\n}\n\nbutton {\n  cursor: pointer;\n}\n\nbutton:disabled {\n  cursor: not-allowed;\n  opacity: 0.5;\n}\n\nbutton[aria-pressed=\"true\"] {\n  outline: 2px solid var(--nala-ui-color-accent, #184d3b);\n  outline-offset: 2px;\n}\n\nbutton:focus-visible,\ninput:focus-visible,\n.map:focus-visible {\n  outline: 3px solid var(--nala-ui-color-accent, #184d3b);\n  outline-offset: -3px;\n}\n\n.frames {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(min(100%, 5rem), 1fr));\n  gap: 0.75rem;\n  list-style: none;\n  padding: 0.25rem;\n  margin: 0.5rem 0 0;\n  max-height: 15rem;\n  overflow: auto;\n}\n\n.frame {\n  display: grid;\n  gap: 0.5rem;\n  width: 100%;\n  text-align: start;\n  font-size: 0.85rem;\n}\n\n.frame canvas {\n  width: 100%;\n  height: auto;\n  aspect-ratio: 1;\n  image-rendering: pixelated;\n  background: conic-gradient(\n    #e4e6e1 25%, #fbfbf8 0 50%, #e4e6e1 0 75%, #fbfbf8 0\n  ) 0 0 / 16px 16px;\n}\n\n.viewport {\n  width: 100%;\n  height: 28rem;\n  min-width: 0;\n  overflow: auto;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-small, 4px);\n  background: var(--nala-ui-color-surface, #fffefa);\n}\n\n.world {\n  position: relative;\n  min-width: 100%;\n  min-height: 100%;\n}\n\n.map {\n  display: block;\n  position: sticky;\n  top: 0;\n  left: 0;\n  touch-action: none;\n  cursor: crosshair;\n}\n\n:host([disabled]) .map {\n  cursor: not-allowed;\n}\n\np,\n.header span,\n.tools span {\n  color: var(--nala-ui-color-text-muted, #68716c);\n}\n"}`,
  template: ()=>html`<div class="content"></div>`,
  onAfterRender: ({ element, query })=>{
    const root = query(".content");
    if (!root) throw new Error("Level editor content is missing");
    draw(element, root);
  },
  onUpdate: ({ element, props }, previous)=>{
    if (props.disabled && !previous.disabled) runtimeOf(element).stop?.(true);
    if (props.zoom !== previous.zoom) runtimeOf(element).stop?.(true);
  },
  onConnect: ({ element, query, delegate, listen, effect, onCleanup })=>{
    const editor = element;
    const runtime = runtimeOf(editor);
    for (const name of [
      "spritesheet",
      "tiles",
      "collision",
      "spawn",
      "selectedFrame",
      "tool"
    ]){
      if (!Object.hasOwn(editor, name)) continue;
      const value = Reflect.get(editor, name);
      Reflect.deleteProperty(editor, name);
      propertySetters[name](editor, value);
    }
    const root = query(".content");
    if (!root) throw new Error("Level editor content is missing");
    effect(()=>draw(editor, root));
    const canvas = required(root, ".map");
    const viewport = required(root, ".viewport");
    const feedback = (message)=>{
      required(root, ".feedback").textContent = message;
    };
    let pointer = null;
    let previous = null;
    let brush = null;
    let strokeTool = "tiles";
    let solidBrush = true;
    const finish = (emit)=>{
      const id = pointer;
      pointer = null;
      previous = null;
      if (id !== null && canvas.hasPointerCapture(id)) {
        canvas.releasePointerCapture(id);
      }
      if (runtime.store.actions.endStroke() && emit) notify(editor);
    };
    runtime.stop = finish;
    const previewStatus = (message)=>{
      const status = required(root, ".preview-status");
      if (status.textContent !== message) status.textContent = message;
    };
    const pausePreview = ()=>{
      const session = runtime.preview;
      if (!session) return;
      session.keys.clear();
      session.jump = false;
      session.last = null;
      session.accumulator = 0;
      if (session.frame !== null) cancelAnimationFrame(session.frame);
      session.frame = null;
      previewStatus("Preview paused. Focus the canvas to continue.");
    };
    const tick = (timestamp)=>{
      const session = runtime.preview;
      if (!session) return;
      session.frame = null;
      if (document.hidden || editor.shadowRoot?.activeElement !== canvas) {
        pausePreview();
        return;
      }
      const elapsed = session.last === null ? 0 : Math.min((timestamp - session.last) / 1000, 1 / 15);
      session.last = timestamp;
      session.accumulator += elapsed;
      const keys = session.keys;
      const left = keys.has("arrowleft") || keys.has("a");
      const right = keys.has("arrowright") || keys.has("d");
      const data = runtime.store.state().data;
      while(session.accumulator >= 1 / 120){
        session.player = stepPreview(data, session.player, {
          direction: left === right ? 0 : left ? -1 : 1,
          jump: session.jump
        }, 1 / 120);
        session.jump = false;
        session.accumulator -= 1 / 120;
      }
      paintViewport(editor, root);
      session.frame = requestAnimationFrame(tick);
    };
    const resumePreview = ()=>{
      const session = runtime.preview;
      if (!session || document.hidden) return;
      previewStatus("Preview running. Escape or Stop preview returns to editing.");
      if (session.frame === null) session.frame = requestAnimationFrame(tick);
    };
    const endPreview = ()=>{
      const session = runtime.preview;
      if (!session) return;
      pausePreview();
      runtime.preview = null;
      runtime.playing[1](false);
      viewport.scrollLeft = session.scrollLeft;
      viewport.scrollTop = session.scrollTop;
      previewStatus("");
      paintViewport(editor, root);
    };
    runtime.endPreview = endPreview;
    runtime.startPreview = ()=>{
      if (runtime.preview) {
        canvas.focus({
          preventScroll: true
        });
        resumePreview();
        return;
      }
      const player = createPreviewPlayer(runtime.store.state().data);
      finish(true);
      runtime.preview = {
        player,
        keys: new Set(),
        jump: false,
        last: null,
        accumulator: 0,
        frame: null,
        scrollLeft: viewport.scrollLeft,
        scrollTop: viewport.scrollTop
      };
      runtime.playing[1](true);
      canvas.focus({
        preventScroll: true
      });
      paintViewport(editor, root);
      resumePreview();
    };
    onCleanup(()=>{
      finish(true);
      endPreview();
      runtime.stop = null;
      runtime.startPreview = null;
      runtime.endPreview = null;
    });
    const observer = new ResizeObserver(()=>paintViewport(editor, root));
    observer.observe(viewport);
    onCleanup(()=>observer.disconnect());
    listen(viewport, "scroll", ()=>paintViewport(editor, root));
    const point = (event)=>{
      const data = runtime.store.state().data;
      const rect = canvas.getBoundingClientRect();
      const step = tileSize(data) * editor.zoom;
      const x = Math.floor((event.clientX - rect.left + viewport.scrollLeft) / step);
      const y = Math.floor((event.clientY - rect.top + viewport.scrollTop) / step);
      return x >= 0 && y >= 0 && x < data.width && y < data.height ? [
        x,
        y
      ] : null;
    };
    const paint = (cell)=>{
      const points = previous && strokeTool !== "spawn" ? levelLine(...previous, ...cell) : [
        cell
      ];
      for (const [x, y] of points){
        if (strokeTool === "collision") {
          runtime.store.actions.paintCollision(x, y, solidBrush);
        } else if (strokeTool === "spawn") {
          runtime.store.actions.paintSpawn({
            x,
            y
          });
        } else runtime.store.actions.paint(x, y, brush);
      }
      previous = cell;
      [runtime.x, runtime.y] = cell;
      paintViewport(editor, root);
    };
    listen(canvas, "pointerdown", (event)=>{
      if (editor.playing || editor.disabled || event.button !== 0 || pointer !== null) return;
      const cell = point(event);
      if (!cell) return;
      event.preventDefault();
      canvas.focus({
        preventScroll: true
      });
      pointer = event.pointerId;
      brush = editor.selectedFrame;
      strokeTool = editor.tool;
      solidBrush = runtime.solid[0]();
      runtime.store.actions.beginStroke();
      canvas.setPointerCapture(event.pointerId);
      paint(cell);
    });
    listen(canvas, "pointermove", (event)=>{
      if (pointer !== event.pointerId || editor.disabled) return;
      const cell = point(event);
      if (cell) paint(cell);
      else previous = null;
    });
    listen(canvas, "pointerup", (event)=>{
      if (pointer === event.pointerId) finish(true);
    });
    listen(canvas, "pointercancel", (event)=>{
      if (pointer === event.pointerId) finish(true);
    });
    listen(canvas, "lostpointercapture", (event)=>{
      if (pointer === event.pointerId) finish(true);
    });
    listen(window, "blur", ()=>{
      finish(true);
      pausePreview();
    });
    listen(canvas, "blur", pausePreview);
    listen(canvas, "focus", resumePreview);
    listen(document, "visibilitychange", ()=>{
      if (document.hidden) {
        finish(true);
        pausePreview();
      } else if (editor.shadowRoot?.activeElement === canvas) resumePreview();
    });
    const mutate = (action)=>{
      finish(true);
      const before = runtime.store.state().data;
      action();
      if (runtime.store.state().data !== before) notify(editor);
    };
    const revealCursor = ()=>{
      const step = tileSize(runtime.store.state().data) * editor.zoom;
      const x = runtime.x * step, y = runtime.y * step;
      if (x < viewport.scrollLeft) viewport.scrollLeft = x;
      else if (x + step > viewport.scrollLeft + viewport.clientWidth) {
        viewport.scrollLeft = x + step - viewport.clientWidth;
      }
      if (y < viewport.scrollTop) viewport.scrollTop = y;
      else if (y + step > viewport.scrollTop + viewport.clientHeight) {
        viewport.scrollTop = y + step - viewport.clientHeight;
      }
      paintViewport(editor, root);
    };
    listen(canvas, "keydown", (event)=>{
      if (editor.playing) {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        const key = event.key.toLowerCase();
        if (![
          "arrowleft",
          "arrowright",
          "a",
          "d",
          " ",
          "arrowup",
          "w",
          "r",
          "escape"
        ].includes(key)) return;
        event.preventDefault();
        const session = runtime.preview;
        if (!session) return;
        if (key === "escape") {
          endPreview();
        } else if (key === "r") {
          if (!event.repeat) {
            session.player = createPreviewPlayer(runtime.store.state().data);
            session.jump = false;
            paintViewport(editor, root);
          }
        } else if ([
          " ",
          "arrowup",
          "w"
        ].includes(key)) {
          if (!event.repeat) session.jump = true;
        } else session.keys.add(key);
        return;
      }
      const data = runtime.store.state().data;
      if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (!editor.disabled) {
          mutate(()=>event.shiftKey ? editor.redo() : editor.undo());
        }
        return;
      }
      if (event.key.startsWith("Arrow")) {
        if (event.key === "ArrowLeft") runtime.x = Math.max(0, runtime.x - 1);
        else if (event.key === "ArrowRight") {
          runtime.x = Math.min(data.width - 1, runtime.x + 1);
        } else if (event.key === "ArrowUp") {
          runtime.y = Math.max(0, runtime.y - 1);
        } else if (event.key === "ArrowDown") {
          runtime.y = Math.min(data.height - 1, runtime.y + 1);
        } else return;
        event.preventDefault();
        finish(true);
        revealCursor();
      } else if ([
        "Enter",
        " ",
        "Delete",
        "Backspace"
      ].includes(event.key)) {
        event.preventDefault();
        if (editor.disabled) return;
        finish(true);
        runtime.store.actions.beginStroke();
        const erase = event.key === "Delete" || event.key === "Backspace";
        if (editor.tool === "collision") {
          runtime.store.actions.paintCollision(runtime.x, runtime.y, erase ? false : runtime.solid[0]());
        } else if (editor.tool === "spawn") {
          runtime.store.actions.paintSpawn(erase ? null : {
            x: runtime.x,
            y: runtime.y
          });
        } else {
          runtime.store.actions.paint(runtime.x, runtime.y, erase ? null : editor.selectedFrame);
        }
        finish(true);
      }
    });
    listen(canvas, "keyup", (event)=>{
      const session = runtime.preview;
      if (session) session.keys.delete(event.key.toLowerCase());
    });
    delegate("click", ".play", ()=>{
      if (editor.playing) editor.stop();
      else {
        try {
          editor.play();
          feedback("");
        } catch (error) {
          feedback(`Could not start preview: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    });
    delegate("click", ".tool", (_event, target)=>{
      if (editor.disabled || editor.playing) return;
      propertySetters.tool(editor, target.dataset.tool);
    });
    delegate("click", ".solid", ()=>{
      if (editor.disabled || editor.playing) return;
      finish(true);
      runtime.solid[1](true);
    });
    delegate("click", ".frame", (_event, target)=>{
      if (!editor.disabled && !editor.playing) {
        editor.tool = "tiles";
        editor.selectedFrame = Number(target.dataset.index);
      }
    });
    delegate("click", ".eraser", ()=>{
      if (editor.disabled || editor.playing) return;
      if (editor.tool === "collision") {
        finish(true);
        runtime.solid[1](false);
      } else if (editor.tool === "spawn") {
        mutate(()=>{
          runtime.store.actions.beginStroke();
          runtime.store.actions.paintSpawn(null);
          runtime.store.actions.endStroke();
        });
      } else editor.selectedFrame = null;
    });
    delegate("click", ".undo, .redo, .clear", (_event, target)=>{
      if (editor.disabled || editor.playing || target.disabled) return;
      mutate(()=>{
        if (target.classList.contains("undo")) editor.undo();
        else if (target.classList.contains("redo")) editor.redo();
        else editor.clear();
      });
    });
    delegate("click", ".resize", ()=>{
      if (editor.disabled || editor.playing) return;
      const width = required(root, ".width").valueAsNumber;
      const height = required(root, ".height").valueAsNumber;
      try {
        levelDimension(width);
        levelDimension(height);
        mutate(()=>editor.resize(width, height));
        feedback("Map resized. Undo restores any cropped tiles.");
      } catch (error) {
        feedback(`Could not resize map: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
    delegate("input", ".zoom", (event)=>{
      event.stopPropagation();
      editor.zoom = event.detail.value;
    });
    delegate("change", "nala-slider", (event)=>event.stopPropagation());
    delegate("click", ".save", ()=>editor.save());
  }
});
Object.defineProperties(customElements.get("nala-level-editor").prototype, {
  spritesheet: {
    get () {
      return this.toJSON().spritesheet;
    },
    set (value) {
      propertySetters.spritesheet(this, value);
    }
  },
  tiles: {
    get () {
      return [
        ...runtimeOf(this).store.state().data.tiles
      ];
    },
    set (value) {
      propertySetters.tiles(this, value);
    }
  },
  collision: {
    get () {
      return [
        ...runtimeOf(this).store.state().data.collision
      ];
    },
    set (value) {
      propertySetters.collision(this, value);
    }
  },
  spawn: {
    get () {
      const spawn = runtimeOf(this).store.state().data.spawn;
      return spawn ? {
        ...spawn
      } : null;
    },
    set (value) {
      propertySetters.spawn(this, value);
    }
  },
  tool: {
    get () {
      return runtimeOf(this).tool[0]();
    },
    set (value) {
      propertySetters.tool(this, value);
    }
  },
  playing: {
    get () {
      return runtimeOf(this).playing[0]();
    }
  },
  selectedFrame: {
    get () {
      return runtimeOf(this).selected[0]();
    },
    set (value) {
      propertySetters.selectedFrame(this, value);
    }
  },
  mapWidth: {
    get () {
      return runtimeOf(this).store.state().data.width;
    }
  },
  mapHeight: {
    get () {
      return runtimeOf(this).store.state().data.height;
    }
  },
  canUndo: {
    get () {
      return runtimeOf(this).store.state().past.length > 0;
    }
  },
  canRedo: {
    get () {
      return runtimeOf(this).store.state().future.length > 0;
    }
  },
  resize: {
    value (width, height) {
      levelDimension(width);
      levelDimension(height);
      const runtime = runtimeOf(this);
      runtime.stop?.(false);
      runtime.endPreview?.();
      runtime.store.actions.resize(width, height);
    }
  },
  clear: {
    value () {
      const runtime = runtimeOf(this);
      runtime.stop?.(false);
      runtime.endPreview?.();
      runtime.store.actions.clear();
    }
  },
  undo: {
    value () {
      const runtime = runtimeOf(this);
      runtime.stop?.(false);
      runtime.endPreview?.();
      runtime.store.actions.undo();
    }
  },
  redo: {
    value () {
      const runtime = runtimeOf(this);
      runtime.stop?.(false);
      runtime.endPreview?.();
      runtime.store.actions.redo();
    }
  },
  toJSON: {
    value () {
      return parseLevelData(runtimeOf(this).store.state().data);
    }
  },
  fromJSON: {
    value (value) {
      const data = parseLevelData(value);
      const runtime = runtimeOf(this);
      runtime.stop?.(false);
      runtime.endPreview?.();
      runtime.store.actions.load(data);
      runtime.selected[1](data.spritesheet?.sprites.length ? 0 : null);
    }
  },
  play: {
    value () {
      const start = runtimeOf(this).startPreview;
      if (!start) {
        throw new Error("Connect the level editor before starting a preview.");
      }
      start();
    }
  },
  stop: {
    value () {
      runtimeOf(this).endPreview?.();
    }
  },
  save: {
    value () {
      runtimeOf(this).stop?.(true);
      const data = this.toJSON();
      const json = JSON.stringify(data, null, 2);
      const filename = this.filename || "level.json";
      const download = dispatchComponentEvent(this, "level-save", {
        data,
        json,
        filename
      }, {
        bubbles: true,
        composed: true,
        cancelable: true
      });
      if (download) {
        const url = URL.createObjectURL(new Blob([
          json
        ], {
          type: "application/json"
        }));
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        setTimeout(()=>URL.revokeObjectURL(url), 0);
      }
      return data;
    }
  }
});
