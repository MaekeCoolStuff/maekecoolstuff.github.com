import { html } from "../../../../../vendor/components/dist/index.js";
const files = [
  {
    name: "index.html",
    language: "html",
    code: '<main id="shelf"></main>\n<script type="module" src="/app/dist/main.js"></script>'
  },
  {
    name: "src/main.ts",
    language: "typescript",
    code: 'const shelf = document.querySelector("#shelf");\nif (!shelf) throw new Error("Game Shelf root is missing.");\nshelf.textContent = "Games I want to play";'
  },
  {
    name: "styles.css",
    language: "css",
    code: "#shelf {\n  max-width: 60rem;\n  margin: 2rem auto;\n}"
  }
];
export const doc = {
  slug: "code-workspace",
  title: "Code workspace",
  tag: "<nala-code-workspace>",
  summary: "Present a read-only set of titled code files in an IDE-style tabbed workspace.",
  description: "A documentation viewer, not an editor, execution environment or diff tool. It composes nala-tabs and nala-code-block: filename tabs have native tab keyboard behavior, while each file retains its own highlighted code panel and scroll position. Pass data explicitly through files; the component never fetches paths or runs code.",
  usage: `import type { NalaCodeWorkspaceElement } from "./vendor/ui-components/dist/index.js";

const workspace = document.querySelector<NalaCodeWorkspaceElement>("nala-code-workspace");
if (!workspace) throw new Error("Code workspace is missing.");
workspace.files = [
  { name: "index.html", language: "html", code: '<main id="shelf"></main>' },
  { name: "src/main.ts", language: "typescript", code: 'console.log("Game Shelf");' },
];
workspace.selected = "src/main.ts";

// HTML: <nala-code-workspace label="Game Shelf · finished files"></nala-code-workspace>`,
  preview: ()=>html`
      <nala-code-workspace label="Game Shelf · finished files"
        .files=${files}></nala-code-workspace>
    `,
  api: [
    {
      name: "files",
      type: "readonly NalaCodeFile[] property",
      defaultValue: "[]",
      description: "Each file has a unique nonblank name, string code and optional language (typescript, html, css or text; default typescript). Empty code is valid. Assign a new array to update; do not mutate it in place. Invalid assignments throw before replacing valid state."
    },
    {
      name: "label",
      type: "string property / attribute",
      defaultValue: '"Code files"',
      description: "Visible workspace title and accessible group/tablist label."
    },
    {
      name: "selected",
      type: "string property / attribute",
      defaultValue: '""',
      description: "Requested filename. Empty or missing names display the first file. The requested name remains stored, so reintroducing it selects it again; matching names survive array reorder. Programmatic changes emit no event."
    }
  ],
  slots: [],
  events: [
    {
      name: "change",
      type: "CustomEvent<NalaCodeWorkspaceChange>",
      description: "Bubbles and is composed once per user tab selection; detail.value is the filename. A click on the current tab emits nothing."
    }
  ],
  parts: [
    "workspace",
    "heading",
    "file-tab",
    "file-panel",
    "tablist",
    "code-block",
    "status",
    "empty"
  ]
};
export const lessons = [];
