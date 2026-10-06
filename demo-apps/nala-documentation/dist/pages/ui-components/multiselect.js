import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "multiselect",
  title: "Multiselect",
  tag: "<nala-multiselect>",
  summary: "Filter games across several platforms in a checkbox dropdown.",
  description: "Use when a player may choose more than one platform. Light-DOM options provide the choices; the dropdown displays native checkboxes, and its values property returns the selected platform ids. Escape and an outside click close the menu.",
  usage: `<nala-multiselect id="platforms" label="Platforms"
  hint="Leave empty to show every platform" placeholder="All platforms">
  <option value="pc" selected>PC</option>
  <option value="switch">Nintendo Switch</option>
  <option value="ps5">PlayStation 5</option>
</nala-multiselect>

import type { NalaMultiselectElement } from "../../vendor/ui-components/dist/index.js";

const platforms = document.querySelector<NalaMultiselectElement>("#platforms");
platforms?.addEventListener("change", (event) => {
  const { value } = (event as CustomEvent<{ value: string[] }>).detail;
  visibleGames = value.length === 0 ? games : games.filter((game) =>
    value.includes(game.platformId)
  );
});`,
  preview: ()=>html`
      <nala-multiselect label="Platforms" hint="Choose one or more platforms"
        placeholder="All platforms">
        <option value="pc" selected>PC</option>
        <option value="switch">Nintendo Switch</option>
        <option value="ps5">PlayStation 5</option>
      </nala-multiselect>
    `,
  api: [
    {
      name: "label",
      type: "string attribute",
      defaultValue: '""',
      description: "Visible label above the dropdown and accessible name for its options."
    },
    {
      name: "hint",
      type: "string attribute",
      defaultValue: '""',
      description: "Supporting text below the dropdown."
    },
    {
      name: "placeholder",
      type: "string attribute",
      defaultValue: '"Select options"',
      description: "Text shown while no options are selected."
    },
    {
      name: "values",
      type: "string[] property",
      defaultValue: "selected option values",
      description: "Read or replace the selected values. Changes to options are observed."
    },
    {
      name: "disabled",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Prevents opening the dropdown and disables its checkboxes."
    },
    {
      name: "options",
      type: "light-DOM <option> children",
      defaultValue: "none",
      description: "Use selected for initial values and disabled to prevent individual choices."
    }
  ],
  slots: [
    {
      name: "default",
      description: "Native <option> elements define the choices."
    }
  ],
  events: [
    "input",
    "change"
  ].map((name)=>({
      name,
      type: "CustomEvent<{ value: string[] }>",
      description: "Bubbles and is composed; reports the selected option values after a checkbox changes."
    })),
  parts: [
    "field",
    "label",
    "control",
    "options",
    "hint"
  ]
};
export const lessons = [
  {
    title: "Keep choices in native option elements",
    explanation: "Each light-DOM option supplies a value and visible label. Add selected to start with a choice checked; disabled options cannot be changed by the player.",
    code: `<nala-multiselect label="Platforms" placeholder="All platforms">
  <option value="pc" selected>PC</option>
  <option value="switch">Nintendo Switch</option>
  <option value="ps5">PlayStation 5</option>
</nala-multiselect>`
  },
  {
    title: "Filter with an array of platform ids",
    explanation: "The values property and both event payloads are arrays of strings. An empty array can mean all platforms in your application. Set values from code to restore a saved filter.",
    code: `import type { NalaMultiselectElement } from "../../vendor/ui-components/dist/index.js";

    const platforms = document.querySelector<NalaMultiselectElement>(
  "#platforms"
);
if (platforms) {
  platforms.values = savedPlatformIds;
  platforms.addEventListener("change", (event) => {
    const { value } = (event as CustomEvent<{ value: string[] }>).detail;
    visibleGames = value.length === 0 ? games : games.filter((game) =>
      value.includes(game.platformId)
    );
  });
}`
  }
];
