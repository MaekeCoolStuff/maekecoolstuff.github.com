import { parseAttributeValue } from "../attributes.js";
export function componentAttribute(supplied) {
  return typeof supplied === "string" ? {
    type: supplied
  } : supplied;
}
export function parseComponentAttribute(definition, raw) {
  const value = raw === null && Object.hasOwn(definition, "default") ? definition.default : parseAttributeValue(definition.type, raw);
  // AttributeType is the explicit runtime boundary; validation can reject
  // values that are narrower than its string/number/boolean coercion.
  const parsed = value;
  return parsed;
}
export function readComponentAttribute(definition, raw) {
  const value = parseComponentAttribute(definition, raw);
  definition.validate?.(value);
  return value;
}
