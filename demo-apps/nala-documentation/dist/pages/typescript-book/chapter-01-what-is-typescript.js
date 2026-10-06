import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderPartOneCodeExample as renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-01", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 1: Getting oriented · Chapter 1</p>
        <h1>What TypeScript is</h1>
        <p>
              JavaScript is the programming language that browsers execute. TypeScript
              adds a static type checker and syntax for describing values. The checker
              examines your program before it runs and reports contradictions such as
              passing a number where a function requires text.
            </p>
            <p>
              Most TypeScript annotations are removed when code is transformed into
              JavaScript. The browser does not inspect a declared type, and a type
              annotation does not validate data that comes from a form, a file, or a
              server. Types help you catch mistakes while developing; runtime checks
              are still needed at boundaries where data is not yet trusted.
            </p>
            ${renderCodeExample(`let title: string = "Celeste";
// The checker reports an error: a number is not a string.
// title = 12;`)}
            <p>
              TypeScript is therefore not a separate browser runtime. A tool such as
              Deno can check and transform TypeScript, and the browser ultimately
              receives JavaScript. In this repository, source imports use explicit
              <code>.ts</code> paths and the build step rewrites emitted imports for
              browser JavaScript.
            </p>
            <nala-callout tone="warning">
              <span slot="title">A type is not a runtime guarantee</span>
              Writing <code>const game: Game</code> does not prove that a JSON response
              actually has the shape of <code>Game</code>. We will handle that boundary
              later in the book.
            </nala-callout>
            ${renderWorkedExample(html`
              <ul>
                <li>
                  A function's declared parameter type is checked at calls in
                  TypeScript code.
                </li>
                <li>
                  A fetched response is not validated just because it is assigned a
                  TypeScript type; inspect or validate it at runtime.
                </li>
                <li>
                  Assigning a number to a variable declared as a string is rejected
                  by the checker.
                </li>
              </ul>
            `)}
        <section>
          <h2>Three different jobs</h2>
          <p>
            A TypeScript workflow includes a type checker, a transformer, and a
            runtime. The checker analyzes source and reports operations that
            contradict the available type information. A transformer emits
            JavaScript, sometimes removing TypeScript syntax and sometimes
            adapting newer JavaScript syntax for a target. A runtime, such as a
            browser or Deno, executes that JavaScript. Some tools combine these
            jobs, but the jobs remain distinct.
          </p>
          ${renderCodeExample(`function describeGame(title: string, hours: number): string {
  return title + " has " + hours + " hours played.";
}

console.log(describeGame("Sea of Stars", 18));
// The checker rejects this call before execution:
// describeGame(18, "Sea of Stars");`)}
          <p>
            The parameter and return annotations document a contract and let the
            checker compare the call with the function. At runtime, the values are
            still ordinary strings and numbers. If the program is emitted as
            JavaScript, its type annotations and type aliases are erased.
          </p>
        </section>

        <section>
          <h2>Types describe; they do not convert</h2>
          <p>
            Writing a type does not transform a value. A type assertion changes
            the checker's belief without changing the runtime value, so an
            incorrect assertion can move a mistake from compile time to runtime.
          </p>
          ${renderCodeExample(`const rawText = '{"id": 42, "title": null}';
type Game = { id: string; title: string };

const game = JSON.parse(rawText) as Game;
// This assertion did not convert id to text or title to a string.
// game.id.toUpperCase(); // Fails at runtime because id is a number.`)}
          <p>
            Data from JSON, a form, local storage, or an untyped dependency
            starts as a runtime value. The checker cannot inspect the future
            value just because a variable is annotated. Validate external data
            before treating it as trusted; later chapters build this pattern
            using <code>unknown</code> and explicit runtime checks.
          </p>
          <nala-callout tone="warning">
            <span slot="title">Types are not runtime validation</span>
            Treat <code>as SomeType</code> as a promise from the programmer to the
            checker, not as a parser, conversion, or security boundary.
          </nala-callout>
        </section>

        <section>
          <h2>TypeScript is designed around JavaScript</h2>
          <p>
            TypeScript keeps JavaScript's runtime model: the same values,
            functions, objects, modules, browser APIs, and exceptions. It adds
            syntax for describing types and a checker that understands both
            annotated and unannotated JavaScript. Types are primarily structural:
            a value is usable where its required properties and operations are
            available, even when it was not explicitly declared as a particular
            named type.
          </p>
          <p>
            This design lets teams adopt TypeScript gradually and use JavaScript
            libraries. The trade-off is that type information for dependencies
            can be incomplete or inaccurate, and the checker cannot guarantee
            correctness outside its model. Tests and runtime validation remain
            essential.
          </p>
        </section>

        <section>
          <h2>What types help you do</h2>
          <ul>
            <li>
              Catch invalid operations, such as calling a string method on a
              number, before a user encounters them.
            </li>
            <li>
              Make contracts visible at function and module boundaries, so
              callers can see required inputs and possible outputs.
            </li>
            <li>
              Support safe refactoring by finding places affected by a changed
              property or function contract.
            </li>
            <li>
              Enable editor completion, navigation, rename, and diagnostics from
              the same program model.
            </li>
          </ul>
          <p>
            A well-typed program can still have incorrect business rules, poor
            accessibility, security defects, or untested edge cases. Types
            reduce one important category of errors; they do not certify an
            application. Strong engineers combine types with tests, review,
            runtime checks, and product-level reasoning.
          </p>
        </section>

        <section>
          <h2>Practice: separate the jobs</h2>
          <ol>
            <li>
              Identify which part reports a number passed to a string parameter.
            </li>
            <li>
              Explain whether adding <code>: number</code> converts text to a
              numeric value.
            </li>
            <li>
              Explain why a type assertion cannot prove a server response is
              valid.
            </li>
          </ol>
          <p>
            The checker reports the invalid call. An annotation does not convert
            data. Assertions do not inspect runtime values, so validation must
            happen through executable checks.
          </p>
        </section>
      </article>
    `
});
