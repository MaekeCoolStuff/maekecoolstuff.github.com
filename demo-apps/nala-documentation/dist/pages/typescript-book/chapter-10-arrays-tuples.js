import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-10", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 2: Describing data · Chapter 10</p>
        <h1>Arrays and tuples</h1>
        <p>
                An array type describes a variable-length sequence whose elements
                share a type. A tuple describes a fixed sequence where each position
                has a known meaning and type. Choose an array for a collection of
                games; choose a tuple only when the positions themselves form a small
                record.
              </p>
              ${renderCodeExample(`const gameTitles: string[] = ["Celeste", "Hades"];
const playRecord: [title: string, hours: number] = ["Celeste", 12];
const platformPair: readonly [string, string] = ["Celeste", "PC"];

function addGame(games: readonly string[], title: string): string[] {
  return [...games, title];
}

const updatedTitles = addGame(gameTitles, "Sea of Stars");`)}
              <p>
                The labels on <code>playRecord</code> document what each tuple slot
                means. Its first item is a title and its second is a number of hours;
                swapping them is a type error. <code>readonly</code> arrays and
                tuples prevent writes through that reference, while returning a new
                array lets <code>addGame</code> preserve its input.
              </p>
              <p>
                Readonly is a TypeScript restriction, not a deep runtime lock. Another
                reference may still mutate the original JavaScript array. Keep the
                distinction between a checked view and an immutable runtime value
                clear when designing APIs.
              </p>
              ${renderWorkedExample(html`
                ${renderCodeExample(`const shelf: string[] = ["Celeste", "Hades"];
const playRecord: [title: string, hoursPlayed: number] = ["Celeste", 12];`)}
                <p>
                  The shelf is a variable-length collection, so it is an array. The
                  pair always has exactly two differently typed positions, so it is
                  a tuple.
                </p>
              `)}
        <section>
          <h2>Arrays represent variable-length sequences</h2>
          <p>
            Write an array type as <code>Game[]</code> or
            <code>Array&lt;Game&gt;</code>; both mean a sequence with zero or
            more game values. Use arrays when the number of items may change
            and every item has the same role. Arrays are mutable by default,
            and common mutating methods change the existing array.
          </p>
          ${renderCodeExample(`type Game = { id: string; title: string; hours: number };

const games: Game[] = [
  { id: "g-1", title: "Celeste", hours: 12 },
  { id: "g-2", title: "Hades", hours: 31 },
];

games.push({ id: "g-3", title: "Tunic", hours: 9 });
const titles = games.map((game) => game.title);`)}
          <p>
            Array methods communicate useful operations: <code>map</code>
            transforms each value, <code>filter</code> selects values,
            <code>find</code> returns the first match or undefined,
            <code>some</code>/<code>every</code> answer predicate questions,
            and <code>reduce</code> combines values into one result. Prefer
            the method that describes the task; a loop is often clearer when
            control flow or side effects are complicated.
          </p>
        </section>

        <section>
          <h2>Mutation, copying, and readonly views</h2>
          <p>
            <code>push</code>, <code>pop</code>, <code>splice</code>,
            <code>sort</code>, and <code>reverse</code> mutate. <code>map</code>,
            <code>filter</code>, <code>slice</code>, and array spread produce a
            new outer array. Copies are shallow, so object elements remain
            shared references. Sorting a copied array protects the caller's
            order; the default sort compares string forms, so numbers need a
            comparator.
          </p>
          ${renderCodeExample(`const scores = [100, 9, 20];
const ascending = [...scores].sort((left, right) => left - right);

const source = [{ title: "Hades", hours: 20 }];
const copy = [...source];
copy[0].hours = 21;
console.log(source[0].hours); // 21: object element is shared.`)}
          <p>
            A <code>readonly Game[]</code> parameter promises that a function
            will not modify the array through that reference. It does not
            freeze the runtime array, make the elements deeply readonly, or
            stop another reference from changing it. Return a new array when
            an update should not mutate caller-owned state.
          </p>
          ${renderCodeExample(`function addGame(games: readonly Game[], game: Game): Game[] {
  return [...games, game];
}`)}
        </section>

        <section>
          <h2>Indexes can be missing</h2>
          <p>
            Array indexes start at zero, and an index outside the array returns
            <code>undefined</code> at runtime. Some TypeScript configurations
            include <code>undefined</code> in every indexed read by enabling
            <code>noUncheckedIndexedAccess</code>; without it, an indexed
            expression may be typed as the element type even when the index is
            out of range. Check bounds when absence is possible regardless of
            compiler settings.
          </p>
          ${renderCodeExample(`function firstTitle(games: readonly Game[]): string | undefined {
  const first = games[0];
  return first?.title;
}

const lastGame = games.at(-1); // Also undefined for an empty array.`)}
          <p>
            Avoid sparse arrays created by setting a distant index or using
            <code>delete</code> on an element. Array iteration methods may
            skip empty slots, which differs from an array containing
            <code>undefined</code> and can surprise validation and rendering
            code.
          </p>
        </section>

        <section>
          <h2>Tuples describe fixed positions</h2>
          <p>
            A tuple has a known length and a specific type at each position.
            Labels explain the meaning of positions but do not change runtime
            behavior. Tuples work well for small records returned by APIs or
            coordinates; they are usually a poor representation for a
            collection of entities where each item has a name and identifier.
          </p>
          ${renderCodeExample(`type PlayRecord = [title: string, hoursPlayed: number];
const record: PlayRecord = ["Celeste", 12];
const [title, hoursPlayed] = record;

type SearchPage = [results: Game[], nextCursor?: string];
const page: SearchPage = [games];`)}
          <p>
            Tuple length and order are checked: swapping title and hours is an
            error. Optional and rest tuple elements are available for APIs
            whose positions genuinely have those meanings. Readonly tuples
            prevent writes through a typed reference but do not freeze their
            runtime array.
          </p>
          ${renderCodeExample(`const coordinates: readonly [number, number] = [4, 7];
const [column, row] = coordinates;
// coordinates[0] = 8; // Error: readonly tuple.`)}
        </section>

        <section>
          <h2>Choose between an array and tuple</h2>
          <ul>
            <li>Use an array for many values with the same role and type.</li>
            <li>Use a tuple when position has meaning and length is constrained.</li>
            <li>Use an object when fields have names and independently meaningful roles.</li>
            <li>Prefer stable identifiers over indexes for reorderable UI lists.</li>
            <li>Handle empty arrays and missing matches as normal cases.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: safe derived data</h2>
            <p>
              Write a function that returns the title of the most-played game,
              or <code>undefined</code> when the collection is empty. Do not
              sort or mutate the caller's array.
            </p>
            ${renderCodeExample(`function mostPlayedTitle(games: readonly Game[]): string | undefined {
  let mostPlayed: Game | undefined;
  for (const game of games) {
    if (mostPlayed === undefined || game.hours > mostPlayed.hours) {
      mostPlayed = game;
    }
  }
  return mostPlayed?.title;
}`)}
          `)}
        </section>
      </article>
    `
});
