import { defineComponent, html, repeat } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample } from "../typescript-book/shared.js";
export function registerTypeScriptCookbookRecipe(recipe) {
  const tagName = `docs-ts-cookbook-${recipe.slug}`;
  defineComponent(tagName, {
    template: ()=>html`
        <article class="docs-page">
          <p class="page-eyebrow">TypeScript Cookbook · ${recipe.category}</p>
          <h1>${recipe.title}</h1>
          <p class="page-lead">${recipe.problem}</p>

          <h2>Why this happens</h2>
          <p>${recipe.rootCause}</p>

          <h2>A reliable solution</h2>
          ${renderCodeExample(recipe.solutionCode)}
          <p>${recipe.whyItWorks}</p>

          <nala-callout tone="warning">
            <span slot="title">Common trap</span>
            ${recipe.commonTrap}
          </nala-callout>

          <h2>A related example</h2>
          ${renderCodeExample(recipe.workedExampleCode)}
          <p>${recipe.workedExampleExplanation}</p>

          <section>
            <h2>Choose this approach when</h2>
            <p>${recipe.decisionGuide}</p>
          </section>

          <section>
            <h2>Edge cases to check</h2>
            <ul>
              ${repeat(recipe.edgeCases, (edgeCase)=>edgeCase, (edgeCase)=>html`<li>${edgeCase}</li>`)}
            </ul>
          </section>

          <section>
            <h2>Verify the behavior</h2>
            ${renderCodeExample(recipe.verificationCode)}
            <p>${recipe.verificationNote}</p>
          </section>

          <section>
            <h2>Practice</h2>
            <p>${recipe.practice}</p>
          </section>

          <p><a href="/typescript/cookbook">Back to the TypeScript Cookbook</a></p>
        </article>
      `
  });
  return tagName;
}
