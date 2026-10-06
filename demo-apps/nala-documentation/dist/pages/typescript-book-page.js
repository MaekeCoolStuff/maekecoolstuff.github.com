import { defineComponent, html, repeat } from "../../../../vendor/components/dist/index.js";
import { typescriptBookParts } from "./typescript-book/index.js";
export { typescriptBookChapters } from "./typescript-book/index.js";
defineComponent("docs-typescript-book-page", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Learning path</p>
        <h1>TypeScript: from first program to professional practice</h1>
        <p class="page-lead">
          Forty chapters build one concept at a time, using Game Shelf as a running
          example. Follow the parts in order and pause at the worked examples to see
          how each idea changes real application code.
        </p>
        ${repeat(typescriptBookParts, (part)=>part.number, (part)=>html`
              <section aria-labelledby=${"typescript-part-" + part.number}>
                <h2 id=${"typescript-part-" + part.number}>
                  ${part.title}
                </h2>
                <ol>
                  ${repeat(part.chapters, (chapter)=>chapter.number, (chapter)=>html`
                        <li>
                          <a href=${"/typescript/" + chapter.slug}>
                            Chapter ${chapter.number}: ${chapter.title}
                          </a>
                        </li>
                      `)}
                </ol>
              </section>
            `)}
          <section aria-labelledby="typescript-cookbook">
            <p class="page-eyebrow">After Part VI</p>
            <h2 id="typescript-cookbook">TypeScript Cookbook</h2>
            <p>
              Apply the book's ideas to common problems from real projects. Each
              recipe explains the symptom and cause before showing a solution and
              the tradeoff to watch for.
            </p>
            <a href="/typescript/cookbook">Browse the cookbook</a>
          </section>
      </article>
    `
});
