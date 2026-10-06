import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { moduleExamples, renderPartOneCodeExample as renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-06", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 1: Getting oriented · Chapter 6</p>
        <h1>Modules</h1>
        <p>
              As a project grows, modules let each file own a small, understandable
              piece of the program. An <code>export</code> makes a declaration
              available to other files, and an <code>import</code> names the
              declarations a file depends on. Prefer importing only what a module
              uses.
            </p>
            ${renderCodeExample(moduleExamples)}
            <p>
              Types can be imported separately from runtime values with
              <code>import type</code>, or alongside values using a type-only
              specifier. Type-only imports are erased from emitted JavaScript. This
              repository uses explicit <code>.ts</code> extensions in source imports;
              follow the conventions of the project you are working in because
              module-resolution rules depend on its toolchain.
            </p>
            ${renderWorkedExample(html`
              <p>
                Put <code>Game</code> and <code>gameLabel</code> in
                <code>game.ts</code>, then import them from
                <code>collection.ts</code>. The dependency points from
                <code>collection.ts</code> to <code>game.ts</code>; the game module
                does not need to import the collection.
              </p>
              ${renderCodeExample(`// collection.ts
import { gameLabel, type Game } from "./game.js";`)}
            `)}
        <section>
          <h2>Modules make dependencies explicit</h2>
          <p>
            In modern JavaScript, a file with imports or exports is an ES
            module. Modules let code be organized around cohesive
            responsibilities and make dependencies visible in source. A
            collection module can depend on a game model, while that model
            should not need to import the screen that happens to display it.
          </p>
          ${renderCodeExample(`// game.ts
            export type Game = { id: string; title: string };
            export function gameLabel(game: Game): string {
              return game.title;
            }
            // collection.ts
            import { gameLabel, type Game } from "./game.js";
            export const games: Game[] = [{ id: "g-1", title: "Sea of Stars" }];
            console.log(gameLabel(games[0]));`)}
          <p>
            An import declares what a file relies on. An export defines the
            module's public surface. Keep each surface small: exported
            implementation details become dependencies that later changes may
            have to preserve.
          </p>
        </section>

        <section>
          <h2>Named exports and default exports</h2>
          <p>
            Named exports work well for modules with several related
            declarations and keep imported names visible at call sites. A
            default export represents one primary value and can be imported
            under any local name. Teams should choose a consistent convention;
            named exports are often easier to search and rename across a
            project.
          </p>
          ${renderCodeExample(`// game-format.ts
export default function gameLabel(title: string): string {
  return "Game: " + title;
}

export const supportedPlatform = "PC";

// collection.ts
import formatGameLabel, { supportedPlatform } from "./game-format.js";

console.log(formatGameLabel(supportedPlatform));`)}
          <p>
            The default export is imported locally as
            <code>formatGameLabel</code>, even though its declaration uses
            the name <code>gameLabel</code>. The named export keeps its
            exported name here; it could also be renamed with
            <code>as</code> if that improved clarity.
          </p>
          <p>
            Avoid exporting a symbol merely because another file could use it.
            A small API gives a module room to change its internals without
            coordinating every caller.
          </p>
        </section>

        <section>
          <h2>Import types separately from runtime values</h2>
          <p>
            TypeScript distinguishes types used only by the checker from
            JavaScript values needed at runtime. A type-only import makes that
            distinction explicit and is erased from emitted JavaScript. A
            combined import can name both kinds when that matches the project's
            conventions.
          </p>
          ${renderCodeExample(`import { createStore, type StoreOptions } from "./store.js";
            import type { Game } from "./game.js";
            export function createGameStore(options: StoreOptions<Game>) {
              return createStore(options);
            }`)}
          <p>
            The first import brings in a runtime function and a compile-time
            type; the second is entirely type-only. Import rules depend on
            compiler configuration and runtime behavior, so follow the
            repository's type-checking and lint conventions.
          </p>
        </section>

        <section>
          <h2>Understand import paths and resolution</h2>
          <p>
            A relative path beginning with <code>./</code> or
            <code>../</code> is resolved from the importing file. A bare
            specifier usually names a package or import-map entry. The rules
            depend on the toolchain, compiler, runtime, package metadata, and
            import map. Do not copy an extension convention from an unrelated
            project.
          </p>
          <p>
            This repository uses Deno and explicit <code>.ts</code> source
            imports. Its build tool checks and transpiles the source, then
            rewrites emitted import paths for browser JavaScript. In-repository
            source imports another module through its <code>src/</code>
            entrypoint; browser HTML imports generated <code>.js</code> output.
            Do not import generated output from TypeScript source or edit
            <code>dist/</code> by hand.
          </p>
          ${renderCodeExample(`// TypeScript source in this repository
            import { createSignal } from "../../../vendor/state/dist/index.js";
            // Browser HTML loads built JavaScript:
            // <script type="module" src="./dist/main.js"></script>`)}
        </section>

        <section>
          <h2>Module scope and initialization</h2>
          <p>
            Each module has its own scope. Its top-level code runs when the
            module is first evaluated, and its exported declarations can then
            be used by importers. This means importing a module can do more
            than define functions: it could register a custom element, attach
            a listener, or start a request.
          </p>
          ${renderCodeExample(`// register-elements.ts
            import "./game-card.js";
            import "./collection-page.js";
            // main.ts explicitly imports the registration side effects:
            import "./register-elements.js";
            startApplication();`)}
          <p>
            Side-effect imports are sometimes the right composition mechanism,
            but they should be obvious. Keep application initialization in a
            clear entry point and avoid surprising work at import time in
            reusable modules. This improves testability and makes startup order
            easier to reason about.
          </p>
        </section>

        <section>
          <h2>Keep dependency direction understandable</h2>
          <p>
            A dependency graph describes which modules rely on which others.
            Prefer dependencies that point from orchestration toward reusable
            domain logic. If a low-level model imports a particular page, the
            dependency direction is probably inverted. Pass a capability in,
            move a shared concept to a focused module, or split the
            orchestration from the reusable rule.
          </p>
          <p>
            Circular dependencies occur when A imports B and B imports A.
            JavaScript defines module initialization semantics, but cycles
            make evaluation order and partially initialized bindings harder to
            reason about. They are often a design signal that responsibilities
            have become entangled. Break the cycle where the ownership boundary
            makes sense rather than adding more indirection blindly.
          </p>
        </section>

        <section>
          <h2>Barrel files: useful but not automatic</h2>
          <p>
            A barrel is a module that re-exports declarations from other
            modules, often to provide a convenient public entry point. It can
            make imports stable and concise, but a barrel can also hide
            dependencies, create cycles, or make a small import evaluate more
            modules than expected. Use barrels intentionally at package
            boundaries; avoid creating one for every folder by habit.
          </p>
          ${renderCodeExample(`// game/index.ts
            export { gameLabel } from "./game-label.js";
            export type { Game } from "./game.js";
            // Consumer imports from the intentional public entry point:
            import { gameLabel, type Game } from "./game/index.js";`)}
          <p>
            A package entry point should expose supported API, not necessarily
            every private helper. Within a module, direct imports can make
            dependencies clearer and avoid accidental cycles through a barrel.
          </p>
        </section>

        <section>
          <h2>Practice: design a small module graph</h2>
          <ol>
            <li>Put the <code>Game</code> type and a title formatter in <code>game.ts</code>.</li>
            <li>Put a collection and a title-search function in <code>collection.ts</code>.</li>
            <li>Import the game contract in the collection module and export the search operation.</li>
            <li>Keep page rendering out of the game model.</li>
            <li>Check the entry module and explain each dependency direction.</li>
          </ol>
          <p>
            A useful design is not measured by file count. Split modules when
            a boundary clarifies ownership, dependency direction, reuse, or
            testing; avoid splitting a simple operation into files that make
            readers chase declarations without gaining a meaningful boundary.
          </p>
        </section>
      </article>
    `
});
