import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
defineComponent("docs-pixel-art-example", {
  template: ()=>html`
      <nala-pixel-art size="12" color="#184d3b"
        label="Game Shelf badge canvas" export-scale="8"
        filename="game-shelf-badge.png"></nala-pixel-art>
      <p class="pixel-art-count">Painted pixels: 0</p>
      <p class="pixel-art-save-status">Save PNG previews the badge here.</p>
      <img class="pixel-art-saved" alt="Saved Game Shelf badge" hidden
        width="96" height="96" style="image-rendering: pixelated" />
      <p>
        Export an editable snapshot, change or clear the drawing, then load
        the JSON to restore it.
      </p>
      <label>
        Drawing JSON
        <textarea class="pixel-art-json" rows="6"
          spellcheck="false"
          style="display: block; width: 100%; box-sizing: border-box"></textarea>
      </label>
      <p>
        <nala-button class="pixel-art-export-json">Export JSON</nala-button>
        <nala-button class="pixel-art-load-json" variant="secondary"
        >Load JSON</nala-button>
      </p>
      <p class="pixel-art-json-status" role="status"></p>
    `,
  onConnect: ({ query, listen, onCleanup })=>{
    const art = query("nala-pixel-art");
    const count = query(".pixel-art-count");
    const status = query(".pixel-art-save-status");
    const image = query(".pixel-art-saved");
    const json = query(".pixel-art-json");
    const jsonStatus = query(".pixel-art-json-status");
    const exportJson = query(".pixel-art-export-json");
    const loadJson = query(".pixel-art-load-json");
    if (!art || !count || !status || !image || !json || !jsonStatus || !exportJson || !loadJson) {
      throw new Error("Pixel art example is missing its elements");
    }
    art.palette = [
      "#184d3b",
      "#a43f35",
      "#f2c14e",
      "#2f5d8c"
    ];
    let url = null;
    const revoke = ()=>{
      if (url) URL.revokeObjectURL(url);
    };
    onCleanup(revoke);
    const updateCount = ()=>{
      count.textContent = `Painted pixels: ${art.toJSON().pixels.filter((pixel)=>pixel !== null).length}`;
    };
    listen(exportJson, "click", ()=>{
      json.value = JSON.stringify(art, null, 2);
      jsonStatus.textContent = "Exported drawing and editor settings.";
    });
    listen(loadJson, "click", ()=>{
      try {
        art.fromJSON(json.value);
        updateCount();
        jsonStatus.textContent = "Loaded drawing and editor settings.";
      } catch (error) {
        jsonStatus.textContent = `Could not load JSON: ${error instanceof Error ? error.message : String(error)}`;
      }
    });
    listen(art, "pixel-change", (event)=>{
      const { pixels } = event.detail;
      count.textContent = `Painted pixels: ${pixels.filter((pixel)=>pixel !== null).length}`;
    });
    listen(art, "pixel-save", (event)=>{
      event.preventDefault();
      const { blob, filename } = event.detail;
      revoke();
      url = URL.createObjectURL(blob);
      image.src = url;
      image.hidden = false;
      status.textContent = `Previewing ${filename} (${blob.size} bytes)`;
    });
  }
});
export const doc = {
  slug: "pixel-art",
  title: "Pixel art",
  tag: "<nala-pixel-art>",
  summary: "Draw a small pixel image, save a PNG, or restore editable JSON.",
  description: "A square pixel editor composed from nala-slider, nala-color-picker, and nala-button. Choose a canvas from 8 × 8 to 32 × 32 pixels, click or drag to paint, reuse colors from a palette or the automatic recent list, watch a live preview at an adjustable zoom, and save the result as a transparent PNG or an editable JSON snapshot.",
  usage: `<nala-pixel-art id="badge" size="16" color="#184d3b"
  label="Game Shelf badge canvas" filename="game-shelf-badge.png"
  export-scale="8"></nala-pixel-art>

const art = document.querySelector("#badge");
art?.addEventListener("pixel-change", (event) => {
  const { pixels } =
    (event as CustomEvent<{ pixels: readonly (string | null)[] }>).detail;
  console.log("Painted pixels:", pixels.filter(Boolean).length);
});`,
  preview: ()=>html`
      <docs-pixel-art-example></docs-pixel-art-example>
    `,
  api: [
    {
      name: "size",
      type: "number property / attribute",
      defaultValue: "16",
      description: "Canvas width and height in pixels. Must be an integer from 8 to 32; other values throw RangeError. Resizing keeps the overlapping top-left pixels."
    },
    {
      name: "color",
      type: "string property / attribute",
      defaultValue: '"#000000"',
      description: "Current paint color as a six-digit hex value. Updated by the built-in color picker."
    },
    {
      name: "pixels",
      type: "readonly (string | null)[] property",
      defaultValue: "[]",
      description: "Row-major pixel colors; null is transparent. Missing entries are transparent and extras are ignored. Assigning it re-renders without emitting events."
    },
    {
      name: "palette",
      type: "readonly string[] property",
      defaultValue: "[]",
      description: "Saved swatches. The + button appends the current color once and emits palette-change. Assign it to restore a stored palette."
    },
    {
      name: "recentColors",
      type: "readonly string[] property",
      defaultValue: "[]",
      description: "Up to eight recently painted colors, newest first, updated automatically while painting. Assigning it is silent."
    },
    {
      name: "label",
      type: "string property / attribute",
      defaultValue: '"Pixel art canvas"',
      description: "Accessible name of the pixel grid."
    },
    {
      name: "filename",
      type: "string property / attribute",
      defaultValue: '"pixel-art.png"',
      description: "Download name used by save()."
    },
    {
      name: "exportScale",
      type: "number property / export-scale attribute",
      defaultValue: "1",
      description: "Integer from 1 to 64. Each pixel becomes a scale × scale block in the PNG, so a 16 × 16 drawing with scale 8 exports at 128 × 128."
    },
    {
      name: "previewScale",
      type: "number property / preview-scale attribute",
      defaultValue: "4",
      description: "Integer from 1 to 8 for the live preview zoom. 1 shows the image at actual size; the Zoom slider in the Preview panel updates this property. It never changes the exported PNG."
    },
    {
      name: "disabled",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Locks drawing, resizing, color and swatch selection, adding swatches, and clearing. Saving remains available."
    },
    {
      name: "clear()",
      type: "method",
      defaultValue: "—",
      description: "Makes every pixel transparent without emitting events."
    },
    {
      name: "toJSON()",
      type: "method → NalaPixelArtData",
      defaultValue: "—",
      description: "Returns a detached version-1 snapshot: size, exactly size × size pixels, palette, recentColors, color, previewScale, and exportScale. Colors are lowercase and swatches are deduplicated. JSON.stringify(art) calls it automatically."
    },
    {
      name: "fromJSON(data)",
      type: "method (string | NalaPixelArtData) → void",
      defaultValue: "—",
      description: "Restores JSON text or a parsed snapshot, even while disconnected or disabled. Validates every field before changing the editor; malformed JSON, unsupported versions, invalid colors, sizes, scales, or pixel counts throw. Emits no events. Leaves label, filename, and disabled unchanged."
    },
    {
      name: "toBlob()",
      type: "method → Promise<Blob>",
      defaultValue: "—",
      description: "Encodes the current drawing as an image/png Blob."
    },
    {
      name: "save()",
      type: "method → Promise<Blob>",
      defaultValue: "—",
      description: "Encodes the PNG, emits pixel-save, and downloads it unless a listener calls preventDefault()."
    }
  ],
  slots: [],
  events: [
    {
      name: "pixel-change",
      type: "CustomEvent<{ pixels: readonly (string | null)[] }>",
      description: "Bubbles and is composed after the user paints, erases, or clears pixels."
    },
    {
      name: "palette-change",
      type: "CustomEvent<{ palette: readonly string[] }>",
      description: "Bubbles and is composed after the user adds a color to the palette."
    },
    {
      name: "pixel-save",
      type: "CustomEvent<{ blob: Blob; filename: string }>",
      description: "Bubbles, is composed, and is cancelable. Cancel it to upload or preview the PNG instead of downloading it."
    }
  ],
  parts: [
    "base",
    "stage",
    "inspector",
    "size-field",
    "color-field",
    "swatches",
    "swatch",
    "palette-swatch",
    "recent-swatch",
    "add-color",
    "canvas",
    "pixel",
    "preview",
    "preview-canvas",
    "zoom-field",
    "footer",
    "actions",
    "status",
    "clear",
    "save"
  ]
};
export const lessons = [
  {
    title: "Paint, erase, and use the keyboard",
    explanation: "Pressing on a pixel paints it with the current color. Pressing on a pixel that already has that color erases it instead, and dragging continues the same paint or erase stroke across the grid. The grid uses one roving tab stop: arrow keys, Home, and End move between pixels, and Enter or Space toggles the focused pixel.",
    code: `<nala-pixel-art size="8" color="#a43f35"
  label="Retro controller icon"></nala-pixel-art>`
  },
  {
    title: "Reuse colors with swatches",
    explanation: "Selecting a swatch makes it the paint color, exactly like choosing it in the color picker. The palette is yours to curate: the + button adds the current color unless it is already there. Recent colors fill themselves: every color you paint with moves to the front, duplicates are removed, and only the latest eight are kept. The Preview panel shows the finished image without grid lines. Its Zoom slider (the previewScale property, 1× to 8×, default 4×) enlarges it by a whole-number factor so every pixel stays crisp and evenly sized; 1× is the actual size. A larger preview scrolls inside its panel.",
    code: `import type { NalaPixelArtElement, NalaPixelArtPaletteChange } from "../../vendor/ui-components/dist/index.js";

const art = document.querySelector<NalaPixelArtElement>("#badge")!;
art.palette = JSON.parse(localStorage.getItem("game-shelf-palette") ?? "[]");
art.addEventListener("palette-change", (event) => {
  const { palette } = (event as CustomEvent<NalaPixelArtPaletteChange>).detail;
  localStorage.setItem("game-shelf-palette", JSON.stringify(palette));
});`
  },
  {
    title: "Store and restore a drawing",
    explanation: "A PNG is a finished image; JSON keeps the drawing editable. toJSON() returns a new NalaPixelArtData object with version: 1, size, exactly size × size row-major pixels, palette, recentColors, color, previewScale, and exportScale. Index y * size + x is the pixel at column x and row y; null means transparent. JSON.stringify(art) calls toJSON() automatically. fromJSON() accepts that JSON text or the parsed object, validates it completely, then restores the size before the pixels. Invalid input throws without changing the editor. Import emits no pixel-change or palette-change events, so loading does not accidentally save again. Label, filename, and disabled are presentation choices and are not persisted. The live example above lets you export, clear, and reload a snapshot without using storage.",
    code: `import type { NalaPixelArtElement } from "../../vendor/ui-components/dist/index.js";

const art = document.querySelector<NalaPixelArtElement>("#badge")!;
// Call from your application's Save drawing action.
function saveDrawing() {
  try {
    localStorage.setItem("game-shelf-badge", JSON.stringify(art));
  } catch (error) {
    console.error("Could not save the badge", error);
  }
}

try {
  const saved = localStorage.getItem("game-shelf-badge");
  if (saved !== null) art.fromJSON(saved);
} catch (error) {
  console.error("Could not restore the badge", error);
}

art.addEventListener("pixel-change", saveDrawing);
art.addEventListener("palette-change", saveDrawing);
// Also call saveDrawing after changing size, color, or scales:
// those property changes do not emit pixel-change.
`
  },
  {
    title: "Save as an image",
    explanation: "Save PNG calls save(): the drawing is painted onto an off-screen canvas with ImageData, encoded with canvas.toBlob as image/png, and offered as a download. Transparent pixels stay transparent. Cancel pixel-save when the Game Shelf app should upload the badge or show it instead.",
    code: `art.addEventListener("pixel-save", async (event) => {
  event.preventDefault();
  const { blob, filename } =
    (event as CustomEvent<{ blob: Blob; filename: string }>).detail;
  const body = new FormData();
  body.append("badge", blob, filename);
  await fetch("/api/badges", { method: "POST", body });
});`
  }
];
