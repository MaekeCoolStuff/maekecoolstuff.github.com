import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-26", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 4: TypeScript in the browser · Chapter 26</p>
        <h1>Accessibility and browser contracts</h1>
        <p>
                Type safety does not make an interface accessible. Use native
                elements for their built-in keyboard behavior, form participation,
                focus, and semantics. Keep labels connected to controls and use
                buttons for actions and links for navigation.
              </p>
              ${renderCodeExample(`<form id="game-form">
  <label for="game-title">Game title</label>
<input id="game-title" name="title" required />
  <button type="submit">Save game</button>
</form>`)}
              ${renderCodeExample(`function saveGameTitle(title: string): void {
  console.log("Saving " + title);
}

const form = document.querySelector<HTMLFormElement>("#game-form");
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const title = formData.get("title");
  if (typeof title !== "string" || title.trim() === "") return;
  saveGameTitle(title.trim());
});`)}
          <section>
            <h2>Types do not certify accessibility</h2>
            <p>
              TypeScript can verify that an element has a
              <code>focus</code> method or that a button's disabled state is
              boolean. It cannot prove that a person can perceive, understand,
              or operate the interface. Accessibility depends on rendered
              semantics, keyboard behavior, focus management, visual design,
              and assistive-technology output.
            </p>
            <p>
              Start with native HTML. Use buttons for actions, links for
              navigation, headings for document structure, and form controls
              with associated labels. Native elements provide keyboard and
              accessibility behavior that a custom div does not gain from a
              type annotation or ARIA role alone.
            </p>
            ${renderCodeExample(`<button type="button">Add to wishlist</button>
  <a href="/games/g-1">View Celeste</a>

  <label for="game-title">Game title</label>
  <input id="game-title" name="title" required />`)}
          </section>

          <section>
            <h2>Accessible names and descriptions are different</h2>
            <p>
              A label gives a control its accessible name. A description
              supplies additional help or error text and can be connected with
              <code>aria-describedby</code>. Placeholder text is not a
              replacement for a persistent label. Keep relationships between
              an input, its instructions, and its error visible in both markup
              and interaction code.
            </p>
            ${renderCodeExample(`<label for="hours">Hours played</label>
  <input
    id="hours"
    name="hours"
    type="number"
    aria-describedby="hours-help hours-error"
    aria-invalid="true"
  />
  <p id="hours-help">Enter a non-negative number.</p>
  <p id="hours-error">Hours cannot be negative.</p>`)}
            <p>
              When validation changes, update <code>aria-invalid</code> and
              the associated message consistently. Do not communicate errors
              only through color or a transient console message. Preserve
              focus so keyboard and screen-reader users can find the problem.
            </p>
          </section>

          <section>
            <h2>Keyboard support follows interaction semantics</h2>
            <p>
              Native buttons activate with keyboard input and participate in
              tab order. A clickable div needs a role, focusability, keyboard
              handling, disabled behavior, and other state semantics; it is
              usually better to use a button. Do not add custom key handlers
              that duplicate native activation or trap focus unexpectedly.
            </p>
            ${renderCodeExample(`const saveButton = document.querySelector<HTMLButtonElement>("#save-game");
  saveButton?.addEventListener("click", () => {
    saveGame();
  });

  // Native button activation supports pointer and keyboard input.`)}
            <p>
              When a workflow changes the page or opens a dialog, decide where
              focus should move and where it should return. Avoid positive
              <code>tabindex</code> values that create a tab order unrelated
              to the document structure.
            </p>
          </section>

          <section>
            <h2>Expose dynamic state and feedback</h2>
            <p>
              Users need to know when an asynchronous action is loading,
              succeeded, or failed. Use an appropriate status region for
              announcements, keep its text meaningful, and ensure the state
              shown visually is also represented semantically. A type-safe
              state machine helps keep these states consistent but does not
              guarantee announcements are usable.
            </p>
            ${renderCodeExample(`<p id="save-status" role="status" aria-live="polite"></p>

  const status = document.querySelector<HTMLElement>("#save-status");
  if (status !== null) {
    status.textContent = "Game saved";
  }`)}
            <p>
              Reserve live regions for information that needs announcing;
              excessive updates can overwhelm assistive technology. For
              modal dialogs, prefer the native dialog element when its
              behavior fits and verify focus entry, containment, close, and
              return behavior in supported browsers.
            </p>
          </section>

          <section>
            <h2>Forms need accessible validation paths</h2>
            <p>
              <code>FormData.get</code> returns
              <code>FormDataEntryValue | null</code>, where an entry may be
              a string or a File. Check the runtime value, apply domain
              validation, associate any error with the control, and provide a
              clear recovery action. Native constraints such as
              <code>required</code> help but do not replace application rules.
            </p>
            ${renderCodeExample(`const form = document.querySelector<HTMLFormElement>("#game-form");
    if (form === null) throw new Error("The game form is missing");

    form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const entry = formData.get("title");
    if (typeof entry !== "string" || entry.trim() === "") {
      const input = form.querySelector<HTMLInputElement>("#game-title");
      input?.focus();
      return;
    }
    saveGameTitle(entry.trim());
  });`)}
            <p>
              A type check prevents passing a File as a title, but does not
              tell the user what went wrong or where to correct it. Add visible
              instructions, focus management, and a connected error message.
            </p>
          </section>

          <section>
            <h2>Test with people and assistive technology</h2>
            <ul>
              <li>Navigate every workflow using only a keyboard.</li>
              <li>Check focus visibility, order, and return after dialogs or route changes.</li>
              <li>Verify names, roles, values, and announcements with a screen reader.</li>
              <li>Test zoom, narrow viewports, contrast, and text resizing.</li>
              <li>Use automated checks as a supplement, not a substitute for manual testing.</li>
            </ul>
            ${renderWorkedExample(html`
              <h2>Practice: review the save flow</h2>
              <p>
                Save a game using keyboard only. Confirm the title field has a
                persistent accessible name, invalid input receives an
                associated message and focus, and successful saving is
                announced without stealing focus. Verify both the DOM
                semantics and interaction in a browser.
              </p>
            `)}
          </section>
              <p>
                <code>FormData.get</code> can return a string, a File, or null, so
                the runtime check is part of reading the form safely. Native
                <code>required</code> adds browser validation, but domain rules may
                still require application checks. A TypeScript type cannot replace a
                visible label, keyboard support, or a useful error message.
              </p>
              ${renderWorkedExample(html`
                <p>
                  A variable name exists in source code, not as an accessible name
                  in the rendered page. The label connects visible text to the
                  control. <code>FormData.get</code> returns
                  <code>string | File | null</code>, so validate its runtime value
                  before using it as a title.
                </p>
              `)}
      </article>
    `
});
