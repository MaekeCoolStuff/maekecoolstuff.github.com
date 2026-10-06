import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-09", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 2: Describing data · Chapter 9</p>
        <h1>Object types</h1>
        <p>
                An object type describes the properties an object must or may have.
                TypeScript uses structural typing: a value is compatible when it has
                the required members with compatible types. The name of its type is
                not what makes it compatible.
              </p>
              ${renderCodeExample(`type Game = {
  readonly id: string;
  title: string;
  platform: string;
  releaseYear?: number;
};

const game: Game = {
  id: "g-1",
  title: "Celeste",
  platform: "PC",
};

const catalogEntry = {
  id: "g-2",
  title: "Hades",
  platform: "PC",
  releaseYear: 2020,
  publisher: "Supergiant Games",
};

const displayedGame: Game = catalogEntry;`)}
              <p>
                The question mark makes <code>releaseYear</code> optional. Reading it
                may produce <code>undefined</code>, so code that uses the year must
                account for its absence. <code>readonly</code> prevents assignment
                to <code>id</code> through this typed reference, but does not freeze
                the JavaScript object at runtime.
              </p>
              <p>
                The extra <code>publisher</code> member does not make
                <code>catalogEntry</code> incompatible with <code>Game</code>:
                structural typing permits additional members on an existing value.
                Fresh object literals also receive excess-property checks, which are
                useful for catching misspelled field names; that check is not a
                general exact-object-type guarantee.
              </p>
              ${renderWorkedExample(html`
                ${renderCodeExample(`type Game = {
  readonly id: string;
  title: string;
  releaseYear?: number;
};`)}
                <p>
                  An omitted optional property is allowed. <code>title</code> has no
                  question mark, so it is required; leaving it out violates the
                  object shape. A write such as <code>game.id = "g-2"</code> is
                  rejected through a reference typed as <code>Game</code>.
                </p>
              `)}
        <section>
          <h2>Object types describe capabilities and shape</h2>
          <p>
            TypeScript is structurally typed: compatibility depends on having
            the required properties with compatible types, not on explicitly
            declaring a particular type name. Object types let an API say
            exactly which fields it needs, without requiring callers to share
            one class hierarchy.
          </p>
          ${renderCodeExample(`type HasTitle = { title: string };

function formatTitle(item: HasTitle): string {
  return item.title.toUpperCase();
}

const game = { id: "g-1", title: "Celeste", platform: "PC" };
formatTitle(game); // Extra properties are allowed on this existing value.`)}
          <p>
            <code>formatTitle</code> depends only on <code>title</code>. That
            small contract accepts a game, a search result, or a test fixture
            that provides the same capability. Model what the function uses,
            not every property that happens to exist on the current object.
          </p>
        </section>

        <section>
          <h2>Required, optional, and readonly properties</h2>
          <p>
            A required property must exist. A property marked with
            <code>?</code> may be absent; reading it produces a value that
            might be <code>undefined</code>. <code>readonly</code> prevents
            assignment through that typed reference. These modifiers describe
            how code may use an object; they do not add runtime checks or deep
            freezing.
          </p>
          ${renderCodeExample(`type GameSummary = {
  readonly id: string;
  title: string;
  releaseYear?: number;
};

function describeYear(game: GameSummary): string {
  if (game.releaseYear === undefined) return "Release year unknown";
  return String(game.releaseYear);
}

const summary: GameSummary = { id: "g-1", title: "Celeste" };`)}
          <p>
            Under the usual optional-property rules,
            <code>releaseYear?: number</code> means the property may be absent
            and, when present, contains a number. Projects can enable
            <code>exactOptionalPropertyTypes</code> for stricter distinction
            between absence and an explicit <code>undefined</code> assignment.
            Readonly is shallow: a readonly property that points at a mutable
            object does not make that nested object readonly.
          </p>
        </section>

        <section>
          <h2>Object literals receive helpful checks</h2>
          <p>
            When a fresh object literal is checked against a target type,
            TypeScript performs an excess-property check. This often catches a
            misspelled field at the point where the literal is written. It is
            not an exact-object guarantee: once a value has been assigned to a
            variable, structural compatibility allows additional properties.
          </p>
          ${renderCodeExample(`type Game = { id: string; title: string };

const direct: Game = { id: "g-1", title: "Hades" };
// const typo: Game = { id: "g-2", title: "Tunic", platfrom: "PC" };

const detailed = { id: "g-3", title: "Celeste", platform: "PC" };
const accepted: Game = detailed; // Has the required members.`)}
          <p>
            Do not rely on excess-property checks to validate external objects.
            They apply to particular source expressions during static checking;
            runtime JSON can contain missing, misspelled, or unexpected data.
            Validate external values at runtime when correctness or security
            depends on their shape.
          </p>
        </section>

        <section>
          <h2>Index signatures describe dictionaries</h2>
          <p>
            A named object type describes known fields. An index signature
            describes a collection of properties whose keys share a type. Use
            it when a dictionary is genuinely open-ended, not as a shortcut for
            a record with a few well-known fields. An index signature also
            constrains the types of named properties on that same object.
          </p>
          ${renderCodeExample(`type PlayCounts = {
  [gameId: string]: number;
};

const counts: PlayCounts = { "g-1": 4, "g-2": 1 };
const count = counts["g-1"];

type Settings = { theme: "light" | "dark"; showArchived: boolean };
const settings: Settings = { theme: "dark", showArchived: false };`)}
          <p>
            With an open string index signature, looking up a key that was
            never assigned can return <code>undefined</code> at runtime. Enable
            <code>noUncheckedIndexedAccess</code> when the project should
            reflect this possibility in the type, or perform an explicit
            existence check. For a small fixed set of fields, a normal object
            shape is clearer than a dictionary.
          </p>
        </section>

        <section>
          <h2>Object spread is shallow and ordered</h2>
          <p>
            Object spread copies enumerable own properties into a new object.
            Later properties overwrite earlier properties with the same key.
            Nested objects remain shared references, and spread does not copy
            prototype methods or property descriptors. It is useful for plain
            data updates, not a universal clone operation.
          </p>
          ${renderCodeExample(`const game = { title: "Hades", details: { hours: 20 } };
const changed = { ...game, title: "Hades II" };
changed.details.hours = 21;

console.log(game.title); // "Hades"
console.log(game.details.hours); // 21: nested object was shared.`)}
          <p>
            If a nested value should change independently, copy that nested
            value as part of the update. A type annotation does not change
            JavaScript's reference semantics.
          </p>
        </section>

        <section>
          <h2>Design object contracts at the point of use</h2>
          <ul>
            <li>Use a focused shape for a function's actual requirements.</li>
            <li>Use optional properties only when absence is meaningful.</li>
            <li>Distinguish static readonly access from runtime immutability.</li>
            <li>Use index signatures only for open-ended key spaces.</li>
            <li>Validate data from outside the typed program at runtime.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: optional data</h2>
            <p>
              Write a function that formats a game title and release year. It
              should produce a useful fallback when no release year is known,
              and it must not mutate the input object.
            </p>
            ${renderCodeExample(`function gameLabel(game: GameSummary): string {
  const year = game.releaseYear === undefined
    ? "year unknown"
    : String(game.releaseYear);
  return game.title + " (" + year + ")";
}`)}
          `)}
        </section>
      </article>
    `
});
