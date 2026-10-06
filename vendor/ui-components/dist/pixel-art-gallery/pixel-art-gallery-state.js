import { createStore } from "../../../state/dist/index.js";
import { parsePixelArtData } from "../pixel-art/pixel-art-data.js";
function parseItems(value) {
  const items = typeof value === "string" ? JSON.parse(value) : value;
  if (!Array.isArray(items)) {
    throw new TypeError("Pixel art gallery items must be an array");
  }
  return Array.from(items, parsePixelArtData);
}
function entryAt(state, index) {
  if (!Number.isInteger(index) || index < 0 || index >= state.entries.length) {
    throw new RangeError("Pixel art gallery index is outside the collection");
  }
  return state.entries[index];
}
export function createPixelArtGalleryStore() {
  const initialState = {
    entries: [],
    draft: null,
    nextId: 0
  };
  return createStore({
    state: initialState,
    actions: ({ update })=>({
        load (value) {
          const items = parseItems(value);
          update((state)=>({
              entries: items.map((data, index)=>({
                  id: state.nextId + index,
                  data
                })),
              draft: null,
              nextId: state.nextId + items.length
            }));
        },
        create () {
          const data = {
            version: 1,
            size: 16,
            pixels: Array(256).fill(null),
            palette: [],
            recentColors: [],
            color: "#000000",
            previewScale: 4,
            exportScale: 1
          };
          update((state)=>({
              ...state,
              draft: {
                id: state.nextId,
                data,
                isNew: true
              },
              nextId: state.nextId + 1
            }));
        },
        edit (index) {
          update((state)=>{
            const entry = entryAt(state, index);
            return {
              ...state,
              draft: {
                id: entry.id,
                data: parsePixelArtData(entry.data),
                isNew: false
              }
            };
          });
        },
        save (value) {
          const data = parsePixelArtData(value);
          update((state)=>{
            const draft = state.draft;
            if (!draft) throw new Error("Pixel art gallery has no active draft");
            const entry = {
              id: draft.id,
              data
            };
            return {
              ...state,
              entries: draft.isNew ? [
                ...state.entries,
                entry
              ] : state.entries.map((item)=>item.id === draft.id ? entry : item),
              draft: null
            };
          });
        },
        cancel () {
          update((state)=>state.draft ? {
              ...state,
              draft: null
            } : state);
        },
        remove (index) {
          update((state)=>{
            const entry = entryAt(state, index);
            return {
              ...state,
              entries: state.entries.filter((item)=>item.id !== entry.id),
              draft: state.draft?.id === entry.id ? null : state.draft
            };
          });
        },
        captureDraft (value) {
          const data = parsePixelArtData(value);
          update((state)=>state.draft ? {
              ...state,
              draft: {
                ...state.draft,
                data
              }
            } : state);
        }
      })
  });
}
