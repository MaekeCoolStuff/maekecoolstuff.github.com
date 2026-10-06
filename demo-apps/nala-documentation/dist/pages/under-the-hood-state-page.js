import { defineComponent, html, render, repeat } from "../../../../vendor/components/dist/index.js";
import { renderCodeExample } from "./code-example.js";
const tutorialSteps = [
  {
    id: "signal",
    title: "1. Build one writable signal",
    goal: "Store a value, read it, and notify only when it really changes.",
    paragraphs: [
      "A signal is a value cell with a getter and setter. Nala returns them as a readonly tuple, so callers can name them naturally: const [count, setCount] = createSignal(0). Calling count() reads; calling setCount(next) writes.",
      "Internally, BehaviorSubject owns the current value and Subject publishes change notifications. The public getter does not expose either object. The setter compares with Object.is before writing, so equal primitives and the same object reference are no-ops.",
      "Object.is has precise JavaScript behavior: repeated NaN is equal and suppressed, while 0 and -0 are different. Objects and arrays compare by identity, not contents. Mutating an object and setting the same reference therefore produces no notification; return new state objects for real changes."
    ],
    points: [
      "The getter is a function so reading can participate in dependency tracking later.",
      "The change Subject emits void because dependents only need to know that they should rerun.",
      "Separate signal instances remain completely independent."
    ],
    code: `type Signal<T> = readonly [
  get: () => T,
  set: (value: T) => void,
];

function createSignal<T>(initial: T): Signal<T> {
  const value = new BehaviorSubject(initial);
  const changes = new Subject<void>();

  const get = (): T => value.value;
  const set = (next: T): void => {
    if (!Object.is(next, value.value)) {
      value.next(next);
      changes.next();
    }
  };

  return [get, set] as const;
}

const [count, setCount] = createSignal(0);
setCount(1);
console.log(count()); // 1`,
    checkpoint: "Deno: create two signals, change one, and verify their values remain independent. Check repeated values, NaN, object identity, and a new object reference."
  },
  {
    id: "tracker",
    title: "2. Discover dependencies while code runs",
    goal: "Record exactly which signals a computation actually reads.",
    paragraphs: [
      "Reactivity needs to connect a signal read to the effect or computed value currently evaluating. TrackableSignal is the smallest useful contract: given a callback, it can subscribe that callback to future changes.",
      "trackDependencies temporarily installs a Set as the active tracker, runs arbitrary code, then restores the previous tracker in finally. Every signal getter calls trackRead with its stable handle. If tracking is active, the Set records that handle.",
      "The stable handle matters because a Set deduplicates by identity. Reading count() five times during one run creates one dependency subscription. Saving and restoring the previous tracker also allows a tracked computation to read another tracked computation without permanently corrupting outer tracking state."
    ],
    points: [
      "No dependency arrays are supplied by the developer.",
      "Only reads during the latest execution belong to that execution's dependency set.",
      "finally restores tracking even when user code throws."
    ],
    code: `interface TrackableSignal {
  onChange(callback: () => void): () => void;
}

let activeTracker: Set<TrackableSignal> | null = null;

function trackRead(signal: TrackableSignal): void {
  activeTracker?.add(signal);
}

function trackDependencies(run: () => void): Set<TrackableSignal> {
  const previous = activeTracker;
  const dependencies = new Set<TrackableSignal>();
  activeTracker = dependencies;
  try {
    run();
  } finally {
    activeTracker = previous;
  }
  return dependencies;
}

// Add inside createSignal:
const handle = {
  onChange: (callback: () => void) => changes.subscribe(callback),
};
const get = (): T => {
  trackRead(handle);
  return value.value;
};`,
    checkpoint: "Deno: track a function that reads one signal twice and another once. Verify the returned Set contains two stable handles rather than three reads."
  },
  {
    id: "effect",
    title: "3. Rerun side effects when dependencies change",
    goal: "Track reads, subscribe to changes, and clean up each execution.",
    paragraphs: [
      "effect runs immediately. Before every later run, it invokes the previous per-run cleanup and unsubscribes every old dependency. It then tracks the callback again and subscribes run to the new dependency set.",
      "Rebuilding dependencies is what makes conditional effects correct. If the callback reads selectedGame() only while a details panel is open, closing the panel causes the next run to stop subscribing to selectedGame.",
      "The callback may return a cleanup function for resources created in that run. The typeof guard is important because JavaScript callbacks can accidentally return values, such as an array push result. Only a function becomes cleanup. Errors are not swallowed; callback and cleanup failures propagate."
    ],
    points: [
      "Cleanup runs before dependency unsubscription on rerun and dispose.",
      "Once disposed, dependency callbacks cannot run the effect again.",
      "Call the returned disposer once; the implementation does not suppress repeated cleanup calls from repeated dispose()."
    ],
    code: `function effect(callback: EffectCallback): () => void {
  let unsubscribes: Array<() => void> = [];
  let cleanup: Cleanup | void;
  let disposed = false;

  function run(): void {
    if (disposed) return;
    cleanup?.();
    for (const unsubscribe of unsubscribes) unsubscribe();

    const dependencies = trackDependencies(() => {
      const result = callback();
      cleanup = typeof result === "function" ? result : undefined;
    });
    unsubscribes = [...dependencies].map((dependency) =>
      dependency.onChange(run)
    );
  }

  run();
  return () => {
    disposed = true;
    cleanup?.();
    for (const unsubscribe of unsubscribes) unsubscribe();
  };
}`,
    checkpoint: "Deno: verify immediate execution, relevant-only reruns, cleanup before rerun, and final cleanup on disposal. Add a conditional branch and prove old dependencies stop triggering it."
  },
  {
    id: "computed-lazy",
    title: "4. Derive a lazy read-only value",
    goal: "Calculate from signals without storing duplicate source state.",
    paragraphs: [
      "A computed value looks like a callable getter and also offers subscribe. It stores a compute function rather than a writable setter. Calling it records the computed handle as an outer dependency, then evaluates its own function while tracking the signals read inside.",
      "A computed starts uninitialized and performs no work until read or subscribed. While it has no listeners or dependents, each direct read evaluates again. This guarantees freshness without keeping permanent subscriptions alive; unobserved computed values are lazy, not indefinitely memoized.",
      "equals defaults to Object.is. Evaluation always captures the latest dependency set, while the equality result decides whether downstream observers need notification. A custom comparator can suppress equivalent newly-created arrays or objects."
    ],
    points: [
      "Derived state is read-only because no setter exists.",
      "A direct unobserved read computes from current source values.",
      "Equality compares computed results, not their source signals."
    ],
    code: `interface ReadonlySignal<Value> {
  (): Value;
  subscribe(listener: (value: Value) => void): () => void;
}

const [games, setGames] = createSignal<Game[]>([]);
let computeRuns = 0;
const completedCount = computed(() => {
  computeRuns++;
  return games().filter((game) => game.completed).length;
});

console.log(computeRuns); // 0: still lazy
console.log(completedCount()); // 0, computeRuns is 1
setGames([{ id: "g-17", title: "Celeste", completed: true }]);
console.log(completedCount()); // 1, computes from current games`,
    checkpoint: "Deno: prove zero work before first read, fresh unobserved reads after changes, and Object.is/custom equality behavior."
  },
  {
    id: "computed-observed",
    title: "5. Share an observed computed value",
    goal: "Memoize one calculation while listeners or dependents exist.",
    paragraphs: [
      "Observed computed values maintain two sets. listeners come from direct subscribe calls. dependents are effects or other computed values that read this computed while tracking. Either kind keeps dependency subscriptions active.",
      "startObserving binds the latest captured dependencies once. When a source changes, recompute evaluates, rebinds in case branches changed, and notifies listener and dependent snapshots only if equality says the result changed. Multiple subscribers share that one evaluation.",
      "After the final listener and dependent leave, stopObserving releases all dependency subscriptions. A later direct read evaluates from current sources again. This lifetime prevents unused derived values from retaining a reactive graph."
    ],
    points: [
      "subscribe immediately replays the current computed value.",
      "Conditional branches replace old dependencies during evaluation.",
      "Snapshot iteration makes listener removal during notification predictable."
    ],
    code: `const hasObservers = () =>
  listeners.size > 0 || dependents.size > 0;

function recompute(): void {
  if (!evaluate()) return;
  for (const listener of [...listeners]) listener(value);
  for (const dependent of [...dependents]) dependent();
}

const handle: TrackableSignal = {
  onChange(callback) {
    dependents.add(callback);
    startObserving();
    return () => {
      dependents.delete(callback);
      stopObserving();
    };
  },
};

read.subscribe = (listener) => {
  if (!observing || !initialized) evaluate();
  listeners.add(listener);
  startObserving();
  listener(value);
  return () => {
    listeners.delete(listener);
    stopObserving();
  };
};`,
    checkpoint: "Deno: run computed.test.ts to verify replay, equality deduplication, shared calculation, released dependencies, and conditional branch switching."
  },
  {
    id: "store",
    title: "6. Group state with plain-function actions",
    goal: "Give domain writes one explicit home without reducers or dispatch.",
    paragraphs: [
      "createStore wraps one state signal and asks an action factory to return ordinary functions. The factory receives get, set, and update. Actions retain normal parameters, return values, closures, and TypeScript inference.",
      "commit is the single write path. It suppresses the same reference with Object.is, writes the signal, then attempts persistence. update calculates from the latest state. set accepts either replacement state or an updater function and delegates accordingly.",
      "A throwing updater never reaches commit, so state and subscribers remain unchanged. Sequential updates inside one action each read the latest committed state. When State itself is a function, use update(() => nextFunction) because set interprets functions as updaters."
    ],
    points: [
      "Return new objects and arrays; mutating and returning the same reference is a no-op.",
      "subscribe is an effect, so it immediately replays state and tracks later commits.",
      "The listener uses a block body so its return value cannot become effect cleanup."
    ],
    code: `const collection = createStore({
  state: { games: [] as Game[], filter: "all" },
  actions: ({ set, update }) => ({
    addGame: (game: Game) => update((state) => ({
      ...state,
      games: [...state.games, game],
    })),
    clear: () => set({ games: [], filter: "all" }),
    setFilter: (filter: string) => update((state) => ({
      ...state,
      filter,
    })),
  }),
});

const stop = collection.subscribe((state) => {
  renderCollection(state.games);
});
collection.actions.addGame({
  id: "g-17",
  title: "Celeste",
  completed: true,
});
stop();`,
    checkpoint: "Deno: verify immediate subscription replay, sequential updates, updater failure isolation, same-reference suppression, and typed action parameters/returns."
  },
  {
    id: "selectors",
    title: "7. Derive store views with selectors",
    goal: "Keep counts and filtered collections out of writable state.",
    paragraphs: [
      "store.select is a thin composition: computed(() => selector(get()), options). The store getter becomes the dependency, while the selector transforms its state into the value one consumer needs.",
      "Selectors inherit computed laziness, replay, sharing, cleanup, and equality. A selector returning a new array on every run needs a domain comparator when unrelated store changes should not notify its listeners.",
      "Pure named selectors remain easy to test without a store. Readonly selector signals can feed another computed value, allowing larger derivations without making intermediate values writable."
    ],
    points: [
      "Store only independent source state.",
      "Apply equals to selector output, not the whole store state.",
      "Transient UI state usually remains local unless it must survive navigation or reload."
    ],
    code: `const completedGames = collection.select(
  (state) => state.games.filter((game) => game.completed),
  {
    equals: (left, right) =>
      left.length === right.length &&
      left.every((game, index) => game.id === right[index].id),
  },
);

const completionLabel = computed(() =>
  completedGames().length + " completed"
);

const stopLabel = completionLabel.subscribe(renderCompletionLabel);`,
    checkpoint: "Deno: change an unrelated store field and verify an equal selected result is suppressed; add a completed game and verify selector/computed subscribers update once."
  },
  {
    id: "persistence-basics",
    title: "8. Persist validated, versioned JSON",
    goal: "Restore state safely from an untrusted storage string.",
    paragraphs: [
      "SyncStorageAdapter keeps createStore independent of localStorage. During store creation, load receives the fresh initial state. Successful hydration happens before the state signal exists, so the first subscriber sees restored state rather than a temporary default.",
      "localStorageAdapter writes an envelope containing version and state. JSON.parse returns unknown data, even when TypeScript knows the intended state type. A required runtime validator must accept it before hydration.",
      "Storage is injected through a three-method KeyValueStorage interface for deterministic Deno tests. In a browser, omitting storage uses globalThis.localStorage. Missing or blocked storage becomes a reported load/save/remove failure rather than breaking valid in-memory state."
    ],
    points: [
      "No stored value or rejected data returns undefined so createStore uses its initial state.",
      "A same-version invalid payload is rejected; migration is not attempted.",
      "localStorage is not secure storage and must not contain secrets."
    ],
    code: `type SavedCollection = { games: Game[] };

function isSavedCollection(value: unknown): value is SavedCollection {
  if (typeof value !== "object" || value === null) return false;
  const games = (value as { games?: unknown }).games;
  return Array.isArray(games) && games.every((game) =>
    typeof game === "object" && game !== null &&
    typeof (game as Game).id === "string" &&
    typeof (game as Game).title === "string" &&
    typeof (game as Game).completed === "boolean"
  );
}

const persistence = localStorageAdapter<
  { games: Game[]; filter: string },
  SavedCollection
>({
  key: "game-shelf.collection",
  version: 1,
  validate: isSavedCollection,
  select: (state) => ({ games: state.games }),
  hydrate: (initial, persisted) => ({ ...initial, ...persisted }),
});`,
    checkpoint: "Deno: inject MemoryStorage containing a valid envelope. Verify load keeps the fresh filter, save writes only games, and remove deletes the key."
  },
  {
    id: "migration-failures",
    title: "9. Migrate deliberately and isolate failures",
    goal: "Handle schema changes, legacy values, and storage errors predictably.",
    paragraphs: [
      "When an envelope version differs, load calls migrate with its state and stored version. Data without an envelope is treated as legacy version 0. Migration is opt-in: without a migration result, old data is discarded. A returned migration still must pass the current validator.",
      "select chooses a durable subset and hydrate merges it into current initial state. This keeps transient fields and new defaults out of old storage. Defaults are identity functions when the entire runtime state is durable.",
      "Every adapter operation catches failures and reports its operation through onError. The reporter itself is protected so diagnostic code cannot make persistence fatal. Saving validates selected state and uses a JSON replacer that rejects functions and symbols instead of silently omitting them."
    ],
    points: [
      "Corrupt JSON, migration errors, validation failures, cyclic values, and unavailable storage fall back safely.",
      "Persistence failure never rolls back a state commit already accepted in memory.",
      "remove is optional at the generic store boundary but implemented by localStorageAdapter."
    ],
    code: `const persistence = localStorageAdapter<AppState, SavedCollection>({
  key: "game-shelf.collection",
  version: 2,
  validate: isSavedCollection,
  migrate: (value, storedVersion) => {
    if (storedVersion !== 1 || !isVersionOneCollection(value)) {
      return undefined;
    }
    return {
      games: value.games.map((game) => ({
        ...game,
        completed: game.status === "completed",
      })),
    };
  },
  select: (state) => ({ games: state.games }),
  hydrate: (initial, persisted) => ({ ...initial, ...persisted }),
  onError: (error, operation) => {
    console.error("Collection persistence failed", operation, error);
  },
});`,
    checkpoint: "Deno: test version mismatch with and without migration, unversioned legacy data, corrupt JSON, invalid migrated data, blocked storage, a throwing reporter, and function/symbol rejection."
  },
  {
    id: "boundary-tests",
    title: "10. Publish one small API and read tests as promises",
    goal: "Expose supported contracts while keeping tracking internals private.",
    paragraphs: [
      "index.ts exports the runtime constructors and helpers applications use, plus type-only contracts. TrackableSignal, trackRead, and trackDependencies remain internal because they coordinate package implementation rather than form an application API.",
      "The five test files progress through the same layers as this chapter. Signal tests establish value cells. Effect and computed tests establish dependency lifetimes. Store tests establish write and selector contracts. Local storage tests establish versioning and failure isolation.",
      "Every source and test file appears in the live archive below. The todo app remains the realistic integration proof for immutable actions, persisted subsets, migrations, and selectors."
    ],
    points: [
      "All state algorithms run in Deno without a DOM.",
      "Browser localStorage is the only default platform boundary and can be injected.",
      "Components explicitly subscribe and render today; automatic binding is not implemented."
    ],
    code: `export { createSignal } from "./signal.js";
export { computed } from "./computed.js";
export { effect } from "./effect.js";
export { createStore } from "./store.js";
export { localStorageAdapter } from "./local-storage.js";

// Type contracts use export type so they disappear from JavaScript.
export type { Signal } from "./signal.js";
export type { ComputedOptions, ReadonlySignal } from "./computed.js";
export type { Cleanup, EffectCallback } from "./effect.js";`,
    checkpoint: "Deno: run all five state test files. Then inspect todo-store.ts to see the same primitives composed into one complete Game Shelf-style application store."
  }
];
const sourceFiles = [
  {
    path: "vendor/state/src/internal/tracker.ts",
    role: "Active dependency capture and nested tracker restoration.",
    test: false
  },
  {
    path: "vendor/state/src/signal.ts",
    role: "Writable signal value, equality, and stable tracking handle.",
    test: false
  },
  {
    path: "vendor/state/src/effect.ts",
    role: "Immediate tracked side effects and per-run cleanup.",
    test: false
  },
  {
    path: "vendor/state/src/computed.ts",
    role: "Lazy and observed derived values with dynamic dependencies.",
    test: false
  },
  {
    path: "vendor/state/src/store.ts",
    role: "Plain-function actions, immutable commits, subscriptions, and selectors.",
    test: false
  },
  {
    path: "vendor/state/src/local-storage.ts",
    role: "Validated versioned persistence, migration, and failure isolation.",
    test: false
  },
  {
    path: "vendor/state/src/index.ts",
    role: "Supported public package exports.",
    test: false
  },
  {
    path: "vendor/state/src/signal.test.ts",
    role: "Signal value and independence promises.",
    test: true
  },
  {
    path: "vendor/state/src/effect.test.ts",
    role: "Immediate execution, dependency, and cleanup promises.",
    test: true
  },
  {
    path: "vendor/state/src/computed.test.ts",
    role: "Laziness, replay, sharing, equality, and branch promises.",
    test: true
  },
  {
    path: "vendor/state/src/store.test.ts",
    role: "Actions, writes, persistence, subscriptions, and selector promises.",
    test: true
  },
  {
    path: "vendor/state/src/local-storage.test.ts",
    role: "Storage envelope, projection, migration, and failure promises.",
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
      All state behavior is deterministic in Deno. Persistence tests inject an
      in-memory Storage implementation instead of depending on browser globals.
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
function stateOutput(event) {
  return event.currentTarget.closest("[data-live-example]").querySelector("[data-live-output]");
}
function renderStateLiveExample(id) {
  switch(id){
    case "signal":
      {
        let value = 0;
        let writes = 0;
        return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · equality-protected signal</p>
          <div style="display:flex;align-items:center;gap:.75rem;margin:.75rem 0">
            <strong data-value style="font-size:1.8rem;color:#184d3b">0</strong>
            <span data-writes>notifications: 0</span>
          </div>
          <button @click=${(event)=>{
          value++;
          writes++;
          const root = event.currentTarget.closest("[data-live-example]");
          root.querySelector("[data-value]").textContent = String(value);
          root.querySelector("[data-writes]").textContent = `notifications: ${writes}`;
          stateOutput(event).textContent = "new value: notification sent";
        }}>set next value</button>
          <button @click=${(event)=>{
          stateOutput(event).textContent = "same value: Object.is suppressed notification";
        }}>set same value</button>
          <output data-live-output aria-live="polite">Signal starts at 0.</output>
        </div>
      `;
      }
    case "tracker":
      {
        let reads = 0;
        let conditional = true;
        return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · dependency capture</p>
          <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin:.75rem 0">
            <span data-dependency
              style="padding:.6rem;background:#d9e9ed">dependencies: count</span>
            <span
              style="padding:.6rem;background:#f2f0e8">reads: <strong data-reads>0</strong></span>
          </div>
          <button @click=${(event)=>{
          reads++;
          event.currentTarget.closest("[data-live-example]").querySelector("[data-reads]").textContent = String(reads);
          stateOutput(event).textContent = "tracked function ran and recorded stable handles";
        }}>run tracked read</button>
          <button @click=${(event)=>{
          conditional = !conditional;
          event.currentTarget.closest("[data-live-example]").querySelector("[data-dependency]").textContent = conditional ? "dependencies: count" : "dependencies: none";
          stateOutput(event).textContent = conditional ? "latest run reads count" : "latest run reads no signal";
        }}>toggle branch</button>
          <output data-live-output aria-live="polite">No tracked run yet.</output>
        </div>
      `;
      }
    case "effect":
      {
        let active = true;
        let runs = 0;
        return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · effect lifecycle</p>
          <div style="display:flex;align-items:center;gap:.6rem;margin:.75rem 0">
            <span data-lamp
              style="width:1.2rem;height:1.2rem;border-radius:50%;background:#184d3b;display:inline-block"></span>
            <span data-effect-state>effect active</span>
            <span>runs: <strong data-runs>0</strong></span>
          </div>
          <button @click=${(event)=>{
          if (active) {
            runs++;
            const root = event.currentTarget.closest("[data-live-example]");
            root.querySelector("[data-runs]").textContent = String(runs);
            stateOutput(event).textContent = "dependency changed: cleanup → rerun";
          } else {
            stateOutput(event).textContent = "disposed effect ignored the change";
          }
        }}>change dependency</button>
          <button @click=${(event)=>{
          active = !active;
          const root = event.currentTarget.closest("[data-live-example]");
          root.querySelector("[data-lamp]").setAttribute("style", `width:1.2rem;height:1.2rem;border-radius:50%;background:${active ? "#184d3b" : "#a43f35"};display:inline-block`);
          root.querySelector("[data-effect-state]").textContent = active ? "effect active" : "disposed; cleanup ran";
          stateOutput(event).textContent = active ? "effect subscribed again" : "cleanup released the resource";
        }}>dispose / recreate</button>
          <output data-live-output
            aria-live="polite">Effect ran immediately once.</output>
        </div>
      `;
      }
    case "computed-lazy":
      return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · lazy computed value</p>
          <div
            style="display:flex;gap:1rem;margin:.75rem 0"><strong data-result>not read</strong><span>compute runs: <strong data-runs>0</strong></span></div>
          <button @click=${(event)=>{
        const root = event.currentTarget.closest("[data-live-example]");
        root.querySelector("[data-result]").textContent = "completed: 2";
        root.querySelector("[data-runs]").textContent = "1";
        stateOutput(event).textContent = "first read performed the calculation";
      }}>read computed()</button>
          <button @click=${(event)=>{
        stateOutput(event).textContent = "source changed; no observed computed work yet";
      }}>change source</button>
          <output data-live-output aria-live="polite">No calculation has run.</output>
        </div>
      `;
    case "computed-observed":
      {
        let observed = false;
        let value = 0;
        return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · shared observed computed</p>
          <div
            style="display:flex;gap:.5rem;flex-wrap:wrap;margin:.75rem 0"><span data-listener-a style="padding:.6rem;border:1px solid #315f70">A: not subscribed</span><span data-listener-b style="padding:.6rem;border:1px solid #7b3f58">B: not subscribed</span></div>
          <button @click=${(event)=>{
          observed = !observed;
          const root = event.currentTarget.closest("[data-live-example]");
          root.querySelector("[data-listener-a]").textContent = observed ? "A: subscribed" : "A: unsubscribed";
          root.querySelector("[data-listener-b]").textContent = observed ? "B: subscribed" : "B: unsubscribed";
          stateOutput(event).textContent = observed ? "one shared calculation is now observed" : "dependencies released after final unsubscribe";
        }}>subscribe / unsubscribe</button>
          <button @click=${(event)=>{
          value++;
          stateOutput(event).textContent = observed ? `source changed: shared value ${value}` : "source changed: unobserved computed stays lazy";
        }}>change source</button>
          <output data-live-output
            aria-live="polite">No listeners are observing.</output>
        </div>
      `;
      }
    case "store":
      {
        let games = 0;
        return html`
        <div class="layout-demo" data-live-example=${id}>
          <p
            class="layout-demo-label">Live example · store actions and immutable commits</p>
          <div
            style="padding:.8rem;border:1px solid #cbcfc8;background:#f2f0e8;margin:.75rem 0">games: <strong data-games>0</strong> · action: <span data-action>none</span></div>
          <button @click=${(event)=>{
          games++;
          const root = event.currentTarget.closest("[data-live-example]");
          root.querySelector("[data-games]").textContent = String(games);
          root.querySelector("[data-action]").textContent = "addGame";
          stateOutput(event).textContent = "update(state => newState) committed";
        }}>add game</button>
          <button @click=${(event)=>{
          games = 0;
          const root = event.currentTarget.closest("[data-live-example]");
          root.querySelector("[data-games]").textContent = "0";
          root.querySelector("[data-action]").textContent = "clear";
          stateOutput(event).textContent = "set(replacementState) committed";
        }}>clear</button>
          <output data-live-output
            aria-live="polite">Subscribe receives the initial state immediately.</output>
        </div>
      `;
      }
    case "selectors":
      {
        let completed = 0;
        return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · derived selector view</p>
          <div
            style="display:flex;align-items:center;gap:.75rem;margin:.75rem 0"><span style="height:.8rem;flex:1;background:#f2f0e8;border-radius:99px;overflow:hidden"><span data-bar style="display:block;height:100%;width:0%;background:#184d3b"></span></span><strong data-label>0 completed</strong></div>
          <button @click=${(event)=>{
          completed++;
          const root = event.currentTarget.closest("[data-live-example]");
          root.querySelector("[data-label]").textContent = `${completed} completed`;
          root.querySelector("[data-bar]").setAttribute("style", `display:block;height:100%;width:${completed * 25}%;background:#184d3b`);
          stateOutput(event).textContent = "selector changed; computed label updated";
        }}>complete a game</button>
          <button @click=${(event)=>{
          stateOutput(event).textContent = "unrelated filter changed; equal selector result suppressed";
        }}>change filter</button>
          <output data-live-output
            aria-live="polite">Selector has not emitted yet.</output>
        </div>
      `;
      }
    case "persistence-basics":
      {
        let saved = false;
        return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · versioned storage envelope</p>
          <div
            style="display:flex;align-items:center;gap:.5rem;margin:.75rem 0"><span data-storage style="padding:.7rem;border:1px solid #cbcfc8;background:#f2f0e8">storage: empty</span><span aria-hidden="true">⇄</span><span style="padding:.7rem;border:1px solid #315f70">in-memory state</span></div>
          <button @click=${(event)=>{
          saved = true;
          const root = event.currentTarget.closest("[data-live-example]");
          root.querySelector("[data-storage]").textContent = "storage: { version: 1, state: { games: [...] } }";
          stateOutput(event).textContent = "save selected only durable games";
        }}>save subset</button>
          <button @click=${(event)=>{
          stateOutput(event).textContent = saved ? "load validated envelope; fresh filter preserved" : "no stored value; initial state used";
        }}>load</button>
          <output data-live-output aria-live="polite">No storage operation yet.</output>
        </div>
      `;
      }
    case "migration-failures":
      {
        let choice = "legacy";
        return html`
        <div class="layout-demo" data-live-example=${id}>
          <p
            class="layout-demo-label">Live example · validation and migration outcomes</p>
          <label>stored payload <select @change=${(event)=>{
          choice = event.currentTarget.value;
        }}><option value="legacy">legacy v0</option><option value="valid">valid v1</option><option value="corrupt">corrupt JSON</option></select></label>
          <button @click=${(event)=>{
          stateOutput(event).textContent = choice === "legacy" ? "migrate(v0) → validate → hydrate" : choice === "valid" ? "same version → validate → hydrate" : "parse failed → report error → keep memory state";
        }}>load payload</button>
          <output data-live-output
            aria-live="polite">Choose a payload to inspect its safe path.</output>
        </div>
      `;
      }
    case "boundary-tests":
      return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · public API boundary</p>
          <div
            style="display:flex;gap:.5rem;flex-wrap:wrap;margin:.75rem 0"><span style="padding:.6rem;background:#d9e9ed">createSignal</span><span style="padding:.6rem;background:#eedde4">computed</span><span style="padding:.6rem;background:#f2f0e8">createStore</span><span style="padding:.6rem;background:#edf5f0">localStorageAdapter</span></div>
          <button @click=${(event)=>{
        stateOutput(event).textContent = "10/10 state contracts checked; tracking internals remain private";
      }}>run contract checklist</button>
          <output data-live-output
            aria-live="polite">Press to inspect the supported boundary.</output>
        </div>
      `;
    default:
      return html``;
  }
}
defineComponent("docs-under-the-hood-state-page", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Under the Hood · vendor/state</p>
        <h1>Build state from tracked reads</h1>
        <p class="page-lead">
          Start with one value cell, discover dependencies while code runs, then
          layer effects, computed values, stores, selectors, and validated
          persistence until the result is Nala's exact State package.
        </p>

        <nala-callout tone="info">
          <span slot="title">Source state first, derived state second</span>
          Store independent facts such as games and filters. Calculate counts,
          visible collections, labels, and percentages with selectors or computed
          values so there is only one source of truth.
        </nala-callout>

        <h2>The dependency chain</h2>
        <ol>
          <li>A signal exposes a tracked getter and equality-protected setter.</li>
          <li>The tracker records getters read during an effect or computation.</li>
          <li>Effects own side effects and per-run cleanup.</li>
          <li>Computed values derive lazy, read-only state.</li>
          <li>Stores group one signal with named domain actions and selectors.</li>
          <li>A validated adapter persists a deliberate versioned subset.</li>
        </ol>
        <p>
          Game, AppState, validation helpers, and render functions in examples
          belong to the surrounding Game Shelf application. State supplies the
          reactive and persistence mechanics, not the application's domain model.
        </p>

        <nav class="component-doc-nav" aria-label="State tutorial chapters">
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
              ${renderStateLiveExample(step.id)}
              <nala-callout tone="success">
                <span slot="title">Working checkpoint</span>
                ${step.checkpoint}
              </nala-callout>
            </section>
          `)}

        <section id="exact-source">
          <h2>11. Reach the exact repository implementation</h2>
          <p>
            The source below is loaded directly from this checkout. Every current
            implementation, internal tracker, public export, and test line is
            present, so the final comparison cannot drift from the package.
          </p>
          <div data-source-archive>
            <p role="status">Loading the exact state source...</p>
          </div>
        </section>

        <section>
          <h2>Where State deliberately stops</h2>
          <p>
            This package has no mutable draft proxy, reducer dispatcher, deep
            equality, asynchronous storage protocol, server synchronization,
            schema library, or automatic component binding. It keeps writes,
            tracked reads, derivation, and synchronous persistence explicit.
          </p>
          <p>
            Continue with the concise
            <a href="/packages/state">State reference</a> when you need API
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
