import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-40", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 6: Professional TypeScript · Chapter 40</p>
        <h1>Capstone: build Game Shelf</h1>
        <p>
                Bring the book together by building a small game collection tracker.
                Start with the domain model from Part II, then add one user workflow
                at a time. Keep each step runnable so that the final application is
                the result of tested increments rather than a large unexplained code
                dump.
              </p>
              <ol>
                <li>
                  Model games, platforms, and the discriminated play-state union.
                </li>
                <li>
                  Add pure selectors for search, platform filters, and play counts.
                </li>
                <li>
                  Add an HTTP or storage boundary that parses unknown data before it
                  enters the collection.
                </li>
                <li>
                  Build native, accessible controls and components with explicit
                  property and event contracts.
                </li>
                <li>
                  Add URL-based navigation, persistence with a versioned envelope,
                  focused tests, and a browser workflow check.
                </li>
              </ol>
              <p>
                The finished app should handle an empty collection, malformed saved
                data, a missing game, an aborted request, and every play-state
                alternative. It should preserve browser back/forward and keyboard
                behavior, avoid rendering untrusted input as HTML, and derive counts
                instead of storing duplicate facts.
              </p>
              ${renderWorkedExample(html`
                <ul>
                  <li>
                    Static check: strict type checking of the full project.
                  </li>
                  <li>
                    Runtime test: selectors and parsers cover valid and invalid
                    values.
                  </li>
                  <li>
                    Browser check: navigation, keyboard operation, focus, and
                    rendering work with real DOM elements.
                  </li>
                  <li>
                    Data boundary: HTTP JSON or persisted JSON is parsed from
                    <code>unknown</code> before becoming domain state.
                  </li>
                </ul>
              `)}
        <section>
          <h2>Define the product before the types</h2>
          <p>
            Build a small collection tracker for a single user. The first
            version supports adding games, editing a title, changing play
            state, searching and filtering the collection, selecting a game,
            and preserving data across reloads. Defer social features,
            shared accounts, and large-scale analytics until the core
            workflow is reliable.
          </p>
          <p>
            Write acceptance criteria before implementation: what happens
            for an empty shelf, a duplicate game, a missing selection, an
            invalid title, a failed save, and a reload after a successful
            update? Explicit outcomes give the types and tests a real
            product contract to express.
          </p>
          <ul>
            <li>A user can add and find a game by stable ID.</li>
            <li>A game has exactly one play state at a time.</li>
            <li>Search and filters do not mutate the source collection.</li>
            <li>Invalid external or persisted data never silently becomes trusted state.</li>
            <li>The main workflow works with keyboard and native browser behavior.</li>
          </ul>
        </section>

        <section>
          <h2>Milestone 1: model the domain</h2>
          <p>
            Start with values the application must preserve. Use a literal
            union for a finite platform set, a discriminated union for
            mutually exclusive play states, and readonly collections at
            boundaries where callers should not mutate the shelf directly.
          </p>
          ${renderCodeExample(`type GameId = string;
type Platform = "PC" | "Nintendo Switch" | "PlayStation";

type PlayState =
  | { status: "backlog" }
  | { status: "playing"; hoursPlayed: number }
  | { status: "completed"; completedOn?: string };

type Game = {
  id: GameId;
  title: string;
  platforms: readonly Platform[];
  playState: PlayState;
};

type ShelfState = {
  games: readonly Game[];
  selectedGameId?: GameId;
  filter: "all" | "backlog" | "playing" | "completed";
  query: string;
};`)}
          <p>
            The alias gives an ID a domain name but does not make arbitrary
            strings unique or valid. Check uniqueness and validate formats
            when records enter the system. Add fields only when a workflow
            needs them; keep transport and persisted schemas separate if
            their compatibility requirements differ.
          </p>
          <p><strong>Deliverable:</strong> a domain module with the types and tests for its invariants.</p>
        </section>

        <section>
          <h2>Milestone 2: derive views and define updates</h2>
          <p>
            Keep source state small. Search results, filtered collections,
            selected records, and counts should be derived from the current
            source rather than stored as duplicate facts. Updates should
            validate inputs, preserve invariants, and return new values.
          </p>
          ${renderCodeExample(`function visibleGames(state: ShelfState): readonly Game[] {
  const query = state.query.trim().toLowerCase();
  return state.games.filter((game) => {
    const matchesQuery = game.title.toLowerCase().includes(query);
    const matchesFilter = state.filter === "all" ||
      game.playState.status === state.filter;
    return matchesQuery && matchesFilter;
  });
}

function completedCount(games: readonly Game[]): number {
  return games.filter((game) => game.playState.status === "completed").length;
}`)}
          <p>
            Query text is source state, while the filtered list is derived.
            Test empty input, mixed states, case-insensitive search, and
            unchanged source identity. Avoid storing both the query and its
            result list as independent facts.
          </p>
          <p><strong>Deliverable:</strong> pure selectors and immutable actions with focused tests.</p>
        </section>

        <section>
          <h2>Milestone 3: validate and persist data</h2>
          <p>
            Treat JSON parsed from storage or a server as
            <code>unknown</code>. Validate the envelope version, each game
            field, every union branch, and cross-record invariants such as
            unique IDs. Migrate supported old versions explicitly, then
            validate the migrated result before storing it as current state.
          </p>
          ${renderCodeExample(`function decodeShelf(text: string): readonly Game[] {
  const payload: unknown = JSON.parse(text);
  const envelope = parseShelfEnvelope(payload);
  const current = migrateToCurrentVersion(envelope);
  return parseGameList(current.games);
}`)}
          <p>
            These parser functions are the runtime boundary; their types
            alone do not prove correctness. Decide what happens when data
            is corrupt or storage is unavailable, and avoid silently
            replacing a user's saved collection with an empty list. Persist
            the games as domain data; keep selection, search text, and
            filters ephemeral unless the product specifically promises to
            remember those view preferences.
          </p>
          <p><strong>Deliverable:</strong> versioned serialization, migration tests, and a documented storage-failure policy.</p>
        </section>

        <section>
          <h2>Milestone 4: isolate asynchronous data access</h2>
          <p>
            Put HTTP behavior behind a repository or adapter. Check response
            status, handle empty responses, parse JSON as unknown, validate
            the payload, and propagate cancellation. Keep expected outcomes
            such as not-found separate from network and programming errors.
          </p>
          ${renderCodeExample(`interface GameRepository {
  findById(id: GameId, signal?: AbortSignal): Promise<Game | undefined>;
  save(game: Game, signal?: AbortSignal): Promise<void>;
}

type LoadState<Value> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; value: Value }
  | { status: "error"; message: string };`)}
          <p>
            Inject the repository into application behavior so tests can
            use a deterministic fake. Do not let components decide URL
            formats, error translation, retries, or authorization rules.
          </p>
          <p><strong>Deliverable:</strong> a tested data adapter and explicit loading/error states.</p>
        </section>

        <section>
          <h2>Milestone 5: build the browser interface</h2>
          <p>
            Use native forms, inputs, buttons, and anchors. Give each
            component a small typed property/event contract, parse
            attribute strings where used, and clean up listeners and
            subscriptions with component lifetime. Render user content as
            text. Keep transient details such as open menus local to their
            owning component.
          </p>
          ${renderCodeExample(`type GameOpenDetail = { gameId: GameId };

function dispatchGameOpen(element: HTMLElement, gameId: GameId): void {
  element.dispatchEvent(new CustomEvent<GameOpenDetail>("game-open", {
    detail: { gameId },
    bubbles: true,
    composed: true,
  }));
}`)}
          <p>
            A generic CustomEvent type describes the compile-time contract
            but does not validate untrusted detail. Provide labels,
            connected error messages, useful focus behavior, and visible
            loading/success feedback; TypeScript cannot certify
            accessibility.
          </p>
          <p><strong>Deliverable:</strong> an accessible add/edit/list workflow verified in a real browser.</p>
        </section>

        <section>
          <h2>Milestone 6: make navigation part of the design</h2>
          <p>
            Use real links for game detail routes. Parse the URL into a
            discriminated route model, handle unknown IDs deliberately,
            update the view after <code>pushState</code>, and listen for
            <code>popstate</code> on back/forward. Test direct loading and
            refresh on nested routes and respect the deployment base path.
          </p>
          <p><strong>Deliverable:</strong> shareable routes with native link behavior and browser history.</p>
        </section>

        <section>
          <h2>Milestone 7: verify and ship</h2>
          <p>
            Unit-test selectors, actions, validators, migrations, and error
            cases. Integration-test repositories and persistence through
            injected adapters. Browser-test keyboard use, focus, custom
            element lifecycle, routing, and rendered states. Run the
            project's type check, tests, lint, and build in CI, then smoke
            test the built artifact at its deployed path.
          </p>
          <ul>
            <li>Type-check all source and test modules.</li>
            <li>Exercise empty, invalid, loading, success, and error states.</li>
            <li>Verify browser console and network requests are clean.</li>
            <li>Check accessibility with keyboard and assistive technology.</li>
            <li>Document migration, configuration, monitoring, and rollback.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Definition of done</h2>
            <p>
              A user can add, find, update, and reload a game; malformed
              data is rejected or recovered deliberately; failures remain
              visible and actionable; links and keyboard interactions
              preserve native behavior; and checks reproduce from a fresh
              clone using documented project tasks.
            </p>
          `)}
        </section>
      </article>
    `
});
