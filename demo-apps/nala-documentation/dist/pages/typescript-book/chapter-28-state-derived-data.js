import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-28", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 5: From feature to application · Chapter 28</p>
        <h1>State and derived data</h1>
        <p>
                Source state is the information the user or system changes. Derived
                data is calculated from that source. Storing both creates duplicate
                facts that can disagree, so keep the smallest independent state and
                use pure functions to calculate counts, filtered lists, and labels.
              </p>
              ${renderCodeExample(`type LibraryFilter = "all" | "backlog" | "completed";

function visibleGames(
  games: readonly Game[],
  filter: LibraryFilter,
): Game[] {
  if (filter === "all") return [...games];
  return games.filter((game) => game.playState.status === filter);
}

function completedCount(games: readonly Game[]): number {
  return games.filter((game) => game.playState.status === "completed").length;
}`)}
              <p>
                The filter is source state; the visible list and completed count are
                derived. These functions do not mutate their inputs, which makes
                them easier to test and safe to recompute after an update. If a list
                is large, optimize measured work without turning derived values into
                a second source of truth.
              </p>
              ${renderWorkedExample(html`
                <p>
                  Usually no. Calculate the count from the current games when it is
                  needed. If profiling later proves the calculation costly, any
                  cache must be invalidated whenever its source changes.
                </p>
              `)}
        <section>
          <h2>Store independent facts and derive the rest</h2>
          <p>
            Source state is information that changes independently: game
            records, user choices, and durable preferences. Derived data is
            calculated from that source: counts, filtered lists, labels,
            and percentages. Storing both creates multiple sources of truth
            that can drift after one update is missed.
          </p>
          ${renderCodeExample(`type ShelfState = {
  games: readonly Game[];
  selectedGameId?: GameId;
  filter: LibraryFilter;
};

function completedCount(games: readonly Game[]): number {
  return games.filter((game) => game.playState.status === "completed").length;
}

function visibleGames(state: ShelfState): readonly Game[] {
  return state.filter === "all"
    ? state.games
    : state.games.filter((game) => game.playState.status === state.filter);
}`)}
          <p>
            A pure selector receives state and returns a value without
            mutating the input or performing I/O. Pure selectors are easy
            to test, reuse, and recompute after an update. Cache them only
            when profiling shows a cost and invalidation is explicit.
          </p>
        </section>

        <section>
          <h2>Update immutably and preserve invariants</h2>
          <p>
            An update should return the same state when nothing changed or
            a new state that preserves domain rules. Copy only the path
            being changed so unrelated entity identities remain stable.
            Readonly types prevent writes through a reference, but do not
            freeze JavaScript objects at runtime.
          </p>
          ${renderCodeExample(`function renameGame(
  state: ShelfState,
  id: GameId,
  title: string,
): ShelfState {
  const normalized = title.trim();
  if (normalized === "") return state;

  let changed = false;
  const games = state.games.map((game) => {
    if (game.id !== id || game.title === normalized) return game;
    changed = true;
    return { ...game, title: normalized };
  });

  return changed ? { ...state, games } : state;
}`)}
          <p>
            The update validates the title, changes one game, and leaves
            unrelated data untouched. This makes state changes easier to
            observe and avoids exposing mutable internals.
          </p>
        </section>

        <section>
          <h2>Give each kind of state an owner</h2>
          <p>
            Durable domain state belongs in an application-level store or
            repository. Ephemeral interface state such as an open menu,
            focus target, or unsaved field text often belongs to the
            component that owns that interaction. Share state only when
            multiple parts of the workflow need the same source.
          </p>
          <p>
            Model mutually exclusive states with a discriminated union
            rather than unrelated booleans. Keep HTTP, storage, and DOM
            effects at explicit boundaries; keep selectors and domain
            transitions deterministic where possible.
          </p>
          ${renderCodeExample(`type LoadState<Value> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; value: Value }
  | { status: "error"; message: string };

function resultLabel(state: LoadState<readonly Game[]>): string {
  switch (state.status) {
    case "idle": return "Ready to load";
    case "loading": return "Loading games";
    case "success": return state.value.length + " games";
    case "error": return state.message;
  }
}`)}
        </section>

        <section>
          <h2>Persist only deliberate state</h2>
          <p>
            Persist source data that users expect to survive reloads. Do
            not persist secrets, temporary interface state, or values that
            can be derived. Persistence needs runtime validation, versioning,
            and a failure policy; a static store type does not validate old
            data read from storage.
          </p>
          <ul>
            <li>Keep update actions small and deterministic.</li>
            <li>Test selectors with empty, typical, and boundary states.</li>
            <li>Test valid and rejected state transitions.</li>
            <li>Preserve unchanged entity references when consumers rely on identity.</li>
            <li>Measure before adding memoization or a more complex state library.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: remove duplicated state</h2>
            <p>
              If a store keeps both <code>games</code> and
              <code>completedCount</code>, remove the count and derive it
              from the current game states. Add selector tests for an empty
              shelf and one with mixed play states.
            </p>
          `)}
        </section>
      </article>
    `
});
