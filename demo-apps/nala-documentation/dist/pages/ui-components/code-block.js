import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "code-block",
  title: "Code block",
  tag: "<nala-code-block>",
  summary: "Show TypeScript, HTML, and CSS examples with syntax highlighting.",
  description: "Use for code samples in documentation or developer tools. The element reads source text from its children or code property and renders safe, themed syntax spans in Shadow DOM. TypeScript highlighting recognizes regular-expression literals, including escaped characters and character classes.",
  usage: `<nala-code-block language="typescript">
const gameTitle = "Sea of Stars";
collection.actions.addGame(gameTitle);
</nala-code-block>

const example = document.querySelector("nala-code-block");
if (example) example.code = 'const platform = "PC";';`,
  preview: ()=>html`
      <nala-code-block language="typescript">${`const gameTitle = "Sea of Stars";
collection.actions.addGame(gameTitle);`}</nala-code-block>
      <nala-code-block language="typescript">${String.raw`const attributePattern = /([.?@]?[A-Za-z_:][^\s"'<>\/=]*)\s*=\s*(["']?)$/;`}</nala-code-block>
      <nala-code-block language="html">${`<article class="game-card">
  <h2>Sea of Stars</h2>
</article>`}</nala-code-block>
    `,
  api: [
    {
      name: "language",
      type: '"typescript" | "html" | "css" | "text" attribute',
      defaultValue: '"typescript"',
      description: "Selects TypeScript, HTML, or CSS highlighting; text displays without highlighting."
    },
    {
      name: "code",
      type: "string property",
      defaultValue: "element child text",
      description: "Reads or replaces the source shown by the component."
    }
  ],
  slots: [],
  events: [],
  parts: [
    "code-block"
  ]
};
export const lessons = [];
