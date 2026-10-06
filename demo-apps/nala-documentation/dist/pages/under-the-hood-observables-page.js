import { defineComponent, html, render, repeat } from "../../../../vendor/components/dist/index.js";
import { renderCodeExample } from "./code-example.js";
const tutorialSteps = [
  {
    id: "callbacks",
    title: "1. Begin with callbacks",
    goal: "Let several parts of Game Shelf hear that a game was added.",
    paragraphs: [
      "A callback is a function passed to code that will call it later. The collection service does not need to know how a counter, recent-games panel, or notification works. It only needs a list of callbacks interested in the same event.",
      "A Set fits this problem well: each callback is stored once, iteration preserves insertion order, and delete removes one exact function reference. Returning the delete operation as a closure gives the subscriber ownership of its own lifetime.",
      "This first version is already useful. Its weakness is organizational: observers and publication are loose variables and functions. The next checkpoint gives that behavior one reusable type."
    ],
    points: [
      "The producer decides when a value exists; observers only react.",
      "Unsubscribe needs the original callback identity, which the returned closure remembers.",
      "Nothing is queued: a callback receives only values published while it is registered."
    ],
    code: `type Game = {
  id: string;
  title: string;
  status?: "visible" | "hidden";
};
type GameObserver = (game: Game) => void;

const observers = new Set<GameObserver>();

function subscribe(observer: GameObserver): () => void {
  observers.add(observer);
  return () => observers.delete(observer);
}

function publish(game: Game): void {
  for (const observer of observers) observer(game);
}

const stopCounter = subscribe((game) => updateCount(game));
const stopToast = subscribe((game) => showAddedToast(game.title));

publish({ id: "g-17", title: "Celeste" });
stopCounter();
stopToast();`,
    checkpoint: "Deno or browser: publish two games, unsubscribe one callback between them, and verify only the remaining callback receives the second game."
  },
  {
    id: "subject",
    title: "2. Turn the registry into a Subject",
    goal: "Create a generic, hot multicast source with explicit teardown.",
    paragraphs: [
      "Observer<T> names the callback contract, and Unsubscribe names the cleanup contract. Subject<T> owns a private Set so callers can subscribe and publish but cannot mutate its internal registry directly.",
      "Subject is hot because it exists and may receive next() calls independently of subscribers. It is multicast because every current observer shares those calls. It stores no history, so a subscriber that arrives after a game was published does not receive that old game.",
      "next() iterates a copied array rather than the live Set. That snapshot defines who belongs to the current emission. If observer A unsubscribes observer B while a value is being sent, B remains in the snapshot and receives that current value once; it is absent from the next emission."
    ],
    points: [
      "Callbacks run synchronously in subscription order.",
      "Calling unsubscribe repeatedly is harmless because Set.delete is idempotent.",
      "An observer added during an emission starts with the next value, not the current snapshot."
    ],
    code: `export type Observer<T> = (value: T) => void;
export type Unsubscribe = () => void;

export class Subject<T> {
  #observers = new Set<Observer<T>>();

  subscribe(observer: Observer<T>): Unsubscribe {
    this.#observers.add(observer);
    return () => {
      this.#observers.delete(observer);
    };
  }

  next(value: T): void {
    for (const observer of [...this.#observers]) {
      observer(value);
    }
  }
}

const gameAdded = new Subject<Game>();
gameAdded.subscribe((game) => showAddedToast(game.title));
gameAdded.next({ id: "g-17", title: "Celeste" });`,
    checkpoint: "Deno: assert synchronous subscription order, selective unsubscribe, and snapshot behavior when one observer unsubscribes another during next()."
  },
  {
    id: "completion",
    title: "3. Add a terminal state",
    goal: "Close a Subject permanently and release all observers.",
    paragraphs: [
      "Some sources have a definite end, such as one import operation. A private completed flag makes that terminal state impossible to reopen accidentally. complete() marks the Subject and clears every observer reference.",
      "After completion, next() does nothing and subscribe() returns a no-op cleanup without storing the callback. The public completed getter allows inspection, but there is no completion callback in Nala's Observer contract.",
      "This completes the exact Subject behavior. Notice what it does not do: it has no error channel, scheduler, replay buffer, deduplication, or producer lifecycle. If an observer throws, that ordinary exception escapes next() and can interrupt the remaining callbacks."
    ],
    points: [
      "complete() is for the entire source; unsubscribe() removes only one observer.",
      "Publishing the same value twice notifies twice because Subject performs no equality check.",
      "Model a domain failure as a value when consumers need to render it."
    ],
    code: `export class Subject<T> {
  #observers = new Set<Observer<T>>();
  #completed = false;

  subscribe(observer: Observer<T>): Unsubscribe {
    if (this.#completed) return () => {};
    this.#observers.add(observer);
    return () => {
      this.#observers.delete(observer);
    };
  }

  next(value: T): void {
    if (this.#completed) return;
    for (const observer of [...this.#observers]) observer(value);
  }

  complete(): void {
    this.#completed = true;
    this.#observers.clear();
  }

  get completed(): boolean {
    return this.#completed;
  }
}`,
    checkpoint: "Deno: publish once, complete, then publish and subscribe again. Verify the first value arrived, later values did not, and completed is true."
  },
  {
    id: "behavior-subject",
    title: "4. Remember one current value with BehaviorSubject",
    goal: "Initialize late subscribers from the latest collection selection.",
    paragraphs: [
      "A Subject models events that happen now. Some UI needs current state instead: a details panel opened later must immediately know which game is selected. BehaviorSubject extends Subject and stores exactly one value, beginning with a required initial value.",
      "subscribe first asks Subject to register the observer, then calls the observer with the stored value. Replay is synchronous and happens before subscribe returns. next stores the value before broadcasting, so an observer reading .value during its callback sees the new value.",
      "The exact implementation has a subtle completion consequence. After complete(), subscribe still executes its replay callback even though super.subscribe did not register it. A later next() also changes .value before the completed Subject suppresses broadcasting. Treat completion as broadcast closure, not as immutability of the stored value."
    ],
    points: [
      "The initial value should honestly model the domain, often null or a discriminated state.",
      "BehaviorSubject stores one value, not a history.",
      "Equal next() values still broadcast; there is no Object.is suppression here."
    ],
    code: `export class BehaviorSubject<T> extends Subject<T> {
  #value: T;

  constructor(initialValue: T) {
    super();
    this.#value = initialValue;
  }

  get value(): T {
    return this.#value;
  }

  override subscribe(observer: Observer<T>): Unsubscribe {
    const unsubscribe = super.subscribe(observer);
    observer(this.#value);
    return unsubscribe;
  }

  override next(value: T): void {
    this.#value = value;
    super.next(value);
  }
}

const selectedGame = new BehaviorSubject<Game | null>(null);
selectedGame.subscribe((game) => renderDetails(game)); // immediately null
selectedGame.next({ id: "g-17", title: "Celeste" });`,
    checkpoint: "Deno: verify initial replay, latest-value replay for a late subscriber, and subsequent broadcasts. Then complete and observe the documented value/replay edge case."
  },
  {
    id: "observable",
    title: "5. Describe cold work with Observable",
    goal: "Store a producer recipe that starts separately for each subscriber.",
    paragraphs: [
      "Observable reverses control. Instead of application code calling next() on a shared source, its constructor receives a producer function. Construction only stores that function. subscribe() runs it with one observer, so each subscriber starts an independent execution.",
      "The producer may return an Unsubscribe function that releases the resource it created. A timer producer clears its own timer; a browser event producer removes its own listener. If setup needs no cleanup, the producer may return nothing and subscribe supplies a safe no-op function.",
      "Cold and lazy are observable behavior, not just terminology. Two subscriptions mean two producer calls and potentially two resources. Creating an Observable without subscribing performs no producer work at all."
    ],
    points: [
      "Subject is a running shared source; Observable is a reusable recipe.",
      "Cleanup belongs to each subscription independently.",
      "The producer may emit synchronously before subscribe returns."
    ],
    code: `type Producer<T> =
  (observer: Observer<T>) => Unsubscribe | void;

export class Observable<T> {
  #producer: Producer<T>;

  constructor(producer: Producer<T>) {
    this.#producer = producer;
  }

  subscribe(observer: Observer<T>): Unsubscribe {
    const cleanup = this.#producer(observer);
    return typeof cleanup === "function" ? cleanup : () => {};
  }
}

const ticks = new Observable<number>((observer) => {
  let count = 0;
  const timer = setInterval(() => observer(++count), 1000);
  return () => clearInterval(timer);
});

const stopTicks = ticks.subscribe((count) => console.log(count));
stopTicks();`,
    checkpoint: "Deno: increment a producerRuns counter inside the producer. Verify zero runs before subscribe and one additional run for each subscription; call each cleanup independently."
  },
  {
    id: "operators",
    title: "6. Compose lazy recipes with map and filter",
    goal: "Transform and select values without starting the source early.",
    paragraphs: [
      "An operator returns another Observable whose producer subscribes to the previous Observable. map wraps the downstream observer with a callback that projects each value. filter wraps it with a callback that forwards only accepted values.",
      "No operator subscribes while the pipeline is built. Subscribing to the final Observable walks backward through each wrapper until the original producer starts. The Unsubscribe returned by the source then flows outward through every operator unchanged.",
      "Operator order matters. Filtering game objects and then mapping to titles differs from mapping first and filtering title strings. Generic types make those changing stages visible to TypeScript."
    ],
    points: [
      "Each subscription to a pipeline still starts a fresh original producer.",
      "map and filter are synchronous because their source notifications are synchronous.",
      "This package intentionally stops at two operators instead of recreating RxJS."
    ],
    code: `map<R>(project: (value: T) => R): Observable<R> {
  return new Observable<R>((observer) =>
    this.subscribe((value) => observer(project(value)))
  );
}

filter(predicate: (value: T) => boolean): Observable<T> {
  return new Observable<T>((observer) =>
    this.subscribe((value) => {
      if (predicate(value)) observer(value);
    })
  );
}

const games = new Observable<Game>((observer) => {
  observer({ id: "g-17", title: "Celeste", status: "visible" });
  observer({ id: "g-18", title: "Spoiler", status: "hidden" });
});

const visibleTitles = games
  .filter((game) => game.status !== "hidden")
  .map((game) => game.title);

// The original producer starts only here.
const stopTitles = visibleTitles.subscribe(renderTitle);`,
    checkpoint: "Deno: build a filter/map chain while recording producer runs, confirm no work occurs before subscribe, then verify transformed values and source cleanup."
  },
  {
    id: "boundaries",
    title: "7. Publish a small boundary and test behavior",
    goal: "Expose only supported contracts and treat tests as promises.",
    paragraphs: [
      "The package entrypoint exports three runtime classes plus Observer and Unsubscribe types. Producer remains private because callers provide producer-shaped functions through the Observable constructor without needing a named public contract.",
      "Tests use plain arrays and counters, so every runtime promise is deterministic in Deno. Subject tests cover ordered multicast, selective teardown, and completion. BehaviorSubject tests cover initial and latest replay. Observable tests prove cold execution and operator composition.",
      "The existing tests describe the main path. The tutorial also names edge semantics visible in the implementation, such as snapshot dispatch, ordinary exception propagation, and BehaviorSubject after completion, so readers do not infer stronger guarantees than the code provides."
    ],
    points: [
      "export type removes type-only names from emitted JavaScript.",
      "Tests import implementation files directly; applications use index.ts.",
      "No DOM is required, although browser event APIs are useful Observable producers."
    ],
    code: `export { Subject } from "./subject.js";
export type { Observer, Unsubscribe } from "./subject.js";
export { BehaviorSubject } from "./behavior-subject.js";
export { Observable } from "./observable.js";

// A failure can be represented explicitly when consumers need it.
type LoadResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: unknown };

const results = new Subject<LoadResult<Game[]>>();`,
    checkpoint: "Deno: run all seven source files through deno test. A green suite proves the public behavior without a browser, network, scheduler, or mocking package."
  }
];
const sourceFiles = [
  {
    path: "vendor/observables/src/subject.ts",
    role: "Hot synchronous multicast, teardown, and completion.",
    test: false
  },
  {
    path: "vendor/observables/src/behavior-subject.ts",
    role: "Current-value storage and immediate replay.",
    test: false
  },
  {
    path: "vendor/observables/src/observable.ts",
    role: "Cold producer execution with lazy map and filter.",
    test: false
  },
  {
    path: "vendor/observables/src/index.ts",
    role: "Supported public package exports.",
    test: false
  },
  {
    path: "vendor/observables/src/subject.test.ts",
    role: "Ordered broadcast, selective unsubscribe, and completion promises.",
    test: true
  },
  {
    path: "vendor/observables/src/behavior-subject.test.ts",
    role: "Initial replay, latest replay, and broadcast promises.",
    test: true
  },
  {
    path: "vendor/observables/src/observable.test.ts",
    role: "Cold execution and operator composition promises.",
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
      Read each test name as a behavioral promise. These tests need no browser:
      observers, producers, cleanup functions, and operators are ordinary
      TypeScript values.
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
function observableOutput(event, name = "data-live-output") {
  return event.currentTarget.closest("[data-live-example]").querySelector(`[${name}]`);
}
function renderObservableLiveExample(id) {
  switch(id){
    case "callbacks":
      {
        let counterActive = true;
        let toastActive = true;
        let published = 0;
        return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · callback registry</p>
          <div
            style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem;margin:.75rem 0">
            <output data-counter
              style="padding:.7rem;border:1px solid #cbcfc8;background:#f2f0e8">Counter: waiting</output>
            <output data-toast
              style="padding:.7rem;border:1px solid #cbcfc8;background:#f2f0e8">Toast: waiting</output>
          </div>
          <button @click=${(event)=>{
          published++;
          const root = event.currentTarget.closest("[data-live-example]");
          if (counterActive) {
            root.querySelector("[data-counter]").textContent = `Counter: ${published}`;
          }
          if (toastActive) {
            root.querySelector("[data-toast]").textContent = `Toast: added game ${published}`;
          }
          observableOutput(event).textContent = `publish(${published}) called ${[
            counterActive && "counter",
            toastActive && "toast"
          ].filter(Boolean).join(" + ") || "no observers"}`;
        }}>Publish game</button>
          <button @click=${()=>{
          counterActive = !counterActive;
        }}>Toggle counter</button>
          <button @click=${()=>{
          toastActive = !toastActive;
        }}>Toggle toast</button>
          <output data-live-output aria-live="polite">No game published yet.</output>
        </div>
      `;
      }
    case "subject":
      {
        let leftActive = true;
        let rightActive = true;
        let value = 0;
        return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · hot multicast Subject</p>
          <div
            style="display:flex;align-items:center;gap:.5rem;margin:.75rem 0;flex-wrap:wrap">
            <strong
              style="padding:.7rem;background:#184d3b;color:white">Subject.next()</strong>
            <span aria-hidden="true">→</span>
            <output data-left
              style="padding:.7rem;border:2px solid #315f70">Observer A: waiting</output>
            <output data-right
              style="padding:.7rem;border:2px solid #7b3f58">Observer B: waiting</output>
          </div>
          <button @click=${(event)=>{
          value++;
          const root = event.currentTarget.closest("[data-live-example]");
          if (leftActive) {
            root.querySelector("[data-left]").textContent = `Observer A: ${value}`;
          }
          if (rightActive) {
            root.querySelector("[data-right]").textContent = `Observer B: ${value}`;
          }
          observableOutput(event).textContent = `next(${value}) delivered synchronously`;
        }}>next(game)</button>
          <button @click=${()=>{
          leftActive = !leftActive;
        }}>Toggle observer A</button>
          <button @click=${()=>{
          rightActive = !rightActive;
        }}>Toggle observer B</button>
          <output data-live-output
            aria-live="polite">Both observers are subscribed.</output>
        </div>
      `;
      }
    case "completion":
      {
        let completed = false;
        let value = 0;
        return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · terminal completion</p>
          <div
            style="display:flex;gap:.5rem;align-items:center;margin:.75rem 0;flex-wrap:wrap">
            <output data-stream
              style="min-width:12rem;padding:.7rem;border:1px solid #cbcfc8;background:#f2f0e8">Stream is open</output>
            <span data-pulse aria-hidden="true" style="font-size:1.5rem">●</span>
          </div>
          <button @click=${(event)=>{
          if (completed) {
            observableOutput(event).textContent = "next() ignored after complete()";
            return;
          }
          value++;
          event.currentTarget.closest("[data-live-example]").querySelector("[data-pulse]").textContent = String(value);
          observableOutput(event).textContent = `next(${value}) delivered`;
        }}>next()</button>
          <button @click=${(event)=>{
          completed = true;
          const root = event.currentTarget.closest("[data-live-example]");
          root.querySelector("[data-stream]").textContent = "Stream completed; observers cleared";
          observableOutput(event).textContent = "complete() is terminal";
        }}>complete()</button>
          <output data-live-output aria-live="polite">Stream is open.</output>
        </div>
      `;
      }
    case "behavior-subject":
      {
        let current = "No game selected";
        let lateJoined = false;
        return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · current value replay</p>
          <div
            style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem;margin:.75rem 0">
            <output data-current
              style="padding:.7rem;border:2px solid #184d3b;background:#edf5f0">Current: ${current}</output>
            <output data-late
              style="padding:.7rem;border:2px solid #a43f35;background:#fff5f2">Late subscriber: not subscribed</output>
          </div>
          <button @click=${(event)=>{
          current = current === "Celeste" ? "Hades" : "Celeste";
          const root = event.currentTarget.closest("[data-live-example]");
          root.querySelector("[data-current]").textContent = `Current: ${current}`;
          if (lateJoined) {
            root.querySelector("[data-late]").textContent = `Late subscriber: replayed ${current}`;
          }
          observableOutput(event).textContent = `next(${current}) stored and broadcast`;
        }}>Select game</button>
          <button @click=${(event)=>{
          lateJoined = true;
          event.currentTarget.closest("[data-live-example]").querySelector("[data-late]").textContent = `Late subscriber: replayed ${current}`;
          observableOutput(event).textContent = "subscribe() immediately replayed .value";
        }}>Add late subscriber</button>
          <output data-live-output
            aria-live="polite">Initial value is available to the first subscriber.</output>
        </div>
      `;
      }
    case "observable":
      {
        let runs = 0;
        let subscriptions = 0;
        return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · cold producer lanes</p>
          <div
            style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem;margin:.75rem 0">
            <output data-lane="a"
              style="padding:.7rem;border:1px solid #315f70">Subscriber A: idle</output>
            <output data-lane="b"
              style="padding:.7rem;border:1px solid #7b3f58">Subscriber B: idle</output>
          </div>
          <button @click=${(event)=>{
          subscriptions++;
          runs++;
          const lane = subscriptions % 2 === 1 ? "a" : "b";
          const root = event.currentTarget.closest("[data-live-example]");
          root.querySelector(`[data-lane="${lane}"]`).textContent = `Subscriber ${lane.toUpperCase()}: producer run ${runs}`;
          observableOutput(event).textContent = `subscribe() started independent producer run ${runs}`;
        }}>Subscribe a lane</button>
          <button @click=${(event)=>{
          observableOutput(event).textContent = subscriptions ? "unsubscribe() released one lane" : "Nothing to unsubscribe";
        }}>Unsubscribe latest</button>
          <output data-live-output
            aria-live="polite">Producer has not run; construction was lazy.</output>
        </div>
      `;
      }
    case "operators":
      {
        let emitted = 0;
        return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · filter → map pipeline</p>
          <div
            style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;margin:.75rem 0">
            <span style="padding:.6rem;background:#f2f0e8">all games</span><span>→</span><span style="padding:.6rem;background:#d9e9ed">visible only</span><span>→</span><span style="padding:.6rem;background:#eedde4">titles</span>
          </div>
          <button @click=${(event)=>{
          emitted++;
          const hidden = emitted % 2 === 0;
          observableOutput(event).textContent = hidden ? `source emitted hidden game; filter dropped it` : `source emitted game; map produced title "Celeste ${emitted}"`;
        }}>Emit game</button>
          <output data-live-output
            aria-live="polite">Subscribe to start the pipeline.</output>
        </div>
      `;
      }
    case "boundaries":
      return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · contract checklist</p>
          <div
            style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.5rem;margin:.75rem 0">
            <output
              style="padding:.7rem;border:1px solid #cbcfc8">Subject<br><strong>hot</strong></output>
            <output
              style="padding:.7rem;border:1px solid #cbcfc8">BehaviorSubject<br><strong>replays one</strong></output>
            <output
              style="padding:.7rem;border:1px solid #cbcfc8">Observable<br><strong>cold</strong></output>
          </div>
          <button @click=${(event)=>{
        observableOutput(event).textContent = "7/7 contracts visible: subscribe, next, unsubscribe, complete, replay, cold start, operators";
      }}>Run checklist</button>
          <output data-live-output
            aria-live="polite">Press the checklist to review the package boundary.</output>
        </div>
      `;
    default:
      return html``;
  }
}
defineComponent("docs-under-the-hood-observables-page", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Under the Hood · vendor/observables</p>
        <h1>Build observables from callbacks</h1>
        <p class="page-lead">
          Begin with a Set of callback functions, then add one behavior at a time
          until the result is Nala's exact Subject, BehaviorSubject, and
          Observable implementation.
        </p>

        <nala-callout tone="info">
          <span slot="title">The whole package is synchronous</span>
          next(), replay, map(), and filter() call observers before the current
          stack returns. There are no schedulers, microtask queues, error channels,
          or hidden background work.
        </nala-callout>

        <h2>Three related mental models</h2>
        <ul>
          <li><strong>Subject:</strong> a shared room receiving events now.</li>
          <li><strong>BehaviorSubject:</strong> that room plus one current value.</li>
          <li><strong>Observable:</strong> a recipe started separately by each subscriber.</li>
        </ul>
        <p>
          The examples build on the Game type introduced in checkpoint one.
          Functions such as updateCount, showAddedToast, and renderDetails belong
          to the surrounding Game Shelf app; the package supplies publication,
          subscription, transformation, and cleanup.
        </p>

        <nav class="component-doc-nav" aria-label="Observables tutorial chapters">
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
              ${renderObservableLiveExample(step.id)}
              <nala-callout tone="success">
                <span slot="title">Working checkpoint</span>
                ${step.checkpoint}
              </nala-callout>
            </section>
          `)}

        <section id="exact-source">
          <h2>8. Reach the exact repository implementation</h2>
          <p>
            The source below is loaded directly from this checkout. It includes
            every current implementation and test line, so the final chapter
            cannot silently drift from the package it explains.
          </p>
          <div data-source-archive>
            <p role="status">Loading the exact observables source...</p>
          </div>
        </section>

        <section>
          <h2>Where observables deliberately stop</h2>
          <p>
            This package has no scheduler, error/completion observer callbacks,
            retry policy, buffering, backpressure, combine operators, or automatic
            DOM rendering. Those features would change its small mental model.
            Use vendor/state for tracked application state and computed values.
          </p>
          <p>
            Continue with the concise
            <a href="/packages/observables">Observables reference</a>, or study the
            dedicated <a href="/packages/observables/subject">Subject</a>,
            <a href="/packages/observables/behavior-subject">BehaviorSubject</a>,
            and <a href="/packages/observables/observable">Observable</a> guides.
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
