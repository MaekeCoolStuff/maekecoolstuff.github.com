import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-12", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 2: Describing data · Chapter 12</p>
        <h1>Narrowing types</h1>
        <p>
                A union is safe only if code handles the value it actually receives.
                Narrowing is TypeScript's way of removing impossible alternatives
                after a runtime check. Checks such as <code>typeof</code>, equality,
                the <code>in</code> operator, and a discriminant switch all provide
                evidence the checker can follow.
              </p>
              ${renderCodeExample(`function stateLabel(state: PlayState): string {
  switch (state.status) {
    case "backlog":
      return "Waiting to be played";
    case "playing":
      return state.hoursPlayed + " hours played";
    case "completed":
      return state.completedOn ?? "Completed";
    default:
      return assertNever(state);
  }
}

function assertNever(value: never): never {
  throw new Error("Unhandled play state");
}`)}
              <p>
                Inside each case, the discriminant narrows <code>state</code> to one
                alternative, so <code>hoursPlayed</code> is only available in the
                playing branch. The <code>never</code> parameter makes the switch
                exhaustive: if a new status is added but not handled, the call to
                <code>assertNever</code> becomes a type error.
              </p>
              <p>
                Narrowing must be based on a real check. A type assertion such as
                <code>value as string</code> only tells the checker to trust you; it
                does not inspect or convert the value. For external input, validate
                first, then use the checked value.
              </p>
              ${renderWorkedExample(html`
                ${renderCodeExample(`function selectedTitle(game: Game | undefined): string {
  if (game === undefined) {
    return "No game selected";
  }

  return game.title;
}`)}
                <p>
                  The early return handles the undefined case. After that check,
                  TypeScript knows <code>game</code> is a <code>Game</code>, so its
                  title can be read safely.
                </p>
              `)}
        <section>
          <h2>Narrowing follows runtime evidence</h2>
          <p>
            A union describes the possibilities before a check. Narrowing is
            the checker following control flow and removing alternatives that
            cannot match the evidence. A useful guard both protects runtime
            behavior and lets TypeScript know what operations are safe below
            that point.
          </p>
          ${renderCodeExample(`function labelInput(value: string | number): string {
  if (typeof value === "string") {
    return value.trim();
  }
  return value.toFixed(1);
}`)}
          <p>
            TypeScript knows the true branch contains a string and the remaining
            branch contains a number. The guard is executable JavaScript, not
            a declaration of what the value should have been.
          </p>
        </section>

        <section>
          <h2>Built-in checks cover common cases</h2>
          <p>
            Use <code>typeof</code> for primitive distinctions, strict equality
            for literal or nullish cases, <code>Array.isArray</code> for
            arrays, <code>instanceof</code> for class instances, and
            <code>in</code> for properties that distinguish object shapes.
            Remember that <code>typeof null</code> is <code>"object"</code>,
            and arrays are objects too; choose a check that matches the value
            you are testing.
          </p>
          ${renderCodeExample(`function describe(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array with " + value.length + " items";
          if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value.toUpperCase();
  if (typeof value === "number") return value.toFixed(1);
  if (typeof value === "object") return "object";
  return "other primitive";
}`)}
          <p>
            An early return removes a possibility from the path that follows.
            Equality checks can also narrow a literal union, while a
            <code>switch</code> on a shared discriminant is usually clearest
            for a state union.
          </p>
          <p>
            Truthiness checks can narrow too, but they group all falsey values
            together. Do not use <code>if (value)</code> when zero or empty
            text is valid data; check specifically for null or
            <code>undefined</code> in that case. <code>instanceof</code> is
            useful for class instances, but its identity check can fail across
            JavaScript realms such as separate frames.
          </p>
        </section>

        <section>
          <h2>Use discriminants and exhaustive switches</h2>
          <p>
            A discriminated union narrows when code checks its shared literal
            field. An exhaustive switch makes a future addition visible:
            after all known cases return, the remaining value should be
            <code>never</code>. If a new alternative is added, the final
            check fails until the new case is handled.
          </p>
          ${renderCodeExample(`function assertNever(value: never): never {
  throw new Error("Unhandled value: " + String(value));
}

function stateLabel(state: PlayState): string {
  switch (state.status) {
    case "backlog": return "Not started";
    case "playing": return state.hoursPlayed + " hours played";
    case "completed": return state.completedOn ?? "Completed";
    default: return assertNever(state);
  }
}`)}
          <p>
            <code>never</code> is a compile-time signal here; the helper's
            thrown error is a last-resort runtime safeguard if an impossible
            value arrives from untyped JavaScript. Exhaustive handling is
            particularly useful for application state and user actions.
          </p>
        </section>

        <section>
          <h2>Narrow unknown data before trusting it</h2>
          <p>
            Narrowing is also the beginning of runtime validation. A
            <code>typeof</code> check can validate a primitive, but a plain
            <code>typeof value === "object"</code> does not validate an
            object's fields. Check required properties and their values before
            claiming a structured domain type.
          </p>
          ${renderCodeExample(`type Game = { id: string; title: string };

function isGame(value: unknown): value is Game {
  if (typeof value !== "object" || value === null) return false;
  if (!("id" in value) || !("title" in value)) return false;
  return typeof value.id === "string" && typeof value.title === "string";
}

function readTitle(value: unknown): string | undefined {
  if (!isGame(value)) return undefined;
  return value.title;
}`)}
          <p>
            A type predicate such as <code>value is Game</code> is a promise
            that the function's boolean result matches its claim. TypeScript
            checks that it returns a boolean, not that the implementation
            validates every field correctly. Test guards, and use a schema
            validator for large or security-sensitive formats. For plain JSON,
            decide whether inherited properties should count; an own-property
            check may be needed when only data fields are trusted.
          </p>
        </section>

        <section>
          <h2>Control flow can change a narrowing</h2>
          <p>
            Narrowing is path-sensitive. Reassignment can widen a local back
            to its declared possibilities. Aliases to mutable objects can also
            make a runtime fact change while another reference still exists.
            Keep checks close to the operation that relies on them, and do not
            retain an assumption across an asynchronous boundary if the
            underlying data may change.
          </p>
          ${renderCodeExample(`function announce(game: Game | undefined): void {
  if (game === undefined) return;
  console.log(game.title); // game is a Game on this path.
}`)}
          <p>
            Prefer explicit guards and early returns over non-null assertions
            such as <code>game!.title</code>. A non-null assertion removes a
            compile-time warning but does not prevent a runtime null access.
          </p>
        </section>

        <section>
          <h2>Practice: turn checks into guarantees</h2>
          <ol>
            <li>Write a function that accepts <code>string | undefined</code> and returns a fallback for absence.</li>
            <li>Use <code>Array.isArray</code> to distinguish a list from another unknown value.</li>
            <li>Handle every <code>PlayState</code> case and let the compiler find an omitted case.</li>
            <li>Implement and test a guard for an object with an ID and title.</li>
          </ol>
          <p>
            A check is valuable only when it corresponds to a real runtime
            guarantee. Assertions and type predicates cannot replace the code
            that verifies the value.
          </p>
        </section>
      </article>
    `
});
