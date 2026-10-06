import { serializeAttributeValue } from "./attributes.js";
import { componentAttribute, parseComponentAttribute, readComponentAttribute } from "./internal/component-inputs.js";
import { renderTemplate } from "./template.js";
import { clearRender, isTemplateResult, render } from "./reactive-template.js";
import { createConnectionScope } from "./lifecycle.js";
/** A thin helper over `customElements.define`: typed props reflected from attributes, a template, and lifecycle hooks. */ export function defineComponent(tagName, config) {
  const formAssociated = config.formAssociated === true;
  const attributes = new Map();
  const attributeKeys = new Map();
  const propertyNames = Object.keys(config.properties ?? {});
  for (const name of Object.keys(config.props ?? {})){
    if (Object.hasOwn(config.properties ?? {}, name)) {
      throw new TypeError(`Input "${name}" cannot be both an attribute and a property`);
    }
    const supplied = config.props?.[name];
    if (!supplied) {
      throw new TypeError(`Missing attribute definition for "${name}"`);
    }
    const definition = componentAttribute(supplied);
    const attribute = definition.attribute ?? name;
    if (!attribute || attribute !== attribute.toLowerCase() || attributeKeys.has(attribute)) {
      throw new TypeError(`Attribute "${attribute}" must be unique, non-empty, and lowercase`);
    }
    attributes.set(name, definition);
    attributeKeys.set(attribute, name);
  }
  const attributeNames = [
    ...attributeKeys.keys()
  ];
  class NalaElement extends HTMLElement {
    static get formAssociated() {
      return formAssociated;
    }
    static get observedAttributes() {
      return attributeNames;
    }
    #root;
    #props;
    #connection;
    #styleElement;
    #pendingAttributes = new Map();
    #initializing = true;
    #internals;
    constructor(){
      super();
      this.#internals = formAssociated ? this.attachInternals() : null;
      const shadowMode = config.shadow === true ? "open" : config.shadow === false || config.shadow === undefined ? null : config.shadow;
      this.#root = shadowMode ? this.attachShadow({
        mode: shadowMode
      }) : this;
      this.#props = this.#readPropsFromAttributes();
      this.#connection = createConnectionScope(this, this.#root);
      for (const [name, definition] of attributes){
        const pending = Object.hasOwn(this, name);
        const value = pending ? Reflect.get(this, name) : undefined;
        Object.defineProperty(this, name, {
          configurable: true,
          get: ()=>this.#props[name],
          set: (value)=>{
            const serialized = serializeAttributeValue(definition.type, value);
            readComponentAttribute(definition, serialized);
            this.#pendingAttributes.delete(name);
            const attribute = definition.attribute ?? String(name);
            if (serialized === null) this.removeAttribute(attribute);
            else this.setAttribute(attribute, serialized);
          }
        });
        if (pending) this.#pendingAttributes.set(name, value);
      }
      for (const name of propertyNames){
        const definition = config.properties?.[name];
        if (!definition) {
          throw new TypeError(`Missing property definition for "${name}"`);
        }
        const value = Object.hasOwn(this, name) ? Reflect.get(this, name) : definition.default();
        definition.validate?.(value);
        this.#props = {
          ...this.#props,
          [name]: value
        };
        Object.defineProperty(this, name, {
          configurable: true,
          get: ()=>this.#props[name],
          set: (value)=>{
            definition.validate?.(value);
            if (Object.is(this.#props[name], value)) return;
            const previousProps = this.#props;
            this.#props = {
              ...this.#props,
              [name]: value
            };
            if (!this.isConnected || this.#initializing || this.#pendingAttributes.size > 0) return;
            this.#render();
            config.onUpdate?.(this.#context(), previousProps);
          }
        });
      }
      this.#initializing = false;
    }
    #readPropsFromAttributes() {
      const props = {};
      for (const [name, definition] of attributes){
        props[name] = readComponentAttribute(definition, this.getAttribute(definition.attribute ?? String(name)));
      }
      return props;
    }
    #render() {
      config.onBeforeRender?.(this.#context());
      const result = config.template?.(this.#props);
      if (isTemplateResult(result)) {
        render(result, this.#root);
      } else {
        clearRender(this.#root);
        this.#root.innerHTML = "";
        if (result) {
          this.#root.appendChild(renderTemplate(result, this.#props));
        }
      }
      if (config.styles) {
        this.#styleElement ??= document.createElement("style");
        this.#styleElement.textContent = config.styles;
        if (this.#styleElement.parentNode !== this.#root) {
          this.#root.prepend(this.#styleElement);
        }
      } else {
        this.#styleElement = undefined;
      }
      config.onAfterRender?.(this.#context());
    }
    #context() {
      return {
        element: this,
        root: this.#root,
        props: this.#props,
        internals: this.#internals,
        ...this.#connection.helpers
      };
    }
    connectedCallback() {
      this.#connection.dispose();
      this.#connection = createConnectionScope(this, this.#root);
      try {
        // Reflected setters may mutate attributes, which is forbidden during
        // native element construction. Replay them once connection is legal.
        const pending = [
          ...this.#pendingAttributes
        ];
        this.#initializing = true;
        for (const [name, value] of pending)Reflect.set(this, name, value);
        this.#initializing = false;
        this.#render();
        config.onConnect?.(this.#context());
      } catch (error) {
        this.#initializing = false;
        this.#connection.dispose();
        throw error;
      }
    }
    disconnectedCallback() {
      this.#connection.dispose();
      config.onDisconnect?.(this.#context());
    }
    // Native moveBefore keeps this connection scope alive during keyed reorders.
    connectedMoveCallback() {}
    formAssociatedCallback(form) {
      config.onFormAssociated?.(this.#context(), form);
    }
    formDisabledCallback(disabled) {
      config.onFormDisabled?.(this.#context(), disabled);
      this.#renderAfterFormCallback();
    }
    formResetCallback() {
      config.onFormReset?.(this.#context());
      this.#renderAfterFormCallback();
    }
    formStateRestoreCallback(state, mode) {
      config.onFormStateRestore?.(this.#context(), state, mode);
      this.#renderAfterFormCallback();
    }
    #renderAfterFormCallback() {
      if (this.#internals && !this.#initializing && this.#pendingAttributes.size === 0) this.#render();
    }
    attributeChangedCallback(name, oldValue, newValue) {
      const key = attributeKeys.get(name);
      if (key === undefined) {
        throw new Error(`Unknown component attribute "${name}"`);
      }
      const definition = attributes.get(key);
      const previousProps = this.#props;
      const oldParsed = parseComponentAttribute(definition, oldValue);
      const newParsed = readComponentAttribute(definition, newValue);
      this.#props = {
        ...this.#props,
        [key]: newParsed
      };
      if (this.#initializing || this.#pendingAttributes.size > 0) return;
      this.#render();
      config.onUpdate?.(this.#context(), previousProps);
      config.onAttributeChange?.(this.#context(), key, oldParsed, newParsed);
    }
  }
  customElements.define(tagName, NalaElement);
}
