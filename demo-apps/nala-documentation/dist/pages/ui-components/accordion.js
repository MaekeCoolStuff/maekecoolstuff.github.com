import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "accordion",
  title: "Accordion",
  tag: "<nala-accordion>",
  summary: "Group game overview, play history, and notes into native disclosure panels.",
  description: "Use when related sections should be collapsible in place. The wrapper groups native <details>/<summary> elements, preserving browser disclosure semantics and keyboard behavior. Choose whether multiple panels may remain open with mode.",
  usage: `<nala-accordion label="Game details" mode="single">
  <details open>
    <summary>Overview</summary>
    <p>Sea of Stars is in your collection.</p>
  </details>
  <details>
    <summary>Play history</summary>
    <p>Last played yesterday.</p>
  </details>
</nala-accordion>

const details = document.querySelector("nala-accordion");
details?.addEventListener("change", (event) => {
  const { index, open } = (event as CustomEvent<{
    index: number;
    open: boolean;
  }>).detail;
  console.log("Panel", index, open ? "opened" : "closed");
});`,
  preview: ()=>html`
      <nala-accordion label="Game details" mode="single">
        <details open>
          <summary>Overview</summary>
          <p>Sea of Stars is in your collection.</p>
        </details>
        <details>
          <summary>Play history</summary>
          <p>Last played yesterday · 18 hours total.</p>
        </details>
        <details>
          <summary>Notes</summary>
          <p>Try the optional side quests before the final area.</p>
        </details>
      </nala-accordion>
    `,
  api: [
    {
      name: "label",
      type: "string attribute / property",
      defaultValue: '"Accordion"',
      description: "Accessible group name for its disclosure panels."
    },
    {
      name: "mode",
      type: '"multiple" | "single" attribute / property',
      defaultValue: '"multiple"',
      description: "Allows several panels to remain open, or closes sibling panels when one opens."
    },
    {
      name: "initial open panels",
      type: "native details open attribute",
      defaultValue: "closed",
      description: "Set open on details children. In single mode, the first initially open panel is kept open."
    }
  ],
  slots: [
    {
      name: "default",
      description: "Direct child details elements, each with a summary and its panel content."
    }
  ],
  events: [
    {
      name: "change",
      type: "CustomEvent<{ index: number; open: boolean }>",
      description: "Bubbles and is composed; reports the zero-based panel index and its new open state."
    }
  ],
  parts: [
    "items"
  ]
};
export const lessons = [
  {
    title: "Keep native disclosures in a labelled group",
    explanation: "Each panel is a real details/summary pair, so the browser supplies its disclosure state and keyboard interaction. The accordion labels the group and provides consistent spacing.",
    code: `<nala-accordion label="Game details" mode="single">
  <details open>
    <summary>Overview</summary>
    <p>Sea of Stars is in your collection.</p>
  </details>
  <details>
    <summary>Play history</summary>
    <p>Last played yesterday.</p>
  </details>
</nala-accordion>`
  },
  {
    title: "Choose whether panels can stay open together",
    explanation: "The default multiple mode allows several open panels. In single mode, opening one closes its siblings; if markup starts with multiple open panels, only the first remains open.",
    code: `const details = document.querySelector("nala-accordion");
details?.addEventListener("change", (event) => {
  const { index, open } = (event as CustomEvent<{
    index: number;
    open: boolean;
  }>).detail;
  console.log("Panel", index, open ? "opened" : "closed");
});`
  }
];
