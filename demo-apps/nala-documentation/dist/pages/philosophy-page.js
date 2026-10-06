import { defineComponent, html } from "../../../../vendor/components/dist/index.js";
defineComponent("docs-philosophy-page", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Philosophy</p>
        <h1>Beauty in simplicity.</h1>
        <p class="page-lead">
          Nala starts with Custom Elements, native events, browser history, fetch,
          and ES modules. Its vendor packages remove repeated plumbing without
          hiding the platform underneath.
        </p>

        <div class="docs-stack">
          <nala-card variant="accent">
            <span slot="title">Native first</span>
            <p>Framework primitives should clarify browser behavior rather than replace it.</p>
          </nala-card>
          <nala-card>
            <span slot="title">Explicit ownership</span>
            <p>State, lifecycle resources, persistence, and rendering each have a visible owner.</p>
          </nala-card>
          <nala-card>
            <span slot="title">Optional layers</span>
            <p>The UI component library is a convenience layer. Applications remain free to use vendor/components directly.</p>
          </nala-card>
          <nala-card>
            <span slot="title">One honest tool</span>
            <p>Deno checks, tests, and serves the code, and its only transformation is erasing TypeScript types. No bundler, compiler, or runtime engine sits between what you write and what the browser runs.</p>
            <a slot="actions" href="/deno">Why Deno</a>
          </nala-card>
        </div>
      </article>
    `
});
