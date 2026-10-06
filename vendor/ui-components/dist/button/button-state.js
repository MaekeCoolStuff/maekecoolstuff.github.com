export function buttonType(value) {
  return value === "submit" || value === "reset" ? value : "button";
}
export function buttonPressed(value) {
  return value === "true" || value === "false" || value === "mixed" ? value : null;
}
