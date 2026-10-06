import { createAsyncState, defineComponent, html } from "../../../../../vendor/components/dist/index.js";
defineComponent("docs-combobox-search-example", {
  template: ()=>html`
      <nala-combobox label="Search the Game Shelf catalog"
        placeholder="Try Celeste or Hades"
        hint="These suggestions come from the application's search listener."></nala-combobox>
      <p role="status">Type to search the local catalog.</p>
    `,
  onConnect: ({ query, listen, onCleanup })=>{
    const control = query("nala-combobox");
    const status = query("p");
    if (!control || !status) {
      throw new Error("Combobox example is missing its controls");
    }
    const games = [
      {
        id: "celeste",
        title: "Celeste"
      },
      {
        id: "hades",
        title: "Hades"
      },
      {
        id: "hollow-knight",
        title: "Hollow Knight"
      },
      {
        id: "sea-of-stars",
        title: "Sea of Stars"
      },
      {
        id: "tunic",
        title: "Tunic"
      }
    ];
    const search = createAsyncState((matches)=>matches.length === 0, {
      concurrency: "latest"
    });
    onCleanup(search.subscribe((state)=>{
      control.loading = state.status === "loading";
      if (state.status === "success") {
        control.replaceChildren(...(state.data ?? []).map((game)=>new Option(game.title, game.id)));
        status.textContent = `${state.data?.length ?? 0} matching games in the local catalog.`;
      } else if (state.status === "error") {
        control.replaceChildren();
        status.textContent = "Could not search games. Type again to retry.";
        console.error("Game search failed", state.error);
      }
    }));
    onCleanup(()=>search.reset());
    listen(control, "search", (event)=>{
      const { query } = event.detail;
      void search.load(()=>Promise.resolve(games.filter((game)=>game.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))));
    });
    listen(control, "change", (event)=>{
      const { value } = event.detail;
      status.textContent = value ? `Selected game id: ${value}` : "Selection cleared.";
    });
  }
});
defineComponent("docs-combobox-form-example", {
  template: ()=>html`
      <form>
        <fieldset>
          <legend>Add a game to the shelf</legend>
          <nala-combobox name="gameId" label="Game" required value="celeste">
            <option value="celeste">Celeste</option>
            <option value="hades">Hades</option>
            <option value="tunic">Tunic</option>
          </nala-combobox>
          <div class="button-row">
            <button type="submit">Save choice</button>
            <button type="reset">Reset</button>
          </div>
        </fieldset>
        <button type="button" data-disable>Disable form fields</button>
        <p role="status">Submit to see the committed game id from FormData.</p>
      </form>
    `,
  onConnect: ({ query, listen })=>{
    const form = query("form");
    const fieldset = query("fieldset");
    const button = query("[data-disable]");
    const status = query("p");
    if (!form || !fieldset || !button || !status) {
      throw new Error("Combobox form example is missing its controls");
    }
    listen(form, "submit", (event)=>{
      event.preventDefault();
      const value = new FormData(form).get("gameId");
      status.textContent = value === null ? "Disabled fields are not submitted." : `Submitted game id: ${value}`;
    });
    listen(form, "reset", ()=>{
      status.textContent = "Reset to the initial choice: Celeste.";
    });
    listen(button, "click", ()=>{
      fieldset.disabled = !fieldset.disabled;
      button.textContent = fieldset.disabled ? "Enable form fields" : "Disable form fields";
    });
  }
});
export const doc = {
  slug: "combobox",
  title: "Combobox / autocomplete",
  tag: "<nala-combobox>",
  summary: "Search a long or changing list and select one Game Shelf option.",
  description: "A combobox joins a text field to a suggestion list. The text is a search query, not a saved choice: selecting a suggestion commits its option value while the field displays its label. Use select for short lists, multiselect for several choices, and combobox when finding one choice needs search.",
  usage: `<nala-combobox id="game-picker" label="Game" placeholder="Search games">
  <option value="hollow-knight">Hollow Knight</option>
  <option value="sea-of-stars">Sea of Stars</option>
  <option value="hades" disabled>Hades (unavailable)</option>
  <option value="celeste">Celeste</option>
</nala-combobox>

const picker = document.querySelector("#game-picker");
picker?.addEventListener("change", (event) => {
  const { value } = (event as CustomEvent<{ value: string }>).detail;
  console.log("Selected game id:", value);
});`,
  preview: ()=>html`
      <nala-combobox label="Game" placeholder="Search games"
        hint="Type part of a title, then use arrows and Enter or click a suggestion.">
        <option value="hollow-knight">Hollow Knight</option>
        <option value="sea-of-stars">Sea of Stars</option>
        <option value="hades" disabled>Hades (unavailable)</option>
        <option value="celeste">Celeste</option>
        <option value="tunic">Tunic</option>
      </nala-combobox>
    `,
  api: [
    {
      name: "label",
      type: "string property / attribute",
      defaultValue: '""',
      description: "Visible and accessible name. Without a label the accessible name is Search options; supply a meaningful label."
    },
    {
      name: "hint",
      type: "string property / attribute",
      defaultValue: '""',
      description: "Supporting text linked to the input through aria-describedby."
    },
    {
      name: "placeholder",
      type: "string property / attribute",
      defaultValue: '""',
      description: "Prompt when there is no selection or query."
    },
    {
      name: "value",
      type: "string property / attribute",
      defaultValue: '""',
      description: "Committed option value, not query text. The matching option label is displayed. Empty string means no selection; use unique, nonempty option values."
    },
    {
      name: "disabled",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Disables the field and closes the suggestions."
    },
    {
      name: "readonly",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Keeps the field focusable but prevents searching or selecting; closes suggestions."
    },
    {
      name: "required",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Native form validation requires a nonempty committed value, not merely query text. Disabled and readonly controls are excluded from validation."
    },
    {
      name: "name",
      type: "string property / attribute",
      defaultValue: '""',
      description: "Native form submission name for the committed option value. Unnamed or disabled controls are omitted from FormData. The native form attribute can select an external form owner."
    },
    {
      name: "loading",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Announces Loading options and prevents selecting stale suggestions. Fetching, errors, debounce, and response ordering remain application-owned."
    },
    {
      name: "options",
      type: "direct light-DOM <option> children",
      defaultValue: "none",
      description: "Search uses a case-insensitive substring of option.label (label attribute or option text), ignoring surrounding query whitespace. Disabled options remain visible but cannot be selected. Child, text, label, value, and disabled attribute changes are observed."
    }
  ],
  slots: [
    {
      name: "default",
      description: "Native option children supply data, not custom suggestion templates. Optgroups are not supported."
    }
  ],
  events: [
    {
      name: "search",
      type: "CustomEvent<{ query: string }>",
      description: "Bubbles and is composed; reports edited query text without changing value. IME composition waits until completion. Does not fire for focus, programmatic value changes, or choosing a suggestion."
    },
    {
      name: "input",
      type: "CustomEvent<{ value: string }>",
      description: "Bubbles and is composed; emitted when selecting or clearing changes the committed value, not on query typing."
    },
    {
      name: "change",
      type: "CustomEvent<{ value: string }>",
      description: "Bubbles and is composed; emitted after input for the same committed value change."
    }
  ],
  parts: [
    "field",
    "label",
    "control",
    "hint",
    "popup",
    "options",
    "option",
    "status"
  ]
};
export const lessons = [
  {
    title: "Separate the query from the saved choice",
    explanation: "Game Shelf stores a game id such as hollow-knight, while people read Hollow Knight. Option values are ids and labels are display text. Focus or click opens all current options; typing narrows them without changing the saved id. Selecting with a pointer or Enter updates value before input and change fire. Programmatic value assignments do not emit those events. Arbitrary text is never committed.",
    code: `import type { NalaComboboxElement } from "../../vendor/ui-components/dist/index.js";

const picker = document.querySelector<NalaComboboxElement>("#game-picker");
if (!picker) throw new Error("Missing game picker");
picker.value = "hollow-knight"; // Displays Hollow Knight, stores the id.
console.log(picker.value); // "hollow-knight"`
  },
  {
    title: "Keep focus in the text field",
    explanation: "The native input has role combobox and points to a listbox in the same Shadow Root. Arrow Down and Up move an active descendant, skipping disabled options and wrapping at the ends. While open, Home and End go to the first and last available suggestion; Enter selects the active one. Escape closes and restores the selected label. Tab or outside interaction closes without selecting unfinished text. To clear, erase the field and leave it; Escape cancels even that edit. A polite status announces result counts, no results, or loading.",
    code: `<nala-combobox label="Game" value="celeste">
  <option value="celeste">Celeste</option>
  <option value="hades" disabled>Hades (unavailable)</option>
  <option value="tunic">Tunic</option>
</nala-combobox>`,
    preview: ()=>html`
        <nala-combobox label="Game" value="celeste">
          <option value="celeste">Celeste</option>
          <option value="hades" disabled>Hades (unavailable)</option>
          <option value="tunic">Tunic</option>
        </nala-combobox>
      `
  },
  {
    title: "Let the application supply dynamic suggestions",
    explanation: "Listen for search and replace the light-DOM options. The component observes new choices without replacing the input, so focus and typing survive. This live example searches a small local catalog, needs no network, and begins with no options. If a selected option disappears from a result list, its last known label and value remain until another selection or clear. A programmatically supplied value has a blank label until its matching option arrives.",
    code: `const games = [
  { id: "celeste", title: "Celeste" },
  { id: "hades", title: "Hades" },
];
picker.addEventListener("search", (event) => {
  const { query } = (event as CustomEvent<{ query: string }>).detail;
  const matches = games.filter((game) =>
    game.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
  );
  picker.replaceChildren(...matches.map((game) =>
    new Option(game.title, game.id)
  ));
});`,
    preview: ()=>html`<docs-combobox-search-example></docs-combobox-search-example>`
  },
  {
    title: "Own network timing and failures explicitly",
    explanation: "The component does not fetch or debounce. Use the core createAsyncState primitive with concurrency latest so only the newest request publishes success or error. This replaces application-owned request counters. The example assumes picker is the typed element introduced above, searchGames(query) returns Promise<Array<{ id: string; title: string }>>, and errorStatus is an application-owned element with role alert. Local substring filtering still applies to remote results. Cancellation remains the loader's responsibility: latest suppresses stale state publication, not the request itself. Render results from subscriptions, not from the return value of load, because stale calls still resolve their own data.",
    code: `import { createAsyncState } from "../../vendor/components/dist/index.js";

const search = createAsyncState<Array<{ id: string; title: string }>>(
  (games) => games.length === 0,
  { concurrency: "latest" },
);
const stop = search.subscribe((state) => {
  picker.loading = state.status === "loading";
  errorStatus.textContent = "";
  if (state.status === "success" && state.data) {
    const games = state.data;
    picker.replaceChildren(...games.map((game) =>
      new Option(game.title, game.id)
    ));
  } else if (state.status === "error") {
    picker.replaceChildren();
    errorStatus.textContent = "Could not load games. Type again to retry.";
    console.error("Game search failed", state.error);
  }
});
picker.addEventListener("search", (event) => {
  const { query } = (event as CustomEvent<{ query: string }>).detail;
  void search.load(() => searchGames(query));
});
// In a component, tie both operations to onCleanup:
// stop(); search.reset();`
  },
  {
    title: "Compose with forms and layouts deliberately",
    explanation: "The combobox opts into the core package's native ElementInternals support. Its name submits the committed game id, never the search query. Required blocks form submission when no choice is committed; a disabled fieldset disables the inner input and omits the value without mutating the host's disabled attribute. Reset restores the value present on the first connection, closes suggestions, and emits no input/change events. Native restored state restores the committed id. Other existing Nala controls keep their non-form-associated behavior until they explicitly opt in. Try submit, reset, and disabled fieldset below.",
    code: `<form id="shelf-form">
  <nala-combobox name="gameId" label="Game" required value="celeste">
    <option value="celeste">Celeste</option>
    <option value="hades">Hades</option>
  </nala-combobox>
  <button type="submit">Save choice</button>
  <button type="reset">Reset</button>
</form>

const form = document.querySelector<HTMLFormElement>("#shelf-form");
if (!form) throw new Error("Missing shelf form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(new FormData(form).get("gameId"));
});`,
    preview: ()=>html`<docs-combobox-form-example></docs-combobox-form-example>`
  },
  {
    title: "Keep platform boundaries visible",
    explanation: "The form feature requires native form-associated Custom Elements and ElementInternals; there is no hidden-input polyfill or silent fallback. Applications should still validate selected ids against domain data. The popup is positioned below the field, with a scrollable list; it is not in the browser top layer and an ancestor with overflow hidden can clip it. Theme inherited --nala-ui-* variables or use the exposed parts. No custom option rendering, optgroups, free-text values, automatic selection, or list virtualization is provided.",
    code: `const data = new FormData(form);
const selectedGameId = data.get("gameId");
// Validate selectedGameId against your domain data before saving.`
  }
];
