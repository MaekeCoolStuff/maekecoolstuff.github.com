export function colorValue(value) {
  if (value === null) return "#000000";
  if (!/^#[\da-f]{6}$/i.test(value)) {
    throw new RangeError("Color picker value must be a six-digit hex color");
  }
  return value.toLowerCase();
}
