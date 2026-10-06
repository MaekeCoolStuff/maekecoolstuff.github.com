import { parsePixelArtData, pixelsToRgba } from "../pixel-art/pixel-art-data.js";
export const spritesheetMaxFrames = 256;
export const spritesheetMaxCanvasDimension = 8192;
function integer(value, name, maximum) {
  if (!Number.isInteger(value) || value < 1 || value > maximum) {
    throw new RangeError(`Spritesheet ${name} must be an integer from 1 to ${maximum}`);
  }
  return value;
}
export function spritesheetColumns(value) {
  return integer(value, "columns", 32);
}
export function spritesheetScale(value) {
  return integer(value, "export scale", 8);
}
export function parseSpriteList(value, limited = true) {
  if (!Array.isArray(value)) {
    throw new TypeError("Spritesheet drawings must be an array");
  }
  if (limited && value.length > spritesheetMaxFrames) {
    throw new RangeError(`A spritesheet supports at most ${spritesheetMaxFrames} frames`);
  }
  return Array.from(value, parsePixelArtData);
}
export function spritesheetLayout(sprites, columns, scale = 1) {
  spritesheetColumns(columns);
  spritesheetScale(scale);
  if (sprites.length > spritesheetMaxFrames) {
    throw new RangeError(`A spritesheet supports at most ${spritesheetMaxFrames} frames`);
  }
  const actualColumns = Math.min(columns, sprites.length);
  const rows = actualColumns === 0 ? 0 : Math.ceil(sprites.length / actualColumns);
  const cellSize = sprites.reduce((size, sprite)=>Math.max(size, sprite.size), 0) * scale;
  return {
    width: actualColumns * cellSize,
    height: rows * cellSize,
    columns: actualColumns,
    rows,
    cellSize,
    frames: sprites.map((sprite, index)=>({
        index,
        x: index % actualColumns * cellSize,
        y: Math.floor(index / actualColumns) * cellSize,
        width: cellSize,
        height: cellSize,
        contentWidth: sprite.size * scale,
        contentHeight: sprite.size * scale
      }))
  };
}
export function createSpritesheetData(sprites, columns, exportScale) {
  const copied = parseSpriteList(sprites);
  return {
    version: 1,
    columns: spritesheetColumns(columns),
    exportScale: spritesheetScale(exportScale),
    sprites: copied,
    layout: spritesheetLayout(copied, columns, exportScale)
  };
}
export function parseSpritesheetData(value) {
  const data = typeof value === "string" ? JSON.parse(value) : value;
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    throw new TypeError("Spritesheet data must be an object");
  }
  if (!("version" in data) || data.version !== 1) {
    throw new RangeError("Unsupported spritesheet data version");
  }
  if (!("columns" in data) || typeof data.columns !== "number" || !("exportScale" in data) || typeof data.exportScale !== "number" || !("sprites" in data)) {
    throw new TypeError("Spritesheet data requires columns, exportScale, and sprites");
  }
  const result = createSpritesheetData(parseSpriteList(data.sprites), data.columns, data.exportScale);
  if (!("layout" in data) || !matchesLayout(data.layout, result.layout)) {
    throw new TypeError("Spritesheet frame coordinates do not match its drawings and settings");
  }
  return result;
}
function matchesLayout(value, layout) {
  if (value === null || typeof value !== "object") return false;
  for (const key of [
    "width",
    "height",
    "columns",
    "rows",
    "cellSize"
  ]){
    if (!(key in value) || Reflect.get(value, key) !== layout[key]) return false;
  }
  if (!("frames" in value) || !Array.isArray(value.frames) || value.frames.length !== layout.frames.length) return false;
  const frames = value.frames;
  return layout.frames.every((frame, index)=>{
    const supplied = frames[index];
    if (supplied === null || typeof supplied !== "object") return false;
    return [
      "index",
      "x",
      "y",
      "width",
      "height",
      "contentWidth",
      "contentHeight"
    ].every((key)=>key in supplied && Reflect.get(supplied, key) === frame[key]);
  });
}
export function spritesheetRgba(sprites, columns, scale = 1) {
  const layout = spritesheetLayout(sprites, columns, scale);
  if (sprites.length === 0) {
    throw new Error("Add a frame before exporting a spritesheet");
  }
  if (layout.width > spritesheetMaxCanvasDimension || layout.height > spritesheetMaxCanvasDimension) {
    throw new RangeError("Spritesheet PNG dimensions must not exceed 8192 pixels; increase columns or reduce export scale");
  }
  const pixels = new Uint8ClampedArray(layout.width * layout.height * 4);
  sprites.forEach((sprite, index)=>{
    const frame = layout.frames[index];
    const data = pixelsToRgba(sprite.pixels, sprite.size, scale);
    for(let y = 0; y < frame.contentHeight; y++){
      const offset = ((frame.y + y) * layout.width + frame.x) * 4;
      const start = y * frame.contentWidth * 4;
      pixels.set(data.subarray(start, start + frame.contentWidth * 4), offset);
    }
  });
  return {
    layout,
    pixels
  };
}
