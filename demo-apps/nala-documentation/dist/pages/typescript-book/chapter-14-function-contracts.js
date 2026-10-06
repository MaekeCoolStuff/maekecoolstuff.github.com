import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-14", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 3: Building with types · Chapter 14</p>
        <h1>Functions in depth</h1>
        <p>
                A function type describes a callable value: its inputs and its
                output. This lets a function be passed to another function without
                losing the contract. Optional parameters, default values, and rest
                parameters each shape how callers may provide arguments; choose the
                form that matches the domain rather than making every parameter
                optional.
              </p>
              ${renderCodeExample(`type GameFormatter = (game: Game) => string;

const titleFormatter: GameFormatter = (game) => game.title;

function formatHours(hours: number, unit = "hours"): string {
  return hours + " " + unit;
}

function summarizeShelf(...games: Game[]): string {
  return games.map(titleFormatter).join(", ");
}

function recordVisit(game: Game): void {
  console.log("Opened " + game.title);
}`)}
              <p>
                The formatter's parameter and return types are checked where it is
                assigned and called. The default value means callers may omit
                <code>unit</code>, while <code>...games</code> collects any number
                of Game arguments into an array. <code>void</code> says the caller
                should not expect a useful return value; it does not mean the
                function cannot perform an action.
              </p>
              ${renderWorkedExample(html`
                ${renderCodeExample(`type GamePredicate = (game: Game) => boolean;

const wellPlayed: GamePredicate = (game) =>
  game.playState.status === "playing" && game.playState.hoursPlayed > 20;`)}
                <p>
                  The predicate returns false for every non-playing state and
                  compares hours only after the discriminant narrows the state to
                  the playing case.
                </p>
              `)}
        <section>
          <h2>Function types make callbacks explicit</h2>
          <p>
            A function type describes parameters and a return value. Give a
            callback a named type when it is reused or when its contract is
            important at an API boundary. Inline function types are fine for
            one-off callbacks whose intent is obvious.
          </p>
          ${renderCodeExample(`type GamePredicate = (game: Game) => boolean;
type GameFormatter = (game: Game) => string;

function filterGames(
  games: readonly Game[],
  predicate: GamePredicate,
): Game[] {
  return games.filter(predicate);
}

const wellPlayed: GamePredicate = (game) =>
  game.playState.status === "playing" && game.playState.hoursPlayed > 20;`)}
          <p>
            The parameter type communicates what a callback receives, while
            the result type communicates what the caller may do with its
            answer. Contextual typing often infers callback parameters from
            the API, but naming the contract can help across modules and
            complex signatures.
          </p>
        </section>

        <section>
          <h2>Optional parameters are not the same as undefined inputs</h2>
          <p>
            An optional parameter can be omitted by the caller. A required
            parameter typed as <code>T | undefined</code> must still be
            supplied, though its value may be undefined. A default parameter
            accepts omission and substitutes a value. Choose the contract that
            matches the caller's responsibility.
          </p>
          ${renderCodeExample(`function formatHours(hours: number, unit = "hours"): string {
  return hours + " " + unit;
}

function findGame(title: string, platform?: Platform): Game | undefined {
  return games.find((game) =>
    game.title === title && (platform === undefined || game.platforms.includes(platform))
  );
}

function describeSelection(title: string | undefined): string {
  return title ?? "No game selected";
}`)}
          <p>
            Put required parameters before optional ones. If a function has
            several independent options, use a named options object to avoid
            fragile positional calls. Treat the default as part of the
            documented behavior, not a hidden convenience.
          </p>
          ${renderCodeExample(`type SearchOptions = {
  platform?: Platform;
  includeArchived?: boolean;
};

function searchGames(query: string, options: SearchOptions = {}): Game[] {
  return games.filter((game) =>
    game.title.includes(query) &&
    (options.platform === undefined || game.platforms.includes(options.platform))
  );
}`)}
        </section>

        <section>
          <h2>Overloads describe distinct call forms</h2>
          <p>
            Most functions should accept one clear input shape and return one
            predictable shape. Use overloads when several call forms are
            genuinely useful and the return type depends on which form was
            called. Each overload signature is visible to callers; the
            implementation signature is not.
          </p>
          ${renderCodeExample(`function createRange(end: number): number[];
function createRange(start: number, end: number): number[];
function createRange(startOrEnd: number, end?: number): number[] {
  const start = end === undefined ? 0 : startOrEnd;
  const stop = end === undefined ? startOrEnd : end;
  return Array.from({ length: Math.max(0, stop - start) }, (_, index) => start + index);
}

const fromZero = createRange(4);
const fromStart = createRange(3, 7);`)}
          <p>
            Keep overloads ordered from specific to general, and ensure the
            implementation handles every declared form. Do not create many
            overloads to compensate for an unclear API; a discriminated input
            object or a simpler function can be easier to maintain.
          </p>
        </section>

        <section>
          <h2>Return types and callbacks that return void</h2>
          <p>
            Explicit return types document exported contracts and catch
            accidental changes in what a function promises. Inferred return
            types are useful for local helpers. A callback typed to return
            <code>void</code> tells its caller to ignore the result; the
            implementation may still return a value that the caller discards.
          </p>
          ${renderCodeExample(`type ClickHandler = (game: Game) => void;
const logTitle: ClickHandler = (game) => console.log(game.title);

const callback: () => void = () => "The caller discards this result";

function parseCount(text: string): number | undefined {
  const value = Number(text);
  return Number.isFinite(value) ? value : undefined;
}`)}
          <p>
            Use <code>void</code> for action-oriented callbacks, but do not
            confuse it with <code>undefined</code> as an explicit data result.
            If callers need to distinguish success from failure, return a
            useful value or a result union rather than hiding status in side
            effects.
          </p>
        </section>

        <section>
          <h2>Design callback contracts safely</h2>
          <p>
            Callback parameter compatibility matters: a callback must be able
            to handle the values the API may pass. Avoid annotating a callback
            with a narrower parameter type than the API guarantees. Under
            strict function checking, TypeScript catches many unsafe
            assignments; use the declared API contract rather than forcing a
            cast to make callbacks fit.
          </p>
          ${renderCodeExample(`type GameEventHandler = (game: Game) => void;

function onGameSelected(handler: GameEventHandler): void {
  // The API may call handler with any valid Game.
}

onGameSelected((game) => {
  console.log(game.title);
});`)}
          <p>
            If a callback needs a narrower case, narrow inside the callback
            using a discriminant or provide a more specific API. A callback
            should not assume facts that the caller has not promised.
          </p>
          ${renderWorkedExample(html`
            <h2>Practice: choose a contract</h2>
            <p>
              Design a search function with a required text query, an optional
              platform filter, and a list result. Decide whether archived
              games belong in a boolean positional parameter or a named
              options object. Document the default and write a callback type
              for selecting a result.
            </p>
          `)}
        </section>
      </article>
    `
});
