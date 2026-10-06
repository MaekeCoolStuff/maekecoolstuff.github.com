import { html } from "../../../../../vendor/components/dist/index.js";
import { formState, stringFormEvents } from "../ui-component-shared.js";
export const doc = {
  slug: "date-picker",
  title: "Date picker",
  tag: "<nala-date-picker>",
  summary: "Choose a calendar date with the browser's native date control.",
  description: "A labeled native date input with date bounds, hints, and typed form events. The browser supplies its localized calendar interface.",
  usage: `<nala-date-picker id="game-release" label="Release date"
  min="1980-01-01" max="2035-12-31"></nala-date-picker>

const releaseDate = document.querySelector("#game-release");
releaseDate?.addEventListener("change", (event) => {
  const { value } = (event as CustomEvent<{ value: string }>).detail;
  console.log("Release date:", value); // ISO YYYY-MM-DD
});`,
  preview: ()=>html`
      <div class="control-grid">
        <nala-date-picker label="Date added"
          hint="Choose a calendar date"></nala-date-picker>
        <nala-date-picker label="Original release date"
          min="1980-01-01" max="2035-12-31"></nala-date-picker>
      </div>
    `,
  api: [
    {
      name: "label",
      type: "string property / attribute",
      defaultValue: '""',
      description: "Visible label for the native date control."
    },
    {
      name: "hint",
      type: "string property / attribute",
      defaultValue: '""',
      description: "Supporting text below the date control."
    },
    {
      name: "name",
      type: "string property / attribute",
      defaultValue: '""',
      description: "Name forwarded to the internal native input."
    },
    {
      name: "min",
      type: "string property / attribute",
      defaultValue: '""',
      description: "Earliest allowed date in YYYY-MM-DD form."
    },
    {
      name: "max",
      type: "string property / attribute",
      defaultValue: '""',
      description: "Latest allowed date in YYYY-MM-DD form."
    },
    {
      name: "step",
      type: "number property / attribute",
      defaultValue: "1 (native)",
      description: "Allowed interval in days when specified."
    },
    ...formState,
    {
      name: "readonly",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Prevents editing while retaining the selected value."
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
    title: "Read a calendar date",
    explanation: "The component uses the browser's native date input. Browsers choose the calendar UI and localized display, but the value exposed by the component remains an ISO YYYY-MM-DD string. Use that stable form when saving or comparing calendar dates.",
    code: `const releaseDate = document.querySelector("#game-release");
releaseDate?.addEventListener("change", (event) => {
  const { value } = (event as CustomEvent<{ value: string }>).detail;
  console.log(value); // e.g. "2024-05-10"
});`
  },
  {
    title: "Constrain the date range",
    explanation: "Set min and max to ISO date strings to make the browser prevent dates outside the allowed range. The optional step is measured in days. These are native input constraints; browsers may present validation differently, and server-side rules still need their own validation.",
    code: `<nala-date-picker
  label="Release date"
  min="1980-01-01"
  max="2035-12-31"
  step="1">
</nala-date-picker>`
  },
  {
    title: "Set the current date from code",
    explanation: "Assign an ISO date string through the value property. input events report in-progress changes and change reports a confirmed selection. The component does not parse locale-formatted date strings.",
    code: `const releaseDate = document.querySelector("#game-release");
releaseDate.value = "2024-05-10";`
  }
];
