import { createStore } from "../../../state/dist/index.js";
import { parseSpriteList, spritesheetMaxFrames } from "./spritesheet-data.js";
function at(entries, index) {
  if (!Number.isInteger(index) || index < 0 || index >= entries.length) {
    throw new RangeError("Spritesheet index is outside the collection");
  }
  return entries[index];
}
export function createSpritesheetStore() {
  const initial = {
    available: [],
    frames: [],
    nextId: 0
  };
  return createStore({
    state: initial,
    actions: ({ update })=>({
        loadAvailable (value) {
          const items = parseSpriteList(value, false);
          update((state)=>({
              ...state,
              available: items.map((data, index)=>({
                  id: state.nextId + index,
                  data
                })),
              nextId: state.nextId + items.length
            }));
        },
        loadFrames (value) {
          const items = parseSpriteList(value);
          update((state)=>({
              ...state,
              frames: items.map((data, index)=>({
                  id: state.nextId + index,
                  data
                })),
              nextId: state.nextId + items.length
            }));
        },
        add (index) {
          update((state)=>{
            const source = at(state.available, index);
            if (state.frames.length >= spritesheetMaxFrames) {
              throw new RangeError(`A spritesheet supports at most ${spritesheetMaxFrames} frames`);
            }
            const data = parseSpriteList([
              source.data
            ])[0];
            return {
              ...state,
              frames: [
                ...state.frames,
                {
                  id: state.nextId,
                  data
                }
              ],
              nextId: state.nextId + 1
            };
          });
        },
        remove (index) {
          update((state)=>{
            const item = at(state.frames, index);
            return {
              ...state,
              frames: state.frames.filter((frame)=>frame.id !== item.id)
            };
          });
        },
        move (index, destination) {
          update((state)=>{
            const item = at(state.frames, index);
            at(state.frames, destination);
            if (index === destination) return state;
            const frames = [
              ...state.frames
            ];
            frames.splice(index, 1);
            frames.splice(destination, 0, item);
            return {
              ...state,
              frames
            };
          });
        },
        clear () {
          update((state)=>state.frames.length ? {
              ...state,
              frames: []
            } : state);
        }
      })
  });
}
