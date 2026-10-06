import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-13", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 2: Describing data · Chapter 13</p>
        <h1>Designing domain models</h1>
        <p>
          A domain model names the concepts and rules that matter to the
          application. Game Shelf needs to know which game a record describes,
          which platforms it is available on, and where it is in the player's
          journey. Keep those independent ideas explicit instead of storing
          loosely related strings and booleans.
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

type GameShelf = {
  games: readonly Game[];
  selectedGameId?: GameId;
};

function getSelectedGame(shelf: GameShelf): Game | undefined {
  if (shelf.selectedGameId === undefined) return undefined;
  return shelf.games.find((game) => game.id === shelf.selectedGameId);
}`)}
        <p>
          The model uses an array for a game's platforms because there can be
          several, a discriminated union for mutually exclusive play states, and
          an optional selected ID because the shelf may have no current selection.
          <code>getSelectedGame</code> returns <code>Game | undefined</code>,
          which forces its caller to handle a missing selection or unmatched ID.
        </p>
        <p>
          Good types make invalid combinations harder to express, but they do not
          validate imported JSON or guarantee rules such as unique IDs. Those need
          runtime checks or carefully designed actions.
        </p>
        ${renderWorkedExample(html`
          ${renderCodeExample(`type Platform = "PC" | "Nintendo Switch";

type PlayState =
  | { status: "backlog" }
  | { status: "playing"; hoursPlayed: number }
  | { status: "completed" };

type Game = {
  id: string;
  title: string;
  platforms: readonly Platform[];
  playState: PlayState;
};

type GameShelf = {
  games: readonly Game[];
  selectedGameId?: string;
};`)}
          <p>
            The array permits multiple platforms and multiple games. The union
            allows exactly one play-state alternative at a time, and the optional
            ID permits a shelf without a current selection.
          </p>
        `)}
        <section>
          <h2>Begin with domain questions</h2>
          <p>
            A domain model records the concepts and rules an application must
            preserve. Before choosing types, ask what a game is, which facts
            belong to it, which states it can occupy, what identifies it, and
            which operations are valid. Types should make the answers visible
            to people reading and changing the application.
          </p>
          <p>
            Avoid starting with screens or database columns. A user interface
            may show a compact view, and storage may use a different schema;
            the domain model should describe the application's meaningful
            concepts rather than blindly mirroring either representation.
          </p>
        </section>

        <section>
          <h2>Represent exclusive states as alternatives</h2>
          <p>
            If only one play state can be true at a time, represent it as a
            discriminated union. A collection of optional fields such as
            <code>isPlaying</code>, <code>isCompleted</code>, and
            <code>hoursPlayed</code> allows contradictory combinations. A
            union puts state-specific data beside the state that gives it
            meaning.
          </p>
          ${renderCodeExample(`type PlayState =
  | { status: "backlog" }
  | { status: "playing"; hoursPlayed: number }
  | { status: "completed"; completedOn?: string };

type Game = {
  id: string;
  title: string;
  platforms: readonly Platform[];
  playState: PlayState;
};`)}
          <p>
            A backlog game has no stale hours field, and a playing game cannot
            omit its hours. If a new state such as <code>paused</code> is
            introduced, add its own alternative with only the data meaningful
            for that state.
          </p>
        </section>

        <section>
          <h2>Choose identity and relationships deliberately</h2>
          <p>
            An identifier answers which entity a record represents; a title
            is ordinary descriptive data that can change or be duplicated.
            A type alias such as <code>type GameId = string</code> gives the
            concept a name but remains interchangeable with other strings at
            compile time. Validate uniqueness and format where data enters or
            changes; the alias alone cannot enforce those runtime rules.
          </p>
          <p>
            For a small collection, embedding related values can be simple.
            For larger graphs, storing IDs for relationships can prevent
            duplicated copies from disagreeing. Choose based on update
            patterns, ownership, and lookup needs rather than assuming one
            representation is always best.
          </p>
          ${renderCodeExample(`type GameId = string;
type Shelf = {
  games: readonly Game[];
  selectedGameId?: GameId;
};

function findSelected(shelf: Shelf): Game | undefined {
  if (shelf.selectedGameId === undefined) return undefined;
  return shelf.games.find((game) => game.id === shelf.selectedGameId);
}`)}
        </section>

        <section>
          <h2>State the invariants in operations</h2>
          <p>
            A shape describes which values can be represented; operations
            preserve rules that involve multiple values or a sequence of
            changes. Keep writes behind named functions or actions so each
            operation validates its inputs and returns a state that still
            satisfies the model.
          </p>
          ${renderCodeExample(`function recordHours(state: PlayState, addedHours: number): PlayState {
  if (!Number.isFinite(addedHours) || addedHours <= 0) {
    throw new Error("Added hours must be positive and finite");
  }
  if (state.status === "completed") {
    throw new Error("A completed game cannot receive more play time");
  }
  if (state.status === "backlog") {
    return { status: "playing", hoursPlayed: addedHours };
  }
  return { ...state, hoursPlayed: state.hoursPlayed + addedHours };
}`)}
          <p>
            This operation handles each state intentionally and creates a new
            value instead of mutating the previous object. In a real product,
            the rule for completed games may differ; the important point is to
            encode the agreed rule in one operation rather than scattering
            unchecked field updates across screens.
          </p>
        </section>

        <section>
          <h2>Keep derived facts derived</h2>
          <p>
            Store independent facts and compute summaries such as counts,
            filtered lists, and completion percentages from them. Persisting a
            value and its derivation creates two sources of truth that can
            drift. Pure selectors centralize the calculation and are easy to
            test.
          </p>
          ${renderCodeExample(`function completedCount(games: readonly Game[]): number {
  return games.filter((game) => game.playState.status === "completed").length;
}

function backlogGames(games: readonly Game[]): Game[] {
  return games.filter((game) => game.playState.status === "backlog");
}`)}
          <p>
            If a derived value becomes expensive, cache it using an explicit
            and correct invalidation strategy. Do not make a cache the
            authority for the domain fact it summarizes.
          </p>
        </section>

        <section>
          <h2>Keep trust boundaries visible</h2>
          <p>
            A value loaded from JSON, a form, or old persisted data is not a
            <code>Game</code> just because an annotation says so. Treat
            external data as unknown, validate required fields and invariants,
            then convert it into the domain representation. Likewise, check
            rules that the structural type cannot express, such as unique IDs,
            non-empty titles, valid dates, or sensible numeric ranges.
          </p>
          <p>
            Keep transport and storage schemas separate from domain types when
            they have different lifecycles or compatibility requirements. A
            migration can translate an older saved format into the current
            model without weakening the rest of the application.
          </p>
        </section>

        <section>
          <h2>Review a domain model</h2>
          <ul>
            <li>Can every field be explained in terms of a product concept?</li>
            <li>Can the type represent contradictory states that should be impossible?</li>
            <li>Are absence and empty values intentionally distinguished?</li>
            <li>Are identity and user-editable labels separate concepts?</li>
            <li>Do operations validate and preserve cross-field invariants?</li>
            <li>Are derived values computed rather than duplicated as source state?</li>
            <li>Are untrusted values validated before they enter the model?</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: add a wishlist state</h2>
            <p>
              Decide whether wishlist is a play state or an independent
              collection relationship. A game can be wishlisted and also
              completed, so these facts may need separate fields rather than
              mutually exclusive alternatives. Write down the valid
              combinations before choosing the type.
            </p>
            <p>
              The exercise illustrates a key modeling judgment: use a union
              when choices exclude one another; use independent properties
              when both facts can be true at once.
            </p>
          `)}
        </section>
      </article>
    `
});
