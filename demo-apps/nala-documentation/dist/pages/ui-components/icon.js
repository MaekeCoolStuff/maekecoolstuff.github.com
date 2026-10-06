import { html, repeat } from "../../../../../vendor/components/dist/index.js";
import { nalaIconGroups, nalaIconNames } from "../../../../../vendor/ui-components/dist/index.js";
export const doc = {
  slug: "icon",
  title: "Icon",
  tag: "<nala-icon>",
  summary: "Add locally bundled SVG hints to Game Shelf actions and statuses.",
  description: "Select an original SVG by name, including outline and filled hearts and stars, without icon fonts or network requests. Icons inherit text color and size, stay decorative by default, and can describe a meaningful standalone image with a label.",
  usage: `<nala-icon name="search"></nala-icon>
<nala-icon name="heart" label="On your wishlist"></nala-icon>`,
  preview: ()=>html`<div>
        ${repeat(nalaIconGroups, (group)=>group.label, (group)=>html`
          <section>
            <h3>${group.label}</h3>
            <div class="docs-grid">
                        ${repeat(group.names, (name)=>name, (name)=>html`
                            <div class="button-row">
                              <nala-icon name=${name} style="font-size: 1.5rem"></nala-icon>
                              <code>${name}</code>
                            </div>
                          `)}
                      </div>
          </section>
        `)}
      </div>`,
  api: [
    {
      name: "name",
      type: "NalaIconName | null property / attribute",
      defaultValue: "null",
      description: `Selects one of the ${nalaIconNames.length} names in the grouped gallery above. nalaIconNames exposes the full list; nalaIconGroups exposes categories. Null clears the graphic; unknown or empty names throw a RangeError.`
    },
    {
      name: "label",
      type: "string | null property / attribute",
      defaultValue: "null",
      description: "Nonblank labels set role img and aria-label on the SVG. Otherwise it is aria-hidden and decorative."
    }
  ],
  slots: [],
  events: [],
  parts: [
    "icon"
  ]
};
export const lessons = [
  {
    title: "Prototype small games with six dedicated categories",
    explanation: "RPG, TCG, Card Deck, Dice, Chess, and Strategy each add 25 base drawings and six filled counterparts. Use rpg- names for inventory and quests, tcg- for trading-card mechanics, cards- for standard suits and ranks, dice- for faces and die types, chess- for pieces and board actions, and strategy- for units, buildings, and resources. These are original generic symbols, not artwork from an existing game. The catalog now has 531 names in 30 categories. Game Shelf can use them as genre hints; a small game can use them as tokens, but your app still owns rules and state.",
    code: `<nala-icon name="rpg-potion-filled" label="Healing potion"></nala-icon>
<nala-icon name="tcg-mana-filled" label="Mana"></nala-icon>
<nala-icon name="cards-spade-filled" label="Spades"></nala-icon>
<nala-icon name="strategy-resource-wood-filled" label="Wood"></nala-icon>`,
    preview: ()=>html`
        <div class="button-row" style="font-size: 2rem">
          <nala-icon name="rpg-potion-filled" label="Healing potion"></nala-icon>
          <nala-icon name="tcg-mana-filled" label="Mana"></nala-icon>
          <nala-icon name="cards-spade-filled" label="Spades"></nala-icon>
          <nala-icon name="strategy-resource-wood-filled" label="Wood"></nala-icon>
        </div>
      `
  },
  {
    title: "Read dice faces and compose pieces without hidden game logic",
    explanation: "dice-one through dice-six show actual pip counts, with filled versions that leave the pips as cutouts. dice-d4, dice-d6, dice-d8, dice-d10, dice-d12, and dice-d20 indicate die types, not roll results. The preview shows fixed values; icons never generate randomness. All six chess pieces have filled counterparts: set their color and font-size using normal CSS. Card ranks and suits are separate symbols rather than 52 complete playing cards; compose them with HTML and safe text. Use a labelled native button around any interactive token, because an icon is not a keyboard-focusable control.",
    code: `<nala-icon name="dice-three-filled" label="Rolled three"></nala-icon>
<nala-icon name="dice-d20" label="Twenty-sided die"></nala-icon>
<button type="button" aria-label="Select knight">
  <nala-icon name="chess-knight-filled"
    style="font-size: 3rem; color: #18201d"></nala-icon>
</button>`,
    preview: ()=>html`
        <div class="button-row" style="font-size: 2rem">
          <nala-icon name="dice-one-filled" label="One"></nala-icon>
          <nala-icon name="dice-two-filled" label="Two"></nala-icon>
          <nala-icon name="dice-three-filled" label="Three"></nala-icon>
          <nala-icon name="dice-four-filled" label="Four"></nala-icon>
          <nala-icon name="dice-five-filled" label="Five"></nala-icon>
          <nala-icon name="dice-six-filled" label="Six"></nala-icon>
          <button type="button" aria-label="Select knight">
            <nala-icon name="chess-knight-filled"
              style="font-size: 3rem; color: #18201d"></nala-icon>
          </button>
        </div>
      `
  },
  {
    title: "Browse by the job your app needs to do",
    explanation: "The catalog covers website and game scenarios in 30 semantic categories. Original drawings join related web-app icons, with dedicated groups for gaming hardware, achievements, adventures, favourites, and six small-game themes. For example, home joins sidebar under navigation, and play joins camera under media. The grouped gallery includes all 531 names, keeps filled counterparts with their outlines, and uses no remote assets or social-media logos. Game Shelf can use chart-bar for collection statistics, chat for player notes, cloud-upload for backups, and map-pin for local game events. These drawings are hints, not built-in features.",
    code: `<nala-button variant="secondary">
  <nala-icon name="chart-bar"></nala-icon> Collection statistics
</nala-button>
<nala-icon name="map-pin-filled" label="Local game event"></nala-icon>

// After importing the UI package, build your own grouped picker:
// import { nalaIconGroups } from "../../vendor/ui-components/dist/index.js";
// Each group has a label and a readonly names array.
// All drawings and categories live in one private data module;
// applications only import this public entrypoint.`,
    preview: ()=>html`
        <div class="button-row">
          <nala-button
            variant="secondary"><nala-icon name="chart-bar"></nala-icon> Collection statistics</nala-button>
          <nala-icon name="map-pin-filled" label="Local game event"
            style="font-size: 2rem"></nala-icon>
        </div>
      `
  },
  {
    title: "Give the game tracker a visual vocabulary",
    explanation: "Thirty game-related drawings extend the collection tools. Gamepad, joystick, headphones, monitor, and smartphone describe hardware; play and pause suggest session actions. Trophy, medal, crown, flag, and target hint at achievements and goals. Dice, puzzle, sword, shield, gem, key, map, compass, rocket, ghost, skull, flame, and lightning suit genres and adventures. Book, bookmark, tag, gift, and ticket cover guides, saved games, categories, gifts, and event access. These are original generic symbols, not platform or game logos. Keep visible words beside ambiguous symbols so players do not have to guess their meaning.",
    code: `<nala-badge><nala-icon name="gamepad"></nala-icon> Controller supported</nala-badge>
<nala-badge tone="success"><nala-icon name="trophy-filled"></nala-icon> All achievements</nala-badge>
<nala-button><nala-icon name="play-filled"></nala-icon> Start session</nala-button>`,
    preview: ()=>html`
        <div class="button-row">
          <nala-badge><nala-icon name="gamepad"></nala-icon> Controller supported</nala-badge>
          <nala-badge
            tone="success"><nala-icon name="trophy-filled"></nala-icon> All achievements</nala-badge>
          <nala-button><nala-icon name="play-filled"></nala-icon> Start session</nala-button>
        </div>
      `
  },
  {
    title: "Choose outline or solid game symbols",
    explanation: "Twenty of the game-related names also have -filled counterparts: gamepad, dice, puzzle, trophy, medal, crown, flag, sword, shield, gem, rocket, ghost, skull, flame, lightning, bookmark, tag, ticket, play, and pause. Solid shapes retain recognizable details through cutouts, such as dice pips, controller buttons, and a rocket window. Names such as map, target, and headphones stay outlines where internal lines are clearer than a solid silhouette. The choice is visual only: a trophy icon does not compute achievements and a play icon does not start a session; the surrounding component and application actions own that behavior.",
    code: `<nala-icon name="dice" label="Dice-based game"></nala-icon>
<nala-icon name="dice-filled" label="Dice-based game"></nala-icon>
<nala-icon name="rocket-filled" label="Space adventure"></nala-icon>`,
    preview: ()=>html`
        <div class="button-row" style="font-size: 2rem">
          <nala-icon name="gamepad" label="Controller outline"></nala-icon>
          <nala-icon name="gamepad-filled" label="Controller solid"></nala-icon>
          <nala-icon name="dice" label="Dice outline"></nala-icon>
          <nala-icon name="dice-filled" label="Dice solid"></nala-icon>
          <nala-icon name="rocket-filled" label="Space adventure"></nala-icon>
        </div>
      `
  },
  {
    title: "Use solid silhouettes where they help",
    explanation: "Add -filled to home, user, users, settings, lock, unlock, eye, eye-off, mail, bell, calendar, clock, file, folder, copy, filter, grid, cart, info, or warning for a solid counterpart. Heart and star also keep their filled variants. Solid drawings use currentColor without an outline stroke, with even-odd cutouts that leave details such as clock hands and warning marks visible. The existing filled heart and star retain their stroke. Arrows, chevrons, and other line-based controls remain outlines rather than acquiring an artificial filled version. The suffix changes appearance, not behavior or accessibility; the app owns any selected state.",
    code: `<nala-icon name="bell-filled" label="Play reminders enabled"></nala-icon>
<nala-icon name="folder-filled" label="Game collection"></nala-icon>
<nala-icon name="warning-filled" label="Export needs attention"></nala-icon>`,
    preview: ()=>html`
        <div class="button-row" style="font-size: 2rem">
          <nala-icon name="bell" label="Reminders outline"></nala-icon>
          <nala-icon name="bell-filled" label="Play reminders enabled"></nala-icon>
          <nala-icon name="folder" label="Collection outline"></nala-icon>
          <nala-icon name="folder-filled" label="Game collection"></nala-icon>
          <nala-icon name="warning-filled" label="Export needs attention"></nala-icon>
        </div>
      `
  },
  {
    title: "Choose familiar hints for common website workflows",
    explanation: "The local set contains 531 icons without social-media or brand logos. Arrows, chevrons, home, menu, and external-link guide navigation. User, users, settings, lock, unlock, eye, and eye-off describe accounts and privacy. Mail, bell, calendar, and clock cover messages and timing; download, upload, file, folder, and copy cover documents. Refresh, filter, grid, and list suit Game Shelf collection tools, while cart, info, and warning communicate shopping and feedback. Use visible words where the meaning might be ambiguous: a familiar picture still needs context.",
    code: `<nala-button variant="secondary">
  <nala-icon name="filter"></nala-icon> Filter collection
</nala-button>
<nala-button variant="secondary">
  <nala-icon name="download"></nala-icon> Export games
</nala-button>
<nala-button variant="secondary">
  <nala-icon name="settings"></nala-icon> Shelf settings
</nala-button>`,
    preview: ()=>html`
        <div class="button-row">
          <nala-button variant="secondary">
                    <nala-icon name="filter"></nala-icon> Filter collection
                  </nala-button>
          <nala-button variant="secondary">
                    <nala-icon name="download"></nala-icon> Export games
                  </nala-button>
          <nala-button variant="secondary">
                    <nala-icon name="settings"></nala-icon> Shelf settings
                  </nala-button>
        </div>
      `
  },
  {
    title: "Show selected favourites with filled icons",
    explanation: "Use heart-filled for wishlist membership and star-filled for a favourite game. These reuse the heart and star shapes with a currentColor fill, so they inherit the same color and size. The existing heart and star names remain outlines. Choosing a filled name changes only the drawing, not its accessibility behavior.",
    code: `<nala-icon name="heart-filled" label="On your wishlist"></nala-icon>
<nala-icon name="star-filled" label="Favourite game"></nala-icon>`,
    preview: ()=>html`
        <div class="button-row" style="font-size: 2rem">
          <nala-icon name="heart" label="Wishlist outline"></nala-icon>
          <nala-icon name="heart-filled" label="On your wishlist"></nala-icon>
          <nala-icon name="star" label="Favourite outline"></nala-icon>
          <nala-icon name="star-filled" label="Favourite game"></nala-icon>
        </div>
      `
  },
  {
    title: "Add a visual hint without repeating the button name",
    explanation: "An icon is a small picture, not an interactive control. Game Shelf's Add game button already has readable text, so its plus icon stays decorative. With no label, the SVG is hidden from assistive technology and does not receive keyboard focus. For an icon-only action, use a native button with aria-label on the button itself.",
    code: `<nala-button><nala-icon name="plus"></nala-icon> Add game</nala-button>
<button type="button" aria-label="Search games">
  <nala-icon name="search"></nala-icon>
</button>`,
    preview: ()=>html`
        <div class="button-row">
          <nala-button><nala-icon name="plus"></nala-icon> Add game</nala-button>
          <button type="button" aria-label="Search games">
            <nala-icon name="search"></nala-icon>
          </button>
        </div>
      `
  },
  {
    title: "Give a standalone picture meaning and inherit its styling",
    explanation: "A heart shown without nearby text can communicate wishlist membership. A nonblank label gives its SVG role img and an accessible name. Blank or whitespace-only labels keep it decorative. The original, locally bundled outline drawings use a 24 by 24 viewBox, a currentColor stroke, and a 1em square host: font-size controls size, and color comes from surrounding text. Explicit width and height or the icon Shadow Part can override those defaults.",
    code: `<nala-icon name="heart" label="On your wishlist"
  style="font-size: 2rem; color: #a43f35"></nala-icon>`,
    preview: ()=>html`
        <nala-icon name="heart" label="On your wishlist"
          style="font-size: 2rem; color: #a43f35"></nala-icon>
      `
  },
  {
    title: "Change the chosen graphic explicitly",
    explanation: "After importing the UI entrypoint, use attributes or typed properties to change the icon. Updates reuse the SVG and path instead of rebuilding them. Removing name clears the picture. Unknown names, including an empty string, report a RangeError rather than choosing a fallback. Names are case-sensitive; no remote URLs or arbitrary SVG markup are accepted. The frozen nalaIconNames list contains all supported names and is useful for an icon picker.",
    code: `import type { NalaIconElement } from "../../vendor/ui-components/dist/index.js";
import { nalaIconNames } from "../../vendor/ui-components/dist/index.js";

const status = document.querySelector<NalaIconElement>("#game-status")!;
status.name = "check";
status.label = "Game completed";
// status.name = null clears the picture.
console.log("Available icons:", nalaIconNames);

// The surrounding HTML:
// <nala-icon id="game-status" name="star" label="Favourite game"></nala-icon>`
  }
];
