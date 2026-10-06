import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
function badge(color) {
  return {
    version: 1,
    size: 8,
    pixels: Array.from({
      length: 64
    }, (_, index)=>{
      const x = index % 8;
      const y = Math.floor(index / 8);
      return Math.abs(x - 3.5) + Math.abs(y - 3.5) <= 3.5 ? color : null;
    }),
    palette: [
      "#184d3b",
      "#a43f35",
      "#f2c14e",
      "#2f5d8c"
    ],
    recentColors: [
      color
    ],
    color,
    previewScale: 4,
    exportScale: 8
  };
}
const sampleBadges = [
  badge("#184d3b"),
  badge("#2f5d8c")
];
defineComponent("docs-pixel-art-gallery-example", {
  template: ()=>html`
      <p>
        <label>
          Preview size
          <select class="preview-size">
            <option value="large">Large</option>
            <option value="medium">Medium</option>
            <option value="small">Small</option>
          </select>
        </label>
      </p>
      <nala-pixel-art-gallery label="Game Shelf badges"
        .items=${sampleBadges}></nala-pixel-art-gallery>
      <p>
        Export the saved collection, edit or delete a badge, then load the JSON
        to restore the exported collection. Unsaved drafts are not exported.
      </p>
      <label>
        Gallery JSON
        <textarea class="gallery-json" rows="6" spellcheck="false"
          style="display: block; width: 100%; box-sizing: border-box"></textarea>
      </label>
      <p class="button-row">
        <nala-button class="export-json">Export gallery JSON</nala-button>
        <nala-button class="load-json" variant="secondary"
        >Load gallery JSON</nala-button>
      </p>
      <p class="gallery-status" role="status">Two example badges are loaded.</p>
    `,
  onConnect: ({ query, listen })=>{
    const gallery = query("nala-pixel-art-gallery");
    const json = query(".gallery-json");
    const status = query(".gallery-status");
    const exportButton = query(".export-json");
    const loadButton = query(".load-json");
    const previewSize = query(".preview-size");
    if (!gallery || !json || !status || !exportButton || !loadButton || !previewSize) {
      throw new Error("Pixel art gallery example is missing its elements");
    }
    previewSize.value = gallery.previewSize;
    listen(previewSize, "change", ()=>{
      const value = previewSize.value;
      if (value !== "large" && value !== "medium" && value !== "small") {
        throw new TypeError("Unknown gallery preview size");
      }
      gallery.previewSize = value;
    });
    listen(gallery, "gallery-change", (event)=>{
      const { items, action, index } = event.detail;
      status.textContent = `${action === "create" ? "Created" : action === "update" ? "Updated" : "Deleted"} pixel art ${index + 1}. ${items.length} saved drawings.`;
    });
    listen(exportButton, "click", ()=>{
      json.value = JSON.stringify(gallery, null, 2);
      status.textContent = `Exported ${gallery.items.length} saved drawings.`;
    });
    listen(loadButton, "click", ()=>{
      try {
        gallery.fromJSON(json.value);
        status.textContent = `Loaded ${gallery.items.length} saved drawings.`;
      } catch (error) {
        status.textContent = `Could not load gallery: ${error instanceof Error ? error.message : String(error)}`;
      }
    });
  }
});
export const doc = {
  slug: "pixel-art-gallery",
  title: "Pixel art gallery",
  tag: "<nala-pixel-art-gallery>",
  summary: "Keep a collection of editable pixel drawings in one component.",
  description: "A responsive gallery of saved pixel art with a built-in editor. Open a thumbnail to continue drawing, create a new item, save it back to the collection, or delete it. Initialize it from the same versioned pixel-art JSON snapshots used by nala-pixel-art; storage and backend requests remain application-owned.",
  usage: `<nala-pixel-art-gallery id="badges"
  label="Game Shelf badges"></nala-pixel-art-gallery>

import type {
  NalaPixelArtGalleryElement,
} from "../../vendor/ui-components/dist/index.js";

const gallery = document.querySelector<NalaPixelArtGalleryElement>("#badges")!;
// savedBadges is an array of NalaPixelArtData from your app's storage.
gallery.items = savedBadges;
// Or restore the serialized array directly:
gallery.fromJSON(savedGalleryJson);`,
  preview: ()=>html`<docs-pixel-art-gallery-example></docs-pixel-art-gallery-example>`,
  api: [
    {
      name: "items",
      type: "readonly NalaPixelArtData[] property",
      defaultValue: "[]",
      description: "Saved drawings in display order. Assignment validates and copies the complete array, silently replaces the collection, and discards any draft. Reading returns a detached snapshot; mutate it and reassign to update the gallery. Duplicate drawings are allowed."
    },
    {
      name: "label",
      type: "string property / attribute",
      defaultValue: '"Pixel art gallery"',
      description: "Visible gallery heading and accessible name."
    },
    {
      name: "previewSize",
      type: '"large" | "medium" | "small" property / preview-size attribute',
      defaultValue: '"small"',
      description: "Thumbnail density: large keeps the original layout (10rem minimum card width); medium uses 8rem and small 6rem with reduced padding. Cards share available row width and shrink to fit narrow containers. Only presentation changes: canvas pixels, editor zoom, export, and JSON stay unchanged. Invalid values throw TypeError."
    },
    {
      name: "disabled",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Disables creating, opening, saving, deleting, and drawing. Cancel remains available, as do the editor's preview zoom and PNG export. Programmatic items assignment and import still work."
    },
    {
      name: "toJSON()",
      type: "method → NalaPixelArtData[]",
      defaultValue: "—",
      description: "Returns detached saved drawings, not the current draft. JSON.stringify(gallery) calls it automatically. The format is an ordinary array of version-1 pixel-art snapshots, without gallery-specific wrappers or IDs."
    },
    {
      name: "fromJSON(data)",
      type: "method (string | readonly NalaPixelArtData[]) → void",
      defaultValue: "—",
      description: "Restores JSON text or a parsed array. Validates every drawing before replacing anything. Invalid input throws and leaves both the collection and active draft unchanged. Successful import is silent and discards the draft; it works before connection too."
    }
  ],
  slots: [],
  events: [
    {
      name: "gallery-change",
      type: 'CustomEvent<{ items: NalaPixelArtData[]; action: "create" | "update" | "delete"; index: number }>',
      description: "Bubbling, composed notification after Save to gallery or Delete commits a change. items is a detached complete collection. index is zero-based: the added/updated position or the deleted item's former position. Creating/opening a draft, painting, Cancel, and imports emit no gallery-change."
    }
  ],
  parts: [
    "base",
    "header",
    "status",
    "gallery",
    "card",
    "item",
    "preview",
    "delete",
    "empty",
    "editor",
    "actions",
    "new",
    "save",
    "cancel"
  ]
};
export const lessons = [
  {
    title: "Choose a preview size",
    explanation: "Use large for the original roomy badge gallery, medium for a denser collection, or small to scan many Game Shelf badges at once. Try the Preview size selector in the live example above. The responsive grid uses minimum card widths of 10rem, 8rem, and 6rem respectively; cards grow to share the remaining row space and shrink when the container is narrower. This controls thumbnails only, not drawing resolution or the editor's preview zoom. Changing it preserves the saved drawings, draft, and canvas nodes, emits no gallery-change, and is not included in persisted JSON.",
    code: `<nala-pixel-art-gallery preview-size="medium"
  label="Game Shelf badges"></nala-pixel-art-gallery>

// With gallery referring to your NalaPixelArtGalleryElement:
gallery.previewSize = "small"; // The default.
gallery.previewSize = "large"; // The original roomy layout.`
  },
  {
    title: "Saved drawings and temporary drafts",
    explanation: "Think of the gallery as the Game Shelf badge collection and the editor as a temporary workspace. Clicking a thumbnail opens a copy, so painting cannot change the saved badge yet. Save to gallery replaces that badge in its original position; for a new drawing it appends one item. Cancel throws away the temporary workspace. New drawings start with the pixel editor's defaults: 16 × 16 transparent pixels, black paint, an empty palette, 4× preview zoom, and 1× PNG scale. Delete removes a saved item immediately; it does not ask for confirmation. PNG's Save button exports an image but does not commit the draft to the gallery.",
    code: `// Only saved drawings are included, even while editing:
const savedBadges = gallery.toJSON();
const json = JSON.stringify(gallery);
// Cancel and painting alone never change this saved collection.`
  },
  {
    title: "Load an array of pixel-art JSON",
    explanation: "Each item uses exactly the same NalaPixelArtData format as nala-pixel-art.toJSON(): version, size, pixels, palette, recentColors, color, previewScale, and exportScale. The array needs no new wrapper or IDs. The gallery creates private stable keys so duplicates can coexist and removing one card does not replace its neighbors' DOM nodes. Values are copied on input and output; accidental edits to your loaded array do not mutate the gallery. fromJSON validates every item before applying a replacement. A malformed second item cannot erase a valid first item or your current draft. A successful replacement intentionally discards the draft, so avoid refreshing backend data during editing unless that is what you want.",
    code: `import type {
  NalaPixelArtData,
  NalaPixelArtGalleryElement,
} from "../../vendor/ui-components/dist/index.js";

const gallery = document.querySelector<NalaPixelArtGalleryElement>("#badges")!;
const badge: NalaPixelArtData = {
  version: 1,
  size: 8,
  pixels: Array<string | null>(64).fill(null),
  palette: ["#184d3b"],
  recentColors: [],
  color: "#184d3b",
  previewScale: 4,
  exportScale: 8,
};
badge.pixels[27] = "#184d3b";
gallery.items = [badge];

const json = JSON.stringify(gallery);
gallery.fromJSON(json);`
  },
  {
    title: "Persist only committed gallery changes",
    explanation: "gallery-change is the persistence boundary: it fires after an item is saved or deleted, not after every stroke. Listen once and write detail.items to localStorage, or send it through your app's HttpClient to a backend. The component never chooses a storage key, writes browser storage, or sends a request itself. Loading is silent, so it does not immediately save again. The example below reports load and save failures instead of pretending persistence succeeded. A failed storage write does not roll back the in-memory collection; show the failure and offer a retry in your app. For backend saves, your app should serialize requests or track revisions to avoid older responses overwriting newer collections. Array positions are not durable backend record IDs; keep server metadata outside these drawing snapshots.",
    code: `import type {
  NalaPixelArtGalleryChange,
  NalaPixelArtGalleryElement,
} from "../../vendor/ui-components/dist/index.js";

const gallery = document.querySelector<NalaPixelArtGalleryElement>("#badges")!;
const key = "game-shelf-badges";

try {
  const saved = localStorage.getItem(key);
  if (saved !== null) gallery.fromJSON(saved);
} catch (error) {
  console.error("Could not load saved badges", error);
}

gallery.addEventListener("gallery-change", (event) => {
  const { items } =
    (event as CustomEvent<NalaPixelArtGalleryChange>).detail;
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.error("Could not persist badges; changes remain in memory", error);
  }
});`
  }
];
