import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "tabs",
  title: "Tabs",
  tag: "<nala-tabs>",
  summary: "Switch between a game's overview, notes, and play history.",
  description: "Use tabs for closely related views where users benefit from switching without leaving the current context. Native buttons in the tab slot pair by order with panels in the panel slot. Set orientation to vertical to place the tablist beside its panel and move arrow-key navigation to Up/Down.",
  usage: `<nala-tabs id="game-details" label="Game details" selected="0">
  <button slot="tab">Overview</button>
  <button slot="tab">Play history</button>
  <section slot="panel">
    <p>Playing on Nintendo Switch.</p>
  </section>
  <section slot="panel">
    <p>Last played yesterday · 18 hours total.</p>
  </section>
</nala-tabs>

const details = document.querySelector("#game-details");
details?.addEventListener("change", (event) => {
  const { value } = (event as CustomEvent<{ value: number }>).detail;
  savePreferredGameView(value);
});`,
  preview: ()=>html`
      <p>Horizontal</p>
      <nala-tabs label="Game details">
        <button slot="tab">Overview</button>
        <button slot="tab">Play history</button>
        <section
          slot="panel"><strong>Sea of Stars</strong><p>Playing on Nintendo Switch.</p></section>
        <section slot="panel">
          <p>Last played yesterday · 18 hours total.</p>
        </section>
      </nala-tabs>
      <p>Vertical</p>
      <nala-tabs label="Game details" orientation="vertical">
        <button slot="tab">Overview</button>
        <button slot="tab">Play history</button>
        <section
          slot="panel"><strong>Sea of Stars</strong><p>Playing on Nintendo Switch.</p></section>
        <section slot="panel">
          <p>Last played yesterday · 18 hours total.</p>
        </section>
      </nala-tabs>
    `,
  api: [
    {
      name: "label",
      type: "string attribute",
      defaultValue: '"Tabs"',
      description: "Accessible name applied to the tablist."
    },
    {
      name: "selected",
      type: "number property / attribute",
      defaultValue: "0",
      description: "Zero-based index of the active tab and panel."
    },
    {
      name: "orientation",
      type: '"horizontal" | "vertical" attribute',
      defaultValue: '"horizontal"',
      description: "Controls layout, aria-orientation, and arrow-key direction."
    }
  ],
  slots: [
    {
      name: "tab",
      description: "Native button; one for each panel."
    },
    {
      name: "panel",
      description: "Panel content, paired by position."
    }
  ],
  events: [
    {
      name: "change",
      type: "CustomEvent<{ value: number }>",
      description: "Bubbles and is composed; reports the active tab index after activation."
    }
  ],
  parts: [
    "tablist"
  ]
};
export const lessons = [
  {
    title: "Keep each view paired with its tab",
    explanation: "Buttons in the tab slot pair by position with panels in the panel slot. The component supplies tab semantics and hides inactive panels.",
    code: `<nala-tabs label="Game details">
  <button slot="tab">Overview</button>
  <button slot="tab">Play history</button>
  <section slot="panel">Current status and platform.</section>
  <section slot="panel">Recent sessions and play time.</section>
</nala-tabs>`
  },
  {
    title: "Respond to a changed view",
    explanation: "The selected property is a zero-based index. Clicks and keyboard navigation update it and emit a composed change event for application state to observe.",
    code: `const details = document.querySelector("nala-tabs");
details?.addEventListener("change", (event) => {
  const { value } = (event as CustomEvent<{ value: number }>).detail;
  savePreferredGameView(value);
});`
  },
  {
    title: "Choose a vertical layout when it fits the content",
    explanation: "Vertical tabs place the tablist beside the panel and use Arrow Up and Down for navigation. Home and End work in either orientation.",
    code: `<nala-tabs label="Game details" orientation="vertical">
  <button slot="tab">Overview</button>
  <button slot="tab">Play history</button>
  <section slot="panel">Current status and platform.</section>
  <section slot="panel">Recent sessions and play time.</section>
</nala-tabs>`
  }
];
