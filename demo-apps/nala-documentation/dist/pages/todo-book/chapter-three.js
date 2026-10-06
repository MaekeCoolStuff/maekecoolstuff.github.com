import { chapterOneHtml, sourceLines } from "./chapter-one.js";
import { chapterTwoMain } from "./chapter-two.js";
export const chapterThreeHtml = chapterOneHtml.replace("</title>", '</title>\n    <link rel="stylesheet" href="/app/styles.css">');
export const chapterThreeStyles = `:root {
  color-scheme: light;
  --task-canvas: #f2f0e8;
  --task-surface: #fffefa;
  --task-ink: #18201d;
  --task-muted: #68716c;
  --task-accent: #184d3b;
  --task-accent-light: #d8e8df;
  --task-border: #cbcfc8;
  --task-sun: #f0b84b;
  font-family: "Avenir Next", "Gill Sans", sans-serif;
  color: var(--task-ink);
  background: var(--task-canvas);
}

* {
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  margin: 0;
  background-image:
    linear-gradient(rgba(24, 77, 59, .045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(24, 77, 59, .045) 1px, transparent 1px);
  background-size: 2rem 2rem;
}

a {
  color: var(--task-accent);
  text-underline-offset: .2em;
}

button,
input,
select {
  font: inherit;
}

button {
  cursor: pointer;
  font-weight: 700;
}

button:disabled {
  cursor: default;
  opacity: .55;
}

button:hover {
  background: #e8efe8;
}

button,
input:not([type="checkbox"]),
select {
  min-width: 0;
  max-width: 100%;
  border: 1px solid var(--task-border);
  border-radius: .4rem;
  padding: .7rem .85rem;
  background: var(--task-surface);
  color: var(--task-ink);
}

:focus-visible {
  outline: 3px solid var(--task-accent);
  outline-offset: 3px;
}

label {
  display: grid;
  gap: .45rem;
  font-size: .9rem;
  font-weight: 600;
}

.checkpoint-banner {
  display: flex;
  min-height: 2.75rem;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: .55rem 1rem;
  background: var(--task-accent);
  color: var(--task-surface);
  font-size: .8rem;
  overflow-wrap: anywhere;
}

.checkpoint-banner a {
  color: var(--task-surface);
  font-weight: 700;
}

.checkpoint-banner strong {
  color: var(--task-accent-light);
  font-weight: 600;
}

.app-shell {
  width: min(54rem, calc(100% - 2rem));
  margin: 0 auto;
  padding: clamp(2rem, 7vh, 5rem) 0 3rem;
}

.app-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1.25rem;
}

.eyebrow {
  margin: 0 0 .3rem;
  color: var(--task-accent);
  font-size: .72rem;
  font-weight: 800;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 0;
  font-family: "Baskerville", "Iowan Old Style", serif;
  font-size: clamp(2.25rem, 8vw, 4.5rem);
  font-weight: 600;
  line-height: .92;
}

.completion-meter {
  display: grid;
  width: 9rem;
  gap: .35rem;
  color: var(--task-muted);
  font-size: .78rem;
  font-weight: 700;
  text-align: right;
}

progress {
  width: 100%;
  height: .45rem;
  overflow: hidden;
  border: 0;
  border-radius: 0;
  background: #d8d9d3;
}

progress::-webkit-progress-bar {
  background: #d8d9d3;
}

progress::-webkit-progress-value {
  background: var(--task-sun);
}

progress::-moz-progress-bar {
  background: var(--task-sun);
}

.task-panel {
  overflow: hidden;
  border: 1px solid var(--task-border);
  border-top: .4rem solid var(--task-accent);
  border-radius: 6px;
  background: var(--task-surface);
  box-shadow: 0 1.25rem 3.5rem rgba(35, 48, 42, .12);
}

.task-panel h2 {
  margin: 0;
  padding: 1.5rem 1.5rem .8rem;
  font-family: "Baskerville", "Iowan Old Style", serif;
  font-size: 1.45rem;
  font-weight: 600;
}

.static-note {
  margin: 0;
  padding: 0 1.5rem 1.1rem;
  color: var(--task-muted);
  font-size: .86rem;
}

.add-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: .6rem;
  padding: 0 1.5rem 1.5rem;
}

.add-form input {
  height: 3rem;
}

.add-form input:focus {
  border-color: var(--task-accent);
  box-shadow: 0 0 0 3px var(--task-accent-light);
}

.add-button {
  min-width: 7rem;
  height: 3rem;
  border-color: var(--task-accent);
  padding: 0 1.1rem;
  background: var(--task-accent);
  color: white;
}

.add-button:hover {
  background: #123d2f;
}

.task-toolbar,
.task-footer {
  display: flex;
  min-height: 3.4rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid var(--task-border);
  padding: .6rem 1.5rem;
}

.task-toolbar {
  border-bottom: 1px solid var(--task-border);
  background: #f7f7f2;
}

.toggle-all-control {
  display: flex;
  align-items: center;
  gap: .5rem;
  color: var(--task-muted);
  font-size: .82rem;
  font-weight: 700;
}

.toggle-all-control input,
.task-row input {
  width: 1.15rem;
  height: 1.15rem;
  margin: 0;
  accent-color: var(--task-accent);
}

.filters {
  display: flex;
  gap: .2rem;
}

.filters button,
.clear-button {
  min-height: 2rem;
  border: 0;
  padding: 0 .65rem;
  background: transparent;
  color: var(--task-muted);
  font-size: .8rem;
}

.filters button:hover {
  background: var(--task-accent-light);
}

.filters button[aria-pressed="true"] {
  border-radius: 3px;
  background: var(--task-accent-light);
  color: var(--task-accent);
}

.view-tools {
  display: flex;
  align-items: end;
  flex-wrap: wrap;
  gap: .75rem;
  margin: 1rem 1.5rem;
}

.grow {
  flex: 1 1 12rem;
  min-width: 0;
}

.view-tools label {
  min-width: 9rem;
}

.task-list {
  min-height: 8.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.task-row {
  display: grid;
  min-height: 4.25rem;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: .85rem;
  border-top: 1px solid #e4e5df;
  padding: .65rem 1.5rem;
}

.todo-title {
  overflow-wrap: anywhere;
  line-height: 1.35;
}

.completed .todo-title {
  color: #8a918d;
  text-decoration: line-through;
  text-decoration-color: var(--task-sun);
  text-decoration-thickness: 2px;
}

.task-footer {
  color: var(--task-muted);
  font-size: .82rem;
  font-weight: 700;
}

.summary {
  margin-left: auto;
  color: var(--task-muted);
}

.clear-button {
  padding: 0;
}

.clear-button:hover,
.clear-button:focus-visible {
  color: var(--task-accent);
  text-decoration: underline;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (max-width: 38rem) {
  .app-shell {
    width: min(100% - 1rem, 34rem);
    padding-top: 1.5rem;
  }

  .app-header {
    align-items: start;
    flex-direction: column;
    gap: 1rem;
  }

  .completion-meter {
    width: 100%;
    text-align: left;
  }

  .add-form {
    grid-template-columns: 1fr;
  }

  .task-toolbar {
    align-items: start;
    flex-direction: column;
  }

  .filters {
    width: 100%;
  }

  .filters button {
    flex: 1;
  }

  .view-tools {
    margin-inline: 1rem;
  }

  .task-row {
    padding-inline: 1rem;
  }

  .task-footer {
    flex-wrap: wrap;
    padding-inline: 1rem;
  }

  .summary {
    margin-left: 0;
    margin-right: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
  }
}`;
const responsiveRulesStart = chapterThreeStyles.indexOf("@media (max-width: 38rem)");
function styleSection(start, end) {
  const startIndex = chapterThreeStyles.indexOf(start);
  const endIndex = chapterThreeStyles.indexOf(end, startIndex);
  if (startIndex < 0 || endIndex < startIndex) {
    throw new Error(`Could not find CSS section from ${start} to ${end}.`);
  }
  return chapterThreeStyles.slice(startIndex, endIndex);
}
export const chapterThreeFoundationStyles = chapterThreeStyles.slice(0, chapterThreeStyles.indexOf(".checkpoint-banner {"));
export const chapterThreeLayoutAdditions = [
  styleSection(".checkpoint-banner {", ".app-shell {"),
  styleSection(".app-shell {", ".completion-meter {"),
  styleSection(".completion-meter {", ".add-form {"),
  styleSection(".add-form {", ".task-list {"),
  styleSection(".task-list {", "@media (max-width: 38rem)")
];
export const chapterThreeResponsiveAddition = chapterThreeStyles.slice(responsiveRulesStart);
export const chapterThreeHtmlExcerpt = sourceLines(chapterThreeHtml, 4, 8);
export const chapterThreeStyleExcerpts = {
  tokens: styleSection(":root {", "* {"),
  baseRules: styleSection("* {", "button,\ninput,\nselect {"),
  controls: styleSection('button,\ninput:not([type="checkbox"]),\nselect {', ":focus-visible {"),
  controlStates: styleSection("button {", 'button,\ninput:not([type="checkbox"]),\nselect {')
};
export const chapterThreeStartingFiles = [
  {
    name: "app/index.html",
    language: "html",
    code: chapterOneHtml
  },
  {
    name: "app/src/main.ts",
    language: "typescript",
    code: chapterTwoMain
  }
];
export const chapterThreeFinishedFiles = [
  {
    name: "app/index.html",
    language: "html",
    code: chapterThreeHtml
  },
  {
    name: "app/src/main.ts",
    language: "typescript",
    code: chapterTwoMain
  },
  {
    name: "app/styles.css",
    language: "css",
    code: chapterThreeStyles
  }
];
export const chapterThree = {
  number: 3,
  title: "Make the interface usable on small and large screens",
  lead: "Give the task page a clear visual system, a layout that can shrink, and focus styles that stay visible when someone uses a keyboard.",
  preview: true,
  sections: [],
  trace: [
    "Keep Chapter 2's semantic task markup and script.",
    "Link app/index.html to a new app/styles.css file.",
    "Add the visual foundation, page layout and responsive rules in stages.",
    "Check the page at narrow and wide widths, then test its keyboard focus."
  ],
  checks: [
    "app/index.html loads /app/styles.css and still loads /app/dist/main.js.",
    "The content is centered on wide screens and fits without horizontal overflow at 360px.",
    "Tab shows a visible focus outline on the task controls.",
    "The list, controls and static task counts still match Chapter 2."
  ],
  trouble: [
    "If styles do not appear, confirm the Network panel requested /app/styles.css successfully, then refresh the page.",
    "If the page script stops running, restore the /app/dist/main.js script path and use the Chapter 2 check/transpile commands for app/src/main.ts.",
    "Do not hide horizontal overflow to cover a too-wide child; inspect its width and flex min-width instead."
  ],
  exercise: "Change --task-accent to another color with readable contrast. Compare links, checkboxes, buttons and keyboard focus, then restore the original value."
};
