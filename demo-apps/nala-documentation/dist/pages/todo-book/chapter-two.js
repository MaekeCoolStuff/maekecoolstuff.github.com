import { chapterOneCommands, chapterOneHtml, chapterOneMain, sourceLines } from "./chapter-one.js";
export const chapterTwoStepTwoSource = `const candidate = document.querySelector("#app");
if (!(candidate instanceof HTMLElement)) {
  throw new Error("Application root is missing.");
}
const root = candidate;
// This fixed, trusted markup is not an interpolation path for task input.
root.innerHTML = \`
  <header class="app-header">
    <div>
      <p class="eyebrow">Nala / Tasks</p>
      <h1>Nala Tasks</h1>
    </div>
    <div class="completion-meter">
      <span>50% complete</span>
      <progress aria-label="Task completion" max="100" value="50">50%</progress>
    </div>
  </header>
  <!-- Step 3: insert the task panel here. -->
\`;
// Step 5: add the form submission guard here.
`;
export const chapterTwoFormMarkup = `  <section class="task-panel" aria-labelledby="task-heading">
    <h2 id="task-heading">Make room for what matters.</h2>
    <p class="static-note">This is a static interface. Native controls do not change task data yet.</p>
    <form class="add-form">
      <label class="sr-only" for="new-task">New task</label>
      <input id="new-task" class="grow" name="title" maxlength="120" required placeholder="What needs doing?">
      <button class="add-button" type="submit">Add task</button>
    </form>
  <!-- Step 4: insert the task controls and sample rows here. -->`;
export const chapterTwoViewsMarkup = `    <div class="task-toolbar">
      <label class="toggle-all-control">
        <input type="checkbox">
        <span>Complete all</span>
      </label>
      <div class="filters" role="group" aria-label="Filter tasks">
        <button type="button" aria-pressed="true">All</button>
        <button type="button" aria-pressed="false">Active</button>
        <button type="button" aria-pressed="false">Completed</button>
      </div>
    </div>
    <div class="view-tools">
      <label class="grow">Search tasks<input type="search"></label>
      <label>Sort tasks
        <select>
          <option>Newest first</option>
          <option>Oldest first</option>
          <option>Title</option>
        </select>
      </label>
    </div>
    <ul class="task-list">
      <li class="task-row">
        <input id="task-tests" type="checkbox">
        <label class="todo-title" for="task-tests">Write acceptance tests</label>
      </li>
      <li class="task-row completed">
        <input id="task-sketch" type="checkbox" checked>
        <label class="todo-title" for="task-sketch">Sketch the task interface</label>
      </li>
    </ul>
    <footer class="task-footer">
      <span>1 task left</span>
      <span class="summary">2 tasks · 1 complete</span>
      <button class="clear-button" type="button">Clear completed</button>
    </footer>
  </section>`;
export const chapterTwoSubmitHandler = `const form = root.querySelector("form");
if (!(form instanceof HTMLFormElement)) {
  throw new Error("Task form is missing.");
}
form.addEventListener("submit", (event) => event.preventDefault());`;
export const chapterTwoFormExcerpts = {
  labelAndInput: sourceLines(chapterTwoFormMarkup, 5, 6),
  browserConstraints: sourceLines(chapterTwoFormMarkup, 6, 6)
};
export const chapterTwoViewExcerpts = {
  taskRow: sourceLines(chapterTwoViewsMarkup, 23, 26),
  searchControl: sourceLines(chapterTwoViewsMarkup, 13, 13),
  summaryFooter: sourceLines(chapterTwoViewsMarkup, 33, 37)
};
export const chapterTwoSubmitExcerpts = {
  formGuard: sourceLines(chapterTwoSubmitHandler, 1, 4),
  listener: sourceLines(chapterTwoSubmitHandler, 5, 5)
};
export const chapterTwoNativeControlSteps = [
  {
    id: "search-input",
    title: "Type in Search tasks",
    location: "Browser · search input",
    description: "The native input displays the text you typed.",
    input: "Your search words",
    action: "Browser: update the input's current value.",
    output: "The search field contains your words.",
    boundary: "No code filters the fixed task list."
  },
  {
    id: "task-checkbox",
    title: "Check a task",
    location: "Browser · checkbox",
    description: "The native checkbox changes its checked state.",
    input: "A click on one task checkbox",
    action: "Browser: toggle the checkbox.",
    output: "That checkbox appears checked or unchecked.",
    boundary: "No task data changes; the summary stays fixed."
  }
];
export const chapterTwoSubmitSteps = [
  {
    id: "invalid-form",
    title: "Browser checks the form",
    location: "Browser · native validation",
    description: "An empty required field is rejected before submission.",
    input: "Empty title",
    action: "Browser: check the required constraint.",
    output: "The browser focuses the field; no submit event is sent."
  },
  {
    id: "valid-form",
    title: "Browser sends a submit event",
    location: "Browser · form",
    description: "A non-empty title passes the native required check.",
    input: "Filled title",
    action: "Browser: dispatch the form's submit event.",
    output: "The registered listener receives the event."
  },
  {
    id: "prevent-navigation",
    title: "Listener keeps this page open",
    location: "Your TypeScript · submit listener",
    description: "The listener calls preventDefault().",
    input: "Submit event",
    action: "Your code: cancel the browser's default navigation.",
    output: "The current page remains visible.",
    boundary: "No task is saved or added in this static chapter."
  }
];
export const chapterTwoWatchSteps = [
  {
    id: "watch-edit",
    title: "Save an app file",
    location: "Your editor",
    description: "The watcher observes the app files and currently imported vendor sources.",
    input: "An app source/browser asset or an imported vendor source file",
    action: "Watcher: check and transpile app modules plus imported vendor modules.",
    output: "Checked native ES modules under app/dist/ and vendor/*/dist/."
  },
  {
    id: "watch-success",
    title: "Refresh after success",
    location: "Development server and browser",
    description: "The watcher notifies connected browser pages.",
    input: "Successful build",
    action: "Server: send a full-page reload event.",
    output: "The browser loads the updated page.",
    boundary: "This is live reload, not in-place HMR."
  },
  {
    id: "watch-failure",
    title: "Keep the page on a build error",
    location: "Watcher terminal",
    description: "A failed check or transpile is reported.",
    input: "Invalid TypeScript or a failed build",
    action: "Watcher: print the error and skip reload.",
    output: "The current browser page remains as it was."
  }
];
export const chapterTwoStepThreeSource = chapterTwoStepTwoSource.replace("  <!-- Step 3: insert the task panel here. -->", chapterTwoFormMarkup);
export const chapterTwoStepFourSource = chapterTwoStepThreeSource.replace("  <!-- Step 4: insert the task controls and sample rows here. -->", chapterTwoViewsMarkup);
export const chapterTwoMain = chapterTwoStepFourSource.replace("// Step 5: add the form submission guard here.\n", chapterTwoSubmitHandler).trimEnd();
export const chapterTwoCommands = chapterOneCommands;
export const chapterTwoTypeErrorTranscript = [
  {
    id: "type-error",
    command: "deno check app/src/main.ts",
    output: "Check app/src/main.ts\nTS2322 [ERROR]: Type 'number' is not assignable to type 'string'.\nroot.innerHTML = 42;\n~~~~~~~~~~~~~~\n    at file:///…/app/src/main.ts:7:1\n\nerror: Type checking failed.",
    note: "Observed with Deno 2.9.7. The temporary directory in the full file URL varies; line 7 is the inserted wrong assignment."
  }
];
export const chapterTwoMainExcerpts = {
  root: sourceLines(chapterTwoMain, 1, 6),
  heading: sourceLines(chapterTwoMain, 8, 17),
  form: sourceLines(chapterTwoMain, 18, 25),
  controls: sourceLines(chapterTwoMain, 26, 46),
  list: sourceLines(chapterTwoMain, 47, 62),
  submit: sourceLines(chapterTwoMain, 64, 68)
};
export const chapterTwoTransfer = {
  before: '  <div class="view-tools">',
  after: `  <div class="view-tools">
    <label>Category
      <select>
        <option>All categories</option>
        <option>Home</option>
        <option>Work</option>
      </select>
    </label>`
};
export const chapterTwoStartingFiles = [
  {
    name: "app/index.html",
    language: "html",
    code: chapterOneHtml
  },
  {
    name: "app/src/main.ts",
    language: "typescript",
    code: chapterOneMain
  }
];
export const chapterTwoFinishedFiles = [
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
export const chapterTwo = {
  number: 2,
  title: "Build the real interface in semantic HTML",
  lead: "Give task controls meaning the browser understands. Replace your startup report with a labeled, keyboard-ready interface—without pretending the task data works yet.",
  preview: true,
  sections: [],
  trace: [
    "Start with the Chapter 1 app/index.html and its /app/dist/main.js script URL.",
    "Replace app/src/main.ts with a working page shell, then add the form and task views at marked locations.",
    "Add a guarded submit listener after the markup is complete.",
    "Check and transpile after each stage, then inspect /app/ in the browser.",
    "Compare browser-native control behavior with the task behavior this static page does not implement."
  ],
  checks: [
    "The existing HTML still loads app/dist/main.js; only app/src/main.ts changed.",
    "The browser shows labeled New task, Search tasks and Sort tasks controls plus the two sample rows.",
    "Submitting an empty title is blocked by native required validation; a valid submit does not navigate or add a row.",
    "A checkbox changes itself, but Search, Sort and the sample summary remain unchanged.",
    "The independent Category-control task adds a labeled select without changing task data."
  ],
  trouble: [
    "If the browser still shows the startup report, save app/src/main.ts, run both commands in order and reload /app/.",
    "If the module request fails, check that app/dist/main.js exists and app/index.html still points to that exact URL."
  ],
  exercise: "Add a labeled Category select with All categories, Home and Work options beside the existing search and sort controls. Decide where the markup belongs, verify the label focuses the control, then restore app/src/main.ts from the finished file set."
};
