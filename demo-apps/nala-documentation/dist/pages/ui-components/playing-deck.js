import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "playing-deck",
  title: "Playing deck",
  tag: "<nala-playing-deck>",
  summary: "Show a compact stack of face-down playing cards.",
  description: "Three overlapping playing-card backs with responsive, layout-contained offsets and one accessible image name. It reuses the playing-card artwork and palette; the layers are visual, not a card count or game engine.",
  usage: `<nala-playing-deck></nala-playing-deck>
<nala-playing-deck label="Game Shelf draw pile"
  style="--nala-playing-card-back: #7c3aed"></nala-playing-deck>`,
  preview: ()=>html`
      <div class="button-row">
        <nala-playing-deck></nala-playing-deck>
        <nala-playing-deck label="Game Shelf draw pile"
          style="--nala-playing-card-back: #7c3aed"></nala-playing-deck>
      </div>
    `,
  api: [
    {
      name: "label",
      type: "string property / attribute",
      defaultValue: '"Face-down playing deck"',
      description: "Accessible name for the whole stack. Whitespace is trimmed; blank or removed labels use the default."
    },
    {
      name: "decorative",
      type: "boolean property / presence-based attribute",
      defaultValue: "false",
      description: 'Hides the entire image from assistive technology. Use inside a labelled native button; decorative="false" still means true.'
    },
    {
      name: "NalaPlayingDeckElement",
      type: "exported element interface",
      defaultValue: "label / decorative",
      description: "Type querySelector or other element references for reflected property access."
    },
    {
      name: "CSS custom properties",
      type: "--nala-playing-deck-width; --nala-playing-card-width / paper / border / back",
      defaultValue: "7.5rem total width; playing-card palette",
      description: "Explicit host width also works. Deck width falls back to playing-card width. The complete stack is 108:148; each card stays 5:7 and offsets are included in layout bounds."
    }
  ],
  slots: [],
  events: [],
  parts: [
    "stack",
    "layer",
    "top-card"
  ]
};
export const lessons = [
  {
    title: "A stack picture is not a deck engine",
    explanation: "Game Shelf can show a card-game preview using a pile of cards rather than one face. The deck component places three existing playing-card backs on top of each other with small offsets. Each card stays crisp at any size because its artwork is SVG. The three layers only suggest a stack: they do not count your cards or store a shuffled deck. In a browser game, keep the actual array and drawing rules in your own app state.",
    code: `<nala-playing-deck></nala-playing-deck>
<nala-playing-card face-down></nala-playing-card>`,
    preview: ()=>html`
        <div class="button-row">
          <nala-playing-deck></nala-playing-deck>
          <nala-playing-card face-down></nala-playing-card>
        </div>
      `
  },
  {
    title: "Size and theme the whole pile together",
    explanation: "The deck's width includes its offset layers, so it does not spill into neighboring content. Its default total width is 7.5rem, or the inherited playing-card width when set. The top card is slightly narrower than the stack. Explicit width or --nala-playing-deck-width changes the whole stack proportionally, and max-width keeps it within a narrow container. The same paper, border, and back-color variables used by playing cards flow through all three layers.",
    code: `<nala-playing-deck label="Game Shelf draw pile"
  style="--nala-playing-deck-width: 10rem; --nala-playing-card-back: #7c3aed">
</nala-playing-deck>`,
    preview: ()=>html`
        <nala-playing-deck label="Game Shelf draw pile"
          style="--nala-playing-deck-width: 10rem; --nala-playing-card-back: #7c3aed"></nala-playing-deck>
      `
  },
  {
    title: "Let a native button own the action",
    explanation: "By default the stack is one image named Face-down playing deck. A label such as Game Shelf draw pile replaces that name, while a blank label falls back to the default. The underlying cards are decorative and are not announced separately. The deck itself is not focusable and does not draw cards. For a clickable draw pile, wrap a decorative deck in a labelled native button, then attach your app's draw action to the button. The browser already provides keyboard activation and focus.",
    code: `<button type="button" aria-label="Draw a card">
  <nala-playing-deck decorative></nala-playing-deck>
</button>`,
    preview: ()=>html`
        <button type="button" aria-label="Draw a card">
          <nala-playing-deck decorative></nala-playing-deck>
        </button>
      `
  }
];
