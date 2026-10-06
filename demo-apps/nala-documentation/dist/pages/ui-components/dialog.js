import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "dialog",
  title: "Dialog",
  tag: "<nala-dialog>",
  summary: "Present focused game editing and confirmation workflows in stackable dialogs.",
  description: "Use for focused content or workflows that need a named surface. The element wraps native <dialog>: showModal() opens a modal in the browser top layer, show() opens it non-modally, and multiple modal dialogs can stack without application-managed z-index or focus traps.",
  usage: `import type { NalaDialogElement } from "../../vendor/ui-components/dist/index.js";

<nala-dialog id="game-dialog" title="Edit game"
  description="Update the details for this game.">
  <p>Game details go here.</p>
  <nala-button slot="actions" variant="secondary">Save changes</nala-button>
</nala-dialog>

const gameDialog = document.querySelector<NalaDialogElement>("#game-dialog");
gameDialog?.showModal();
gameDialog?.close("saved");`,
  preview: ()=>html`
      <nala-button @click=${()=>document.querySelector("#game-dialog")?.showModal()}>Open game editor</nala-button>
      <nala-dialog id="game-dialog" title="Edit game"
        description="Update the details for this game.">
        <p>Sea of Stars is in your collection.</p>
        <nala-button slot="actions" variant="secondary"
          @click=${()=>document.querySelector("#remove-confirmation")?.showModal()}>Remove game</nala-button>
        <nala-dialog id="remove-confirmation" title="Remove Sea of Stars?"
          description="This change will remove the game from your collection.">
          <nala-button slot="actions" variant="secondary"
            @click=${()=>document.querySelector("#remove-confirmation")?.close("cancel")}>Keep game</nala-button>
          <nala-button slot="actions" variant="danger"
            @click=${()=>document.querySelector("#remove-confirmation")?.close("remove")}>Remove game</nala-button>
        </nala-dialog>
      </nala-dialog>
    `,
  api: [
    {
      name: "title",
      type: "string attribute",
      defaultValue: '"Dialog"',
      description: "Visible heading and accessible name for the dialog."
    },
    {
      name: "description",
      type: "string attribute",
      defaultValue: '""',
      description: "Optional description announced with the dialog heading."
    },
    {
      name: "open",
      type: "readonly boolean property",
      defaultValue: "false",
      description: "Whether the internal native dialog is currently open."
    },
    {
      name: "showModal()",
      type: "method",
      defaultValue: "closed",
      description: "Opens a modal dialog in the browser's top layer."
    },
    {
      name: "show()",
      type: "method",
      defaultValue: "closed",
      description: "Opens a non-modal dialog without blocking the page."
    },
    {
      name: "close(returnValue?)",
      type: "method",
      defaultValue: 'returnValue: ""',
      description: "Closes the dialog and exposes an optional result string."
    }
  ],
  slots: [
    {
      name: "default",
      description: "Dialog body content."
    },
    {
      name: "actions",
      description: "Optional action controls in the footer."
    }
  ],
  events: [
    {
      name: "close",
      type: "CustomEvent<{ returnValue: string }>",
      description: "Bubbles and is composed; fires after close(), the close button, or Escape closes the dialog."
    },
    {
      name: "cancel",
      type: "CustomEvent<Record<string, never>>",
      description: "Bubbles, is composed, and is cancelable; emitted for Escape before closing. Prevent the event to keep the dialog open."
    }
  ],
  parts: [
    "dialog",
    "header",
    "title",
    "close",
    "content",
    "description",
    "footer"
  ]
};
export const lessons = [
  {
    title: "Open a modal dialog",
    explanation: "showModal() places the native dialog in the browser top layer, moves focus into it, and makes the rest of the page inert until it closes.",
    code: `import type { NalaDialogElement } from "../../vendor/ui-components/dist/index.js";

const gameDialog = document.querySelector<NalaDialogElement>("#game-dialog");
gameDialog?.showModal();`
  },
  {
    title: "Stack a confirmation above the current dialog",
    explanation: "A second showModal() call adds another native modal above the first. Closing the top dialog returns the user to the still-open dialog below it; Escape closes only the topmost modal.",
    code: `const removeConfirmation = document.querySelector<NalaDialogElement>(
  "#remove-confirmation"
);
removeConfirmation?.showModal();

gameDialog?.addEventListener("close", (event) => {
  const { returnValue } = (event as CustomEvent<{ returnValue: string }>).detail;
  if (returnValue === "saved") refreshGameDetails();
});`
  }
];
