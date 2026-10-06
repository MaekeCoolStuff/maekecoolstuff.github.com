import { html } from "../../../../../vendor/components/dist/index.js";
import { formState, stringFormEvents } from "../ui-component-shared.js";
export const doc = {
  slug: "textarea",
  title: "Textarea",
  tag: "<nala-textarea>",
  summary: "Write session notes or descriptions in a labelled multi-line text field.",
  description: "Use for longer text such as play notes or a game description. The element wraps a native textarea in Shadow DOM and reports string-valued input and change events.",
  usage: `<nala-textarea id="session-notes" label="Session notes"
  hint="Your notes are saved with this game."
  name="session-notes" rows="4"
  placeholder="Where did you leave off?"></nala-textarea>

const notes = document.querySelector("#session-notes");
notes?.addEventListener("input", (event) => {
  const { value } = (event as CustomEvent<{ value: string }>).detail;
  saveDraftNotes(value);
});`,
  preview: ()=>html`
      <nala-textarea label="Session notes"
        hint="Add details for your next play session."
        rows="4" placeholder="Where did you leave off?"></nala-textarea>
    `,
  api: [
    {
      name: "label",
      type: "string attribute",
      defaultValue: '""',
      description: "Visible label above the textarea."
    },
    {
      name: "hint",
      type: "string attribute",
      defaultValue: '""',
      description: "Supporting text below the textarea."
    },
    {
      name: "name",
      type: "string attribute",
      defaultValue: '""',
      description: "Name forwarded to the native textarea."
    },
    {
      name: "placeholder",
      type: "string attribute",
      defaultValue: '""',
      description: "Placeholder shown while the value is empty."
    },
    {
      name: "rows",
      type: "number property / attribute",
      defaultValue: "4",
      description: "Initial visible row count; the user can resize vertically."
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
    title: "Capture notes as the player types",
    explanation: "The native textarea emits the same string-valued input event as the single-line input. Keep a draft in application state without reaching into Shadow DOM.",
    code: `let sessionNotes = "";
const notes = document.querySelector("#session-notes");
notes?.addEventListener("input", (event) => {
  const { value } = (event as CustomEvent<{ value: string }>).detail;
  sessionNotes = value;
});`
  },
  {
    title: "Set the initial note and visible height",
    explanation: "Use the value property for text and rows to choose the initial height. The player can still resize the native control vertically.",
    code: `notes.value = "Reached the clockwork tower.";`
  }
];
