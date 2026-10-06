import { defineComponent, html, repeat } from "../../../../vendor/components/dist/index.js";
import { createRouter } from "../../../../vendor/router/dist/index.js";
import { gameTypeExample } from "./ui-component-shared.js";
import { uiComponentDocs, uiComponentLessons } from "./ui-components/index.js";
import { renderCodeExample } from "./code-example.js";
export { uiComponentDocs } from "./ui-components/index.js";
export function createUiComponentPage(slug) {
  const page = document.createElement("docs-ui-component-page");
  page.setAttribute("component", slug);
  return page;
}
defineComponent("docs-ui-component-page", {
  props: {
    component: "string"
  },
  template: ({ component })=>{
    const doc = uiComponentDocs.find((item)=>item.slug === component) ?? uiComponentDocs[0];
    const index = uiComponentDocs.findIndex((item)=>item.slug === doc.slug);
    const previous = uiComponentDocs[(index + uiComponentDocs.length - 1) % uiComponentDocs.length];
    const next = uiComponentDocs[(index + 1) % uiComponentDocs.length];
    const api = doc.api.map((item)=>({
        name: item.name,
        type: item.type,
        defaultValue: item.defaultValue,
        description: item.description
      }));
    const slots = [
      ...doc.slots
    ];
    const events = [
      ...doc.events
    ];
    const lessons = uiComponentLessons[doc.slug] ?? [];
    return html`
      <article class="docs-page">
              <p class="page-eyebrow">UI component reference</p>
              <h1>${doc.title}</h1>
              <p class="page-lead">${doc.description}</p>
              <section class="component-showcase" aria-label="Live example">
                <div class="component-example-heading">
                  <p class="page-eyebrow">Live example</p>
                  <code>${doc.tag}</code>
                </div>
                <div class="component-demo">${doc.preview()}</div>
              </section>
              ${doc.slug === "guitar-neck" ? html`
                  <h2>Our running example: practicing game music</h2>
                  <p>
                    A Game Shelf music-practice screen could show a chord beside a
                    game's soundtrack notes. The same component can also serve a
                    standalone guitar lesson app. The examples here need only a
                    six-string chord shape and an optional fingering, not a game
                    record or a lesson engine.
                  </p>
                ` : html`
              <h2>Our running example: Game Shelf</h2>
              <p>
                We are building a small tracker for games we own, want to play, or
                have finished. Each example below works with a game record like this:
              </p>
              ${renderCodeExample(gameTypeExample)}
              <p>
                In the short snippets, <code>game</code> is the selected record,
                <code>games</code> is the loaded collection, and
                <code>collection.actions</code> contains the app's write operations.
                The surrounding screen has already loaded these values so each
                example can focus on one component behavior.
              </p>`}
              <h2>Usage</h2>
              <p>${doc.summary} ${doc.slug === "guitar-neck" ? "Here is a complete chord diagram." : "Here is the smallest useful example in the tracker."}</p>
              ${renderCodeExample(doc.usage)}
              <h2>Build it step by step</h2>
              <p>
                ${doc.slug === "guitar-neck" ? "Start with a chord shape, add finger labels, then connect the diagram to your application's lesson selection." : "Each step connects the UI to a real collection task. Read the HTML as the player's control, then follow the code to see which value or action the application receives."}
              </p>
              ${repeat(lessons, (lesson)=>lesson.title, (lesson)=>html`
                  <section class="learning-step">
                    <h3>${lesson.title}</h3>
                    <p>${lesson.explanation}</p>
                    ${lesson.preview?.()}
                    ${renderCodeExample(lesson.code)}
                  </section>
                `)}
              <h2>Options and API</h2>
              <div class="api-table-wrap"><table class="api-table">
                <thead><tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">Default</th><th scope="col">Description</th></tr></thead>
                <tbody>${repeat(api, (item)=>item.name, (item)=>html`
                    <tr>
                      <td><code>${item.name}</code></td>
                      <td>${item.type}</td>
                      <td>${item.defaultValue}</td>
                      <td>${item.description}</td>
                    </tr>
                  `)}</tbody>
              </table></div>
              ${slots.length ? html`
                  <h2>Slots</h2>
                  <div class="api-table-wrap">
                    <table class="api-table">
                      <thead>
                        <tr>
                          <th scope="col">Slot</th>
                          <th scope="col">Purpose</th>
                        </tr>
                      </thead>
                      <tbody>${repeat(slots, (item)=>item.name, (item)=>html`
                          <tr>
                            <td><code>${item.name}</code></td>
                            <td>${item.description}</td>
                          </tr>
                        `)}</tbody>
                    </table>
                  </div>
                ` : null}
              ${events.length ? html`
                  <h2>Events</h2>
                  <div class="api-table-wrap">
                    <table class="api-table">
                      <thead>
                        <tr>
                          <th scope="col">Event</th>
                          <th scope="col">Type</th>
                          <th scope="col">Behavior</th>
                        </tr>
                      </thead>
                      <tbody>${repeat(events, (item)=>item.name, (item)=>html`
                          <tr>
                            <td><code>${item.name}</code></td>
                            <td>${item.type}</td>
                            <td>${item.description}</td>
                          </tr>
                        `)}</tbody>
                    </table>
                  </div>
                ` : null}
              ${doc.parts.length ? html`
                  <h2>Styling parts</h2>
                  <p>Target these Shadow Parts with <code>${doc.tag}::part(name)</code> when a theme token is not specific enough.</p>
                  <div class="button-row">${repeat(doc.parts, (part)=>part, (part)=>html`<nala-badge>${part}</nala-badge>`)}</div>
                ` : null}
              <p class="page-lead component-pagination">
                <a href=${`/components/${previous.slug}`}>Previous: ${previous.title}</a>
                <span aria-hidden="true"> · </span>
                <a href=${`/components/${next.slug}`}>Next: ${next.title}</a>
              </p>
            </article>
    `;
  }
});
defineComponent("docs-ui-component-index", {
  template: ()=>html`
      <section class="component-reference-empty">
        <p class="page-lead">
          Select a UI component in the component navigation to explore its
          examples and API.
        </p>
      </section>
    `
});
// The outer documentation router owns the URL; the component shell syncs this
// nested outlet to the current path whenever it mounts.
const componentReferenceHistory = {
  getPath: ()=>globalThis.location.pathname,
  pushPath: ()=>{},
  onPopState: ()=>()=>{}
};
export const uiComponentReferenceRouter = createRouter([
  {
    path: "/components",
    component: ()=>document.createElement("docs-ui-component-index")
  },
  ...uiComponentDocs.map(({ slug })=>({
      path: `/components/${slug}`,
      component: ()=>createUiComponentPage(slug)
    }))
], {
  history: componentReferenceHistory
});
