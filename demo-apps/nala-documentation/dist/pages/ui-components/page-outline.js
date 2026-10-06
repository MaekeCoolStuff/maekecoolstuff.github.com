import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "page-outline",
  title: "Page outline",
  tag: "<nala-page-outline>",
  summary: "A floating top-right button that opens a panel of in-page anchor links without taking a layout column.",
  description: "The host is position: fixed, so it floats above the page instead of reserving width beside the content. The button is a native button that opens a native popover (popovertarget), which supplies the top layer, light dismiss, Escape handling and focus return. Slotted links stay in your light DOM, so fragment navigation, :target and your hashchange listeners keep native browser behavior. Following a link closes the panel without preventing the navigation. The panel is a nav landmark named by label. Below 40rem the visible text collapses to an icon while label remains the button's accessible name. There is no scroll spy or active-section tracking.",
  usage: `<nala-page-outline label="On this page">
  <ol>
    <li><a href="#wishlist">Wishlist</a></li>
    <li><a href="#backlog">Backlog</a></li>
    <li><a href="#finished">Finished games</a></li>
  </ol>
</nala-page-outline>

/* Keep the button below a sticky header. */
nala-page-outline { --nala-page-outline-top: 5.25rem; }`,
  preview: ()=>html`
      <p>Look at the top-right corner of this page: the floating <strong>On this page</strong> button belongs to this preview. Open it and follow a link to jump to a Game Shelf section below.</p>
      <nala-page-outline label="On this page"
        style="--nala-page-outline-top: 5.25rem">
        <ol>
          <li><a href="#outline-wishlist">Wishlist</a></li>
          <li><a href="#outline-backlog">Backlog</a></li>
          <li><a href="#outline-finished">Finished games</a></li>
        </ol>
      </nala-page-outline>
      <h3 id="outline-wishlist">Wishlist</h3>
      <p>Games you want to buy next, such as Hollow Knight: Silksong.</p>
      <h3 id="outline-backlog">Backlog</h3>
      <p>Owned games you have not started yet.</p>
      <h3 id="outline-finished">Finished games</h3>
      <p>Games you completed, with the platform you played them on.</p>
    `,
  api: [
    {
      name: "label",
      type: "string property / attribute",
      defaultValue: '"On this page"',
      description: "Visible button text, panel heading and accessible name of both the button and the nav landmark."
    },
    {
      name: "--nala-page-outline-top",
      type: "CSS custom property",
      defaultValue: "1rem",
      description: "Distance from the viewport top. Set it below any sticky header; the panel opens 3.5rem lower."
    },
    {
      name: "--nala-page-outline-right",
      type: "CSS custom property",
      defaultValue: "1rem",
      description: "Distance from the viewport's right edge."
    },
    {
      name: "--nala-page-outline-width",
      type: "CSS custom property",
      defaultValue: "18rem",
      description: "Panel width, limited to the viewport width minus 2rem on narrow screens."
    },
    {
      name: "--nala-page-outline-layer",
      type: "CSS custom property",
      defaultValue: "20",
      description: "z-index of the floating button. The open panel is in the browser top layer and needs no z-index."
    }
  ],
  slots: [
    {
      name: "default",
      description: "A list of native in-page links, typically an ol of a[href^='#'] elements. Style the links from your own CSS; the component only resets the slotted list's margin and indentation."
    }
  ],
  events: [],
  parts: [
    "button",
    "panel",
    "heading"
  ]
};
export const lessons = [
  {
    title: "Keep chapter navigation out of the reading column",
    explanation: "A long tutorial benefits from a list of its steps, but a permanent sidebar column steals width from code samples. Put the same native links inside nala-page-outline: readers open it only when they want to jump, and the links still update the URL fragment so the browser's back button returns to the previous step.",
    code: `<nala-page-outline label="On this page">
  <ol>
    <li><a href="#step-1">Add a game</a></li>
    <li><a href="#step-2">Mark it as played</a></li>
  </ol>
</nala-page-outline>`
  }
];
