import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-32", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 5: From feature to application · Chapter 32</p>
        <h1>Refactoring safely</h1>
        <p>
                A refactor changes structure while preserving behavior. Let the
                checker identify incompatible callers, but use tests to protect
                runtime behavior. Work in small steps: extract a pure function,
                update its type contract, migrate one caller, and run the focused
                test before broadening the change.
              </p>
              ${renderCodeExample(`function isCompleted(game: Game): boolean {
  return game.playState.status === "completed";
}

const completedGames = games.filter(isCompleted);
const totalCompleted = completedGames.length;`)}
              <p>
                Extracting the predicate gives it a name and a direct test surface.
                It also preserves the union narrowing rule in one place. Avoid using
                a type assertion to make a broken refactor compile; follow the
                diagnostic to the mismatched assumption and correct the source or its
                callers.
              </p>
              ${renderWorkedExample(html`
                <p>
                  Check that the helper has the intended input and output type, add
                  focused behavior tests for the union cases, migrate callers in
                  small steps, and run the relevant app or browser workflow. A
                  successful type check alone does not prove behavior was preserved.
                </p>
              `)}
        <section>
          <h2>Separate refactoring from feature work</h2>
          <p>
            A refactor changes internal structure without intentionally
            changing observable behavior. A feature adds or changes behavior.
            Mixing them makes failures harder to diagnose, so separate them
            when practical: establish current behavior, improve structure,
            then add the new capability.
          </p>
          <p>
            Before changing code, run focused tests and the relevant type
            check. For legacy code with weak tests, write a characterization
            test that records the behavior users currently depend on, even
            when that behavior is not ideal.
          </p>
        </section>

        <section>
          <h2>Work in small, reversible steps</h2>
          <p>
            Make one structural change, use editor-supported rename or
            extract tools, check types, and run focused tests. Keep each
            step small enough that a failure points toward one change.
            After local checks pass, run broader integration or browser
            checks for behaviors that require them.
          </p>
          ${renderCodeExample(`function hasCompleted(game: Game): boolean {
  return game.playState.status === "completed";
}

const completedGames = games.filter(hasCompleted);
const completedCount = completedGames.length;`)}
          <p>
            A named predicate can improve understanding and provide a
            direct test surface. It is useful only if the name and boundary
            clarify the rule; extracting every expression can make the
            call site harder to follow.
          </p>
        </section>

        <section>
          <h2>Let type errors reveal assumptions</h2>
          <p>
            When a contract changes, compiler errors identify callers that
            relied on the old shape. Follow each diagnostic to the
            underlying assumption and decide whether the caller or the
            contract should change. Do not silence a mismatch with
            <code>any</code>, a non-null assertion, or a type assertion
            merely to restore a green check.
          </p>
          ${renderCodeExample(`type PlayStatus = "backlog" | "playing" | "completed";

function labelForStatus(status: PlayStatus): string {
  switch (status) {
    case "backlog": return "Not started";
    case "playing": return "In progress";
    case "completed": return "Finished";
  }
}`)}
          <p>
            If a new status is introduced, exhaustive branches and tests
            reveal where product decisions are needed. A cast would erase
            that signal and leave behavior incomplete.
          </p>
        </section>

        <section>
          <h2>Refactor module boundaries carefully</h2>
          <p>
            Moving code across modules changes import paths and may expose
            previously private assumptions. Check dependency direction,
            module initialization side effects, circular imports, and
            exported symbols. Preserve public contracts unless changing
            them is intentional and consumers have a migration path.
          </p>
          <p>
            For a public API change, consider a compatibility layer or
            staged migration when downstream callers need time to move.
            Remove compatibility code only when usage and versioning
            expectations are understood.
          </p>
        </section>

        <section>
          <h2>Review by risk</h2>
          <ul>
            <li>Compare before-and-after behavior with focused tests.</li>
            <li>Check nullability, union branches, and public signatures.</li>
            <li>Inspect browser behavior when moving DOM or lifecycle code.</li>
            <li>Review error handling, cleanup, and side effects for semantic changes.</li>
            <li>Keep unrelated formatting and feature work out of the same change.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: refactor a filter safely</h2>
            <p>
              Start with the existing backlog filter test. Extract a pure
              selector, migrate one caller, and verify empty-list behavior.
              Only then consider adding another filter or changing how
              filters are stored.
            </p>
          `)}
        </section>
      </article>
    `
});
