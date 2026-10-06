import { html } from "../../../../../vendor/components/dist/index.js";
import { checkboxEvents, formState } from "../ui-component-shared.js";
export const doc = {
  slug: "switch",
  title: "Switch",
  tag: "<nala-switch>",
  summary: "Turn an immediate game-library setting on or off.",
  description: "Use for a preference such as play reminders that applies immediately. The component styles a native checkbox and gives it switch semantics with role=switch; its checked state and boolean events stay native-like.",
  usage: `<nala-switch id="play-reminders" label="Play reminders"
  hint="Show a reminder when a game has not been played recently."
  name="play-reminders" checked></nala-switch>

const reminders = document.querySelector("#play-reminders");
reminders?.addEventListener("change", (event) => {
  const { value } = (event as CustomEvent<{ value: boolean }>).detail;
  settings.actions.setPlayReminders(value);
});`,
  preview: ()=>html`
      <nala-switch label="Play reminders"
        hint="Show a reminder when a game has not been played recently."
        name="play-reminders" checked></nala-switch>
    `,
  api: [
    {
      name: "label",
      type: "string attribute",
      defaultValue: '""',
      description: "Visible label and accessible name for the switch."
    },
    {
      name: "hint",
      type: "string attribute",
      defaultValue: '""',
      description: "Supporting text associated with the control."
    },
    {
      name: "name",
      type: "string attribute",
      defaultValue: '""',
      description: "Name forwarded to the native checkbox."
    },
    {
      name: "checked",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Current on/off state."
    },
    ...formState.filter((item)=>item.name !== "value")
  ],
  slots: [],
  events: checkboxEvents,
  parts: [
    "field",
    "label",
    "input",
    "control",
    "hint"
  ]
};
export const lessons = [
  {
    title: "Use a switch for an immediate setting",
    explanation: "A switch represents an on/off setting that takes effect as soon as it changes. Its native checkbox foundation keeps Space-key operation and reports a boolean value.",
    code: `<nala-switch id="play-reminders" label="Play reminders"
  hint="Show a reminder when a game has not been played recently."
  name="play-reminders" checked></nala-switch>`
  },
  {
    title: "Persist the setting from its event",
    explanation: "Listen for change and update the application-owned preference. The switch does not store or persist the setting itself.",
    code: `const reminders = document.querySelector("#play-reminders");
reminders?.addEventListener("change", (event) => {
  const { value } = (event as CustomEvent<{ value: boolean }>).detail;
  settings.actions.setPlayReminders(value);
});`
  }
];
