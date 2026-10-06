import { html } from "../../../../../vendor/components/dist/index.js";
const entries = [
  {
    id: "shelf",
    name: "game-shelf",
    kind: "folder",
    children: [
      {
        id: "html",
        name: "index.html",
        kind: "file",
        note: "Browser entrypoint"
      },
      {
        id: "src",
        name: "src",
        kind: "folder",
        children: [
          {
            id: "main",
            name: "main.ts",
            kind: "file",
            note: "You write this"
          },
          {
            id: "css",
            name: "styles.css",
            kind: "file"
          }
        ]
      },
      {
        id: "dist",
        name: "dist",
        kind: "folder",
        children: [
          {
            id: "output",
            name: "main.js",
            kind: "file",
            note: "Generated output"
          }
        ]
      },
      {
        id: "assets",
        name: "assets",
        kind: "folder",
        children: []
      }
    ]
  }
];
export const doc = {
  slug: "file-tree",
  title: "File tree",
  tag: "<nala-file-tree>",
  summary: "An IDE-style project map with collapsible folders and helpful file notes.",
  description: "Show how a Game Shelf project is organized without turning documentation into a file manager. Nested lists describe the hierarchy; native details and summary elements let readers collapse folders with a click, Enter or Space. File icons and extension badges supplement the names, while optional notes explain ownership. There is no fetching, file selection or editing.",
  usage: `import type { NalaFileTreeElement } from "./vendor/ui-components/dist/index.js";

const tree = document.querySelector<NalaFileTreeElement>("nala-file-tree");
if (!tree) throw new Error("File tree is missing.");
tree.entries = [{
  id: "app", name: "app", kind: "folder", children: [
    { id: "html", name: "index.html", kind: "file", note: "Browser entrypoint" },
    { id: "src", name: "src", kind: "folder", children: [
      { id: "main", name: "main.ts", kind: "file", note: "You write this" },
    ] },
  ],
}];

// HTML: <nala-file-tree label="Game Shelf · project files"></nala-file-tree>`,
  preview: ()=>html`
      <nala-file-tree label="Game Shelf · project files"
        .entries=${entries}></nala-file-tree>
    `,
  api: [
    {
      name: "entries",
      type: "readonly NalaFileTreeEntry[] property",
      defaultValue: "[]",
      description: "Entries have globally unique nonblank id, nonblank name, kind (file or folder) and optional string note. Folders require children, including [] for empty folders; files cannot have children. At most 32 nested levels. Invalid assignments throw before replacing valid state. Assign new arrays rather than mutating stored data."
    },
    {
      name: "label",
      type: "string property / attribute",
      defaultValue: '"Project files"',
      description: "Visible heading and accessible section name."
    }
  ],
  slots: [],
  events: [],
  parts: [
    "explorer",
    "heading",
    "list",
    "row",
    "folder",
    "name",
    "note",
    "empty"
  ]
};
export const lessons = [
  {
    title: "Disclosure state belongs to the browser",
    explanation: "Folders start expanded. Click a folder or focus its summary and press Enter or Space. Stable ids preserve the same folder node and its open state during updates and sibling reordering; removing or moving a folder to another parent creates a new disclosure. Empty folders can still be toggled. These are native disclosures, not an ARIA tree widget: Tab moves between visible folder summaries, not every file. Use text notes as well as color to communicate generated files.",
    code: `// Replace data explicitly; keep ids stable for existing folders.
tree.entries = [{
  id: "assets", name: "assets", kind: "folder", children: [],
}];`
  }
];
