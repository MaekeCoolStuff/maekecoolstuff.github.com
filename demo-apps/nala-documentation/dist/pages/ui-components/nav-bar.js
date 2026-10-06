import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "nav-bar",
  title: "Navigation bar",
  tag: "<nala-nav-bar>",
  summary: "Give Game Shelf a top bar for the library, wishlist, and add-game action.",
  description: "Use for Game Shelf's top-level destinations. It arranges your native links but does not own routing; the links slot is hidden below 44rem, so provide another mobile navigation surface if those links are essential.",
  usage: `<nala-nav-bar sticky>
  <a slot="brand" href="/">Game Shelf</a>
  <nav slot="links" aria-label="Main navigation">
    <a href="/collection">Collection</a>
    <a href="/wishlist">Wishlist</a>
  </nav>
  <nala-button slot="actions">Add a game</nala-button>
</nala-nav-bar>`,
  preview: ()=>html`<nala-nav-bar><a slot="brand" href="#collection">Game Shelf</a><nav slot="links" aria-label="Main navigation"><a href="#collection">Collection</a><a href="#wishlist">Wishlist</a></nav><nala-button slot="actions" variant="secondary">Add a game</nala-button></nala-nav-bar>`,
  api: [
    {
      name: "sticky",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Pins the bar to the top of its scrolling container."
    }
  ],
  slots: [
    {
      name: "brand",
      description: "Brand mark or home link."
    },
    {
      name: "links",
      description: "Consumer-owned links; hidden below 44rem."
    },
    {
      name: "actions",
      description: "Optional right-side actions."
    }
  ],
  events: [],
  parts: [
    "bar",
    "brand",
    "links",
    "actions"
  ]
};
export const lessons = [
  {
    title: "Provide the navigation; the element provides the layout",
    explanation: "Brand, links, and actions are native slotted content. The component does not own routes or decide which page is active.",
    code: `<nala-nav-bar sticky>
  <a slot="brand" href="/">Game Shelf</a>
  <nav slot="links" aria-label="Main navigation">
    <a href="/collection">Collection</a>
    <a href="/wishlist">Wishlist</a>
  </nav>
  <nala-button slot="actions">Add a game</nala-button>
</nala-nav-bar>`
  },
  {
    title: "Plan for narrow screens",
    explanation: "The links slot is hidden below 44rem. Put essential destinations in a separate responsive menu if players must reach them at that width.",
    code: `/* Application-owned mobile navigation */
@media (max-width: 44rem) {
  .mobile-game-nav { display: flex; }
}`,
    preview: ()=>html`
        <div class="layout-demo">
          <p
            class="layout-demo-label">Live example · the compact navigation replaces the links at narrow widths</p>
          <div class="responsive-nav-preview">
            <strong>Game Shelf</strong>
            <nav class="desktop-game-nav" aria-label="Desktop game navigation">
              <span>Collection</span>
              <span>Wishlist</span>
            </nav>
            <nav class="mobile-game-nav" aria-label="Compact game navigation">
              <span>Menu · Collection · Wishlist</span>
            </nav>
          </div>
        </div>
      `
  }
];
