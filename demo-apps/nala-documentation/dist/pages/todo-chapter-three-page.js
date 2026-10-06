import { defineComponent, html } from "../../../../vendor/components/dist/index.js";
import { renderCodeExample } from "./code-example.js";
import { chapterThree, chapterThreeFinishedFiles, chapterThreeFoundationStyles, chapterThreeHtmlExcerpt, chapterThreeLayoutAdditions, chapterThreeResponsiveAddition, chapterThreeStartingFiles, chapterThreeStyleExcerpts } from "./todo-book/chapter-three.js";
const styles = `
docs-todo-chapter-three { display: block; min-width: 0; }
.todo-three { --lesson-gap: clamp(1.25rem, 3vw, 2.5rem); }
.todo-three *, .todo-three *::before, .todo-three *::after { box-sizing: border-box; }
.todo-three .chapter-hero { padding: var(--lesson-gap); border: 1px solid var(--nala-ui-color-border); border-radius: 1rem; background: var(--nala-ui-color-surface); }
.todo-three .chapter-hero h1 { margin-top: .5rem; max-width: 100%; }
.todo-three .chapter-hero .page-lead { max-width: 62ch; }
.todo-three .chapter-promises { display: flex; flex-wrap: wrap; gap: .5rem; padding: 0; list-style: none; }
.todo-three .chapter-promises li { padding: .35rem .75rem; border-radius: 2rem; background: var(--nala-ui-color-accent-soft); font-size: .85rem; }
.todo-three .chapter-body { margin-top: var(--lesson-gap); }
.todo-three nala-page-outline { --nala-page-outline-top: 5.25rem; }
.todo-three nala-page-outline ol { display: grid; gap: .15rem; }
.todo-three nala-page-outline li { padding-left: .25rem; }
.todo-three nala-page-outline li::marker { color: var(--nala-ui-color-text-muted); font-weight: 700; }
.todo-three nala-page-outline a { display: block; padding: .3rem .5rem; border-radius: .4rem; text-decoration: none; }
.todo-three nala-page-outline a:hover { background: var(--nala-ui-color-surface-muted); text-decoration: underline; }
.todo-three .chapter-body, .todo-three .chapter-body > *, .todo-three .choice-grid > * { min-width: 0; }
.todo-three .chapter-step { margin: 0 0 3rem; scroll-margin-top: 6rem; }
.todo-three .step-heading { display: flex; align-items: baseline; gap: .75rem; margin-bottom: 1rem; }
.todo-three .step-heading h2 { margin: 0; font-size: clamp(1.35rem, 2.5vw, 1.75rem); }
.todo-three .step-number { display: inline-grid; place-items: center; flex: 0 0 2rem; height: 2rem; border-radius: 50%; background: var(--nala-ui-color-accent); color: var(--nala-ui-color-surface); font: 700 .9rem/1 sans-serif; }
.todo-three .lesson-panel { min-width: 0; padding: 1.1rem; border: 1px solid var(--nala-ui-color-border); border-radius: .75rem; background: var(--nala-ui-color-surface); }
.todo-three .lesson-panel h3 { margin-top: 0; }
.todo-three .lesson-panel > :last-child { margin-bottom: 0; }
.todo-three .lesson-note { margin: 1.25rem 0; border-left: 3px solid var(--nala-ui-color-accent); padding: .5rem 1rem; background: var(--nala-ui-color-surface-muted); }
.todo-three .lesson-note p { margin: .5rem 0; }
.todo-three nala-code-block { display: block; max-width: 100%; margin: .75rem 0 1.25rem; }
.todo-three nala-process-flow { display: block; max-width: 100%; margin: 1rem 0 1.5rem; }
.todo-three nala-code-workspace, .todo-three nala-file-tree, .todo-three nala-terminal-transcript { display: block; max-width: 100%; margin: 1rem 0 1.5rem; }
.todo-three .readiness { padding: 1.25rem; border: 1px solid var(--nala-ui-color-border); border-radius: .75rem; background: var(--nala-ui-color-surface); }
.todo-three .readiness h3 { margin-top: 0; }
.todo-three .acceptance { display: grid; gap: .75rem; padding: 0; list-style: none; }
.todo-three .acceptance li { padding: .75rem; border-radius: .5rem; background: var(--nala-ui-color-surface-muted); }
.todo-three .acceptance label { display: flex; align-items: baseline; gap: .75rem; }
.todo-three .acceptance input { flex-shrink: 0; accent-color: var(--nala-ui-color-accent); }
.todo-three .chapter-links { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; margin: 1.5rem 0; padding: 1rem 0; border-top: 1px solid var(--nala-ui-color-border); }
.todo-three a, .todo-three code { overflow-wrap: anywhere; }
.todo-three :is(a, button, summary, input):focus-visible { outline: 3px solid var(--nala-ui-color-accent); outline-offset: 3px; }
@media (min-width: 760px) { .todo-three .outcome-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; } }
`;
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
        note: "Add the stylesheet link"
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
            note: "Keep the Chapter 2 interface"
          }
        ]
      },
      {
        id: "styles",
        name: "styles.css",
        kind: "file",
        note: "New: page appearance and layout"
      },
      {
        id: "dist",
        name: "dist",
        kind: "folder",
        children: [
          {
            id: "javascript",
            name: "main.js",
            kind: "file",
            note: "Still generated by Deno"
          }
        ]
      }
    ]
  }
];
defineComponent("docs-todo-chapter-three", {
  styles,
  template: ()=>html`
      <article class="docs-page todo-three">
        <header class="chapter-hero">
          <p class="page-eyebrow">Start here · Chapter 3 of 3</p>
          <h1>${chapterThree.title}</h1>
          <p class="page-lead">${chapterThree.lead}</p>
          <ul class="chapter-promises" aria-label="Chapter outcomes">
            <li>One separate stylesheet</li>
            <li>Layouts that can wrap</li>
            <li>Visible keyboard focus</li>
          </ul>
          <p>Chapter 2 gave your task page real labels and controls. Now you will style that same page without changing what its controls mean or pretending that they save tasks.</p>
          <aside class="lesson-note" aria-label="Before you begin">
            <p><strong>Bring:</strong> your Chapter 2 Nala folder, its <code>app/index.html</code> and <code>app/src/main.ts</code>, an editor, Deno and a browser. You should already be able to open <code>/app/</code>. If not, return to <a href="/start-here/todo/02">Chapter 2</a> and restore its working baseline first.</p>
            <p><strong>Learn:</strong> how an HTML page loads a separate CSS file, how a few layout rules adapt to screen width, and how to keep keyboard focus visible.</p>
            <p><strong>Good pause points:</strong> after adding the stylesheet link, after the layout fits at both widths, or after the keyboard check. Your files stay on disk; this page's checklist does not. If you stop the development server, start it again before returning to <code>/app/</code>.</p>
          </aside>
          <a href="#step-1">Give the page its visual layer →</a>
        </header>

        <nav class="chapter-links" aria-label="Chapter navigation">
          <a rel="prev"
            href="/start-here/todo/02">Previous: Build the semantic interface</a>
          <a href="/start-here/todo">Book contents</a>
          <a href="/demo-apps/nala-documentation/LEGACY-TODO-CHAPTER-SYNOPSES.md"
            target="_blank" rel="noopener">Legacy chapter synopses</a>
        </nav>

        <nala-page-outline label="On this page">
          <ol>
            <li><a href="#step-1">Link a stylesheet</a></li>
            <li><a href="#step-2">Set a visual foundation</a></li>
            <li><a href="#step-3">Lay out the task page</a></li>
            <li><a href="#step-4">Adapt and check</a></li>
          </ol>
        </nala-page-outline>

        <div class="chapter-body">
          <section class="chapter-step" id="step-1">
            <div class="step-heading"><span class="step-number" aria-hidden="true">1</span><h2>Link a stylesheet without replacing your page</h2></div>
            <p>Keep the Chapter 2 task markup and TypeScript. The only HTML change is a <code>link</code> element in the document head:</p>
            ${renderCodeExample(chapterThreeHtmlExcerpt, "html")}
            <p>The browser reads this link and requests <code>/app/styles.css</code> from the same development server. Create <code>app/styles.css</code> as an empty file in the same edit so the request succeeds; you will add its first rules in Step 2. CSS is a text file the browser understands directly, so it does not need Deno to transpile it. The existing script link still points to <code>/app/dist/main.js</code>; leave it alone.</p>
            <div class="outcome-grid">
              <section class="lesson-panel">
                <h3>Before: your Chapter 2 files</h3>
                <p>The markup and generated script already make a static, labeled task interface.</p>
                <nala-code-workspace label="Chapter 3 starting files" .files=${chapterThreeStartingFiles}></nala-code-workspace>
              </section>
              <section class="lesson-panel">
                <h3>After: one new file and one link</h3>
                <p><code>main.ts</code> stays unchanged. You add a stylesheet and connect it to the HTML page.</p>
                <nala-file-tree label="The Chapter 3 app folder" .entries=${fileTree}></nala-file-tree>
              </section>
            </div>
            <aside class="lesson-note">
              <p><strong>Check the connection:</strong> after the first save, open <code>/app/</code> and use the browser's Network panel. The request for <code>/app/styles.css</code> should succeed. A missing-file response usually means the file name or link path does not match.</p>
            </aside>
          </section>

          <section class="chapter-step" id="step-2">
            <div class="step-heading"><span class="step-number" aria-hidden="true">2</span><h2>Give the page a visual foundation</h2></div>
            <p>Start <code>app/styles.css</code> with these page-wide choices. This first milestone is a complete, valid stylesheet; save it and refresh <code>/app/</code> to see the colors and control styling take effect.</p>
            ${renderCodeExample(chapterThreeFoundationStyles.trimEnd(), "css")}
            <h3>Choose a small palette once</h3>
            ${renderCodeExample(chapterThreeStyleExcerpts.tokens, "css")}
            <p><code>:root</code> selects the document's root element. The CSS custom properties beginning with <code>--task-</code> are named color values, so several rules can share the same canvas, surface, ink, accent and highlight colors. Values such as <code>#f2f0e8</code> use hexadecimal color notation. <code>var(--task-accent)</code> reads one of those values; change the token once and every rule that uses it follows. <code>color-scheme: light</code> asks the browser to use its light palette for native controls, and the font-family becomes the default text face.</p>
            ${renderCodeExample(chapterThreeStyleExcerpts.baseRules, "css")}
            <p>The universal <code>*</code> selector reaches every element. <code>box-sizing: border-box</code> makes a declared width include padding and borders, which makes later sizing easier to reason about. The body margin reset removes the browser's default outer gap; the two background gradients make a subtle grid. The link rules add color while keeping the underline, with a little extra space between the text and line.</p>
            <h3>Let native controls keep their behavior</h3>
            ${renderCodeExample(chapterThreeStyleExcerpts.controls, "css")}
            <p>These selectors give buttons, text fields and menus a shared surface, border, padding and text color; <code>min-width: 0</code> and <code>max-width: 100%</code> also help them fit inside a narrow parent. They remain native controls: CSS does not make them filter tasks or add task logic.</p>
            ${renderCodeExample(chapterThreeStyleExcerpts.controlStates, "css")}
            <p><code>font: inherit</code> keeps control text in step with the page. The hover and disabled rules change a button's appearance; the HTML <code>disabled</code> attribute is what actually prevents interaction. None of these visual rules change what happens when you submit the form or toggle a checkbox.</p>
            <aside class="lesson-note">
              <p><strong>What CSS cannot do here:</strong> typing in Search still does not filter the sample tasks, and checking a task still does not update the fixed summary. Styling changes presentation, not the application behavior from Chapter 2.</p>
            </aside>
          </section>

          <section class="chapter-step" id="step-3">
            <div class="step-heading"><span class="step-number" aria-hidden="true">3</span><h2>Lay out the page so its parts can shrink and wrap</h2></div>
            <p>Append these five groups to the stylesheet in order. Each group is a complete set of CSS rules; together they style the same static interface as reference Project 03.</p>
            ${renderCodeExample(chapterThreeLayoutAdditions[0].trim(), "css")}
            <p>This banner belongs to the reference project's checkpoint wrapper around the app. It has no matching element in the tutorial's <code>app/index.html</code>, so these rules do not change your app page; they let the shared stylesheet also style the checkpoint page.</p>
            ${renderCodeExample(chapterThreeLayoutAdditions[1].trim(), "css")}
            <p><code>min(54rem, calc(100% - 2rem))</code> chooses the smaller of a comfortable maximum width and the space left after two gutters. The auto side margins center that shell. The header uses Flexbox to place the title and completion meter at opposite ends, while <code>clamp()</code> lets the heading grow between a minimum and maximum size. The <code>.eyebrow</code> rule makes the small page label stand apart.</p>
            ${renderCodeExample(chapterThreeLayoutAdditions[2].trim(), "css")}
            <p>The completion meter and progress bar sit beside the heading on wide screens. The task panel creates the white surface, border and shadow; its heading and note get their own spacing. The progress element remains native, and its fixed value still does not respond to checkbox clicks.</p>
            ${renderCodeExample(chapterThreeLayoutAdditions[3].trim(), "css")}
            <p>The add form uses CSS Grid for its wide-screen field-and-button columns. The toolbar and filter buttons use Flexbox; the search and sort controls can wrap as space gets tight. <code>.grow</code> can take spare room, while <code>min-width: 0</code> lets it shrink below its text's natural width.</p>
            ${renderCodeExample(chapterThreeLayoutAdditions[4].trim(), "css")}
            <p>The task list removes the browser's default bullets and indentation, then gives each row a top border to separate it from the one above. The <code>.completed</code> class styles the checked sample row, and the footer keeps its summary and button together. <code>.sr-only</code> visually hides the form label without removing its accessible name.</p>
            <p>Refresh at a wide width. The shell should stop growing while remaining centered; the form fields and task list should stay inside it.</p>
          </section>

          <section class="chapter-step" id="step-4">
            <div class="step-heading"><span class="step-number" aria-hidden="true">4</span><h2>Adapt to a small screen and test focus</h2></div>
            <p>Append the last block. A <strong>media query</strong> asks the browser to use enclosed rules only when a condition is true. At <code>38rem</code> or less, these rules stack the header and form, let toolbar controls use the available width, and reduce the side padding around task rows. The second query responds to a reduced-motion preference.</p>
            ${renderCodeExample(chapterThreeResponsiveAddition, "css")}
            <h3>Check the keyboard's location</h3>
            <p>The <code>:focus-visible</code> rule from the previous step draws its outline outside the control, so it does not take up layout space. Pressing Tab moves through the native controls and lets you see that rule work without changing the way clicks behave.</p>
            <p>The second media query checks whether the browser reports a reduced-motion preference, often set in the operating system's accessibility settings. It resets smooth scrolling if another page rule enables it. This chapter does not add smooth scrolling, so the query may make no visible difference yet; it is not a promise to disable every animation.</p>
            <nala-process-flow label="Check the same task page at two widths" .steps=${[
      {
        id: "narrow",
        title: "Use a narrow viewport",
        location: "Browser · 360 × 800",
        description: "The small-screen rules apply.",
        input: "The same task markup",
        action: "Browser: calculate available widths and wrap flex rows.",
        output: "Controls fit without horizontal page scrolling."
      },
      {
        id: "wide",
        title: "Use a wide viewport",
        location: "Browser · 1440 × 900",
        description: "The shell reaches its maximum width.",
        input: "The same task markup",
        action: "Browser: center the bounded page shell.",
        output: "The content stays readable instead of stretching edge to edge."
      },
      {
        id: "keyboard",
        title: "Press Tab",
        location: "Browser · keyboard",
        description: "Focus moves through native controls.",
        input: "The New task field and buttons",
        action: "Browser: move focus; CSS draws the outline.",
        output: "The active control has a visible focus ring."
      }
    ]}></nala-process-flow>
            <ol>
              <li>At <strong>360 × 800</strong>, check that the page has no horizontal scrollbar and all controls remain visible.</li>
              <li>At <strong>1440 × 900</strong>, check that the content is centered and does not fill the entire width.</li>
              <li>Reload, press <kbd>Tab</kbd>, and look for the accent outline around each focused control.</li>
            </ol>
            <p>The checkboxes may change their own checked appearance, but task counts stay fixed. Those are still the Chapter 2 controls; you have changed only their presentation.</p>
          </section>

          <aside class="lesson-note">
            <p><strong>Your finishing files:</strong> your complete app now has the linked HTML, the unchanged Chapter 2 TypeScript, and the new stylesheet. The output JavaScript still comes from the earlier transpile step; do not edit it.</p>
          </aside>
          <nala-code-workspace label="Chapter 3 finished app files"
            .files=${chapterThreeFinishedFiles}></nala-code-workspace>
          <section class="readiness" aria-labelledby="readiness-title">
            <h3 id="readiness-title">Ready to continue?</h3>
            <p>This checklist resets when you leave the page. Tick an item only after you have seen it in your own app.</p>
            <ul class="acceptance">
              <li><label><input type="checkbox"><span>I linked <code>app/styles.css</code> and left the Chapter 2 script path in place.</span></label></li>
              <li><label><input type="checkbox"><span>The stylesheet changed presentation but did not make Search, Sort or the task counts functional.</span></label></li>
              <li><label><input type="checkbox"><span>The page fit at 360 × 800 and stayed bounded at 1440 × 900.</span></label></li>
              <li><label><input type="checkbox"><span>Keyboard focus remained visible after I pressed Tab.</span></label></li>
            </ul>
          </section>
          <section class="lesson-panel" aria-labelledby="transfer-title">
            <h3 id="transfer-title">Your turn · try a different accent</h3>
            <p>Change only <code>--task-accent</code> in <code>app/styles.css</code>. Save, refresh, and compare a link, checkbox and keyboard focus outline. Choose a color that remains easy to distinguish against the page. Then restore the original value and refresh again.</p>
          </section>
          </section>
          <section id="reference-comparison" aria-labelledby="reference-title">
            <h2 id="reference-title">Reference project 03: the exact checkpoint</h2>
            <p>The finished <code>main.ts</code> and <code>styles.css</code> shown above are the files used by Project 03. Its surrounding checkpoint page adds a banner and uses project-specific asset URLs; your app uses the <code>/app/</code> paths introduced in this chapter. In both places, the native controls remain static and do not update the task list or counts.</p>
            <p><a href="/demo-apps/core-todo-tutorial/checkpoints/03/" target="_blank" rel="noopener">Open reference project 03</a> · <a href="/demo-apps/core-todo-tutorial/checkpoints/03/README.md" target="_blank" rel="noopener">Read project commands</a></p>
            <p><button type="button" data-reference-preview aria-expanded="false" aria-controls="chapter-three-reference-preview">Load optional reference preview</button></p>
            <div id="chapter-three-reference-preview"></div>
          </section>
        </div>
        <nav class="chapter-links" aria-label="Chapter navigation">
          <a rel="prev"
            href="/start-here/todo/02">Previous: Build the semantic interface</a>
          <a href="/start-here/todo">Book contents</a>
        </nav>
      </article>
    `,
  onConnect (context) {
    const button = context.query("[data-reference-preview]");
    const preview = context.query("#chapter-three-reference-preview");
    if (!button || !preview) {
      throw new Error("Chapter 3 reference preview controls are missing.");
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
      frame.title = "Reference project 03: responsive styling";
      frame.src = "/demo-apps/core-todo-tutorial/checkpoints/03/";
      preview.append(frame);
      button.textContent = "Close reference preview";
      button.setAttribute("aria-expanded", "true");
    });
  }
});
