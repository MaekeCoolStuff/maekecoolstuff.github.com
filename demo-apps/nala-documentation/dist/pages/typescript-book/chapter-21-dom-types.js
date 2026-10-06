import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-21", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 4: TypeScript in the browser · Chapter 21</p>
        <h1>The DOM type system</h1>
        <p>
                The DOM is a tree of nodes. A selector may fail to find a matching
                element, so TypeScript correctly includes <code>null</code> in the
                return type. Use a generic selector when the element kind is known,
                then check that the element exists before using it.
              </p>
              ${renderCodeExample(`const searchInput = document.querySelector<HTMLInputElement>(
  "#game-search",
);

if (searchInput !== null) {
  searchInput.value = "Celeste";
  searchInput.focus();
}

const gameItems = document.querySelectorAll<HTMLLIElement>(".game-item");
gameItems.forEach((item) => console.log(item.textContent));`)}
              <p>
                The generic argument says what the selector is expected to find; it
                does not inspect the document or guarantee that the selector matches
                that element. A wrong selector can still make a later operation fail.
                Query close to where an element is used and handle a missing result
                deliberately.
              </p>
              ${renderWorkedExample(html`
                ${renderCodeExample(`const searchInput = document.querySelector<HTMLInputElement>(
  "#game-search",
);

if (searchInput !== null) {
  searchInput.value = "Hades";
}`)}
                <p>
                  The null check narrows the value to an HTMLInputElement. A
                  non-null assertion would silence the checker without making the
                  selector succeed.
                </p>
              `)}
        <section>
          <h2>DOM types describe a browser API surface</h2>
          <p>
            The DOM declarations tell TypeScript which operations browsers
            expose on nodes, elements, forms, and events. They are compile-time
            descriptions, not browser implementations and not proof that an
            element exists. The runtime still decides what a selector matches
            and which APIs the current environment supports.
          </p>
          <p>
            The DOM is a tree. <code>Node</code> includes text and comments;
            <code>Element</code> represents an element node; specialized types
            such as <code>HTMLInputElement</code> add element-specific
            properties. Choose the narrowest known type only when the markup
            or runtime check supports it.
          </p>
          ${renderCodeExample(`const list = document.querySelector("#game-list");
if (list !== null) {
  console.log(list.nodeType, list.textContent);
}

const button = document.createElement("button");
button.type = "button";
button.textContent = "Add game";`)}
        </section>

        <section>
          <h2>Selectors are nullable contracts</h2>
          <p>
            <code>querySelector</code> may return null when there is no match.
            Its generic argument specifies the type you expect to find; it
            does not inspect the selector and verify that expectation. A
            selector that matches a div while claimed to return an input can
            still fail at runtime when input-only properties are accessed.
          </p>
          ${renderCodeExample(`const search = document.querySelector<HTMLInputElement>("#game-search");
if (search === null) {
  throw new Error("The game search control is missing");
}

search.value = "Celeste";
search.focus();

const items = document.querySelectorAll<HTMLLIElement>(".game-item");
items.forEach((item) => console.log(item.textContent));`)}
          <p>
            Prefer a deliberate missing-element policy: return early for an
            optional enhancement, or report a clear invariant failure for a
            required control. Avoid non-null assertions that silence the
            useful <code>null</code> result without changing browser behavior.
          </p>
        </section>

        <section>
          <h2>Collections and property access have different shapes</h2>
          <p>
            <code>querySelectorAll</code> returns a static
            <code>NodeList</code> snapshot. Some older APIs such as
            <code>getElementsByClassName</code> return live
            <code>HTMLCollection</code> objects that reflect later DOM
            changes. <code>getAttribute</code> and <code>dataset</code> values
            are strings or absent values, while element properties may have
            richer types.
          </p>
          ${renderCodeExample(`const item = document.querySelector(".game-item");
const dataId = item?.getAttribute("data-game-id"); // string | null
const datasetId = item?.dataset.gameId; // string | undefined

if (item instanceof HTMLElement) {
  item.hidden = false;
  item.classList.add("is-selected");
}`)}
          <p>
            Optional chaining avoids a property access when the element is
            absent, but it should not hide a required DOM invariant. For a
            runtime type distinction, use a real check such as
            <code>instanceof HTMLInputElement</code> where appropriate.
          </p>
        </section>

        <section>
          <h2>Form values are not automatically domain values</h2>
          <p>
            An input's <code>value</code> is text even when its visual input
            mode is numeric. Parse and validate it before using it as a
            number. Checkboxes use <code>checked</code>, not the text value,
            for their boolean state. Chapter 26 covers the accessible form
            contract; Chapter 24 covers reusable runtime validation.
          </p>
          ${renderCodeExample(`const hoursInput = document.querySelector<HTMLInputElement>("#hours");
if (hoursInput !== null) {
  const hours = Number(hoursInput.value);
  if (!Number.isFinite(hours) || hours < 0) {
    hoursInput.setCustomValidity("Enter a non-negative number of hours");
  } else {
    hoursInput.setCustomValidity("");
  }
}

const favorite = document.querySelector<HTMLInputElement>("#favorite");
const isFavorite = favorite?.checked ?? false;`)}
        </section>

        <section>
          <h2>Update the DOM safely</h2>
          <p>
            Use <code>textContent</code> for untrusted text. Assigning a
            string to <code>innerHTML</code> parses markup and can create
            injection vulnerabilities. Build nodes with
            <code>createElement</code>, set known properties, and append them
            when content is data rather than trusted static markup.
          </p>
          ${renderCodeExample(`function renderGameTitle(title: string, root: HTMLElement): void {
  const heading = document.createElement("h2");
  heading.textContent = title;
  root.replaceChildren(heading);
}`)}
          <p>
            TypeScript checks the element APIs used here; it does not prove
            that the root is visible, accessible, or correctly positioned.
            Browser behavior still needs browser-level verification.
          </p>
        </section>

        <section>
          <h2>Keep browser APIs at an explicit boundary</h2>
          <ul>
            <li>Use DOM element generics to describe expectations, then handle missing elements.</li>
            <li>Distinguish Node, Element, and specialized HTML element contracts.</li>
            <li>Check runtime values when code depends on a particular element kind.</li>
            <li>Parse form text before treating it as a number or domain value.</li>
            <li>Test pure logic in Deno and browser-specific behavior in a real browser.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: make a search control resilient</h2>
            <p>
              Query a search input that may be absent on some routes. Decide
              whether to return early or show an invariant error, read its
              value as text, and ensure an empty query has an intentional
              meaning. Then test the workflow with the real page markup.
            </p>
          `)}
        </section>
      </article>
    `
});
