import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-18", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 3: Building with types · Chapter 18</p>
        <h1>Utility and mapped types</h1>
        <p>
                Utility types transform existing contracts so related APIs do not
                drift apart. <code>keyof</code> produces the keys of a type, indexed
                access looks up a property's type, and mapped utilities such as
                <code>Pick</code> and <code>Partial</code> select and modify parts of
                an object shape.
              </p>
              ${renderCodeExample(`type EditableGame = Partial<Pick<Game, "title" | "platforms">>;
type GameField = keyof Game;
type GamePlayState = Game["playState"];
type GamesByPlatform = Record<Platform, readonly Game[]>;

function updateGame(game: Game, changes: EditableGame): Game {
  return { ...game, ...changes };
}`)}
              <p>
                <code>EditableGame</code> contains only title and platforms, and both
                are optional because a patch may change either or both. It cannot
                change an ID or play state. <code>Record</code> requires an entry for
                every Platform literal. These transformations are checked at compile
                time; they do not create new objects or validate incoming patches.
              </p>
              ${renderWorkedExample(html`
                ${renderCodeExample(`type GamePatch = Partial<Pick<Game, "title" | "platforms">>;`)}
                <p>
                  <code>Pick</code> limits the keys before <code>Partial</code>
                  makes them optional. The resulting type has no <code>id</code>
                  property.
                </p>
              `)}
        <section>
          <h2>Start with keys and indexed access</h2>
          <p>
            <code>keyof T</code> produces the permitted property keys of
            <code>T</code>. <code>T[K]</code> looks up the type at a key.
            These operators keep related contracts connected instead of
            repeating property names and value types by hand.
          </p>
          ${renderCodeExample(`type Game = {
  id: string;
  title: string;
  hours: number;
};

type GameKey = keyof Game;
type GameTitle = Game["title"];

function getProperty<Value, Key extends keyof Value>(
  value: Value,
  key: Key,
): Value[Key] {
  return value[key];
}`)}
          <p>
            With the key <code>"title"</code>, the result is a string; with
            <code>"hours"</code>, it is a number. This pattern is useful in
            reusable utilities, but a direct domain function is clearer
            whenever the generic form obscures the business operation.
          </p>
        </section>

        <section>
          <h2>Transform shapes with built-in utilities</h2>
          <p>
            <code>Pick</code> keeps selected keys; <code>Omit</code> removes
            keys; <code>Partial</code> makes properties optional;
            <code>Required</code> makes them required; <code>Readonly</code>
            adds readonly modifiers; and <code>Record</code> describes a
            mapping from keys to values.
          </p>
          ${renderCodeExample(`type Game = {
  id: string;
  title: string;
  platforms: readonly Platform[];
  playState: PlayState;
};

type GameCard = Pick<Game, "id" | "title">;
type GamePatch = Partial<Pick<Game, "title" | "platforms">>;
type CreateGame = Omit<Game, "id">;
type GameIndex = Record<string, Game>;
type ImmutableGame = Readonly<Game>;`)}
          <p>
            A patch can be empty unless the update function checks it.
            Utility types transform a static contract; they do not validate
            a patch or prevent invalid runtime values. An object spread
            update is also shallow.
          </p>
          ${renderCodeExample(`function updateGame(game: Game, patch: GamePatch): Game {
  return { ...game, ...patch };
}`)}
        </section>

        <section>
          <h2>Filter and extract union members</h2>
          <p>
            <code>Exclude</code> removes union members assignable to another
            type; <code>Extract</code> keeps matching members;
            <code>NonNullable</code> removes null and undefined. These
            utilities refine a known compile-time union but do not narrow a
            runtime value arriving from outside the typed program.
          </p>
          ${renderCodeExample(`type PlayStatus = "backlog" | "playing" | "completed";
type ActiveStatus = Exclude<PlayStatus, "completed">;
type CompletedStatus = Extract<PlayStatus, "completed">;

type MaybeGame = Game | undefined | null;
type PresentGame = NonNullable<MaybeGame>;`)}
          <p>
            <code>Parameters&lt;F&gt;</code>, <code>ReturnType&lt;F&gt;</code>,
            and <code>Awaited&lt;T&gt;</code> derive contracts from functions
            and Promises. Use them when a type should follow an existing API
            rather than duplicate its declaration.
          </p>
          ${renderCodeExample(`async function loadGame(id: string): Promise<Game | undefined> {
  return repository.findById(id);
}

type LoadGameResult = Awaited<ReturnType<typeof loadGame>>;
type LoadGameArguments = Parameters<typeof loadGame>;`)}
        </section>

        <section>
          <h2>Mapped types build related properties</h2>
          <p>
            A mapped type iterates over a key union to construct properties.
            Mapped modifiers can add or remove optional and readonly
            properties. Key remapping can rename or filter fields. These
            techniques power built-in utilities; custom versions should
            represent a stable, reusable rule.
          </p>
          ${renderCodeExample(`type Flags<Value> = {
  [Key in keyof Value]: boolean;
};

type ReadonlyRequired<Value> = {
  readonly [Key in keyof Value]-?: Value[Key];
};

type GameFlags = Flags<Pick<Game, "title" | "platforms">>;`)}
          <p>
            The <code>-?</code> modifier removes optionality at compile
            time; it does not prove a runtime object contains every
            property. Prefer the built-in utilities where they express the
            intent directly, and test complex public transformations.
          </p>
        </section>

        <section>
          <h2>Check configuration with satisfies</h2>
          <p>
            The <code>satisfies</code> operator checks that an expression
            conforms to a target type while preserving its more specific
            inferred type. It is useful for configuration tables where you
            want required keys checked without widening every literal to the
            target contract.
          </p>
          ${renderCodeExample(`type RouteName = "collection" | "wishlist";
type RouteConfig = { path: string; title: string };

const routes = {
  collection: { path: "/games", title: "My games" },
  wishlist: { path: "/wishlist", title: "Wishlist" },
} satisfies Record<RouteName, RouteConfig>;

routes.collection.title;`)}
          <p>
            Unlike a type assertion, <code>satisfies</code> checks
            compatibility. It still runs no validation and does not
            sanitize data from JSON or user input.
          </p>
        </section>

        <section>
          <h2>Keep transformations maintainable</h2>
          <ul>
            <li>Derive related types instead of copying property lists.</li>
            <li>Name transformed shapes when they have domain meaning.</li>
            <li>Validate runtime values separately from compile-time utility types.</li>
            <li>Avoid deeply nested transformations that are harder to debug than duplication.</li>
            <li>Prefer a direct contract if a generic transformation is opaque.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: restrict an update API</h2>
            <p>
              Define a patch that allows a caller to change a title or
              platforms but never an ID or play state. Then add runtime rules
              for empty patches and invalid platform values.
            </p>
          `)}
        </section>
      </article>
    `
});
