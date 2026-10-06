import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-37", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 6: Professional TypeScript · Chapter 37</p>
        <h1>Performance and maintainability</h1>
        <p>
                Types should make code easier to work with, not become a second
                programming language that only one author understands. Prefer
                descriptive names, simple unions, and small generic contracts. Deep
                conditional types, giant inferred expressions, and unnecessary
                intersections can slow both human comprehension and the checker.
              </p>
              <p>
                Measure slow builds and slow editor feedback before changing
                architecture. Keep module dependencies acyclic where practical,
                avoid exporting types that callers do not need, and split a large
                project along real ownership boundaries. A short explicit type can
                be a useful documentation point even when inference could produce
                it.
              </p>
              ${renderWorkedExample(html`
                <p>
                  Ask whether the abstraction removes meaningful duplication,
                  whether a simpler named type is clearer, whether callers truly
                  need the computed behavior, and whether it harms editor or
                  checker performance. Optimize for the team's ability to change
                  the code safely.
                </p>
              `)}
        <section>
          <h2>Measure the right kind of performance</h2>
          <p>
            Performance includes runtime latency, memory, network usage,
            startup time, build time, and editor responsiveness. First
            identify the user-visible bottleneck, collect a baseline with
            realistic data, and profile the relevant layer. Optimize the
            measured cause rather than guessing from source appearance.
          </p>
          <p>
            A small synthetic benchmark may not represent browser scheduling,
            network variance, garbage collection, or production data shape.
            Use browser performance tools for rendering and interactions,
            server/runtime profiling for service work, and the project's own
            build/check timings for toolchain problems.
          </p>
        </section>

        <section>
          <h2>Choose algorithms and data structures deliberately</h2>
          <p>
            Repeating a linear search inside a loop can turn one pass into
            quadratic work. For repeated lookups, an index may reduce
            expected lookup cost at the expense of memory and an update
            obligation. Choose based on access patterns and measure the
            trade-off at realistic collection sizes.
          </p>
          ${renderCodeExample(`function findSelectedRepeatedly(
  games: readonly Game[],
  selectedIds: readonly GameId[],
): Game[] {
  return selectedIds
    .map((id) => games.find((game) => game.id === id))
    .filter((game): game is Game => game !== undefined);
}

function findSelectedWithIndex(
  games: readonly Game[],
  selectedIds: readonly GameId[],
): Game[] {
  const byId = new Map(games.map((game) => [game.id, game]));
  return selectedIds
    .map((id) => byId.get(id))
    .filter((game): game is Game => game !== undefined);
}`)}
          <p>
            The indexed version is useful when many lookups share the same
            collection, but the index must be rebuilt or updated when games
            change. For a tiny list or one lookup, a simple scan may be
            clearer and fast enough.
          </p>
        </section>

        <section>
          <h2>Optimize rendering and state without stale caches</h2>
          <p>
            Recompute cheap derived data when that keeps the source of truth
            simple. Cache only measured expensive work and define exactly
            which inputs invalidate the cache. Avoid rendering or recomputing
            large views unnecessarily, but do not sacrifice stable DOM
            identity, focus, or correctness for a speculative optimization.
          </p>
          <p>
            An indexed collection can speed lookups, but it duplicates
            information and creates synchronization obligations. Consider
            whether the index can be derived, whether updates are centralized,
            and whether profiling shows enough benefit to justify the extra
            state.
          </p>
        </section>

        <section>
          <h2>Type-checker performance is also a team concern</h2>
          <p>
            Very large unions, deeply nested conditional or mapped types,
            recursive type definitions, and huge inferred expressions can
            slow checking and produce difficult diagnostics. Give complex
            public types names, split independent responsibilities, and
            simplify a type-level computation when the same intent can be
            expressed directly.
          </p>
          <p>
            Keep module graphs understandable and avoid cycles. Measure
            editor feedback and build/check times before restructuring a
            project. Toolchain features such as incremental builds or project
            references differ by compiler and runtime; use the strategy your
            repository supports rather than copying configuration blindly.
          </p>
        </section>

        <section>
          <h2>Maintainability is part of performance</h2>
          <p>
            Code that is easy to understand is faster to debug and safer to
            change. Prefer meaningful names, explicit public contracts,
            focused modules, and small functions whose effects are visible.
            Avoid both a single file that owns every concern and an
            abstraction for each trivial expression.
          </p>
          <ul>
            <li>Profile before optimizing and preserve a baseline for comparison.</li>
            <li>Use tests to protect the behavior while changing algorithms.</li>
            <li>Keep caches derived from authoritative state and document invalidation.</li>
            <li>Review checker complexity when a type becomes hard to explain.</li>
            <li>Optimize the common user path without breaking edge cases or accessibility.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: justify an optimization</h2>
            <p>
              Choose one slow Game Shelf workflow. Record the input size,
              measure the current operation, identify the dominant cost,
              implement one alternative, and compare results with the same
              workload. Keep the optimization only if its user benefit
              outweighs its memory and maintenance costs.
            </p>
          `)}
        </section>
      </article>
    `
});
