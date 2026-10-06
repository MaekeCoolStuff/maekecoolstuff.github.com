export const chapterOneHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Nala Tasks: startup</title>
  </head>
  <body>
    <main id="app" class="app-shell"></main>
    <!-- Load generated JavaScript, not the TypeScript source. -->
    <script type="module" src="/app/dist/main.js"></script>
  </body>
</html>`;
export const chapterOneMain = `const candidate = document.querySelector("#app");
// A missing root is a broken HTML contract, not an empty application.
if (!(candidate instanceof HTMLElement)) {
  throw new Error("Application root is missing.");
}
const root = candidate;
const heading = document.createElement("h1");
heading.textContent = "Nala Tasks: startup";
const report = document.createElement("p");
report.textContent =
  \`Loaded native JavaScript module: \${import.meta.url}. Edit the TypeScript source, then run its build steps again.\`;
root.append(heading, report);`;
export const chapterOneCommands = `deno check app/src/main.ts
deno transpile app/src/main.ts --output app/dist/main.js`;
/** Returns lines `first` through `last` (1-based, inclusive) of `source`. */ export function sourceLines(source, first, last) {
  const lines = source.split("\n");
  if (first < 1 || last < first || last > lines.length) {
    throw new RangeError(`Lines ${first}-${last} are outside the source.`);
  }
  return lines.slice(first - 1, last).join("\n");
}
// In reading order; together they reproduce each complete file exactly.
export const chapterOneHtmlExcerpts = {
  document: sourceLines(chapterOneHtml, 1, 2),
  head: sourceLines(chapterOneHtml, 3, 8),
  root: sourceLines(chapterOneHtml, 9, 9),
  script: sourceLines(chapterOneHtml, 10, 11),
  close: sourceLines(chapterOneHtml, 12, 13)
};
export const chapterOneMainExcerpts = {
  find: sourceLines(chapterOneMain, 1, 1),
  guard: sourceLines(chapterOneMain, 2, 5),
  create: sourceLines(chapterOneMain, 6, 9),
  report: sourceLines(chapterOneMain, 10, 11),
  mount: sourceLines(chapterOneMain, 12, 12)
};
export const chapterOneTransfer = `const message = document.createElement("p");
message.textContent = "My app starts here.";
root.append(message);`;
// Catalog metadata only; this chapter's prose and layout belong to its custom page.
export const chapterOne = {
  number: 1,
  title: "From TypeScript source to the browser",
  lead: "Make this project yours. Start with a fresh download, write two small files in your own app folder, and watch the browser load the JavaScript you created. No checkpoint copying, no hidden startup magic.",
  preview: true,
  sections: [],
  trace: [
    "You write app/index.html and app/src/main.ts, starting with no finished application.",
    "Deno checks the source and emits app/dist/main.js without running it.",
    "The local server returns your HTML; its module script requests generated JavaScript.",
    "The browser guards #app, appends native nodes and reports the executing module URL."
  ],
  checks: [
    "Confirm deno --version and deno transpile --help, then check and compile your own file.",
    "Open /app/ on the printed server origin; verify a heading and /app/dist/main.js report.",
    "Inspect a 200 JavaScript response and a clean Console; do not confuse fallback HTML with a module.",
    "Change, check, compile and reload the heading; restore it, then test and restore the missing-root guard."
  ],
  trouble: [
    "If deno is not found, reopen the terminal and check PATH before editing source.",
    "If files are not found, confirm the working directory directly contains deno.json and app.",
    "build:nala does not compile app; run the explicit check/transpile commands.",
    "Use the documented OS-specific PORT syntax or an existing server."
  ],
  exercise: "Without opening the checkpoint files, explain the three jobs of check, transpile and serve. Which file changes the heading? Why does the runtime guard remain in generated JavaScript?"
};
