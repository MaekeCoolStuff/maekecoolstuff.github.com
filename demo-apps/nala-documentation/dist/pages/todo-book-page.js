import { defineComponent, html, repeat } from "../../../../vendor/components/dist/index.js";
import "./todo-chapter-one-page.js";
import "./todo-chapter-two-page.js";
import "./todo-chapter-three-page.js";
import { todoBookChapters } from "./todo-book/content.js";
import { chapterPath } from "./todo-book/types.js";
export { todoBookChapters };
defineComponent("docs-todo-book-page", {
  template: ()=>html`
      <article class="docs-page todo-book">
        <p class="page-eyebrow">Start here · Part I</p>
        <h1>Build a real task manager with Nala core</h1>
        <p
          class="page-lead">Start with an empty app folder. Build a browser page, give it a semantic task interface, then make that interface responsive with native HTML and CSS.</p>
        <section>
          <h2>What you will build</h2>
          <p>Part I starts from nothing in your own app folder. You will create a browser page, build its semantic task interface, and give it a responsive stylesheet.</p>
          <p>The tutorial app uses Nala's core packages and native browser APIs. It does not use the optional UI component library.</p>
        </section>
        <section>
          <h2>Before you start</h2>
          <p>Install Deno, clone this repository, and use a modern browser, editor and terminal. Basic variables and functions help; the chapters explain the code as you build.</p>
          <pre><code>deno task build:nala
      deno task dev:nala-documentation</code></pre>
          <p>Run commands from the repository root and open http://localhost:8080. Use <code>PORT=8084</code> when another server owns that port.</p>
          <a href="/typescript">Review the local TypeScript learning path</a>
        </section>
        <section>
          <h2>Part I: Foundation</h2>
          <ol>${repeat(todoBookChapters, (chapter)=>chapter.number, (chapter)=>html`
              <li>
                <a href=${chapterPath(chapter.number)}>${chapter.title}</a>
                <p>${chapter.lead}</p>
              </li>
            `)}</ol>
        </section>
      </article>
    `
});
export function createTodoChapter(number) {
  switch(number){
    case 1:
      return document.createElement("docs-todo-chapter-one");
    case 2:
      return document.createElement("docs-todo-chapter-two");
    case 3:
      return document.createElement("docs-todo-chapter-three");
    default:
      throw new RangeError(`There is no authored task-manager chapter ${number}.`);
  }
}
