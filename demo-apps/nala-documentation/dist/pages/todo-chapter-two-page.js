import { defineComponent, html } from "../../../../vendor/components/dist/index.js";
import { renderCodeExample } from "./code-example.js";
import { chapterTwo, chapterTwoCommands, chapterTwoFinishedFiles, chapterTwoFormExcerpts, chapterTwoFormMarkup, chapterTwoMainExcerpts, chapterTwoNativeControlSteps, chapterTwoStartingFiles, chapterTwoStepTwoSource, chapterTwoSubmitExcerpts, chapterTwoSubmitHandler, chapterTwoSubmitSteps, chapterTwoTransfer, chapterTwoTypeErrorTranscript, chapterTwoViewExcerpts, chapterTwoViewsMarkup, chapterTwoWatchSteps } from "./todo-book/chapter-two.js";
const styles = `
docs-todo-chapter-two { display: block; min-width: 0; }
.todo-two { --lesson-gap: clamp(1.25rem, 3vw, 2.5rem); }
.todo-two *, .todo-two *::before, .todo-two *::after { box-sizing: border-box; }
.todo-two .chapter-hero { padding: var(--lesson-gap); border: 1px solid var(--nala-ui-color-border); border-radius: 1rem; background: var(--nala-ui-color-surface); }
.todo-two .chapter-hero h1 { margin-top: .5rem; max-width: 100%; }
.todo-two .chapter-hero .page-lead { max-width: 62ch; }
.todo-two .chapter-promises { display: flex; flex-wrap: wrap; gap: .5rem; padding: 0; list-style: none; }
.todo-two .chapter-promises li { padding: .35rem .75rem; border-radius: 2rem; background: var(--nala-ui-color-accent-soft); font-size: .85rem; }
.todo-two .chapter-body { margin-top: var(--lesson-gap); }
.todo-two nala-page-outline { --nala-page-outline-top: 5.25rem; }
.todo-two nala-page-outline ol { display: grid; gap: .15rem; }
.todo-two nala-page-outline li { padding-left: .25rem; }
.todo-two nala-page-outline li::marker { color: var(--nala-ui-color-text-muted); font-weight: 700; }
.todo-two nala-page-outline a { display: block; padding: .3rem .5rem; border-radius: .4rem; text-decoration: none; }
.todo-two nala-page-outline a:hover { background: var(--nala-ui-color-surface-muted); text-decoration: underline; }
.todo-two .chapter-body, .todo-two .chapter-body > *, .todo-two .choice-grid > * { min-width: 0; }
.todo-two .chapter-step { margin: 0 0 3rem; scroll-margin-top: 6rem; }
.todo-two .step-heading { display: flex; align-items: baseline; gap: .75rem; margin-bottom: 1rem; }
.todo-two .step-heading h2 { margin: 0; font-size: clamp(1.35rem, 2.5vw, 1.75rem); }
.todo-two .step-number { display: inline-grid; place-items: center; flex: 0 0 2rem; height: 2rem; border-radius: 50%; background: var(--nala-ui-color-accent); color: var(--nala-ui-color-surface); font: 700 .9rem/1 sans-serif; }
.todo-two .choice-grid { display: grid; gap: 1rem; margin: 1rem 0; }
.todo-two .lesson-panel { min-width: 0; padding: 1.1rem; border: 1px solid var(--nala-ui-color-border); border-radius: .75rem; background: var(--nala-ui-color-surface); }
.todo-two .lesson-panel h3 { margin-top: 0; }
.todo-two .lesson-panel > :last-child { margin-bottom: 0; }
.todo-two .lesson-panel + .readiness { margin-top: 1rem; }
.todo-two .lesson-note { margin: 1.25rem 0; border-left: 3px solid var(--nala-ui-color-accent); padding: .5rem 1rem; background: var(--nala-ui-color-surface-muted); }
.todo-two .lesson-note p { margin: .5rem 0; }
.todo-two nala-code-block { display: block; max-width: 100%; margin: .75rem 0 1.25rem; }
.todo-two nala-process-flow { display: block; max-width: 100%; margin: 1rem 0 1.5rem; }
.todo-two nala-code-workspace, .todo-two nala-file-tree, .todo-two nala-terminal-transcript { display: block; max-width: 100%; margin: 1rem 0 1.5rem; }
.todo-two details { margin: 1rem 0; border: 1px solid var(--nala-ui-color-border); border-radius: .75rem; padding: 1rem; background: var(--nala-ui-color-surface); }
.todo-two summary { cursor: pointer; font-weight: 700; }
.todo-two details[open] > summary { margin-bottom: 1rem; }
.todo-two .readiness { padding: 1.25rem; border: 1px solid var(--nala-ui-color-border); border-radius: .75rem; background: var(--nala-ui-color-surface); }
.todo-two .readiness h3 { margin-top: 0; }
.todo-two .acceptance { display: grid; gap: .75rem; padding: 0; list-style: none; }
.todo-two .acceptance li { padding: .75rem; border-radius: .5rem; background: var(--nala-ui-color-surface-muted); }
.todo-two .acceptance label { display: flex; align-items: baseline; gap: .75rem; }
.todo-two .acceptance input { flex-shrink: 0; accent-color: var(--nala-ui-color-accent); }
.todo-two .chapter-links { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; margin: 1.5rem 0; padding: 1rem 0; border-top: 1px solid var(--nala-ui-color-border); }
.todo-two a, .todo-two code { overflow-wrap: anywhere; }
.todo-two button { padding: .65rem 1rem; border: 1px solid var(--nala-ui-color-border); border-radius: .5rem; background: var(--nala-ui-color-surface-muted); color: var(--nala-ui-color-text); cursor: pointer; font: inherit; }
.todo-two :is(a, button, summary, input):focus-visible { outline: 3px solid var(--nala-ui-color-accent); outline-offset: 3px; }
.todo-two iframe { display: block; width: 100%; height: 20rem; margin-top: 1rem; border: 1px solid var(--nala-ui-color-border); border-radius: .5rem; background: white; }
@media (min-width: 760px) { .todo-two .choice-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
`;
const startingFiles = chapterTwoStartingFiles;
const finishedFiles = chapterTwoFinishedFiles;
const fileTree = [
  {
    id: "app",
    name: "app",
    kind: "folder",
    children: [
      {
        id: "index",
        name: "index.html",
        kind: "file",
        note: "Unchanged from Chapter 1"
      },
      {
        id: "source",
        name: "src",
        kind: "folder",
        children: [
          {
            id: "main",
            name: "main.ts",
            kind: "file",
            note: "Replace in this chapter"
          }
        ]
      },
      {
        id: "output",
        name: "dist",
        kind: "folder",
        children: [
          {
            id: "javascript",
            name: "main.js",
            kind: "file",
            note: "Generated by Deno"
          }
        ]
      }
    ]
  }
];
const commandEntries = [
  {
    id: "check",
    command: chapterTwoCommands.split("\n")[0],
    note: "Wait for a clean check before transpiling."
  },
  {
    id: "transpile",
    command: chapterTwoCommands.split("\n")[1],
    note: "Writes app/dist/main.js; it does not run the browser page."
  }
];
const appWatchTranscript = [
  {
    id: "watch-app",
    command: "deno task dev:watch:app",
    note: "Run from the repository root to start the app watcher and development server together."
  }
];
defineComponent("docs-todo-chapter-two", {
  styles,
  template: ()=>html`
      <article class="docs-page todo-two">
        <header class="chapter-hero">
          <p class="page-eyebrow">Start here · Chapter 2 of 3</p>
          <h1>${chapterTwo.title}</h1>
          <p class="page-lead">${chapterTwo.lead}</p>
          <ul class="chapter-promises" aria-label="Chapter outcomes">
            <li>Native HTML semantics</li>
            <li>One source file replaced</li>
            <li>Browser behavior you can test</li>
          </ul>
          <p>Chapter 1 left you with an HTML page and a TypeScript startup report in your own <code>app/</code> folder. You will keep the HTML and replace only the startup source.</p>
          <aside class="lesson-note" aria-label="Before you begin">
            <p><strong>Bring:</strong> your Chapter 1 repository, an editor, Deno and a browser. You should be able to find the repository root and run the two check/transpile commands from Chapter 1. If you paused before finishing it, return to <a href="/start-here/todo/01">Chapter 1</a> first.</p>
            <p><strong>Learn:</strong> how labels, forms, lists and progress communicate meaning to the browser, and which behavior native controls provide before task data exists.</p>
            <p><strong>Pause and resume:</strong> save <code>app/src/main.ts</code> after any step. The server may stay running; the checklist is temporary and resets when you leave. No task data is saved in this chapter.</p>
          </aside>
          <a href="#step-1">Start with your Chapter 1 files →</a>
        </header>

        <nav class="chapter-links" aria-label="Chapter navigation">
          <a rel="prev"
            href="/start-here/todo/01">Previous: From TypeScript source to the browser</a>
          <a href="/start-here/todo">Book contents</a>
          <a rel="next"
            href="/start-here/todo/03">Next: Style the responsive interface</a>
        </nav>

        <nala-page-outline label="On this page">
          <ol>
            <li><a href="#step-1">Start from your app</a></li>
            <li><a href="#step-2">Mount the page shell</a></li>
            <li><a href="#step-3">Add a task form</a></li>
            <li><a href="#step-4">Add task views</a></li>
            <li><a href="#step-5">Choose submit behavior</a></li>
            <li><a href="#step-6">Build and inspect</a></li>
            <li><a href="#step-7">Experiment and transfer</a></li>
          </ol>
        </nala-page-outline>

        <div class="chapter-body">
          <section class="chapter-step" id="step-1">
            <div
              class="step-heading"><span class="step-number" aria-hidden="true">1</span><h2>Start with the files you already own</h2></div>
            <p>At the end of Chapter 1, you created <code>app/index.html</code> and <code>app/src/main.ts</code>. Its HTML contains <code>&lt;main id="app"&gt;</code> and loads <code>/app/dist/main.js</code>. Keep that HTML exactly as it is.</p>
            <p>This chapter replaces the contents of <code>app/src/main.ts</code>. Deno will still write generated JavaScript to <code>app/dist/main.js</code>; do not edit or copy that generated file.</p>
            <nala-file-tree label="Your app files after Chapter 2"
              .entries=${fileTree}></nala-file-tree>
            <p><strong>Starting files · what Chapter 1 left in app/</strong></p>
            <nala-code-workspace label="Chapter 2 starting files"
              .files=${startingFiles}></nala-code-workspace>
            <aside class="lesson-note">
              <p><strong>Before moving on:</strong> in your editor, confirm that <code>app/index.html</code> points to <code>/app/dist/main.js</code>, and that the current source creates the “Nala Tasks: startup” heading. If those details differ, restore the Chapter 1 baseline before replacing the source.</p>
            </aside>
          </section>

          <section class="chapter-step" id="step-2">
            <div
              class="step-heading"><span class="step-number" aria-hidden="true">2</span><h2>Mount the page shell</h2></div>
            <p>Open <code>app/src/main.ts</code> and replace its contents with this working first version. It checks the HTML-to-TypeScript contract, then asks the browser to parse a small, fixed fragment:</p>
            ${renderCodeExample(chapterTwoStepTwoSource, "typescript")}
            <h3>First, make sure the HTML has the place you need</h3>
            ${renderCodeExample(chapterTwoMainExcerpts.root, "typescript")}
            <p><code>querySelector</code> may return <code>null</code>. The guard stops if Chapter 2's <code>&lt;main id="app"&gt;</code> is missing; after it, TypeScript knows the page root is an <code>HTMLElement</code>. Think of <code>root</code> as the one part of the page this program will fill.</p>
            <h3>Then, give the browser real page structure</h3>
            ${renderCodeExample(chapterTwoMainExcerpts.heading, "typescript")}
            <p>The fixed template becomes browser elements through <code>innerHTML</code>. That is safe here because the markup is written by you. Later, a task title typed by someone must be shown as text, not pasted into this HTML string.</p>
            <p>The heading names the page. The wrapping <code>label</code> names the progress indicator for assistive technology. Its value is a fixed 50 out of 100; it is not calculated from the sample checkboxes.</p>
            <p><strong>Build a small milestone:</strong> save the file, run these commands in order from the repository root, and reload <code>/app/</code>. Transpile only after the check succeeds:</p>
            <nala-terminal-transcript compact label="Terminal · repository root · after each stage"
              directory="Repository root"
              .entries=${commandEntries}></nala-terminal-transcript>
            <p>You should see the heading and fixed completion indicator, but no task panel or controls yet. The browser tab title stays unchanged because you have not edited <code>app/index.html</code>. Repeat this save-check-transpile-reload cycle after Steps 3–5.</p>
            <aside class="lesson-note"><p><strong>Keep this checkpoint.</strong> It is valid TypeScript and a working page on its own. The comments inside the template are temporary insertion markers; the browser treats them as HTML comments, so they do not appear on the page.</p></aside>
          </section>

          <section class="chapter-step" id="step-3">
            <div class="step-heading"><span class="step-number" aria-hidden="true">3</span><h2>Add a task form with a useful label</h2></div>
            <p>Replace the Step 3 insertion marker inside the template string with this task panel and form. Keep the surrounding backticks; the inserted code leaves the Step 4 marker in place for the next addition:</p>
            ${renderCodeExample(chapterTwoFormMarkup, "html")}
            <h3>Connect the words to the field</h3>
            ${renderCodeExample(chapterTwoFormExcerpts.labelAndInput, "html")}
            <p>The label's <code>for</code> and the input's <code>id</code> have the same value. That connection gives the field an accessible name and makes activating its label focus the input. The <code>sr-only</code> class visually hides the label without removing it from assistive technology; the placeholder is only a hint.</p>
            <h3>Let the browser enforce two simple rules</h3>
            ${renderCodeExample(chapterTwoFormExcerpts.browserConstraints, "html")}
            <p><code>required</code> blocks an empty submission, and <code>maxlength</code> limits the title to 120 characters. <code>name="title"</code> is the key the browser would use in form data; this chapter does not save form data yet.</p>
            <p>Save, check, transpile and reload as in Step 2. Try submitting the empty form: the browser should focus the required field and prevent submission.</p>
            <aside class="lesson-note"><p><strong>Notice what is not wired yet:</strong> this temporary version has no submit listener. Do not submit a filled title yet; the browser's default form action would navigate. Step 5 will make the deliberate choice to keep a valid submission on this page.</p></aside>
          </section>

          <section class="chapter-step" id="step-4">
            <div class="step-heading"><span class="step-number" aria-hidden="true">4</span><h2>Add the task views</h2></div>
            <p>Replace the Step 4 insertion marker with this markup. It adds the bulk and filter controls, search and sort controls, two sample rows, and a fixed summary footer:</p>
            ${renderCodeExample(chapterTwoViewsMarkup, "html")}
            <h3>Native controls already respond to you</h3>
            ${renderCodeExample(chapterTwoViewExcerpts.searchControl, "html")}
            <p>Typing changes the search field's value. A <code>select</code> lets you choose a sort label. Neither control changes the sample list, because no filtering or sorting code is connected yet.</p>
            ${renderCodeExample(chapterTwoViewExcerpts.taskRow, "html")}
            <p>Each <code>li</code> is one task row. Its checkbox and label are connected by matching <code>id</code> and <code>for</code> values. The second checkbox starts checked because its HTML has the <code>checked</code> attribute, and the row's <code>completed</code> class gives the stylesheet a presentation hook.</p>
            <nala-process-flow
              label="What changes now, and what the app does not do yet"
              .steps=${chapterTwoNativeControlSteps}></nala-process-flow>
            <p>“Add task” submits the form; “Clear completed” uses <code>type="button"</code> so it does not submit. Neither button has task logic. Save, check, transpile and reload, then try the controls and compare what changes with what stays fixed.</p>
            <h3>Some page text is fixed too</h3>
            ${renderCodeExample(chapterTwoViewExcerpts.summaryFooter, "html")}
            <p>The footer values are ordinary fixed HTML text. They do not recalculate when you click a checkbox because this chapter has not connected the controls to task data.</p>
          </section>

          <section class="chapter-step" id="step-5">
            <div class="step-heading"><span class="step-number" aria-hidden="true">5</span><h2>Choose what submitting means</h2></div>
            <p>The browser's default for a valid form is to submit its values and navigate. This static chapter has nowhere to save a task, so we will prevent that navigation. Replace the final Step 5 comment, after the template string, with this TypeScript:</p>
            ${renderCodeExample(chapterTwoSubmitHandler, "typescript")}
            <h3>Check that the form really exists</h3>
            ${renderCodeExample(chapterTwoSubmitExcerpts.formGuard, "typescript")}
            <p><code>querySelector</code> looks inside this page root. The <code>instanceof HTMLFormElement</code> check confirms it found a form before the code tries to attach a listener. If the form is missing, the program stops with a message instead of failing later in a confusing way.</p>
            <h3>Handle only a valid submission</h3>
            ${renderCodeExample(chapterTwoSubmitExcerpts.listener, "typescript")}
            <p>A <strong>listener</strong> is a function the browser calls when an event happens. An empty title is still blocked by the browser's <code>required</code> rule before this listener runs.</p>
            <p>For a filled title, <code>preventDefault()</code> cancels the browser's normal navigation. It does not create or save a task.</p>
            <nala-process-flow
              label="From native form validation to a stayed-on-page submit"
              .steps=${chapterTwoSubmitSteps}></nala-process-flow>
            <p>Save, check, transpile and reload. Verify both outcomes: an empty title is rejected; a filled title leaves the URL unchanged and adds no row.</p>
            <details>
              <summary>Experiment: make the form guard fail, then restore it</summary>
              <ol>
                <li>In <code>app/src/main.ts</code>, temporarily change <code>root.querySelector("form")</code> to <code>root.querySelector("form[data-required]")</code>.</li>
                <li>Run the same check/transpile commands, then reload <code>/app/</code>.</li>
                <li>Open Developer Tools → Console. The page should report <code>Task form is missing.</code> because no form has that extra attribute.</li>
                <li>Restore the original selector, check and transpile again, and reload. The form and task views should return.</li>
              </ol>
              <p>This wrong selector is still valid TypeScript, so the type checker cannot know your page has no matching form. The runtime guard catches the mismatch when the browser executes the program. That is a different job from checking types.</p>
            </details>
          </section>

          <section class="chapter-step" id="step-6">
            <div
              class="step-heading"><span class="step-number" aria-hidden="true">6</span><h2>Build and inspect the finished page</h2></div>
            <p>Now that the pieces are in place, run the complete build sequence from the repository root. <code>deno check</code> checks the TypeScript but writes no browser file. Only after it succeeds, <code>deno transpile</code> creates <code>app/dist/main.js</code>.</p>
            <nala-terminal-transcript label="Terminal 1 · check then transpile"
              directory="Repository root"
              .entries=${commandEntries}></nala-terminal-transcript>
            <p>For the manual workflow, keep the Chapter 2 development server running in a second terminal. If you stopped it, restart it from the repository root:</p>
            <nala-terminal-transcript compact
              label="Terminal 2 · restart the local server"
              directory="Repository root"
              .entries=${[
      {
        id: "serve",
        command: "deno run -A tools/dev-server.ts",
        note: "Leave this terminal running; the server does not return to the prompt."
      }
    ]}></nala-terminal-transcript>
            <section class="lesson-panel" aria-labelledby="app-watch-title">
              <h3 id="app-watch-title">Keep the browser in sync while you edit</h3>
              <p>The manual <code>deno check</code> and <code>deno transpile</code> commands above let you see each build step. For your regular edit-and-check cycle, use the repository task introduced in Chapter 1.</p>
              <p>Stop the separately started server first to avoid a port conflict, then run this from the repository root:</p>
              <nala-terminal-transcript compact
                label="Terminal · repository root · server and app watcher"
                directory="Repository root"
                .entries=${appWatchTranscript}></nala-terminal-transcript>
              <nala-process-flow
                label="What the app watcher does after you save"
                .steps=${chapterTwoWatchSteps}></nala-process-flow>
              <p>The server reloads the whole page after a successful build. <strong>Hot module replacement (HMR)</strong> would replace code without reloading the document; this task does not do that, so temporary page state is lost.</p>
              <p>The watcher ignores generated <code>dist/</code> output. It checks and transpiles app modules and the vendor packages imported by <code>app/src/main.ts</code>, keeping them as native ES modules rather than bundling them. It also reloads after you change an app stylesheet or other browser asset. Use <code>deno task build:app</code> for a one-time app build, or <code>deno task build:nala</code> for the repository's vendor packages and demo apps. Stop the combined task with <kbd>Ctrl</kbd> + <kbd>C</kbd>; Chapter 1 shows how to set <code>PORT</code> on macOS/Linux or Windows PowerShell.</p>
            </section>
            <p>Open or reload <code>/app/</code> on the server's printed origin. Look for the heading, task form, search and sort controls, two sample rows, and the fixed “1 active · 1 completed · 2 total” summary. The tab title remains Chapter 1's <code>Nala Tasks: startup</code> because you kept <code>app/index.html</code> unchanged.</p>
            <h3>Confirm the browser received your compiled file</h3>
            <p>In Developer Tools → Network, find <code>/app/dist/main.js</code>. A fresh response should show status <strong>200</strong> and a JavaScript content type such as <code>text/javascript</code>. Its Response should contain compiled JavaScript.</p>
            <p>A cached request may instead show <strong>304</strong>, memory cache or disk cache. Disable cache in Developer Tools or hard-reload if you need to inspect a fresh transfer.</p>
            <h3>Try the controls and notice their limits</h3>
            <ul>
              <li>An empty title is blocked by native validation.</li>
              <li>A filled submission stays on this page but adds no row.</li>
              <li>A checkbox toggles, while Search, Sort and the summary stay unchanged.</li>
            </ul>
            <p>These results show exactly which behavior belongs to the browser and which task features are not implemented yet.</p>
            <details>
              <summary>See the complete Chapter 2 source in one place</summary>
              <nala-code-workspace label="Chapter 2 finished source files"
                .files=${finishedFiles}></nala-code-workspace>
            </details>
          </section>

          <section class="chapter-step" id="step-7">
            <div
              class="step-heading"><span class="step-number" aria-hidden="true">7</span><h2>Experiment, transfer, and leave a clean baseline</h2></div>
            <details>
              <summary>Experiment: let the type checker catch a wrong value</summary>
              <p>Make a disposable mistake: temporarily add <code>root.innerHTML = 42;</code> just before the template assignment in <code>app/src/main.ts</code>. Predict which tool should object, then run only <code>deno check app/src/main.ts</code>. It reports TS2322 because <code>innerHTML</code> requires text, not a number.</p>
              <p
                class="file-label">Terminal · repository root · observed diagnostic</p>
              <nala-terminal-transcript compact
                label="Terminal · observed TypeScript error"
                directory="Repository root"
                .entries=${chapterTwoTypeErrorTranscript}></nala-terminal-transcript>
              <p>Remove the added line, repeat the Step 6 check/transpile sequence, and reload. Do not transpile and run this intentionally broken variation. Unlike the missing-form experiment, the type error is caught before the browser runs anything.</p>
            </details>
            <section class="lesson-panel" aria-labelledby="transfer-title">
              <h3
                id="transfer-title">Independent transfer · add one labeled control</h3>
              <p>Before opening the answer, make your own plan: choose the file, insertion point and commands. Add a <strong>Category</strong> select beside Search tasks and Sort tasks, with these choices:</p>
              <ul>
                <li>All categories</li>
                <li>Home</li>
                <li>Work</li>
              </ul>
              <p>Your change is successful when the labeled select appears on <code>/app/</code>, its label focuses it, and the task rows and summary remain unchanged.</p>
              <details>
                <summary>Check the solution and restore the baseline</summary>
                <p>The control is interface markup, so edit only <code>app/src/main.ts</code>, inside the existing <code>view-tools</code> element. Then run the Step 6 check/transpile sequence and reload <code>/app/</code>.</p>
                ${renderCodeExample(chapterTwoTransfer.after, "html")}
                <p>Its wrapping label gives the select an accessible name and makes the label text focus the control. The select has choices, but no code filters tasks—that remains outside this chapter's behavior.</p>
                <p>To restore the canonical baseline, replace <code>app/src/main.ts</code> with the complete source in Step 6, check, transpile and reload once more. The category control should be gone and all original rows and summary should return.</p>
              </details>
            </section>
            <section class="readiness" aria-labelledby="readiness-title">
              <h3 id="readiness-title">Ready to continue?</h3>
              <p>This checklist is not saved and resets when you leave. Tick an item only after you have seen its evidence.</p>
              <ul class="acceptance">
                <li><label><input type="checkbox"><span>I built the interface in stages and kept <code>app/index.html</code> unchanged.</span></label></li>
                <li><label><input type="checkbox"><span>The browser blocked an empty title; a valid submit stayed on the page without adding a row.</span></label></li>
                <li><label><input type="checkbox"><span>I saw the missing-form guard fail and restored its selector.</span></label></li>
                <li><label><input type="checkbox"><span>I saw <code>deno check</code> reject the wrong type and restored the source.</span></label></li>
                <li><label><input type="checkbox"><span>I added the Category control as an independent change, verified it, and restored the baseline.</span></label></li>
              </ul>
            </section>
            <aside class="lesson-note">
              <p><strong>Next:</strong> Chapter 3 adds layout and focus styling to the same app. Keep your Chapter 2 files; do not copy checkpoint paths into <code>app/</code>.</p>
            </aside>
            <section id="reference-comparison" aria-labelledby="comparison-title">
              <h3
                id="comparison-title">Optional: compare with reference project 02</h3>
              <p>Reference project 02 is a separate example document with the same static semantic interface. It is not part of your app, and opening it does not change your files.</p>
              <a href="/demo-apps/core-todo-tutorial/checkpoints/02/" target="_blank"
                rel="noopener">Open reference project 02</a>
              <p><button type="button" data-preview aria-expanded="false" aria-controls="chapter-two-reference-preview">Load optional reference preview</button></p>
              <div id="chapter-two-reference-preview"></div>
            </section>
          </section>
          <nav class="chapter-links" aria-label="Chapter navigation">
            <a rel="prev"
              href="/start-here/todo/01">Previous: From TypeScript source to the browser</a>
            <a href="/start-here/todo">Book contents</a>
            <a rel="next"
              href="/start-here/todo/03">Next: Style the responsive interface</a>
          </nav>
        </div>
      </article>
    `,
  onConnect (context) {
    const button = context.query("[data-preview]");
    const preview = context.query("#chapter-two-reference-preview");
    if (!button || !preview) {
      throw new Error("Chapter 2 reference controls are missing.");
    }
    const resetPreview = ()=>{
      preview.replaceChildren();
      button.textContent = "Load optional reference preview";
      button.setAttribute("aria-expanded", "false");
    };
    context.onCleanup(resetPreview);
    context.listen(button, "click", ()=>{
      if (preview.querySelector("iframe")) {
        resetPreview();
        return;
      }
      const frame = document.createElement("iframe");
      frame.title = "Reference project 02: semantic HTML";
      frame.src = "/demo-apps/core-todo-tutorial/checkpoints/02/";
      preview.append(frame);
      button.textContent = "Close reference preview";
      button.setAttribute("aria-expanded", "true");
    });
  }
});
