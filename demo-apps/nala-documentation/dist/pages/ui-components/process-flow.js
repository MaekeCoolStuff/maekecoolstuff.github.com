import { html } from "../../../../../vendor/components/dist/index.js";
const steps = [
  {
    id: "form",
    title: "Enter a game",
    location: "Browser · form",
    description: "The player submits a title.",
    input: "Game title",
    action: "Player: enter a title and activate the form's submit button.",
    output: "Submit event",
    boundary: "A form event alone does not save a game."
  },
  {
    id: "commit",
    title: "Validate and commit",
    location: "Application · store action",
    description: "Accept a valid title and create a new collection state.",
    input: "Submitted title",
    action: "Application: validate the title and call the store action.",
    output: "Immutable collection state",
    boundary: "Reject blank titles before committing."
  },
  {
    id: "render",
    title: "Update the shelf",
    location: "Browser · renderer",
    description: "Render the committed collection as visible game cards.",
    input: "Collection state",
    action: "Application: render the committed collection into the shelf.",
    output: "Updated DOM",
    boundary: "This diagram illustrates behavior; it does not execute it."
  }
];
export const doc = {
  slug: "process-flow",
  title: "Process flow",
  tag: "<nala-process-flow>",
  summary: "Explain an ordered process with visible inputs, results and responsibility boundaries.",
  description: "A readable diagram built from a native ordered list. Compact numbered cards keep the title, location and explanation together, with an explicit Input → Action → Result sequence below. Actions can name a command, user gesture or automatic operation; identify who performs them. Wide containers use two columns: read each row left to right, then move down. Narrow containers use one column. Every step is visible without interaction, animation or color interpretation. The application supplies the content: this is not a workflow engine or progress tracker.",
  usage: `import type { NalaProcessFlowElement } from "./vendor/ui-components/dist/index.js";

const flow = document.querySelector<NalaProcessFlowElement>("nala-process-flow");
if (!flow) throw new Error("Process flow is missing.");
flow.steps = [
  { id: "submit", title: "Submit game", description: "The form emits a submit event.",
    location: "Browser", input: "Title", action: "Player: submit the form.", output: "Event",
    boundary: "No state is saved yet." },
  { id: "save", title: "Commit", description: "Validate and commit a new collection state." },
];
// HTML: <nala-process-flow label="Adding a game"></nala-process-flow>`,
  preview: ()=>html`
      <nala-process-flow label="Game Shelf · from submission to display"
        .steps=${steps}></nala-process-flow>
    `,
  api: [
    {
      name: "steps",
      type: "readonly NalaProcessStep[] property",
      defaultValue: "[]",
      description: "Each step needs a unique nonblank id and title, and a string description. Optional string location, input, action, output and boundary annotations remain visible. Action describes what transforms the input into the result; it is text, not executed code. Omitted action preserves the original input/result presentation. Empty descriptions and optional strings are allowed. Invalid assignments throw before replacing valid state. Assign fresh arrays; stable ids preserve step nodes across reorder."
    },
    {
      name: "label",
      type: "string property / attribute",
      defaultValue: '"Process"',
      description: "Visible heading and accessible section name. No active-stage or completion semantics are implied."
    }
  ],
  slots: [],
  events: [],
  parts: [
    "flow",
    "heading",
    "list",
    "step",
    "title",
    "location",
    "description",
    "action",
    "boundary",
    "empty"
  ]
};
export const lessons = [];
