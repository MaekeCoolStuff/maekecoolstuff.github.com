import { iconGroups, iconPaths, solidIconNames } from "./icon-web-data.js";
export const nalaIconNames = Object.freeze(Object.keys(iconPaths));
export const nalaIconGroups = Object.freeze(Object.entries(iconGroups).map(([label, names])=>{
  const bases = new Set(names);
  return Object.freeze({
    label,
    names: Object.freeze(nalaIconNames.filter((name)=>bases.has(name.replace(/-filled$/, ""))))
  });
}));
const solidIcons = new Set(solidIconNames);
export function iconDefinition(name) {
  if (name === null) return null;
  if (!Object.hasOwn(iconPaths, name)) {
    throw new RangeError(`Unknown nala-icon name "${name}". Expected one of: ${nalaIconNames.join(", ")}`);
  }
  return {
    path: iconPaths[name],
    fill: name.endsWith("-filled") ? "currentColor" : "none",
    stroke: solidIcons.has(name) ? "none" : "currentColor"
  };
}
