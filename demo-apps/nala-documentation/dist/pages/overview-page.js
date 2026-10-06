import { defineComponent, html } from "../../../../vendor/components/dist/index.js";
defineComponent("docs-overview-page", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Frameworkless by design</p>
        <h1>Build with the browser, not around it.</h1>
        <p class="page-lead">
          This documentation workspace will become the complete guide to Nala's
          native components, reactive state, routing, HTTP, and application workflow.
        </p>

        <nala-callout tone="info">
          <span slot="title">Documentation preview</span>
          The structure and component system are live. Detailed API content will be
          added in the next documentation pass.
        </nala-callout>

        <h2>Explore Nala</h2>
        <div class="docs-grid">
          <nala-card variant="accent">
            <span slot="eyebrow">Start here</span>
            <span slot="title">Build a real task manager</span>
            <p>Start with an empty app folder and build a browser page, semantic task interface, and responsive stylesheet across three authored chapters.</p>
            <a slot="actions" href="/start-here/todo">Start the core-only tutorial</a>
          </nala-card>
          <nala-card variant="accent">
            <span slot="eyebrow">Principles</span>
            <span slot="title">Understand the foundation</span>
            <p>Learn why Nala stays close to native browser APIs and keeps each abstraction small.</p>
            <a slot="actions" href="/philosophy">Read the philosophy</a>
          </nala-card>
          <nala-card variant="raised">
            <span slot="eyebrow">Reference</span>
            <span slot="title">Browse vendor packages</span>
            <p>See how observables, state, HTTP, components, routing, and optional UI fit together.</p>
            <a slot="actions" href="/packages">View packages</a>
          </nala-card>
          <nala-card>
            <span slot="eyebrow">Optional UI</span>
            <span slot="title">Use premade components</span>
            <p>Adopt the themed UI library when it helps, or build directly on Nala's lower-level primitives.</p>
            <a slot="actions" href="/components">Open the gallery</a>
          </nala-card>
          <nala-card>
            <span slot="eyebrow">Practice</span>
            <span slot="title">Follow the workflow</span>
            <p>Move from focused tests to reusable vendor code and a browser-tested integration.</p>
            <a slot="actions" href="/workflow">Review workflow</a>
          </nala-card>
          <nala-card variant="raised">
            <span slot="eyebrow">Learning path</span>
            <span slot="title">Learn TypeScript</span>
            <p>Build from JavaScript foundations toward professional TypeScript through a growing game collection.</p>
            <a slot="actions" href="/typescript">Read the book</a>
          </nala-card>
        </div>
      </article>
    `
});
