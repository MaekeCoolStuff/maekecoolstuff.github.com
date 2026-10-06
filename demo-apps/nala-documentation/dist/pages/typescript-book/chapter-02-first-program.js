import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderPartOneCodeExample as renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-02", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 1: Getting oriented · Chapter 2</p>
        <h1>Your first TypeScript program</h1>
        <p>
          A TypeScript program is made of declarations and statements. A declaration
          gives a name to a value or behavior; a statement performs an action. We
          will build a tiny program about a game collection, then use it to learn a
          reliable edit-check-run workflow.
        </p>
        <section>
          <h2>Read a complete program</h2>
          ${renderCodeExample(`const gameTitle: string = "Sea of Stars";
  const hoursPlayed: number = 18;
  function describeGame(title: string, hours: number): string {
    return title + " has " + hours + " hours played.";
  }
  const summary = describeGame(gameTitle, hoursPlayed);
  console.log(summary);`)}
          <p>
            The first two statements bind values to names. The function groups
            reusable behavior. Its parameters receive inputs from the caller;
            <code>return</code> sends a result back and ends that call. The final
            statements call the function and write its result to the console.
            Parameter and return annotations describe the function's contract.
          </p>
          <p>
            The local variable annotations are valid, but TypeScript can infer those
            types from their initial values. Write annotations where they clarify
            an intention or contract, not on every obvious local value.
          </p>
        </section>
        <section>
          <h2>Use the edit, check, run loop</h2>
          <p>
            Work in small cycles: make one change, check it, run it, compare the
            result with your prediction, then make the next change. This separates
            type errors from runtime behavior and makes causes easier to identify.
          </p>
          <p>
            This repository uses Deno. From its root,
            <code>deno check path/to/file.ts</code> checks a source file and its
            imports. <code>deno run path/to/file.ts</code> executes it, subject to
            permissions. Configured <code>deno task</code> commands in
            <code>deno.json</code> record the project's normal checks, tests, and
            builds. Other projects may use different tools; read their README and
            configuration.
          </p>
          ${renderCodeExample("deno check demo-apps/todo-app/src/todo-app.ts")}
          <p>
            Checking verifies type contracts and module resolution. Tests exercise
            selected behavior. A build emits output according to project rules.
            None alone proves that the application is correct in every environment.
          </p>
        </section>
        <section>
          <h2>Understand what the checker can tell you</h2>
          <p>
            The checker reasons from declarations and code; it does not execute the
            program or confirm a server response. Converting text to a number makes
            static types agree, but invalid text still produces <code>NaN</code>.
          </p>
          ${renderCodeExample(`const inputText = "eighteen";
  const parsed = Number(inputText);
  console.log(Number.isFinite(parsed)); // false`)}
          <p>
            A user-facing boundary should validate parsed values and give useful
            feedback. Types describe what the rest of the program expects;
            executable validation establishes whether external data meets that
            expectation.
          </p>
        </section>
        <section>
          <h2>Read a diagnostic as a clue</h2>
          <p>
            Start with the first useful diagnostic. Inspect the expression at its
            location, trace where its value came from, and compare its type with
            the operation's requirement. Fix the mismatch at its source when
            possible. Avoid suppressing errors with <code>any</code> or assertions
            unless there is a specific guarantee you can explain.
          </p>
          <p>
            Editors can show inferred types, navigate to declarations, and rename
            symbols across files. Use those tools to understand the project model
            rather than guessing what a value contains. A diagnostic is evidence
            that a contract does not line up, not merely an obstacle to remove.
          </p>
        </section>
        <section>
          <h2>Practice deliberately</h2>
          <ol>
            <li>Change the title and hours, then predict the output before running.</li>
            <li>Change a parameter to text and update its callers.</li>
            <li>Return a number while keeping the return type as string; inspect the error.</li>
            <li>Remove an obvious local annotation and inspect the inferred type.</li>
            <li>Add a special case for a game with zero hours played.</li>
          </ol>
          ${renderWorkedExample(html`
            <h2>A completed variation</h2>
            ${renderCodeExample(`function describeGame(title: string, hours: number): string {
    if (hours === 0) return title + " is still in the backlog.";
    return title + " has " + hours + " hours played.";
  }
  console.log(describeGame("Celeste", 0));`)}
            <p>
              Both branches return strings, matching the function's contract. An
              explicit zero comparison communicates the domain rule more clearly
              than relying on truthiness.
            </p>
          `)}
        </section>
        <section>
          <h2>Review the workflow</h2>
          <ul>
            <li>Check and run are different operations.</li>
            <li>A type error usually identifies a mismatched value or contract.</li>
            <li>Parsing input does not prove the resulting value is valid.</li>
            <li>Use documented project tasks for repeatable work.</li>
          </ul>
        </section>
      </article>
    `
});
