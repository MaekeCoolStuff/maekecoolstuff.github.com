import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { javascriptFoundations, renderPartOneCodeExample as renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-03", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 1: Getting oriented · Chapter 3</p>
        <h1>JavaScript foundations</h1>
        <p>
              TypeScript builds on JavaScript, so its expressions follow JavaScript's
              runtime rules. Use <code>const</code> when a binding will not be
              reassigned, and <code>let</code> when it will. A <code>const</code>
              binding does not make an object immutable; it only prevents assigning a
              different value to that variable.
            </p>
            ${renderCodeExample(javascriptFoundations)}
            <p>
              This example uses strings, numbers, strict equality, a conditional, an
              array, and a loop. The code that runs still follows normal JavaScript
              semantics. TypeScript adds checks around these operations, but it does
              not change what <code>===</code>, <code>if</code>, or <code>for...of</code>
              means at runtime.
            </p>
            ${renderWorkedExample(html`
              ${renderCodeExample(`if (hoursPlayed === 0) {
  console.log(title + " is still in the backlog.");
} else if (hoursPlayed > 20) {
  console.log(title + " is a well-played favorite.");
}`)}
              <p>
                With <code>hoursPlayed</code> typed as a string, comparing it to
                numbers with <code>===</code> or <code>&gt;</code> is a type error.
                Keep it numeric for these comparisons, or convert validated text to
                a number first.
              </p>
            `)}
        <section>
          <h2>Bindings, values, and scope</h2>
          <p>
            Use <code>const</code> when a name will not be assigned a different
            value and <code>let</code> when reassignment is part of the algorithm.
            Avoid <code>var</code> in new code because its function-scoped
            behavior and redeclaration rules are legacy sources of mistakes.
            Blocks give <code>let</code> and <code>const</code> local scope.
          </p>
          ${renderCodeExample(`const shelfName = "Weekend picks";
            let selectedTitle = "Celeste";
            if (selectedTitle.length > 0) {
              const message = "Selected: " + selectedTitle;
              console.log(message);
            }
            selectedTitle = "Hades";`)}
          <p>
            A <code>const</code> binding protects the name from reassignment,
            not the internal state of an object or array. Choose deliberate
            update patterns when data is shared. TypeScript's readonly
            contracts are compile-time restrictions, not automatic runtime
            freezing.
          </p>
        </section>

        <section>
          <h2>Primitive values, equality, and coercion</h2>
          <p>
            JavaScript primitives include strings, numbers, booleans,
            <code>null</code>, <code>undefined</code>, and bigints. Ordinary
            numbers include decimals, <code>NaN</code>, and infinities. Prefer
            strict equality (<code>===</code> and <code>!==</code>); loose
            equality performs conversions that often obscure the rule being
            checked. Objects compare by identity, not by their property values.
          </p>
          ${renderCodeExample(`console.log(0 === "0"); // false
            console.log(Number.isNaN(Number("unknown"))); // true
            const first = { title: "Hades" };
            const second = { title: "Hades" };
            console.log(first === second); // false: different objects
            console.log(first.title === second.title); // true: equal strings`)}
          <p>
            The plus operator adds numbers but concatenates when a string is
            involved. Avoid implicit conversions at important boundaries.
            Browser form values are strings, including values that look
            numeric; parse them, then validate the result.
          </p>
          ${renderCodeExample(`const text = "18";
            const hours = Number(text);
            if (!Number.isFinite(hours) || hours < 0) {
              throw new Error("Expected non-negative finite hours");
            }`)}
        </section>

        <section>
          <h2>Strings and formatting</h2>
          <p>
            Strings are immutable sequences. Useful operations include
            <code>trim</code>, <code>toLowerCase</code>, <code>includes</code>,
            <code>startsWith</code>, and <code>slice</code>. The
            <code>length</code> property counts UTF-16 code units, not
            necessarily visible characters. For translated or locale-sensitive
            user-facing values, use the platform internationalization APIs
            instead of inventing formatting rules.
          </p>
          ${renderCodeExample(`const searchKey = "  Sea of Stars ".trim().toLowerCase();
            const prefix = "Game: ";
            const label = prefix + "Celeste";
            console.log(searchKey, label);`)}
          <p>
            Template literals can interpolate expressions, but ordinary string
            concatenation is also valid. Choose the form that keeps the output
            readable, and remember that interpolation executes JavaScript
            expressions; it is not a safety or escaping mechanism for HTML.
          </p>
        </section>

        <section>
          <h2>Conditions and truthiness</h2>
          <p>
            Falsey values include <code>false</code>, zero, negative zero,
            <code>0n</code>, the empty string, <code>null</code>,
            <code>undefined</code>, and <code>NaN</code>. Empty arrays and
            objects are truthy. Therefore <code>if (games)</code> does not
            check whether an array has items; test its length for that rule.
          </p>
          ${renderCodeExample(`const hoursPlayed = 0;
            const games: string[] = [];
            if (hoursPlayed === 0) console.log("Not started");
            if (games.length === 0) console.log("No games yet");`)}
          <p>
            Optional chaining (<code>?.</code>) stops property access when its
            left operand is nullish. Nullish coalescing (<code>??</code>) uses
            a fallback for only <code>null</code> or <code>undefined</code>;
            logical OR (<code>||</code>) also replaces valid falsey values
            such as zero and empty text.
          </p>
          ${renderCodeExample(`const volume = 0;
            const preserved = volume ?? 50; // 0
            const replaced = volume || 50; // 50
            const save: { details?: { rating?: number } } = {};
            const rating = save.details?.rating;`)}
        </section>

        <section>
          <h2>Control flow and iteration</h2>
          <p>
            Use <code>if</code>/<code>else</code> for alternatives and
            <code>switch</code> when one value selects among cases. Use
            <code>for...of</code> to visit iterable values, or a classic
            <code>for</code> when the index itself matters. <code>for...in</code>
            enumerates property names and is usually not the loop for array
            items.
          </p>
          ${renderCodeExample(`const platforms = ["PC", "Switch", "PlayStation"];
            for (const platform of platforms) {
              console.log("Available on " + platform);
            }
            for (let index = 0; index < platforms.length; index += 1) {
              console.log(index + ": " + platforms[index]);
            }`)}
          <p>
            Use explicit loop or array-method logic that a teammate can trace.
            Do not force a callback chain when an early exit, multiple effects,
            or error handling would be clearer in a loop.
          </p>
        </section>

        <section>
          <h2>Errors and debugging</h2>
          <p>
            JavaScript exceptions interrupt the current path and move control
            to a matching <code>catch</code> block or the host environment.
            Catch an error where you can recover, add useful context, or show a
            meaningful message. Avoid catch-and-ignore: it hides the failure
            and leaves the program in an unclear state.
          </p>
          ${renderCodeExample(`const savedText = '{"theme":"dark"}';
            try {
            const settings = JSON.parse(savedText);
            console.log(settings);
          } catch (error) {
            console.error("Could not read saved settings", error);
          }`)}
          <p>
            JavaScript permits thrown values other than <code>Error</code>, so
            do not assume every caught value has an error message. TypeScript
            projects commonly type caught values as <code>unknown</code> and
            inspect them before using them. Breakpoints and focused logging help
            you examine values at the moment they matter.
          </p>
        </section>

        <section>
          <h2>Practice: explain the behavior</h2>
          <ol>
            <li>Predict which values are truthy: zero, empty text, an empty array, an empty object.</li>
            <li>Explain why two identical object literals are not strictly equal.</li>
            <li>Write a condition that detects an empty collection.</li>
            <li>Choose a default operator that preserves a valid zero.</li>
            <li>Explain where a parsing failure should be caught and reported.</li>
          </ol>
          <p>
            Zero and empty text are falsey; empty arrays and objects are truthy.
            Object equality is identity-based. Check <code>length</code> for an
            empty array and use <code>??</code> when zero should remain valid.
          </p>
        </section>
      </article>
    `
});
