import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
function tile(kind) {
  const pixels = Array.from({
    length: 64
  }, (_, index)=>{
    const x = index % 8, y = Math.floor(index / 8);
    if (kind === "grass") {
      return y < 2 ? "#184d3b" : (x + y) % 3 === 0 ? "#805538" : "#ae8058";
    }
    if (kind === "brick") {
      return y % 4 === 0 || (x + (y < 4 ? 0 : 4)) % 8 === 0 ? "#805538" : "#a43f35";
    }
    return Math.abs(x - 3.5) + Math.abs(y - 3.5) <= 3 ? "#f2c14e" : null;
  });
  return {
    version: 1,
    size: 8,
    pixels,
    palette: [
      "#184d3b",
      "#a43f35",
      "#f2c14e"
    ],
    recentColors: [],
    color: "#184d3b",
    previewScale: 4,
    exportScale: 1
  };
}
const samples = [
  tile("grass"),
  tile("brick"),
  tile("coin")
];
defineComponent("docs-level-editor-example", {
  template: ()=>html`
      <details>
        <summary>Build or rearrange the source spritesheet</summary>
        <nala-spritesheet label="Game Shelf platform tiles" .items=${samples}
          .sprites=${samples} columns="3"></nala-spritesheet>
        <p>
          Applying a spritesheet clears artwork, collision, player spawn and undo history.
          Save your current level first if you want to keep it.
        </p>
        <nala-button class="apply-sheet"
          variant="secondary">Apply spritesheet to map</nala-button>
      </details>
      <nala-level-editor label="Game Shelf platform level"
        filename="game-shelf-level.json" zoom="4"></nala-level-editor>
      <p>
        Try Play preview: walk with Left/Right or A/D, jump with Space/Up/W.
        The blue player starts on the ground; coins are decorative, not collectibles.
        Stop returns to editing. Orange cells show collision; blue S is the player spawn.
      </p>
      <p class="level-status" role="status">An example platform level is loaded.</p>
      <label>
        Level JSON (includes spritesheet)
        <textarea class="level-json" rows="6" spellcheck="false"
          style="display: block; width: 100%; box-sizing: border-box"></textarea>
      </label>
      <p>
        <nala-button class="load-level"
          variant="secondary">Load level JSON</nala-button>
      </p>
    `,
  onConnect: ({ query, listen })=>{
    const editor = query("nala-level-editor");
    const sheet = query("nala-spritesheet");
    const apply = query(".apply-sheet");
    const load = query(".load-level");
    const json = query(".level-json");
    const status = query(".level-status");
    if (!editor || !sheet || !apply || !load || !json || !status) {
      throw new Error("Level editor example is missing its elements");
    }
    if (!editor.spritesheet) {
      editor.spritesheet = sheet.toJSON();
      editor.resize(24, 12);
      editor.tiles = Array.from({
        length: 24 * 12
      }, (_, index)=>{
        const x = index % 24, y = Math.floor(index / 24);
        if (y >= 10 && x !== 20 && x !== 21) return 0;
        if (y === 8 && x >= 5 && x <= 9 || y === 6 && x >= 10 && x <= 14) {
          return 1;
        }
        if (y === 7 && x === 7 || y === 5 && x === 12) return 2;
        return null;
      });
      editor.collision = editor.tiles.map((frame)=>frame === 0 || frame === 1);
      editor.spawn = {
        x: 2,
        y: 9
      };
    }
    listen(editor, "level-change", (event)=>{
      const { data } = event.detail;
      status.textContent = `${data.width} × ${data.height} tiles; ${data.tiles.filter((tile)=>tile !== null).length} placed; ${data.collision.filter(Boolean).length} solid; ${data.spawn ? `spawn at ${data.spawn.x + 1}, ${data.spawn.y + 1}` : "no spawn"}.`;
    });
    listen(editor, "level-save", (event)=>{
      event.preventDefault();
      json.value = event.detail.json;
      status.textContent = "Exported the level and its spritesheet below.";
    });
    listen(apply, "click", ()=>{
      if (!globalThis.confirm("Apply this spritesheet? This clears artwork, collision, player spawn and undo history. Save the current level first if needed.")) return;
      editor.spritesheet = sheet.toJSON();
      status.textContent = "Applied spritesheet. The map is blank and ready to paint.";
    });
    listen(load, "click", ()=>{
      try {
        editor.fromJSON(json.value);
        status.textContent = "Restored the level and embedded spritesheet. Undo history is reset.";
      } catch (error) {
        status.textContent = `Could not load level: ${error instanceof Error ? error.message : String(error)}`;
      }
    });
  }
});
export const doc = {
  slug: "level-editor",
  title: "Level editor",
  tag: "<nala-level-editor>",
  summary: "Paint artwork, collision and a player spawn, then test your platform level.",
  description: "A native canvas editor with independent artwork and solid collision layers, one player spawn, undo/redo, versioned JSON and an isolated playable preview. Walk, jump and test platforms without changing the document. The preview is a small fixed-physics test tool, not a full game engine.",
  usage: `<nala-level-editor id="level" label="Game Shelf platform level"
  zoom="4" filename="level.json"></nala-level-editor>

import type {
  NalaLevelEditorElement,
  NalaSpritesheetElement,
} from "../../vendor/ui-components/dist/index.js";

// #sheet is an existing nala-spritesheet.
const sheet = document.querySelector<NalaSpritesheetElement>("#sheet")!;
const editor = document.querySelector<NalaLevelEditorElement>("#level")!;
editor.spritesheet = sheet.toJSON(); // Clears the map and history.
editor.resize(48, 24);`,
  preview: ()=>html`<docs-level-editor-example></docs-level-editor-example>`,
  api: [
    {
      name: "spritesheet",
      type: "NalaSpritesheetData | null property",
      defaultValue: "null",
      description: "Validated, detached spritesheet snapshot. Every assignment clears artwork, collision, spawn and history, even when frames look similar. null unloads the sheet. Stops a running preview. Reading returns a copy. Pre-registration properties replay on connection in order: spritesheet, tiles, collision, spawn, selectedFrame, tool. Methods require the import first."
    },
    {
      name: "tiles",
      type: "readonly (number | null)[] property",
      defaultValue: "512 nulls",
      description: "Row-major frame indexes: tiles[y * mapWidth + x]. null is empty. Requires exactly mapWidth × mapHeight entries and valid indexes. Assignment copies, stops preview, resets history silently and preserves collision/spawn."
    },
    {
      name: "collision",
      type: "readonly boolean[] property",
      defaultValue: "512 false values",
      description: "Independent row-major solid cells: collision[y * mapWidth + x]. Exact size required, booleans only. Can be solid without artwork or decorative with artwork. Read/write copies; assignment stops preview and resets history silently."
    },
    {
      name: "spawn",
      type: "NalaLevelSpawn | null property",
      defaultValue: "null",
      description: "One { x, y } player start in integer cell coordinates, or null. Read/write copies; assignment stops preview and resets history silently. A solid spawn is allowed while authoring, but Play reports an error until it is fixed."
    },
    {
      name: "tool",
      type: '"tiles" | "collision" | "spawn" property',
      defaultValue: '"tiles"',
      description: "Temporary editing layer, excluded from JSON. Collision selects the solid brush; its Eraser removes collision only. Spawn places/moves a single point; Eraser or Delete removes it. Clicking a frame returns to artwork."
    },
    {
      name: "play() / stop() / playing",
      type: "methods → void / readonly boolean property",
      defaultValue: "false",
      description: "play() needs a connected editor and a non-solid spawn, otherwise throws (toolbar displays the error). Locks editing while running, preserves document/history/cursor and restores editor scroll on Stop. Escape stops; R respawns. Leaving canvas focus or hiding the page pauses and releases inputs. Focus resumes; disconnect stops and cancels animation."
    },
    {
      name: "mapWidth / mapHeight",
      type: "readonly number properties",
      defaultValue: "32 / 16",
      description: "Dimensions in tile cells, not pixels. Use resize(width, height) or the map controls to change both."
    },
    {
      name: "selectedFrame",
      type: "number | null property",
      defaultValue: "null",
      description: "Zero-based spritesheet frame index for painting; null selects Eraser. Loading a nonempty sheet selects frame 0. Selection is temporary UI state, excluded from JSON."
    },
    {
      name: "zoom",
      type: "number property / attribute",
      defaultValue: "2",
      description: "Integer 1–8, screen pixels per original artwork pixel. Adjusts viewing/interaction only, not tiles or persisted JSON. Available while disabled."
    },
    {
      name: "label",
      type: "string property / attribute",
      defaultValue: '"Platform level"',
      description: "Visible heading and accessible canvas/section name."
    },
    {
      name: "filename",
      type: "string property / attribute",
      defaultValue: '"level.json"',
      description: "Download filename used by save()."
    },
    {
      name: "disabled",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Locks editing, layer/brush selection, resize, clear and undo/redo. Viewing, zoom, JSON save, Play/Stop and programmatic updates remain available. Disabling during a stroke finishes it."
    },
    {
      name: "resize(width, height)",
      type: "method → void",
      defaultValue: "—",
      description: "Integers 1–128. Keeps top-left artwork/collision, pads with null/false and crops right/bottom. A cropped spawn becomes null. Undo restores all layers/spawn and dimensions. Stops preview; programmatic calls are silent."
    },
    {
      name: "clear()",
      type: "method → void",
      defaultValue: "—",
      description: "Clears artwork, collision and spawn while retaining sheet and map size. Undoable; fully blank is a no-op. Stops preview; programmatic calls are silent."
    },
    {
      name: "undo() / redo()",
      type: "methods → void",
      defaultValue: "—",
      description: "Restore map edits including resize and clear. A complete drag counts as one step; at most 100 steps. A new edit discards redo. Empty history is a no-op. Programmatic calls are silent."
    },
    {
      name: "canUndo / canRedo",
      type: "readonly boolean properties",
      defaultValue: "false",
      description: "Whether a past/future committed map edit exists."
    },
    {
      name: "toJSON()",
      type: "method → NalaLevelData",
      defaultValue: "—",
      description: "Detached { version: 2, width, height, spritesheet, tiles, collision, spawn }. JSON.stringify(editor) calls it automatically. Contains the full sheet; excludes zoom, tool/brush, cursor, history, player simulation and presentation. Playing never changes the snapshot."
    },
    {
      name: "fromJSON(data)",
      type: "method (string | NalaLevelData | NalaLegacyLevelData) → void",
      defaultValue: "—",
      description: "Validates the entire document before changing anything. Version 1 migrates to version 2 with all-false collision and null spawn; no gameplay is inferred from artwork. Version 2 requires collision and spawn. Successful import stops preview, resets history and selects the first frame or Eraser. Invalid input leaves data, history and running preview intact. Works before connection."
    },
    {
      name: "save()",
      type: "method → NalaLevelData",
      defaultValue: "—",
      description: "Finishes any active stroke, emits level-save with formatted JSON, and downloads unless canceled. Returns the detached snapshot."
    }
  ],
  slots: [],
  events: [
    {
      name: "level-change",
      type: "CustomEvent<{ data: NalaLevelData }>",
      description: "Bubbles and is composed after changed artwork/collision/spawn edits, user resize, clear, undo or redo. A drag is one event and undo step. No-op strokes emit nothing. Cancel, blur and disconnect finish strokes. Imports/property writes and the entire preview are silent."
    },
    {
      name: "level-save",
      type: "CustomEvent<{ data: NalaLevelData; json: string; filename: string }>",
      description: "Bubbling, composed, cancelable event. preventDefault() to display, store or upload JSON instead of downloading."
    }
  ],
  parts: [
    "base",
    "header",
    "status",
    "controls",
    "resize",
    "tools",
    "mode-tools",
    "tile-tool",
    "collision-tool",
    "spawn-tool",
    "solid",
    "play",
    "preview-status",
    "eraser",
    "undo",
    "redo",
    "clear",
    "palette",
    "frame",
    "empty",
    "viewport",
    "canvas",
    "cursor-status",
    "actions",
    "save",
    "feedback"
  ]
};
export const lessons = [
  {
    title: "Turn spritesheet frames into map tiles",
    explanation: "A level is not one enormous image: it is a grid of references to artwork. Each cell stores one zero-based frame index or null for empty space. The editor takes the full JSON produced by nala-spritesheet, not an image URL. It draws the original artwork pixels; sheet columns and exportScale describe the exported PNG but do not stretch tiles in the map. The largest drawing determines one square tile cell, with smaller drawings aligned top-left and transparent padding. With no artwork, the empty grid uses 16px cells. Load your sheet explicitly: assigning a different sheet clears the map and history because reordering frames would otherwise silently turn grass into coins. There is no automatic subscription to a spritesheet component.",
    code: `editor.spritesheet = sheet.toJSON();
editor.resize(32, 16);
editor.selectedFrame = 0; // First frame as the paint brush.

// Build a simple ground row without pointer input:
const tiles = [...editor.tiles];
for (let x = 0; x < editor.mapWidth; x++) {
  tiles[(editor.mapHeight - 1) * editor.mapWidth + x] = 0;
}
editor.tiles = tiles; // Validates all entries and resets history.`
  },
  {
    title: "Paint, erase, scroll, and use the keyboard",
    explanation: "Select a frame button, then press and drag across the canvas. Sampling a fast pointer can skip cells, so the editor fills a line between samples. One drag is one undo action; repainting identical values creates no action. Eraser writes null. The canvas captures its pointer and finishes the stroke on release, cancel, capture loss or window blur, so dragging outside does not leave a stuck brush. It does not auto-scroll while dragging: release, scroll the native viewport, then continue painting. Zoom changes viewing only. The canvas bitmap is viewport-sized and redraws visible tiles on scroll/resize, even for 128 × 128 maps. With the canvas focused, arrow keys move a highlighted cell and reveal it, Enter/Space paints, Delete/Backspace erases, Ctrl/Cmd+Z undoes, and Ctrl/Cmd+Shift+Z redoes. Cursor coordinates are announced in text. Keyboard shortcuts are canvas-scoped and do not intercept typing in the size fields or JSON textarea.",
    code: `editor.selectedFrame = 2; // Paint frame 3.
editor.selectedFrame = null; // Eraser.
editor.zoom = 4;

// Your own toolbar can use these public methods:
editor.undo();
editor.redo();
console.log(editor.canUndo, editor.canRedo);`
  },
  {
    title: "Separate appearance from solid geometry",
    explanation: "The orange overlay is an independent collision layer. An artwork tile can be decoration with no collision, and an invisible cell can be solid. This avoids turning every copy of a drawing into the same gameplay object. Choose Collision, then paint Solid cell or use Eraser to remove only collision. Choose Artwork to change pictures without changing geometry. Both layers share the same row-major coordinates and undo history. The sample initializes collision explicitly for its ground and platforms; the editor never guesses collision from colors, frame names or indexes.",
    code: `// Make the bottom row solid, regardless of its artwork.
const collision = Array<boolean>(editor.mapWidth * editor.mapHeight).fill(false);
for (let x = 0; x < editor.mapWidth; x++) {
  collision[(editor.mapHeight - 1) * editor.mapWidth + x] = true;
}
editor.collision = collision; // Silent baseline assignment, resets history.
editor.tool = "collision"; // UI only; not persisted.`
  },
  {
    title: "Place the player start and try your platforms",
    explanation: "Choose Player spawn and click an empty collision cell. The blue S marks exactly one start cell: placing another moves it, rather than adding another player. Eraser or Delete removes the start. Spawn moves and collision strokes can be undone just like artwork. Play needs a spawn, and refuses one inside a solid cell with a visible error. A start may be in mid-air; gravity will take the player to the first solid surface below. The small blue rectangle fits inside one cell. Try the live sample: walk toward a platform, jump onto it, and walk into the gap near the right edge to see automatic respawn.",
    code: `editor.spawn = { x: 2, y: editor.mapHeight - 2 };
editor.tool = "spawn";

// Wait until the element is connected before playing.
editor.play();
console.log(editor.playing); // true
editor.stop();`
  },
  {
    title: "A predictable, isolated game loop",
    explanation: "Play replaces the editor's grid/overlays with artwork and a player. Focus the canvas to walk using Left/Right or A/D; press Space, Up or W for a grounded jump. There is no double jump or held-key auto-jump. R resets the player to spawn; falling two cells below the map respawns automatically. Side boundaries block escape, but the bottom is open. The camera centers on the player and clamps to the map edges. Controls are keyboard-based, not touch game controls. Leaving canvas focus, hiding the document or blurring the window clears held inputs and pauses; refocusing resumes without simulating the missed time. Escape or Stop returns to editing and restores scroll. The canvas and its focus identity are preserved. Editing controls are locked while playing, but zoom and JSON save remain available.",
    code: `const before = JSON.stringify(editor);
editor.play();
// Move and jump in the focused canvas...
editor.stop();
console.assert(JSON.stringify(editor) === before);`
  },
  {
    title: "How the preview checks collisions",
    explanation: "The browser's requestAnimationFrame schedules painting, while physics advances in fixed 1/120-second steps. At most eight steps are processed per frame: slow or paused tabs do not create a huge catch-up burst. Positions are measured in tile units, so zoom and spritesheet exportScale never change physics. Horizontal speed is 5 cells/second; gravity is 30 cells/second squared, jump speed is 12 cells/second upward, and falling speed is capped at 18. The rectangular player is 0.65 cells wide and 0.85 cells tall. Each step moves horizontally, then vertically, sweeping the crossed rows/columns against the solid grid. Landing snaps the feet to a platform and enables jumping; a ceiling stops upward motion. This is full-cell, axis-aligned collision, not pixel-perfect artwork collision, slopes or one-way platforms.",
    code: `const level = editor.toJSON();
const x = 4, y = 8;
const index = y * level.width + x;
console.log(level.tiles[index]);     // Artwork frame or null.
console.log(level.collision[index]); // Independent solid boolean.
console.log(level.spawn);            // Start cell or null.`
  },
  {
    title: "Resize without losing the ability to undo",
    explanation: "Map dimensions are tile counts, each from 1 to 128. Resize applies both together. Growth pads artwork with null and collision with false; shrinking crops right/bottom and removes a spawn outside the new bounds. Undo restores every layer, the spawn and previous dimensions. Clear map empties artwork, collision and spawn but keeps the spritesheet. History stores at most 100 edits; a new edit drops the redo branch. Loading a level or assigning tiles, collision, spawn or a sheet intentionally resets history: these establish a baseline rather than a brush edit. For a coordinated setup, use fromJSON with all fields. Any successful document update stops the preview; invalid input leaves it running unchanged.",
    code: `editor.resize(48, 24);
editor.clear(); // Sheet and dimensions stay.
editor.undo(); // Restores artwork, collision and spawn.
editor.undo(); // Restores the previous map size too.`
  },
  {
    title: "Save a self-contained editable level",
    explanation: "JSON now includes version: 2, width, height, spritesheet, tiles, collision and spawn. The importer still accepts version 1 and migrates it to all-false collision and null spawn; old artwork is preserved but is not automatically made solid. Version 2 requires exactly width × height boolean collision entries and an in-bounds integer spawn or null. The embedded sheet keeps the level self-contained offline. Bad JSON leaves the map, history and preview intact. fromJSON is silent and establishes a baseline. level-change occurs once per changed stroke or user edit, never on a physics tick. Persist that event's data yourself. The live example cancels downloads and offers JSON export/import below the editor. Applying a replacement sheet confirms the loss of artwork, collision, spawn and history.",
    code: `import type {
  NalaLevelChange,
  NalaLevelSave,
} from "../../vendor/ui-components/dist/index.js";

const key = "game-shelf-platform-level";
try {
  const saved = localStorage.getItem(key);
  if (saved !== null) editor.fromJSON(saved);
} catch (error) {
  console.error("Could not restore level", error);
}

editor.addEventListener("level-change", (event) => {
  const { data } = (event as CustomEvent<NalaLevelChange>).detail;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Could not persist level; edits remain in memory", error);
  }
});

editor.addEventListener("level-save", (event) => {
  event.preventDefault();
  const { json } = (event as CustomEvent<NalaLevelSave>).detail;
  // Send json through your application's HTTP client.
});`
  },
  {
    title: "Where the editor ends and a game begins",
    explanation: "The built-in preview tests a single visual layer, full-cell solid collision and one player start. It is not a production game engine: there are no enemies, checkpoints, collectibles, animation, slopes, one-way platforms, touch controls or configurable physics. The sample's coin remains decorative. Your own runtime can read tiles, collision and spawn, and use spritesheet.layout.frames to crop the exported PNG. World positions use the largest original sprite.size, without sheet exportScale or editor zoom. Player positions, velocity, held inputs and camera are temporary preview state; none is saved or sent through level-change.",
    code: `const level = editor.toJSON();
const spritesheet = level.spritesheet;
if (spritesheet) {
  const worldTileSize = spritesheet.sprites.length
    ? Math.max(...spritesheet.sprites.map((sprite) => sprite.size))
    : 16;
  const x = 5, y = 3;
  const index = level.tiles[y * level.width + x];
  if (index !== null) {
    const frame = spritesheet.layout.frames[index];
    // Use frame.x/y/width/height to crop the exported PNG,
    // then draw at x * worldTileSize, y * worldTileSize.
  }
}`
  }
];
