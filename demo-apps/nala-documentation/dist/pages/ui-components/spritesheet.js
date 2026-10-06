import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
function badge(size, color) {
  return {
    version: 1,
    size,
    pixels: Array.from({
      length: size * size
    }, (_, index)=>{
      const x = index % size;
      const y = Math.floor(index / size);
      const center = (size - 1) / 2;
      return Math.abs(x - center) + Math.abs(y - center) <= size / 2 ? color : null;
    }),
    palette: [
      "#184d3b",
      "#2f5d8c",
      "#f2c14e"
    ],
    recentColors: [
      color
    ],
    color,
    previewScale: 4,
    exportScale: 8
  };
}
const samples = [
  badge(8, "#184d3b"),
  badge(16, "#2f5d8c"),
  badge(8, "#f2c14e")
];
defineComponent("docs-spritesheet-example", {
  template: ()=>html`
      <p>
        Add badges from the picker below. The connected gallery lets you create or
        edit drawings; saving refreshes the picker without changing existing frames.
      </p>
      <details>
        <summary>Edit source gallery</summary>
        <nala-pixel-art-gallery label="Game Shelf source badges"
          .items=${samples}></nala-pixel-art-gallery>
      </details>
      <nala-spritesheet label="Game Shelf badge spritesheet" columns="2"
        filename="game-shelf-badges.png"></nala-spritesheet>
      <p class="sheet-status" role="status">Choose badges to build a sheet.</p>
      <img class="saved-sheet" alt="Exported Game Shelf spritesheet"
        hidden style="max-width: 100%; image-rendering: pixelated" />
      <label>
        Spritesheet JSON
        <textarea class="sheet-json" rows="6" spellcheck="false"
          style="display: block; width: 100%; box-sizing: border-box"></textarea>
      </label>
      <p>
        <nala-button class="load-sheet" variant="secondary"
        >Load sheet JSON</nala-button>
      </p>
    `,
  onConnect: ({ query, listen, onCleanup })=>{
    const gallery = query("nala-pixel-art-gallery");
    const sheet = query("nala-spritesheet");
    const json = query(".sheet-json");
    const status = query(".sheet-status");
    const image = query(".saved-sheet");
    const load = query(".load-sheet");
    if (!gallery || !sheet || !json || !status || !image || !load) {
      throw new Error("Spritesheet example is missing its elements");
    }
    sheet.items = gallery.items;
    listen(gallery, "gallery-change", ()=>{
      sheet.items = gallery.items;
      status.textContent = "Updated the picker. Existing frames keep their own drawing copies.";
    });
    listen(sheet, "spritesheet-change", (event)=>{
      const { data } = event.detail;
      status.textContent = `${data.sprites.length} frames; PNG ${data.layout.width} × ${data.layout.height} px.`;
    });
    let url = null;
    const revoke = ()=>{
      if (url) URL.revokeObjectURL(url);
    };
    onCleanup(revoke);
    listen(sheet, "spritesheet-save", (event)=>{
      event.preventDefault();
      const { blob, data } = event.detail;
      revoke();
      url = URL.createObjectURL(blob);
      image.src = url;
      image.hidden = false;
      status.textContent = `Previewing exported PNG (${data.layout.width} × ${data.layout.height} px).`;
    });
    listen(sheet, "spritesheet-json-save", (event)=>{
      event.preventDefault();
      json.value = event.detail.json;
      status.textContent = "Exported editable JSON and PNG frame coordinates below.";
    });
    listen(load, "click", ()=>{
      try {
        sheet.fromJSON(json.value);
        status.textContent = `Restored ${sheet.sprites.length} frames.`;
      } catch (error) {
        status.textContent = `Could not load sheet: ${error instanceof Error ? error.message : String(error)}`;
      }
    });
  }
});
export const doc = {
  slug: "spritesheet",
  title: "Spritesheet",
  tag: "<nala-spritesheet>",
  summary: "Arrange gallery drawings into a transparent PNG and reloadable JSON.",
  description: "Build an ordered spritesheet from saved pixel art. Select drawings from a built-in picker, repeat frames, move them earlier or later, choose columns and export scale, then save PNG and JSON frame coordinates. Every frame is a copy, so later gallery edits cannot unexpectedly change your sheet.",
  usage: `<nala-spritesheet id="sheet" columns="4" export-scale="1"
  label="Game Shelf badges" filename="badges.png"></nala-spritesheet>

import type {
  NalaPixelArtGalleryElement,
  NalaSpritesheetElement,
} from "../../vendor/ui-components/dist/index.js";

// #badges is your existing nala-pixel-art-gallery.
const gallery = document.querySelector<NalaPixelArtGalleryElement>("#badges")!;
const sheet = document.querySelector<NalaSpritesheetElement>("#sheet")!;
sheet.items = gallery.items;
gallery.addEventListener("gallery-change", () => {
  sheet.items = gallery.items;
});`,
  preview: ()=>html`<docs-spritesheet-example></docs-spritesheet-example>`,
  api: [
    {
      name: "items",
      type: "readonly NalaPixelArtData[] property",
      defaultValue: "[]",
      description: "Drawings available in the picker, typically gallery.items. Validates and copies every drawing; reading returns a detached array. Replacing sources leaves existing sheet frames unchanged. This property is not persisted in sheet JSON."
    },
    {
      name: "sprites",
      type: "readonly NalaPixelArtData[] property",
      defaultValue: "[]",
      description: "Selected frames in order. Assignment validates and replaces all frames silently; reading returns detached drawings. Repeated drawings are allowed. Maximum 256 frames."
    },
    {
      name: "columns",
      type: "number property / attribute",
      defaultValue: "4",
      description: "Integer 1–32. Actual columns are min(columns, frame count), avoiding entirely empty columns. Rows are filled left to right, top to bottom; unused cells in the final row are transparent."
    },
    {
      name: "exportScale",
      type: "number property / export-scale attribute",
      defaultValue: "1",
      description: "Integer 1–8. Enlarges each pixel into a scale × scale block in PNG and scales JSON coordinates. Ignores each drawing's own PNG scale. The preview stays at original resolution with 4× CSS zoom."
    },
    {
      name: "label",
      type: "string property / attribute",
      defaultValue: '"Spritesheet"',
      description: "Visible heading, accessible section name, and sheet preview label."
    },
    {
      name: "filename",
      type: "string property / attribute",
      defaultValue: '"spritesheet.png"',
      description: "PNG download name. JSON uses the same base name with .json instead of a trailing .png."
    },
    {
      name: "disabled",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Locks adding, reordering, removing, clearing, columns, and scale controls. PNG/JSON export and programmatic updates remain available."
    },
    {
      name: "toJSON()",
      type: "method → NalaSpritesheetData",
      defaultValue: "—",
      description: "Detached version-1 object with columns, exportScale, ordered sprites, and derived layout/frame coordinates. JSON.stringify(sheet) calls it automatically. Empty sheets can be persisted."
    },
    {
      name: "fromJSON(data)",
      type: "method (string | NalaSpritesheetData) → void",
      defaultValue: "—",
      description: "Validates every drawing, setting, and layout coordinate before changing the sheet. Restores settings and frames silently, including before connection. Leaves picker items, label, filename, and disabled unchanged. Invalid input throws without changing the sheet."
    },
    {
      name: "toBlob()",
      type: "method → Promise<Blob>",
      defaultValue: "—",
      description: "Encodes image/png without downloading. Rejects empty sheets or dimensions above 8192px on either axis, before allocating pixel data. Increase columns or reduce scale for overly tall sheets. Canvas/encoding failures also reject."
    },
    {
      name: "save()",
      type: "method → Promise<Blob>",
      defaultValue: "—",
      description: "Captures frames/settings, encodes PNG, emits spritesheet-save with the matching JSON snapshot, and downloads unless canceled. Edits during encoding do not change that export. UI failures are shown in feedback."
    },
    {
      name: "saveJSON()",
      type: "method → NalaSpritesheetData",
      defaultValue: "—",
      description: "Exports formatted JSON, emits spritesheet-json-save, and downloads unless canceled. Empty sheets are allowed. Returns the detached snapshot."
    }
  ],
  slots: [],
  events: [
    {
      name: "spritesheet-change",
      type: "CustomEvent<{ data: NalaSpritesheetData }>",
      description: "Bubbling, composed notification after user add, move, remove, clear, or columns/scale input. Property writes and import are silent. Use detail.data as the persistence boundary."
    },
    {
      name: "spritesheet-save",
      type: "CustomEvent<{ blob: Blob; filename: string; data: NalaSpritesheetData }>",
      description: "Bubbling, composed, cancelable event after PNG encoding. Call preventDefault() to upload or preview instead of downloading. data contains coordinates for this exact PNG."
    },
    {
      name: "spritesheet-json-save",
      type: "CustomEvent<{ json: string; filename: string; data: NalaSpritesheetData }>",
      description: "Bubbling, composed, cancelable event before JSON download. Cancel to persist or display it yourself."
    }
  ],
  parts: [
    "base",
    "header",
    "status",
    "controls",
    "picker",
    "item",
    "thumbnail",
    "frames",
    "frame",
    "move",
    "remove",
    "empty",
    "preview",
    "canvas",
    "actions",
    "save",
    "save-json",
    "clear",
    "feedback"
  ]
};
export const lessons = [
  {
    title: "From a drawing gallery to an ordered sheet",
    explanation: "A gallery is your library; a spritesheet is a chosen sequence. Set items from gallery.items (or an array of pixel-art snapshots loaded from storage), then click the picker to add a frame. You can add one drawing repeatedly to hold an animation pose. Earlier and Later change its position; Remove affects only the sheet, never the source gallery. Frames are copied when selected. Refreshing items after a gallery save changes the picker, not frames you already chose. In the live example, expand Edit source gallery to create a badge, save it, and see it appear in the picker. To intentionally rebuild the sheet from current drawings, assign sprites yourself.",
    code: `sheet.items = gallery.items;
gallery.addEventListener("gallery-change", () => {
  sheet.items = gallery.items;
});

// Or select all drawings programmatically, in gallery order:
sheet.sprites = gallery.items;`
  },
  {
    title: "Cells, coordinates, and transparent padding",
    explanation: "The largest selected drawing defines one square cell. If your frames are 8px and 16px wide, both occupy 16 × 16 cells; the 8px drawing stays at the top-left with transparent space to its right and below. No stretching, resampling, gutters, or tight packing is applied. Frames fill rows left to right. Configured columns are an upper bound: a sheet with two frames and columns=4 has only two columns. At exportScale=2, cells become 32px and an 8px drawing becomes 16px. JSON uses exported PNG coordinates: width/height are the full padded cell, while contentWidth/contentHeight describe the drawing's occupied square, not a crop to its opaque pixels. Trailing unused cells are transparent. Removing the largest drawing can reduce cell size and shift every coordinate.",
    code: `sheet.columns = 2;
sheet.exportScale = 2;

const { layout } = sheet.toJSON();
// For three frames of sizes 8, 16, and 8:
// layout.width = 64, layout.height = 64, layout.cellSize = 32
// layout.frames[2] = {
//   index: 2, x: 0, y: 32, width: 32, height: 32,
//   contentWidth: 16, contentHeight: 16
// };

// Rendering a frame from the exported PNG on a native canvas:
// png is a loaded HTMLImageElement; context is a CanvasRenderingContext2D.
const frame = layout.frames[2];
context.imageSmoothingEnabled = false;
context.drawImage(png, frame.x, frame.y, frame.width, frame.height,
  0, 0, frame.width, frame.height);`
  },
  {
    title: "Save a complete PNG and its matching frame data",
    explanation: "Save PNG calls save(). It captures the sheet before asynchronous encoding, so edits made while encoding cannot change the PNG or the JSON supplied with that event. Keep blob and data together when uploading to your backend. The sheet-wide export scale applies to every frame; individual drawings' exportScale values are preserved for editing but ignored for sheet rendering. A sheet supports up to 256 frames, columns 1–32, and scale 1–8. PNG dimensions must stay at or below 8192px on each axis; a long one-column sheet at high scale may exceed that limit. Its JSON can still be saved, but PNG export rejects with guidance to increase columns or reduce scale. Empty sheets can save JSON, not PNG. The example cancels downloads and shows PNG and JSON locally.",
    code: `import type {
  NalaSpritesheetSave,
} from "../../vendor/ui-components/dist/index.js";

sheet.addEventListener("spritesheet-save", (event) => {
  event.preventDefault();
  const { blob, data, filename } =
    (event as CustomEvent<NalaSpritesheetSave>).detail;
  const body = new FormData();
  body.append("image", blob, filename);
  body.append("sheet", JSON.stringify(data));
  // Submit body through your application's HTTP client.
});`
  },
  {
    title: "Persist and reload without losing the source drawings",
    explanation: "toJSON includes version: 1, columns, exportScale, sprites, and layout. Every sprite is a full pixel-art snapshot, so reloading needs neither the original gallery nor a PNG. items is deliberately excluded: it is a source library, not part of the selected sheet. fromJSON checks the supplied coordinates against the drawings and settings before applying any change; if you hand-edit sprites or settings, obtain a fresh snapshot rather than retaining stale layout values. Successful import is silent. Listen for spritesheet-change to persist user changes; imports and programmatic changes do not emit it. Storage belongs to your app, and failures should be reported. Large backend libraries can populate the picker, but selected frames are capped at 256. The component has no animation playback, backend IDs, automatic gallery link, or auto-refresh of selected copies.",
    code: `import type {
  NalaSpritesheetChange,
} from "../../vendor/ui-components/dist/index.js";

const key = "game-shelf-badge-sheet";
try {
  const saved = localStorage.getItem(key);
  if (saved !== null) sheet.fromJSON(saved);
} catch (error) {
  console.error("Could not load spritesheet", error);
}

sheet.addEventListener("spritesheet-change", (event) => {
  const { data } = (event as CustomEvent<NalaSpritesheetChange>).detail;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Could not persist spritesheet; changes remain in memory", error);
  }
});`
  }
];
