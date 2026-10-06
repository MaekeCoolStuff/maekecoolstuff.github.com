import { parseSpritesheetData } from "../spritesheet/spritesheet-data.js";
export function levelDimension(value) {
  if (!Number.isInteger(value) || value < 1 || value > 128) {
    throw new RangeError("Level dimensions must be integers from 1 to 128");
  }
  return value;
}
export function levelZoom(value) {
  if (!Number.isInteger(value) || value < 1 || value > 8) {
    throw new RangeError("Level zoom must be an integer from 1 to 8");
  }
  return value;
}
export function validateLevelTiles(tiles, width, height, frameCount) {
  if (!Array.isArray(tiles) || tiles.length !== width * height) {
    throw new TypeError("Level tiles must contain exactly width * height entries");
  }
  for (const tile of tiles){
    if (tile === null) continue;
    if (typeof tile !== "number" || !Number.isInteger(tile) || tile < 0 || tile >= frameCount) {
      throw new RangeError("Level tiles must be null or valid spritesheet frame indexes");
    }
  }
}
export function validateLevelCollision(value, width, height) {
  if (!Array.isArray(value) || value.length !== width * height || [
    ...value
  ].some((solid)=>typeof solid !== "boolean")) {
    throw new TypeError("Level collision must contain width * height booleans");
  }
}
export function parseLevelSpawn(value, width, height) {
  if (value === null) return null;
  if (typeof value !== "object" || Array.isArray(value) || !("x" in value) || !("y" in value) || typeof value.x !== "number" || typeof value.y !== "number") {
    throw new TypeError("Level spawn must be null or an { x, y } cell");
  }
  validateCell(value.x, value.y, width, height);
  return {
    x: value.x,
    y: value.y
  };
}
function validateCell(x, y, width, height) {
  if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x >= width || y >= height) {
    throw new RangeError("Level tile coordinates are outside the map");
  }
}
export function parseLevelData(value) {
  const data = typeof value === "string" ? JSON.parse(value) : value;
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    throw new TypeError("Level data must be an object");
  }
  if (!("version" in data) || data.version !== 1 && data.version !== 2) {
    throw new RangeError("Unsupported level data version");
  }
  if (!("width" in data) || typeof data.width !== "number" || !("height" in data) || typeof data.height !== "number" || !("spritesheet" in data) || !("tiles" in data)) {
    throw new TypeError("Level data requires width, height, spritesheet, and tiles");
  }
  const width = levelDimension(data.width);
  const height = levelDimension(data.height);
  const spritesheet = data.spritesheet === null ? null : parseSpritesheetData(data.spritesheet);
  validateLevelTiles(data.tiles, width, height, spritesheet?.sprites.length ?? 0);
  let collision = Array(width * height).fill(false);
  let spawn = null;
  if (data.version === 2) {
    if (!("collision" in data) || !("spawn" in data)) {
      throw new TypeError("Version 2 levels require collision and spawn");
    }
    validateLevelCollision(data.collision, width, height);
    collision = [
      ...data.collision
    ];
    spawn = parseLevelSpawn(data.spawn, width, height);
  }
  return {
    version: 2,
    width,
    height,
    spritesheet,
    tiles: [
      ...data.tiles
    ],
    collision,
    spawn
  };
}
export function resizeLevel(data, width, height) {
  levelDimension(width);
  levelDimension(height);
  if (data.width === width && data.height === height) return data;
  return {
    ...data,
    width,
    height,
    collision: Array.from({
      length: width * height
    }, (_, index)=>{
      const x = index % width, y = Math.floor(index / width);
      return x < data.width && y < data.height ? data.collision[y * data.width + x] : false;
    }),
    spawn: data.spawn && data.spawn.x < width && data.spawn.y < height ? data.spawn : null,
    tiles: Array.from({
      length: width * height
    }, (_, index)=>{
      const x = index % width, y = Math.floor(index / width);
      return x < data.width && y < data.height ? data.tiles[y * data.width + x] : null;
    })
  };
}
export function setLevelTile(data, x, y, tile) {
  validateCell(x, y, data.width, data.height);
  if (tile !== null && (!Number.isInteger(tile) || tile < 0 || tile >= (data.spritesheet?.sprites.length ?? 0))) {
    throw new RangeError("Level tile must reference a spritesheet frame");
  }
  const index = y * data.width + x;
  if (data.tiles[index] === tile) return data;
  const tiles = [
    ...data.tiles
  ];
  tiles[index] = tile;
  return {
    ...data,
    tiles
  };
}
export function setLevelCollision(data, x, y, solid) {
  validateCell(x, y, data.width, data.height);
  if (typeof solid !== "boolean") {
    throw new TypeError("Collision must be boolean");
  }
  const index = y * data.width + x;
  if (data.collision[index] === solid) return data;
  const collision = [
    ...data.collision
  ];
  collision[index] = solid;
  return {
    ...data,
    collision
  };
}
export function setLevelSpawn(data, value) {
  const spawn = parseLevelSpawn(value, data.width, data.height);
  if (spawn?.x === data.spawn?.x && spawn?.y === data.spawn?.y) return data;
  return {
    ...data,
    spawn
  };
}
/** Bresenham's line fills gaps between sampled pointer cells. */ export function levelLine(x0, y0, x1, y1) {
  const points = [];
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let error = dx + dy;
  while(true){
    points.push([
      x0,
      y0
    ]);
    if (x0 === x1 && y0 === y1) return points;
    const twice = 2 * error;
    if (twice >= dy) {
      error += dy;
      x0 += sx;
    }
    if (twice <= dx) {
      error += dx;
      y0 += sy;
    }
  }
}
