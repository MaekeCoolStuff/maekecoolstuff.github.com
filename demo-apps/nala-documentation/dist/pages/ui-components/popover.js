import { html } from "../../../../../vendor/components/dist/index.js";
function closePopover(event) {
  if (!(event.currentTarget instanceof HTMLElement)) return;
  event.currentTarget.closest("nala-popover")?.close();
}
export const doc = {
  slug: "popover",
  title: "Popover",
  tag: "<nala-popover>",
  summary: "Open richer, interactive content beside a trigger without a modal.",
  description: "A tooltip offers a short hint; a popover offers a small workspace. Use it for Game Shelf filters, notes, or collection details while the surrounding page remains usable. The native Popover API places its panel in the top layer without a modal backdrop, inert page, or focus trap.",
  usage: `<nala-popover label="Collection filters" trigger-text="Filter games">
  <label>
    <input type="checkbox" checked> Include completed games
  </label>
  <p>These filters only affect your current collection view.</p>
</nala-popover>

<nala-popover id="game-notes" label="Hades notes" position="right">
  <button slot="trigger" type="button">Edit notes</button>
  <label>Collection note <textarea autofocus></textarea></label>
</nala-popover>`,
  preview: ()=>html`
      <div class="button-row">
        <nala-popover label="Collection filters" trigger-text="Filter games">
          <strong>Collection filters</strong>
          <p><label><input type="checkbox" checked> Include completed games</label></p>
          <p><label>Platform
            <select><option>All platforms</option><option>PC</option><option>Switch</option></select>
          </label></p>
          <button type="button" @click=${closePopover}>Done</button>
        </nala-popover>
        <nala-popover label="Hades notes" position="right">
          <button slot="trigger" type="button">Edit Hades notes</button>
          <label>Collection note
            <textarea autofocus rows="3" style="display: block; max-width: 100%">Try a new weapon on the next run.</textarea>
          </label>
          <p>Notes remain here when you close and reopen the panel.</p>
          <button type="button" @click=${closePopover}>Done</button>
        </nala-popover>
      </div>
    `,
  api: [
    {
      name: "label",
      type: "string property / attribute",
      defaultValue: '"Popover"',
      description: "Accessible name of the non-modal dialog panel. Add a visible heading in the content when helpful; this label does not render a heading."
    },
    {
      name: "trigger-text",
      type: "string property / attribute",
      defaultValue: '"Open popover"',
      description: "Text on the built-in button when no trigger is slotted."
    },
    {
      name: "position",
      type: '"top" | "right" | "bottom" | "left" property / attribute',
      defaultValue: '"bottom"',
      description: "Preferred side. Unknown values use bottom. Flips to a roomier opposite side when needed, then clamps within an 8px viewport margin. Repositions on scroll, resize, and content size changes."
    },
    {
      name: "open",
      type: "readonly boolean property",
      defaultValue: "false",
      description: "Reads the native panel's current state, including outside-click and Escape dismissal. Not an attribute."
    },
    {
      name: "show() / close() / toggle()",
      type: "methods",
      defaultValue: "closed",
      description: "Control the connected panel imperatively. show() and close() are idempotent; methods called while disconnected throw. Import NalaPopoverElement for typed DOM queries."
    },
    {
      name: "--nala-popover-width",
      type: "CSS custom property",
      defaultValue: "20rem",
      description: "Panel width, capped at viewport width minus 16px. Tall content scrolls; shared theme tokens control its colors, border, radius, and shadow."
    }
  ],
  slots: [
    {
      name: "default",
      description: "Rich content, including native form controls, links, and buttons. Nodes are preserved across close/reopen."
    },
    {
      name: "trigger",
      description: 'Optional single native <button type="button"> replacing the built-in button. Do not use nala-button here. The component temporarily manages its popover target/action, aria-haspopup, and aria-expanded and restores them on replacement or disconnect. A slotted trigger uses native togglePopover() because its target is in another Shadow DOM tree.'
    }
  ],
  events: [
    {
      name: "open-change",
      type: "CustomEvent<{ open: boolean }>",
      description: "Bubbles and is composed. Reports the native toggle event after opening or closing, including light dismissal. Rapid toggles can coalesce into one final-state notification."
    }
  ],
  parts: [
    "trigger",
    "panel"
  ]
};
export const lessons = [
  {
    title: "Keep a small workflow beside the collection",
    explanation: "Put interactive content in the default slot rather than in a tooltip. The browser's auto popover closes on Escape or an outside click and normally closes unrelated auto popovers when another opens. Clicking inside does not dismiss it. It is not modal: there is no focus trap, and Tab can leave the panel. These preview controls demonstrate local interaction only; connect them to your Game Shelf actions to filter actual games.",
    code: `<nala-popover label="Collection filters" trigger-text="Filter games">
  <label><input type="checkbox"> Only games in my backlog</label>
</nala-popover>`
  },
  {
    title: "Choose where focus starts",
    explanation: "The built-in button uses popoverTargetElement. A slotted button lives outside the panel's Shadow DOM tree, so its native click toggles the panel with togglePopover({ source: trigger }) instead. Native buttons provide Enter and Space activation. Opening normally keeps focus on the trigger; an autofocus control in the content receives focus after opening. Closing while focus is in the content restores it to the trigger; clicking another focusable control can then move focus there normally. Tab is never trapped. Use nala-dialog.showModal() when a workflow must block the page.",
    code: `<nala-popover label="Hades notes">
  <button slot="trigger" type="button">Edit notes</button>
  <label>Collection note <textarea autofocus></textarea></label>
</nala-popover>`
  },
  {
    title: "Close after an application action",
    explanation: "The popover does not interpret Save or Done buttons. After your own action finishes, call close() explicitly. Its readonly open property always reflects the browser state; subscribe to open-change when another part of the app needs to react. Content is not rebuilt on dismissal, so an unfinished note remains available when reopened.",
    code: `import type { NalaPopoverElement } from "../../vendor/ui-components/dist/index.js";

const notes = document.querySelector<NalaPopoverElement>("#game-notes");
if (!notes) throw new Error("Missing game notes popover");
notes.close();`
  }
];
