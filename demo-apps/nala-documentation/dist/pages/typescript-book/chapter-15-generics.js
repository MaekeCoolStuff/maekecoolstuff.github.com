import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-15", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 3: Building with types · Chapter 15</p>
        <h1>Generics</h1>
        <p>
                A generic function works with a type supplied by its caller. The
                type parameter connects input and output types, preserving the
                specific information the caller already has. Use a constraint when
                the implementation needs a particular capability, such as an
                <code>id</code> property.
              </p>
              ${renderCodeExample(`function findById<Item extends { id: string }>(
  items: readonly Item[],
  id: string,
): Item | undefined {
  return items.find((item) => item.id === id);
}

const selectedGame = findById(games, "g-1");
// selectedGame is Game | undefined, not just { id: string } | undefined.`)}
              <p>
                TypeScript infers <code>Item</code> as <code>Game</code> from the
                collection argument, so the result retains Game's title, platforms,
                and play state. A non-generic version that accepted only
                <code>{ id: string }</code> would forget those additional useful
                properties. Generics are most valuable when they preserve a
                relationship between types, not merely to avoid repeating a type
                name.
              </p>
              ${renderWorkedExample(html`
                ${renderCodeExample(`function firstOrUndefined<Item>(
  items: readonly Item[],
): Item | undefined {
  return items[0];
}`)}
                <p>
                  The same type parameter describes each array element and the
                  possible result, so passing <code>Game[]</code> produces
                  <code>Game | undefined</code>.
                </p>
              `)}
        <section>
          <h2>A type parameter preserves a relationship</h2>
          <p>
            A generic declaration introduces a type parameter that a caller
            supplies explicitly or that TypeScript infers. The point is not
            merely to replace a concrete type with a letter; a useful generic
            connects input and output so specific information is preserved.
          </p>
          ${renderCodeExample(`function identity<Value>(value: Value): Value {
  return value;
}

const title = identity("Celeste"); // string
const hours = identity(12); // number

function firstOrUndefined<Item>(items: readonly Item[]): Item | undefined {
  return items[0];
}`)}
          <p>
            In <code>firstOrUndefined</code>, the same <code>Item</code>
            describes the array elements and the possible return value. A
            concrete <code>Game[]</code> input therefore produces
            <code>Game | undefined</code>, not a generic object that has lost
            the game's other fields.
          </p>
        </section>

        <section>
          <h2>Infer type arguments before writing them</h2>
          <p>
            TypeScript usually infers generic arguments from function
            parameters. Callers can provide an explicit type argument when
            inference is insufficient or when the desired type is wider than
            the argument's narrow initial value. Explicit arguments should
            clarify intent, not repeat information the compiler already has.
          </p>
          ${renderCodeExample(`function makePair<Left, Right>(left: Left, right: Right): [Left, Right] {
  return [left, right];
}

const pair = makePair("Celeste", 12); // [string, number]
const explicit = makePair<string, number>("Hades", 31);

function emptyList<Item>(): Item[] {
  return [];
}
const games = emptyList<Game>(); // No argument exists for inference.`)}
          <p>
            The final call needs an explicit type because the function has no
            input from which to infer <code>Item</code>. If callers must
            always repeat a type, consider whether the type parameter belongs
            on a containing object or whether a simpler concrete API would be
            clearer.
          </p>
        </section>

        <section>
          <h2>Constraints express required capabilities</h2>
          <p>
            A constraint limits which types may be used as a type argument.
            Inside the generic implementation, only the capabilities stated
            by the constraint are safe to use. Constraints should describe
            what the algorithm needs, not a full application object that
            merely happens to satisfy it.
          </p>
          ${renderCodeExample(`function findById<Item extends { id: string }>(
  items: readonly Item[],
  id: string,
): Item | undefined {
  return items.find((item) => item.id === id);
}

const selected = findById(games, "g-1"); // Game | undefined
// findById([1, 2, 3], "1"); // Error: number has no string id.`)}
          <p>
            The result remains the original <code>Item</code>, so extra
            fields such as title and play state are preserved. A function
            that accepted only <code>{ id: string }</code> as its item type
            could read the identifier but would lose the richer input type in
            its result.
          </p>
        </section>

        <section>
          <h2>Relate keys to property values</h2>
          <p>
            <code>keyof</code> produces the valid keys of a type, and indexed
            access <code>Type[Key]</code> obtains the corresponding property
            type. Together they let a generic function keep a key and its
            value connected, preventing callers from assigning a title to an
            hours field.
          </p>
          ${renderCodeExample(`function getProperty<ObjectType, Key extends keyof ObjectType>(
  object: ObjectType,
  key: Key,
): ObjectType[Key] {
  return object[key];
}

const game = { title: "Tunic", hours: 9 };
const title = getProperty(game, "title"); // string
const hours = getProperty(game, "hours"); // number
// getProperty(game, "platform"); // Error: not a key.`)}
          <p>
            This pattern is useful for safe reusable utilities, but do not
            turn ordinary domain operations into generic puzzles. Prefer a
            direct function when it communicates the product rule more
            clearly than a type-level abstraction.
          </p>
        </section>

        <section>
          <h2>Generic data structures and defaults</h2>
          <p>
            Interfaces and aliases can be generic too. A parameter on the
            container keeps related methods consistent. A default type
            argument is useful when one common type is sensible while callers
            can still specialize the container.
          </p>
          ${renderCodeExample(`interface Box<Value> {
  value: Value;
}

type Page<Item, Cursor = string> = {
  items: readonly Item[];
  nextCursor?: Cursor;
};

const boxedTitle: Box<string> = { value: "Sea of Stars" };
const firstPage: Page<Game> = { items: games };
const numericCursor: Page<Game, number> = { items: games, nextCursor: 2 };`)}
          <p>
            Keep parameter names descriptive, constrain them only as needed,
            and avoid excessive numbers of parameters that callers cannot
            understand. A generic abstraction earns its place when it is
            reusable and preserves a real relationship across multiple
            values.
          </p>
        </section>

        <section>
          <h2>Recognize unnecessary generics</h2>
          <p>
            If a type parameter appears only once and does not relate an input
            to an output or another parameter, it may add no information. For
            example, a logging function that accepts any type but returns
            nothing often needs only <code>unknown</code>. Generic parameters
            are contracts, not a badge of sophistication.
          </p>
          ${renderCodeExample(`function logValue(value: unknown): void {
  console.log(value);
}

function preserveValue<Value>(value: Value): Value {
  return value;
}`)}
          <p>
            Use <code>unknown</code> when the function can handle any value
            without preserving its particular type for the caller. Use a
            generic when a relationship needs to survive the call. Prefer
            the least complex signature that expresses the requirement.
          </p>
          ${renderWorkedExample(html`
            <h2>Practice: preserve useful detail</h2>
            <p>
              Implement a function that returns the first matching item from
              a readonly list. It should accept an item predicate and return
              the original item type or <code>undefined</code>. Add a
              constraint only if the lookup algorithm needs a specific
              property, such as an ID.
            </p>
          `)}
        </section>
      </article>
    `
});
