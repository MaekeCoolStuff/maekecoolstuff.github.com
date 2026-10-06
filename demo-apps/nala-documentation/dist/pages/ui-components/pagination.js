import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "pagination",
  title: "Pagination",
  tag: "<nala-pagination>",
  summary: "Navigate a paged collection without coupling navigation to a table.",
  description: "A reusable Previous/Next navigation control that reports page changes while leaving data loading and collection state in the application.",
  usage: `<nala-pagination id="games-pager" label="Game Shelf"
  page-size="10" total="37"></nala-pagination>

// Import the UI package, then listen for page-change to load each page.`,
  preview: ()=>html`
      <nala-pagination label="Game Shelf" page-size="5" total="23"></nala-pagination>
    `,
  api: [
    {
      name: "label",
      type: "string property / attribute",
      defaultValue: '"Pagination"',
      description: "Accessible name of the navigation landmark."
    },
    {
      name: "page",
      type: "number property / attribute",
      defaultValue: "1",
      description: "One-based positive safe integer; clamps to the available page range."
    },
    {
      name: "pageSize / page-size",
      type: "number property / attribute",
      defaultValue: "10",
      description: "Positive safe integer used to calculate page count and offset."
    },
    {
      name: "total",
      type: "number property / attribute",
      defaultValue: "0",
      description: "Non-negative safe integer; zero still displays page 1 of 1."
    },
    {
      name: "loading",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Disables both navigation buttons, sets aria-busy, and announces loading."
    }
  ],
  slots: [],
  events: [
    {
      name: "page-change",
      type: "CustomEvent<NalaPaginationPageChange>",
      description: "Bubbles and is composed. Clicks update page before reporting { page, pageSize, offset }; property changes are silent."
    }
  ],
  parts: [
    "navigation",
    "previous",
    "next",
    "status"
  ]
};
export const lessons = [
  {
    title: "Use a pager without a table",
    explanation: "Pagination receives the current page, page size, and total item count. It calculates the displayed page count and zero-based offset, but it never loads or slices data. The app listens for page-change and uses the reported values to request or select the corresponding records.",
    code: `import type {
  NalaPaginationElement,
  NalaPaginationPageChange,
} from "../../vendor/ui-components/dist/index.js";

const pager = document.querySelector<NalaPaginationElement>("#games-pager")!;
pager.addEventListener("page-change", (event) => {
  const { page, pageSize, offset } =
    (event as CustomEvent<NalaPaginationPageChange>).detail;
  console.log("Load this page of games:", { page, pageSize, offset });
});`
  },
  {
    title: "Keep collection state in the application",
    explanation: "A pager click immediately updates its page property, then emits page-change. Updating total or pageSize clamps an out-of-range page silently. Set loading while a request is pending to disable navigation; update total and pageSize when the collection changes. Empty collections still show page 1 of 1, with both buttons disabled.",
    code: `pager.loading = true;
try {
  // Load using the page-change detail and update the collection.
  pager.total = 37;
} finally {
  pager.loading = false;
}`
  }
];
