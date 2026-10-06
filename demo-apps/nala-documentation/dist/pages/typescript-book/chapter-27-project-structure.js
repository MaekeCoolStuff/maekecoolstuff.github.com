import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-27", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 5: From feature to application · Chapter 27</p>
        <h1>Project structure and dependency boundaries</h1>
        <p>
                A project structure should make it easy to find a behavior and see
                what it depends on. One practical split is domain code for game and
                shelf rules, data code for HTTP and persistence, feature code for
                workflows, and UI code for browser elements. Keep dependencies
                pointing toward stable domain contracts rather than making every
                module import every other module.
              </p>
              ${renderCodeExample(`// A feature uses application behavior and domain types.
import type { Game } from "../domain/game.js";
import { findGames } from "../application/search-games.js";

// The domain module does not import browser or storage APIs.`)}
              <p>
                The composition point wires concrete browser and storage
                implementations together. Small projects can use fewer folders, but
                dependency direction should remain understandable: UI can depend on
                application behavior; domain rules should not depend on a custom
                element or call fetch directly.
              </p>
              ${renderWorkedExample(html`
                <ul>
                  <li>Game belongs in the domain module.</li>
                  <li>The fetch implementation belongs in the data boundary.</li>
                  <li>The backlog rule belongs with domain or application logic.</li>
                  <li>The custom element belongs in the UI layer.</li>
                </ul>
                <p>
                  UI code may use application behavior and domain types. The domain
                  should not import a custom element or call fetch directly.
                </p>
              `)}
        <section>
          <h2>Organize around responsibilities</h2>
          <p>
            Project structure should help a developer locate a behavior,
            identify its owner, and understand what it depends on. Small
            projects can begin with a few files; as workflows grow, group
            code by stable responsibilities such as domain rules,
            application workflows, data access, and user interface. Do not
            split into many folders before there is a boundary worth naming.
          </p>
          ${renderCodeExample(`// Domain code owns rules and concepts.
export type GameId = string;
export type PlayStatus = "backlog" | "playing" | "completed";

// Application code coordinates a workflow.
export function completeGame(game: Game): Game {
  return { ...game, playState: { status: "completed" } };
}`)}
          <p>
            A feature-oriented layout can keep a screen, its state, and its
            tests together; a layered layout can clarify shared boundaries.
            Mature projects often use both. Choose the smallest structure
            that makes ownership and dependencies understandable to the
            people changing the code.
          </p>
        </section>

        <section>
          <h2>Keep dependency direction intentional</h2>
          <p>
            UI code may depend on application workflows and domain types.
            Application code may depend on domain rules and interfaces for
            outside capabilities. Domain rules should not import a custom
            element, browser storage, or a concrete HTTP implementation.
            This keeps core behavior testable and prevents infrastructure
            choices from spreading through the application.
          </p>
          ${renderCodeExample(`export interface GameCatalog {
  search(query: string): Promise<readonly Game[]>;
}

export async function searchShelf(
  catalog: GameCatalog,
  query: string,
): Promise<readonly Game[]> {
  return catalog.search(query.trim());
}`)}
          <p>
            The browser composition point supplies a fetch-backed catalog;
            a test supplies a deterministic fake. This is dependency
            injection through ordinary function parameters and values, not
            a requirement for a container framework.
          </p>
        </section>

        <section>
          <h2>Define boundaries and public APIs</h2>
          <p>
            A module boundary is useful when it hides volatile details,
            enforces an invariant, or gives several callers a stable
            contract. Export only what callers are meant to use. Keep
            implementation helpers private, and avoid barrels that hide
            circular dependencies or make a small import evaluate unrelated
            setup code.
          </p>
          <p>
            In this repository, source imports use explicit TypeScript
            entrypoints and Deno tasks define checks and builds. Other
            toolchains may use different extension, alias, package, or
            project-reference rules. Follow one documented module strategy
            and do not import generated output from source files.
          </p>
          ${renderCodeExample(`// UI depends on an application contract.
import { searchShelf } from "../application/search-shelf.js";
import type { Game } from "../domain/game.js";

// Domain modules do not import UI or call fetch directly.`)}
        </section>

        <section>
          <h2>Keep configuration at the edge</h2>
          <p>
            Read environment variables, browser globals, and secrets at
            explicit startup or service boundaries. Pass validated values
            into the code that needs them instead of reading ambient state
            from arbitrary modules. Never commit secrets or expose
            server-only configuration in a browser bundle.
          </p>
          <p>
            Keep local development commands reproducible and documented.
            TypeScript can check a configuration shape, but cannot prove a
            deployed value exists, has a safe value, or is appropriate to
            expose.
          </p>
        </section>

        <section>
          <h2>Scale structure with evidence</h2>
          <ul>
            <li>Group a behavior with its owner, implementation, and focused tests.</li>
            <li>Separate pure domain rules from I/O and browser-specific behavior.</li>
            <li>Break cycles by clarifying ownership, not by adding arbitrary indirection.</li>
            <li>Extract a package when multiple consumers need a stable boundary.</li>
            <li>Prefer the simplest layout that makes a change local and understandable.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: trace a feature</h2>
            <p>
              Trace “add a game to the wishlist” from the button to the
              domain update and persistence boundary. Draw each dependency.
              Move a rule only when doing so gives it a clear owner or
              makes it independently testable; do not reorganize files
              solely to match a fashionable folder template.
            </p>
          `)}
        </section>
      </article>
    `
});
