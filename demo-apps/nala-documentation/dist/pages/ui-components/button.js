import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
defineComponent("docs-button-form-example", {
  template: ()=>html`
      <form>
        <p><label>Game title <input name="title" required /></label></p>
        <p><label>Platform <input name="platform" required /></label></p>
        <div class="button-row">
          <nala-button type="submit">Add game</nala-button>
          <nala-button type="reset" variant="secondary">Clear fields</nala-button>
        </div>
        <p role="status"
          data-result>Fill both fields, then click Add game or press Enter.</p>
      </form>
    `,
  onConnect: ({ delegate, query })=>{
    delegate("submit", "form", (event, target)=>{
      event.preventDefault();
      if (!(target instanceof HTMLFormElement)) return;
      const values = new FormData(target);
      const result = query("[data-result]");
      if (!result) throw new Error("Button example is missing its result.");
      result.textContent = `Added ${values.get("title")} on ${values.get("platform")}.`;
    });
  }
});
export const doc = {
  slug: "button",
  title: "Button",
  tag: "<nala-button>",
  summary: "Add a game, update its status, or remove it from the collection.",
  description: "Use for actions inside an application. It wraps a native button, preserving keyboard activation, focus behavior, and disabled semantics.",
  usage: `<nala-button id="mark-played">Mark as played</nala-button>

const markPlayedButton = document.querySelector("#mark-played");
markPlayedButton?.addEventListener("click", () => {
  collection.actions.markPlayed(game.id);
});`,
  preview: ()=>html`
      <div class="button-row">
        <nala-button>Add game</nala-button>
        <nala-button variant="secondary">View details</nala-button>
        <nala-button variant="ghost">Edit notes</nala-button>
        <nala-button variant="danger">Remove game</nala-button>
      </div>
    `,
  api: [
    {
      name: "variant",
      type: '"primary" | "secondary" | "ghost" | "danger"',
      defaultValue: '"primary"',
      description: "Selects the action emphasis."
    },
    {
      name: "disabled",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Prevents activation and dims the control."
    },
    {
      name: "type",
      type: '"button" | "submit" | "reset"',
      defaultValue: '"button"',
      description: "Opt into validated form submission or native form reset. Unsupported values behave as button."
    },
    {
      name: "form",
      type: "string property / attribute",
      defaultValue: "null",
      description: "Optional form ID; otherwise uses the ancestor form in the same DOM tree."
    },
    {
      name: "aria-pressed / ariaPressed",
      type: '"true" | "false" | "mixed" | null',
      defaultValue: "null",
      description: "Forwards application-owned toggle state to the visible native button. Omit for ordinary actions."
    }
  ],
  slots: [
    {
      name: "default",
      description: "Button label or other phrasing content."
    }
  ],
  events: [
    {
      name: "click",
      type: "MouseEvent",
      description: "Native composed click event."
    }
  ],
  parts: [
    "button"
  ]
};
export const lessons = [
  {
    title: "Turn a click into a collection action",
    explanation: "The element wraps a native button. Listen for its normal click event, then call the action that owns the domain change.",
    code: `const markPlayed = document.querySelector("#mark-played");

markPlayed?.addEventListener("click", () => {
  collection.actions.markPlayed(game.id);
});`
  },
  {
    title: "Choose the visual weight, not different behavior",
    explanation: "The variant changes styling only. Keep one primary action on a game detail view and use secondary or danger styles for supporting actions.",
    code: `<nala-button>Save game</nala-button>
<nala-button variant="secondary">Cancel</nala-button>
<nala-button variant="danger">Remove from collection</nala-button>`
  },
  {
    title: "Submit a real form, including with Enter",
    explanation: "The default type is button, so existing action buttons do not suddenly submit forms. Choose submit to validate and submit an ancestor form, or reset to restore its initial field values. The live example has two required native inputs: try submitting while one is empty, then fill both and press Enter. Listen to submit on the form, not click on the button, so mouse and keyboard submission share one path.",
    code: `<form id="add-game">
  <label>Game title <input name="title" required></label>
  <label>Platform <input name="platform" required></label>
  <nala-button type="submit">Add game</nala-button>
  <nala-button type="reset" variant="secondary">Clear fields</nala-button>
</form>

// A separate button can name the same form by ID.
<nala-button type="submit" form="add-game">Add game</nala-button>`,
    preview: ()=>html`<docs-button-form-example></docs-button-form-example>`
  },
  {
    title: "Understand the Shadow DOM form boundary",
    explanation: "A native button inside Shadow DOM cannot submit the outer form by itself. Nala therefore owns a hidden light-DOM native submitter and calls requestSubmit after the visible click listeners finish. This preserves browser validation and implicit Enter submission. SubmitEvent.submitter points to that native submitter, not the host. preventDefault on click cancels the form action; preventDefault on submit cancels submission. Disabled fieldsets disable the button too. The component does not contribute a name/value or support per-button form overrides.",
    code: `const form = document.querySelector("#add-game");
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!(event.currentTarget instanceof HTMLFormElement)) return;
  const values = new FormData(event.currentTarget);
  console.log(values.get("title"), values.get("platform"));
});`
  },
  {
    title: "Announce an application-owned toggle",
    explanation: "Use aria-pressed for filters and other on/off actions. The value is a string, not a presence-based boolean attribute: false must stay false. Nala forwards true, false, or mixed to the real button, and does not toggle the value for you. In this self-contained preview, the click listener flips the ariaPressed property. In Game Shelf, the store or component state should own that decision.",
    code: `<nala-button id="backlog-filter" variant="ghost" aria-pressed="false">
  Show backlog
</nala-button>

const button = document.querySelector("#backlog-filter");
button?.addEventListener("click", () => {
  if (!(button instanceof HTMLElement)) return;
  button.ariaPressed = button.ariaPressed === "true" ? "false" : "true";
});`,
    preview: ()=>html`
        <nala-button variant="ghost" aria-pressed="false"
          @click=${(event)=>{
        const button = event.currentTarget;
        if (button instanceof HTMLElement) {
          button.ariaPressed = button.ariaPressed === "true" ? "false" : "true";
        }
      }}
        >Show backlog</nala-button>
      `
  }
];
