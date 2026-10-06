/** HTML attributes are always strings (or absent) — this converts the raw value to the declared type. */ export function parseAttributeValue(type, raw) {
  switch(type){
    case "boolean":
      return raw !== null;
    case "number":
      return raw === null ? null : Number(raw);
    case "string":
      return raw;
  }
}
/** The inverse of `parseAttributeValue`: `null` means "remove the attribute". */ export function serializeAttributeValue(type, value) {
  switch(type){
    case "boolean":
      return value ? "" : null;
    case "number":
    case "string":
      return value === null || value === undefined ? null : String(value);
  }
}
/** Two-way binding between an element's attribute and a typed property value. */ export function reflectAttribute(element, name, type) {
  return {
    get: ()=>parseAttributeValue(type, element.getAttribute(name)),
    set: (value)=>{
      const serialized = serializeAttributeValue(type, value);
      if (serialized === null) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, serialized);
      }
    }
  };
}
