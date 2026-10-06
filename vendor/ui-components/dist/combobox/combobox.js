import { defineFormControl, dispatchComponentEvent, dispatchFormChange, dispatchFormInput, html, render, repeat, when } from "../../../components/dist/index.js";
import { filterComboboxOptions, moveComboboxOption } from "./combobox-options.js";
import { fieldStyles } from "../shared-styles.js";
let nextId = 0;
const states = new WeakMap();
function stateOf(element) {
  let state = states.get(element);
  if (!state) {
    state = {
      id: `nala-combobox-${++nextId}`,
      value: "",
      label: "",
      query: "",
      filtering: false,
      open: false,
      active: null,
      choices: [],
      composing: false,
      lastSearch: null,
      formDisabled: false,
      defaultValue: "",
      initialized: false
    };
    states.set(element, state);
  }
  return state;
}
function choicesOf(element) {
  return Array.from(element.children).filter((child)=>child instanceof HTMLOptionElement).map((option)=>({
      source: option,
      value: option.value,
      label: option.label,
      disabled: option.disabled
    }));
}
function editable(element) {
  return !element.hasAttribute("disabled") && !element.hasAttribute("readonly") && !stateOf(element).formDisabled;
}
function sync(element, root) {
  const input = root.querySelector("input");
  const list = root.querySelector(".options");
  const popup = root.querySelector(".popup");
  const status = root.querySelector(".status");
  if (!input || !list || !popup || !status) return;
  const state = stateOf(element);
  const options = choicesOf(element);
  const value = element.getAttribute("value") ?? "";
  if (state.value !== value) {
    state.value = value;
    state.label = "";
    state.filtering = false;
    state.active = null;
  }
  state.label = options.find((option)=>option.value === value)?.label ?? state.label;
  if (!state.filtering) state.query = state.label;
  if (!editable(element)) state.open = false;
  const loading = element.hasAttribute("loading");
  state.choices = filterComboboxOptions(options, state.filtering ? state.query : "");
  if (loading || !state.choices.some((choice)=>choice.source === state.active && !choice.disabled)) state.active = null;
  input.id = `${state.id}-input`;
  input.disabled = element.hasAttribute("disabled") || state.formDisabled;
  root.querySelector("label")?.setAttribute("for", input.id);
  if (!state.composing && input.value !== state.query) {
    input.value = state.query;
  }
  input.setAttribute("aria-controls", `${state.id}-list`);
  input.setAttribute("aria-expanded", String(state.open));
  if (root.querySelector(".hint")) {
    input.setAttribute("aria-describedby", `${state.id}-hint`);
  } else input.removeAttribute("aria-describedby");
  input.setAttribute("aria-label", element.getAttribute("label") || "Search options");
  input.setAttribute("aria-required", String(element.hasAttribute("required")));
  root.querySelector(".hint")?.setAttribute("id", `${state.id}-hint`);
  // Query text is not a selection; native required validation alone cannot tell them apart.
  input.setCustomValidity(element.hasAttribute("required") && !state.value ? "Please select an option." : "");
  list.id = `${state.id}-list`;
  list.setAttribute("aria-label", element.getAttribute("label") || "Options");
  list.setAttribute("aria-busy", String(loading));
  popup.hidden = !state.open;
  render(html`${repeat(state.choices, (choice)=>choice.source, (choice, index)=>html`
            <div id=${`${state.id}-option-${index}`} data-index=${String(index)}
              role="option" part="option"
              aria-selected=${String(choice.value === value)}
              aria-disabled=${String(choice.disabled || loading)}
              ?data-active=${state.open && choice.source === state.active}>${choice.label}</div>
          `)}`, list);
  const activeIndex = state.open ? state.choices.findIndex((choice)=>choice.source === state.active) : -1;
  const activeId = activeIndex < 0 ? null : `${state.id}-option-${activeIndex}`;
  if (activeId) {
    input.setAttribute("aria-activedescendant", activeId);
    list.querySelector("[data-active]")?.scrollIntoView({
      block: "nearest"
    });
  } else input.removeAttribute("aria-activedescendant");
  status.textContent = !state.open ? "" : loading ? "Loading options..." : state.choices.length === 0 ? "No results" : `${state.choices.length} options available`;
  status.toggleAttribute("data-empty", loading || state.choices.length === 0);
}
function close(element, root) {
  const state = stateOf(element);
  state.open = false;
  state.filtering = false;
  state.active = null;
  state.lastSearch = null;
  sync(element, root);
}
function commit(element, root, value) {
  const previous = element.getAttribute("value") ?? "";
  close(element, root);
  element.value = value;
  if (previous !== value) {
    dispatchFormInput(element, value);
    dispatchFormChange(element, value);
  }
}
defineFormControl("nala-combobox", {
  shadow: true,
  form: {
    value: ({ props })=>props.value || "",
    validity: ({ props, root })=>{
      const missing = props.required && !props.value && !props.readonly;
      return {
        flags: {
          valueMissing: missing
        },
        message: missing ? "Please select an option." : undefined,
        anchor: root.querySelector("input") ?? undefined
      };
    },
    reset: ({ element, root })=>{
      close(element, root);
      element.value = stateOf(element).defaultValue;
    },
    disabled: ({ element, root }, disabled)=>{
      stateOf(element).formDisabled = disabled;
      sync(element, root);
    },
    restore: ({ element, root }, value)=>{
      if (typeof value !== "string") {
        throw new TypeError("Combobox form state must be a string");
      }
      close(element, root);
      element.value = value;
    }
  },
  props: {
    label: "string",
    hint: "string",
    name: "string",
    placeholder: "string",
    loading: "boolean"
  },
  styles: `${fieldStyles}\n${".wrap { position: relative; min-width: 0; }\ninput { padding: 0 0.8rem; }\n.popup {\n  position: absolute;\n  z-index: 10;\n  top: calc(100% + 0.25rem);\n  width: 100%;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-small, 4px);\n  background: var(--nala-ui-color-surface, #fffefa);\n  box-shadow: var(--nala-ui-shadow-raised, 0 1rem 2rem rgba(35, 48, 42, 0.12));\n}\n.options { max-height: 15rem; overflow: auto; }\n[role=\"option\"] { padding: 0.65rem 0.8rem; cursor: pointer; overflow-wrap: anywhere; }\n[role=\"option\"]:hover, [data-active] { background: var(--nala-ui-color-accent-soft, #d8e8df); }\n[aria-selected=\"true\"] { font-weight: 750; }\n[aria-disabled=\"true\"] { opacity: 0.55; cursor: not-allowed; }\n.status { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }\n.status[data-empty] { position: static; width: auto; height: auto; clip-path: none; padding: 0.65rem 0.8rem; }\n"}`,
  template: (props)=>html`
      <div class="field" part="field">
        <label class="label" part="label" ?hidden=${!props.label}>${props.label}</label>
        <div class="wrap">
          <input class="control" part="control" type="text" role="combobox"
            aria-autocomplete="list" aria-haspopup="listbox" autocomplete="off"
            name=${props.name} placeholder=${props.placeholder}
            ?disabled=${props.disabled} ?readonly=${props.readonly}
            ?required=${props.required} />
          <div class="popup" part="popup" hidden>
            <div class="options" part="options" role="listbox"></div>
            <div class="status" part="status" role="status" aria-live="polite"></div>
          </div>
        </div>
        ${when(Boolean(props.hint), ()=>html`<span class="hint" part="hint">${props.hint}</span>`)}
      </div>
    `,
  onAfterRender: ({ element, root })=>sync(element, root),
  onConnect: ({ element, root, delegate, listen, onCleanup })=>{
    const state = stateOf(element);
    if (!state.initialized) {
      state.defaultValue = element.getAttribute("value") ?? "";
      state.initialized = true;
    }
    const search = ()=>{
      if (!editable(element)) return;
      const input = root.querySelector("input");
      state.query = input.value;
      state.filtering = true;
      state.open = true;
      state.active = null;
      sync(element, root);
      if (state.lastSearch !== state.query) {
        state.lastSearch = state.query;
        dispatchComponentEvent(element, "search", {
          query: state.query
        }, {
          bubbles: true,
          composed: true
        });
      }
    };
    const open = ()=>{
      if (!editable(element)) return;
      state.open = true;
      sync(element, root);
    };
    delegate("focusin", "input", open);
    delegate("click", "input", open);
    delegate("compositionstart", "input", ()=>state.composing = true);
    delegate("compositionend", "input", ()=>{
      state.composing = false;
      search();
    });
    delegate("input", "input", (event)=>{
      event.stopPropagation();
      if (!state.composing) search();
    });
    delegate("change", "input", (event)=>event.stopPropagation());
    delegate("focusout", "input", ()=>{
      if (state.filtering && state.query === "" && editable(element)) {
        commit(element, root, "");
      } else close(element, root);
    });
    delegate("pointerdown", '[role="option"]', (event)=>event.preventDefault());
    delegate("click", '[role="option"]', (_event, target)=>{
      const choice = state.choices[Number(target.dataset.index)];
      if (!editable(element) || element.hasAttribute("loading") || !choice || choice.disabled) return;
      commit(element, root, choice.value);
      root.querySelector("input")?.focus();
    });
    delegate("keydown", "input", (event)=>{
      if (event.isComposing || state.composing || !editable(element)) return;
      if (event.key === "Escape" && state.open) {
        event.preventDefault();
        event.stopPropagation();
        close(element, root);
      } else if (event.key === "Enter" && state.open) {
        event.preventDefault();
        const choice = state.choices.find((choice)=>choice.source === state.active);
        if (choice && !choice.disabled && !element.hasAttribute("loading")) {
          commit(element, root, choice.value);
        }
      } else if (event.key === "ArrowDown" || event.key === "ArrowUp" || state.open && (event.key === "Home" || event.key === "End")) {
        event.preventDefault();
        state.open = true;
        const direction = event.key === "ArrowUp" || event.key === "End" ? -1 : 1;
        const active = event.key === "Home" || event.key === "End" ? -1 : state.choices.findIndex((choice)=>choice.source === state.active);
        const index = moveComboboxOption(state.choices, active, direction);
        state.active = state.choices[index]?.source ?? null;
        sync(element, root);
      }
    });
    listen(document, "pointerdown", (event)=>{
      if (!event.composedPath().includes(element)) {
        if (state.filtering && state.query === "" && editable(element)) {
          commit(element, root, "");
        } else close(element, root);
      }
    });
    const observer = new MutationObserver(()=>sync(element, root));
    observer.observe(element, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [
        "value",
        "label",
        "disabled"
      ]
    });
    onCleanup(()=>observer.disconnect());
    onCleanup(()=>{
      state.composing = false;
      close(element, root);
    });
  }
});
