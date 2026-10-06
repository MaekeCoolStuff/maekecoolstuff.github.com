export function popoverPosition(value) {
  return value === "top" || value === "right" || value === "left" ? value : "bottom";
}
export function popoverCoordinates(anchor, panel, viewport, preferred) {
  const edge = 8;
  const gap = 8;
  const available = {
    top: anchor.top - gap - edge,
    right: viewport.width - anchor.right - gap - edge,
    bottom: viewport.height - anchor.bottom - gap - edge,
    left: anchor.left - gap - edge
  };
  const opposite = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right"
  };
  const size = preferred === "top" || preferred === "bottom" ? panel.height : panel.width;
  const alternative = opposite[preferred];
  const position = available[preferred] < size && available[alternative] > available[preferred] ? alternative : preferred;
  let left = (anchor.left + anchor.right - panel.width) / 2;
  let top = (anchor.top + anchor.bottom - panel.height) / 2;
  if (position === "top") top = anchor.top - panel.height - gap;
  if (position === "bottom") top = anchor.bottom + gap;
  if (position === "left") left = anchor.left - panel.width - gap;
  if (position === "right") left = anchor.right + gap;
  return {
    left: Math.max(edge, Math.min(left, viewport.width - panel.width - edge)),
    top: Math.max(edge, Math.min(top, viewport.height - panel.height - edge)),
    position
  };
}
