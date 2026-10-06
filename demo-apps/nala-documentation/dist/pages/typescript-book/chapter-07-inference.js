import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-07", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 2: Describing data · Chapter 7</p>
        <h1>Type annotations and inference</h1>
        <p>
                An annotation tells TypeScript what type to expect. Inference means
                TypeScript works that out from the surrounding code. Inference is
                not a guess at runtime: the checker follows the rules of the
                language, and the inferred type limits later operations.
              </p>
              ${renderCodeExample(`const pinnedStatus = "playing";
let selectedStatus = "playing";
let hoursPlayed = 12;

selectedStatus = "backlog";
hoursPlayed = hoursPlayed + 1;

// This assignment is rejected: hoursPlayed is a number.
// hoursPlayed = "many";`)}
              <p>
                A <code>const</code> binding initialized with a primitive literal
                keeps that exact value type, so <code>pinnedStatus</code> has type
                <code>"playing"</code>. A <code>let</code> binding must allow
                reassignment, so TypeScript infers the wider types
                <code>string</code> and <code>number</code> for the other variables.
                This widening is useful: <code>selectedStatus</code> can later hold a
                different string.
              </p>
              <p>
                Prefer inference for obvious local values. Write annotations where a
                value crosses a boundary, such as a function parameter, a public
                return contract, or a domain model whose shape should be explicit.
                An annotation should explain an intention, not repeat a type that is
                already clear.
              </p>
              ${renderWorkedExample(html`
                <ul>
                  <li>
                    <code>selectedTitle</code> has the literal type
                    <code>"Celeste"</code>; it cannot be reassigned because it is
                    declared with <code>const</code>.
                  </li>
                  <li>
                    <code>currentTitle</code> has type <code>string</code> and can
                    hold another string because it is declared with
                    <code>let</code>.
                  </li>
                  <li>
                    <code>playCount</code> has type <code>number</code> and can be
                    reassigned to another number.
                  </li>
                </ul>
              `)}
        <section>
          <h2>Inference is a rule-based calculation</h2>
          <p>
            Type inference is how TypeScript derives a type from the code around
            a value. It is not a prediction about what will happen at runtime.
            The checker uses declarations, initial values, assignments, and
            context to determine which operations are valid. Inference keeps
            local code readable while annotations make important contracts
            explicit.
          </p>
          ${renderCodeExample(`const hoursPlayed = 12;
let selectedTitle = "Celeste";
const pinnedStatus = "playing";

selectedTitle = "Hades";
// hoursPlayed = "many"; // Error: number cannot receive string.
// pinnedStatus = "backlog"; // Error: const binding cannot be reassigned.`)}
          <p>
            <code>hoursPlayed</code> is inferred as <code>number</code>,
            <code>selectedTitle</code> as <code>string</code>, and
            <code>pinnedStatus</code> as the literal type
            <code>"playing"</code>. The checker learns the literal type for a
            <code>const</code> primitive because the binding cannot change; a
            <code>let</code> needs a wider type to allow future assignments.
          </p>
        </section>

        <section>
          <h2>Widening makes reassignment possible</h2>
          <p>
            When TypeScript infers a type from a value, it sometimes widens a
            specific literal to its broader primitive type. A mutable string
            variable usually becomes <code>string</code>, not the one exact
            string used at initialization. This lets the variable accept other
            strings without requiring an annotation.
          </p>
          ${renderCodeExample(`let status = "backlog";
status = "playing";

const fixedStatus = "backlog";
// fixedStatus has the literal type "backlog".

type PlayStatus = "backlog" | "playing" | "completed";
let typedStatus: PlayStatus = "backlog";
typedStatus = "completed";`)}
          <p>
            If a variable should only accept a finite set of values, annotate
            it with that deliberate set instead of allowing every string. If it
            may vary freely, <code>string</code> is appropriate. Choose the
            narrowest type that matches the domain, not the narrowest type
            imaginable.
          </p>
        </section>

        <section>
          <h2>Context also informs inference</h2>
          <p>
            TypeScript can infer a value from where it is used. When a callback
            is passed to a typed method, the method supplies a contextual
            function type, so its parameters are known without annotations.
            This is why editor completion works inside many callbacks even
            though the parameter type is not written beside the parameter.
          </p>
          ${renderCodeExample(`const games = [
  { title: "Celeste", hours: 12 },
  { title: "Hades", hours: 31 },
];

const titles = games.map((game) => game.title);
const longSessions = games.filter((game) => game.hours > 20);`)}
          <p>
            TypeScript infers each <code>game</code> parameter from the array
            element type, then infers <code>titles</code> as
            <code>string[]</code> and <code>longSessions</code> as an array of
            the original item shape. An annotation on every callback parameter
            would repeat information and can make refactors noisier.
          </p>
        </section>

        <section>
          <h2>Annotate boundaries, not every expression</h2>
          <p>
            Inference is most reliable inside a well-typed program. Add
            annotations where information enters or leaves an abstraction:
            function parameters, public return values when the contract
            matters, exported state, and data that is initially ambiguous.
            These annotations form stable boundaries while implementation
            details remain concise.
          </p>
          ${renderCodeExample(`type Game = { id: string; title: string };

function gameLabel(game: Game): string {
  return game.title;
}

const games: Game[] = [];
const labels = games.map(gameLabel);`)}
          <p>
            The parameter annotation documents what the function needs; the
            explicit return type protects its public promise. The local
            <code>labels</code> type is obvious from the map and can be
            inferred. A return annotation is especially helpful on exported
            functions, but it is not mandatory on every private helper.
          </p>
        </section>

        <section>
          <h2>Resolve ambiguous initial values</h2>
          <p>
            Some expressions do not provide enough information to infer a
            useful type. Empty arrays, <code>null</code>, and untyped external
            values are common examples. Add the type at the point where the
            intended domain is known instead of allowing an accidental
            <code>any</code> to spread.
          </p>
          ${renderCodeExample(`const pendingTitles: string[] = [];
type Game = { id: string; title: string };
let selectedGame: Game | undefined;
const textFromServer = '{"id":"g-3","title":"Tunic"}';
const responseValue: unknown = JSON.parse(textFromServer);

pendingTitles.push("Tunic");
selectedGame = { id: "g-3", title: "Tunic" };`)}
          <p>
            <code>unknown</code> is a deliberate boundary type: it accepts any
            input, but it cannot be used as a particular shape until code
            checks it. Do not solve uncertainty by choosing <code>any</code>,
            which disables checks at each use. The later narrowing and
            validation chapters show how to move from unknown input to trusted
            values.
          </p>
        </section>

        <section>
          <h2>Annotation, assertion, and declaration are different</h2>
          <p>
            An annotation asks the checker to verify that a value satisfies a
            type. A type assertion tells the checker to trust the programmer
            without checking the runtime value. A declaration creates a value
            or type name. Do not use those terms interchangeably.
          </p>
          ${renderCodeExample(`const count: number = 3; // Annotation checked against 3.
const textFromServer = '{"id":"g-1","title":"Celeste"}';
const external: unknown = JSON.parse(textFromServer);
// const unsafe = external as Game; // Assertion, not validation.
type GameId = string; // Type declaration, erased at runtime.`)}
          <p>
            Assertions are sometimes necessary when the runtime has information
            that the checker cannot model, such as a carefully verified DOM
            relationship. Keep them narrow and close to the evidence. For
            external data, prefer executable validation rather than a blanket
            assertion.
          </p>
        </section>

        <section>
          <h2>A practical inference policy</h2>
          <ul>
            <li>Let TypeScript infer obvious local values and callback parameters.</li>
            <li>Annotate function inputs and important public contracts.</li>
            <li>Give empty collections and ambiguous state an intentional type.</li>
            <li>Use literal unions for finite domain choices, not unrestricted strings.</li>
            <li>Never treat an assertion as a conversion or runtime check.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: predict then verify</h2>
            <p>
              For each name, predict its type before asking the editor: a
              <code>const</code> literal, a reassigned <code>let</code>, a
              filtered array, and an empty list with and without an annotation.
              Explain which type enables each later assignment.
            </p>
            ${renderCodeExample(`const completed = "completed";
let current = "backlog";
current = "playing";
const statuses: string[] = [];
statuses.push(completed);`)}
          `)}
        </section>
      </article>
    `
});
