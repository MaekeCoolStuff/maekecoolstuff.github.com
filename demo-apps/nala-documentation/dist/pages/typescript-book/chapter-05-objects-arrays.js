import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { objectAndArrayExamples, renderPartOneCodeExample as renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-05", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 1: Getting oriented · Chapter 5</p>
        <h1>Objects and arrays</h1>

              <p>
                Applications work with groups of related values. An object type
                names the properties a game must have; <code>Game[]</code> says
                that a collection contains zero or more games. TypeScript checks
                property access and function calls against those descriptions.
              </p>
              ${renderCodeExample(objectAndArrayExamples)}
              <p>
                Array methods such as <code>map</code> transform a collection. Here,
                <code>titles</code> is inferred as <code>string[]</code> because each
                callback returns a game's title. A type description does not freeze
                an array or its objects. Readonly types restrict writes through a
                typed reference, but they are not a runtime deep-freeze.
              </p>
              ${renderWorkedExample(html`
                ${renderCodeExample(`type Game = {
  id: string;
  title: string;
  platform: string;
  hoursPlayed: number;
  status: string;
};

const backlogTitles = collection
  .filter((game) => game.status === "backlog")
  .map((game) => game.title);`)}
                <p>
                  Add a status value to every object in <code>collection</code>.
                  Any object left unchanged is missing a required property, so
                  the checker points to the incomplete data.
                </p>
              `)}
        <section>
          <h2>Objects are references, not copied records</h2>
          <p>
            An object groups values under named properties. Dot notation reads
            a known property; bracket notation reads a key held in a variable.
            Objects are references: assigning one object to another variable
            copies the reference, so both names can observe the same mutation.
          </p>
          ${renderCodeExample(`const original = { title: "Hades", hoursPlayed: 20 };
            const alias = original;
            alias.hoursPlayed = 21;
            console.log(original.hoursPlayed); // 21
            const updated = { ...original, hoursPlayed: 22 };
            console.log(updated.hoursPlayed); // 22`)}
          <p>
            Object spread creates a shallow copy. Top-level fields are copied,
            but nested objects are still shared references. Use immutable
            updates when state changes should be observable or reversible, and
            know how deeply your data must be copied. <code>Object.freeze</code>
            is also shallow; it is not a general deep immutability guarantee.
          </p>
        </section>

        <section>
          <h2>Destructuring and optional properties</h2>
          <p>
            Destructuring reads properties or array elements into local
            bindings. Defaults are used when a value is <code>undefined</code>,
            but not when it is <code>null</code>. Optional chaining stops a
            nested property read at a nullish value. Use it for genuinely
            optional data, not to hide a field that the application requires.
          </p>
          ${renderCodeExample(`const game = { title: "Tunic", platform: "PC", hoursPlayed: 9 };
            const { title, platform } = game;
            const { hoursPlayed = 0 } = game;
            const save: { metadata?: { rating?: number } } = {};
            const rating = save.metadata?.rating;
            console.log(title + " on " + platform + ": " + hoursPlayed);`)}
          <p>
            Destructured variables are local; changing one does not update the
            original object. To update a record, create a new value or mutate
            it intentionally according to the ownership contract.
          </p>
        </section>

        <section>
          <h2>Arrays are ordered collections</h2>
          <p>
            Arrays are ordered sequences whose indexes start at zero. Reading
            beyond the last index produces <code>undefined</code> at runtime.
            The array's length can be zero, so code that reads the first item
            should handle an empty collection when emptiness is possible.
          </p>
          ${renderCodeExample(`const games = ["Celeste", "Hades", "Tunic"];
            const first = games[0];
            const last = games.at(-1);
            console.log(games.length);`)}
          <p>
            Methods such as <code>push</code>, <code>pop</code>,
            <code>splice</code>, <code>sort</code>, and <code>reverse</code>
            mutate the array. Methods such as <code>map</code>,
            <code>filter</code>, <code>slice</code>, and <code>concat</code>
            return a new array. Check a method's mutation behavior before using
            it on shared state. Newer copying methods like <code>toSorted</code>
            depend on the runtime target supported by the project.
          </p>
        </section>

        <section>
          <h2>Select a collection operation by intent</h2>
          <p>
            Use <code>map</code> to transform every item, <code>filter</code>
            to keep matching items, <code>find</code> to get the first match,
            <code>some</code> to ask whether at least one item matches, and
            <code>every</code> to ask whether all items match. Each method
            communicates a recognizable operation and returns a result that can
            be composed with the next step.
          </p>
          ${renderCodeExample(`const titles = collection.map((game) => game.title);
            const longSessions = collection.filter((game) => game.hoursPlayed > 20);
            const selected = collection.find((game) => game.id === "g-2");
            const hasUnplayed = collection.some((game) => game.hoursPlayed === 0);
            const allHaveTitles = collection.every((game) => game.title.length > 0);`)}
          <p>
            <code>find</code> may return no item, so callers must account for
            absence. <code>reduce</code> folds many values into an accumulator
            and can calculate totals or grouped data. It is powerful but easier
            to misuse than the specific methods; provide an initial accumulator
            and prefer a loop when that makes the logic clearer.
          </p>
          ${renderCodeExample(`const totalHours = collection.reduce(
            (total, game) => total + game.hoursPlayed,
            0,
          );`)}
        </section>

        <section>
          <h2>Sorting changes arrays</h2>
          <p>
            The default <code>sort</code> compares string forms, so numeric
            values need a comparator. It also mutates the array. Copy the list
            first when you do not own it or another consumer may rely on its
            current order. Comparators should consistently indicate which item
            comes first.
          </p>
          ${renderCodeExample(`const scores = [100, 9, 20];
            const sortedScores = [...scores].sort((left, right) => left - right);
            const sortedGames = [...collection].sort((left, right) =>
              left.title.localeCompare(right.title)
            );`)}
          <p>
            For user-facing text, <code>localeCompare</code> is usually more
            appropriate than less-than comparison. For large collections,
            consider whether sorting should happen once at a data boundary or
            repeatedly during rendering.
          </p>
        </section>

        <section>
          <h2>Practice: build a derived view</h2>
          <p>
            Produce an alphabetized list of titles for games with more than ten
            hours, without changing the source array.
          </p>
          ${renderCodeExample(`const activeTitles = collection
            .filter((game) => game.hoursPlayed > 10)
            .map((game) => game.title)
            .sort((left, right) => left.localeCompare(right));`)}
          <p>
            <code>filter</code> and <code>map</code> produce new arrays. The
            final sort mutates only the new titles array, not
            <code>collection</code>. Name intermediate values if each rule
            deserves an independent explanation or is useful during debugging.
          </p>
          <ul>
            <li>Use stable IDs for domain identity; an array index is only a position.</li>
            <li>Handle empty input before averages or first-item access.</li>
            <li>Do not mutate caller-owned data unless the contract says so.</li>
            <li>Keep one-item and collection variable names distinct.</li>
          </ul>
        </section>

      </article>
    `
});
