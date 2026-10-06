import { colorValue } from "../color-picker/color-value.js";
/** Validates a complete snapshot before an editor applies any changes. */ export function parsePixelArtData(value) {
  const data = typeof value === "string" ? JSON.parse(value) : value;
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new TypeError("Pixel art data must be an object");
  }
  if (!("version" in data) || data.version !== 1) {
    throw new RangeError("Unsupported pixel art data version");
  }
  if (!("size" in data) || typeof data.size !== "number") {
    throw new TypeError("Pixel art data size must be a number");
  }
  const size = pixelArtSize(data.size);
  if (!("pixels" in data) || !Array.isArray(data.pixels) || data.pixels.length !== size * size) {
    throw new TypeError("Pixel art data must contain exactly size * size pixels");
  }
  const readColor = (color)=>{
    if (typeof color !== "string") {
      throw new TypeError("Pixel art data colors must be hex strings");
    }
    return colorValue(color);
  };
  const readColors = (colors)=>{
    if (!Array.isArray(colors)) {
      throw new TypeError("Pixel art data colors must be an array");
    }
    return [
      ...new Set(Array.from(colors, readColor))
    ];
  };
  if (!("previewScale" in data) || typeof data.previewScale !== "number" || !("exportScale" in data) || typeof data.exportScale !== "number") {
    throw new TypeError("Pixel art data scales must be numbers");
  }
  return {
    version: 1,
    size,
    pixels: Array.from(data.pixels, (pixel)=>pixel === null ? null : readColor(pixel)),
    palette: readColors("palette" in data ? data.palette : undefined),
    recentColors: readColors("recentColors" in data ? data.recentColors : undefined),
    color: readColor("color" in data ? data.color : undefined),
    previewScale: pixelArtPreviewScale(data.previewScale),
    exportScale: pixelArtExportScale(data.exportScale)
  };
}
export const pixelArtMinSize = 8;
export const pixelArtMaxSize = 32;
export const pixelArtMaxExportScale = 64;
export const pixelArtMaxPreviewScale = 8;
export function pixelArtSize(value) {
  if (!Number.isInteger(value) || value < pixelArtMinSize || value > pixelArtMaxSize) {
    throw new RangeError(`Pixel art size must be an integer from ${pixelArtMinSize} to ${pixelArtMaxSize}`);
  }
  return value;
}
export function pixelArtExportScale(value) {
  if (!Number.isInteger(value) || value < 1 || value > pixelArtMaxExportScale) {
    throw new RangeError(`Pixel art export scale must be an integer from 1 to ${pixelArtMaxExportScale}`);
  }
  return value;
}
export function pixelArtPreviewScale(value) {
  if (!Number.isInteger(value) || value < 1 || value > pixelArtMaxPreviewScale) {
    throw new RangeError(`Pixel art preview scale must be an integer from 1 to ${pixelArtMaxPreviewScale}`);
  }
  return value;
}
export function validatePixels(pixels) {
  if (!Array.isArray(pixels)) {
    throw new TypeError("Pixel art pixels must be an array");
  }
  for (const pixel of pixels){
    if (pixel !== null) colorValue(pixel);
  }
}
/** Returns exactly `size * size` pixels, padding missing entries as transparent. */ export function fitPixels(pixels, size) {
  return Array.from({
    length: size * size
  }, (_, index)=>pixels[index] ?? null);
}
/** Keeps the overlapping top-left area when the canvas grows or shrinks. */ export function resizePixels(pixels, previousSize, size) {
  return Array.from({
    length: size * size
  }, (_, index)=>{
    const x = index % size;
    const y = Math.floor(index / size);
    if (x >= previousSize || y >= previousSize) return null;
    return pixels[y * previousSize + x] ?? null;
  });
}
export function paintPixel(pixels, size, index, color) {
  if (!Number.isInteger(index) || index < 0 || index >= size * size) {
    throw new RangeError("Pixel index is outside the canvas");
  }
  const next = fitPixels(pixels, size);
  next[index] = color === null ? null : colorValue(color);
  return next;
}
/** Converts pixels to RGBA bytes suitable for `new ImageData(data, width)`. */ export function pixelsToRgba(pixels, size, scale = 1) {
  const width = size * scale;
  const data = new Uint8ClampedArray(width * width * 4);
  fitPixels(pixels, size).forEach((pixel, index)=>{
    if (pixel === null) return;
    const color = colorValue(pixel);
    const red = parseInt(color.slice(1, 3), 16);
    const green = parseInt(color.slice(3, 5), 16);
    const blue = parseInt(color.slice(5, 7), 16);
    const left = index % size * scale;
    const top = Math.floor(index / size) * scale;
    for(let y = top; y < top + scale; y++){
      for(let x = left; x < left + scale; x++){
        const offset = (y * width + x) * 4;
        data[offset] = red;
        data[offset + 1] = green;
        data[offset + 2] = blue;
        data[offset + 3] = 255;
      }
    }
  });
  return data;
}
export const pixelArtRecentColorLimit = 8;
export function validateColors(colors) {
  if (!Array.isArray(colors)) {
    throw new TypeError("Pixel art colors must be an array");
  }
  for (const color of colors)colorValue(color);
}
/** Appends a normalized color unless the palette already contains it. */ export function addPaletteColor(palette, color) {
  const value = colorValue(color);
  return palette.includes(value) ? palette : [
    ...palette,
    value
  ];
}
/** Moves a color to the front of the recent list, returning the same list when it is already first. */ export function pushRecentColor(recent, color, limit = pixelArtRecentColorLimit) {
  const value = colorValue(color);
  if (recent[0] === value) return recent;
  return [
    value,
    ...recent.filter((entry)=>entry !== value)
  ].slice(0, limit);
}
