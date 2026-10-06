const TEMPLATE_RESULT = Symbol("nala.template-result");
const WHEN_DIRECTIVE = Symbol("nala.when");
const REPEAT_DIRECTIVE = Symbol("nala.repeat");
const UNSAFE_HTML_DIRECTIVE = Symbol("nala.unsafe-html");
const ATTRIBUTE_POSITION = /([.?@]?[A-Za-z_:][^\s"'<>/=]*)\s*=\s*(["']?)$/;
const ATTRIBUTE_MARKER = /^nala-part-(\d+)$/;
const START_MARKER = /^nala-start:(\d+)$/;
const END_MARKER = /^nala-end:(\d+)$/;
const templateCache = new WeakMap();
const rootInstances = new WeakMap();
export function html(strings, ...values) {
  return {
    strings,
    values,
    [TEMPLATE_RESULT]: true
  };
}
export function isTemplateResult(value) {
  return typeof value === "object" && value !== null && value[TEMPLATE_RESULT] === true;
}
export function when(condition, truthy, falsy = ()=>undefined) {
  return {
    value: condition ? truthy : falsy,
    [WHEN_DIRECTIVE]: true
  };
}
export function repeat(items, key, renderItem) {
  const keys = new Set();
  const entries = [];
  let index = 0;
  for (const item of items){
    const itemKey = key(item, index);
    if (keys.has(itemKey)) {
      const label = typeof itemKey === "string" ? JSON.stringify(itemKey) : String(itemKey);
      throw new Error(`Duplicate repeat key ${label}.`);
    }
    keys.add(itemKey);
    entries.push({
      key: itemKey,
      value: renderItem(item, index)
    });
    index++;
  }
  return {
    entries,
    [REPEAT_DIRECTIVE]: true
  };
}
export function unsafeHTML(value) {
  return {
    value,
    [UNSAFE_HTML_DIRECTIVE]: true
  };
}
export function render(result, root) {
  const current = rootInstances.get(root);
  if (current?.matches(result)) {
    current.update(result);
    return;
  }
  current?.dispose();
  const instance = new TemplateInstance(result);
  root.replaceChildren(instance.fragment);
  rootInstances.set(root, instance);
}
export function clearRender(root) {
  rootInstances.get(root)?.dispose();
  rootInstances.delete(root);
}
function isWhenDirective(value) {
  return typeof value === "object" && value !== null && value[WHEN_DIRECTIVE] === true;
}
function isRepeatDirective(value) {
  return typeof value === "object" && value !== null && value[REPEAT_DIRECTIVE] === true;
}
function isUnsafeHtmlDirective(value) {
  return typeof value === "object" && value !== null && value[UNSAFE_HTML_DIRECTIVE] === true;
}
function bindingFor(name) {
  if (name.startsWith(".")) return {
    kind: "property",
    name: name.slice(1)
  };
  if (name.startsWith("?")) return {
    kind: "boolean",
    name: name.slice(1)
  };
  if (name.startsWith("@")) return {
    kind: "event",
    name: name.slice(1)
  };
  return {
    kind: "attribute",
    name
  };
}
function compileTemplate(strings) {
  const cached = templateCache.get(strings);
  if (cached) return cached;
  const bindings = new Map();
  let source = "";
  for(let index = 0; index < strings.length - 1; index++){
    const part = strings[index];
    source += part;
    const match = part.match(ATTRIBUTE_POSITION);
    if (match) {
      bindings.set(index, bindingFor(match[1]));
      source += `nala-part-${index}`;
    } else {
      source += `<!--nala-start:${index}--><!--nala-end:${index}-->`;
    }
  }
  source += strings[strings.length - 1];
  const element = document.createElement("template");
  element.innerHTML = source;
  const compiled = {
    element,
    bindings
  };
  templateCache.set(strings, compiled);
  return compiled;
}
function visitNodes(node, visit) {
  for (const child of Array.from(node.childNodes)){
    visit(child);
    visitNodes(child, visit);
  }
}
class TemplateInstance {
  fragment;
  #strings;
  #parts;
  constructor(result){
    const compiled = compileTemplate(result.strings);
    this.#strings = result.strings;
    this.fragment = compiled.element.content.cloneNode(true);
    this.#parts = locateParts(this.fragment, result.values.length, compiled.bindings);
    this.update(result);
  }
  matches(result) {
    return result.strings === this.#strings;
  }
  update(result) {
    if (!this.matches(result)) {
      throw new Error("Cannot update a template instance with different strings.");
    }
    for(let index = 0; index < this.#parts.length; index++){
      this.#parts[index].setValue(result.values[index]);
    }
  }
  mount(parent, before) {
    parent.insertBefore(this.fragment, before);
  }
  dispose() {
    for (const part of this.#parts)part.dispose();
  }
}
function locateParts(fragment, count, bindings) {
  const parts = new Array(count);
  const starts = new Map();
  const ends = new Map();
  visitNodes(fragment, (node)=>{
    if (node instanceof Comment) {
      const start = node.data.match(START_MARKER);
      const end = node.data.match(END_MARKER);
      if (start) starts.set(Number(start[1]), node);
      if (end) ends.set(Number(end[1]), node);
      return;
    }
    if (!(node instanceof Element)) return;
    for (const attribute of Array.from(node.attributes)){
      const marker = attribute.value.match(ATTRIBUTE_MARKER);
      if (!marker) continue;
      const index = Number(marker[1]);
      const binding = bindings.get(index);
      if (!binding) continue;
      node.removeAttribute(attribute.name);
      parts[index] = new AttributePart(node, binding);
    }
  });
  for(let index = 0; index < count; index++){
    if (parts[index]) continue;
    const start = starts.get(index);
    const end = ends.get(index);
    if (!start || !end) {
      throw new Error(`Unsupported template expression at index ${index}.`);
    }
    parts[index] = new NodePart(start, end);
  }
  return parts;
}
class AttributePart {
  #element;
  #binding;
  #listener;
  constructor(element, binding){
    this.#element = element;
    this.#binding = binding;
  }
  setValue(value) {
    const { kind, name } = this.#binding;
    if (kind === "event") {
      if (value === this.#listener) return;
      if (this.#listener) {
        this.#element.removeEventListener(name, this.#listener);
      }
      this.#listener = typeof value === "function" ? value : undefined;
      if (this.#listener) this.#element.addEventListener(name, this.#listener);
      return;
    }
    if (kind === "property") {
      this.#element[name] = value;
      return;
    }
    if (kind === "boolean") {
      this.#element.toggleAttribute(name, Boolean(value));
      return;
    }
    if (value === undefined || value === null) {
      this.#element.removeAttribute(name);
    } else {
      this.#element.setAttribute(name, String(value));
    }
  }
  dispose() {
    if (this.#listener) {
      this.#element.removeEventListener(this.#binding.name, this.#listener);
      this.#listener = undefined;
    }
  }
}
class NodePart {
  #start;
  #end;
  #nested;
  #repeat;
  #text;
  #node;
  #unsafeHtml;
  constructor(start, end){
    this.#start = start;
    this.#end = end;
  }
  setValue(value) {
    if (isWhenDirective(value)) value = value.value();
    if (isRepeatDirective(value)) {
      if (!this.#repeat) {
        this.#clear();
        this.#repeat = new RepeatState(this.#end);
      }
      this.#repeat.update(value.entries);
      return;
    }
    if (isTemplateResult(value)) {
      if (this.#nested?.matches(value)) {
        this.#nested.update(value);
        return;
      }
      this.#clear();
      this.#nested = new TemplateInstance(value);
      this.#nested.mount(this.#parent(), this.#end);
      return;
    }
    if (isUnsafeHtmlDirective(value)) {
      if (this.#unsafeHtml === value.value) return;
      this.#clear();
      const template = document.createElement("template");
      template.innerHTML = value.value;
      this.#parent().insertBefore(template.content, this.#end);
      this.#unsafeHtml = value.value;
      return;
    }
    if (value === undefined || value === null) {
      this.#clear();
      return;
    }
    if (Array.isArray(value)) {
      throw new TypeError("Render arrays with repeat() so every item has a key.");
    }
    if (value instanceof Node) {
      if (this.#node === value) return;
      this.#clear();
      this.#parent().insertBefore(value, this.#end);
      this.#node = value;
      return;
    }
    if (typeof value === "object" || typeof value === "function") {
      throw new TypeError("Template values must be primitive, Node, TemplateResult, or a directive.");
    }
    const text = String(value);
    if (this.#text) {
      this.#text.data = text;
      return;
    }
    this.#clear();
    this.#text = document.createTextNode(text);
    this.#parent().insertBefore(this.#text, this.#end);
  }
  dispose() {
    this.#clear();
  }
  #parent() {
    const parent = this.#end.parentNode;
    if (!parent) throw new Error("Template part is not mounted.");
    return parent;
  }
  #clear() {
    this.#nested?.dispose();
    this.#repeat?.dispose();
    this.#nested = undefined;
    this.#repeat = undefined;
    this.#text = undefined;
    this.#node = undefined;
    this.#unsafeHtml = undefined;
    let current = this.#start.nextSibling;
    while(current && current !== this.#end){
      const next = current.nextSibling;
      current.remove();
      current = next;
    }
  }
}
class RepeatState {
  #end;
  #blocks = new Map();
  constructor(end){
    this.#end = end;
  }
  update(entries) {
    const nextBlocks = new Map();
    for (const entry of entries){
      let block = this.#blocks.get(entry.key);
      if (!block) block = this.#createBlock(entry.key);
      block.part.setValue(entry.value);
      nextBlocks.set(entry.key, block);
    }
    for (const [key, block] of this.#blocks){
      if (!nextBlocks.has(key)) this.#removeBlock(block);
    }
    let reference = this.#end;
    const ordered = [
      ...nextBlocks.values()
    ];
    for(let index = ordered.length - 1; index >= 0; index--){
      const block = ordered[index];
      moveRangeBefore(block.start, block.end, reference);
      reference = block.start;
    }
    this.#blocks = nextBlocks;
  }
  dispose() {
    for (const block of this.#blocks.values())this.#removeBlock(block);
    this.#blocks.clear();
  }
  #createBlock(key) {
    const parent = this.#end.parentNode;
    if (!parent) throw new Error("Repeat part is not mounted.");
    const start = document.createComment("nala-repeat-start");
    const end = document.createComment("nala-repeat-end");
    parent.insertBefore(start, this.#end);
    parent.insertBefore(end, this.#end);
    return {
      key,
      start,
      end,
      part: new NodePart(start, end)
    };
  }
  #removeBlock(block) {
    block.part.dispose();
    block.start.remove();
    block.end.remove();
  }
}
function moveRangeBefore(start, end, reference) {
  if (end.nextSibling === reference) return;
  const parent = reference.parentNode;
  if (!parent) throw new Error("Repeat reference is not mounted.");
  if ((parent instanceof Element || parent instanceof DocumentFragment) && typeof parent.moveBefore === "function") {
    let current = start;
    while(current){
      const next = current.nextSibling;
      parent.moveBefore(current, reference);
      if (current === end) break;
      current = next;
    }
    return;
  }
  const root = start.getRootNode();
  const active = root instanceof Document || root instanceof ShadowRoot ? root.activeElement : null;
  let restoreFocus = false;
  const fragment = document.createDocumentFragment();
  let current = start;
  while(current){
    const next = current.nextSibling;
    if (active && (current === active || current.contains(active))) {
      restoreFocus = true;
    }
    fragment.appendChild(current);
    if (current === end) break;
    current = next;
  }
  parent.insertBefore(fragment, reference);
  if (restoreFocus && active instanceof HTMLElement) {
    active.focus({
      preventScroll: true
    });
  }
}
