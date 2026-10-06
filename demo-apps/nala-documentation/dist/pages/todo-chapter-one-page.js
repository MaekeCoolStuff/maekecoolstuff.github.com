import { defineComponent, html } from "../../../../vendor/components/dist/index.js";
import { renderCodeExample } from "./code-example.js";
import { chapterOneCommands, chapterOneHtml, chapterOneHtmlExcerpts, chapterOneMain, chapterOneMainExcerpts, chapterOneTransfer, sourceLines } from "./todo-book/chapter-one.js";
const startupSteps = [
  {
    id: "source",
    title: "Write TypeScript source",
    location: "Your editor",
    description: "Save the instructions you want the browser to run.",
    input: "The complete startup code in step 6",
    action: "You: write app/src/main.ts in your editor and save it.",
    output: "app/src/main.ts",
    boundary: "Saving source does not update generated JavaScript."
  },
  {
    id: "check",
    title: "Check",
    location: "Deno · Terminal 1",
    description: "Validate the source against TypeScript's rules.",
    input: "app/src/main.ts + deno.json",
    action: chapterOneCommands.split("\n")[0],
    output: "Type diagnostics, if any",
    boundary: "Does not emit JavaScript or display a page. Continue only if checking succeeds."
  },
  {
    id: "compile",
    title: "Transpile",
    location: "Deno · Terminal 1",
    description: "Write the browser-ready JavaScript file.",
    input: "app/src/main.ts",
    action: chapterOneCommands.split("\n")[1],
    output: "app/dist/main.js",
    boundary: "Does not run the app or start the server."
  },
  {
    id: "output",
    title: "Generated JavaScript is ready",
    location: "Your filesystem",
    description: "The emitted file now exists on disk. Your HTML points the browser to this file.",
    input: "app/index.html → /app/dist/main.js",
    action: "You: confirm app/dist/main.js exists and the HTML script src points to /app/dist/main.js. Do not edit the output.",
    output: "Files ready to serve",
    boundary: "Files on disk are not yet an executing page. Edit source, not this output."
  },
  {
    id: "serve",
    title: "Serve over HTTP",
    location: "Deno · Terminal 2",
    description: "Respond to the browser's requests with HTML and JavaScript.",
    input: "Files on disk",
    action: "You: run deno run -A tools/dev-server.ts in Terminal 2, or keep your existing server running.",
    output: "HTTP responses from your local origin",
    boundary: "Does not compile source. Keep this terminal running."
  },
  {
    id: "browser",
    title: "Load and execute",
    location: "Your browser",
    description: "Parse HTML, load its module and execute startup to attach the visible nodes.",
    input: "HTML + main.js responses",
    action: "You: open /app/ on the server's printed origin, or reload it. Automatically: the browser loads main.js and runs root.append(heading, report).",
    output: "Heading and module-URL report",
    boundary: "The browser runs generated JavaScript, not app/src/main.ts."
  }
];
const compileTranscript = [
  {
    id: "check",
    command: chapterOneCommands.split("\n")[0],
    output: "Check app/src/main.ts",
    note: "A successful check returns to the prompt. Cached checks may print less; no reported error is the important signal. It does not create main.js."
  },
  {
    id: "compile",
    command: chapterOneCommands.split("\n")[1],
    note: "Run only after checking succeeds. A warning that transpile is experimental is not failure. Confirm app/dist/main.js exists, then keep this terminal available for your next edit."
  }
];
const typeErrorTranscript = [
  {
    id: "check-fails",
    command: chapterOneCommands.split("\n")[0],
    output: "Check app/src/main.ts\nTS2322 [ERROR]: Type 'number' is not assignable to type 'string'.\nheading.textContent = 42;\n~~~~~~~~~~~~~~~~~~~\n    at file:///…/app/src/main.ts:8:1\n\nerror: Type checking failed.",
    note: "Check refuses. TS2322 is the error code, the message names both types, the tildes underline the problem, and :8:1 means line 8, column 1."
  },
  {
    id: "transpile-anyway",
    command: chapterOneCommands.split("\n")[1],
    output: "Emit app/dist/main.js",
    note: "Transpile does not check types. It removes TypeScript syntax and writes the file anyway, so app/dist/main.js now contains heading.textContent = 42;"
  }
];
const cloneTranscript = [
  {
    id: "clone",
    command: "git clone https://github.com/MaekeCoolStuff/Nala.git\ncd Nala"
  }
];
const unixInstallTranscript = [
  {
    id: "install-unix",
    command: "curl -fsSL https://deno.land/install.sh | sh"
  }
];
const windowsInstallTranscript = [
  {
    id: "install-windows",
    command: "irm https://deno.land/install.ps1 | iex"
  }
];
const manualPathTranscript = [
  {
    id: "manual-path",
    command: 'chmod +x "$HOME/.deno/bin/deno"\nexport PATH="$HOME/.deno/bin:$PATH"\ndeno --version'
  }
];
const toolsTranscript = [
  {
    id: "version",
    command: "deno --version",
    note: "Prints three lines: deno, v8 and typescript, each with a version. Expect Deno 2.9.7 or a newer Deno 2 release."
  },
  {
    id: "transpile-help",
    command: "deno transpile --help",
    note: "Prints usage help for transpile. An unrecognized-subcommand error means Deno needs updating."
  }
];
const unixPortTranscript = [
  {
    id: "port-unix",
    command: "PORT=8087 deno run -A tools/dev-server.ts"
  }
];
const windowsPortTranscript = [
  {
    id: "port-windows",
    command: '$env:PORT = "8087"; deno run -A tools/dev-server.ts'
  }
];
const serverTranscript = [
  {
    id: "serve",
    command: "deno run -A tools/dev-server.ts",
    note: "The server prints a listening address and keeps running rather than returning to the prompt. Open /app/ on that origin. A port error is not success; use the alternative below. Ctrl+C stops this server."
  }
];
const appWatchTranscript = [
  {
    id: "watch-app",
    command: "deno task dev:watch:app",
    note: "Run from the repository root after app/index.html and app/src/main.ts exist. This starts the app server and the app watcher together."
  }
];
const unixAppWatchPortTranscript = [
  {
    id: "watch-app-port-unix",
    command: "PORT=8087 deno task dev:watch:app"
  }
];
const windowsAppWatchPortTranscript = [
  {
    id: "watch-app-port-windows",
    command: '$env:PORT = "8087"; deno task dev:watch:app'
  }
];
const fileMap = [
  {
    id: "app",
    name: "app",
    kind: "folder",
    children: [
      {
        id: "html",
        name: "index.html",
        kind: "file",
        note: "You write this"
      },
      {
        id: "src",
        name: "src",
        kind: "folder",
        children: [
          {
            id: "source",
            name: "main.ts",
            kind: "file",
            note: "You write this"
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
            note: "Generated in step 7"
          }
        ]
      }
    ]
  }
];
const startingFiles = [
  {
    name: "app/.gitkeep",
    language: "text",
    code: ""
  }
];
const finishedFiles = [
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
const styles = `
docs-todo-chapter-one { display: block; min-width: 0; }
.todo-one { --lesson-gap: clamp(1.25rem, 3vw, 2.5rem); }
.todo-one *, .todo-one *::before, .todo-one *::after { box-sizing: border-box; }
.todo-one .chapter-hero {
  padding: var(--lesson-gap);
  border: 1px solid var(--nala-ui-color-border);
  border-radius: 1rem;
  background: var(--nala-ui-color-surface);
}
.todo-one .chapter-hero h1 { margin-top: .5rem; max-width: 100%; }
.todo-one .chapter-hero .page-lead { max-width: 62ch; }
.todo-one .chapter-promises { display: flex; flex-wrap: wrap; gap: .5rem; padding: 0; list-style: none; }
.todo-one .chapter-promises li { padding: .35rem .75rem; border-radius: 2rem; background: var(--nala-ui-color-accent-soft); font-size: .85rem; }
.todo-one .chapter-body { margin-top: var(--lesson-gap); }
.todo-one nala-page-outline { --nala-page-outline-top: 5.25rem; }
.todo-one nala-page-outline ol { display: grid; gap: .15rem; }
.todo-one nala-page-outline li { padding-left: .25rem; }
.todo-one nala-page-outline li::marker { color: var(--nala-ui-color-text-muted); font-weight: 700; }
.todo-one nala-page-outline a { display: block; padding: .3rem .5rem; border-radius: .4rem; text-decoration: none; }
.todo-one nala-page-outline a:hover { background: var(--nala-ui-color-surface-muted); text-decoration: underline; }
.todo-one .chapter-body, .todo-one .chapter-body > *, .todo-one .choice-grid > * { min-width: 0; }
.todo-one .chapter-step { margin: 0 0 3rem; scroll-margin-top: 6rem; }
.todo-one .step-heading { display: flex; align-items: baseline; gap: .75rem; margin-bottom: 1rem; }
.todo-one .step-heading h2 { margin: 0; font-size: clamp(1.35rem, 2.5vw, 1.75rem); }
.todo-one .step-number { display: inline-grid; place-items: center; flex: 0 0 2rem; height: 2rem; border-radius: 50%; background: var(--nala-ui-color-accent); color: var(--nala-ui-color-surface); font: 700 .9rem/1 sans-serif; }
.todo-one .choice-grid { display: grid; gap: 1rem; margin: 1rem 0; }
.todo-one .lesson-panel { padding: 1.1rem; border: 1px solid var(--nala-ui-color-border); border-radius: .75rem; background: var(--nala-ui-color-surface); }
.todo-one .chapter-step > .lesson-panel { margin: 1rem 0; }
.todo-one .lesson-panel h3 { margin-top: 0; }
.todo-one .lesson-panel > :last-child { margin-bottom: 0; }
.todo-one .lesson-note { margin: 1.25rem 0; border-left: 3px solid var(--nala-ui-color-accent); padding: .5rem 1rem; background: var(--nala-ui-color-surface-muted); }
.todo-one .lesson-note p { margin: .5rem 0; }
.todo-one .file-label { margin: 1.25rem 0 .5rem; font-size: .85rem; font-weight: 700; color: var(--nala-ui-color-text-muted); }
.todo-one nala-code-block { margin: .75rem 0 1.25rem; }
.todo-one nala-code-workspace { margin: 1rem 0 1.5rem; }
.todo-one details { margin: 1rem 0; border: 1px solid var(--nala-ui-color-border); border-radius: .75rem; padding: 1rem; background: var(--nala-ui-color-surface); }
.todo-one summary { cursor: pointer; font-weight: 700; }
.todo-one details[open] > summary { margin-bottom: 1rem; }
.todo-one .code-walk { margin: 1.5rem 0; }
.todo-one .code-walk h3 { margin: 1.75rem 0 .5rem; font-size: 1rem; }
.todo-one .code-walk h3:first-child { margin-top: 0; }
.todo-one .code-walk p { margin: .6rem 0 1.25rem; }
.todo-one .startup-preview { padding: 1.5rem; border: 1px dashed var(--nala-ui-color-accent); border-radius: .75rem; background: var(--nala-ui-color-surface); }
.todo-one .startup-preview h3 { margin-top: 0; }
.todo-one .startup-preview p { overflow-wrap: anywhere; }
.todo-one :is(nala-process-flow, nala-terminal-transcript) { margin: 1.25rem 0; }
.todo-one .visual-lesson { margin: 1.5rem 0; }
.todo-one .visual-lesson figcaption { font-size: .85rem; color: var(--nala-ui-color-text-muted); }
.todo-one .dom-state { display: grid; gap: .65rem; padding: 1rem; border: 1px dashed var(--nala-ui-color-border); border-radius: .5rem; background: var(--nala-ui-color-surface-muted); }
.todo-one .dom-state code { display: block; padding: .5rem; border: 1px solid var(--nala-ui-color-border); border-radius: .35rem; background: var(--nala-ui-color-surface); }
.todo-one .dom-state .dom-child { margin-left: 1rem; border-left: 3px solid var(--nala-ui-color-accent); }
.todo-one .response-meta { display: grid; grid-template-columns: 6rem minmax(0, 1fr); gap: .5rem; font-size: .85rem; }
.todo-one .response-meta dt { font-weight: 700; }
.todo-one .response-meta dd { margin: 0; overflow-wrap: anywhere; }
.todo-one .readiness { padding: 1.25rem; border: 1px solid var(--nala-ui-color-border); border-radius: .75rem; background: var(--nala-ui-color-surface); }
.todo-one .readiness h3 { margin-top: 0; }
.todo-one .acceptance { display: grid; gap: .75rem; padding: 0; list-style: none; }
.todo-one .acceptance li { padding: .75rem; border-radius: .5rem; background: var(--nala-ui-color-surface-muted); }
.todo-one .acceptance small { display: block; margin-top: .25rem; color: var(--nala-ui-color-text-muted); }
.todo-one .acceptance label { display: flex; align-items: baseline; gap: .75rem; }
.todo-one .acceptance input { flex-shrink: 0; accent-color: var(--nala-ui-color-accent); }
.todo-one .chapter-links { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; margin: 1.5rem 0; padding: 1rem 0; border-top: 1px solid var(--nala-ui-color-border); }
.todo-one a, .todo-one code { overflow-wrap: anywhere; }
.todo-one button { padding: .65rem 1rem; border: 1px solid var(--nala-ui-color-border); border-radius: .5rem; background: var(--nala-ui-color-surface-muted); color: var(--nala-ui-color-text); cursor: pointer; font: inherit; }
.todo-one button:disabled { cursor: wait; }
.todo-one :is(a, button, summary, input):focus-visible { outline: 3px solid var(--nala-ui-color-accent); outline-offset: 3px; }
.todo-one iframe { display: block; width: 100%; height: 20rem; margin-top: 1rem; border: 1px solid var(--nala-ui-color-border); border-radius: .5rem; background: white; }
@media (min-width: 760px) {
  .todo-one .choice-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
`;
defineComponent("docs-todo-chapter-one", {
  styles,
  template: ()=>html`
      <article class="docs-page todo-one">
        <header class="chapter-hero">
          <p class="page-eyebrow">Start here · Chapter 1 of 3</p>
          <h1>From TypeScript source to the browser</h1>
          <p
            class="page-lead">Make this project yours. Start with a fresh download, write two small files, and watch the browser load the JavaScript you created.</p>
          <ul class="chapter-promises" aria-label="Chapter outcomes">
            <li>Your own app folder</li>
            <li>Two complete files</li>
            <li>No checkpoint copying</li>
          </ul>
          <p>Start with an empty app folder and make each file yourself. You do not need to inspect a finished task manager or copy a checkpoint to follow along.</p>
          <aside class="lesson-note" aria-label="Before you begin">
            <p><strong>Bring:</strong> an editor, a browser and permission to install a development tool. Recognizing HTML tags and JavaScript variables helps; you do not need Nala experience. If those ideas are entirely new, visit the <a href="/typescript">local TypeScript learning path</a> alongside this lesson.</p>
            <p><strong>Learn:</strong> how the code you write becomes a page in the browser, how to check that each step worked, and how to find out what went wrong if the page does not load. Installation time varies; work at your own pace.</p>
            <p><strong>Good pause points:</strong> after step 3 (tools ready), step 7 (output generated), or step 9 (browser verified). Save your files. To resume, reopen this repository and restart the server if you stopped it; your code remains on disk, but the checklist is not saved.</p>
          </aside>
          <a href="#step-1">Let's build your first page →</a>
        </header>
        <nav class="chapter-links" aria-label="Chapter navigation">
          <a href="/start-here/todo">Book contents</a>
          <a rel="next" href="/start-here/todo/02">Next: Semantic HTML</a>
        </nav>
        <nala-page-outline label="On this page">
          <ol>
            <li><a href="#step-1">Get Nala</a></li>
            <li><a href="#step-2">Install Deno</a></li>
            <li><a href="#step-3">Check your tools</a></li>
            <li><a href="#step-4">Claim app/</a></li>
            <li><a href="#step-5">Write HTML</a></li>
            <li><a href="#step-6">Write startup</a></li>
            <li><a href="#step-7">Check and compile</a></li>
            <li><a href="#step-8">Serve your page</a></li>
            <li><a href="#step-9">Prove it works</a></li>
            <li><a href="#step-10">Finish and compare</a></li>
          </ol>
        </nala-page-outline>
        <div class="chapter-body">
          <section class="chapter-step" id="step-1">
            <div
              class="step-heading"><span class="step-number" aria-hidden="true">1</span><h2>Get your own copy of Nala</h2></div>
            <p>You need an editor, a modern browser and a terminal. A terminal is a window where you tell your computer which program to run. Blocks labelled <strong>Terminal</strong> belong there, not in the browser Console.</p>
            <p>Choose <em>one</em> way to get the repository. Both give you the same application files.</p>
            <div class="choice-grid">
              <section class="lesson-panel">
                <h3>Have Git? Clone it.</h3>
                <p>Open a terminal in the parent directory where you keep projects.</p>
                <nala-terminal-transcript compact label="Terminal"
                  .entries=${cloneTranscript}></nala-terminal-transcript>
                <p><code>git clone</code> downloads the files and their history into a new Nala directory. <code>cd Nala</code> moves your terminal into it. Later relative paths start from here.</p>
                <a href="https://git-scm.com/downloads" target="_blank"
                  rel="noopener">Download Git</a>
              </section>
              <section class="lesson-panel">
                <h3>No Git? Download the ZIP.</h3>
                <ol>
                  <li><a href="https://github.com/MaekeCoolStuff/Nala" target="_blank" rel="noopener">Open the Nala repository</a>.</li>
                  <li>Choose <strong>Code → Download ZIP</strong>.</li>
                  <li>Extract it; do not edit inside the compressed archive.</li>
                  <li>Open the extracted folder (often <code>Nala-main</code>) in your editor and open its integrated terminal.</li>
                </ol>
                <p>Alternatively, use <code>cd</code> followed by the extracted folder's path in quotes. The ZIP has no Git history; you do not need that history to build the app.</p>
              </section>
            </div>
            <aside class="lesson-note">
              <p><strong>Before moving on:</strong> find <code>deno.json</code>, <code>vendor</code>, <code>tools</code> and <code>app</code> directly inside your open folder. If there is another Nala folder inside it, open that inner folder. This is the <em>repository root</em>.</p>
            </aside>
          </section>

          <section class="chapter-step" id="step-2">
            <div
              class="step-heading"><span class="step-number" aria-hidden="true">2</span><h2>Install Deno, not another application framework</h2></div>
            <p>Deno is our development tool: it checks TypeScript, emits JavaScript and runs the local server. The browser still runs ordinary JavaScript modules. One tool is enough; we do not need <code>npm</code>, <code>node_modules</code> or a bundler to start.</p>
            <p>This walkthrough was verified with <strong>Deno 2.9.7</strong>. Use that version or a compatible newer Deno 2 release with <code>deno transpile</code>. Choose the instructions for your operating system below.</p>
            <details>
              <summary>macOS or Linux · Terminal / shell</summary>
              <p class="file-label">Terminal · macOS or Linux only</p>
              <nala-terminal-transcript compact
                label="Terminal · macOS or Linux only"
                .entries=${unixInstallTranscript}></nala-terminal-transcript>
              <p><code>curl</code> downloads the official installer. The pipe <code>|</code> passes it to <code>sh</code> to execute. Run installation scripts only from sources you trust. Prefer not to run a remote script? Use the manual download below.</p>
              <p>On macOS, if you already use Homebrew, <code>brew install deno</code> is an alternative. Do not install twice. On Linux, follow the installer's PATH instructions.</p>
              <p><strong>PATH</strong> is the list of directories your terminal searches for commands. Without Deno's bin directory there, Deno can be installed while the command still says “not found”.</p>
            </details>
            <details>
              <summary>Windows · PowerShell</summary>
              <p>Open PowerShell, not Windows Command Prompt, and use the official installer:</p>
              <p class="file-label">Terminal · Windows PowerShell only</p>
              <nala-terminal-transcript compact
                label="Terminal · Windows PowerShell only"
                .entries=${windowsInstallTranscript}></nala-terminal-transcript>
              <p><code>irm</code> is <code>Invoke-RestMethod</code>: it downloads the script. <code>iex</code> is <code>Invoke-Expression</code>: it executes it. This is a deliberate trust decision, not a command to paste from an arbitrary website.</p>
              <p>If Windows Package Manager is already available, <code>winget install DenoLand.Deno</code> is another option. Choose one method. The normal per-user script installation does not need an administrator shell.</p>
            </details>
            <details>
              <summary>Prefer a manual download? · Any platform</summary>
              <p><a href="https://github.com/denoland/deno/releases" target="_blank" rel="noopener">Download an official release ZIP</a> matching your OS and CPU:</p>
              <ul>
                <li><code>apple-darwin</code>: macOS; <code>aarch64</code> for Apple Silicon, <code>x86_64</code> for Intel.</li>
                <li><code>unknown-linux-gnu</code>: Linux; choose ARM64 (<code>aarch64</code>) or Intel/AMD 64-bit (<code>x86_64</code>).</li>
                <li><code>pc-windows-msvc</code>: Windows; choose the same CPU distinction.</li>
              </ul>
              <p>This alternative needs an extra setup step: making the extracted executable discoverable as <code>deno</code>. Matching SHA-256 checksum files are available for verifying downloads.</p>
              <p><strong>macOS/Linux:</strong> create <code>.deno/bin</code> inside your home folder and place the extracted <code>deno</code> there. Run these commands to grant execution permission and make it discoverable in this terminal:</p>
              <nala-terminal-transcript compact
                label="Terminal · macOS or Linux manual setup"
                .entries=${manualPathTranscript}></nala-terminal-transcript>
              <p>The quoted path protects folder names containing spaces. <code>$HOME</code> names your home directory; <code>export</code> updates this terminal's command search path. To keep it across new terminals, add that export line once to your shell's startup file (commonly <code>~/.zshrc</code> for zsh or <code>~/.bashrc</code> for interactive bash on Linux). If you do not know your shell, use the official installer path above instead.</p>
              <p><strong>Windows:</strong> create a <code>.deno\\bin</code> folder inside your user profile and put <code>deno.exe</code> there. Search Windows settings for “Edit environment variables for your account”. Edit the user <strong>Path</strong>, add the absolute directory containing <code>deno.exe</code> (for example <code>C:\\Users\\Alex\\.deno\\bin</code>; replace Alex with your own username), confirm the dialogs and reopen PowerShell. Run <code>deno --version</code> to verify. Add the folder, not the executable filename; do not replace existing Path entries.</p>
            </details>
            <p><a href="https://docs.deno.com/runtime/getting_started/installation/" target="_blank" rel="noopener">Official Deno installation instructions</a></p>
            <aside class="lesson-note">
              <p><strong>What needs internet?</strong> Acquiring the repository and tool does. The app's runtime examples and assets are local. Later tests import <code>jsr:@std/assert</code>; their first run needs internet or a prepared Deno cache. The repo does not secretly include Deno or every test dependency.</p>
            </aside>
          </section>

          <section class="chapter-step" id="step-3">
            <div
              class="step-heading"><span class="step-number" aria-hidden="true">3</span><h2>Confirm the tools before writing code</h2></div>
            <p>Reopen your terminal after installation so it picks up any changed PATH. At the repository root, run:</p>
            <nala-terminal-transcript label="Terminal 1 · check your tools"
              directory="Repository root"
              .entries=${toolsTranscript}></nala-terminal-transcript>
            <p>The first command prints Deno, V8 and TypeScript versions. Deno is the tool; V8 is the engine that runs JavaScript inside it (Chrome uses the same one); TypeScript is the version of the TypeScript checker built into Deno. The second confirms your installation provides the compilation command we will use.</p>
            <aside class="lesson-note">
              <p><strong>If the command is not found:</strong> fix installation/PATH now, not application code. The script normally installs into <code>~/.deno/bin</code> on macOS/Linux or your user profile's <code>.deno/bin</code> on Windows. An unknown <code>transpile</code> command means Deno needs updating, not that <code>package.json</code> is missing.</p>
            </aside>
            <p>Open <code>deno.json</code>, but do not change it. <code>strict</code> enables stricter TypeScript checks. The DOM libraries describe browser objects such as <code>document</code> and <code>HTMLElement</code>. Task names are command shortcuts. There is no <code>npm install</code> step, and our first files need no vendor imports.</p>
          </section>

          <section class="chapter-step" id="step-4">
            <div
              class="step-heading"><span class="step-number" aria-hidden="true">4</span><h2>Claim the empty app folder</h2></div>
            <p><strong>This is where your application belongs.</strong> <code>app/</code> is intentionally empty apart from <code>.gitkeep</code>, a placeholder that lets Git retain an empty directory. It is not executed and needs no edits.</p>
            <p class="file-label">Starting files · no application code yet</p>
            <nala-code-workspace label="Chapter 1 · starting files"
              .files=${startingFiles}></nala-code-workspace>
            <div class="choice-grid">
              <div class="lesson-panel">
                <h3>You own app/</h3>
                <p>Write your application here. Leave the working examples in <code>demo-apps/</code> alone. <code>vendor/</code> holds reusable Nala packages; <code>tools/</code> holds development programs.</p>
              </div>
              <div class="lesson-panel">
                <h3>Create your two source files</h3>
                <p>Use your editor's New Folder/File actions to create <code>app/src/main.ts</code> and <code>app/index.html</code>. This works on every platform without shell-specific directory commands.</p>
              </div>
            </div>
            <section class="lesson-panel" aria-labelledby="gitkeep-title">
              <h3 id="gitkeep-title">Now remove the empty-folder placeholder</h3>
              <p><code>app/.gitkeep</code> is an empty, tracked placeholder. Git records files, not empty directories, so this file lets the starter repository keep an otherwise empty <code>app/</code> folder. It is not a setting, source file or command; nothing in your app reads or runs it.</p>
              <ol>
                <li>After creating <code>app/index.html</code> and <code>app/src/main.ts</code>, use your editor's file explorer to delete <code>app/.gitkeep</code>.</li>
                <li>Confirm the two files remain and <code>.gitkeep</code> is gone. The real application files now keep the folder present, so the placeholder has no job left.</li>
              </ol>
              <p>Removing this placeholder does not change the app or any build command. In this local copy, Git may show the tracked placeholder as deleted and your new app files as untracked; keep your application work in <code>app/</code> rather than committing it as part of Nala's starter source.</p>
            </section>
            <nala-file-tree label="File map · after compilation in step 7"
              .entries=${fileMap}></nala-file-tree>
            <p>Put HTML directly in <code>app</code>, not <code>src</code>. Do not create <code>dist</code> yet: the compiler will. HTML is already a browser language; TypeScript needs JavaScript output. Edit source, not generated output. This separation makes ownership clear.</p>
          </section>

          <section class="chapter-step" id="step-5">
              <div class="step-heading"><span class="step-number" aria-hidden="true">5</span><h2>Give the browser a front door</h2></div>
              <p>Write this <strong>entire document</strong> into <code>app/index.html</code> and save it. There is no omitted surrounding code. One empty <code>main</code> element is enough: startup will fill it.</p>
              <p class="file-label">app/index.html · complete file</p>
              ${renderCodeExample(chapterOneHtml, "html")}
              <div class="code-walk">
                <h3>Declare the document</h3>
                ${renderCodeExample(chapterOneHtmlExcerpts.document, "html")}
                <p><code>&lt;!doctype html&gt;</code> tells the browser to follow today's HTML and CSS standards. Without it, browsers switch to “quirks mode”, imitating the inconsistent behavior of 1990s browsers so very old pages still display. <code>&lt;html lang="en"&gt;</code> opens the document and declares English for assistive tools.</p>
                <h3>Describe it before displaying it</h3>
                ${renderCodeExample(chapterOneHtmlExcerpts.head, "html")}
                <p><code>head</code> groups metadata. <code>charset</code> selects UTF-8. The viewport makes layout use the device's CSS width instead of a wide virtual mobile page. <code>title</code> names the browser tab. <code>&lt;/head&gt;</code> ends metadata; <code>body</code> begins visible content.</p>
                <h3>Leave a clear mounting point</h3>
                ${renderCodeExample(chapterOneHtmlExcerpts.root, "html")}
                <p><code>main</code> identifies primary content. <code>id="app"</code> is the exact hook our script will query. <code>class="app-shell"</code> is a future styling hook; it does nothing without CSS. The closing tag leaves the element empty.</p>
                <h3>Let HTML choose the module</h3>
                ${renderCodeExample(chapterOneHtmlExcerpts.script, "html")}
                <p><code>type="module"</code> uses the native ES-module loader and waits for HTML parsing, so the root exists before startup: no <code>DOMContentLoaded</code> wrapper needed. <code>src</code> names generated JavaScript, never TypeScript. The leading slash starts at the server origin, not a future route's directory.</p>
                <h3>Close what you opened</h3>
                ${renderCodeExample(chapterOneHtmlExcerpts.close, "html")}
                <p><code>&lt;/body&gt;</code> and <code>&lt;/html&gt;</code> close the elements opened at the top. <code>main.js</code> does not exist yet. That is expected until step 7.</p>
              </div>
            </section>

          <section class="chapter-step" id="step-6">
              <div class="step-heading"><span class="step-number" aria-hidden="true">6</span><h2>Make startup small, explicit and honest</h2></div>
              <p>Write all of this into <code>app/src/main.ts</code> and save it. We are not adding a store or router before proving the browser can load our own code.</p>
              <p>Startup has three small jobs: find the root, prepare the content, then attach it. Creating a heading and putting it on the page are separate steps; let's follow that journey.</p>
              <p class="file-label">app/src/main.ts · complete file</p>
              ${renderCodeExample(chapterOneMain, "typescript")}
              <div class="code-walk">
                <h3>Make sure the page has a place for your content</h3>
                ${renderCodeExample(chapterOneMainExcerpts.find, "typescript")}
                <p><code>document</code> is the current page's DOM. <code>querySelector("#app")</code> finds the first matching element, or returns <code>null</code>. <code>const</code> fixes the binding, not the element's future content. We call it <code>candidate</code> until we know it is safe.</p>
                ${renderCodeExample(chapterOneMainExcerpts.guard, "typescript")}
                <p>The comment records <em>why</em> the guard exists. <code>instanceof HTMLElement</code> checks whether the value is an HTML element; <code>!</code> reverses the answer. <code>if</code> and its braces group the failure branch. <code>throw new Error</code> stops startup with a readable message if HTML broke the contract, rather than accepting a blank page. After the closing brace, TypeScript knows <code>candidate</code> is an <code>HTMLElement</code>.</p>
              </div>
              <aside class="lesson-note" aria-labelledby="root-boundary-title">
                <h3 id="root-boundary-title">A missing root is a stop sign</h3>
                <p>If HTML has no matching element, startup stops at <code>throw</code>; the heading is never created. The guard does not invent a replacement root, and TypeScript does not repair the document. It gives you a clear error while the cause is still easy to find.</p>
              </aside>
              <div class="code-walk">
                <h3>Create, but do not mount yet</h3>
                ${renderCodeExample(chapterOneMainExcerpts.create, "typescript")}
                <p><code>const root = candidate</code> names its role without cloning it. <code>createElement("h1")</code> creates a detached heading; <code>textContent</code> sets literal text. Creating a node alone does not display it. The paragraph is another detached node. Text is not parsed HTML, an important habit when future titles come from users.</p>
              </div>
              <aside class="lesson-note" aria-labelledby="detached-heading-title">
                <h3 id="detached-heading-title">Ready backstage, not on the page</h3>
                <p>After <code>heading.textContent</code>, the heading has its words but is still detached. Think of it as a sign prepared backstage: <code>root.append</code> brings it into the document. Setting text prepares the node; attaching it makes it part of the page.</p>
              </aside>
              <figure class="visual-lesson" aria-labelledby="dom-figure-caption">
                <figcaption id="dom-figure-caption">Illustration · the same heading, before and after attaching it. This is a diagram, not executing code.</figcaption>
                <div class="choice-grid">
                  <section class="lesson-panel">
                    <h3>1 · Prepared in memory</h3>
                    ${renderCodeExample(sourceLines(chapterOneMain, 7, 8), "typescript")}
                    <div class="dom-state">
                      <code>Document: &lt;main id="app"&gt; · empty</code>
                      <code>Detached: &lt;h1&gt;Nala Tasks: startup&lt;/h1&gt;</code>
                    </div>
                    <p>The heading has text, but the page's main element has no children yet.</p>
                  </section>
                  <section class="lesson-panel">
                    <h3>2 · Attached to the document</h3>
                    ${renderCodeExample(chapterOneMainExcerpts.mount, "typescript")}
                    <div class="dom-state">
                      <code>Document: &lt;main id="app"&gt;</code>
                      <code class="dom-child">&lt;h1&gt;Nala Tasks: startup&lt;/h1&gt;</code>
                      <code class="dom-child">&lt;p&gt;Loaded native JavaScript module: …&lt;/p&gt;</code>
                    </div>
                    <p>Appending moves the prepared nodes into main. It does not make a second copy of the heading.</p>
                  </section>
                </div>
              </figure>
              <div class="code-walk">
                <h3>Report the code that actually ran</h3>
                ${renderCodeExample(chapterOneMainExcerpts.report, "typescript")}
                <p>The first line creates another detached paragraph. The second sets its text, continuing on the next line after <code>=</code> because the text is long.</p>
                <p>The text is wrapped in backticks (<code>${"`"}</code>), not quotes. That makes it a <em>template literal</em>: a string in which <code>${"${…}"}</code> inserts a value. The value inserted here is <code>import.meta.url</code>, the full address of the file that is running right now.</p>
                <p>On your page that address will end in <code>/app/dist/main.js</code>. That is the proof this chapter is after: the browser runs the generated JavaScript, not your TypeScript source. The rest of the sentence reminds you which file to edit.</p>
                <h3>Mount once, in order</h3>
                ${renderCodeExample(chapterOneMainExcerpts.mount, "typescript")}
                <p><code>root.append(heading, report)</code> inserts both nodes into the existing main element, heading first. Semicolons finish the statements. There are no explicit TypeScript-only type annotations in this file yet: the runtime syntax is ordinary JavaScript. Keeping it in <code>.ts</code> enables checking now and typed APIs later.</p>
              </div>
            </section>

          <section class="chapter-step" id="step-7">
            <div
              class="step-heading"><span class="step-number" aria-hidden="true">7</span><h2>Check the source. Then emit the browser file.</h2></div>
            <p>Run the first command from the repository root. Wait for success before running the second.</p>
            <nala-terminal-transcript label="Terminal 1 · check, then compile"
              directory="Repository root"
              .entries=${compileTranscript}></nala-terminal-transcript>
            <div class="choice-grid">
              <div class="lesson-panel">
                <h3>check validates</h3>
                <p><code>deno check</code> reads the configuration and catches type mistakes without emitting a file. Assigning a number to <code>heading.textContent</code>, for example, violates its type. You will try exactly that in step 9.</p>
              </div>
              <div class="lesson-panel">
                <h3>transpile emits</h3>
                <p><code>app/src/main.ts</code> selects input; <code>--output app/dist/main.js</code> names the exact output. It does not run the app, bundle it or start a server.</p>
              </div>
            </div>
            <aside class="lesson-note">
              <p><strong>Success looks like:</strong> each command finishes and returns you to the terminal prompt without a reported error. Checking writes no browser file. After transpiling, your editor should show <code>app/dist/main.js</code>; open it and find <code>root.append(heading, report)</code>. Do not run that file with Deno: it needs a browser document.</p>
            </aside>
            <aside class="lesson-note">
              <p><strong>Your app has its own compilation step.</strong> <code>deno task build:nala</code> builds vendor packages and demo apps, <em>not app/</em>. The two commands above are the clearest way to compile this import-free starter. Once later chapters add app modules and vendor imports, use the app's graph-aware build task instead.</p>
            </aside>
            <details>
              <summary>Why this output option? · Optional tooling detail</summary>
              <p>Explicit <code>--output</code> names one exact file. An <code>--outdir</code> target can preserve input directories beneath it. This source has no imports, so no import rewriting is necessary. Once your files import each other, the generated JavaScript must point at <code>.js</code> files in <code>dist</code> rather than <code>.ts</code> files in <code>src</code>. These manual commands do not rewrite those paths; <code>deno task build:app</code> will handle that when a later chapter introduces imported modules.</p>
              <p>Inspect output to learn, not to fix it by hand. The next compilation replaces it.</p>
            </details>
            <p>Deno may warn that <code>transpile</code> is experimental. That is not a compilation failure: confirm <code>app/dist/main.js</code> was emitted. We use the verified repository tool rather than adding another compiler; future Deno versions may change its interface.</p>
          </section>

          <section class="chapter-step" id="step-8">
            <div
              class="step-heading"><span class="step-number" aria-hidden="true">8</span><h2>Open a second terminal. Serve your page.</h2></div>
            <p>Keep the first terminal for source commands. In a second terminal at the repository root, run:</p>
            <nala-terminal-transcript label="Terminal 2 · leave the server running"
              directory="Repository root"
              .entries=${serverTranscript}></nala-terminal-transcript>
            <p><code>deno run</code> executes a development program. <code>-A</code> grants all permissions, including reading files/environment and listening on a port. Grant this only to trusted code. This is not a production hosting command.</p>
            <aside class="lesson-note">
              <p><strong>Open <a href="http://localhost:8080/app/" target="_blank" rel="noopener">http://localhost:8080/app/</a>, not just /.</strong> The default homepage is the feature showcase. The server serves the repository root, and your directory URL selects <code>app/index.html</code>. If you already started a Nala server for another demo, it can serve your app too: add <code>/app/</code> to the address it printed.</p>
            </aside>
            <p>Do not double-click HTML and rely on <code>file://</code>: module loading needs HTTP and correct response types. Leave the server running. <kbd>Ctrl</kbd> + <kbd>C</kbd> stops it when finished.</p>
            <section class="lesson-panel" aria-labelledby="app-watch-title">
              <h3 id="app-watch-title">Watch source changes and reload the page</h3>
              <p>The manual commands above show each step clearly: <code>deno check</code> verifies the TypeScript, and <code>deno transpile</code> creates the JavaScript file the browser loads. For your regular edit-and-check cycle, use the repository's watcher task to rebuild after you save an app source file or browser asset.</p>
              <p>The server you started above is running on its own. Stop it with <kbd>Ctrl</kbd> + <kbd>C</kbd>, then start the server and watcher together from the repository root:</p>
              <nala-terminal-transcript compact
                label="Terminal · repository root · server and app watcher"
                directory="Repository root"
                .entries=${appWatchTranscript}></nala-terminal-transcript>
              <p>Wait for “Initial app build is ready” and the server's listening message, then open <code>http://localhost:8080/app/</code>. The watcher checks and transpiles app TypeScript modules and any vendor packages imported from <code>app/src/main.ts</code>. It rebuilds after app source or browser-asset changes and after changes to an imported vendor module. When the build succeeds, the server sends a reload event to connected pages. Use <code>deno task build:nala</code> for the repository-wide vendor and demo build; it does not compile <code>app/</code>.</p>
              <p>This is <strong>live reload</strong>, not true hot module replacement (HMR): the browser reloads the whole document rather than swapping code in place, so temporary page state is lost. If <code>deno check</code> fails, the watcher reports the error and does not reload; fix the source and save again. Stop both processes with <kbd>Ctrl</kbd> + <kbd>C</kbd>.</p>
              <p>If port 8080 is already in use, stop your own earlier server or run the combined task on an unused port. These are examples for port 8087; choose a different available number if needed.</p>
              <p class="file-label">macOS / Linux</p>
              <nala-terminal-transcript compact
                label="Terminal · macOS or Linux · alternate app port"
                .entries=${unixAppWatchPortTranscript}></nala-terminal-transcript>
              <p class="file-label">Windows PowerShell</p>
              <nala-terminal-transcript compact
                label="Terminal · Windows PowerShell · alternate app port"
                .entries=${windowsAppWatchPortTranscript}></nala-terminal-transcript>
            </section>
            <details>
              <summary>Port 8080 already in use?</summary>
              <p>Choose an unused port such as 8087. These are alternatives; run only the command for your shell.</p>
              <p class="file-label">macOS / Linux</p>
              <nala-terminal-transcript compact
                label="Terminal 2 · macOS or Linux"
                .entries=${unixPortTranscript}></nala-terminal-transcript>
              <p class="file-label">Windows PowerShell</p>
              <nala-terminal-transcript compact
                label="Terminal 2 · Windows PowerShell"
                .entries=${windowsPortTranscript}></nala-terminal-transcript>
              <p>Then open <code>http://localhost:8087/app/</code>. The shell assignment applies to one command on macOS/Linux. PowerShell keeps it for that session; <code>Remove-Item Env:PORT</code> clears it. Never stop an unknown process just to reclaim a port.</p>
            </details>
            <nala-process-flow
              label="From source to a visible page · the startup chain"
              .steps=${startupSteps}></nala-process-flow>
            <p>The server can already be running while you edit and compile. This diagram follows the files' journey, not a requirement to restart the server on every change.</p>
          </section>

          <section class="chapter-step" id="step-9">
            <div
              class="step-heading"><span class="step-number" aria-hidden="true">9</span><h2>Do not just see a page. Prove the chain.</h2></div>
            <p><strong>Expected result (illustration).</strong> Open your own app and compare it with the page below.</p>
            <div class="startup-preview"
              aria-label="Illustration of expected startup output">
              <h3>Nala Tasks: startup</h3>
              <p>Loaded native JavaScript module: http://localhost:8080/app/dist/main.js. Edit the TypeScript source, then run its build steps again.</p>
            </div>
            <p>Open Developer Tools from your browser menu and select <strong>Network</strong>. Reload your app, then select the request for <code>/app/</code> and the one ending in <code>main.js</code>. In each request's Headers view, look for status <strong>200</strong>. A cached reload may show <strong>304</strong>; disable the cache while Developer Tools is open and reload if you need to inspect fresh responses.</p>
            <ul>
              <li>The document's <code>Content-Type</code> should contain <code>text/html</code>. Its Response view contains your HTML document.</li>
              <li>The module's <code>Content-Type</code> should be a JavaScript MIME type such as <code>text/javascript</code> or <code>application/javascript</code>. Its Response view contains JavaScript, not a document starting with <code>&lt;!doctype</code>.</li>
              <li>Switch to <strong>Console</strong>: there should be no startup exception. The page's report should end its module URL with <code>/app/dist/main.js</code> on the origin and port you actually opened.</li>
            </ul>
            <p>Panel labels vary slightly by browser. Status alone is not enough: the response body and content type tell you whether the browser received the right file.</p>
            <figure class="visual-lesson" aria-labelledby="network-figure-caption">
              <figcaption
                id="network-figure-caption">Illustrative Network responses · not a live inspector. Both requests return 200, but only one delivers JavaScript.</figcaption>
              <div class="choice-grid">
                <section class="lesson-panel">
                    <h3>Right status, right file</h3>
                    <dl class="response-meta">
                      <dt>Request</dt><dd><code>/app/dist/main.js</code></dd>
                      <dt>Status</dt><dd>200 OK</dd>
                      <dt>Content-Type</dt><dd><code>text/javascript; charset=utf-8</code></dd>
                    </dl>
                    ${renderCodeExample('const candidate = document.querySelector("#app");', "typescript")}
                    <p>The Response contains JavaScript. The browser can load this as a module.</p>
                  </section>
                <section class="lesson-panel">
                    <h3>Right status, wrong file</h3>
                    <dl class="response-meta">
                      <dt>Request</dt><dd><code>/app/dist/main.js</code></dd>
                      <dt>Status</dt><dd>200 OK</dd>
                      <dt>Content-Type</dt><dd><code>text/html; charset=utf-8</code></dd>
                    </dl>
                    ${renderCodeExample('<!doctype html>\n<html lang="en">', "html")}
                    <p>Some servers answer every unknown address with a general HTML page, called a fallback page. Here it answered instead of the module. The <code>Content-Type</code> header (also called the MIME type) labels what kind of file a response is, and browsers refuse to run a module labelled as HTML. The Console then reports a MIME-type error, or an unexpected <code>&lt;</code> if HTML is read as JavaScript. Either message points you toward the response, not the heading code.</p>
                  </section>
              </div>
              <p><strong>Diagnostic habit:</strong> match the URL, status, content type and response body. A 200 status says the request succeeded, not that the response was the file you intended.</p>
            </figure>
            <div class="choice-grid">
              <section class="lesson-panel">
                <h3>Experiment A · Change the source</h3>
                <p>Set the heading to <code>Nala Tasks: my first build</code> in <code>main.ts</code>. Save, check, compile and reload. See the change? Restore <code>Nala Tasks: startup</code> and repeat to finish at the baseline.</p>
              </section>
              <section class="lesson-panel">
                <h3>Experiment B · Break the contract</h3>
                <p>Rename HTML's <code>id="app"</code> to <code>id="wrong"</code>. Save and reload without compiling: only HTML changed. Console should report <code>Application root is missing.</code> Restore the id and reload. Do not remove the guard to conceal the mistake.</p>
              </section>
            </div>
            <section class="lesson-panel" aria-labelledby="experiment-c-title">
                <h3 id="experiment-c-title">Experiment C · Let the checker catch a mistake</h3>
                <p>So far <code>deno check</code> has only ever said yes. Let's watch it say no. In <code>app/src/main.ts</code>, replace the heading's text with a number:</p>
                ${renderCodeExample("heading.textContent = 42;", "typescript")}
                <p>Save, then run both commands again in Terminal 1, ignoring the usual “wait for success” rule just this once:</p>
                <nala-terminal-transcript compact label="Terminal 1 · a failed check"
                  directory="Repository root"
                  .entries=${typeErrorTranscript}></nala-terminal-transcript>
                <p>Reload the page: it shows <strong>42</strong>. The browser converted the number to text and carried on. Nothing crashed, which is exactly why this kind of mistake is easy to miss. Only the checker noticed that the code says something different from what we meant.</p>
                <p><strong>The lesson:</strong> transpile turns TypeScript into JavaScript, whether or not the types are right. Check is the step that protects you, so always run it first and stop when it reports an error. Restore <code>"Nala Tasks: startup"</code>, then check, compile and reload to return to the baseline.</p>
              </section>
            <section class="lesson-panel" aria-labelledby="transfer-title">
              <h3
                id="transfer-title">Your turn · Add something without a recipe</h3>
              <p>Add a second paragraph after the startup report that says <strong>My app starts here.</strong> Before editing, write down: which source file needs changing, does HTML need changing, and which commands must run? Use the node-creation pattern you have learned, not HTML string concatenation.</p>
              <p><strong>Success:</strong> the original heading and report remain, followed by your new paragraph. Verify the module URL is still correct. Then remove your extra code, check, compile and reload to restore the chapter baseline.</p>
              <details>
                  <summary>Compare your reasoning after trying</summary>
                  <p>Edit <code>app/src/main.ts</code>; HTML already provides the root and module URL. Create a paragraph, set its <code>textContent</code> and append it to <code>root</code> after the original append. Check and transpile, then reload. If the server is still running, do not restart it.</p>
                  <p class="file-label">One solution · insert after root.append(heading, report)</p>
                  ${renderCodeExample(chapterOneTransfer, "typescript")}
                </details>
            </section>
            <details>
              <summary>When the result differs</summary>
              <ul>
                <li><strong>404 for main.js:</strong> confirm the output exists and the script URL matches it.</li>
                <li><strong>Unexpected token &lt;:</strong> inspect the response; you may have received a fallback HTML page instead of JavaScript, even with status 200.</li>
                <li><strong>Stale heading:</strong> check you saved source, compiled again and opened the right server origin. Do not edit dist.</li>
                <li><strong>File not found in the terminal:</strong> confirm your working directory directly contains <code>deno.json</code> and <code>app</code>.</li>
              </ul>
            </details>
          </section>

          <section class="chapter-step" id="step-10">
            <div
              class="step-heading"><span class="step-number" aria-hidden="true">10</span><h2>You own the startup now.</h2></div>
            <p>You have reached reference project 01's behavior: a guarded root, heading and module-URL report. The reference adds a learning banner and uses demo-relative paths. Your page intentionally omits that banner and uses <code>/app/dist/main.js</code>.</p>
            <p>Here are both complete authored files together. Switch filename tabs to compare your work. The generated <code>app/dist/main.js</code> is intentionally not a source file to copy.</p>
            <nala-code-workspace label="Chapter 1 · finished source files"
              .files=${finishedFiles}></nala-code-workspace>
            <section class="readiness" aria-labelledby="readiness-title">
              <h3 id="readiness-title">Ready for the next chapter?</h3>
              <p>Check the evidence you observed, not just the steps you read. This list is not saved; leaving the chapter resets it. Ticking everything is a reminder, not a certificate of mastery.</p>
              <ul class="acceptance">
                <li><label><input type="checkbox"><span><strong>Files written</strong><small>I wrote both complete files in app, not in a checkpoint.</small></span></label></li>
                <li><label><input type="checkbox"><span><strong>Browser result verified</strong><small>Check and compile succeed; Network delivers JavaScript and my page reports its module URL.</small></span></label></li>
                <li><label><input type="checkbox"><span><strong>Cause and effect understood</strong><small>My extra paragraph appeared after compilation. I can explain why creating a node alone does not display it.</small></span></label></li>
                <li><label><input type="checkbox"><span><strong>Failure understood, baseline restored</strong><small>The missing-root guard failed visibly. I restored the id and original source, compiled and reloaded.</small></span></label></li>
                <li><label><input type="checkbox"><span><strong>Checker seen in action</strong><small>I saw deno check reject a number as heading text while transpile still wrote the file, and I can say why check comes first.</small></span></label></li>
              </ul>
            </section>
            <details>
              <summary>Try explaining it without looking at the code</summary>
              <p>What are the three different jobs of check, transpile and serve? Which file changes the heading? Why does the guard remain in generated JavaScript even though future type annotations disappear?</p>
              <details>
                <summary>Check your reasoning</summary>
                <p>Check validates without emitting; transpile writes JavaScript without running the app; serve delivers files without compiling them. Edit <code>app/src/main.ts</code>. <code>instanceof</code> and <code>throw</code> are runtime behavior, so they remain. Types describe code during checking and are erased from output.</p>
              </details>
            </details>
            <aside class="lesson-note">
              <p><strong>Keep your app for Chapter 2.</strong> Leave <code>app/index.html</code> unchanged and restore the startup source above after experimenting. The <a href="/start-here/todo/02#step-1">Chapter 2 build-along</a> supplies the complete replacement for <code>app/src/main.ts</code>. It uses the same check/transpile commands and <code>/app/</code> URL: no copying a checkpoint, path translation or new tooling required.</p>
              <p>That bridge builds an unstyled static task interface. It does not add, sort or save task data yet.</p>
            </aside>
            <p>Next, we replace the startup report with meaningful task controls, before adding a mutable model.</p>
          </section>

          <section id="comparison" aria-labelledby="comparison-title">
            <h2
              id="comparison-title">Optional: compare with reference project 01</h2>
            <p>You already have everything needed above. Reference project 01 is optional. To run it, <code>deno task build:nala</code> builds its separate module tree; it still does not compile your app.</p>
            <p><a href="/demo-apps/core-todo-tutorial/checkpoints/01/" target="_blank" rel="noopener">Open reference project 01</a> · <a href="/demo-apps/core-todo-tutorial/checkpoints/01/README.md" target="_blank" rel="noopener">Read project commands</a></p>
            <button type="button" data-preview aria-expanded="false"
              aria-controls="chapter-one-reference-preview">Load optional reference preview</button>
            <div id="chapter-one-reference-preview"></div>
          </section>
          <nav class="chapter-links" aria-label="Chapter navigation">
            <a href="/start-here/todo">Book contents</a>
            <a rel="next" href="/start-here/todo/02">Next: Semantic HTML</a>
          </nav>
        </div>
      </article>
    `,
  onConnect (context) {
    const preview = context.query("#chapter-one-reference-preview");
    const button = context.query("[data-preview]");
    if (!preview || !button) {
      throw new Error("Chapter 1 comparison controls are missing.");
    }
    button.textContent = "Load optional reference preview";
    button.setAttribute("aria-expanded", "false");
    context.onCleanup(()=>{
      preview.replaceChildren();
    });
    context.listen(button, "click", ()=>{
      const frame = preview.querySelector("iframe");
      if (frame) {
        frame.remove();
        button.textContent = "Load optional reference preview";
        button.setAttribute("aria-expanded", "false");
        return;
      }
      const next = document.createElement("iframe");
      next.title = "Reference project 01: startup";
      next.src = "/demo-apps/core-todo-tutorial/checkpoints/01/";
      preview.append(next);
      button.textContent = "Close reference preview";
      button.setAttribute("aria-expanded", "true");
    });
  }
});
