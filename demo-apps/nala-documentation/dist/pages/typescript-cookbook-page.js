import { defineComponent, html, repeat } from "../../../../vendor/components/dist/index.js";
import { typescriptCookbookRecipes } from "./typescript-cookbook/index.js";
const categoryOrder = [
  "Values and collections",
  "Generics and inference",
  "Type design",
  "Browser APIs",
  "Data boundaries",
  "Failures and async work",
  "Application state",
  "Modules and APIs"
];
const recipesByCategory = categoryOrder.map((category)=>({
    category,
    recipes: typescriptCookbookRecipes.filter((recipe)=>recipe.category === category)
  }));
defineComponent("docs-typescript-cookbook-page", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">After the TypeScript book</p>
        <h1>TypeScript Cookbook</h1>
        <p class="page-lead">
          Practical fixes for the TypeScript problems that show up in real work.
          Each recipe starts with the symptom, explains why it happens, then shows
          a solution and the tradeoff to watch for.
        </p>

        <nala-callout tone="info">
          <span slot="title">Start with the problem</span>
          Read the symptom and cause before the code. The goal is to recognize the
          same shape of problem in your own application, not memorize a snippet.
        </nala-callout>

        ${repeat(recipesByCategory, (group)=>group.category, (group)=>html`
              <section aria-labelledby=${`cookbook-${group.category.replaceAll(" ", "-").toLowerCase()}`}>
                <h2 id=${`cookbook-${group.category.replaceAll(" ", "-").toLowerCase()}`}>
                  ${group.category}
                </h2>
                <div class="docs-stack">
                  ${repeat(group.recipes, (recipe)=>recipe.slug, (recipe)=>html`
                        <nala-card>
                          <span slot="eyebrow">${recipe.category}</span>
                          <span slot="title">${recipe.title}</span>
                          <p>${recipe.problem}</p>
                          <a
                            slot="actions"
                            href=${`/typescript/cookbook/${recipe.slug}`}
                          >Read the recipe</a>
                        </nala-card>
                      `)}
                </div>
              </section>
            `)}

        <p><a href="/typescript">Back to the TypeScript book</a></p>
      </article>
    `
});
