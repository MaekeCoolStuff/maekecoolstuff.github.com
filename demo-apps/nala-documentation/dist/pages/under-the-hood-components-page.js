import { createAsyncState, defineComponent, html, render, repeat } from "../../../../vendor/components/dist/index.js";
import { renderCodeExample } from "./code-example.js";
const inputDemoGames = [
  {
    id: "celeste",
    title: "Celeste"
  },
  {
    id: "hades",
    title: "Hades"
  }
];
defineComponent("docs-data-input-demo", {
  properties: {
    games: {
      default: ()=>[]
    }
  },
  template: ({ games })=>html`
      <ul>${repeat(games, (game)=>game.id, (game)=>html`<li>${game.title}</li>`)}</ul>
    `
});
defineComponent("docs-latest-search-demo", {
  template: ()=>html`
      <div class="layout-demo">
        <p class="layout-demo-label">Live example · out-of-order Game Shelf searches</p>
        <button data-start>Start Celeste, then Hades</button>
        <button data-newer disabled>Finish Hades (newer)</button>
        <button data-older disabled>Finish Celeste (older)</button>
        <button data-reset>Reset</button>
        <output aria-live="polite">idle</output>
      </div>
    `,
  onConnect: ({ query, listen, onCleanup })=>{
    const output = query("output");
    const start = query("[data-start]");
    const newer = query("[data-newer]");
    const older = query("[data-older]");
    const reset = query("[data-reset]");
    if (!output || !start || !newer || !older || !reset) {
      throw new Error("Latest-search demo is missing its controls");
    }
    const search = createAsyncState(undefined, {
      concurrency: "latest"
    });
    let finishOlder = ()=>{};
    let finishNewer = ()=>{};
    onCleanup(search.subscribe((state)=>{
      output.textContent = `${state.status}${state.data ? `: ${state.data}` : ""}`;
    }));
    onCleanup(()=>search.reset());
    listen(start, "click", ()=>{
      void search.load(()=>new Promise((resolve)=>finishOlder = resolve));
      void search.load(()=>new Promise((resolve)=>finishNewer = resolve));
      start.disabled = true;
      older.disabled = false;
      newer.disabled = false;
    });
    listen(newer, "click", ()=>{
      finishNewer("Hades");
      newer.disabled = true;
    });
    listen(older, "click", ()=>{
      finishOlder("Celeste");
      older.disabled = true;
    });
    listen(reset, "click", ()=>search.reset());
  }
});
const tutorialSteps = [
  {
    id: "native-element",
    title: "1. Start with one native Custom Element",
    goal: "Teach the browser a new HTML tag without Nala.",
    paragraphs: [
      "A Custom Element is an ordinary JavaScript class that extends HTMLElement. customElements.define associates a hyphenated tag name with that class. When the browser connects an instance to the document, connectedCallback runs.",
      "This first component deliberately uses only browser APIs. It establishes the boundary Nala will preserve: the browser owns element creation, lifecycle, attributes, events, Shadow DOM, and slots. Nala removes repetitive wiring; it does not replace those features."
    ],
    points: [
      "A custom-element name must contain a hyphen, such as game-badge.",
      "Use textContent for text that must not be interpreted as HTML.",
      "connectedCallback can run again after an element is removed and reinserted."
    ],
    code: `class GameBadge extends HTMLElement {
  connectedCallback(): void {
    const title = this.getAttribute("title") ?? "Untitled game";
    this.textContent = title;
  }
}

customElements.define("game-badge", GameBadge);

// Browser HTML:
// <game-badge title="Celeste"></game-badge>`,
    run: "Browser checkpoint: place the class in a module, add <game-badge> to HTML, and confirm that it renders Celeste. Deno can type-check this code but has no document or Custom Elements registry for the real DOM behavior."
  },
  {
    id: "attributes",
    title: "2. Convert string attributes into typed properties",
    goal: "Model string, number, and presence-based boolean attributes.",
    paragraphs: [
      "HTML attributes have only two physical states: absent, or present with a string value. Components often want booleans and numbers, so Nala centralizes conversion in parseAttributeValue and its inverse, serializeAttributeValue.",
      'Boolean attributes follow HTML semantics. <game-card featured="false"> is still featured because the attribute is present. Removing the attribute means false. Number conversion uses Number(raw), so an absent number becomes null while an empty number attribute becomes 0.',
      "reflectAttribute returns get and set operations around one element attribute. Its setter removes the attribute for a serialized null and otherwise calls setAttribute. That small branch is the basis of reflected component props later."
    ],
    points: [
      "Parse at the browser boundary instead of spreading conversion rules through components.",
      'null means absence; it is different from the literal string "null".',
      "The conversion helper returns unknown because the declared AttributeType controls the runtime result."
    ],
    code: `type AttributeType = "string" | "boolean" | "number";

function parseAttributeValue(
  type: AttributeType,
  raw: string | null,
): unknown {
  switch (type) {
    case "boolean": return raw !== null;
    case "number": return raw === null ? null : Number(raw);
    case "string": return raw;
  }
}

function serializeAttributeValue(
  type: AttributeType,
  value: unknown,
): string | null {
  switch (type) {
    case "boolean": return value ? "" : null;
    case "number":
    case "string":
      return value === null || value === undefined ? null : String(value);
  }
}

const card = document.querySelector("game-card")!;
const featured = parseAttributeValue(
  "boolean",
  card.getAttribute("featured"),
);`,
    run: "Deno checkpoint: assert that a missing boolean is false, every present boolean is true, a missing number is null, and serialization returns null when an attribute must be removed."
  },
  {
    id: "events",
    title: "3. Communicate with native typed events",
    goal: "Send component data without inventing an event bus.",
    paragraphs: [
      "CustomEvent adds a detail payload to the browser's Event model. A generic type makes that payload visible to TypeScript while dispatchEvent keeps normal propagation and cancellation behavior.",
      "bubbles lets ancestors observe the event. composed lets it cross a Shadow DOM boundary. cancelable lets a listener call preventDefault; dispatchEvent then returns false. Nala defaults all three to false because broader propagation should be deliberate."
    ],
    points: [
      "The helper returns dispatchEvent's boolean instead of swallowing cancellation.",
      "Event names remain strings, so use a stable domain name such as game-select.",
      "Listeners remain addEventListener callbacks and work without Nala."
    ],
    code: `interface ComponentEventOptions {
  bubbles?: boolean;
  composed?: boolean;
  cancelable?: boolean;
}

function dispatchComponentEvent<Detail>(
  element: EventTarget,
  type: string,
  detail: Detail,
  options: ComponentEventOptions = {},
): boolean {
  return element.dispatchEvent(new CustomEvent<Detail>(type, {
    detail,
    bubbles: options.bubbles ?? false,
    composed: options.composed ?? false,
    cancelable: options.cancelable ?? false,
  }));
}

dispatchComponentEvent(card, "game-select", { id: "g-17" }, {
  bubbles: true,
  composed: true,
});`,
    run: "Browser checkpoint: listen on a parent, dispatch from a child, and inspect event.detail. Add cancelable: true and preventDefault() to observe a false return value."
  },
  {
    id: "string-templates",
    title: "4. Build the compatibility string-template path",
    goal: "Support simple property paths while keeping the mini-language tiny.",
    paragraphs: [
      "interpolate finds {{path.to.value}} tokens, splits the path, and walks an ordinary data object. Missing and null values become an empty string. There are no expressions, loops, conditions, function calls, or assignment syntax.",
      "validateTemplate scans independently and reports malformed delimiters or unsupported expressions with their character index. It is development tooling, not an HTML parser. renderTemplate performs the browser-only step: assign interpolated markup to a native template element and clone its DocumentFragment.",
      "String interpolation creates HTML, so it is a compatibility path for trusted component markup. Later, reactive node expressions use text nodes for safe dynamic text."
    ],
    points: [
      "Keeping validation separate lets Deno test the grammar without a DOM.",
      "A template element parses markup without immediately inserting it into the document.",
      "cloneNode(true) returns a reusable fragment containing all descendants."
    ],
    code: `function interpolate(
  template: string,
  data: Record<string, unknown>,
): string {
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_match, path) => {
    const value = path.split(".").reduce<unknown>(
      (current, key) => current && typeof current === "object"
        ? (current as Record<string, unknown>)[key]
        : undefined,
      data,
    );
    return value === undefined || value === null ? "" : String(value);
  });
}

function renderTemplate(source: string, data = {}): DocumentFragment {
  const template = document.createElement("template");
  template.innerHTML = interpolate(source, data);
  return template.content.cloneNode(true) as DocumentFragment;
}`,
    run: "Deno checkpoint: test interpolation and validation as pure string functions. Browser checkpoint: clone a template and append its fragment to an element."
  },
  {
    id: "async-state",
    title: "5. Represent asynchronous work as a state machine",
    goal: "Make loading, success, empty, failure, retry, and reset explicit.",
    paragraphs: [
      "A Promise tells us only whether one operation eventually fulfilled or rejected. A screen also needs its current UI state. AsyncState stores a status plus data, error, and empty fields so every render can answer the same questions.",
      "load remembers its loader for retry, publishes loading while retaining old data, then publishes success or error. Errors become state and load resolves to null; callers observe failure through state rather than a rejected Promise. An isEmpty function keeps emptiness domain-specific.",
      "subscribe adds a listener and immediately publishes the current snapshot to that listener. The returned closure deletes exactly that callback. This controller does not render anything; it remains useful outside components.",
      "This first version publishes every completion. Chapter step 17 adds an opt-in latest-request policy without changing that default, including invalidation when reset races with a pending load."
    ],
    points: [
      "Keeping previous data during loading and errors enables stale-while-refresh UI.",
      "retry before the first load resolves to null without doing work.",
      "reset forgets the loader as well as restoring idle state."
    ],
    code: `type AsyncState<T> = {
  status: "idle" | "loading" | "success" | "error";
  data: T | null;
  error: unknown;
  empty: boolean;
};

const state = createAsyncState<Game[]>((games) => games.length === 0);
const unsubscribe = state.subscribe((current) => {
  console.log(current.status, current.data, current.empty);
});

await state.load(async () => {
  const response = await fetch("/api/games");
  return await response.json() as Game[];
});

await state.retry();
state.reset();
unsubscribe();`,
    run: "Deno checkpoint: use resolving and rejecting loader functions to observe idle → loading → success/error, then verify retry and reset."
  },
  {
    id: "connection-scope",
    title: "6. Give each DOM connection its own resource scope",
    goal: "Release listeners, effects, and custom resources reliably.",
    paragraphs: [
      "A Custom Element may connect, disconnect, and reconnect. Resources created for one connection must stop at disconnect and must not revive later. createConnectionScope owns one AbortController and a last-in-first-out cleanup stack for exactly one connected lifetime.",
      "listen supports the host by default or an explicit EventTarget. It combines a caller signal with the scope signal through AbortSignal.any, so either owner can remove the listener. delegate listens once on the component root, walks event.composedPath(), and refuses to match beyond that root.",
      "effect delegates reactive dependency tracking to vendor/state and registers its disposer as cleanup. dispose first aborts listeners, then runs effects and custom cleanup in reverse registration order. A failed cleanup is reported but cannot prevent the rest."
    ],
    points: [
      "Queries are root-bound, so Shadow DOM and Light DOM use the same helper API.",
      "Register cleanup immediately after acquiring a resource.",
      "Calling dispose twice is harmless; registering cleanup after disposal runs it immediately."
    ],
    code: `const scope = createConnectionScope(element, root);

scope.helpers.listen(window, "resize", updateGameGrid, {
  passive: true,
});
scope.helpers.delegate("click", "[data-game-id]", (_event, target) => {
  selectGame(target.getAttribute("data-game-id"));
});
scope.helpers.effect(() => {
  element.toggleAttribute("busy", loading());
});

const observer = new ResizeObserver(updateGameGrid);
observer.observe(element);
scope.helpers.onCleanup(() => observer.disconnect());

// disconnectedCallback:
scope.dispose();`,
    run: "Deno checkpoint: EventTarget fakes verify listener disposal, delegation boundaries, effect disposal, reverse cleanup order, error isolation, and fresh reconnect scopes."
  },
  {
    id: "template-results",
    title: "7. Keep template structure separate from dynamic values",
    goal: "Create a safe, inspectable TemplateResult without rendering yet.",
    paragraphs: [
      "A tagged template receives one stable TemplateStringsArray for the literal pieces and a separate values array for expressions. html stores both and marks the object with a private Symbol. It does not concatenate HTML and it does not touch the DOM.",
      "The stable strings object is important: repeated evaluation of the same tagged-template location reuses its identity. Nala later uses that identity to cache compilation and decide whether an existing instance can update in place.",
      "when stores only the selected callback and evaluates it when a node part updates. repeat eagerly calculates unique keyed entries and fails before DOM work when a key is duplicated. unsafeHTML is visibly separate because it opts out of safe text behavior."
    ],
    points: [
      "Symbols make directive/result recognition collision-resistant without public classes.",
      "when is lazy, so the unselected branch performs no work.",
      "repeat requires stable domain keys; array indexes break identity when items reorder."
    ],
    code: `const TEMPLATE_RESULT = Symbol("nala.template-result");

interface TemplateResult {
  readonly strings: TemplateStringsArray;
  readonly values: readonly unknown[];
  readonly [TEMPLATE_RESULT]: true;
}

function html(
  strings: TemplateStringsArray,
  ...values: unknown[]
): TemplateResult {
  return { strings, values, [TEMPLATE_RESULT]: true };
}

const view = (game: Game, selected: boolean) => html\`
  <button aria-pressed=\${selected}>\${game.title}</button>
\`;`,
    run: "Deno checkpoint: inspect result.strings and result.values, prove that when evaluates only one branch, and verify that repeat rejects duplicate keys."
  },
  {
    id: "directive-runtime",
    title: "8. Follow a directive from creation to NodePart",
    goal: "See how small tagged objects become runtime behavior without a directive engine.",
    paragraphs: [
      "The three directive functions are ordinary object factories. Each object carries its useful data and a private Symbol marker: when stores one selected callback, repeat stores keyed entries, and unsafeHTML stores a string. The Symbol prevents an ordinary application object from accidentally being treated as a directive.",
      "NodePart.setValue checks these markers in a deliberate order. when is unwrapped first, repeat switches the part into RepeatState, a TemplateResult becomes a nested TemplateInstance, and unsafeHTML parses through innerHTML. Only after those special cases does the part accept nullish values, Nodes, primitives, or reject objects and functions.",
      "This is why the package does not need a general-purpose mini-language. JavaScript creates explicit values, and one small DOM part decides how each value is allowed to enter the document."
    ],
    points: [
      "The exported directive interfaces describe data; the private Symbols provide runtime identity.",
      "when evaluates the chosen callback only when the NodePart updates.",
      "unsafeHTML is intentionally the one path that treats a string as markup; callers own sanitization.",
      "A plain object, function, or array is rejected so ambiguous rendering cannot silently corrupt the DOM."
    ],
    code: `const selected = when(
  game.id === selectedId,
  () => html\`<strong>Selected: \${game.title}</strong>\`,
  () => html\`<span>\${game.title}</span>\`,
);

// NodePart.setValue(selected) calls only the chosen callback.
// For arbitrary markup, opt in visibly and sanitize first:
const trustedBadge = unsafeHTML(sanitizedBadgeMarkup);`,
    run: "Deno checkpoint: inspect the directive objects and verify that duplicate repeat keys throw before rendering. Browser checkpoint: change a when condition and switch between text, a Node, a nested template, and unsafeHTML."
  },
  {
    id: "compile-template",
    title: "9. Compile expression positions into DOM markers",
    goal: "Turn one template shape into a reusable native template.",
    paragraphs: [
      "compileTemplate walks the static strings between expressions. If the preceding text ends in name=, the expression is an attribute binding. Otherwise it is a node binding and receives start/end comment markers. The browser then parses the assembled source through a template element.",
      "Binding prefixes make DOM intent explicit: a plain name writes an attribute, ? toggles a boolean attribute, . writes a live property, and @ manages an event listener. The prefix is removed before storing the real name.",
      "A WeakMap caches compiled output by TemplateStringsArray identity. Weak keys allow JavaScript to reclaim templates that become unreachable; compilation does not create a permanent global registry.",
      "After parsing, locateParts walks every descendant with visitNodes. It records comment markers in start and end maps, removes marker attributes, and creates the part at the matching expression index. If an expression has neither a recognized attribute marker nor a complete comment pair, it throws instead of leaving an unupdatable value behind."
    ],
    points: [
      "Markers connect expression indexes back to concrete DOM locations after parsing.",
      "Two different template literal locations compile separately even if their text matches.",
      "Comment markers are invisible and can bracket zero, one, or many nodes.",
      "The two marker maps let parts be returned in expression order even when the DOM tree is nested."
    ],
    code: `const ATTRIBUTE_POSITION =
  /([.?@]?[A-Za-z_:][^\\s"'<>\/=]*)\\s*=\\s*(["']?)$/;
const templateCache =
  new WeakMap<TemplateStringsArray, CompiledTemplate>();

function bindingFor(name: string): AttributeBinding {
  if (name.startsWith(".")) return { kind: "property", name: name.slice(1) };
  if (name.startsWith("?")) return { kind: "boolean", name: name.slice(1) };
  if (name.startsWith("@")) return { kind: "event", name: name.slice(1) };
  return { kind: "attribute", name };
}

// Node expression -> <!--nala-start:0--><!--nala-end:0-->
// Attribute value -> nala-part-0`,
    run: "Browser checkpoint: compile one template, inspect template.content, and confirm that later calls from the same literal location return the cached CompiledTemplate."
  },
  {
    id: "parts",
    title: "10. Let each part own one narrow DOM update",
    goal: "Update attributes, properties, listeners, and node content without rebuilding the tree.",
    paragraphs: [
      "locateParts recursively visits the cloned fragment. Marker-valued attributes become AttributePart objects; paired comments become NodePart objects. The parts array preserves expression order, so values[index] always updates the location compiled for that index.",
      "AttributePart maps each binding to the corresponding DOM API. Event updates remove the old listener before adding a new one. Property bindings write JavaScript properties such as input.value. Boolean bindings use toggleAttribute, while ordinary attributes stringify or remove nullish values.",
      "NodePart safely handles primitives as text, native Nodes, nested TemplateResults, directives, or absence. It reuses an existing Text node and compatible nested TemplateInstance. Arrays throw because rendering them without keys would make stable updates ambiguous.",
      "A NodePart owns exactly one current mode. When the mode changes, #clear disposes a nested template or repeat, removes every node between its boundary comments, and resets its cached text, node, and unsafeHTML state. An AttributePart has the same ownership rule for event listeners: it removes the previous function before installing a new one, and dispose removes the final function."
    ],
    points: [
      "Text expressions do not use innerHTML, so user text remains text.",
      "Switching value kinds clears and disposes the previous owned content.",
      "Objects and functions are rejected unless they are recognized templates or directives.",
      "A missing mounted parent is an error, which catches attempts to update a part after its surrounding template was removed."
    ],
    code: `// One template demonstrates all four attribute-part kinds.
const gameRow = (game: Game, selected: boolean) => html\`
  <input
    aria-label=\${game.title}
    ?disabled=\${game.archived}
    .checked=\${selected}
    @change=\${() => selectGame(game.id)}
  >
  <strong>\${game.title}</strong>
\`;

// Calling render again from this same template shape updates the
// existing parts. It does not replace the input or strong element.
render(gameRow(game, true), root);`,
    run: "Browser checkpoint: render twice, retain references to the input and text node, and verify identity is preserved while values and listeners change."
  },
  {
    id: "keyed-repeat",
    title: "11. Preserve list identity with keyed DOM ranges",
    goal: "Insert, update, move, and remove items without recreating surviving nodes.",
    paragraphs: [
      "RepeatState owns a Map from domain key to RepeatBlock. A block has two comment boundaries and a NodePart between them. On update, existing keys reuse their block, new keys create one, and missing keys dispose and remove theirs.",
      "After content updates, blocks are ordered from the end toward the beginning. moveRangeBefore first skips an already adjacent range and rejects a missing parent. If its Element or DocumentFragment parent supports native moveBefore, it walks start through end, saving nextSibling before moving each node before the reference. This preserves native focus and selection rather than detaching children through a temporary fragment. Custom Element connection is preserved only for elements with connectedMoveCallback, as Nala-defined components provide.",
      "The fallback reads the document or ShadowRoot activeElement, records whether any node in the range contains it, and collects the range in a DocumentFragment. After insertion it refocuses the retained HTMLElement with preventScroll. It does not drill into nested Shadow Roots, whose internal focus is therefore not guaranteed. Identity is preserved, but older browsers may still dispatch disconnect/connect callbacks; focus restoration is not equivalent to uninterrupted connection. The tutorial's browser-checks module exercises both native movement and the forced fallback, including draft text, selection, and event-listener replacement.",
      "defineComponent supplies an intentionally empty connectedMoveCallback. Native moveBefore calls that hook instead of ordinary disconnect/connect callbacks for the component, so an in-document reorder does not dispose and recreate its connection scope. Ordinary removal and reinsertion still perform normal cleanup/reconnect. This hook is not an automatic store binding or a new application lifecycle API.",
      "The early duplicate-key check is essential. If two items shared a key, there would be no coherent answer to which block should survive or where it should move."
    ],
    points: [
      "Keys identify domain items; they are not display labels or positions.",
      "Removed blocks dispose nested parts before their marker nodes disappear.",
      "A range can contain text, elements, nested templates, or another repeat."
    ],
    code: `const collectionView = (games: Game[]) => html\`
  <ul>
    \${repeat(
      games,
      (game) => game.id,
      (game) => html\`
        <li data-game-id=\${game.id}>\${game.title}</li>
      \`,
    )}
  </ul>
\`;

render(collectionView(games), root);
games = [games[1], games[0], ...games.slice(2)];
render(collectionView(games), root);`,
    run: "Browser checkpoint: focus a control in one keyed row, reorder the data, render again, and confirm that the same control remains focused in its moved row."
  },
  {
    id: "lifecycle-edge-cases",
    title: "12. Trace disconnect, reconnect, and cleanup failures",
    goal: "Understand exactly when a component resource is alive and how failure is isolated.",
    paragraphs: [
      "createConnectionScope is a small ownership object, not global component state. It stores one AbortController, one cleanup array, and a disposed flag. listen gives every listener the scope signal; when the scope aborts, the browser removes those listeners even if the listener was attached to window or document.",
      "delegate uses event.composedPath() instead of only event.target. It checks each matchable Element until it reaches the component root, so a matching element inside the component is accepted but a matching ancestor outside the root is ignored. This is also why delegation can work across a Shadow DOM boundary when the event is composed.",
      "The element creates a constructor scope because fields must exist immediately, then connectedCallback disposes that unused scope and creates the real connection scope. Every reconnect gets new listeners and effects. disconnectedCallback disposes first and calls onDisconnect second. Cleanup runs in reverse registration order; errors are logged and the remaining cleanup still runs."
    ],
    points: [
      "Registering cleanup after dispose runs it immediately, making ownership safe even during teardown.",
      "A caller signal and the connection signal are combined with AbortSignal.any when both are supplied.",
      "If onConnect throws, defineComponent disposes the new connection before rethrowing.",
      "onDisconnect runs after automatic resource disposal, so it observes a stopped connection."
    ],
    code: `const scope = createConnectionScope(element, root);
const caller = new AbortController();

scope.helpers.listen(window, "resize", update, {
  signal: caller.signal,
});
scope.helpers.onCleanup(() => releaseCache());
scope.helpers.onCleanup(() => closeObserver());

scope.dispose();
// resize is gone; closeObserver runs before releaseCache.
// A later scope is a different lifetime, not a revived one.`,
    run: "Browser checkpoint: connect an element, retain a listener count, remove and reinsert it, and verify one active listener after reconnect. Add a cleanup that throws and confirm later cleanup still runs."
  },
  {
    id: "template-instance",
    title: "13. Coordinate compilation, cloning, updates, and disposal",
    goal: "Finish the reactive render cycle around TemplateInstance.",
    paragraphs: [
      "TemplateInstance compiles or retrieves a cached template, clones its fragment, locates every part, and performs the first update. matches compares strings by identity. A matching result updates parts; a different template shape disposes the old instance and replaces root children.",
      "rootInstances is another WeakMap, this time from render root to its active instance. render therefore needs no property added to user elements. clearRender disposes listeners and nested content before forgetting the root's instance.",
      "TemplateInstance.mount inserts its fragment before a boundary when used inside a NodePart. Once inserted, the fragment itself becomes empty because DocumentFragment moves its children; the located parts still reference the moved nodes."
    ],
    points: [
      "Compilation belongs to template shape; instance state belongs to one rendered copy.",
      "A matching template changes only dynamic parts.",
      "A structural template change intentionally replaces the owned root content."
    ],
    code: `function render(result: TemplateResult, root: RenderRoot): void {
  const current = rootInstances.get(root);
  if (current?.matches(result)) {
    current.update(result);
    return;
  }

  current?.dispose();
  const instance = new TemplateInstance(result);
  root.replaceChildren(instance.fragment);
  rootInstances.set(root, instance);
}

function clearRender(root: RenderRoot): void {
  rootInstances.get(root)?.dispose();
  rootInstances.delete(root);
}`,
    run: "Browser checkpoint: update one template shape, switch to a different shape, then clear it. Verify listener replacement, node reuse for matching shapes, and disposal for replaced shapes."
  },
  {
    id: "define-component",
    title: "14. Assemble the primitives in defineComponent",
    goal: "Remove Custom Element boilerplate while preserving native behavior.",
    paragraphs: [
      "defineComponent creates one HTMLElement subclass and registers it. observedAttributes comes from the declared prop map. The constructor chooses Light or Shadow DOM, reads initial attributes, creates a connection scope, and defines reflected property accessors on each instance.",
      "Rendering calls onBeforeRender, evaluates the template, chooses the string or reactive path, manages one style element, then calls onAfterRender. Reactive templates own focused parts; string templates clear the reactive instance before replacing content.",
      "connectedCallback discards the constructor's unused scope, creates a fresh connection scope, renders, and calls onConnect. If onConnect throws, the new scope is disposed. disconnectedCallback disposes resources before onDisconnect. Attribute changes create a new props object, render, then call update and attribute-specific hooks."
    ],
    points: [
      "Props are snapshots; previousProps remains intact for onUpdate.",
      "Attribute-backed setters reflect through attributes. Property-only setters use a separate Object.is-protected update path; both create props snapshots.",
      "Closed Shadow DOM is supported internally even though external code cannot read element.shadowRoot."
    ],
    code: `defineComponent<{ title: string; selected: boolean }>("game-card", {
  shadow: true,
  props: { title: "string", selected: "boolean" },
  styles: \`
    :host { display: block; }
    button[aria-pressed="true"] { font-weight: bold; }
  \`,
  template: (props) => html\`
    <button
      type="button"
      aria-pressed=\${props.selected}
    >\${props.title}</button>
  \`,
  onConnect: ({ delegate, element }) => {
    delegate("click", "button", () => {
      dispatchComponentEvent(element, "game-select", undefined, {
        bubbles: true,
        composed: true,
      });
    });
  },
});`,
    run: "Browser checkpoint: change both properties and attributes, remove/reinsert the element, inspect Shadow DOM, and confirm one click produces one event after reconnect."
  },
  {
    id: "data-inputs",
    title: "14b. Add property-only inputs and preserve pre-upgrade values",
    goal: "Pass Game Shelf records without serializing them or hand-writing accessors.",
    paragraphs: [
      "First build the native intermediate below. Its setter stores a normal JavaScript array and renders only while connected. This is not a binding engine: the caller explicitly replaces the array. The factory-equivalent field initializer gives every element a fresh array, and Object.is prevents unnecessary work. This is the repeated machinery a data table otherwise has to own.",
      "Now move that recipe into defineComponent's properties map. Each ComponentProperty<Value> requires default(): Value and optionally validate(value): void. The constructor picks a pre-upgrade own value or calls the default factory, validates it, stores it in the props snapshot, then installs an accessor. Connected setter writes validate first, compare with Object.is, replace the props snapshot, render, and call onUpdate with the old snapshot. Disconnected writes only store data. No array mutation tracking or store subscription is introduced.",
      "A pre-upgrade assignment is an own property on a plain element; it can shadow a future setter. Before installing attribute accessors, defineComponent captures those values in a pending map. Data values are installed immediately. Reflected setters cannot run during construction because adding attributes there violates native construction rules. Initial attribute callbacks still update the props snapshot, but cannot render against unreplayed pending values. connectedCallback drains the pending map before rendering, suppresses intermediate hooks during replay, then follows the normal connection pipeline. Explicit valid setter writes delete any older pending value, so reconnect never resurrects it. Failed validation keeps the pending value for explicit repair instead of silently discarding it.",
      "The private component-inputs module exports mapped declaration types internally and normalizes the shorthand attribute type into an object. parseComponentAttribute uses an own-default check so falsy defaults remain valid, applies that default only when raw is null, and otherwise delegates to the existing parser. readComponentAttribute then validates that parsed value. Keeping parsing separate preserves the browser's actual old value in onAttributeChange without revalidating it: a corrected attribute may replace an invalid old value. The type assertion is at this coercion boundary: TypeScript cannot infer a record's declared field type from AttributeType. Validators let narrower domain types reject invalid coercions.",
      "ComponentAttribute<Value> adds optional attribute-name mapping, a default value, and validation to type. Registration constructs property-to-definition and attribute-to-property maps, rejects overlapping inputs and duplicate, empty, or uppercase attribute names, and derives observedAttributes from the latter. Setters serialize and validate before touching the attribute. Attribute callbacks resolve the public property key, validate the new parsed value, and preserve the last valid props if validation throws. An invalid direct setAttribute has already changed the browser DOM, so the callback error is reported rather than silently rolled back.",
      "The table is the integration proof: rows and columns are property-only inputs, pageSize maps to page-size, scalar defaults and validation are declarations, styles use the normal render pipeline, and paging clicks use connection-scoped delegation. The focused boundary fake tests accessor and lifecycle contracts in Deno without pretending to implement DOM parsing or upgrade. The real browser must still verify late registration, template-created upgrades, node identity, and reconnect."
    ],
    points: [
      "Factories own per-instance defaults; attribute defaults are scalar values, not factories.",
      "Property-only writes never run onAttributeChange or create attributes.",
      "Same-reference writes and disconnected data writes do not run update hooks.",
      "Reflected pre-upgrade replay runs once at connection, before render and onConnect, with no intermediate hooks.",
      "The exact source archive below includes the internal helper and both new test files; compare each branch with this progression."
    ],
    code: `type Game = { id: string; title: string };

// Runnable native intermediate: store and explicitly render data.
class NativeGameShelf extends HTMLElement {
  #games: readonly Game[] = [];
  get games(): readonly Game[] { return this.#games; }
  set games(value: readonly Game[]) {
    if (Object.is(value, this.#games)) return;
    this.#games = value;
    if (this.isConnected) this.connectedCallback();
  }
  connectedCallback(): void {
    this.replaceChildren(...this.#games.map((game) => {
      const item = document.createElement("p");
      item.textContent = game.title;
      return item;
    }));
  }
}
customElements.define("native-game-shelf", NativeGameShelf);

// Current Nala version: the same data contract, with keyed rendering.
defineComponent<{ games: readonly Game[] }>("book-game-shelf", {
  properties: { games: { default: () => [] } },
  template: ({ games }) => html\`
    <ul>\${repeat(games, (game) => game.id,
      (game) => html\`<li>\${game.title}</li>\`)}</ul>
  \`,
});
const shelf = document.createElement("book-game-shelf") as
  HTMLElement & { games: readonly Game[] };
shelf.games = [{ id: "celeste", title: "Celeste" }];
document.body.append(shelf);`,
    run: "Deno checkpoint: run define-component.test.ts and internal/component-inputs.test.ts. Browser checkpoint: pass games through a reactive property binding, replace the array, then disconnect/reconnect; confirm a late-registered element keeps both data and reflected assignments."
  },
  {
    id: "shadow-slots-styles",
    title: "15. Use native Shadow DOM, slots, and styles",
    goal: "Separate what the browser provides from what defineComponent wires together.",
    paragraphs: [
      "The shadow option has three meanings. The default and false use Light DOM, so the component template is placed directly in the custom element. true is normalized to an open ShadowRoot, while open and closed are passed to attachShadow. Open roots are available through element.shadowRoot; closed roots still work internally through the context root but are hidden from outside code.",
      "A style string becomes one style element in the component root. The element is reused on later renders, its text is refreshed, and it is prepended if it was removed. In Shadow DOM the browser scopes selectors and supports :host and ::slotted; custom properties can still inherit from the host. Light DOM has no automatic isolation, so its CSS participates in the document stylesheet.",
      "Slots are not implemented by Nala. They are native slot elements in the template, and the browser distributes light-DOM children into named or default slots. This is an important boundary: defineComponent supplies the root and lifecycle, while the platform supplies slot distribution."
    ],
    points: [
      "The context root is the correct query boundary for both Light DOM and Shadow DOM.",
      "A closed root is private to outside callers, not absent from the component implementation.",
      "A slot fallback renders only when no matching light-DOM child is supplied.",
      "Use CSS custom properties for consumer-controlled design tokens across a Shadow boundary."
    ],
    code: `defineComponent("game-card", {
  shadow: "open",
  styles: \`
    :host { display: block; }
    :host([featured]) { --accent: crimson; }
    article { border-color: var(--accent, steelblue); }
  \`,
  template: () => \`
    <article>
      <header><slot name="title">Untitled</slot></header>
      <main><slot>Game details</slot></main>
    </article>
  \`,
});

// <game-card featured>
//   <span slot="title">Celeste</span>
//   <p>Platform: PC</p>
// </game-card>`,
    run: "Browser checkpoint: inspect an open root, replace it with closed mode, and verify the component still renders. Supply named and default slot content, then override a host custom property."
  },
  {
    id: "forms-and-entrypoint",
    title: "16. Specialize form-like controls and publish one API",
    goal: "Compose standard control props, native-style events, and explicit exports.",
    paragraphs: [
      "defineFormControl does not create a second component system. It merges common value, checked, selected, disabled, readonly, and required prop declarations, then delegates to defineComponent. valueType allows value to be string, number, or boolean. Its props type reuses ComponentConfig's attribute declarations so aliases, defaults, and validation remain available; properties is passed through with the rest of the config. Redeclaring a standard form-state input as property-only is rejected by the same overlap check.",
      "dispatchFormInput and dispatchFormChange specialize the generic event helper. They use native event names, place the current value in detail, and default bubbles and composed to true so application code outside a Shadow Root can observe them.",
      "index.ts is the package boundary. Runtime values use export; interfaces and aliases use export type so transpiled JavaScript does not pretend they exist at runtime. Internal ConnectionScope and test fetch-like fakes are intentionally not exported."
    ],
    points: [
      "Without the optional form configuration these helpers still provide only value/event conventions. Step 18 adds explicit native form association without silently changing existing controls.",
      "An app may import the entrypoint while package files import their direct dependencies.",
      "The final implementation remains a set of small modules rather than one base class hierarchy."
    ],
    code: `defineFormControl<FormControlState & { label: string }>("game-rating", {
  shadow: true,
  valueType: "number",
  props: { label: "string" },
  template: (props) => html\`
    <label>
      \${props.label}
      <input
        type="range"
        .value=\${String(props.value ?? 0)}
        ?disabled=\${props.disabled}
      >
    </label>
  \`,
  onConnect: ({ delegate, element }) => {
    delegate("input", "input", (_event, target) => {
      const value = Number((target as HTMLInputElement).value);
      dispatchFormInput(element, value);
    });
  },
});`,
    run: "Browser checkpoint: set value and disabled through attributes and properties, move the control into Shadow DOM, and verify that input reaches an outside listener with detail.value."
  },
  {
    id: "latest-async-state",
    title: "17. Prevent old requests from replacing new results",
    goal: "Build request identity first, then add it as an opt-in policy to the existing async controller.",
    paragraphs: [
      "Imagine searching Game Shelf for Celeste and immediately for Hades. Network completion order does not necessarily match typing order. A newer response can arrive first, then the older response can incorrectly replace it. This problem belongs in the existing async state primitive rather than in each search screen.",
      "Start with the runnable request-counter checkpoint below. Each load captures a new number. After await, it compares that number to the current one before publishing. Reset also advances the counter: an operation that started before reset no longer owns the screen. This changes publication, not the Promise itself or the underlying work.",
      "The exact final implementation adds AsyncStateOptions with concurrency all or latest as createAsyncState's second argument. It validates the chosen policy once, defaulting to all for compatibility. request starts at zero; load increments it before remembering the loader and publishing loading. Both the success and catch branches test currentRequest against request only in latest mode. A stale success returns its data before isEmpty or publish; a stale failure returns null before publish. An active success still computes empty and publishes success, and an active failure still retains current data and publishes error.",
      "reset increments request before forgetting lastLoader and publishing idle. retry still calls this.load with the most recently supplied loader, giving retries a fresh identity. subscribe and unsubscribe are unchanged. Every load, even one later superseded, publishes loading immediately. The default all mode intentionally preserves completion-order publication, even when a pending operation finishes after reset.",
      "Subscribe to shared state for rendering. Awaiting an older load still returns that older result, so rendering each Promise result would bypass the policy. Aborting fetch is a separate browser boundary owned by the loader; there is no implicit AbortController here.",
      "async-state.test.ts uses deferred Promises so tests choose completion order deterministically. The tests cover stale success, stale failure, reset before success or failure, latest-loader retry, unsubscribe, and unchanged default behavior. These tests do not depend on network timing."
    ],
    points: [
      "Latest means latest started request, not latest completed request.",
      "Only active requests may publish final state; old work is not cancelled.",
      "The options type is exported from the public entrypoint.",
      "Errors remain explicit state for the active request; stale failures intentionally cannot replace it."
    ],
    code: `// Intermediate version: run in Deno or a browser console.
function latestGameSearch() {
  let request = 0;
  let visible = "idle";
  return {
    get visible() { return visible; },
    async load(loader: () => Promise<string>) {
      const current = ++request;
      visible = "loading";
      const game = await loader();
      if (current === request) visible = game;
      return game;
    },
    reset() { request++; visible = "idle"; },
  };
}
const search = latestGameSearch();
let finish!: (game: string) => void;
const older = search.load(() => new Promise<string>((resolve) => finish = resolve));
await search.load(async () => "Hades");
finish("Celeste");
await older;
console.assert(search.visible === "Hades");

// Final API adds error, empty, retry and subscription handling:
const games = createAsyncState<string[]>(items => items.length === 0, {
  concurrency: "latest",
});
const stop = games.subscribe(state => console.log(state.status, state.data));
await games.load(async () => ["Hades"]);
stop();
games.reset();`,
    run: "Deno checkpoint: run the counter example, then deno test vendor/components/src/async-state.test.ts. Integration checkpoint: the combobox's local catalog example uses the real controller and invalidates it at disconnect."
  },
  {
    id: "native-form-association",
    title: "18. Let the browser own form submission and validation",
    goal: "Build a native form-associated Custom Element, then compose that capability with Nala's existing component lifecycle.",
    paragraphs: [
      "An input inside a Shadow Root does not automatically submit through the custom-element host. Native ElementInternals connects the host itself to a form. It is a browser primitive, not a hidden input or a Nala form engine. The intermediate version below first shows a native custom element with static formAssociated and a once-attached internals object.",
      "In the final defineComponent implementation, ComponentConfig.formAssociated is opt-in and captured once when registering the element. The class's static getter tells the browser that fixed choice; the constructor uses the same choice to attach internals once when opted in, otherwise stores null. ComponentContext exposes that same object on every render and connection. Reconnect never attaches again. Platform errors propagate instead of falling back to a different submission mechanism.",
      "Four browser callbacks forward to corresponding config hooks with a fresh context: association receives HTMLFormElement or null; disabled receives the effective browser disabled state, including an ancestor fieldset; reset takes only context; restoration receives string, File, FormData or null and restore/autocomplete mode. Successful disabled/reset/restore callbacks run the private renderAfterFormCallback helper. It checks that internals exist, construction is finished, and pre-upgrade reflected assignments are no longer pending, then renders current props. Association does not force a render. This prevents a callback's original props snapshot from overwriting newer values after its setter writes.",
      "FormControlValidity describes native flags, message, and optional anchor. FormControlAssociation makes value, reset, and disabled callbacks required, while state, validity, and restore are optional. These types do not prescribe domain behavior: a checkbox might submit only when checked, and a combobox submits its committed id rather than query text.",
      "defineFormControl destructures form separately from the component config. Explicit form plus formAssociated false throws before registration. The local syncForm function skips unconfigured controls, requires attached internals, computes a submission value, and sets the restoration state to the optional state callback result or that value. It then calls setValidity with configured flags/message/anchor, or empty flags for a valid control. Browser rules require a nonempty message for active validity flags and an anchor inside the component. Callback failures are not swallowed.",
      "The wrapped onAfterRender calls the consumer hook first, then syncForm, so inner UI and validation anchors already exist. The three form lifecycle wrappers call form's callback first, followed by the user's matching config hook. defineComponent's post-callback render then synchronizes with fresh props. Setter writes can also render during callbacks. Standard form-state props and the existing form event helpers are otherwise unchanged. No input/change events are synthesized by form synchronization or reset.",
      "The browser supplies ownership, name/form attributes, disabled fieldsets, FormData construction and constraint validation. The component supplies its reset value, validation policy, restored-state handling and effective disabled UI. Do not reflect fieldset-disabled state into the host's own disabled attribute: that would lose the distinction when the fieldset is enabled again. No reset default, validator, autofill promise or host checkValidity method is invented.",
      "The boundary tests verify once-only attachment, no attachment by default, callbacks before connection, submission/restoration values, validity clearing, reset using updated props, disabled routing, rejected contradictory config and error propagation. FormData and File tests also verify that native values pass through without stringification. Real browser checks verify native FormData, required validation, form reset, external form ownership, fieldset disabling and the combobox's stable input. The complete source and tests below account for each added line."
    ],
    points: [
      "Low-level components use formAssociated, internals and onForm* hooks directly.",
      "defineFormControl's form option removes shared submission/validity orchestration, not component-specific decisions.",
      "Use internals.form, labels, checkValidity and reportValidity from component code; they are native APIs.",
      "Other existing controls remain unchanged. The combobox deliberately opts in as integration proof."
    ],
    code: `// Intermediate version: load once in a browser module.
class NativeGameChoice extends HTMLElement {
  static formAssociated = true;
  #internals = this.attachInternals();
  connectedCallback() {
    this.#internals.setFormValue("celeste");
    this.#internals.setValidity({});
  }
  formResetCallback() {
    this.#internals.setFormValue("celeste");
  }
}
customElements.define("native-game-choice", NativeGameChoice);
const form = document.createElement("form");
const choice = document.createElement("native-game-choice");
choice.setAttribute("name", "gameId");
form.append(choice);
document.body.append(form);
console.assert(new FormData(form).get("gameId") === "celeste");
form.remove();

// Final integration is an ordinary native form:
// <form>
//   <nala-combobox name="gameId" label="Game" required value="celeste">
//     <option value="celeste">Celeste</option>
//     <option value="hades">Hades</option>
//   </nala-combobox>
//   <button type="submit">Save</button>
//   <button type="reset">Reset</button>
// </form>`,
    run: "Deno checkpoint: deno test vendor/components/src/define-component.test.ts vendor/components/src/form.test.ts. Browser checkpoint: use the combobox's native form example, submit a choice, clear and validate, reset, then toggle the disabled fieldset."
  }
];
const sourceFiles = [
  {
    path: "vendor/components/src/attributes.ts",
    role: "Attribute type conversion and reflection.",
    test: false
  },
  {
    path: "vendor/components/src/events.ts",
    role: "Typed native CustomEvent dispatch.",
    test: false
  },
  {
    path: "vendor/components/src/template.ts",
    role: "Compatibility interpolation, diagnostics, and DOM cloning.",
    test: false
  },
  {
    path: "vendor/components/src/async-state.ts",
    role: "Framework-independent async state machine with explicit completion-order or latest-request publication.",
    test: false
  },
  {
    path: "vendor/components/src/lifecycle.ts",
    role: "Connection-scoped queries, events, effects, and cleanup.",
    test: false
  },
  {
    path: "vendor/components/src/reactive-template.ts",
    role: "Template compilation, dynamic parts, directives, and keyed ranges.",
    test: false
  },
  {
    path: "vendor/components/src/define-component.ts",
    role: "Custom Element registration, optional ElementInternals attachment, native form callbacks and render orchestration.",
    test: false
  },
  {
    path: "vendor/components/src/internal/component-inputs.ts",
    role: "Typed input declarations, shorthand normalization, absent defaults, and validation boundary.",
    test: false
  },
  {
    path: "vendor/components/src/internal/component-inputs.test.ts",
    role: "Backward-compatible coercion, defaults, and validation failures.",
    test: true
  },
  {
    path: "vendor/components/src/define-component.test.ts",
    role: "Input accessors, upgrade replay, validation, native form callbacks, attachment, submission/restore values and errors using a non-DOM boundary fake.",
    test: true
  },
  {
    path: "vendor/components/src/form.ts",
    role: "Form-state props, opt-in submission/validity/reset/disabled/restoration orchestration, and input/change events.",
    test: false
  },
  {
    path: "vendor/components/src/index.ts",
    role: "Supported public package exports.",
    test: false
  },
  {
    path: "vendor/components/src/attributes.test.ts",
    role: "Attribute conversion and reflection promises.",
    test: true
  },
  {
    path: "vendor/components/src/events.test.ts",
    role: "Event detail, propagation, and cancellation promises.",
    test: true
  },
  {
    path: "vendor/components/src/template.test.ts",
    role: "Interpolation, validation, and pure directive promises.",
    test: true
  },
  {
    path: "vendor/components/src/async-state.test.ts",
    role: "Async transitions, concurrent ordering, reset invalidation, retry, unsubscribe and default compatibility.",
    test: true
  },
  {
    path: "vendor/components/src/lifecycle.test.ts",
    role: "Connection resource ownership and cleanup promises.",
    test: true
  },
  {
    path: "vendor/components/src/form.test.ts",
    role: "Form helper property and event promises.",
    test: true
  }
];
async function loadSourceFiles(signal) {
  return await Promise.all(sourceFiles.map(async (file)=>{
    const response = await fetch(`/${file.path}`, {
      signal
    });
    if (!response.ok) {
      throw new Error(`Could not load ${file.path}: HTTP ${response.status}`);
    }
    return {
      ...file,
      source: await response.text()
    };
  }));
}
function renderSourceArchive(files) {
  const implementationFiles = files.filter((file)=>!file.test);
  const testFiles = files.filter((file)=>file.test);
  return html`
    <h3>Exact implementation files</h3>
    ${repeat(implementationFiles, (file)=>file.path, (file)=>html`
        <section class="learning-step">
          <h3>${file.path}</h3>
          <p>${file.role}</p>
          ${renderCodeExample(file.source)}
        </section>
      `)}
    <h3>Exact test files</h3>
    <p>
      Read each test name as a behavioral promise. Deno covers pure contracts;
      real DOM parsing, Custom Elements, Shadow DOM, and node identity require
      the browser checkpoints described above.
    </p>
    ${repeat(testFiles, (file)=>file.path, (file)=>html`
        <section class="learning-step">
          <h3>${file.path}</h3>
          <p>${file.role}</p>
          ${renderCodeExample(file.source)}
        </section>
      `)}
  `;
}
function liveOutput(event) {
  return event.currentTarget.closest("[data-live-example]").querySelector("[data-live-output]");
}
function renderLiveExample(id) {
  switch(id){
    case "latest-async-state":
      return html`<docs-latest-search-demo></docs-latest-search-demo>`;
    case "native-form-association":
      return html`
        <div class="layout-demo">
          <p class="layout-demo-label">Live integration · native form ownership</p>
          <p>The combobox opts into the core form capability. Try submission,
            required validation, reset, and fieldset disabling in its live form.</p>
          <a href="/components/combobox">Open the combobox form walkthrough</a>
        </div>
      `;
    case "native-element":
      {
        let connected = true;
        return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · connection and textContent</p>
          <button @click=${(event)=>{
          connected = !connected;
          const output = liveOutput(event);
          output.textContent = connected ? "<game-badge> connected: Celeste" : "<game-badge> disconnected";
        }}>Remove / reinsert badge</button>
          <output data-live-output
            aria-live="polite">&lt;game-badge&gt; connected: Celeste</output>
        </div>
      `;
      }
    case "attributes":
      return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · attribute conversion</p>
          <label>Type <select @change=${(event)=>{
        const select = event.currentTarget;
        const input = select.closest("[data-live-example]").querySelector("input");
        input.value = select.value === "boolean" ? "false" : "42";
        input.dispatchEvent(new Event("input", {
          bubbles: true
        }));
      }}>
            <option>boolean</option><option>number</option><option>string</option>
          </select></label>
          <label>Raw value <input value="false" @input=${(event)=>{
        const input = event.currentTarget;
        const type = input.closest("[data-live-example]").querySelector("select").value;
        const value = type === "boolean" ? input.value.length > 0 : type === "number" ? Number(input.value) : input.value;
        liveOutput(event).textContent = `${type}: ${String(value)}; serialized: ${type === "boolean" && !value ? "attribute removed" : String(value)}`;
      }}></label>
          <output data-live-output
            aria-live="polite">boolean: true; serialized: </output>
        </div>
      `;
    case "events":
      return html`
        <div class="layout-demo" data-live-example=${id}
          @game-select=${(event)=>{
        const custom = event;
        if (custom.detail.id === "g-99") event.preventDefault();
        liveOutput(event).textContent = `received ${custom.type}: ${custom.detail.id}`;
      }}>
          <p class="layout-demo-label">Live example · bubbling CustomEvent</p>
          <button @click=${(event)=>{
        event.currentTarget.dispatchEvent(new CustomEvent("game-select", {
          detail: {
            id: "g-17"
          },
          bubbles: true
        }));
      }}>Select Celeste</button>
          <button @click=${(event)=>{
        const button = event.currentTarget;
        const accepted = button.dispatchEvent(new CustomEvent("game-select", {
          detail: {
            id: "g-99"
          },
          bubbles: true,
          cancelable: true
        }));
        liveOutput(event).textContent = `cancelable dispatch returned ${accepted}`;
      }}>Dispatch cancelable</button>
          <output data-live-output aria-live="polite">No event received yet.</output>
        </div>
      `;
    case "string-templates":
      return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · property-path interpolation</p>
          <label>Game title <input value="Celeste" @input=${(event)=>{
        const value = event.currentTarget.value;
        liveOutput(event).textContent = `Hello, ${value || "(empty)"}`;
      }}></label>
          <output data-live-output aria-live="polite">Hello, Celeste</output>
        </div>
      `;
    case "async-state":
      return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · async state transitions</p>
          <button @click=${(event)=>{
        const output = liveOutput(event);
        output.textContent = "loading: previous data retained";
        setTimeout(()=>output.textContent = "success: 3 games", 400);
      }}>Load</button>
          <button @click=${(event)=>{
        const output = liveOutput(event);
        output.textContent = "loading: previous data retained";
        setTimeout(()=>output.textContent = "error: network unavailable", 400);
      }}>Simulate error</button>
          <button @click=${(event)=>{
        liveOutput(event).textContent = "idle: no data";
      }}>Reset</button>
          <output data-live-output aria-live="polite">idle: no data</output>
        </div>
      `;
    case "connection-scope":
    case "lifecycle-edge-cases":
      {
        let active = true;
        let count = 0;
        return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · connection-owned listener</p>
          <button @click=${(event)=>{
          active = !active;
          liveOutput(event).textContent = active ? "connected: listener active" : "disconnected: listener disposed";
        }}>Connect / disconnect</button>
          <button @click=${(event)=>{
          if (active) count++;
          liveOutput(event).textContent = active ? `event handled ${count} time${count === 1 ? "" : "s"}` : "event ignored: scope disposed";
        }}>Send event</button>
          <output data-live-output
            aria-live="polite">connected: listener active</output>
        </div>
      `;
      }
    case "template-results":
      return html`
        <div class="layout-demo" data-live-example=${id}>
          <p
            class="layout-demo-label">Live example · stable strings, changing values</p>
          <button @click=${(event)=>{
        const output = liveOutput(event);
        output.textContent = output.textContent?.includes("one") ? "same template shape, value: two" : "same template shape, value: one";
      }}>Change value</button>
          <output data-live-output
            aria-live="polite">same template shape, value: one</output>
        </div>
      `;
    case "directive-runtime":
      return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · when chooses one branch</p>
          <button @click=${(event)=>{
        const output = liveOutput(event);
        output.textContent = output.textContent?.startsWith("selected") ? "fallback branch: backlog" : "selected branch: now playing";
      }}>Toggle when()</button>
          <button @click=${(event)=>{
        liveOutput(event).textContent = "repeat(): [Celeste, Hades] → keyed entries [g-17, g-23]";
      }}>Build repeat()</button>
          <button @click=${(event)=>{
        liveOutput(event).textContent = "unsafeHTML(): <strong>trusted markup</strong> inserted";
      }}>Insert unsafeHTML()</button>
          <output data-live-output
            aria-live="polite">selected branch: now playing</output>
        </div>
      `;
    case "compile-template":
      return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · expression markers</p>
          <button @click=${(event)=>{
        const output = liveOutput(event);
        output.textContent = output.textContent?.includes("hidden") ? "compiled: <!--nala-start:0--> value <!--nala-end:0-->" : "cached: same TemplateStringsArray shape";
      }}>Compile / reuse shape</button>
          <output data-live-output
            aria-live="polite">compiled: hidden marker boundary</output>
        </div>
      `;
    case "parts":
      return html`
        <div class="layout-demo" data-live-example=${id}>
          <p
            class="layout-demo-label">Live example · attribute, property, boolean, event</p>
          <label><input type="checkbox" checked @change=${(event)=>{
        liveOutput(event).textContent = `property checked: ${event.currentTarget.checked}`;
      }}> checked property</label>
          <label>attribute value <input value="active" @input=${(event)=>{
        const input = event.currentTarget;
        liveOutput(event).textContent = `attribute value: ${input.value || "removed"}`;
      }}></label>
          <button @click=${(event)=>{
        liveOutput(event).textContent = "event listener ran";
      }}>Trigger @click</button>
          <output data-live-output aria-live="polite">property checked: true</output>
        </div>
      `;
    case "keyed-repeat":
      return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · reorder by stable key</p>
          <button @click=${(event)=>{
        const example = event.currentTarget.closest("[data-live-example]");
        const list = example.querySelector("ol");
        const first = list.firstElementChild;
        if (first) list.append(first);
        liveOutput(event).textContent = `${Array.from(list.children).map((item)=>item.textContent).join(" · ")} (same keyed nodes moved)`;
      }}>Move first item to the end</button>
          <ol>
            <li data-key="a">A</li>
            <li data-key="b">B</li>
            <li data-key="c">C</li>
          </ol>
          <output data-live-output aria-live="polite">A · B · C</output>
        </div>
      `;
    case "template-instance":
      return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · update versus replace</p>
          <button @click=${(event)=>{
        const output = liveOutput(event);
        output.textContent = output.textContent?.startsWith("matching") ? "different shape: instance replaced" : "matching shape: existing instance updated";
      }}>Change template shape</button>
          <output data-live-output
            aria-live="polite">matching shape: existing instance updated</output>
        </div>
      `;
    case "define-component":
      return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · reflected prop</p>
          <label>title attribute <input value="Celeste" @input=${(event)=>{
        const value = event.currentTarget.value;
        liveOutput(event).textContent = `attributeChangedCallback → props.title = ${value || "(empty)"}`;
      }}></label>
          <output data-live-output
            aria-live="polite">attributeChangedCallback → props.title = Celeste</output>
        </div>
      `;
    case "data-inputs":
      return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · real property-only collection</p>
          <docs-data-input-demo .games=${inputDemoGames}></docs-data-input-demo>
          <button @click=${(event)=>{
        const button = event.currentTarget;
        const shelf = button.parentElement?.querySelector("docs-data-input-demo");
        if (!shelf) {
          throw new Error("Data input example is missing its shelf");
        }
        shelf.games = shelf.games.length === 2 ? [
          ...shelf.games,
          {
            id: "tunic",
            title: "Tunic"
          }
        ] : inputDemoGames;
        liveOutput(event).textContent = `${shelf.games.length} games; games attribute: ${shelf.getAttribute("games") ?? "absent"}`;
      }}>Replace collection</button>
          <output data-live-output
            aria-live="polite">2 games; games attribute: absent</output>
        </div>
      `;
    case "shadow-slots-styles":
      return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · slot fallback and theme token</p>
          <button @click=${(event)=>{
        const output = liveOutput(event);
        output.textContent = output.textContent?.includes("Celeste") ? "fallback slot: Untitled" : "named slot: Celeste · --accent: crimson";
      }}>Toggle slotted content</button>
          <output data-live-output
            aria-live="polite">named slot: Celeste · --accent: crimson</output>
        </div>
      `;
    case "forms-and-entrypoint":
      return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · input detail.value</p>
          <label>Rating <input type="range" min="0" max="5" value="3" @input=${(event)=>{
        const value = event.currentTarget.value;
        liveOutput(event).textContent = `input event → detail.value = ${value}`;
      }}></label>
          <output data-live-output
            aria-live="polite">input event → detail.value = 3</output>
        </div>
      `;
    default:
      return html``;
  }
}
defineComponent("docs-under-the-hood-components-page", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Under the Hood · vendor/components</p>
        <h1>Build the components package from browser APIs</h1>
        <p class="page-lead">
          Begin with HTMLElement and CustomEvent, then add one understandable
          capability at a time. The final result is the exact Nala components
          package: no virtual DOM, JSX compiler, framework lifecycle, or hidden
          event system.
        </p>

        <nala-callout tone="info">
          <span slot="title">Two execution environments</span>
          Pure TypeScript contracts run in Deno. DOM behavior runs in a real
          browser because Deno does not provide document, Custom Elements,
          template parsing, or Shadow DOM. Every checkpoint says where to run it.
        </nala-callout>

        <h2>What we are building</h2>
        <p>
          The package has three layers. Small independent primitives handle
          attributes, events, templates, and async state. Lifecycle and reactive
          rendering own browser resources and focused DOM updates. defineComponent
          and defineFormControl compose those pieces into a convenient public API.
        </p>
        <ol>
          <li>Learn the native platform boundary.</li>
          <li>Build and test one reusable primitive at a time.</li>
          <li>Compile reactive templates into narrowly updatable parts.</li>
          <li>Assemble the parts around native Custom Element callbacks.</li>
          <li>Compare the result with every current source and test file.</li>
        </ol>

        <nav class="component-doc-nav" aria-label="Components tutorial chapters">
          ${repeat(tutorialSteps, (step)=>step.id, (step)=>html`
              <a href=${`#${step.id}`}>${step.title.replace(/^\d+\.\s*/, "")}</a>
            `)}
        </nav>

        ${repeat(tutorialSteps, (step)=>step.id, (step)=>html`
            <section id=${step.id}>
              <h2>${step.title}</h2>
              <p><strong>Goal:</strong> ${step.goal}</p>
              ${repeat(step.paragraphs, (paragraph)=>paragraph, (paragraph)=>html`<p>${paragraph}</p>`)}
              <ul>${repeat(step.points, (point)=>point, (point)=>html`<li>${point}</li>`)}</ul>
              ${renderCodeExample(step.code)}
              ${renderLiveExample(step.id)}
              <nala-callout tone="success">
                <span slot="title">Working checkpoint</span>
                ${step.run}
              </nala-callout>
            </section>
          `)}

        <section id="exact-source">
          <h2>17. Reach the exact repository implementation</h2>
          <p>
            The source below is loaded directly from the checked-out repository,
            not copied into this page. That guarantees the final comparison shows
            every current line, including comments, private helpers, public
            exports, and tests. Refresh after editing a source file to see it.
          </p>
          <div data-source-archive>
            <p role="status">Loading the exact components source…</p>
          </div>
        </section>

        <section>
          <h2>Where the package deliberately stops</h2>
          <p>
            Nala components do not provide a virtual DOM, app-wide event bus,
            synthetic Shadow DOM, slot engine, form association, server renderer,
            sanitizer, scheduler, or automatic store binding. Native browser
            primitives remain visible, and applications choose how to compose
            them.
          </p>
          <p>
            Continue with the concise
            <a href="/packages/components">Components reference</a> when you need
            signatures and contracts rather than the construction story.
          </p>
        </section>
      </article>
    `,
  onConnect: ({ onCleanup, query })=>{
    const archive = query("[data-source-archive]");
    if (!archive) return;
    const controller = new AbortController();
    onCleanup(()=>controller.abort());
    loadSourceFiles(controller.signal).then((files)=>render(renderSourceArchive(files), archive), (error)=>{
      if (controller.signal.aborted) return;
      render(html`
            <nala-callout tone="danger">
              <span slot="title">Source could not be loaded</span>
              ${error instanceof Error ? error.message : String(error)}
            </nala-callout>
          `, archive);
    });
  }
});
