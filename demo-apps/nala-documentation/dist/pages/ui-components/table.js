import { html } from "../../../../../vendor/components/dist/index.js";
import { tableColumns, tableGames } from "../ui-component-shared.js";
export const doc = {
  slug: "table",
  title: "Table",
  tag: "<nala-table>",
  summary: "Compare Game Shelf records in columns and browse them a page at a time.",
  description: "A read-only native table with a labelled header row and reusable Previous/Next pagination. Client mode slices a complete collection; server mode displays one app-supplied page. No sorting, selection, cell templates, or fetching is built in.",
  usage: `<nala-table id="shelf" label="Game Shelf" page-size="2"></nala-table>

// After importing the UI package, assign columns and rows as shown below.`,
  preview: ()=>html`
      <nala-table label="Game Shelf" page-size="2"
        .columns=${tableColumns} .rows=${tableGames}></nala-table>
    `,
  api: [
    {
      name: "columns",
      type: "readonly NalaTableColumn<Row>[] property",
      defaultValue: "[]",
      description: "Unique field keys and header labels: { key, label }."
    },
    {
      name: "rows",
      type: "readonly Row[] property",
      defaultValue: "[]",
      description: "Complete client collection or one server page. Use distinct record objects; identity keys preserve DOM rows. Reassign to update."
    },
    {
      name: "label",
      type: "string property / attribute",
      defaultValue: '"Data"',
      description: "Visible native caption, scroll-region label, and pager label."
    },
    {
      name: "paging",
      type: '"client" | "server" property / attribute',
      defaultValue: '"client"',
      description: "Selects who owns slicing. Invalid modes throw."
    },
    {
      name: "page",
      type: "number property / attribute",
      defaultValue: "1",
      description: "One-based positive safe integer; clamps to the available range."
    },
    {
      name: "pageSize / page-size",
      type: "number property / attribute",
      defaultValue: "10",
      description: "Positive safe integer. In server mode, the app must request this size."
    },
    {
      name: "total",
      type: "number property / attribute",
      defaultValue: "0",
      description: "Non-negative safe integer; server's full count. Client mode uses rows.length instead."
    },
    {
      name: "loading",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Disables paging, sets aria-busy, and announces loading. Does not fetch or clear rows."
    }
  ],
  slots: [],
  events: [
    {
      name: "page-change",
      type: "CustomEvent<NalaTablePageChange>",
      description: "Bubbles and is composed from the nested nala-pagination. Pager clicks report { page, pageSize, offset } after updating page. Programmatic changes are silent."
    }
  ],
  parts: [
    "container",
    "table",
    "caption",
    "header",
    "header-cell",
    "row",
    "cell",
    "empty",
    "pagination",
    "previous",
    "next",
    "status"
  ]
};
export const lessons = [
  {
    title: "Keep the whole collection in the browser",
    explanation: "In client mode, rows is the complete collection. The table computes the total and slices only the selected page. Column keys select record fields; labels become native column headers. Values become safe text, with null and undefined shown as empty cells. Assign a new array reference to rows or columns to update the display; in-place mutation and reassigning the same array do not notify the table.",
    code: `import type {
  NalaTableElement,
} from "../../vendor/ui-components/dist/index.js";

type GameRow = { title: string; platform: string };
const shelf = document.querySelector<NalaTableElement<GameRow>>("#shelf")!;
shelf.columns = [
  { key: "title", label: "Game" },
  { key: "platform", label: "Platform" },
];
shelf.rows = [
  { title: "Hollow Knight", platform: "PC" },
  { title: "Sea of Stars", platform: "Switch" },
  { title: "Celeste", platform: "PC" },
];
shelf.pageSize = 2;`
  },
  {
    title: "Ask the application for one server page",
    explanation: "In server mode, rows contains only the current response and is never sliced again. Set total to the server's full matching count, not the response length. Clicking Previous or Next updates page and emits page-change with a one-based page and zero-based offset. The table never fetches. This offline preview acts as a tiny server by slicing its sample collection in the event listener; a real app performs that work through its HTTP client.",
    code: `// The existing shelf is now server-paged.
shelf.paging = "server";
shelf.total = 3;
shelf.rows = [
  { title: "Hollow Knight", platform: "PC" },
  { title: "Sea of Stars", platform: "Switch" },
];
shelf.addEventListener("page-change", (event) => {
  const { offset, pageSize } = (event as CustomEvent<{
    page: number; pageSize: number; offset: number;
  }>).detail;
  console.log("Fetch the next page with", { offset, pageSize });
  // Set shelf.loading = true while fetching.
  // On success: set shelf.total, then shelf.rows to the response.
  // On failure: show an app-owned error and offer retry.
  // Clear shelf.loading in finally. Keep stale responses from winning.
});`,
    preview: ()=>html`<docs-server-table-example></docs-server-table-example>`
  },
  {
    title: "Control navigation without creating fetch loops",
    explanation: "page defaults to 1 and pageSize to 10. Both must be positive safe integers; total must be a non-negative safe integer. Out-of-range pages clamp to the last available page, including page 1 for an empty collection. Only pager clicks emit page-change: assigning properties, changing totals, and automatic clamping are silent. Set rows or total before assigning an initial page. In server mode, the app must also reload when changing page size, filters, or totals; loading disables the pager and announces pending work but retains existing rows.",
    code: `shelf.pageSize = 20;
shelf.page = 1;
// Programmatic changes are silent: load the new server page explicitly.
// For a failed page request, keep the requested page for retry,
// or restore the previous page and its rows together.`
  }
];
