import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-20", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 3: Building with types · Chapter 20</p>
        <h1>Errors and result modeling</h1>
        <p>
                JavaScript exceptions are useful when a function cannot continue or
                when a failure is exceptional. A Result union is useful when failure
                is an expected outcome that callers should handle explicitly. Type
                the error cases as data when the caller needs to branch on them; do
                not catch every error and silently pretend the operation succeeded.
              </p>
              ${renderCodeExample(`type GameLookupResult =
  | { ok: true; value: Game }
  | { ok: false; error: "not-found" | "offline" };

function lookupMessage(result: GameLookupResult): string {
  if (result.ok) return result.value.title;
  if (result.error === "not-found") return "No matching game.";
  return "The collection could not be reached.";
}`)}
              <p>
                Checking <code>ok</code> narrows the result to success or failure.
                The error field then distinguishes expected failure cases. The
                caller must still account for truly unexpected exceptions, such as
                a programming error or a failed invariant.
              </p>
              ${renderWorkedExample(html`
                ${renderCodeExample(`type GameLookupResult =
  | { ok: true; value: Game }
  | { ok: false; error: "not-found" | "offline" | "timeout" };

function lookupMessage(result: GameLookupResult): string {
  if (result.ok) return result.value.title;
  if (result.error === "not-found") return "No matching game.";
  if (result.error === "offline") return "The collection could not be reached.";
  return "The request timed out.";
}`)}
                <p>
                  The false branch is narrowed to the two declared error strings;
                  adding another error later makes the handling decision visible
                  where the result is consumed.
                </p>
              `)}
        <section>
          <h2>Choose between exceptions and result values</h2>
          <p>
            Use exceptions when a function cannot continue normally or when
            failure is exceptional for its contract. Use a result union when
            failure is expected and callers should branch on it during
            ordinary control flow. A result makes expected alternatives
            visible, but it does not prevent unrelated programming errors
            from throwing.
          </p>
          ${renderCodeExample(`type Result<Value, Failure> =
  | { ok: true; value: Value }
  | { ok: false; error: Failure };

type LookupError = "not-found" | "offline";

function lookupGame(id: string): Result<Game, LookupError> {
  const game = games.find((item) => item.id === id);
  return game === undefined
    ? { ok: false, error: "not-found" }
    : { ok: true, value: game };
}`)}
          <p>
            The generic result keeps the success value and failure
            alternatives connected to one reusable shape. Make error cases
            specific enough for callers to decide what to do; a single
            <code>"failed"</code> string is not useful if retry and recovery
            differ by cause.
          </p>
        </section>

        <section>
          <h2>Handle caught values as unknown</h2>
          <p>
            JavaScript permits throwing any value. With strict settings,
            TypeScript treats a caught value as <code>unknown</code>. Narrow
            it before reading a message, then add context where the failed
            operation is understood.
          </p>
          ${renderCodeExample(`try {
  await repository.save(game);
} catch (cause: unknown) {
  if (cause instanceof Error) {
    console.error("Could not save the game", cause.message);
  } else {
    console.error("Could not save the game", String(cause));
  }
}`)}
          <p>
            Do not catch only to log and continue as if the save succeeded.
            Recover, translate a known failure into a stable application
            result, or rethrow it with useful context and the original cause
            when appropriate.
          </p>
          ${renderCodeExample(`class SaveGameError extends Error {
  constructor(gameId: string, options?: ErrorOptions) {
    super("Failed to save game " + gameId, options);
    this.name = "SaveGameError";
  }
}

try {
  await repository.save(game);
} catch (cause) {
  throw new SaveGameError(game.id, { cause });
}`)}
          <p>
            Custom errors help classify failures with <code>instanceof</code>
            in a shared runtime realm. Preserve a cause for diagnostics, but
            do not expose raw database details, credentials, or personal data
            in messages shown to users.
          </p>
        </section>

        <section>
          <h2>Make result handling exhaustive</h2>
          <p>
            A discriminated result makes success and expected failure cases
            visible in control flow. An exhaustive switch makes a newly added
            error alternative a compile-time prompt to update each consumer.
          </p>
          ${renderCodeExample(`function assertNever(value: never): never {
  throw new Error("Unhandled result: " + String(value));
}

function messageFor(result: Result<Game, LookupError>): string {
  if (result.ok) return "Found " + result.value.title;
  switch (result.error) {
    case "not-found": return "No game has that ID.";
    case "offline": return "The catalog is unavailable.";
    default: return assertNever(result.error);
  }
}`)}
          <p>
            The success branch can read the game; the failure branch can
            inspect its declared error. If a new error is added to
            <code>LookupError</code>, the exhaustive check points to the
            consumer that needs a new decision.
          </p>
        </section>

        <section>
          <h2>Promises do not declare rejected error types</h2>
          <p>
            <code>Promise&lt;Game&gt;</code> describes a fulfilled game, not
            every possible rejection. Decide whether expected failures should
            be represented by a <code>Result</code>, while unexpected defects
            continue to reject. Do not wrap everything in a result union by
            habit when callers have no meaningful recovery decision.
          </p>
          ${renderCodeExample(`class NetworkError extends Error {}

async function getGame(id: string): Promise<Result<Game, LookupError>> {
  try {
    const game = await repository.fetchById(id);
    if (game === undefined) return { ok: false, error: "not-found" };
    return { ok: true, value: game };
  } catch (cause) {
    if (cause instanceof NetworkError) return { ok: false, error: "offline" };
    throw cause;
  }
}`)}
          <p>
            Translate only failures whose meaning is understood. Do not
            mislabel a programming defect as an offline result, and do not
            show cancellation as a network outage. Keep the policy consistent
            across the API boundary.
          </p>
        </section>

        <section>
          <h2>Handle errors where recovery belongs</h2>
          <ul>
            <li>Validate user input near its control and return actionable feedback.</li>
            <li>Translate transport and storage failures where their context is known.</li>
            <li>Let unexpected defects reach a central reporting boundary.</li>
            <li>Retry only when repeating the operation is safe and likely to help.</li>
            <li>Never silently convert failure into a plausible success value.</li>
            <li>Separate diagnostic details from messages shown to users.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: model recovery decisions</h2>
            <p>
              For a game lookup, represent not-found as an expected result.
              Decide whether a temporary outage should become an offline
              state or reach a shared error boundary. Keep an unexpected bug
              distinct from both outcomes, and explain which layer can recover
              from each one.
            </p>
          `)}
        </section>
      </article>
    `
});
