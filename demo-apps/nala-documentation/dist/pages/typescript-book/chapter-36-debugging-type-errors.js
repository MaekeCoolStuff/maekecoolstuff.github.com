import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-36", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 6: Professional TypeScript · Chapter 36</p>
        <h1>Debugging type errors</h1>
        <p>
                A type error is a disagreement between the code and the model the
                checker can prove. Start with the first diagnostic, inspect the
                actual inferred type, and trace the value back to where it entered
                the function. Reduce a complicated expression to named intermediate
                values before reaching for a cast.
              </p>
        <section>
          <h2>Read the diagnostic before changing the code</h2>
          <p>
            A diagnostic reports where the checker found a disagreement
            between an operation and the types it can prove. Start with the
            first relevant error, read both the actual and expected types,
            and trace the value back to its declaration or boundary. Later
            errors may be consequences of the first broken assumption.
          </p>
          <p>
            Do not immediately add a cast, disable strictness, or widen a
            type to <code>any</code>. First decide whether the code is
            wrong, the model is incomplete, or external data has not been
            validated. The right fix depends on which of those contracts
            failed.
          </p>
          ${renderCodeExample(`function showHours(hours: number): string {
  return hours.toFixed(1);
}

const formText: string = "12";
// showHours(formText); // Find the boundary mismatch before converting.`)}
        </section>

        <section>
          <h2>Use the editor to inspect inference</h2>
          <p>
            Hover a name to inspect its inferred type, navigate to the
            declaration that introduced it, and extract a complicated
            expression into a named intermediate value. Smaller expressions
            make it easier to locate whether the issue is a union member,
            missing field, wrong literal, or unexpected undefined value.
          </p>
          ${renderCodeExample(`const selected = games.find((game) => game.id === requestedId);
const title = selected?.title;

if (selected === undefined) {
  return "No game selected";
}
return selected.title;`)}
          <p>
            TypeScript narrows after the early return. If the result is still
            too broad, inspect the source collection type and the predicate
            rather than asserting a narrower result without evidence.
          </p>
        </section>

        <section>
          <h2>Classify common error shapes</h2>
          <ul>
            <li>Assignment errors often mean a value is too broad, incomplete, or in the wrong domain.</li>
            <li>Property errors often mean a union has not been narrowed or a runtime boundary is unknown.</li>
            <li>Argument errors often reveal a mismatch between a function contract and its caller.</li>
            <li>Generic errors often mean a relationship or constraint is missing.</li>
            <li>Large downstream error lists often follow one earlier root cause.</li>
          </ul>
          ${renderCodeExample(`type Result =
  | { status: "success"; game: Game }
  | { status: "error"; message: string };

function titleFor(result: Result): string {
  if (result.status === "error") return result.message;
  return result.game.title;
}`)}
          <p>
            If <code>game</code> is unavailable in a branch, narrow the
            discriminant or change the model if the union does not reflect
            the real domain. Avoid adding optional fields to every variant
            just to make property access compile.
          </p>
        </section>

        <section>
          <h2>Check configuration and module context</h2>
          <p>
            Some apparent source errors come from the project model: a file
            may be excluded, a dependency may resolve through a different
            entry point, or a library setting may not include the runtime
            API. Confirm that the editor and command line use the same
            configuration and that the checked file belongs to the intended
            project.
          </p>
          <p>
            When a type error depends on several abstractions, reduce it to
            a minimal example that preserves the error. Remove unrelated
            properties and overloads until the failing relationship is
            obvious; then fix the actual contract and restore the callers.
          </p>
        </section>

        <section>
          <h2>Use suppression only for intentional errors</h2>
          <p>
            <code>@ts-expect-error</code> can document a line that is
            intentionally invalid, such as a negative type test. The
            compiler reports an error if the expected failure disappears.
            Keep it immediately above the relevant line and explain why the
            invalid operation is being tested.
          </p>
          ${renderCodeExample(`// @ts-expect-error A numeric title must stay rejected.
const invalidTitle: string = 42;`)}
          <p>
            Prefer <code>@ts-expect-error</code> over
            <code>@ts-ignore</code> when suppression is truly necessary.
            Neither should be used to hush a production mismatch. Keep
            intentional error examples out of normal application paths and
            verify any escape hatch at runtime when safety depends on it.
          </p>
          ${renderWorkedExample(html`
            <h2>Practice: find the root cause</h2>
            <p>
              Given a diagnostic that says an optional game may be
              undefined, trace whether the function can truly return no
              result. If so, handle absence. If not, strengthen the source
              contract or invariant instead of asserting non-null at every
              caller.
            </p>
          `)}
        </section>
              ${renderCodeExample(`const statusLabels = {
  backlog: "Backlog",
  playing: "In progress",
  completed: "Completed",
} satisfies Record<PlayState["status"], string>;

function labelFor(status: PlayState["status"]): string {
  return statusLabels[status];
}`)}
              <p>
                <code>satisfies</code> checks that the object covers the required
                keys and has string values, while preserving the specific inferred
                type of the object. If a status is added, the missing key becomes an
                actionable error at the declaration rather than a mystery at a
                distant call site.
              </p>
              ${renderWorkedExample(html`
                <p>
                  Inspect the union of allowed statuses and the keys of the label
                  object. Add the legitimate missing label or correct an incorrect
                  status. A cast would hide the missing case instead of fixing it.
                </p>
              `)}
      </article>
    `
});
