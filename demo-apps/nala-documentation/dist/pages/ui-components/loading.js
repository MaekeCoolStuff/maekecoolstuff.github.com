import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "loading",
  title: "Loading",
  tag: "<nala-loading>",
  summary: "Indicate ongoing game loading or sync work without implying a percentage.",
  description: "Use while work is in progress and the amount remaining is unknown. The component exposes a polite status with aria-busy, and offers a spinner or animated bar. When completion becomes measurable, switch to <nala-progress> with a real value and maximum.",
  usage: `<nala-loading label="Loading your collection"></nala-loading>
<nala-loading variant="bar" label="Syncing game changes"
  show-label></nala-loading>`,
  preview: ()=>html`
      <nala-loading label="Loading your collection" show-label></nala-loading>
      <nala-loading variant="bar" label="Syncing game changes"
        show-label></nala-loading>
    `,
  api: [
    {
      name: "label",
      type: "string attribute",
      defaultValue: '"Loading"',
      description: "Accessible status name and optional visible message."
    },
    {
      name: "variant",
      type: '"spinner" | "bar" attribute',
      defaultValue: '"spinner"',
      description: "Selects a compact spinner or a full-width indeterminate bar."
    },
    {
      name: "show-label",
      type: "boolean attribute",
      defaultValue: "false",
      description: "Displays the label next to the loading indicator."
    }
  ],
  slots: [],
  events: [],
  parts: [
    "status",
    "indicator",
    "label"
  ]
};
export const lessons = [
  {
    title: "Show ongoing work when its total is unknown",
    explanation: "Loading has no value or percentage. It announces a polite status while the collection request is pending; choose a spinner for compact spaces or a bar for a wider region.",
    code: `<nala-loading label="Loading your collection"></nala-loading>
<nala-loading variant="bar" label="Syncing game changes"
  show-label></nala-loading>`
  },
  {
    title: "Switch back to progress when you know the amount complete",
    explanation: "Do not animate a percentage that the application cannot calculate. When the total becomes known, use progress with a real value and maximum.",
    code: `<nala-progress label="Games completed" value="8" max="12"></nala-progress>`
  }
];
