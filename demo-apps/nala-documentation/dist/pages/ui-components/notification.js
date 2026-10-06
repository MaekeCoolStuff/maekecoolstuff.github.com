import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
defineComponent("docs-notification-example", {
  styles: `
    :host {
      display: block;
    }

    .notification-stack {
      display: grid;
      gap: 0.6rem;
      margin-top: 0.8rem;
    }
  `,
  template: ()=>html`
      <div class="button-row">
        <label>
          Position
          <select>
            <option value="inline">Inline</option>
            <option value="top-left">Top left</option>
            <option value="top-right">Top right</option>
            <option value="bottom-left">Bottom left</option>
            <option value="bottom-right">Bottom right</option>
          </select>
        </label>
        <button type="button">Show game update</button>
      </div>
      <div class="notification-stack"></div>
    `,
  onConnect: ({ listen, query })=>{
    const button = query("button");
    const position = query("select");
    const stack = query(".notification-stack");
    if (!button || !position || !stack) {
      throw new Error("Notification example is missing its controls");
    }
    listen(button, "click", ()=>{
      const notification = document.createElement("nala-notification");
      notification.setAttribute("tone", "success");
      notification.setAttribute("position", position.value);
      notification.textContent = "Celeste was added to your collection.";
      stack.append(notification);
    });
  }
});
export const doc = {
  slug: "notification",
  title: "Notification",
  tag: "<nala-notification>",
  summary: "Confirm an action or report an important update without interrupting the current task.",
  description: "A notification announces a short status message and includes a dismiss button. It dismisses itself after five seconds by default; hovering or moving keyboard focus into it pauses the timer. Keep the default inline placement, or select a window corner for a global notification in the browser's native top layer.",
  usage: `<!-- Inline: stays where you put it in the page. -->
<nala-notification tone="success">
  Celeste was added to your collection.
</nala-notification>

<!-- Global: no fixed-position container or z-index needed. -->
<nala-notification tone="success" position="bottom-right">
  Celeste was added to your collection.
</nala-notification>`,
  preview: ()=>html`<docs-notification-example></docs-notification-example>`,
  api: [
    {
      name: "position",
      type: '"inline" | "top-left" | "top-right" | "bottom-left" | "bottom-right" property / attribute',
      defaultValue: '"inline"',
      description: "Inline preserves normal document flow. Corner positions use a manual native popover in the top layer and stack automatically per corner. Absent or unknown values use inline. Changing placement does not restart the timer."
    },
    {
      name: "tone",
      type: '"info" | "success" | "warning" | "danger" property / attribute',
      defaultValue: '"info"',
      description: "Chooses the visual treatment. Warning and danger use an assertive alert role; other tones use a polite status role."
    },
    {
      name: "duration",
      type: "number property / attribute (milliseconds)",
      defaultValue: "5000",
      description: "Time before automatic dismissal. Set to 0 to keep it visible until dismissed. Invalid or negative values use 5000ms."
    },
    {
      name: "dismiss()",
      type: "method",
      defaultValue: "—",
      description: "Dismisses the element and emits a bubbling, composed dismiss event."
    }
  ],
  slots: [
    {
      name: "default",
      description: "Notification message; text and other phrasing content."
    }
  ],
  events: [
    {
      name: "dismiss",
      type: "CustomEvent<{}>",
      description: "Bubbles and is composed when the close button, dismiss() method, or timeout removes the notification."
    }
  ],
  parts: [
    "notification",
    "message",
    "dismiss"
  ]
};
export const lessons = [
  {
    title: "Announce short, useful updates",
    explanation: "Notifications are for brief feedback that does not require an answer. Keep longer explanations beside the affected content in a callout instead.",
    code: `<nala-notification tone="success">
  Celeste was added to your collection.
</nala-notification>`
  },
  {
    title: "Choose a tone and a lifetime",
    explanation: 'The default info tone is polite. Warning and danger messages are announced assertively. Hover the live example or move keyboard focus into it to pause the five-second timer; use duration="0" when it should wait for dismissal.',
    code: `<nala-notification tone="danger" duration="0">
  The game could not be saved. Try again.
</nala-notification>`
  },
  {
    title: "Own placement and stacking in the app",
    explanation: "The default stays in normal document flow. Put inline notifications in an app-owned container and use Grid or Flexbox for spacing; existing app-owned fixed positioning still works. Nothing moves to a window corner unless you opt in with position.",
    code: `<div class="notification-stack">
  <nala-notification>First update</nala-notification>
  <nala-notification tone="warning">Second update</nala-notification>
</div>`
  },
  {
    title: "Show global notifications without a positioning container",
    explanation: "Choose any of the four corners in the live example, then click several times to see messages stack. A corner notification is a manual native popover: it escapes ancestor clipping, transforms, and z-index stacking contexts, without a backdrop that blocks the page or light-dismiss on outside clicks. The first notification sits 16px from the corner; later ones stack inward with a 10px gap. Resizing content or dismissing a message updates the stack.",
    code: `<nala-notification position="top-left">Collection synced.</nala-notification>
<nala-notification position="top-right">Game added.</nala-notification>
<nala-notification position="bottom-left">Wishlist updated.</nala-notification>
<nala-notification position="bottom-right">Changes saved.</nala-notification>`
  },
  {
    title: "Keep browser top-layer and modal behavior in mind",
    explanation: "Global positioning requires native Popover API support. A newly shown notification appears above existing top-layer surfaces, including dialogs, but a dialog or popover opened later can appear above it: the browser orders the top layer by opening time. Global positioning is not modal and does not steal focus. A modal dialog still makes content outside that dialog inert; append notifications inside the dialog when their dismiss button must be usable while it is open. Essential errors should also remain visible near the affected content, and applications should avoid flooding the screen with messages.",
    code: `import type { NalaNotificationElement } from "../../vendor/ui-components/dist/index.js";

const notification = document.createElement("nala-notification") as NalaNotificationElement;
notification.position = "bottom-right";
notification.tone = "success";
notification.textContent = "Celeste was added to your collection.";
document.body.append(notification);

// Change placement without replacing the node or restarting its timer.
notification.position = "inline";`
  }
];
