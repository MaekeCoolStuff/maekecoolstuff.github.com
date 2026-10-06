import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-22", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 4: TypeScript in the browser · Chapter 22</p>
        <h1>Browser state and events</h1>
        <p>
                The browser's <code>EventTarget</code> model lets elements announce
                that something happened without importing a second event system.
                Native events have platform-defined behavior; a CustomEvent can carry
                a typed detail payload for an application-specific event.
              </p>
              ${renderCodeExample(`function announceGameSelected(game: Game): void {
  document.dispatchEvent(
    new CustomEvent<Game>("game-selected", {
      detail: game,
      bubbles: true,
    }),
  );
}

document.addEventListener("game-selected", (event) => {
  const selected = (event as CustomEvent<Game>).detail;
  console.log("Selected " + selected.title);
});`)}
              <p>
                The generic on <code>CustomEvent&lt;Game&gt;</code> describes the
                detail at the point where this application creates the event. DOM
                event maps do not automatically know every custom event name, so a
                listener may need a narrow assertion tied to a trusted event
                contract. Do not treat an arbitrary message from outside the app as
                a valid Game.
              </p>
              ${renderWorkedExample(html`
                <p>
                  Use <code>new CustomEvent&lt;Game&gt;(..., { detail: game })</code>
                  and read <code>(event as CustomEvent&lt;Game&gt;).detail.title</code>
                  in the listener. The assertion is justified only because the
                  application controls the dispatch contract; arbitrary external
                  event data needs runtime validation.
                </p>
              `)}
        <section>
          <h2>Events are typed messages with browser-defined behavior</h2>
          <p>
            DOM events use the browser's <code>EventTarget</code> system.
            Standard event maps provide useful listener types: an input's
            <code>input</code> listener receives an <code>InputEvent</code>,
            while a button's <code>click</code> listener receives a
            <code>MouseEvent</code>. TypeScript helps select the right
            properties, but it does not change when the browser fires the
            event or which element caused it.
          </p>
          ${renderCodeExample(`const search = document.querySelector<HTMLInputElement>("#game-search");
search?.addEventListener("input", (event) => {
  console.log(event.inputType, search.value);
});

const saveButton = document.querySelector<HTMLButtonElement>("#save-game");
saveButton?.addEventListener("click", (event) => {
  console.log(event.currentTarget === saveButton);
});`)}
          <p>
            <code>target</code> is where the event originated;
            <code>currentTarget</code> is the target whose listener is
            currently running. The event target can be a nested child, so
            use <code>currentTarget</code> when code needs the element that
            owns the handler. Snapshot values during the handler rather than
            relying on <code>currentTarget</code> later.
          </p>
        </section>

        <section>
          <h2>Propagation and cancellation are different operations</h2>
          <p>
            Bubbling lets an event travel from its target toward ancestors;
            capture listeners observe it on the way down. Delegation uses
            bubbling so one stable ancestor can handle events from dynamic
            descendants. <code>preventDefault</code> cancels a cancelable
            browser action; <code>stopPropagation</code> stops travel. Avoid
            either unless the interaction contract requires it.
          </p>
          ${renderCodeExample(`const list = document.querySelector("#game-list");
list?.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest<HTMLButtonElement>("button[data-action]");
  if (button === null || !list.contains(button)) return;
  const gameId = button.dataset.gameId;
  if (gameId === undefined) return;
  console.log("Open game " + gameId);
});`)}
          <p>
            The runtime checks make assumptions explicit: the target is an
            Element, the closest button exists within this list, and its
            dataset value is present. A type assertion cannot substitute for
            those checks. Use capture, once, passive, or signal listener
            options only when their semantics match the workflow.
          </p>
        </section>

        <section>
          <h2>Manage listener lifetime</h2>
          <p>
            A listener keeps its callback reachable until removed or its
            target is collected. Recreating UI can accidentally register the
            same listener repeatedly. Keep the callback reference so it can
            be removed, use <code>once</code> for one-shot behavior, or use
            an abort signal to group related listeners under one cleanup
            boundary.
          </p>
          ${renderCodeExample(`const controller = new AbortController();
const options = { signal: controller.signal };

window.addEventListener("online", () => {
  console.log("Connection restored");
}, options);

document.addEventListener("visibilitychange", () => {
  console.log(document.visibilityState);
}, options);

// When this feature is removed:
controller.abort();`)}
          <p>
            Abortable event listeners are supported by modern browsers. For
            older targets, use <code>removeEventListener</code> with the
            same callback and compatible capture setting. Cleanup should be
            tied to the component or feature lifetime that owns the listener.
          </p>
        </section>

        <section>
          <h2>CustomEvent detail types are compile-time contracts</h2>
          <p>
            A custom event can carry structured data in
            <code>detail</code>. The generic argument types the dispatching
            code and cooperating listeners; it does not validate arbitrary
            events from extensions, scripts, or other trust boundaries.
            Bubbling and crossing a shadow boundary are separate options.
          </p>
          ${renderCodeExample(`type GameSelectedDetail = { gameId: string };

function selectGame(element: HTMLElement, gameId: string): void {
  element.dispatchEvent(new CustomEvent<GameSelectedDetail>("game-selected", {
    detail: { gameId },
    bubbles: true,
    composed: true,
  }));
}

element.addEventListener("game-selected", (event) => {
  const detail = (event as CustomEvent<GameSelectedDetail>).detail;
  console.log(detail.gameId);
});`)}
          <p>
            The assertion in the listener is justified only when the
            application controls the dispatch contract. Use a shared helper
            or an event map to centralize custom event names and payload
            shapes. Validate payloads that cross an untrusted boundary.
          </p>
        </section>

        <section>
          <h2>Keyboard and form events follow native semantics</h2>
          <p>
            Do not treat a pointer click as the only way an action can occur.
            Native buttons already support keyboard activation and focus;
            replacing them with a div means reimplementing those behaviors.
            Input values are strings, and checkboxes expose a boolean
            <code>checked</code> property. Chapter 26 covers their
            accessible contracts in detail.
          </p>
          ${renderCodeExample(`const favoriteInput = document.querySelector<HTMLInputElement>("#favorite");
favoriteInput?.addEventListener("change", () => {
  const favorite = favoriteInput.checked;
  console.log(favorite ? "Added to favorites" : "Removed from favorites");
});`)}
        </section>

        <section>
          <h2>Practice: follow an event end to end</h2>
          <ol>
            <li>Choose a native control that emits the event you need.</li>
            <li>Identify target, currentTarget, and whether bubbling is needed.</li>
            <li>Validate the event target and any dataset or detail values.</li>
            <li>Connect listener cleanup to the feature's lifetime.</li>
            <li>Test pointer, keyboard, cancellation, and dynamic content behavior.</li>
          </ol>
        </section>
      </article>
    `
});
