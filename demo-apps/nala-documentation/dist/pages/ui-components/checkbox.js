import { html } from "../../../../../vendor/components/dist/index.js";
import { checkboxEvents, formState } from "../ui-component-shared.js";
export const doc = {
  slug: "checkbox",
  title: "Checkbox",
  tag: "<nala-checkbox>",
  summary: "Show or hide groups of games with a labelled true-or-false filter.",
  description: "Use for an independent filter such as completed games only. It renders a native checkbox; event detail.value is a boolean that can drive a filter directly.",
  usage: `<nala-checkbox id="completed-only" label="Show completed games only"
  hint="Hide games that are still in your backlog."
  name="completed-only"></nala-checkbox>

const completedOnly = document.querySelector("#completed-only");
completedOnly?.addEventListener("change", (event) => {
  const { value } = (event as CustomEvent<{ value: boolean }>).detail;
  visibleGames = value
    ? games.filter((game) => game.status === "completed")
    : games;
});`,
  preview: ()=>html`
      <nala-checkbox label="Show completed games only"
        hint="Hide backlog and currently playing games."></nala-checkbox>
      <nala-checkbox label="Include wishlist" name="include-wishlist"
        checked></nala-checkbox>
    `,
  api: [
    {
      name: "label",
      type: "string attribute",
      defaultValue: '""',
      description: "Visible label next to the checkbox."
    },
    {
      name: "hint",
      type: "string attribute",
      defaultValue: '""',
      description: "Supporting text below the label."
    },
    {
      name: "name",
      type: "string attribute",
      defaultValue: '""',
      description: "Name forwarded to the internal checkbox."
    },
    {
      name: "checked",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Current checked state."
    },
    ...formState.filter((item)=>item.name !== "value")
  ],
  slots: [],
  events: checkboxEvents,
  parts: [
    "field",
    "label",
    "control",
    "hint"
  ]
};
export const lessons = [
  {
    title: "Represent a yes-or-no filter",
    explanation: "A checkbox is a yes-or-no choice. Its event payload is a boolean, not an HTML string such as 'on', so it can directly decide whether to show completed games.",
    code: `const completedOnly = document.querySelector("#completed-only");

    completedOnly?.addEventListener("change", (event) => {
  const { value } = (event as CustomEvent<{ value: boolean }>).detail;
  visibleGames = value
    ? games.filter((game) => game.status === "completed")
    : games;
});`
  },
  {
    title: "Set its state from application code",
    explanation: "The checked property is boolean. It is separate from the event listener and can be initialized from a saved filter preference.",
    code: `completedOnly.checked = savedFilters.completedOnly;`
  }
];
