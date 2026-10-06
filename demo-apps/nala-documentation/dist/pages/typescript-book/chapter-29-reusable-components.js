import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-29", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 5: From feature to application · Chapter 29</p>
        <h1>Reusable components</h1>
        <p>
                A component is a boundary around a user-interface responsibility.
                Its contract should say what data it accepts and what events it
                emits. In the browser, Custom Elements, native attributes, and
                CustomEvents provide building blocks; TypeScript can describe the
                contract, but runtime attributes still need parsing and validation.
              </p>
              ${renderCodeExample(`class GameCardElement extends HTMLElement {
  #game?: Game;

  set game(value: Game) {
    this.#game = value;
    this.render();
  }

  private render(): void {
    this.replaceChildren();
    if (!this.#game) return;

    const heading = document.createElement("h2");
    heading.textContent = this.#game.title;
    this.append(heading);
  }
}

interface GameCardElement extends HTMLElement {
  game: Game;
}

customElements.define("game-card", GameCardElement);
const card = document.querySelector<GameCardElement>("game-card");
if (card) card.game = game;`)}
              <p>
                The custom element exposes a typed property to TypeScript callers
                and renders the title through <code>textContent</code>. An attribute
                such as <code>&lt;game-card game="..."&gt;</code> would still be a
                string and would need a defined parser. Give event names, payloads,
                lifecycle cleanup, and keyboard behavior the same care as input
                types.
              </p>
              ${renderWorkedExample(html`
                <p>
                  Expose a <code>game: Game</code> property (or a validated
                  attribute contract) and dispatch a bubbling
                  <code>game-open</code> CustomEvent whose detail is that Game.
                  Keep the payload typed and render user text as text, not HTML.
                </p>
              `)}
        <section>
          <h2>Choose a component boundary by responsibility</h2>
          <p>
            A component should own one coherent user-interface
            responsibility and expose a small contract: inputs, outputs,
            and lifecycle. Not every wrapper needs to become a component.
            Reuse one when it provides a meaningful boundary, behavior,
            accessibility contract, or independently evolving interface.
          </p>
          <p>
            Native elements remain the foundation. Custom Elements help
            when a reusable browser element needs a stable tag name and
            lifecycle. Slots provide native composition. Shadow DOM can
            isolate styles, but changes style and event boundaries and
            should be chosen deliberately.
          </p>
        </section>

        <section>
          <h2>Separate attributes from properties</h2>
          <p>
            HTML attributes are strings or absent. JavaScript properties
            may carry booleans, numbers, objects, or functions. Define
            which values belong in markup and which are assigned as
            properties, parse string attributes at the boundary, and decide
            how changes are reflected. An attribute called
            <code>game</code> does not automatically contain a Game object.
          </p>
          ${renderCodeExample(`class GameCardElement extends HTMLElement {
  #game: Game | undefined;

  set game(value: Game) {
    this.#game = value;
    this.render();
  }

  render(): void {
    this.replaceChildren();
    if (this.#game === undefined) return;
    const heading = document.createElement("h2");
    heading.textContent = this.#game.title;
    this.append(heading);
  }
}

customElements.define("game-card", GameCardElement);`)}
          <p>
            The setter expects an already trusted Game. If the component
            accepts an attribute, validate and parse it separately before
            assigning the property. Render user-provided text with safe DOM
            APIs such as <code>textContent</code>.
          </p>
        </section>

        <section>
          <h2>Events are outputs of the component contract</h2>
          <p>
            Document custom event names, detail shapes, bubbling, and
            whether the event crosses a Shadow DOM boundary. The generic
            on <code>CustomEvent&lt;Detail&gt;</code> is a compile-time
            contract; it does not validate arbitrary events at runtime.
          </p>
          ${renderCodeExample(`type GameOpenDetail = { gameId: string };

function announceOpen(element: HTMLElement, gameId: string): void {
  element.dispatchEvent(new CustomEvent<GameOpenDetail>("game-open", {
    detail: { gameId },
    bubbles: true,
    composed: true,
  }));
}`)}
          <p>
            Use native bubbling when an ancestor owns the workflow. Prefer
            one clear event with enough detail over several redundant
            events for the same action.
          </p>
        </section>

        <section>
          <h2>Lifecycle cleanup is part of the API</h2>
          <p>
            Browser elements can connect, disconnect, and connect again.
            Global listeners, timers, subscriptions, and observers should
            follow the component's active lifetime. Otherwise reconnecting
            can duplicate work or retain detached elements.
          </p>
          ${renderCodeExample(`class OnlineStatusElement extends HTMLElement {
  #controller: AbortController | undefined;

  connectedCallback(): void {
    this.#controller = new AbortController();
    window.addEventListener("online", this.update, {
      signal: this.#controller.signal,
    });
    this.update();
  }

  disconnectedCallback(): void {
    this.#controller?.abort();
    this.#controller = undefined;
  }

  private update = (): void => {
    this.textContent = navigator.onLine ? "Online" : "Offline";
  };
}`)}
          <p>
            Attach each resource at the lifecycle that owns it and release
            it during cleanup. Rendered list items need stable IDs when their
            identity should survive updates or reordering.
          </p>
        </section>

        <section>
          <h2>Compose and test real component behavior</h2>
          <ul>
            <li>Use slots or child elements instead of hidden parent knowledge.</li>
            <li>Keep domain rules in application functions that can be tested without a DOM.</li>
            <li>Preserve native keyboard and form behavior.</li>
            <li>Test events, cleanup, rendering, focus, disconnect, and reconnect in a browser.</li>
            <li>Validate externally sourced data before assigning component properties.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: define a reusable game card</h2>
            <p>
              Specify a Game property, a <code>game-open</code> event, its
              composition points, and its cleanup behavior. Decide where
              data becomes trusted, then verify the card with pointer,
              keyboard, disconnect, and reconnect workflows.
            </p>
          `)}
        </section>
      </article>
    `
});
