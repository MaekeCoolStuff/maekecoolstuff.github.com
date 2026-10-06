import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "side-bar",
  title: "Side bar",
  tag: "<nala-side-bar>",
  summary: "Let players browse collection filters such as Playing, Backlog, and Completed.",
  description: "Use for collection filters such as Backlog and Completed. It lays out native navigation but does not filter games itself; below 52rem it becomes full-width and sticky positioning is disabled.",
  usage: `<nala-side-bar sticky label="Collection filters">
  <nav>
    <a href="/collection">All games</a>
    <a href="/collection/playing">Currently playing</a>
    <a href="/collection/backlog">Backlog</a>
    <a href="/collection/completed">Completed</a>
  </nav>
</nala-side-bar>`,
  preview: ()=>html`
      <nala-side-bar label="Collection filters">
        <nav><a href="#collection">All games</a><a href="#playing">Currently playing</a><a href="#backlog">Backlog</a><a href="#completed">Completed</a></nav>
      </nala-side-bar>
    `,
  api: [
    {
      name: "label",
      type: "string attribute",
      defaultValue: '"Secondary navigation"',
      description: "Accessible name applied to the internal aside."
    },
    {
      name: "sticky",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Sticks below the top bar; disabled on narrow screens."
    }
  ],
  slots: [
    {
      name: "default",
      description: "Usually a native <nav> with links."
    }
  ],
  events: [],
  parts: [
    "sidebar"
  ]
};
export const lessons = [
  {
    title: "Use native links for collection filters",
    explanation: "The sidebar provides spacing and responsive layout. The application or router still decides what each link does.",
    code: `<nala-side-bar sticky label="Collection filters">
  <nav>
    <a href="/collection">All games</a>
    <a href="/collection/playing">Currently playing</a>
    <a href="/collection/backlog">Backlog</a>
    <a href="/collection/completed">Completed</a>
  </nav>
</nala-side-bar>`
  },
  {
    title: "Give the navigation an accessible name",
    explanation: "The label becomes the accessible name of the internal aside. Choose a name that distinguishes this navigation from the page's main navigation.",
    code: `<nala-side-bar label="Browse your game collection">
  <nav aria-label="Game status">...</nav>
</nala-side-bar>`
  }
];
