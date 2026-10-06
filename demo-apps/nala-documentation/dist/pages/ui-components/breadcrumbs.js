import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "breadcrumbs",
  title: "Breadcrumbs",
  tag: "<nala-breadcrumbs>",
  summary: "Show the path from a game shelf to the current game.",
  description: "Use breadcrumbs to show where a player is in a hierarchy and provide links to its parent locations. The component supplies a labeled navigation landmark and responsive layout; native links and the current-page marker stay application-owned.",
  usage: `<nala-breadcrumbs label="Game location">
  <li><a href="/">Game Shelf</a></li>
  <li><a href="/collection">Collection</a></li>
  <li><span aria-current="page">Hades</span></li>
</nala-breadcrumbs>`,
  preview: ()=>html`
      <nala-breadcrumbs label="Game location">
        <li><a href="#game-shelf">Game Shelf</a></li>
        <li><a href="#collection">Collection</a></li>
        <li><span aria-current="page">Hades</span></li>
      </nala-breadcrumbs>
    `,
  api: [
    {
      name: "label",
      type: "string attribute / property",
      defaultValue: '"Breadcrumb"',
      description: "Accessible name for the breadcrumb navigation landmark."
    }
  ],
  slots: [
    {
      name: "default",
      description: "Ordered <li> elements containing native links, with the current page marked by aria-current=\"page\"."
    }
  ],
  events: [],
  parts: [
    "navigation",
    "list"
  ]
};
export const lessons = [
  {
    title: "Keep each destination a native link",
    explanation: "The breadcrumb component does not own routing. Use ordinary anchors for parent pages, so browser navigation, open-in-new-tab, and the documentation router continue to work.",
    code: `<nala-breadcrumbs label="Game location">
  <li><a href="/">Game Shelf</a></li>
  <li><a href="/collection">Collection</a></li>
  <li><span aria-current="page">Hades</span></li>
</nala-breadcrumbs>`
  },
  {
    title: "Mark the current page",
    explanation: "Use aria-current=\"page\" on the current location and do not make it a link to itself. The label distinguishes this navigation landmark from other navigation on the page.",
    code: `<nala-breadcrumbs label="Game location">
  <li><a href="/collection">Collection</a></li>
  <li><span aria-current="page">Hades</span></li>
</nala-breadcrumbs>`
  }
];
