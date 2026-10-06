/** Replaces `{{path.to.value}}` placeholders with values from `data` — no logic, no loops, just interpolation. */ export function interpolate(template, data) {
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_match, path)=>{
    const value = path.split(".").reduce((accumulator, key)=>accumulator && typeof accumulator === "object" ? accumulator[key] : undefined, data);
    return value === undefined || value === null ? "" : String(value);
  });
}
/** Performs lightweight development-time validation for supported `{{path}}` tokens. */ export function validateTemplate(template) {
  const diagnostics = [];
  let cursor = 0;
  while(cursor < template.length){
    const start = template.indexOf("{{", cursor);
    const end = template.indexOf("}}", cursor);
    if (end !== -1 && (start === -1 || end < start)) {
      diagnostics.push({
        code: "unexpected-interpolation-end",
        message: "Unexpected interpolation closing token.",
        index: end
      });
      cursor = end + 2;
      continue;
    }
    if (start === -1) break;
    const closing = template.indexOf("}}", start + 2);
    if (closing === -1) {
      diagnostics.push({
        code: "unclosed-interpolation",
        message: "Interpolation is missing its closing `}}` token.",
        index: start
      });
      break;
    }
    const expression = template.slice(start + 2, closing).trim();
    if (!/^[\w.]+$/.test(expression)) {
      diagnostics.push({
        code: "invalid-interpolation",
        message: "Interpolation must contain a property path such as `user.name`.",
        index: start
      });
    }
    cursor = closing + 2;
  }
  return diagnostics;
}
/** Interpolates `html`, then parses it via a native `<template>` so it can be cloned into the DOM efficiently. */ export function renderTemplate(html, data = {}) {
  const template = document.createElement("template");
  template.innerHTML = interpolate(html, data);
  return template.content.cloneNode(true);
}
