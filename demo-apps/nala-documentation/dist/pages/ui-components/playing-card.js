import { html, repeat } from "../../../../../vendor/components/dist/index.js";
import { nalaPlayingCardRanks, nalaPlayingCardSuits } from "../../../../../vendor/ui-components/dist/index.js";
export const doc = {
  slug: "playing-card",
  title: "Playing card",
  tag: "<nala-playing-card>",
  summary: "Compose a complete 52-card deck, optional jokers, and a card back.",
  description: "A scalable, local SVG playing card with mirrored corners, exact number-card pips, original court portraits, and accessible names. It is presentational: your app owns dealing, selection, turns, and game rules.",
  usage: `<nala-playing-card rank="A" suit="spades"></nala-playing-card>
<nala-playing-card rank="10" suit="hearts"></nala-playing-card>
<nala-playing-card face-down></nala-playing-card>`,
  preview: ()=>html`<div>
        ${repeat(nalaPlayingCardSuits, (suit)=>suit, (suit)=>html`
          <section>
            <h3>${suit}</h3>
            <div class="button-row" style="--nala-playing-card-width: 6rem">
                        ${repeat(nalaPlayingCardRanks, (rank)=>rank, (rank)=>html`<nala-playing-card rank=${rank} suit=${suit}></nala-playing-card>`)}
                      </div>
          </section>
        `)}
        <section>
          <h3>Optional jokers and the shared back</h3>
          <div class="button-row" style="--nala-playing-card-width: 6rem">
            <nala-playing-card rank="joker" suit="hearts"></nala-playing-card>
            <nala-playing-card rank="joker" suit="spades"></nala-playing-card>
            <nala-playing-card face-down></nala-playing-card>
          </div>
        </section>
      </div>`,
  api: [
    {
      name: "rank",
      type: 'NalaPlayingCardRank: "A" | "2"-"10" | "J" | "Q" | "K" | "joker"',
      defaultValue: '"A"',
      description: "String property / attribute. Case-sensitive; invalid values throw. Removing the attribute restores Ace."
    },
    {
      name: "suit",
      type: 'NalaPlayingCardSuit: "spades" | "hearts" | "diamonds" | "clubs"',
      defaultValue: '"spades"',
      description: "String property / attribute. Hearts and diamonds are red; others black. For jokers, determines color only. Invalid values throw."
    },
    {
      name: "faceDown / face-down",
      type: "boolean property / presence-based attribute",
      defaultValue: "false",
      description: 'Shows a shared back and a generic accessible name. Even face-down="false" is true; remove the attribute to show the face.'
    },
    {
      name: "decorative",
      type: "boolean property / presence-based attribute",
      defaultValue: "false",
      description: "Hides the SVG from assistive technology instead of naming it. Useful inside an already-labelled native button."
    },
    {
      name: "nalaPlayingCardRanks / nalaPlayingCardSuits",
      type: "readonly exported arrays",
      defaultValue: "13 standard ranks / 4 suits",
      description: "Frozen lists for composing a 52-face gallery; joker is a valid rank but not included. Types and NalaPlayingCardElement are exported too."
    },
    {
      name: "CSS custom properties",
      type: "--nala-playing-card-width / paper / border / red / black / back / gold",
      defaultValue: "7.5rem / #fff / #cbcfc8 / #b42332 / #18201d / theme accent / #b88624",
      description: "Replace the final name after --nala-playing-card-. Explicit host width also works; SVG preserves its 5:7 aspect ratio."
    }
  ],
  slots: [],
  events: [],
  parts: [
    "card",
    "face",
    "back",
    "corner",
    "pip",
    "portrait"
  ]
};
export const lessons = [
  {
    title: "A small symbol and a complete card solve different problems",
    explanation: "A suit icon is a compact hint. A playing card is a rectangular face: its two corners show the rank and suit, number cards arrange the correct count of pips, and original mirrored court portraits distinguish Jack, Queen, and King. All drawings are local SVG, so increasing the size does not blur them. In Game Shelf, a game-detail page can preview a card-game genre; in your own small browser game, the same component can be a hand or board piece. It renders a picture, not a button, and has no dealing or scoring logic.",
    code: `<nala-playing-card rank="A" suit="spades"></nala-playing-card>
<nala-playing-card rank="10" suit="hearts"></nala-playing-card>
<nala-playing-card rank="K" suit="clubs"></nala-playing-card>`,
    preview: ()=>html`
        <div class="button-row">
          <nala-playing-card rank="A" suit="spades"></nala-playing-card>
          <nala-playing-card rank="10" suit="hearts"></nala-playing-card>
          <nala-playing-card rank="K" suit="clubs"></nala-playing-card>
        </div>
      `
  },
  {
    title: "Compose all 52 faces without a deck engine",
    explanation: "The package exports frozen rank and suit lists. Ranks are the strings A, 2 through 10, J, Q, and K; suits are spades, hearts, diamonds, and clubs. Combining them makes 52 distinct faces. The live gallery does exactly this with repeat and stable keys. No shuffled deck, ownership, or game state is created by the component. Supply those values from your application store when you build a game.",
    code: `import { html, repeat } from "../../vendor/components/dist/index.js";
import {
  nalaPlayingCardRanks,
  nalaPlayingCardSuits,
} from "../../vendor/ui-components/dist/index.js";

const deck = nalaPlayingCardSuits.flatMap(suit =>
  nalaPlayingCardRanks.map(rank => ({ id: \`\${rank}-\${suit}\`, rank, suit }))
);
const view = html\`<div class="hand">
  \${repeat(deck, card => card.id, card => html\`
    <nala-playing-card rank=\${card.rank} suit=\${card.suit}></nala-playing-card>
  \`)}
</div>\`;`
  },
  {
    title: "Turn a card over explicitly",
    explanation: "face-down is a presence-based boolean attribute, reflected through the faceDown property. Set faceDown to true or add the attribute to show the same symmetric back for every face. The accessible name becomes Face-down playing card, and the SVG removes the rank, suit, and portrait nodes from the face. Setting rank or suit while hidden does not reveal them. This is visual concealment, not a security boundary: host attributes and app state still contain the card. The preview button owns the flip; the card itself has no custom events.",
    code: `import type { NalaPlayingCardElement } from "../../vendor/ui-components/dist/index.js";
// HTML: <nala-playing-card id="preview" rank="Q" suit="hearts"></nala-playing-card>
const card = document.querySelector<NalaPlayingCardElement>("#preview")!;
card.faceDown = true;  // Same as adding face-down.
card.faceDown = false; // Same as removing face-down.
card.rank = "A";
card.suit = "diamonds";
// rank or suit removal restores A or spades; invalid values throw.`,
    preview: ()=>html`<docs-playing-card-example></docs-playing-card-example>`
  },
  {
    title: "Add jokers and size a card without distorting it",
    explanation: "rank joker selects an original jester rather than a normal rank. Hearts or diamonds make a red joker; spades or clubs make a black joker. Jokers are intentionally absent from the 13-rank list, so add them only when your game's rules need them. A card defaults to 7.5rem wide with a 5:7 aspect ratio and shrinks to its container. Change width on the host or the card-width custom property. Paper, black, red, back, border, and gold are independently configurable; keeping the paper and ink contrasting is your responsibility.",
    code: `<nala-playing-card rank="joker" suit="hearts"></nala-playing-card>
<nala-playing-card rank="joker" suit="spades"></nala-playing-card>
<nala-playing-card rank="Q" suit="diamonds"
  style="width: 10rem; --nala-playing-card-red: #9d174d"></nala-playing-card>`,
    preview: ()=>html`
        <div class="button-row">
          <nala-playing-card rank="joker" suit="hearts"></nala-playing-card>
          <nala-playing-card rank="joker" suit="spades"></nala-playing-card>
          <nala-playing-card rank="Q" suit="diamonds"
            style="width: 10rem; --nala-playing-card-red: #9d174d"></nala-playing-card>
        </div>
      `
  },
  {
    title: "Keep interaction on a native control",
    explanation: "The SVG is an image with an automatic name, such as Ten of hearts. It cannot receive keyboard focus. For a selectable card, put it inside a native button, give that button a name, and mark the card decorative so the face is not announced twice. decorative hides the SVG from assistive technology; it does not hide the visual face. App-owned selection can use aria-pressed on the button, and normal click events can dispatch the game's action.",
    code: `<button type="button" aria-label="Play Ace of spades">
  <nala-playing-card rank="A" suit="spades" decorative></nala-playing-card>
</button>`,
    preview: ()=>html`
        <button type="button" aria-label="Play Ace of spades">
          <nala-playing-card rank="A" suit="spades" decorative></nala-playing-card>
        </button>
      `
  }
];
