import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-17", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 3: Building with types · Chapter 17</p>
        <h1>Classes and object-oriented TypeScript</h1>
        <p>
                Classes create runtime objects with shared methods and private
                instance state. They can be useful when an object owns behavior and
                must protect an invariant. Plain objects and functions are often
                simpler for passive records such as Game. Use a class because its
                runtime behavior helps, not just because a type has several fields.
              </p>
              ${renderCodeExample(`class GameCollection {
  #games: Game[] = [];

  add(game: Game): void {
    if (this.#games.some((entry) => entry.id === game.id)) {
      throw new Error("A game with this id is already in the collection.");
    }
    this.#games.push(game);
  }

  list(): readonly Game[] {
    return [...this.#games];
  }
}

const collection = new GameCollection();
// game is a valid Game value from the previous part.
collection.add(game);`)}
              <p>
                The <code>#games</code> field is private at JavaScript runtime, not
                only hidden from the type checker. The class centralizes the unique
                ID rule in <code>add</code>; callers cannot directly replace its
                backing array. <code>implements</code>, by contrast, is a compile-time
                check that a class has a particular shape and is erased from output.
              </p>
              ${renderWorkedExample(html`
                <p>
                  Put the check inside <code>GameCollection.add</code>, next to the
                  private collection it protects. Return a readonly copy or view
                  from <code>list</code> so callers cannot append through that
                  reference. This protects the array boundary; it does not
                  deep-freeze each Game object.
                </p>
              `)}
        <section>
          <h2>A class is a runtime construct</h2>
          <p>
            A class creates a JavaScript constructor and prototype methods,
            as well as a TypeScript instance type. Use a class when identity,
            encapsulated mutable state, lifecycle, or runtime behavior is
            part of the design. A passive game record is often simpler as a
            plain object and object type.
          </p>
          <p>
            A class does not make data valid automatically. Constructor
            checks run at runtime because they are executable code;
            annotations and <code>implements</code> are erased. Validate
            untrusted input before constructing a domain object.
          </p>
        </section>

        <section>
          <h2>Initialize fields and protect invariants</h2>
          <p>
            Under strict property initialization, every instance field must
            be initialized at its declaration or in the constructor. A
            constructor should establish valid initial state. Parameter
            properties can declare and initialize a field from a parameter,
            but should make ownership and mutability clear.
          </p>
          ${renderCodeExample(`interface GameRepository {
  add(game: Game): void;
  findById(id: string): Game | undefined;
}

class MemoryGameRepository implements GameRepository {
  #games = new Map<string, Game>();

  constructor(initialGames: readonly Game[] = []) {
    for (const game of initialGames) this.add(game);
  }

  add(game: Game): void {
    if (this.#games.has(game.id)) throw new Error("Duplicate game ID");
    this.#games.set(game.id, game);
  }

  findById(id: string): Game | undefined {
    return this.#games.get(id);
  }
}`)}
          <p>
            The constructor and <code>add</code> enforce the duplicate-ID
            invariant at runtime. <code>#games</code> is a JavaScript private
            field. TypeScript's <code>private</code> modifier is checked only
            in source code and does not provide the same runtime
            encapsulation.
          </p>
        </section>

        <section>
          <h2>Know what member modifiers guarantee</h2>
          <p>
            Members are public by default. TypeScript's <code>private</code>
            and <code>protected</code> restrict checked access but are
            erased. ECMAScript <code>#private</code> fields are enforced by
            JavaScript. <code>readonly</code> prevents assignment through
            the typed reference; it does not deep-freeze the referenced
            object or stop another reference from mutating it.
          </p>
          ${renderCodeExample(`class GameSelection {
  readonly #selectedIds = new Set<string>();

  select(id: string): void {
    this.#selectedIds.add(id);
  }

  isSelected(id: string): boolean {
    return this.#selectedIds.has(id);
  }
}`)}
          <p>
            The readonly modifier prevents replacing the Set field, but the
            method can still mutate the Set. If an API must be immutable,
            design its operations and exposed values to prevent those
            mutations rather than relying on a single modifier.
          </p>
        </section>

        <section>
          <h2>Static members and accessors</h2>
          <p>
            Instance members belong to each object; static members belong to
            the class constructor. Getters and setters look like properties
            but execute code, so keep them predictable and avoid hiding
            expensive or asynchronous work behind property access. A static
            factory can give construction a domain-specific name when a
            constructor alone is unclear.
          </p>
          ${renderCodeExample(`class GameSearch {
  static readonly maximumQueryLength = 120;

  constructor(readonly query: string) {
    if (query.trim().length === 0) throw new Error("Search text is required");
    if (query.length > GameSearch.maximumQueryLength) {
      throw new Error("Search text is too long");
    }
  }

  get normalizedQuery(): string {
    return this.query.trim().toLowerCase();
  }
}`)}
          <p>
            The constructor implements the validation rule; the readonly
            declaration does not normalize or validate strings by itself.
            Keep property access inexpensive and unsurprising.
          </p>
        </section>

        <section>
          <h2>Use inheritance only for substitutable behavior</h2>
          <p>
            A derived class inherits implementation and must remain usable
            wherever its base is expected. Override methods explicitly and
            preserve the base contract. Inheritance couples subclasses to
            implementation details, so prefer composition when an object
            merely needs help from another service.
          </p>
          ${renderCodeExample(`abstract class CatalogItem {
  constructor(readonly id: string, public title: string) {}
  abstract summary(): string;
}

class VideoGame extends CatalogItem {
  constructor(id: string, title: string, readonly platform: string) {
    super(id, title);
  }

  override summary(): string {
    return this.title + " on " + this.platform;
  }
}`)}
          <p>
            An abstract class cannot be instantiated directly and may
            require derived classes to implement members. The
            <code>override</code> keyword catches a renamed or removed base
            method. A type-compatible hierarchy is not proof that the
            conceptual relationship is correct.
          </p>
        </section>

        <section>
          <h2>Classes versus plain objects</h2>
          <p>
            A class can <code>implements</code> an interface, but that check
            does not alter the object at runtime or install methods. A plain
            object can satisfy the same interface structurally. Use classes
            for behavior and controlled identity; use plain objects for
            transport values, application state, and simple domain records.
          </p>
          <ul>
            <li>Choose a class when runtime encapsulation or lifecycle matters.</li>
            <li>Keep constructors small and establish valid initial state.</li>
            <li>Prefer composition over inheritance for replaceable collaborators.</li>
            <li>Remember that <code>implements</code> is not runtime validation.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: decide whether a class helps</h2>
            <p>
              A game record with an ID, title, and status is mostly data; a
              plain typed object is enough. A repository that owns a private
              index, enforces unique IDs, and offers lookup operations may
              benefit from a class. State the invariant first, then choose
              the smallest mechanism that protects it.
            </p>
          `)}
        </section>
      </article>
    `
});
