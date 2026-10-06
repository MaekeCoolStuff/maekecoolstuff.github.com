import { defineComponent, html, repeat } from "../../../../vendor/components/dist/index.js";
function code(source, language = "text") {
  return html`<nala-code-block language=${language}>${source}</nala-code-block>`;
}
const installCommands = `# macOS (Homebrew)
brew install deno

# macOS / Linux (official installer)
curl -fsSL https://deno.land/install.sh | sh

# Windows (PowerShell)
irm https://deno.land/install.ps1 | iex`;
const verifyInstall = `deno --version`;
const firstSession = `git clone <your-fork-url> Nala
cd Nala
deno task build:nala
deno task dev:nala-documentation
# open http://localhost:8080`;
const sourceExample = `// Game Shelf app code: demo-apps/game-shelf/src/shelf.ts
import { createSignal } from "../../../vendor/state/dist/index.js";

type PlayStatus = "backlog" | "playing" | "finished";

interface Game {
  id: string;
  title: string;
  platform: string;
  status: PlayStatus;
}

export const [games, setGames] = createSignal<readonly Game[]>([]);

export function countBacklog(list: readonly Game[]): number {
  return list.filter((game) => game.status === "backlog").length;
}`;
const emittedExample = `// generated: demo-apps/game-shelf/dist/shelf.js
import { createSignal } from "../../../vendor/state/dist/index.js";

export const [games, setGames] = createSignal([]);

export function countBacklog(list) {
  return list.filter((game) => game.status === "backlog").length;
}`;
const denoJson = `{
  "compilerOptions": {
    "strict": true,
    "lib": ["dom", "dom.iterable", "dom.asynciterable", "deno.ns", "esnext"]
  },
  "tasks": {
    "check:nala": "deno check vendor/*/src demo-apps/*/src",
    "build:nala": "deno run -A tools/build.ts",
    "dev:nala-documentation": "APP_PATH=demo-apps/nala-documentation deno run -A tools/dev-server.ts"
  },
  "fmt": { "exclude": ["**/dist/"] },
  "lint": { "exclude": ["**/dist/"] }
}`;
const testExample = `// demo-apps/game-shelf/src/shelf.test.ts
import { assertEquals } from "jsr:@std/assert";
import { countBacklog } from "./shelf.js";

Deno.test("countBacklog counts only games that are not started yet", () => {
  const shelf = [
    { id: "celeste", title: "Celeste", platform: "Switch", status: "finished" },
    { id: "hades", title: "Hades", platform: "PC", status: "backlog" },
  ] as const;

  assertEquals(countBacklog(shelf), 1);
});`;
const testCommands = `deno test -A                                  # every *.test.ts in the repo
deno test -A demo-apps/todo-app/src           # one folder
deno test -A --filter "countBacklog"          # tests whose name matches`;
const portCommand = `PORT=8090 deno task dev:nala-documentation`;
const narrowPermissions = `# what -A grants in one flag, spelled out for each tool
deno run --allow-read --allow-write --allow-run tools/build.ts
deno run --allow-read --allow-net --allow-env tools/dev-server.ts`;
const optionalCommands = `deno fmt --check     # report formatting differences
deno lint            # report suspicious code patterns`;
const commands = [
  {
    command: "deno task <name>",
    purpose: "Runs a named command from the tasks section of deno.json. It is the only way you normally start anything in Nala. Recent Deno versions also accept deno run <task>, but deno task states the intent explicitly."
  },
  {
    command: "deno check <paths>",
    purpose: "Type-checks TypeScript with the settings in compilerOptions. It never writes files; it only reports errors."
  },
  {
    command: "deno test -A",
    purpose: "Finds every *.test.ts file, type-checks it, and runs each Deno.test case. No test framework to install."
  },
  {
    command: "deno run -A <file>",
    purpose: "Executes a TypeScript file directly. Nala uses it only for tools/build.ts and tools/dev-server.ts, always through a task."
  },
  {
    command: "deno transpile",
    purpose: "Called by tools/build.ts, never by hand. Removes type syntax and writes one .js file per .ts file."
  }
];
const runtimeApis = [
  {
    api: "Deno.readDirSync, Deno.readTextFile, Deno.writeTextFile",
    usedBy: "build.ts",
    purpose: "Finds source files and rewrites import specifiers in dist/."
  },
  {
    api: "Deno.Command, Deno.execPath",
    usedBy: "build.ts",
    purpose: "Starts deno check and deno transpile as child processes with the same Deno binary."
  },
  {
    api: "Deno.exit",
    usedBy: "build.ts",
    purpose: "Exits with code 1 when any module failed, so scripts can detect a broken build."
  },
  {
    api: "Deno.serve",
    usedBy: "dev-server.ts",
    purpose: "Starts an HTTP server whose handler receives a standard Request and returns a standard Response."
  },
  {
    api: "Deno.realPath, Deno.readFile",
    usedBy: "dev-server.ts",
    purpose: "Resolves the requested file, blocks paths outside the repository, and reads the bytes to send."
  },
  {
    api: "Deno.env.get",
    usedBy: "dev-server.ts",
    purpose: "Reads PORT and APP_PATH so one server can host every demo app."
  },
  {
    api: "Deno.test",
    usedBy: "*.test.ts",
    purpose: "Registers a named test case for deno test."
  }
];
const mistakes = [
  {
    symptom: "The page is blank and the console shows a 404 for dist/main.js",
    fix: "The dev server only serves files. Run deno task build:nala first, and again after every source change."
  },
  {
    symptom: "Your change does not appear after refreshing",
    fix: "There is no file watcher. Rebuild, then refresh the browser."
  },
  {
    symptom: "AddrInUse: Address already in use when starting the dev server",
    fix: "Another server already uses port 8080. Stop it or start with a different PORT."
  },
  {
    symptom: "ReferenceError: document is not defined in a test",
    fix: "deno test has no browser DOM. Test pure logic in Deno and verify DOM behavior in a real browser."
  },
  {
    symptom: "TS2307: Cannot find module '.../shelf'. Maybe add a '.ts' extension",
    fix: "Import specifiers need the explicit .ts extension: \"./shelf.ts\". Do not use --sloppy-imports; the build relies on explicit extensions."
  }
];
defineComponent("docs-deno-page", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Tooling</p>
        <h1>One tool, no hidden layers.</h1>
        <p class="page-lead">
          Deno is the only program you install to work on Nala. It checks your
          TypeScript, runs your tests, strips the types for the browser, and serves
          the result. Nothing else runs between your source and the page.
        </p>

        <nala-callout tone="info">
          <span slot="title">Deno is a development tool here, not part of your app</span>
          The browser never runs Deno. What ships to users is index.html plus the
          plain JavaScript in each dist/ folder, which any static file host can serve.
        </nala-callout>

        <h2>Why Deno</h2>
        <p>
          A typical TypeScript web project needs Node.js to run tools, npm to download
          them, a package.json to list them, a tsconfig.json to configure the compiler,
          a test framework, a bundler, and a dev server. Each is a separate project with
          its own versions and configuration. Deno ships the parts Nala needs in one
          binary:
        </p>
        <div class="docs-grid">
          <nala-card>
            <span slot="title">TypeScript out of the box</span>
            <p>Deno runs, checks, and transpiles .ts files without installing a compiler.</p>
          </nala-card>
          <nala-card>
            <span slot="title">Built-in test runner</span>
            <p>Deno.test and deno test replace a separate test framework.</p>
          </nala-card>
          <nala-card>
            <span slot="title">Web-standard APIs</span>
            <p>fetch, URL, Request, and Response work the same in the tools as in the browser.</p>
          </nala-card>
          <nala-card>
            <span slot="title">No install step</span>
            <p>No package.json, no node_modules, no npm install. Clone the repository and run a task.</p>
          </nala-card>
        </div>
        <p>
          Deno also refuses to touch your files, network, or environment unless a
          command explicitly allows it. That permission model is explained below,
          because you will see its flags in every Nala task.
        </p>

        <h2>Why nothing else: no magic after type erasure</h2>
        <p>
          Nala's one build step is TypeScript type erasure: type annotations,
          interfaces, and type-only imports are removed. The JavaScript that remains is
          the code you wrote, line for line. Nala deliberately adds no bundler, no JSX
          compiler, no template compiler, no decorator transform, no minifier, no
          hot-reload runtime, and no virtual DOM engine.
        </p>
        <p>
          Take a small Game Shelf module that tracks which games are still in the
          backlog. This is the TypeScript you write:
        </p>
        ${code(sourceExample, "typescript")}
        <p>And this is the file the browser loads after deno task build:nala:</p>
        ${code(emittedExample, "typescript")}
        <p>
          The types are gone. Everything else is untouched, apart from one honest
          rewrite that tools/build.ts performs on import paths: ".ts" becomes ".js"
          and "/src/" becomes "/dist/". Browsers cannot load .ts files, and a compiled
          module must import the compiled version of its neighbour. That rewrite is a
          regular expression in plain view, not a plugin.
        </p>
        <p>Keeping the pipeline this thin is a design decision with concrete payoffs:</p>
        <ul>
          <li><strong>Debuggable.</strong> A stack trace in the browser points at code you recognise, because dist/ mirrors src/ file for file.</li>
          <li><strong>Learnable.</strong> Every behavior comes from browser APIs or a vendor module you can open and read. No compiler invents code on your behalf.</li>
          <li><strong>Durable.</strong> There is no plugin chain to upgrade or break. Native ES modules, Custom Elements, and the History API will keep working.</li>
          <li><strong>Portable.</strong> The output is standard JavaScript. Moving away from Deno later means replacing one build script, not rewriting the app.</li>
        </ul>
        <nala-callout tone="warning">
          <span slot="title">Types are checked, then erased</span>
          Type erasure alone does not catch type errors. That is why the build runs
          deno check on each module first and stops that module when checking fails.
        </nala-callout>

        <h2>Getting started as a complete beginner</h2>
        <section class="learning-step">
          <h3>1. Install Deno once</h3>
          <p>Pick the line for your operating system and run it in a terminal. Details and alternatives are on deno.com.</p>
          ${code(installCommands)}
          <p>Close and reopen the terminal, then confirm Deno is found:</p>
          ${code(verifyInstall)}
        </section>
        <section class="learning-step">
          <h3>2. Always work from the repository root</h3>
          <p>Every Nala command expects the terminal to be in the folder that contains deno.json. Deno finds that file automatically and reads its tasks and compiler settings.</p>
        </section>
        <section class="learning-step">
          <h3>3. Build, then serve</h3>
          ${code(firstSession)}
          <p>The build writes JavaScript into dist/ folders; the dev server then sends those files to the browser. Stop the server with Ctrl+C.</p>
        </section>
        <section class="learning-step">
          <h3>4. The edit loop</h3>
          <p>Edit a .ts file, run deno task build:nala again, and refresh the browser. There is intentionally no watcher or hot reload: you always know exactly which build you are looking at.</p>
        </section>
        <section class="learning-step">
          <h3>5. Editor support (optional)</h3>
          <p>In VS Code, install the official Deno extension and run "Deno: Enable" for this workspace. Without it the editor treats the project as Node.js code and reports false errors on .ts imports and Deno APIs.</p>
        </section>

        <h2>deno.json: the only configuration file</h2>
        <p>Nala has no package.json and no tsconfig.json. This single file at the repository root replaces both (abbreviated):</p>
        ${code(denoJson, "typescript")}
        <ul>
          <li><strong>compilerOptions.strict</strong> turns on every strict TypeScript check.</li>
          <li><strong>compilerOptions.lib</strong> lists which built-in type definitions exist. "dom" and its companions describe the browser; "deno.ns" describes the Deno namespace used by tools and tests. Setting lib replaces Deno's defaults, so "deno.ns" must stay in the list.</li>
          <li><strong>tasks</strong> gives long commands short names. APP_PATH=... sets an environment variable for that one command.</li>
          <li><strong>fmt</strong> and <strong>lint</strong> tell deno fmt and deno lint to skip generated dist/ folders.</li>
        </ul>

        <h2>The commands Nala uses</h2>
        <div class="api-table-wrap"><table class="api-table">
          <thead><tr><th scope="col">Command</th><th scope="col">What it does</th></tr></thead>
          <tbody>${repeat(commands, (item)=>item.command, (item)=>html`<tr><td><code>${item.command}</code></td><td>${item.purpose}</td></tr>`)}</tbody>
        </table></div>
        <p>
          Note that deno run does not type-check the file it runs. Only deno check and
          deno test do. This is why the build script calls deno check explicitly.
        </p>

        <h3>The four tasks</h3>
        <ul>
          <li><strong>deno task check:nala</strong> type-checks every vendor module and demo app. Fast, writes nothing.</li>
          <li><strong>deno task build:nala</strong> checks and transpiles each module into its dist/ folder and prints a summary: ✓ built, ✗ failed, – skipped.</li>
          <li><strong>deno task dev:&lt;app&gt;</strong> serves the repository on port 8080 for feature-showcase, todo-app, or nala-documentation. Unknown paths without a file extension return the app's index.html so the client-side router can handle them.</li>
          <li><strong>deno test -A</strong> is not a task; it is the built-in test command.</li>
        </ul>
        <p>If port 8080 is taken, choose another port for that run:</p>
        ${code(portCommand)}

        <h2>Tests with Deno.test</h2>
        <p>
          Tests live next to the code they test and end in .test.ts. The build skips
          them, so they never reach dist/. A test for the Game Shelf backlog counter:
        </p>
        ${code(testExample, "typescript")}
        ${code(testCommands)}
        <p>
          Deno provides no browser DOM at runtime, even though the "dom" types make
          document and customElements type-check. Keep logic that must be tested in
          Deno free of the DOM, and inject browser boundaries such as fetch, history,
          and storage, as the vendor modules do.
        </p>

        <h2>The one external dependency: jsr:@std/assert</h2>
        <p>
          Tests import assertEquals from jsr:@std/assert, Deno's standard assertion
          library on the JSR registry. The specifier itself says where the module comes
          from, so no package.json entry is needed. The first time a test runs, Deno
          downloads the module into a global cache on your machine, outside the
          repository. Later runs use the cache.
        </p>
        <p>
          The resolved version and a checksum are recorded in deno.lock. Commit that
          file: it guarantees every contributor runs the exact same code, and Deno
          refuses a download whose checksum does not match. Application code in dist/
          never imports it.
        </p>

        <h2>Permissions and the -A flag</h2>
        <p>
          By default a Deno program cannot read or write files, open network ports,
          start processes, or read environment variables. Each capability needs a flag.
          -A (--allow-all) grants all of them at once. Nala's tasks use -A because they
          only run the repository's own tools. Spelled out, they need:
        </p>
        ${code(narrowPermissions)}
        <p>
          Treat -A as "I trust this file completely". Never run an unknown remote script
          with it.
        </p>

        <h2>Deno APIs inside the tools</h2>
        <p>
          Both tools are ordinary TypeScript files you can read in a few minutes. These
          are all the Deno-specific APIs they use; everything else is standard
          JavaScript.
        </p>
        <div class="api-table-wrap"><table class="api-table">
          <thead><tr><th scope="col">API</th><th scope="col">Used in</th><th scope="col">Why</th></tr></thead>
          <tbody>${repeat(runtimeApis, (item)=>item.api, (item)=>html`<tr><td><code>${item.api}</code></td><td>${item.usedBy}</td><td>${item.purpose}</td></tr>`)}</tbody>
        </table></div>

        <h2>Optional: formatting and linting</h2>
        <p>Deno also includes a formatter and a linter. Nala configures them to skip dist/, but no task requires them.</p>
        ${code(optionalCommands)}

        <h2>Common beginner mistakes</h2>
        <div class="api-table-wrap"><table class="api-table">
          <thead><tr><th scope="col">You see</th><th scope="col">What to do</th></tr></thead>
          <tbody>${repeat(mistakes, (item)=>item.symptom, (item)=>html`<tr><td>${item.symptom}</td><td>${item.fix}</td></tr>`)}</tbody>
        </table></div>
      </article>
    `
});
