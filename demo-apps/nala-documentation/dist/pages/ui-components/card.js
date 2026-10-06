import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "card",
  title: "Card",
  tag: "<nala-card>",
  summary: "Group a game's title, platform, play time, and actions in one slotted surface.",
  description: "Use to group one game's title, platform, play time, and actions. Native slots place your light-DOM children into the card's Shadow DOM; the footer hides when its actions slot is empty.",
  usage: `<nala-card variant="raised">
  <span slot="eyebrow">Nintendo Switch</span>
  <span slot="title">Sea of Stars</span>
  <p>Started 12 September · 18 hours played</p>
  <nala-button slot="actions" variant="secondary">
    View game details
  </nala-button>
</nala-card>`,
  preview: ()=>html`
      <nala-card
        variant="raised"><span slot="eyebrow">Nintendo Switch</span><span slot="title">Sea of Stars</span><p>Playing · 18 hours</p><nala-button slot="actions" variant="secondary">View details</nala-button></nala-card>
    `,
  api: [
    {
      name: "variant",
      type: '"outlined" | "raised" | "accent"',
      defaultValue: '"outlined"',
      description: "Selects the border and elevation treatment."
    }
  ],
  slots: [
    {
      name: "eyebrow",
      description: "Optional short label above the title."
    },
    {
      name: "title",
      description: "Optional card heading."
    },
    {
      name: "default",
      description: "Main card content."
    },
    {
      name: "actions",
      description: "Optional footer actions; footer hides when empty."
    }
  ],
  events: [],
  parts: [
    "card",
    "header",
    "eyebrow",
    "title",
    "content",
    "footer"
  ]
};
export const lessons = [
  {
    title: "Let slots give the card its meaning",
    explanation: "The card owns a visual frame; your app supplies the game title, metadata, content, and actions as native slotted children.",
    code: `<nala-card variant="raised">
  <span slot="eyebrow">Nintendo Switch</span>
  <span slot="title">Sea of Stars</span>
  <p>Started 12 September · 18 hours played</p>
  <nala-button slot="actions" variant="secondary">
    View details
  </nala-button>
</nala-card>`
  },
  {
    title: "Optional slots stay optional",
    explanation: "Leave out actions when a card is just informative. The component hides its footer when the actions slot has no assigned content.",
    code: `<nala-card>
  <span slot="title">Collection total</span>
  <p>42 games across 4 platforms.</p>
</nala-card>`
  }
];
