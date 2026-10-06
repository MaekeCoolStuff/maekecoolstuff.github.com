export function validatePreviewSize(value) {
  if (value !== "large" && value !== "medium" && value !== "small") {
    throw new TypeError('Pixel art gallery preview size must be "large", "medium", or "small"');
  }
}
