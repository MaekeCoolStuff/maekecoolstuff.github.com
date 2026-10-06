import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-24", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 4: TypeScript in the browser · Chapter 24</p>
        <h1>Runtime validation</h1>
        <p>
                Runtime validation converts data from an untrusted source into a
                value that satisfies an application contract. A type guard returns
                a boolean and tells TypeScript what was proven when it returns true.
                The checks themselves must still be real JavaScript checks.
              </p>
              ${renderCodeExample(`type GameCardData = Pick<Game, "id" | "title">;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseGameCard(value: unknown): GameCardData {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.title !== "string"
  ) {
    throw new Error("Invalid game card data.");
  }

  return { id: value.id, title: value.title };
}`)}
              <p>
                The first guard excludes null because JavaScript reports
                <code>typeof null</code> as <code>"object"</code>. After
                <code>isRecord</code> succeeds, fields are still unknown, so each
                one is checked before it is copied into the result. A production
                parser should validate every field it relies on and give useful
                diagnostics.
              </p>
              ${renderWorkedExample(html`
                <p>
                  Check that the value is a non-null object, then verify each
                  property's runtime type before returning a new object containing
                  only the trusted fields. A type assertion alone performs none of
                  those checks.
                </p>
              `)}
        <section>
          <h2>Static types disappear at runtime</h2>
          <p>
            TypeScript checks source code before it runs, then erases most
            annotations. JavaScript receives values, not the types that
            described them. JSON, form fields, local storage, URL parameters,
            and cross-window messages must be treated as untrusted until
            executable code checks them.
          </p>
          ${renderCodeExample(`const payload: unknown = JSON.parse(responseText);
// payload is still the value parsed from responseText.
// An annotation or assertion does not inspect its properties.`)}
          <p>
            <code>unknown</code> is a safe boundary: it accepts any incoming
            value but requires checks before specific operations. Avoid
            <code>any</code>, which lets unverified assumptions spread
            through the program.
          </p>
        </section>

        <section>
          <h2>Build parsers from small checks</h2>
          <p>
            Start with primitive checks, then compose them into arrays,
            records, and domain values. A parser should either return a
            trusted value or report why the input failed the contract. Make
            a new object from validated fields when unknown transport
            properties should not enter the domain model.
          </p>
          ${renderCodeExample(`type GameCard = { id: string; title: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseGameCard(value: unknown): GameCard {
  if (!isRecord(value)) throw new Error("Expected a game object");
  if (typeof value.id !== "string" || value.id.length === 0) {
    throw new Error("Expected a non-empty game ID");
  }
  if (typeof value.title !== "string" || value.title.trim() === "") {
    throw new Error("Expected a non-empty title");
  }
  return { id: value.id, title: value.title.trim() };
}`)}
          <p>
            A successful parse proves only the rules this parser checks. If
            the application relies on unique IDs, allowed platforms, or a
            date range, add those checks too. Trimming text is a
            normalization policy; apply it deliberately and preserve the
            original when that distinction matters.
          </p>
        </section>

        <section>
          <h2>Validate arrays and discriminated unions</h2>
          <p>
            Check that a value is an array before validating its elements.
            For a union, validate the discriminant first, then the fields
            belonging to that branch. Do not accept a state because one
            familiar property happens to exist.
          </p>
          ${renderCodeExample(`type PlayState =
  | { status: "backlog" }
  | { status: "playing"; hoursPlayed: number }
  | { status: "completed"; completedOn?: string };

function parsePlayState(value: unknown): PlayState {
  if (!isRecord(value) || typeof value.status !== "string") {
    throw new Error("Expected a play state");
  }
  switch (value.status) {
    case "backlog":
      return { status: "backlog" };
    case "playing":
      if (typeof value.hoursPlayed !== "number" || !Number.isFinite(value.hoursPlayed)) {
        throw new Error("Expected finite play hours");
      }
      return { status: "playing", hoursPlayed: value.hoursPlayed };
    case "completed":
      if (value.completedOn !== undefined && typeof value.completedOn !== "string") {
        throw new Error("Expected a completion date string");
      }
      return value.completedOn === undefined
        ? { status: "completed" }
        : { status: "completed", completedOn: value.completedOn };
    default:
      throw new Error("Unknown play status: " + value.status);
  }
}

function parseGameCards(value: unknown): GameCard[] {
  if (!Array.isArray(value)) throw new Error("Expected a game list");
  return value.map(parseGameCard);
}`)}
          <p>
            A parser that throws is appropriate when malformed input should
            stop the operation. Return a structured validation result when
            callers need field-level feedback or several errors at once.
            Keep malformed data distinct from an empty but valid list.
          </p>
        </section>

        <section>
          <h2>Predicates are claims that need tests</h2>
          <p>
            A predicate declared as <code>value is GameCard</code> tells the
            checker that true means the value is a GameCard. TypeScript does
            not prove that the function checks every required rule. Keep
            predicates small and test both accepted and rejected values.
          </p>
          ${renderCodeExample(`function isGameCard(value: unknown): value is GameCard {
  if (!isRecord(value)) return false;
  return typeof value.id === "string" &&
    typeof value.title === "string" &&
    value.title.trim().length > 0;
}

function titleOf(value: unknown): string | undefined {
  return isGameCard(value) ? value.title : undefined;
}`)}
          <p>
            The <code>in</code> operator can find inherited properties as
            well as own properties. For JSON-like records, decide whether
            inherited fields are acceptable; use an own-property check when
            the contract requires data stored directly on the object. For
            larger schemas, a validation library can reduce boilerplate, but
            its runtime schema still needs tests.
          </p>
        </section>

        <section>
          <h2>Validation, coercion, and sanitization differ</h2>
          <p>
            Validation asks whether a value meets a contract. Coercion
            converts values, and sanitization transforms content for a
            particular use. Combining them silently can hide malformed
            input. Convert form text intentionally, reject NaN, and enforce
            domain limits separately.
          </p>
          ${renderCodeExample(`function parseHours(value: unknown): number {
  if (typeof value !== "string" && typeof value !== "number") {
    throw new Error("Expected hours as text or number");
  }
  if (typeof value === "string" && value.trim() === "") {
    throw new Error("Hours cannot be empty");
  }
  const hours = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(hours) || hours < 0 || hours > 100000) {
    throw new Error("Hours are outside the accepted range");
  }
  return hours;
}`)}
          <p>
            HTML escaping is context-specific and is not validation. Prefer
            safe DOM APIs such as <code>textContent</code> for user text; a
            validated string can still be unsafe when concatenated into
            markup or a URL.
          </p>
        </section>

        <section>
          <h2>Report useful failures and test boundaries</h2>
          <p>
            Identify the failing field or safe data path without echoing
            secrets. For a form, return structured errors the UI can connect
            to controls. For a payload, a path like
            <code>games[2].title</code> can help diagnose schema drift.
          </p>
          <ul>
            <li>Test missing fields, wrong types, and boundary values.</li>
            <li>Test every union branch and an unknown discriminator.</li>
            <li>Test empty arrays separately from malformed values.</li>
            <li>Keep trusted domain values separate from raw transport objects.</li>
            <li>Revalidate after migrations or transformations that change shape.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: validate a stored game list</h2>
            <p>
              Accept <code>unknown</code>, require an array, parse each
              entry with <code>parseGameCard</code>, and decide whether one
              invalid entry rejects the whole list or is reported and
              skipped. Document and test that recovery rule.
            </p>
          `)}
        </section>
      </article>
    `
});
