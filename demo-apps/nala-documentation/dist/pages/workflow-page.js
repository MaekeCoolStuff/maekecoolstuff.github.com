import { defineComponent, html } from "../../../../vendor/components/dist/index.js";
import { renderCodeExample } from "./code-example.js";
const coreCommands = [
  "deno task check:nala",
  "deno test -A",
  "deno task build:nala",
  "deno task dev:nala-documentation"
].join("\n");
defineComponent("docs-workflow-page", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Working with Nala</p>
        <h1>From focused primitive to browser proof.</h1>
        <p class="page-lead">
              Nala features start in the vendor module that owns the behavior, receive
              focused tests, and are then exercised through a realistic demo app.
            </p>

        <nala-card variant="accent">
          <span slot="eyebrow">Development loop</span>
          <span slot="title">Keep each change falsifiable</span>
          <ol>
            <li>Read the owning public API and nearby behavior tests.</li>
            <li>Add one focused test for the requested contract.</li>
            <li>Implement the smallest reusable capability.</li>
            <li>Migrate a demo app as integration proof.</li>
            <li>Run checks, all tests, build, and browser validation.</li>
          </ol>
        </nala-card>

        <h2>Core commands</h2>
        ${renderCodeExample(coreCommands)}

        <h2>Documentation structure</h2>
        <div class="docs-grid">
          <nala-card>
            <span slot="title">Feature specification</span>
            <p>Defines motivation, scope, proposed API, risks, and acceptance criteria before implementation.</p>
          </nala-card>
          <nala-card>
            <span slot="title">Implementation chapter</span>
            <p>Explains the realized architecture, edge cases, migration, tests, and limitations in programming-book form.</p>
          </nala-card>
        </div>
      </article>
    `
});
