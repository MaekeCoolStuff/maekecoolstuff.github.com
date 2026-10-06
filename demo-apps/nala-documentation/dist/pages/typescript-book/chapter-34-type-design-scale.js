import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-34", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 6: Professional TypeScript · Chapter 34</p>
        <h1>Type design at scale</h1>
        <p>
                Public types are contracts used by many callers. Keep them stable,
                name domain concepts, and expose the smallest useful surface. A
                generic belongs in an API when it preserves a relationship that
                callers need. Avoid leaking internal implementation details or
                encoding every possible state in a maze of conditional types.
              </p>
              ${renderCodeExample(`type GameReader = {
  findById(id: GameId): Game | undefined;
};

type GameWriter = {
  save(game: Game): Promise<void>;
};

type GameRepository = GameReader & GameWriter;`)}
              <p>
                The small reader and writer contracts can be implemented together
                or separately. A feature that only reads games can depend on
                <code>GameReader</code> and avoid an unnecessary write capability.
                This is easier to test and evolve than a broad service type with
                unrelated responsibilities.
              </p>
              ${renderWorkedExample(html`
                <p>
                  Extract or depend on a <code>GameReader</code> contract with only
                  the methods the search screen uses. The full repository can still
                  implement that contract as well as its write operations.
                </p>
              `)}
        <section>
          <h2>Design types as public contracts</h2>
          <p>
            A public type is an API that other modules and future releases
            rely on. Name domain concepts, expose only useful capabilities,
            and keep implementation details private. A well-designed type
            helps callers do the right thing and makes invalid operations
            difficult to express.
          </p>
          <p>
            Structural typing supports small capability contracts. A
            search feature can depend on a reader interface without gaining
            write methods it never uses. A plain alias such as
            <code>type GameId = string</code> adds a domain name but does
            not make the identifier nominally distinct from every other
            string.
          </p>
          ${renderCodeExample(`type GameReader = {
  findById(id: GameId): Game | undefined;
};

type GameWriter = {
  save(game: Game): Promise<void>;
};

type GameRepository = GameReader & GameWriter;`)}
          <p>
            A feature that only reads games can depend on
            <code>GameReader</code>; a storage adapter may implement both
            contracts. Small capabilities are easier to test and evolve
            than a broad service type with unrelated responsibilities.
          </p>
        </section>

        <section>
          <h2>Model valid states instead of optional-field soup</h2>
          <p>
            Use a discriminated union when alternatives carry different
            data. Required fields belong with the variant that needs them;
            unrelated optional fields can permit contradictory states.
            Keep uncertainty explicit at boundaries, then narrow it before
            business logic depends on a fact.
          </p>
          ${renderCodeExample(`type PlayState =
  | { status: "backlog" }
  | { status: "playing"; hoursPlayed: number }
  | { status: "completed"; completedOn?: string };

function describe(state: PlayState): string {
  switch (state.status) {
    case "backlog": return "Not started";
    case "playing": return state.hoursPlayed + " hours played";
    case "completed": return state.completedOn ?? "Completed";
  }
}`)}
          <p>
            If alternatives are mutually exclusive, a union makes adding
            a new state visible in consumers. If facts can coexist, model
            them independently. Choose according to the domain instead of
            preferring a type form because it appears cleverer.
          </p>
        </section>

        <section>
          <h2>Use generics to preserve relationships</h2>
          <p>
            A generic earns its complexity when it relates inputs and
            outputs or several parameters. Avoid parameters that convey no
            additional information, constraints broader than an algorithm
            needs, and public inferred APIs whose behavior callers cannot
            understand.
          </p>
          ${renderCodeExample(`function getProperty<Value, Key extends keyof Value>(
  value: Value,
  key: Key,
): Value[Key] {
  return value[key];
}

const game = { title: "Tunic", hours: 9 };
const title = getProperty(game, "title"); // string
const hours = getProperty(game, "hours"); // number`)}
          <p>
            The key and result type stay connected. If a domain operation
            always reads one known field, a named function may be easier to
            understand and document than a generic utility. Type-level
            sophistication is not the goal; useful contracts are.
          </p>
        </section>

        <section>
          <h2>Balance precision against complexity</h2>
          <p>
            Literal types and exhaustive unions provide strong guarantees,
            but excessively narrow types can make ordinary evolution
            difficult. Deep conditional and mapped types can slow
            diagnostics and produce errors few teammates can decode.
            Prefer descriptive names, small intermediate types, and
            explicit annotations at public boundaries.
          </p>
          <p>
            Use <code>as const</code> or <code>satisfies</code> when literal
            preservation or configuration checking matters. Neither
            performs runtime validation of external data.
          </p>
        </section>

        <section>
          <h2>Plan compatibility and evolution</h2>
          <p>
            Adding an optional field is often compatible with old callers;
            making a field required or removing a union variant can break
            them. A wider provider type can make consumers do more work; a
            narrower type can reject previously valid inputs. Consider
            both sides of an API before changing a shared contract.
          </p>
          <ul>
            <li>Keep public exports minimal and intentionally versioned.</li>
            <li>Document semantic guarantees, not only property names.</li>
            <li>Use deprecation and migration steps for broad API changes.</li>
            <li>Test supported variants before removing compatibility.</li>
            <li>Separate transport types when their lifecycle differs from domain types.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: review a shared contract</h2>
            <p>
              Review a Game repository type used by search and edit
              screens. Split read and write capabilities if they have
              different owners, then assess whether adding a required
              method would break other implementations and tests.
            </p>
          `)}
        </section>
      </article>
    `
});
