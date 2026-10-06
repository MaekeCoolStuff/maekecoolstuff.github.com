import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-19", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 3: Building with types · Chapter 19</p>
        <h1>Async TypeScript</h1>
        <p>
                A Promise represents a value that may become available later.
                Calling an <code>async</code> function always returns a Promise, and
                <code>await</code> gives code a readable way to continue after that
                Promise settles. The generic in <code>Promise&lt;Game&gt;</code>
                describes the fulfilled value, not the timing or success of the
                operation.
              </p>
              ${renderCodeExample(`type GameLookup = (
  id: string,
  signal: AbortSignal,
) => Promise<Game | undefined>;

async function selectedGameTitle(
  lookup: GameLookup,
  id: string,
  signal: AbortSignal,
): Promise<string | undefined> {
  const game = await lookup(id, signal);
  return game?.title;
}`)}
              <p>
                Passing an <code>AbortSignal</code> lets a caller cancel work that is
                no longer needed, such as a search for an older query. Cancellation
                usually rejects the Promise; it is not the same as returning
                <code>undefined</code>. Async failures still need an error policy, and
                a Promise's type does not list the exceptions it may throw.
              </p>
              ${renderWorkedExample(html`
                <p>
                  Awaiting produces <code>Game | undefined</code>. An abort normally
                  rejects the Promise with an abort error; the caller may catch it
                  and treat cancellation differently from a missing game or a
                  network failure.
                </p>
              `)}
        <section>
          <h2>A Promise types the fulfilled value</h2>
          <p>
            <code>Promise&lt;T&gt;</code> represents work that may later
            fulfill with a <code>T</code>. An async function always returns
            a Promise: returning a plain value fulfills that Promise, and
            returning another Promise adopts its eventual outcome. The
            generic parameter describes fulfillment, not timing or failure.
          </p>
          ${renderCodeExample(`async function loadTitle(id: string): Promise<string | undefined> {
  const game = await repository.findById(id);
  return game?.title;
}

const titlePromise = loadTitle("g-1");
const title = await titlePromise; // string | undefined`)}
          <p>
            Awaiting a fulfilled Promise produces its value. Awaiting a
            rejected Promise throws at that expression, so rejection must be
            handled by a caller or a nearby <code>try</code>/<code>catch</code>.
            TypeScript does not have checked exceptions in Promise types.
          </p>
        </section>

        <section>
          <h2>Sequence dependent work and overlap independent work</h2>
          <p>
            Await operations one after another when a later step needs the
            earlier result. Start independent work together when concurrency
            is appropriate. <code>Promise.all</code> preserves result order
            and rejects if any input rejects; rejecting does not cancel the
            other operations automatically.
          </p>
          ${renderCodeExample(`async function loadGamePage(id: string): Promise<string> {
  const game = await repository.fetchById(id);
  if (game === undefined) return "Game not found";
  const rating = await repository.fetchRating(id);
  return game.title + " — rating " + rating;
}

async function loadShelf(ids: readonly string[]): Promise<(Game | undefined)[]> {
  return await Promise.all(ids.map((id) => repository.fetchById(id)));
}`)}
          <p>
            Do not issue unbounded parallel requests just because
            <code>Promise.all</code> makes the syntax short. Large workloads
            may need a concurrency limit. Choose how partial results and
            retries work instead of letting the combinator define product
            behavior accidentally.
          </p>
        </section>

        <section>
          <h2>Select the Promise combinator by its contract</h2>
          <p>
            <code>Promise.all</code> requires every operation to fulfill.
            <code>Promise.allSettled</code> waits for every operation and
            returns a fulfilled/rejected status for each. <code>Promise.race</code>
            settles with the first settled input but leaves the others
            running. <code>Promise.any</code> fulfills with the first
            successful input, or rejects with an AggregateError if all
            inputs reject.
          </p>
          ${renderCodeExample(`const outcomes = await Promise.allSettled(
  gameIds.map((id) => repository.fetchById(id)),
);

for (const outcome of outcomes) {
  if (outcome.status === "fulfilled") {
    console.log(outcome.value);
  } else {
    console.error(outcome.reason);
  }
}`)}
          <p>
            Rejection reasons are not guaranteed to be <code>Error</code>
            instances. Narrow unknown reasons before reading their properties.
            Use all-settled results when partial success is useful; use
            <code>all</code> when the operation is only valid as a whole.
          </p>
        </section>

        <section>
          <h2>Cancellation must be supported and propagated</h2>
          <p>
            A Promise is not automatically cancellable. APIs that support
            <code>AbortSignal</code> must receive the signal, and each layer
            must pass it on. Aborting commonly rejects with an abort error;
            that is distinct from a successful missing-data result. A timeout
            is a separate policy that may trigger an abort or another typed
            failure.
          </p>
          ${renderCodeExample(`async function searchGames(
  query: string,
  signal: AbortSignal,
): Promise<Game[]> {
  const response = await fetch(
    "/games?q=" + encodeURIComponent(query),
    { signal },
  );
  if (!response.ok) throw new Error("Search failed: " + response.status);
  return response.json() as Promise<Game[]>;
}`)}
          <p>
            The assertion shown is only shorthand; it does not validate JSON.
            Real network boundaries should parse and validate the response.
            When search queries change, abort the obsolete request or ignore
            its result so a slow earlier response cannot replace newer state.
          </p>
        </section>

        <section>
          <h2>Handle asynchronous failures deliberately</h2>
          <p>
            A rejected Promise must be awaited, returned, or handled. Detached
            async work can create an unhandled rejection and makes the caller
            unable to know when it finished. Catch where the code can recover,
            translate a known failure, or add useful context; otherwise let
            the caller handle it.
          </p>
          ${renderCodeExample(`async function saveGame(game: Game): Promise<void> {
  try {
    await repository.save(game);
  } catch (cause: unknown) {
    if (cause instanceof Error) {
      throw new Error("Could not save " + game.id, { cause });
    }
    throw cause;
  }
}`)}
          <p>
            Cancellation, no result, a recoverable network error, and a
            programming defect are different outcomes. Keep them distinct
            in the layer that owns the recovery decision. A Promise return
            type cannot express rejected error alternatives; Chapter 20
            compares exceptions with explicit result unions.
          </p>
        </section>

        <section>
          <h2>Test async code at its boundaries</h2>
          <ul>
            <li>Inject fetch, repositories, clocks, or timers when deterministic tests need control.</li>
            <li>Test fulfillment, rejection, empty results, and cancellation separately.</li>
            <li>Await the operation under test so assertions run after settlement.</li>
            <li>Check that stale or aborted work cannot overwrite current state.</li>
            <li>Define a concurrency limit for large batches where the service requires one.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: design a cancellable search</h2>
            <p>
              Define the successful return type for a game search, pass an
              <code>AbortSignal</code> to its transport, and decide how callers
              distinguish an empty result from cancellation and a network
              failure. Then test each path without relying on a live server.
            </p>
          `)}
        </section>
      </article>
    `
});
