import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "progress",
  title: "Progress",
  tag: "<nala-progress>",
  summary: "Show game completion or background work with a labelled progressbar.",
  description: "Use for a status whose completion can be measured or is still underway. It wraps the native progress element: provide value and max for determinate progress, or omit value when the total is unknown.",
  usage: `<nala-progress id="collection-progress" label="Games completed"
  value="8" max="12" hint="8 of 12 games are marked complete.">
</nala-progress>

const completion = document.querySelector("#collection-progress");
if (completion) completion.value = 9;`,
  preview: ()=>html`
      <nala-progress label="Games completed" value="8" max="12"
        hint="8 of 12 games are marked complete."></nala-progress>
      <nala-progress label="Syncing collection"
        hint="The amount of work is not known yet."></nala-progress>
    `,
  api: [
    {
      name: "label",
      type: "string attribute",
      defaultValue: '"Progress"',
      description: "Visible label and accessible name for the progressbar."
    },
    {
      name: "hint",
      type: "string attribute",
      defaultValue: '""',
      description: "Supporting text associated with the progressbar."
    },
    {
      name: "value",
      type: "number property / attribute",
      defaultValue: "omitted (indeterminate)",
      description: "Current amount complete; set between 0 and max."
    },
    {
      name: "max",
      type: "number property / attribute",
      defaultValue: "100",
      description: "Maximum amount of work represented by value."
    }
  ],
  slots: [],
  events: [],
  parts: [
    "field",
    "label",
    "control",
    "hint"
  ]
};
export const lessons = [
  {
    title: "Show known collection completion",
    explanation: "When the total is known, set value and max. The browser exposes the native progressbar value while the label names the status for assistive technology.",
    code: `<nala-progress id="collection-progress"
  label="Games completed" value="8" max="12"
  hint="8 of 12 games are marked complete."></nala-progress>`
  },
  {
    title: "Use an indeterminate bar when the total is unknown",
    explanation: "Omitting value selects the native indeterminate state. It communicates ongoing work without suggesting a percentage you cannot calculate.",
    code: `<nala-progress label="Syncing collection"
  hint="The amount of work is not known yet."></nala-progress>`
  }
];
