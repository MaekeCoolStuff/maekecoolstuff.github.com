import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-11", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 2: Describing data · Chapter 11</p>
        <h1>Unions and intersections</h1>
        <p>
                A union says a value may be one of several alternatives. An
                intersection combines requirements, so a value must satisfy all of
                the combined object shapes. These operators answer different design
                questions: “which one of these states?” versus “which capabilities
                must this value have?”
              </p>
              ${renderCodeExample(`type PlayState =
  | { status: "backlog" }
  | { status: "playing"; hoursPlayed: number }
  | { status: "completed"; completedOn?: string };

type GameDetails = {
  id: string;
  title: string;
};

type TrackedGame = GameDetails & {
  playState: PlayState;
};`)}
              <p>
                Each <code>PlayState</code> alternative has a distinct literal
                <code>status</code>. That shared field is called a discriminant; it
                lets the checker and the reader tell the alternatives apart. A
                backlog game does not have an hours field, while a playing game must
                have one. <code>TrackedGame</code> combines identity and title with a
                play state, so it must provide all three parts.
              </p>
              ${renderWorkedExample(html`
                ${renderCodeExample(`type PlayState =
  | { status: "backlog" }
  | { status: "playing"; hoursPlayed: number }
  | { status: "completed" };

type Game = { id: string; title: string } & {
  playState: PlayState;
};`)}
                <p>
                  The union represents one play state at a time. The intersection
                  adds the required id and title to each complete game record.
                </p>
              `)}
        <section>
          <h2>A union means one alternative</h2>
          <p>
            A union type joins alternatives with <code>|</code>. A value of
            type <code>A | B</code> may be an A or a B at runtime, so code may
            only use operations that are valid for every alternative until a
            check identifies which value it has. The union is a set of
            possibilities, not a promise that both shapes are present.
          </p>
          ${renderCodeExample(`type SearchInput = string | number;

function searchGames(input: SearchInput): string {
  if (typeof input === "string") return "Title: " + input;
  return "Minimum hours: " + input.toFixed(0);
}`)}
          <p>
            Before narrowing, the only useful operations are those supported
            by both strings and numbers. Inside each branch, the check removes
            the other possibility. Chapter 12 studies the control-flow checks
            that make this safe.
          </p>
        </section>

        <section>
          <h2>Discriminated unions model alternatives clearly</h2>
          <p>
            Give each object alternative a shared literal property, called a
            discriminant. The discriminant makes the state easy to inspect,
            gives the checker a reliable way to narrow, and keeps fields
            specific to one state out of unrelated states.
          </p>
          ${renderCodeExample(`type PlayState =
  | { status: "backlog" }
  | { status: "playing"; hoursPlayed: number }
  | { status: "completed"; completedOn?: string };

function stateLabel(state: PlayState): string {
  if (state.status === "backlog") return "Not started";
  if (state.status === "playing") return state.hoursPlayed + " hours";
  return state.completedOn ?? "Completed";
}`)}
          <p>
            A backlog state cannot accidentally carry a meaningless hours
            field; a playing state must have one. This is stronger than three
            optional fields that permit combinations such as completed games
            with no status or backlog games with stale play time. Prefer a
            union when the data represents one state at a time.
          </p>
        </section>

        <section>
          <h2>An intersection means all requirements</h2>
          <p>
            An intersection joins requirements with <code>&amp;</code>. A value
            of type <code>A &amp; B</code> must satisfy both. Intersections
            are useful for composing independent object capabilities, while
            unions model alternatives. Do not confuse “all of these members”
            with “one of these shapes.”
          </p>
          ${renderCodeExample(`type Identified = { id: string };
type Titled = { title: string };
type GameRecord = Identified & Titled & { platform: string };

const game: GameRecord = {
  id: "g-1",
  title: "Celeste",
  platform: "PC",
};`)}
          <p>
            A conflicting intersection can become impossible at a property:
            <code>{ rating: number } &amp; { rating: string }</code> requires
            one value to be both a number and a string. Avoid composing types
            mechanically; inspect overlapping property names and make sure
            the resulting contract is satisfiable.
          </p>
          ${renderCodeExample(`type ConflictingRating =
  { rating: number } & { rating: string };
// ConflictingRating["rating"] is never.`)}
        </section>

        <section>
          <h2>Use unions for domain choices</h2>
          <p>
            A literal union is often better than a broad string for a finite
            choice. It communicates valid alternatives and makes misspellings
            visible. Avoid representing the same exclusive choice as several
            booleans, since combinations can describe contradictory states.
          </p>
          ${renderCodeExample(`type Game = { id: string; title: string };

type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; games: Game[] }
  | { status: "error"; message: string };

const state: LoadState = { status: "success", games: [] };
// No state can be both loading and failed at once.`)}
          <p>
            Keep the discriminant values stable and meaningful. If an
            alternative has different required data, include that data only
            in its branch. This lets the type describe valid states instead
            of making every field optional and leaving consistency to
            comments.
          </p>
        </section>

        <section>
          <h2>Union design checklist</h2>
          <ul>
            <li>Use a union when a value can be one of several alternatives.</li>
            <li>Use a discriminant for object variants with different data.</li>
            <li>Use an intersection when all independent capabilities are required.</li>
            <li>Check overlapping properties before combining object types.</li>
            <li>Keep each alternative specific instead of making every field optional.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: choose the relationship</h2>
            <p>
              A tracked game always has an ID and title, and has exactly one
              play state. Model the shared identity with an object shape and
              the exclusive state with a union. Then identify one invalid
              combination the model prevents.
            </p>
            ${renderCodeExample(`type Identity = { id: string; title: string };
type TrackedGame = Identity & { playState: PlayState };`)}
          `)}
        </section>
      </article>
    `
});
