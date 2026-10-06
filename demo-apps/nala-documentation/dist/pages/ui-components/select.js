import { html } from "../../../../../vendor/components/dist/index.js";
import { stringFormEvents } from "../ui-component-shared.js";
import { formControlsPreview } from "./form-controls-example.js";
export const doc = {
  slug: "select",
  title: "Select",
  tag: "<nala-select>",
  summary: "Filter the collection by platform using ordinary native option elements.",
  description: "Use for a finite choice such as platform. Options stay in ordinary HTML; the component clones them into its native select and a MutationObserver keeps later edits synchronized.",
  usage: `<nala-select id="platform-filter" label="Platform" name="platform" value="all">
  <option value="all">All platforms</option>
  <option value="pc">PC</option>
  <option value="switch">Nintendo Switch</option>
  <option value="ps5">PlayStation 5</option>
</nala-select>

const platformFilter = document.querySelector("#platform-filter");
platformFilter?.addEventListener("change", (event) => {
  const { value } = (event as CustomEvent<{ value: string }>).detail;
  visibleGames = value === "all" ? games : games.filter((game) =>
    game.platformId === value
  );
});`,
  preview: ()=>html`
      <nala-select label="Platform" hint="Filter the collection"
        name="platform" value="all">
        <option value="all">All platforms</option>
        <option value="pc">PC</option>
        <option value="switch">Nintendo Switch</option>
        <option value="ps5">PlayStation 5</option>
      </nala-select>
    `,
  api: [
    {
      name: "label",
      type: "string attribute",
      defaultValue: '""',
      description: "Visible label above the select."
    },
    {
      name: "hint",
      type: "string attribute",
      defaultValue: '""',
      description: "Supporting text below the select."
    },
    {
      name: "name",
      type: "string attribute",
      defaultValue: '""',
      description: "Native form submission name; unnamed selects are omitted from FormData."
    },
    {
      name: "form",
      type: "native string attribute",
      defaultValue: "none",
      description: "Associates with a form by ID instead of the ancestor form."
    },
    {
      name: "value",
      type: "string property / attribute",
      defaultValue: '""',
      description: "Selected option value."
    },
    {
      name: "disabled",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Disables the native select."
    },
    {
      name: "required",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Marks the native select as required."
    },
    {
      name: "options",
      type: "light-DOM <option> children",
      defaultValue: "none",
      description: "Native options; changes are observed and synchronized."
    }
  ],
  slots: [
    {
      name: "default",
      description: "One or more native <option> elements."
    }
  ],
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
    title: "Keep the choices as HTML options",
    explanation: "Options are ordinary light-DOM elements. The component mirrors them into its internal native select and watches for later edits.",
    code: `<nala-select label="Platform" name="platform" value="all">
  <option value="all">All platforms</option>
  <option value="pc">PC</option>
  <option value="switch">Nintendo Switch</option>
  <option value="ps5">PlayStation 5</option>
</nala-select>`
  },
  {
    title: "Make the shelf choice part of a native form",
    explanation: "A named nala-select contributes its selected string to FormData through ElementInternals. required copies the browser select's validity, so an empty placeholder blocks submission. Set value on the host for the initial selection; selected attributes on options do not replace it. An absent or unmatched value leaves no selection and submits an empty string. Try saving the live form before choosing a shelf, then reset it.",
    code: `<nala-select label="Shelf" name="status" value="" required>
  <option value="">Choose a shelf</option>
  <option value="backlog">Backlog</option>
  <option value="playing">Playing</option>
</nala-select>`,
    preview: formControlsPreview
  },
  {
    title: "Preserve reset, disabled state, and changing options",
    explanation: "form.reset restores the first-render host value even after reconnect, and emits no input/change events. A disabled fieldset disables the inner select and excludes the host from FormData; a selected disabled option is also omitted. The native form attribute supports an external form. Changes to light-DOM options refresh native selection, form value, and validity without emitting user events. Browser string state restoration also updates the value. These behaviors require form-associated Custom Elements.",
    code: `<form id="collection-settings"></form>
<nala-select label="Shelf" name="status" value="backlog"
  form="collection-settings">
  <option value="backlog">Backlog</option>
  <option value="playing">Playing</option>
</nala-select>`
  },
  {
    title: "Filter by the selected value",
    explanation: "The change event uses the same { value } shape as the text input. Its value is a string such as switch, the platform id in this example.",
    code: `const platformFilter = document.querySelector("#platform-filter");

    platformFilter?.addEventListener("change", (event) => {
  const { value } = (event as CustomEvent<{ value: string }>).detail;
  visibleGames = value === "all"
    ? games
    : games.filter((game) => game.platformId === value);
});`
  }
];
