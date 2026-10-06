import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "badge",
  title: "Badge",
  tag: "<nala-badge>",
  summary: "Make Backlog, Playing, Completed, and Wishlist states easy to scan.",
  description: "Use for short collection states such as Backlog, Playing, or Completed. A badge communicates status; it is not a button or a replacement for clear status text.",
  usage: `<nala-badge tone="accent">Backlog</nala-badge>
  <nala-badge tone="warning">Playing</nala-badge>
  <nala-badge tone="success">Completed</nala-badge>`,
  preview: ()=>html`
      <div class="button-row">
        <nala-badge tone="accent">Backlog</nala-badge>
        <nala-badge tone="warning">Playing</nala-badge>
        <nala-badge tone="success">Completed</nala-badge>
        <nala-badge tone="neutral">Wishlist</nala-badge>
        <nala-badge tone="danger">Removed</nala-badge>
      </div>
    `,
  api: [
    {
      name: "tone",
      type: '"neutral" | "accent" | "success" | "warning" | "danger"',
      defaultValue: '"neutral"',
      description: "Sets the badge's semantic color treatment."
    }
  ],
  slots: [
    {
      name: "default",
      description: "Short status or category text."
    }
  ],
  events: [],
  parts: [
    "badge"
  ]
};
export const lessons = [
  {
    title: "Make game status scannable",
    explanation: "A badge labels state; it is not an action. Pick the tone from the domain status and keep the visible status text explicit.",
    code: `<nala-badge tone="accent">Backlog</nala-badge>
<nala-badge tone="warning">Playing</nala-badge>
<nala-badge tone="success">Completed</nala-badge>`
  },
  {
    title: "Map a status to a tone",
    explanation: "Keep the mapping in application code so status logic remains separate from the element's presentation.",
    code: `const tone = game.status === "completed" ? "success"
  : game.status === "playing" ? "warning"
  : "accent";`
  }
];
