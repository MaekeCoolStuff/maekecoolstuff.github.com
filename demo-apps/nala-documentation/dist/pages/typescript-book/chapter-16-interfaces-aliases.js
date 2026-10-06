import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-16", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 3: Building with types · Chapter 16</p>
        <h1>Interfaces and type aliases</h1>
        <p>
                Both interfaces and type aliases can describe object shapes. Prefer
                the form that makes the contract clearest and follow the conventions
                of the codebase. Interfaces are designed to describe extendable
                object contracts; aliases can name object shapes too, and are also
                needed for unions, tuples, and other type expressions.
              </p>
              ${renderCodeExample(`interface GameSummary {
  id: string;
  title: string;
}

interface SearchableGame extends GameSummary {
  platforms: readonly Platform[];
}

type SearchResult =
  | { kind: "found"; game: SearchableGame }
  | { kind: "missing"; query: string };`)}
              <p>
                <code>SearchableGame</code> adds a property to an existing interface.
                <code>SearchResult</code> is a choice between two different outcomes,
                so a type alias is a natural fit. Both forms are structural: a value
                is compatible when it has the required members. Neither form creates
                a runtime validator.
              </p>
              ${renderWorkedExample(html`
                <p>
                  An interface is a clear choice for the extendable
                  <code>GameSummary</code> object. A type alias is required for the
                  union-shaped <code>SearchResult</code>. An object alias would also
                  work for the first contract; consistency and clarity matter more
                  than a universal rule.
                </p>
              `)}
        <section>
          <h2>Choose by the shape you need to express</h2>
          <p>
            Interfaces and type aliases can both name object contracts.
            Interfaces can be extended and participate in declaration
            merging; aliases can name unions, tuples, primitives, and other
            type expressions as well as objects. Neither is a runtime value
            or validator. Choose the form that fits the model and the
            repository's conventions rather than following a universal
            slogan.
          </p>
          ${renderCodeExample(`interface GameSummary {
  id: string;
  title: string;
}

type GameIdentity = {
  id: string;
  title: string;
};

type PlayState =
  | { status: "backlog" }
  | { status: "playing"; hoursPlayed: number };`)}
          <p>
            The interface and object alias both describe a compatible
            structure. The union needs a type alias because it combines
            alternatives. TypeScript's structural compatibility means a
            value can satisfy either object contract without explicitly
            naming it.
          </p>
        </section>

        <section>
          <h2>Extend contracts deliberately</h2>
          <p>
            An interface can extend one or more object contracts. This makes
            required additions explicit and reports incompatible inherited
            properties. An intersection composes types too, but overlapping
            conflicts may produce an impossible property instead of an
            extension error. Choose the composition form whose behavior is
            easiest to review.
          </p>
          ${renderCodeExample(`interface Identified {
  id: string;
}

interface SearchableGame extends Identified {
  title: string;
  platforms: readonly Platform[];
}

type Timestamped = { updatedAt: string };
type SavedGame = SearchableGame & Timestamped;`)}
          <p>
            Use inheritance for a real “is also this contract” relationship,
            not merely to reduce a few repeated lines. Prefer composing small
            capability types when independently reusable concepts are clear.
          </p>
        </section>

        <section>
          <h2>Interfaces can describe callable and constructable objects</h2>
          <p>
            An object contract can include methods, call signatures, and
            index signatures. Most application APIs should use straightforward
            property and method shapes; callable objects are useful for
            specialized libraries, while constructors are often better
            described with an explicit constructor type at the boundary.
          </p>
          ${renderCodeExample(`interface GameRepository {
  findById(id: string): Game | undefined;
  save(game: Game): void;
}

type GamePredicate = (game: Game) => boolean;

interface ScoreTable {
  [gameId: string]: number;
}`)}
          <p>
            Interfaces only describe what the checker can require. A class
            can <code>implements</code> an interface, and a plain object can
            satisfy it structurally. Neither route inserts runtime checks.
          </p>
        </section>

        <section>
          <h2>Declaration merging is powerful and global</h2>
          <p>
            Repeating an interface declaration with the same name in the same
            scope merges its members. This is used by some platform and
            library declaration files to support augmentation. It can also
            make a contract change far from its definition, so avoid relying
            on merging for ordinary application models. Type aliases cannot
            be reopened this way.
          </p>
          ${renderCodeExample(`interface GameMetadata {
  source: "catalog" | "user";
}

// A second declaration in the same scope would merge another member.
// Use module augmentation only when extending a third-party declaration is intentional.`)}
          <p>
            Keep augmentations narrow, scoped, and documented. Accidental
            global declarations can affect unrelated modules and make type
            errors difficult to trace.
          </p>
        </section>

        <section>
          <h2>Keep public contracts stable</h2>
          <ul>
            <li>Export only contracts callers are meant to depend on.</li>
            <li>Use aliases for unions and tuples; use either form for object shapes.</li>
            <li>Use extension when it clarifies substitutability, not just for code reuse.</li>
            <li>Keep declaration merging deliberate because it changes the whole scope.</li>
            <li>Remember that compile-time compatibility does not validate external data.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: design a package boundary</h2>
            <p>
              Define the public contract for a game catalog that can search by
              ID and save a game. Decide which names should be exported,
              whether object contracts need extension, and which private
              implementation details should remain hidden.
            </p>
          `)}
        </section>
      </article>
    `
});
