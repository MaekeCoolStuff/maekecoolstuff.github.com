import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-08", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 2: Describing data · Chapter 8</p>
        <h1>Primitive, literal, and special types</h1>
        <p>
                The primitive types describe common JavaScript values: strings,
                numbers, and booleans. A literal type describes one exact value. Use
                literal types when a field should only accept a small, intentional
                set of values; the next chapters will combine them into unions.
              </p>
              ${renderCodeExample(`type PlayStatus = "backlog" | "playing" | "completed";

let status: PlayStatus = "backlog";
status = "playing";
// status = "paused"; // Not one of the allowed values.

let selectedTitle: string | undefined;
const externalValue: unknown = "Celeste";

function fail(message: string): never {
  throw new Error(message);
}`)}
              <p>
                With <code>strictNullChecks</code> enabled, <code>null</code> and
                <code>undefined</code> are distinct values that must be accounted for
                in a type. Here, <code>selectedTitle</code> may not contain a title
                yet. <code>unknown</code> is the safe type for a value whose shape is
                not known: you cannot use it as a string until you check it.
              </p>
              <p>
                <code>never</code> describes a value that cannot occur. A function
                that always throws, like <code>fail</code>, never returns normally.
                Later, we will also use <code>never</code> to make the checker catch
                missing cases in a union.
              </p>
              ${renderWorkedExample(html`
                <ul>
                  <li>
                    Use a literal union such as
                    <code>"backlog" | "playing" | "completed"</code> for the
                    finite status options.
                  </li>
                  <li>
                    Use <code>string | undefined</code> when there may be no
                    selected title yet.
                  </li>
                  <li>
                    Use <code>unknown</code> for untrusted input, then validate or
                    narrow it before treating it as a string or another specific
                    type.
                  </li>
                </ul>
              `)}
        <section>
          <h2>Primitive types describe JavaScript values</h2>
          <p>
            The everyday primitive types are <code>string</code>,
            <code>number</code>, <code>boolean</code>, <code>bigint</code>,
            <code>symbol</code>, <code>null</code>, and
            <code>undefined</code>. TypeScript's lowercase primitive names are
            the normal spelling. Avoid wrapper types such as
            <code>String</code>, <code>Number</code>, and <code>Boolean</code>;
            those name JavaScript objects rather than primitive values and
            behave unexpectedly in type positions.
          </p>
          ${renderCodeExample(`let title: string = "Celeste";
let hoursPlayed: number = 12;
let isFavorite: boolean = true;
let largeCounter: bigint = 9007199254740993n;
const marker: unique symbol = Symbol("game-marker");`)}
          <p>
            JavaScript has one ordinary <code>number</code> type for whole and
            fractional values. It includes <code>NaN</code> and infinities, so
            a number annotation alone does not guarantee a finite measurement.
            Use <code>Number.isFinite</code> when the domain requires one.
            Bigints and symbols have specialized uses; do not choose them just
            to decorate ordinary counters or keys.
          </p>
        </section>

        <section>
          <h2>Literal types express exact values</h2>
          <p>
            A literal type represents one exact string, number, boolean, or
            bigint value. Literal types are useful for configuration constants,
            command names, and finite domain choices. A union of string
            literals is often a clearer application alternative to an
            unrestricted string or a runtime enum.
          </p>
          ${renderCodeExample(`type PlayStatus = "backlog" | "playing" | "completed";
let status: PlayStatus = "backlog";
status = "playing";
// status = "paused"; // Error: not an allowed status.

const defaultStatus = "backlog"; // Literal type "backlog".
let currentStatus = "backlog"; // Wider type string.`)}
          <p>
            Use a finite set when values have domain meaning and misspellings
            should be caught. Do not make an entire text field a literal union
            when users can supply arbitrary text. The union chapter explains
            how literal alternatives combine into state models.
          </p>
        </section>

        <section>
          <h2>unknown, any, and safe uncertainty</h2>
          <p>
            Use <code>unknown</code> when a value exists but its shape has not
            been established. It accepts any incoming value, but the checker
            requires a check before an operation that assumes a specific type.
            <code>any</code> turns off those checks for that value and its
            downstream uses; it can hide mistakes across a large area.
          </p>
          ${renderCodeExample(`const textFromStorage = '{"title":"Celeste"}';
const input: unknown = JSON.parse(textFromStorage);

if (typeof input === "string") {
  console.log(input.toUpperCase());
}

const unchecked: any = input;
unchecked.toUpperCase(); // No useful static protection.`)}
          <p>
            Keep <code>any</code> at unavoidable boundaries only, such as
            temporarily migrating untyped legacy code, and contain it behind a
            checked API. A cast from <code>any</code> is not validation. Prefer
            <code>unknown</code> for JSON, caught errors, and values from
            untyped systems, then narrow or validate them before use.
          </p>
        </section>

        <section>
          <h2>null, undefined, void, and never</h2>
          <p>
            With <code>strictNullChecks</code>, <code>null</code> and
            <code>undefined</code> are distinct values that must be included in
            a type when they are possible. A missing array lookup or optional
            property commonly produces <code>undefined</code>. Choose a
            consistent convention for intentional absence and check it before
            reading the value.
          </p>
          ${renderCodeExample(`let selectedTitle: string | undefined;
selectedTitle = "Celeste";

function logSelection(title: string | undefined): void {
  if (title === undefined) return;
  console.log(title);
}

function fail(message: string): never {
  throw new Error(message);
}`)}
          <p>
            <code>void</code> describes a function result callers should not
            use as a meaningful value; the function can still perform an
            action. <code>never</code> describes a path that cannot finish
            normally, such as a function that always throws or an impossible
            branch. Exhaustive union handling uses <code>never</code> later in
            this part.
          </p>
        </section>

        <section>
          <h2>Useful and misleading broad types</h2>
          <p>
            The type <code>object</code> means a non-primitive value; it does
            not describe the properties that value contains. The global
            <code>Function</code> type is similarly too broad to express a
            useful call contract. Prefer a specific object shape and a
            specific function signature when those values cross an API
            boundary. A type alias can give a meaningful name to a reusable
            description.
          </p>
          ${renderCodeExample(`type GameId = string;
type Game = { id: GameId; title: string };
type TitleFormatter = (game: Game) => string;

const formatTitle: TitleFormatter = (game) => game.title;
const displayName = formatTitle({ id: "g-1", title: "Tunic" });`)}
          <p>
            <code>GameId</code> is still a string at runtime and accepts any
            string at compile time; a plain alias does not create a distinct
            nominal type. More advanced modeling can add stronger distinctions,
            but begin with the simplest type that captures the current
            requirement.
          </p>
        </section>

        <section>
          <h2>Practice: choose the honest type</h2>
          <ul>
            <li>Use <code>string</code> for a player-entered title.</li>
            <li>Use a literal union for the fixed play-status choices.</li>
            <li>Use <code>string | undefined</code> when no game may be selected.</li>
            <li>Use <code>unknown</code> for unvalidated parsed data.</li>
            <li>Use <code>void</code> for an action result and <code>never</code> for a path that cannot return.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Reason from the value's origin</h2>
            <p>
              A user may type any title, so it is a string. A menu exposes a
              fixed set of statuses, so a literal union is appropriate. A
              server response begins unknown because a declaration does not
              inspect it. Choose types based on the guarantees actually
              available at each boundary.
            </p>
          `)}
        </section>
      </article>
    `
});
