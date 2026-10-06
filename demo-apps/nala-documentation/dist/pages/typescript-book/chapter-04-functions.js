import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { functionExamples, renderPartOneCodeExample as renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-04", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 1: Getting oriented · Chapter 4</p>
        <h1>Functions</h1>
        <p>
              Functions are the main way to name behavior and define the data it
              accepts. TypeScript can infer a return type from the body, but writing
              one explicitly can make an important contract easier to read. Optional
              parameters and default values affect how a function may be called.
            </p>
            ${renderCodeExample(functionExamples)}
            <p>
              The <code>findGame</code> function may not find a match, so its result is
              <code>string | undefined</code>. That union means the caller must account
              for both possibilities before treating the result as a string. The
              callback passed to <code>find</code> receives each array item, and
              TypeScript infers that item as a string.
            </p>
            ${renderWorkedExample(html`
              ${renderCodeExample(`function isBacklog(hoursPlayed: number): boolean {
  return hoursPlayed === 0;
}

if (isBacklog(0)) {
  console.log("Choose a game to play next.");
}`)}
              <p>
                The explicit return type makes the contract clear: the function
                answers a yes-or-no question with a boolean.
              </p>
            `)}
        <section>
          <h2>Functions name behavior and define contracts</h2>
          <p>
            A function packages a task behind a name. Parameters are inputs and
            the returned value is output. A focused function is easier to
            understand, test, reuse, and change. "One job" means one coherent
            responsibility, not an arbitrary line-count limit.
          </p>
          ${renderCodeExample(`function gameLabel(title: string, hoursPlayed: number): string {
            return title + " (" + hoursPlayed + " hours)";
          }
          const label = gameLabel("Celeste", 12);`)}
          <p>
            TypeScript can infer the return type from the body. An explicit
            return type is useful for exported functions and important domain
            boundaries: it documents the result and prevents an accidental
            implementation change from silently changing the public contract.
          </p>
        </section>

        <section>
          <h2>Declarations, expressions, and arrow functions</h2>
          <p>
            A function declaration is available throughout its containing scope
            because of JavaScript's declaration hoisting. A function expression
            is a function value assigned to a variable. Arrow functions are
            concise expressions often used for callbacks. Unlike regular
            functions, arrows capture <code>this</code> from their surrounding
            scope rather than receiving their own <code>this</code>.
          </p>
          ${renderCodeExample(`function addHours(current: number, added: number): number {
            return current + added;
          }
          const multiplyHours = function (hours: number, factor: number): number {
            return hours * factor;
          };
          const doubled = [2, 4, 6].map((hours) => hours * 2);`)}
          <p>
            Choose the form that communicates intent. Do not use an arrow only
            because it is shorter: event handlers or object methods may depend
            on how <code>this</code> is supplied. Explicit parameters and
            closures are often clearer than dynamic receiver behavior.
          </p>
        </section>

        <section>
          <h2>Design parameters for callers</h2>
          <p>
            Required parameters should usually come first. A default parameter
            may be omitted and receives its default value. An optional
            parameter may be omitted, so the implementation must account for
            absence. If a function has several optional settings, use an
            options object instead of a long positional argument list.
          </p>
          ${renderCodeExample(`function formatHours(hours: number, unit = "hours"): string {
            return hours + " " + unit;
          }
          function findGame(title: string, platform?: string): string {
            if (platform === undefined) return "Search all platforms for " + title;
            return "Search " + platform + " for " + title;
          }
          type SearchOptions = { platform?: string; includeArchived?: boolean };
          function searchGames(query: string, options: SearchOptions = {}): string {
            const platform = options.platform ?? "all platforms";
            const archive = options.includeArchived ? "including archived" : "current games";
            return "Searching " + platform + " for " + query + " in " + archive;
          }`)}
          <p>
            A default object makes the argument optional. The implementation
            applies both options and gives omitted settings predictable
            defaults. Do not add settings that have no observable purpose.
          </p>
        </section>

        <section>
          <h2>Rest parameters and callbacks</h2>
          <p>
            A rest parameter gathers remaining arguments into an array. A
            callback is a function passed to another function so it can
            customize part of that function's work. Array methods use callbacks
            to transform, select, or test collection members.
          </p>
          ${renderCodeExample(`function totalHours(...entries: number[]): number {
            return entries.reduce((total, hours) => total + hours, 0);
          }
          const titles = ["Celeste", "Hades", "Tunic"];
          const matching = titles.filter((title) => title.includes("e"));
          const labels = titles.map((title) => title.toUpperCase());`)}
          <p>
            TypeScript usually infers callback parameter types from the
            collection or API that receives the callback. Prefer a short
            callback that is clear at the call site; name it separately when
            it is reused or deserves its own explanation.
          </p>
        </section>

        <section>
          <h2>Return values and early exits</h2>
          <p>
            A function that reaches its closing brace without a return value
            returns <code>undefined</code>. An action function can intentionally
            return no useful result. Early returns can handle invalid or
            special cases close to the top and keep the main path easy to
            follow.
          </p>
          ${renderCodeExample(`function completionMessage(title: string, hours: number): string {
            if (hours < 0) throw new Error("Hours cannot be negative");
            if (hours === 0) return title + " has not been started.";
            return title + " has " + hours + " hours played.";
          }
          function printTitle(title: string): void {
            console.log(title);
          }`)}
          <p>
            A side effect changes or observes something outside the returned
            value: writing to the console, mutating state, updating the DOM, or
            making a request. Functions with fewer hidden side effects are
            easier to test. Keep I/O near application boundaries and prefer
            deterministic transformations for core rules.
          </p>
        </section>

        <section>
          <h2>Closures and lifetime</h2>
          <p>
            A closure is a function together with access to variables from the
            scope where it was created. Closures are useful for callbacks,
            event handlers, and encapsulated state. A callback retains access
            to its captured bindings, so its lifetime can outlast the function
            that created it.
          </p>
          ${renderCodeExample(`function createCounter(): () => number {
            let count = 0;
            return () => {
              count += 1;
              return count;
            };
          }
          const nextCount = createCounter();
          console.log(nextCount()); // 1
          console.log(nextCount()); // 2`)}
          <p>
            For browser listeners, timers, and subscriptions, define when the
            callback is removed. A retained closure can keep data or DOM nodes
            alive longer than intended if cleanup is forgotten.
          </p>
        </section>

        <section>
          <h2>Make functions easy to test</h2>
          <ul>
            <li>Give the function a name that describes its result or action.</li>
            <li>Keep input, output, and side effects explicit.</li>
            <li>Do not mutate caller-owned data unless mutation is documented.</li>
            <li>Test empty, boundary, and invalid inputs as well as typical inputs.</li>
            <li>Return a consistent result instead of varying unpredictably by branch.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: handle an absent result</h2>
            <p>
              Write a function that returns the first exact title match or
              <code>undefined</code>. Then make the caller check for absence
              before formatting the title.
            </p>
            ${renderCodeExample(`function findGame(titles: string[], wanted: string): string | undefined {
              return titles.find((title) => title === wanted);
            }
            const found = findGame(["Celeste", "Hades"], "Hades");
            if (found !== undefined) console.log("Found " + found);`)}
            <p>
              The caller handles both possible outcomes. Later chapters explore
              how TypeScript represents those alternatives in greater depth.
            </p>
          `)}
        </section>
      </article>
    `
});
