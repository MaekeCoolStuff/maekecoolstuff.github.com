const epsilon = 1e-8;
export function createPreviewPlayer(level) {
  if (!level.spawn) throw new Error("Place a player spawn before playing.");
  if (level.collision[level.spawn.y * level.width + level.spawn.x]) {
    throw new Error("The player spawn is inside a solid cell. Move it or erase that collision.");
  }
  return {
    x: level.spawn.x + (1 - 0.65) / 2,
    y: level.spawn.y + (1 - 0.85),
    width: 0.65,
    height: 0.85,
    vy: 0,
    grounded: solid(level, level.spawn.x, level.spawn.y + 1),
    respawns: 0
  };
}
function solid(level, x, y) {
  return x >= 0 && y >= 0 && x < level.width && y < level.height && level.collision[y * level.width + x];
}
export function stepPreview(level, player, input, dt) {
  if (!Number.isFinite(dt) || dt < 0 || dt > 1 / 30) {
    throw new RangeError("Preview step must be between 0 and 1/30 seconds.");
  }
  if (dt === 0) return player;
  const next = {
    ...player
  };
  const dx = input.direction * 5 * dt;
  next.x = Math.max(0, Math.min(level.width - player.width, player.x + dx));
  const top = Math.floor(player.y + epsilon);
  const bottom = Math.floor(player.y + player.height - epsilon);
  if (dx > 0) {
    for(let x = Math.floor(player.x + player.width - epsilon); x <= Math.floor(next.x + player.width - epsilon); x++){
      for(let y = top; y <= bottom; y++){
        if (solid(level, x, y)) next.x = Math.min(next.x, x - player.width);
      }
    }
  } else if (dx < 0) {
    for(let x = Math.floor(player.x + epsilon); x >= Math.floor(next.x + epsilon); x--){
      for(let y = top; y <= bottom; y++){
        if (solid(level, x, y)) next.x = Math.max(next.x, x + 1);
      }
    }
  }
  next.vy = input.jump && player.grounded ? -12 : player.vy;
  next.vy = Math.min(18, next.vy + 30 * dt);
  next.y = player.y + next.vy * dt;
  next.grounded = false;
  const left = Math.floor(next.x + epsilon);
  const right = Math.floor(next.x + next.width - epsilon);
  // Sweep crossed grid rows, rather than testing only the destination rectangle.
  if (next.vy >= 0) {
    for(let y = Math.floor(player.y + player.height - epsilon); y <= Math.floor(next.y + next.height - epsilon); y++){
      for(let x = left; x <= right; x++){
        if (solid(level, x, y)) {
          next.y = Math.min(next.y, y - next.height);
          next.vy = 0;
          next.grounded = true;
        }
      }
    }
  } else {
    for(let y = Math.floor(player.y + epsilon); y >= Math.floor(next.y + epsilon); y--){
      for(let x = left; x <= right; x++){
        if (solid(level, x, y)) {
          next.y = Math.max(next.y, y + 1);
          next.vy = 0;
        }
      }
    }
  }
  return next.y > level.height + 2 ? {
    ...createPreviewPlayer(level),
    respawns: player.respawns + 1
  } : next;
}
export function previewCamera(level, player, width, height) {
  return {
    x: Math.max(0, Math.min(level.width - width, player.x + player.width / 2 - width / 2)),
    y: Math.max(0, Math.min(level.height - height, player.y + player.height / 2 - height / 2))
  };
}
