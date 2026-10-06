/** Dispatches a typed, browser-native CustomEvent from a component element. */ export function dispatchComponentEvent(element, type, detail, options = {}) {
  return element.dispatchEvent(new CustomEvent(type, {
    detail,
    bubbles: options.bubbles ?? false,
    composed: options.composed ?? false,
    cancelable: options.cancelable ?? false
  }));
}
