import { html } from "../../../../../vendor/components/dist/index.js";
import { formState, stringFormEvents } from "../ui-component-shared.js";
import { formControlsPreview } from "./form-controls-example.js";
export const doc = {
  slug: "input",
  title: "Input",
  tag: "<nala-input>",
  summary: "Search the collection or enter a new game title with a labelled native input.",
  description: "Use for a single-line value such as a game title search. The component renders a labelled native input in Shadow DOM and reports typed input/change events.",
  usage: `<nala-input id="game-search" label="Search your games" type="search" name="game-search"
  placeholder="Search game titles..."></nala-input>

const search = document.querySelector("#game-search");
search?.addEventListener("input", (event) => {
  const { value } = (event as CustomEvent<{ value: string }>).detail;
  visibleGames = games.filter((game) =>
    game.title.toLowerCase().includes(value.trim().toLowerCase())
  );
});`,
  preview: ()=>html`
      <div class="control-grid">
        <nala-input label="Search your games" type="search"
          placeholder="Title, platform, genre"></nala-input>
        <nala-input label="Add a game title" hint="You can edit this later"
          placeholder="e.g. Celeste"></nala-input>
      </div>
    `,
  api: [
    {
      name: "label",
      type: "string attribute",
      defaultValue: '""',
      description: "Visible label; omitted when empty."
    },
    {
      name: "hint",
      type: "string attribute",
      defaultValue: '""',
      description: "Supporting text below the input."
    },
    {
      name: "type",
      type: "string attribute",
      defaultValue: '"text"',
      description: "Native input type, for example search or text; supported values follow the browser."
    },
    {
      name: "name",
      type: "string attribute",
      defaultValue: '""',
      description: "Native form submission name; unnamed inputs are omitted from FormData."
    },
    {
      name: "form",
      type: "native string attribute",
      defaultValue: "none",
      description: "Associates with a form by ID instead of the ancestor form."
    },
    {
      name: "maxlength",
      type: "number property / attribute",
      defaultValue: "null",
      description: "Native maximum user-entered length, not a truncation rule for programmatic values."
    },
    {
      name: "autocomplete",
      type: "string property / attribute",
      defaultValue: "null",
      description: "Native autocomplete hint, such as off or a browser-supported token."
    },
    {
      name: "placeholder",
      type: "string attribute",
      defaultValue: '""',
      description: "Native input placeholder."
    },
    ...formState,
    {
      name: "readonly",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Prevents editing while keeping the value readable."
    }
  ],
  slots: [],
  events: stringFormEvents,
  parts: [
    "field",
    "label",
    "control",
    "hint"
  ]
};
export const lessons = [
  {
    title: "Read the value from the component event",
    explanation: "Typing in the internal native input dispatches a bubbling input event. Its detail.value is a string, so the application can filter titles without reaching into Shadow DOM.",
    code: `const search = document.querySelector("#game-search");

    search?.addEventListener("input", (event) => {
  const { value } = (event as CustomEvent<{ value: string }>).detail;
  const query = value.trim().toLowerCase();
  visibleGames = games.filter((game) =>
    game.title.toLowerCase().includes(query)
  );
});`
  },
  {
    title: "Submit and reset through the browser",
    explanation: "A named nala-input now participates in the surrounding form through ElementInternals. FormData reads the live value, required and native type validation can block submission, and form.reset restores the initial value without emitting input or change. A disabled fieldset disables the inner input; readonly fields keep their value but do not block validation. Try the live example with an empty title or shelf, then save with Enter. The submit handler receives the native form, not an input click.",
    code: `<form id="add-game">
  <nala-input label="Game title" name="title" required
    maxlength="100" autocomplete="off"></nala-input>
  <nala-button type="submit">Save game</nala-button>
  <nala-button type="reset">Reset fields</nala-button>
</form>

document.querySelector("#add-game")?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!(event.currentTarget instanceof HTMLFormElement)) return;
  const values = new FormData(event.currentTarget);
  console.log(values.get("title"));
});`,
    preview: formControlsPreview
  },
  {
    title: "Keep live typing and native constraints distinct",
    explanation: "Typing updates value before the input event. Programmatic assignments emit no input or change. maxlength follows native user-entry rules and does not truncate assignments. For number inputs, invalid editing text stays in the native input and blocks validation while the host retains its last valid value. Reset uses the first-render value even after reconnect. Browser state restoration accepts strings. Form-associated Custom Elements are required; no hidden-input fallback is used.",
    code: `<nala-input label="Game title" value="Celeste" name="title"
  maxlength="100" autocomplete="off"></nala-input>`
  },
  {
    title: "Use properties for live values",
    explanation: "When code needs to set the value, assign the component's value property. The wrapper reflects its public state and updates its internal input.",
    code: `search.value = "Hollow Knight";
console.log(search.value); // "Hollow Knight"`
  }
];
