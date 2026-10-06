import { createStore } from "../../../state/dist/index.js";
import { parseSpritesheetData } from "../spritesheet/spritesheet-data.js";
import { parseLevelData, parseLevelSpawn, resizeLevel, setLevelCollision, setLevelSpawn, setLevelTile, validateLevelCollision, validateLevelTiles } from "./level-data.js";
function commit(state, data) {
  if (state.data === data) return state;
  return {
    data,
    past: [
      ...state.past,
      state.data
    ].slice(-100),
    future: [],
    stroke: null
  };
}
export function createLevelStore() {
  const initial = {
    data: {
      version: 2,
      width: 32,
      height: 16,
      spritesheet: null,
      tiles: Array(512).fill(null),
      collision: Array(512).fill(false),
      spawn: null
    },
    past: [],
    future: [],
    stroke: null
  };
  return createStore({
    state: initial,
    actions: ({ get, update, set })=>({
        load (value) {
          const data = parseLevelData(value);
          set({
            data,
            past: [],
            future: [],
            stroke: null
          });
        },
        setSheet (value) {
          const spritesheet = value === null ? null : parseSpritesheetData(value);
          update((state)=>({
              data: {
                ...state.data,
                spritesheet,
                tiles: Array(state.data.width * state.data.height).fill(null),
                collision: Array(state.data.width * state.data.height).fill(false),
                spawn: null
              },
              past: [],
              future: [],
              stroke: null
            }));
        },
        setTiles (value) {
          const { data } = get();
          validateLevelTiles(value, data.width, data.height, data.spritesheet?.sprites.length ?? 0);
          set({
            data: {
              ...data,
              tiles: [
                ...value
              ]
            },
            past: [],
            future: [],
            stroke: null
          });
        },
        setCollision (value) {
          const { data } = get();
          validateLevelCollision(value, data.width, data.height);
          set({
            data: {
              ...data,
              collision: [
                ...value
              ]
            },
            past: [],
            future: [],
            stroke: null
          });
        },
        setSpawn (value) {
          const { data } = get();
          const spawn = parseLevelSpawn(value, data.width, data.height);
          set({
            data: {
              ...data,
              spawn
            },
            past: [],
            future: [],
            stroke: null
          });
        },
        resize (width, height) {
          update((state)=>commit(state, resizeLevel(state.data, width, height)));
        },
        clear () {
          update((state)=>state.data.tiles.every((tile)=>tile === null) && state.data.collision.every((solid)=>!solid) && !state.data.spawn ? state : commit(state, {
              ...state.data,
              tiles: Array(state.data.tiles.length).fill(null),
              collision: Array(state.data.tiles.length).fill(false),
              spawn: null
            }));
        },
        beginStroke () {
          update((state)=>state.stroke ? state : {
              ...state,
              stroke: state.data
            });
        },
        paint (x, y, tile) {
          update((state)=>{
            if (!state.stroke) {
              throw new Error("Begin a level stroke before painting");
            }
            const data = setLevelTile(state.data, x, y, tile);
            return data === state.data ? state : {
              ...state,
              data
            };
          });
        },
        paintCollision (x, y, solid) {
          update((state)=>{
            if (!state.stroke) {
              throw new Error("Begin a level stroke before painting");
            }
            const data = setLevelCollision(state.data, x, y, solid);
            return data === state.data ? state : {
              ...state,
              data
            };
          });
        },
        paintSpawn (spawn) {
          update((state)=>{
            if (!state.stroke) {
              throw new Error("Begin a level stroke before painting");
            }
            const data = setLevelSpawn(state.data, spawn);
            return data === state.data ? state : {
              ...state,
              data
            };
          });
        },
        endStroke () {
          const state = get();
          if (!state.stroke) return false;
          const changed = state.data.spawn?.x !== state.stroke.spawn?.x || state.data.spawn?.y !== state.stroke.spawn?.y || state.data.collision.some((solid, index)=>solid !== state.stroke?.collision[index]) || state.data.tiles.some((tile, index)=>tile !== state.stroke?.tiles[index]);
          set({
            ...state,
            data: changed ? state.data : state.stroke,
            past: changed ? [
              ...state.past,
              state.stroke
            ].slice(-100) : state.past,
            future: changed ? [] : state.future,
            stroke: null
          });
          return changed;
        },
        undo () {
          update((state)=>{
            if (state.stroke) {
              throw new Error("Finish the level stroke before undo");
            }
            const data = state.past.at(-1);
            return data ? {
              data,
              past: state.past.slice(0, -1),
              future: [
                state.data,
                ...state.future
              ],
              stroke: null
            } : state;
          });
        },
        redo () {
          update((state)=>{
            if (state.stroke) {
              throw new Error("Finish the level stroke before redo");
            }
            const data = state.future[0];
            return data ? {
              data,
              past: [
                ...state.past,
                state.data
              ].slice(-100),
              future: state.future.slice(1),
              stroke: null
            } : state;
          });
        }
      })
  });
}
