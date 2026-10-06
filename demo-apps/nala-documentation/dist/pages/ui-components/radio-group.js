import { html } from "../../../../../vendor/components/dist/index.js";
import { formState, stringFormEvents } from "../ui-component-shared.js";
export const doc = {
  slug: "radio-group",
  title: "Radio group",
  tag: "<nala-radio-group>",
  summary: "Choose one game status with an always-visible set of native radio controls.",
  description: "Use for a small, mutually exclusive set of choices such as a collection status. Native light-DOM option elements supply values and labels; the component mirrors them into one native radio group so keyboard selection and exclusivity work normally.",
  usage: `<nala-radio-group id="status-filter" label="Game status"
  name="status" value="playing">
  <option value="backlog">Backlog</option>
  <option value="playing">Currently playing</option>
  <option value="completed">Completed</option>
</nala-radio-group>

const statusFilter = document.querySelector("#status-filter");
statusFilter?.addEventListener("change", (event) => {
  const { value } = (event as CustomEvent<{ value: string }>).detail;
  visibleGames = games.filter((game) => game.status === value);
});`,
  preview: ()=>html`
      <nala-radio-group label="Game status" hint="Choose one status"
        name="game-status" value="playing">
        <option value="backlog">Backlog</option>
        <option value="playing">Currently playing</option>
        <option value="completed">Completed</option>
      </nala-radio-group>
    `,
  api: [
    {
      name: "label",
      type: "string attribute",
      defaultValue: '"Choose an option"',
      description: "Visible legend and accessible name for the group."
    },
    {
      name: "hint",
      type: "string attribute",
      defaultValue: '""',
      description: "Supporting text below the choices."
    },
    {
      name: "name",
      type: "string attribute",
      defaultValue: '""',
      description: "Name forwarded to each internal native radio input."
    },
    ...formState,
    {
      name: "options",
      type: "light-DOM <option> children",
      defaultValue: "none",
      description: "Each option provides a unique value and label; selected supplies the initial value only when value is absent, and disabled prevents that choice."
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
    "options",
    "hint"
  ]
};
export const lessons = [
  {
    title: "Choose one collection status",
    explanation: "A radio group is for mutually exclusive choices. Native option elements provide each stable value and label, while the component reports the selected status as a string.",
    code: `<nala-radio-group id="status-filter" label="Game status"
  name="status" value="playing">
  <option value="backlog">Backlog</option>
  <option value="playing">Currently playing</option>
  <option value="completed">Completed</option>
</nala-radio-group>`
  },
  {
    title: "Filter with the selected value",
    explanation: "The value property and input/change event detail use the same string. Disabled options remain visible but cannot be selected.",
    code: `const statusFilter = document.querySelector("#status-filter");
statusFilter?.addEventListener("change", (event) => {
  const { value } = (event as CustomEvent<{ value: string }>).detail;
  visibleGames = games.filter((game) => game.status === value);
});`
  }
];
