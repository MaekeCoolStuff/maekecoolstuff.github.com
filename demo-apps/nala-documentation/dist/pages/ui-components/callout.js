import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "callout",
  title: "Callout",
  tag: "<nala-callout>",
  summary: "Explain collection updates, offline changes, and other important tracker states.",
  description: "Use for an important collection message, such as edits waiting to sync. The title slot is optional and the default slot holds the explanation.",
  usage: `<nala-callout tone="warning">
  <span slot="title">Offline changes are waiting</span>
  Your game edits are saved on this device and will sync when you reconnect.
</nala-callout>`,
  preview: ()=>html`
      <nala-callout
        tone="success"><span slot="title">Game added</span>Celeste is now in your collection.</nala-callout>
      <nala-callout
        tone="warning"><span slot="title">Offline changes are waiting</span>Your edits will sync when you reconnect.</nala-callout>
    `,
  api: [
    {
      name: "tone",
      type: '"info" | "success" | "warning" | "danger"',
      defaultValue: '"info"',
      description: "Sets the message's semantic treatment."
    }
  ],
  slots: [
    {
      name: "title",
      description: "Optional short heading."
    },
    {
      name: "default",
      description: "Message body."
    }
  ],
  events: [],
  parts: [
    "callout",
    "title",
    "content"
  ]
};
export const lessons = [
  {
    title: "Explain a collection state near the affected content",
    explanation: "Use the title slot for a short summary and the default slot for what happened and what the player can expect next.",
    code: `<nala-callout tone="warning">
  <span slot="title">Offline changes are waiting</span>
  Your game edits are saved on this device and will sync when you reconnect.
</nala-callout>`
  },
  {
    title: "Choose tone by consequence",
    explanation: "Informational and success messages should not look like failures. Reserve danger for an actual problem that needs attention.",
    code: `<nala-callout tone="success">
  <span slot="title">Game added</span>
  Celeste is now in your collection.
</nala-callout>`
  }
];
