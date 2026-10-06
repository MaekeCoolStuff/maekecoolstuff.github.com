export function notificationPosition(value) {
  switch(value){
    case "top-left":
    case "top-right":
    case "bottom-left":
    case "bottom-right":
      return value;
    default:
      return "inline";
  }
}
export function notificationOffsets(items) {
  const offsets = new Map();
  return items.map(({ position, height })=>{
    if (position === "inline") return 0;
    const offset = offsets.get(position) ?? 16;
    offsets.set(position, offset + height + 10);
    return offset;
  });
}
