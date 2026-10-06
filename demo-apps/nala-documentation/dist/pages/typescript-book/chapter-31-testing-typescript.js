import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-31", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 5: From feature to application · Chapter 31</p>
        <h1>Testing TypeScript</h1>
        <p>
                Type checking verifies that code agrees with its static contracts.
                Tests verify behavior for actual inputs and environments. Neither
                replaces the other. Keep domain rules and parsers testable without a
                browser, then add browser checks for behavior that depends on real
                DOM, focus, layout, or navigation.
              </p>
              ${renderCodeExample(`import { assertEquals } from "jsr:@std/assert";

const completedGame: Game = {
  id: "g-1",
  title: "Celeste",
  platforms: ["PC"],
  playState: { status: "completed" },
};
const backlogGame: Game = {
  id: "g-2",
  title: "Hades",
  platforms: ["PC"],
  playState: { status: "backlog" },
};

Deno.test("completed games are counted once", () => {
  assertEquals(completedCount([completedGame, backlogGame]), 1);
});`)}
              <p>
                Add cases for empty collections, each union alternative, malformed
                external input, and failures. A browser test should also check
                interactions and focus; a unit test cannot prove that a native
                dialog or custom element behaves correctly in the browser.
              </p>
              ${renderWorkedExample(html`
                <p>
                  Test valid values, null, arrays, missing properties, and
                  properties with incorrect types. Assert both the returned
                  normalized data and the expected failure for invalid inputs.
                  Types alone do not execute these cases.
                </p>
              `)}
        <section>
          <h2>Use the right verification layer</h2>
          <p>
            Static checking finds contradictions in types and module
            relationships. Unit tests execute focused behavior. Integration
            tests verify cooperating modules and adapters. Browser tests
            verify real DOM, focus, navigation, layout, and platform events.
            A pass at one layer does not imply a pass at another.
          </p>
          <ul>
            <li>Use the compiler for assignments, properties, and API contracts.</li>
            <li>Use unit tests for deterministic rules and edge cases.</li>
            <li>Use integration tests for storage, HTTP, and module wiring.</li>
            <li>Use browser tests for interaction and browser-defined behavior.</li>
          </ul>
        </section>

        <section>
          <h2>Test behavior rather than implementation trivia</h2>
          <p>
            A useful test states a behavior and verifies its result. Avoid
            coupling tests to private helper names or exact call sequences
            unless that sequence is part of the contract. Behavior-focused
            tests allow internal refactoring while still catching
            user-visible regressions.
          </p>
          ${renderCodeExample(`import { assertEquals } from "jsr:@std/assert";

Deno.test("backlog games appear in the backlog filter", () => {
  const games = [
      {
        id: "g-1",
        title: "Celeste",
        platforms: ["PC"],
        playState: { status: "backlog" as const },
      },
      {
        id: "g-2",
        title: "Hades",
        platforms: ["PC"],
        playState: { status: "completed" as const },
      },
  ];

  const visible = visibleGames(games, "backlog");
  assertEquals(visible.map((game) => game.id), ["g-1"]);
});`)}
          <p>
            Name tests after the behavior a failure would contradict. Keep
            setup realistic and small, and avoid tests whose only assertion
            is that a function did not throw unless that is the behavior
            being specified.
          </p>
        </section>

        <section>
          <h2>Cover boundaries and state alternatives</h2>
          <p>
            Errors often live at empty, missing, malformed, and transition
            boundaries. For a parser, test valid input, wrong primitive
            types, absent fields, malformed unions, and unexpected values.
            For a state transition, test every valid path and rejected
            invalid path, not only the happy case.
          </p>
          ${renderCodeExample(`import { assertEquals, assertThrows } from "jsr:@std/assert";

Deno.test("invalid game data is rejected", () => {
  const invalid: unknown = { id: 3, title: "Celeste" };
  assertThrows(() => parseGameCard(invalid));
});

Deno.test("an empty shelf has no selected game", () => {
  assertEquals(getSelectedGame({ games: [] }), undefined);
});`)}
          <p>
            Use table-driven cases when several values exercise the same
            rule. Include the failing input in the test name or assertion
            message so a failure is easy to diagnose.
          </p>
        </section>

        <section>
          <h2>Control nondeterministic dependencies</h2>
          <p>
            Tests should not depend on live networks, wall-clock timing,
            random values, or a developer's browser state. Inject
            dependencies such as <code>fetch</code>, a repository, a clock,
            storage, or history so tests can supply deterministic behavior.
            Use a fake for a narrow contract; do not recreate the entire
            production system in test code.
          </p>
          ${renderCodeExample(`type GameFetcher = (id: string) => Promise<Game | undefined>;

async function loadTitle(
  fetchGame: GameFetcher,
  id: string,
): Promise<string | undefined> {
  const game = await fetchGame(id);
  return game?.title;
}

Deno.test("loadTitle uses the fetched game", async () => {
  const fetchGame: GameFetcher = async () => ({ ...game, title: "Tunic" });
  assertEquals(await loadTitle(fetchGame, "g-3"), "Tunic");
});`)}
          <p>
            Await asynchronous work so assertions run after settlement.
            For rejection behavior, assert the expected failure. Avoid
            arbitrary sleeps; coordinate on the Promise, event, or
            condition the test actually needs.
          </p>
        </section>

        <section>
          <h2>Separate pure tests from browser tests</h2>
          <p>
            Pure functions, domain updates, and parsers can run quickly in
            Deno without a DOM. Custom Elements, actual focus, Shadow DOM,
            browser history, and CSS layout need a real browser. A DOM
            emulator can help with structural tests but does not replace
            verifying browser-specific behavior in a browser.
          </p>
          <p>
            Use coverage to discover untested branches, not as a target
            percentage that rewards meaningless assertions. Review a
            failure as information about the code, the test assumption, or
            the behavior contract.
          </p>
        </section>

        <section>
          <h2>Practice: write a test plan</h2>
          <ol>
            <li>List domain rules and pure functions that can be unit tested.</li>
            <li>List each untrusted boundary and invalid-input class.</li>
            <li>Identify adapters that should be replaced with deterministic fakes.</li>
            <li>Identify workflows that require a browser and real DOM.</li>
            <li>Choose a meaningful failure message for each test.</li>
          </ol>
          ${renderWorkedExample(html`
            <h2>Review a feature's failure surface</h2>
            <p>
              A Game Shelf feature needs tests for filters and updates,
              parser failures, repository behavior, request status handling,
              keyboard interaction, focus, and route history. Place each
              test at the lowest layer that can faithfully verify that
              behavior.
            </p>
          `)}
        </section>
      </article>
    `
});
