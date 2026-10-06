import { defineComponent, html, repeat } from "../../../../vendor/components/dist/index.js";
import { renderCodeExample } from "./code-example.js";
export const packageReferences = [
  {
    slug: "observables",
    name: "Observables",
    kind: "Core package",
    sourceLines: 109,
    summary: "Small synchronous streams for publishing, replaying, and transforming values.",
    description: "A dependency-free observable core: hot multicast subjects, a replaying BehaviorSubject, and cold lazy Observable pipelines. Emissions are synchronous; this package intentionally has no schedulers or broad operator catalog.",
    importPath: "vendor/observables/src/index.ts",
    quickStart: `import { BehaviorSubject, Observable, Subject } from "../../vendor/observables/dist/index.js";

const theme = new BehaviorSubject("light");
const stop = theme.subscribe((value) => console.log(value)); // immediately: light
theme.next("dark");
stop();

const clicks = new Subject<number>();
const doubled = new Observable<number>((observer) => {
  const unsubscribe = clicks.subscribe(observer);
  return unsubscribe;
}).map((count) => count * 2).filter((count) => count > 2);`,
    sections: [
      {
        title: "Exports and observer contracts",
        description: "Subscribe methods return an unsubscribe function. Observer callbacks receive values synchronously and do not return a value.",
        rows: [
          [
            "Observer<T>",
            "(value: T) => void",
            "Callback type accepted by Subject, BehaviorSubject, and Observable."
          ],
          [
            "Unsubscribe",
            "() => void",
            "Disposes one subscription; safe to call more than once."
          ],
          [
            "Subject<T>",
            "new Subject<T>()",
            "Hot multicast stream. Values sent before subscription are not buffered."
          ],
          [
            "Subject.subscribe(observer)",
            "(observer: Observer<T>) => Unsubscribe",
            "Adds an observer unless the subject is complete; returns its removal function."
          ],
          [
            "Subject.next(value)",
            "(value: T) => void",
            "Synchronously sends a value to a snapshot of current observers. No-op after complete()."
          ],
          [
            "Subject.complete()",
            "() => void",
            "Marks the subject complete and removes all observers. There is no completion callback."
          ],
          [
            "Subject.completed",
            "get: boolean",
            "True after complete() has been called."
          ],
          [
            "BehaviorSubject<T>",
            "new BehaviorSubject<T>(initialValue)",
            "Subject that stores the latest value and immediately replays it to each new subscriber."
          ],
          [
            "BehaviorSubject.value",
            "get: T",
            "Reads the current value synchronously."
          ],
          [
            "BehaviorSubject.next(value)",
            "(value: T) => void",
            "Stores the new value, then synchronously broadcasts it."
          ],
          [
            "BehaviorSubject.subscribe(observer)",
            "(observer: Observer<T>) => Unsubscribe",
            "Subscribes and immediately calls observer with the current value."
          ],
          [
            "Observable<T>",
            "new Observable<T>((observer: Observer<T>) => Unsubscribe | void)",
            "Cold stream. Producer runs once per subscription, not when the Observable is constructed."
          ],
          [
            "Observable.subscribe(observer)",
            "(observer: Observer<T>) => Unsubscribe",
            "Runs the producer and returns its cleanup, or a no-op disposer when producer returns nothing."
          ],
          [
            "Observable.map<R>(project)",
            "(value: T) => R -> Observable<R>",
            "Creates a lazy stream that projects every source value."
          ],
          [
            "Observable.filter(predicate)",
            "(value: T) => boolean -> Observable<T>",
            "Creates a lazy stream that forwards only values accepted by the predicate."
          ]
        ]
      }
    ],
    examples: [
      {
        title: "Own and release subscriptions",
        code: `const messages = new Subject<string>();
const stop = messages.subscribe((message) => renderMessage(message));

messages.next("Saved");
stop(); // this listener no longer receives values
messages.complete(); // releases every remaining observer`
      },
      {
        title: "Adapt a callback source",
        code: `const resize$ = new Observable<UIEvent>((observer) => {
  const listener = (event: UIEvent) => observer(event);
  window.addEventListener("resize", listener);
  return () => window.removeEventListener("resize", listener);
});

const stop = resize$.subscribe(() => updateLayout());`
      }
    ],
    notes: [
      "Subject and BehaviorSubject are hot: subscribers share one producer and only receive values emitted while subscribed. Observable is cold: each subscribe() invokes its producer independently.",
      "Callbacks run synchronously in subscription order. An observer exception is not converted to an error notification; handle failures in the observer or producer.",
      "complete() does not call a completion handler because the Observer contract is only a value callback."
    ],
    related: [
      {
        label: "Under the Hood: build the observables package",
        href: "/under-the-hood/observables"
      },
      {
        label: "Subject: synchronous event streams",
        href: "/packages/observables/subject"
      },
      {
        label: "BehaviorSubject: current values and replay",
        href: "/packages/observables/behavior-subject"
      },
      {
        label: "Observable: cold producers and teardown",
        href: "/packages/observables/observable"
      }
    ]
  },
  {
    slug: "state",
    name: "State",
    kind: "Core package",
    sourceLines: 411,
    summary: "Fine-grained signals, lazy derived values, effects, stores, and versioned persistence.",
    description: "We will build Game Shelf's collection state one layer at a time: signals hold source values, computed values derive what a screen needs, effects connect changes to outside work, and a store gives game actions one explicit home. Persistence comes last, after deciding which collection data is safe and useful to restore.",
    importPath: "vendor/state/src/index.ts",
    context: "The examples below continue from this Game Shelf model: Game is the app's domain type, and games is the saved collection. Helpers such as renderBacklog are app-owned view code; vendor/state supplies the value tracking, store actions, and persistence adapter.",
    quickStart: `import { computed, createSignal, effect } from "../../vendor/state/dist/index.js";

type Game = { id: string; title: string; status: "backlog" | "playing" | "completed" };
const [games, setGames] = createSignal<Game[]>([]);
const completedCount = computed(() =>
  games().filter((game) => game.status === "completed").length
);
const stopLogging = effect(() => console.log("Completed:", completedCount()));

setGames([{ id: "g-17", title: "Celeste", status: "completed" }]);
stopLogging();`,
    sections: [
      {
        title: "Signals and effects",
        description: "Reads track dependencies dynamically. Writes use Object.is; unchanged values do not trigger downstream work.",
        rows: [
          [
            "Signal<T>",
            "readonly [get: () => T, set: (value: T) => void]",
            "Tuple returned by createSignal; getter is callable and setter accepts a value."
          ],
          [
            "createSignal<T>(initial)",
            "(initial: T) => Signal<T>",
            "Creates a writable signal. set(next) notifies only when !Object.is(next, current)."
          ],
          [
            "ReadonlySignal<T>",
            "(() => T) & { subscribe(listener): () => void }",
            "Callable read-only value returned by computed and store.select."
          ],
          [
            "computed<T>(compute, options?)",
            "(() => T) => ReadonlySignal<T>",
            "Lazily calculates a value. While observed, dependencies are tracked and one memoized calculation is shared; final unsubscribe releases them."
          ],
          [
            "ComputedOptions<T>.equals",
            "(left: T, right: T) => boolean",
            "Optional equality function; Object.is is the default. Equal results do not notify subscribers."
          ],
          [
            "ReadonlySignal.subscribe(listener)",
            "(value: T) => void -> () => void",
            "Calls listener immediately with the current value, then for changed values."
          ],
          [
            "Cleanup",
            "() => void",
            "Per-run cleanup returned by an effect callback."
          ],
          [
            "EffectCallback",
            "() => void | Cleanup",
            "Runs immediately, tracks signals read during that run, and may return cleanup."
          ],
          [
            "effect(callback)",
            "(callback: EffectCallback) => () => void",
            "Reruns when a tracked dependency changes. Previous cleanup runs before rerun; dispose stops tracking and runs the last cleanup."
          ]
        ],
        lessons: [
          {
            title: "Start with source state: the games themselves",
            explanation: "A signal is a small value cell. Reading it with games() returns the current array; setGames(next) replaces that value. The setter compares references with Object.is, so it does not notify when given the exact same array object.",
            code: `type Game = {
  id: string;
  title: string;
  status: "backlog" | "playing" | "completed";
};

const [games, setGames] = createSignal<Game[]>([]);
setGames([{ id: "g-17", title: "Celeste", status: "playing" }]);`
          },
          {
            title: "Derive counts instead of storing duplicates",
            explanation: "completedCount is not another piece of state to keep synchronized. computed runs its function, notices that it read games(), and recalculates when that source changes. Calling the computed value reads the result; you cannot set it.",
            code: `const completedCount = computed(() =>
  games().filter((game) => game.status === "completed").length
);

console.log(completedCount()); // 0`
          },
          {
            title: "An effect connects reactive state to an outside system",
            explanation: "effect runs immediately, tracks the signals read during that run, and runs again when one changes. Use it for a side effect such as updating a document title or logging; use computed for a value you want to read elsewhere.",
            code: `const stopTitleEffect = effect(() => {
  document.title = "Game Shelf - " + completedCount() + " completed";
});

setGames([{ id: "g-17", title: "Celeste", status: "completed" }]);
stopTitleEffect(); // runs its final cleanup and stops tracking`
          }
        ]
      },
      {
        title: "Stores and selectors",
        description: "Store actions receive explicit get/set/update functions. State commits are immutable and protected by Object.is.",
        rows: [
          [
            "createStore<State, Actions>(config)",
            "{ state, actions, persist?, } -> Store<State, Actions>",
            "Hydrates optional persistence before the first subscriber notification, then builds actions from the action context."
          ],
          [
            "Store<State, Actions>.state",
            "() => State",
            "Readonly getter for the current state."
          ],
          [
            "Store<State, Actions>.actions",
            "Actions",
            "Plain functions created by config.actions(context)."
          ],
          [
            "Store.subscribe(listener)",
            "(state: State) => void -> () => void",
            "Calls immediately with current state and after each committed state change."
          ],
          [
            "Store.select(selector, options?)",
            "(state: State) => Value -> ReadonlySignal<Value>",
            "Creates a lazy read-only derived signal. Supports the same optional equals comparator as computed."
          ],
          [
            "StoreActionContext<State>.get()",
            "() => State",
            "Reads the latest state inside an action."
          ],
          [
            "StoreActionContext<State>.set(update)",
            "State | StateUpdater<State> -> void",
            "Sets replacement state or applies an updater to the latest state."
          ],
          [
            "StoreActionContext<State>.update(updater)",
            "(previous: State) => State -> void",
            "Explicit read-modify-write operation; preferred when next state depends on previous state."
          ],
          [
            "StateUpdater<State>",
            "(previous: State) => State",
            "Function that calculates replacement state."
          ],
          [
            "StateUpdate<State>",
            "State | StateUpdater<State>",
            "Accepted by StoreActionContext.set."
          ],
          [
            "SelectorOptions<Value>.equals",
            "(left: Value, right: Value) => boolean",
            "Optional comparator for derived values; defaults to Object.is."
          ],
          [
            "SyncStorageAdapter<State>",
            "load(initial): State | undefined; save(state); remove?()",
            "Synchronous adapter contract accepted by createStore.persist."
          ]
        ],
        lessons: [
          {
            title: "Give game changes named actions",
            explanation: "A store groups source state with plain functions that describe allowed changes. update receives the latest state and returns a new object; it does not mutate the old object. This makes the write path easy to locate and test.",
            code: `const collection = createStore({
  state: { games: [] as Game[] },
  actions: ({ update }) => ({
    addGame: (game: Game) => update((state) => ({
      ...state,
      games: [...state.games, game],
    })),
    markPlayed: (id: string) => update((state) => ({
      ...state,
      games: state.games.map((game) =>
        game.id === id ? { ...game, status: "playing" as const } : game
      ),
    })),
  }),
});`
          },
          {
            title: "Derive a backlog view with a selector",
            explanation: "select describes a read-only projection of store state. Its result behaves like a computed signal: read it with (), subscribe to updates, and optionally provide equals when a newly created array should compare by contents rather than reference.",
            code: `const backlog = collection.select((state) =>
  state.games.filter((game) => game.status === "backlog")
);

const stopBacklogView = backlog.subscribe((games) => renderBacklog(games));
collection.actions.addGame({ id: "g-18", title: "Tunic", status: "backlog" });
stopBacklogView();`
          },
          {
            title: "Keep temporary controls out of the collection store",
            explanation: "The store should contain domain state such as saved games. A search field's current text is usually local screen state; keeping it separate avoids making unrelated views and persistence react to every keystroke.",
            code: `const [searchText, setSearchText] = createSignal("");
const visibleGames = computed(() => {
  const query = searchText().trim().toLowerCase();
  return collection.state().games.filter((game) =>
    game.title.toLowerCase().includes(query)
  );
});`
          }
        ]
      },
      {
        title: "Persistence API and options",
        description: "localStorageAdapter stores a versioned JSON envelope. Validation is required; migrations are opt-in and failures never roll back valid in-memory state.",
        rows: [
          [
            "localStorageAdapter<State, PersistedState>(options)",
            "LocalStorageAdapterOptions -> SyncStorageAdapter<State>",
            "Creates a storage adapter; uses global localStorage unless options.storage is supplied."
          ],
          [
            "LocalStorageAdapterOptions.key",
            "string",
            "Required storage key."
          ],
          [
            "LocalStorageAdapterOptions.version",
            "number",
            "Required schema version written in the envelope."
          ],
          [
            "LocalStorageAdapterOptions.validate(value)",
            "(unknown) => value is PersistedState",
            "Required runtime validator for loaded and selected data."
          ],
          [
            "LocalStorageAdapterOptions.migrate(value, storedVersion)",
            "(unknown, number) => PersistedState | undefined",
            "Optional migration for mismatched versions or legacy values. Return undefined to reject persisted data."
          ],
          [
            "LocalStorageAdapterOptions.select(state)",
            "(State) => PersistedState",
            "Optional projection for persisting only a subset of runtime state."
          ],
          [
            "LocalStorageAdapterOptions.hydrate(initial, persisted)",
            "(State, PersistedState) => State",
            "Optional merge of validated persisted subset into current initial state."
          ],
          [
            "LocalStorageAdapterOptions.storage",
            "KeyValueStorage",
            "Optional storage implementation for tests or alternate synchronous storage."
          ],
          [
            "LocalStorageAdapterOptions.onError(error, operation)",
            "(unknown, PersistenceOperation) => void",
            "Optional diagnostics callback for load, save, and remove failures. Errors thrown by this callback are swallowed."
          ],
          [
            "KeyValueStorage",
            "getItem / setItem / removeItem",
            "Minimal synchronous storage interface compatible with localStorage."
          ],
          [
            "PersistenceOperation",
            '"load" | "save" | "remove"',
            "Operation name passed to onError."
          ]
        ],
        lessons: [
          {
            title: "Persist a deliberate subset of the collection",
            explanation: "localStorageAdapter writes a versioned JSON envelope. validate is required because stored text is untrusted input. select decides what to save, and hydrate merges the saved subset into the fresh initial state so transient UI values can keep their defaults.",
            code: `type Game = {
  id: string;
  title: string;
  status: "backlog" | "playing" | "completed";
};

function isSavedGames(value: unknown): value is { games: Game[] } {
  if (typeof value !== "object" || value === null ||
    !Array.isArray((value as { games?: unknown }).games)) return false;
  return (value as { games: unknown[] }).games.every((game) =>
    typeof game === "object" && game !== null &&
    typeof (game as Game).id === "string" &&
    typeof (game as Game).title === "string" &&
    ["backlog", "playing", "completed"].includes((game as Game).status)
  );
}

const persistence = localStorageAdapter<
  { games: Game[]; searchText: string },
  { games: Game[] }
>({
  key: "game-shelf.collection",
  version: 1,
  validate: isSavedGames,
  select: (state) => ({ games: state.games }),
  hydrate: (initial, saved) => ({ ...initial, ...saved }),
});`
          },
          {
            title: "Migrate when the saved shape changes",
            explanation: "A version mismatch is not guessed at. This is the migrate option inside LocalStorageAdapterOptions: it receives the old value and version; return a valid new shape or undefined to reject it and start from initial state. isOldCollection is an app-owned guard for the previous schema.",
            code: `migrate: (value, oldVersion) => {
  if (oldVersion === 1 && isOldCollection(value)) {
    return { games: value.items };
  }
  return undefined;
},`
          },
          {
            title: "A storage failure does not erase an in-memory action",
            explanation: "The store commits its new state before attempting save. If localStorage is unavailable or full, Game Shelf keeps working for this session; onError is the place to report the persistence problem.",
            code: `const persistence = localStorageAdapter({
  key: "game-shelf.collection",
  version: 1,
  validate: isSavedGames,
  onError: (error, operation) => {
    console.warn("Could not persist Game Shelf", operation, error);
  },
});`
          }
        ]
      }
    ],
    examples: [
      {
        title: "Store with actions and a derived selector",
        explanation: "Game Shelf actions own writes, while selectors derive views. The selector subscription receives its initial value immediately and is explicitly stopped when the view goes away.",
        code: `import { createStore } from "../../vendor/state/dist/index.js";

const collection = createStore({
  state: { games: [] as Game[] },
  actions: ({ update, set }) => ({
    addGame: (game: Game) => update((state) => ({
      ...state,
      games: [...state.games, game],
    })),
    clearCollection: () => set({ games: [] }),
  }),
});

const backlog = collection.select((state) =>
  state.games.filter((game) => game.status === "backlog")
);
const stop = backlog.subscribe((games) => renderBacklog(games));
collection.actions.addGame({ id: "g-18", title: "Tunic", status: "backlog" });
stop();`
      },
      {
        title: "Persist saved games, not the open search field",
        explanation: "The persisted projection contains collection records only. searchText is temporary UI state and comes back as its initial empty string after reload.",
        code: `const collection = createStore({
  state: { games: [] as Game[], searchText: "" },
  persist: localStorageAdapter({
    key: "game-shelf.collection",
    version: 1,
    validate: isSavedGames, // guard defined in the persistence lesson above
    select: (state) => ({ games: state.games }),
    hydrate: (initial, stored) => ({ ...initial, ...stored }),
  }),
  actions: ({ update }) => ({
    addGame: (game: Game) => update((state) => ({
      ...state,
      games: [...state.games, game],
    })),
  }),
});`
      }
    ],
    notes: [
      "In the examples, Game and renderBacklog are app-owned domain/view code; vendor/state provides the reactive primitives and store mechanics, not a game model or renderer.",
      "Store updates are immutable. Return a new object/array when changing nested data; returning the same reference is a no-op. Nala does not deep-compare or provide mutable drafts.",
      "Use set for replacement state and update for read-modify-write. If State itself is a function, use update(() => nextFunction) to avoid set interpreting the function as an updater.",
      "Keep transient UI state and derived values out of persistence. localStorage is not secure storage; do not persist secrets.",
      "JSON persistence rejects functions and symbols instead of silently omitting them. Storage and validation failures are reported through onError when configured and never roll back in-memory state.",
      "computed and select are lazy. Without observers they calculate on read; with observers they share tracked dependencies until the last unsubscribe."
    ],
    related: [
      {
        label: "Under the Hood: build the State package",
        href: "/under-the-hood/state"
      }
    ]
  },
  {
    slug: "http",
    name: "HTTP",
    kind: "Core package",
    sourceLines: 184,
    summary: "Typed JSON-first fetch with interceptors, abort/timeout handling, and normalized HTTP errors.",
    description: "We will connect Game Shelf to a game catalogue API. Starting with one GET, we will follow a request through URL construction and interceptors, then see how response parsing, HTTP failures, timeouts, and cancellation behave. HttpClient builds on fetch; it does not validate your game's domain data for you.",
    importPath: "vendor/http/src/index.ts",
    context: "The following snippets build on the quick start's api client and CatalogGame type. Functions such as showGames, showRetryMessage, and getGameShelfSessionHeader belong to the surrounding Game Shelf application; HttpClient only performs the HTTP request and returns or throws its result.",
    quickStart: `import { HttpClient, HttpError } from "../../vendor/http/dist/index.js";

type CatalogGame = { id: string; title: string; platform: string };
const api = new HttpClient({
  baseUrl: "https://games.example.test/api",
  timeoutMs: 5000,
});
const games = await api.get<CatalogGame[]>("/games?q=celeste");

const firstGame = games[0];
if (firstGame) try {
  await api.post("/collection", {
    body: { gameId: firstGame.id, status: "backlog" },
  });
} catch (error) {
  if (error instanceof HttpError) {
    console.error("Could not add game:", error.status, error.body);
  }
}`,
    sections: [
      {
        title: "Client setup and request options",
        description: "Options are per client or per request. Per-request timeoutMs overrides the configured default; signal is an external cancellation signal.",
        rows: [
          [
            "HttpClientConfig.baseUrl",
            'string; default ""',
            "Prepended to each path by string concatenation. Provide separators as needed."
          ],
          [
            "HttpClientConfig.timeoutMs",
            "number; optional",
            "Default timeout for requests. Omit to disable the client-level timeout."
          ],
          [
            "HttpClientConfig.fetch",
            "typeof fetch; default global fetch",
            "Injects a compatible fetch implementation, useful for tests and alternate runtimes."
          ],
          [
            "RequestOptions.body",
            "unknown; optional",
            "When defined, JSON.stringify is applied and content-type defaults to application/json unless already present."
          ],
          [
            "RequestOptions.headers",
            "HeadersInit; optional",
            "Copied into a new Headers instance before request interceptors run."
          ],
          [
            "RequestOptions.signal",
            "AbortSignal; optional",
            "A pre-aborted signal rejects before sending; it is checked again after request interceptors. During fetch the caller reason is preserved and the forwarding listener is removed on settlement."
          ],
          [
            "RequestOptions.timeoutMs",
            "number; optional",
            "Overrides client timeout for this request. A timeout throws HttpTimeoutError."
          ]
        ],
        lessons: [
          {
            title: "Start with one catalogue request",
            explanation: "The generic type tells TypeScript what shape Game Shelf expects, but HttpClient does not inspect the server response at runtime. The path is concatenated to baseUrl, so this example requests /api/games?q=celeste from the configured host.",
            code: `type CatalogGame = {
  id: string;
  title: string;
  platform: string;
};

const api = new HttpClient({
  baseUrl: "https://games.example.test/api",
  timeoutMs: 5000,
});

const results = await api.get<CatalogGame[]>("/games?q=celeste");`
          },
          {
            title: "A body becomes JSON before fetch sees it",
            explanation: "When body is present, the client calls JSON.stringify and adds application/json unless you already supplied a content-type header. Fetch receives the serialized string, not the original object.",
            code: `await api.post("/collection", {
  body: {
    gameId: "g-17",
    status: "backlog",
    note: "Recommended by a friend",
  },
});`
          },
          {
            title: "Choose request options at the right scope",
            explanation: "baseUrl and the default timeout belong to a client shared by the application. Headers, an AbortSignal, or a one-off timeout belong to one request and affect only that call.",
            code: `const controller = new AbortController();

const results = await api.get<CatalogGame[]>("/games?q=celeste", {
  headers: { "x-library-view": "wishlist" },
  signal: controller.signal,
  timeoutMs: 2000,
});`
          },
          {
            title: "Replace fetch when testing the catalogue client",
            explanation: "HttpClientConfig.fetch accepts the platform fetch signature. A test can return a known Response without contacting a server, while production can omit fetch and use globalThis.fetch.",
            code: `const testApi = new HttpClient({
  baseUrl: "https://games.example.test/api",
  fetch: async () => new Response(
    JSON.stringify([{ id: "g-17", title: "Celeste", platform: "Switch" }]),
    { status: 200, headers: { "content-type": "application/json" } },
  ),
});

const games = await testApi.get<CatalogGame[]>("/games");`
          }
        ]
      },
      {
        title: "HttpClient methods and interceptors",
        description: "All request methods return the parsed body as Promise<T>. Interceptors run in registration order.",
        rows: [
          [
            "new HttpClient(config?)",
            "HttpClientConfig -> HttpClient",
            "Creates a client with optional base URL, timeout, and injected fetch."
          ],
          [
            "get<T>(path, options?)",
            "Promise<T>",
            "Sends GET."
          ],
          [
            "post<T>(path, options?)",
            "Promise<T>",
            "Sends POST."
          ],
          [
            "put<T>(path, options?)",
            "Promise<T>",
            "Sends PUT."
          ],
          [
            "patch<T>(path, options?)",
            "Promise<T>",
            "Sends PATCH."
          ],
          [
            "delete<T>(path, options?)",
            "Promise<T>",
            "Sends DELETE."
          ],
          [
            "request<T>(method, path, options?)",
            "Promise<T>",
            "Generic method used by the convenience methods; method is passed to fetch."
          ],
          [
            "useRequestInterceptor(interceptor)",
            "(HttpRequest) => HttpRequest | Promise<HttpRequest>",
            "Registers a request transform before fetch; return the request to continue."
          ],
          [
            "useResponseInterceptor(interceptor)",
            "(Response) => Response | Promise<Response>",
            "Registers a response transform before body parsing and status validation."
          ],
          [
            "HttpRequest",
            "{ url, method, headers, body? }",
            "Mutable request shape provided to request interceptors; body is BodyInit when present."
          ],
          [
            "RequestInterceptor",
            "(request: HttpRequest) => HttpRequest | Promise<HttpRequest>",
            "Public request interceptor type."
          ],
          [
            "ResponseInterceptor",
            "(response: Response) => Response | Promise<Response>",
            "Public response interceptor type."
          ]
        ],
        lessons: [
          {
            title: "Add the Game Shelf session header once",
            explanation: "Request interceptors run in registration order and return the request passed to the next interceptor. This app-owned helper supplies a session header; the HTTP package only applies it to the outgoing request.",
            code: `api.useRequestInterceptor((request) => {
  request.headers.set("authorization", getGameShelfSessionHeader());
  return request;
});`
          },
          {
            title: "Inspect a response before the client parses it",
            explanation: "Response interceptors run after fetch but before content-type parsing and the success check. They must return a Response. After the chain finishes, HttpClient parses the body and then throws HttpError for a non-success status.",
            code: `api.useResponseInterceptor((response) => {
  console.info("Game catalogue status:", response.status);
  return response;
});`
          },
          {
            title: "Validate catalogue data at the app boundary",
            explanation: "get<CatalogGame[]>() is a compile-time promise, not a runtime schema check. If the server returns malformed data, validate it before adding it to the collection store.",
            code: `const rawGames = await api.get<unknown[]>("/games");
const games = rawGames.filter(isCatalogGame); // app-owned type guard`
          }
        ]
      },
      {
        title: "Response and errors",
        description: "The response body is parsed before the success check so HttpError includes the parsed body when available.",
        rows: [
          [
            "JSON response",
            "content-type contains application/json",
            "response.json() is used; malformed JSON resolves to undefined."
          ],
          [
            "Non-JSON response",
            "all other content types",
            "response.text() is used, including an empty string for an empty text response."
          ],
          [
            "HttpError",
            "new HttpError({ status, statusText, url, body })",
            "Thrown for non-2xx responses. Exposes status, statusText, url, and parsed body."
          ],
          [
            "HttpTimeoutError",
            "new HttpTimeoutError(url, timeoutMs)",
            "Thrown when the configured timeout aborts the request. Exposes url and timeoutMs."
          ],
          [
            "External abort",
            "AbortSignal",
            "Not translated to HttpTimeoutError; the original fetch abort error is rethrown."
          ]
        ],
        lessons: [
          {
            title: "An HTTP failure still gives you the server body",
            explanation: "A fetch Response with status 404 or 500 does not make fetch reject. HttpClient parses its body, checks response.ok, and then throws HttpError with the status, URL, and parsed body attached.",
            code: `try {
  await api.post("/collection", { body: { gameId: "missing-game" } });
} catch (error) {
  if (error instanceof HttpError) {
    showCollectionError(error.status, error.body);
  } else {
    throw error; // network or other unexpected failure
  }
}`
          },
          {
            title: "A timeout and player cancellation mean different things",
            explanation: "HttpClient owns its timeout and reports it as HttpTimeoutError. A caller signal is checked before construction and after async request interceptors. During fetch, the first cancellation wins: caller cancellation preserves its reason even if the transport rejects after the timer would have elapsed. The forwarding listener is removed on settlement. The clock still stops when fetch settles, before response processing.",
            code: `const controller = new AbortController();
const request = api.get<CatalogGame[]>("/games?q=zelda", {
  signal: controller.signal,
});

closeSearchScreen(() => controller.abort());
await request; // handle the platform abort in app code`
          },
          {
            title: "Know when the timeout clock stops",
            explanation: "The timer covers the fetch operation and is cleared when fetch resolves or rejects. Response interceptors and parsing happen afterward, so timeoutMs is not a deadline for the entire client method.",
            code: `try {
  const games = await api.get<CatalogGame[]>("/games", { timeoutMs: 3000 });
  showGames(games);
} catch (error) {
  if (error instanceof HttpTimeoutError) {
    showRetryMessage(error.timeoutMs);
  }
}`
          }
        ]
      }
    ],
    examples: [
      {
        title: "Add authentication and normalize a response",
        explanation: "The session helper belongs to Game Shelf. The interceptor adds its result to request headers, then the response interceptor observes status and returns the Response for normal parsing.",
        code: `api.useRequestInterceptor((request) => {
  request.headers.set("authorization", getGameShelfSessionHeader());
  return request;
});

api.useResponseInterceptor((response) => {
  console.info("Game API responded:", response.status);
  return response;
});`
      },
      {
        title: "Cancel a request and handle HTTP status errors",
        explanation: "The search screen owns its AbortController. Closing that screen cancels its pending request; status errors and timeouts remain distinct cases.",
        code: `import { HttpError, HttpTimeoutError } from "../../vendor/http/dist/index.js";

const controller = new AbortController();
const pending = api.get<CatalogGame[]>("/games?q=celeste", {
  signal: controller.signal,
});
closeSearchScreen(() => controller.abort());

try {
  await pending;
} catch (error) {
  if (error instanceof HttpTimeoutError) showRetryMessage(error.timeoutMs);
  else if (error instanceof HttpError) showCollectionError(error.status, error.body);
  else throw error; // preserve caller cancellation and network failures
}`
      }
    ],
    notes: [
      "The generic type T is a TypeScript assertion about the server payload; the client does not runtime-validate response JSON.",
      "Request body serialization is JSON-only. For FormData, streams, or another BodyInit, use native fetch directly or add a deliberate extension; this API types body as unknown and serializes it.",
      "A timeout only covers the fetch request itself; the timer is cleared once fetch resolves or rejects. Response interceptors and body parsing happen afterward.",
      "Interceptors are appended and not removable by this API. Avoid registering duplicate interceptors on repeated setup paths."
    ],
    related: [
      {
        label: "Under the Hood: build the HTTP package",
        href: "/under-the-hood/http"
      }
    ]
  },
  {
    slug: "components",
    name: "Components",
    kind: "Core package",
    sourceLines: 1178,
    summary: "Native Custom Elements, lifecycle scopes, typed events/forms, async state, and safe reactive templates.",
    description: "We will build Game Shelf's game-card and collection-grid elements using browser Custom Elements. Along the way, we will see how attributes become props, why a connection owns its listeners, how typed events cross component boundaries, and how reactive templates update the DOM without a virtual DOM.",
    importPath: "vendor/components/src/index.ts",
    quickStart: `import { defineComponent, html } from "../../vendor/components/dist/index.js";

defineComponent("game-card", {
  shadow: true,
  props: { title: "string", platform: "string", status: "string" },
  template: ({ title, platform, status }) => html\`
    <article>
      <h2>\${title}</h2>
      <p>\${platform} · \${status}</p>
    </article>
  \`,
});

// <game-card title="Celeste" platform="Switch" status="playing"></game-card>`,
    context: "Game is the tracker-owned type introduced in the examples. collection is the app's createStore; helpers such as renderGames, filterCollection, and catalogueApi belong to Game Shelf. The components package connects app-owned data to browser UI; it does not supply a game model or application store.",
    sections: [
      {
        title: "Component registration and configuration",
        description: "defineComponent registers a native Custom Element. props declares reflected attributes; properties declares JavaScript-only inputs. Both feed the template and lifecycle props snapshot.",
        rows: [
          [
            "defineComponent<Props>(tagName, config)",
            "(string, ComponentConfig<Props>) => void",
            "Registers tagName with customElements.define. Tag names must be valid and not already registered."
          ],
          [
            "ComponentConfig.shadow",
            "boolean | 'open' | 'closed'; default false",
            "true attaches an open Shadow Root; false/omitted renders Light DOM; open/closed selects the native shadow mode."
          ],
          [
            "ComponentConfig.formAssociated",
            "boolean; default false",
            "Opt into native form-associated Custom Elements. Attaches ElementInternals once; requires browser support and has no polyfill fallback."
          ],
          [
            "ComponentConfig.onFormAssociated(context, form)",
            "(context, HTMLFormElement | null) => void",
            "Forwards native form ownership changes without forcing a render."
          ],
          [
            "ComponentConfig.onFormDisabled / onFormReset / onFormStateRestore",
            "(context, disabled) / (context) / (context, state, mode)",
            "Native callbacks; restore state is string | File | FormData | null and mode is restore | autocomplete. Successful callbacks render fresh props after construction and upgrade replay."
          ],
          [
            "ComponentConfig.styles",
            "string; optional",
            "CSS inserted into the component root. Shadow DOM scopes it; Light DOM shares the document cascade."
          ],
          [
            "ComponentConfig.props",
            "{ [key in keyof Props]?: AttributeType | ComponentAttribute<Props[key]> }",
            "Shorthand coercion or explicit { type, attribute?, default?, validate? }. Defaults apply only to absent attributes; validate throws to reject parsed values."
          ],
          [
            "ComponentConfig.properties",
            "{ [key in keyof Props]?: ComponentProperty<Props[key]> }",
            "Property-only data with { default: () => value, validate? }. Per-instance defaults, Object.is equality, no serialization or deep observation."
          ],
          [
            "ComponentConfig.template(props)",
            "(Props) => string | TemplateResult",
            "Returns a legacy interpolated string or a reactive html TemplateResult."
          ],
          [
            "ComponentConfig.onBeforeRender(context)",
            "(ComponentContext<Props>) => void",
            "Runs immediately before template rendering."
          ],
          [
            "ComponentConfig.onAfterRender(context)",
            "(ComponentContext<Props>) => void",
            "Runs after template rendering and styles insertion."
          ],
          [
            "ComponentConfig.onUpdate(context, previousProps)",
            "(context, Props) => void",
            "Runs after attribute updates or connected property-only writes render. Property-only same-reference and disconnected writes do not call it."
          ],
          [
            "ComponentConfig.onConnect(context)",
            "(ComponentContext<Props>) => void",
            "Runs on each connection after initial rendering; use context resource helpers here."
          ],
          [
            "ComponentConfig.onDisconnect(context)",
            "(ComponentContext<Props>) => void",
            "Runs after connection-scoped resources have been disposed."
          ],
          [
            "ComponentConfig.onAttributeChange(context, name, oldValue, newValue)",
            "(context, keyof Props, unknown, unknown) => void",
            "Receives the public property key (including attribute aliases) and parsed values after an attribute change; never runs for property-only writes."
          ],
          [
            "ComponentContext<Props>.element",
            "HTMLElement",
            "The Custom Element host."
          ],
          [
            "ComponentContext<Props>.root",
            "HTMLElement | ShadowRoot",
            "The Light DOM host or configured Shadow Root used for queries/rendering."
          ],
          [
            "ComponentContext<Props>.props",
            "Props",
            "Current parsed props snapshot."
          ],
          [
            "ComponentContext<Props>.internals",
            "ElementInternals | null",
            "Native form/value/validity/labels APIs for opted-in components; null by default. Native errors propagate."
          ]
        ],
        lessons: [
          {
            title: "Pass a collection as data, not as an HTML string",
            explanation: "properties adds typed JavaScript-only inputs to the same props snapshot. Its required default factory creates fresh data for each element. Assigning a new value while connected renders and calls onUpdate; Object.is-equal values do nothing. Disconnected writes are stored for the next connect. Mutating an existing array does not notify, and no store subscription is created.",
            code: `type Game = { id: string; title: string };
type ShelfProps = { games: readonly Game[]; pageSize: number };

defineComponent<ShelfProps>("game-shelf", {
  shadow: true,
  props: {
    pageSize: {
      type: "number", attribute: "page-size", default: 10,
      validate(value) {
        if (!Number.isSafeInteger(value) || value < 1) {
          throw new RangeError("pageSize must be a positive safe integer");
        }
      },
    },
  },
  properties: {
    games: { default: () => [] },
  },
  template: ({ games, pageSize }) => html\`
    <ul>\${repeat(games.slice(0, pageSize), (game) => game.id,
      (game) => html\`<li>\${game.title}</li>\`)}</ul>
  \`,
});

const shelf = document.createElement("game-shelf") as HTMLElement & ShelfProps;
shelf.games = [{ id: "celeste", title: "Celeste" }];
document.body.append(shelf);`
          },
          {
            title: "Treat validation and element upgrade as browser boundaries",
            explanation: "ComponentAttribute<Value> exposes type, attribute?, default?, and validate(value): void. ComponentProperty<Value> exposes default(): Value and validate(value): void. Validators must throw; their return values are ignored. Attribute aliases must be unique, non-empty lowercase names, and an input cannot be declared in both maps. Validation occurs before a property write commits, including defaults. Invalid direct attribute changes are already in the DOM: the browser reports the thrown callback error, while Nala keeps the last valid props. Repair the attribute explicitly.",
            code: `// Property writes validate before changing reflected attributes.
shelf.pageSize = 20; // writes page-size=\"20\"
// shelf.pageSize = 0; // throws; keeps the previous value

// A matching literal HTML attribute is still ordinary browser markup:
// <game-shelf page-size=\"20\"></game-shelf>`
          },
          {
            title: "Keep values assigned before registration or template upgrade",
            explanation: "A not-yet-upgraded element can hold own properties. Nala captures them before installing accessors. Data properties are validated and stored immediately. Reflected values replay through their setters on first connection, before render and onConnect, because native constructors must not add attributes. Until connection, reflected getters read existing attributes or defaults. An explicit later setter overrides a pending value. Replay produces no update hooks and does not repeat on reconnect.",
            code: `// This code may run before the module registers game-shelf.
const pending = document.createElement("game-shelf") as HTMLElement & ShelfProps;
pending.games = [{ id: "hades", title: "Hades" }];
pending.pageSize = 2;
// After registration and connection, both assignments are preserved.
// Reactive templates can also pass data:
// html\`<game-shelf .games=\${games}></game-shelf>\``
          },
          {
            title: "A component definition is a recipe for a browser element",
            explanation: "defineComponent registers the tag with customElements.define. The browser creates instances from that definition and calls the component lifecycle when each element connects. Import the module before relying on the custom tag in the page.",
            code: `defineComponent("game-card", {
  template: () => "<article><slot></slot></article>",
});

// HTML can now create an instance of the registered element.
const card = document.createElement("game-card");`
          },
          {
            title: "An attribute becomes a typed prop",
            explanation: "HTML attributes are text. The props map tells Nala how to parse them and installs matching element properties. Changing card.status updates the reflected attribute; Nala reads the new props and renders again.",
            code: `defineComponent<{ title: string; status: string }>("game-card", {
  props: { title: "string", status: "string" },
  template: ({ title, status }) => html\`
    <article><h2>\${title}</h2><p>\${status}</p></article>
  \`,
});

const card = document.querySelector("game-card")!;
card.status = "completed"; // reflects state and triggers an update`
          },
          {
            title: "Shadow DOM scopes the card; slots keep its content yours",
            explanation: "With shadow: true, the browser gives the card a separate rendering root, so its internal styles do not leak onto the collection page. CSS custom properties still inherit from the host. Use Light DOM instead when consumers should style internal markup directly.",
            code: `defineComponent("game-card", {
  shadow: true,
  styles: "article { border-color: var(--game-card-border); }",
  template: () => "<article><slot></slot></article>",
});

// Consumer-owned content enters through the native default slot.
// <game-card>Celeste <span>Switch</span></game-card>`
          }
        ]
      },
      {
        title: "Lifecycle helpers and types",
        description: "Helpers are bounded to the component root and owned by the current connection. Disconnect disposes listeners/effects before custom cleanups; reconnect creates a fresh scope.",
        rows: [
          [
            "ComponentRoot",
            "HTMLElement | ShadowRoot",
            "Possible component roots."
          ],
          [
            "ComponentCleanup",
            "() => void",
            "Cleanup callback registered with onCleanup."
          ],
          [
            "ComponentContext.query<T>(selector)",
            "(string) => T | null",
            "Root-bounded querySelector helper."
          ],
          [
            "ComponentContext.queryAll<T>(selector)",
            "(string) => T[]",
            "Root-bounded querySelectorAll helper returning an array."
          ],
          [
            "ComponentContext.listen(type, listener, options?)",
            "host event overload",
            "Registers a connection-scoped listener on the host."
          ],
          [
            "ComponentContext.listen(target, type, listener, options?)",
            "EventTarget overloads",
            "Also accepts window, document, HTMLElement, or another EventTarget; cleanup is automatic. External AbortSignal options are combined with the connection scope."
          ],
          [
            "ComponentContext.delegate(type, selector, listener, options?)",
            "(event, matchedElement) => void",
            "Delegates within the root using composedPath; does not match nodes outside the component root."
          ],
          [
            "ComponentContext.effect(callback)",
            "EffectCallback -> void",
            "Runs a state effect owned by the component connection; disposed on disconnect."
          ],
          [
            "ComponentContext.onCleanup(cleanup)",
            "ComponentCleanup -> void",
            "Registers cleanup, called once in reverse registration order. A failing cleanup does not block later cleanup callbacks."
          ],
          [
            "ComponentListen",
            "overloaded listener registration type",
            "Public TypeScript type for supported listen overloads."
          ],
          [
            "ComponentDelegate",
            "delegated event listener type",
            "Public TypeScript type for delegate overloads."
          ],
          [
            "ComponentLifecycleHelpers",
            "query/queryAll/listen/delegate/effect/onCleanup",
            "Public helper surface mixed into ComponentContext."
          ]
        ],
        lessons: [
          {
            title: "Treat each connection as a short-lived workspace",
            explanation: "A Custom Element can be removed and later reinserted. onConnect runs for each connection. Nala creates a fresh resource scope, so listeners and effects registered here are disposed on disconnect and do not stack up after reconnect.",
            code: `defineComponent("recent-games", {
  template: () => html\`<ul></ul>\`,
  onConnect: ({ effect, query }) => {
    const list = query<HTMLUListElement>("ul");
    effect(() => {
      if (list) list.textContent = String(recentGames().length);
    });
  },
});`
          },
          {
            title: "Delegate clicks for game rows added later",
            explanation: "A listener on the root can handle matching descendants, even when a row is rendered after the component connects. delegate follows composedPath only as far as the component root, and onCleanup releases a store subscription when that root disconnects.",
            code: `defineComponent("recent-games", {
  template: () => html\`<ul></ul>\`,
  onConnect: ({ delegate, onCleanup }) => {
    delegate("click", "[data-game-id]", (_event, target) => {
      collection.actions.openGame(target.getAttribute("data-game-id")!);
    });

    const stop = collection.subscribe((state) => renderRecentGames(state.games));
    onCleanup(stop);
  },
});`
          },
          {
            title: "Listen to the window without leaking a handler",
            explanation: "listen accepts a stable external EventTarget such as window. Nala ties that event listener to this connection; you do not need a component-level AbortController just to remove it.",
            code: `defineComponent("collection-summary", {
  template: () => html\`<output></output>\`,
  onConnect: ({ listen }) => {
    listen(window, "resize", () => updateCollectionLayout());
  },
});`
          }
        ]
      },
      {
        title: "Events and form controls",
        description: "All events are native CustomEvents. Form helpers use conventional input/change names and bubble across Shadow DOM by default.",
        rows: [
          [
            "dispatchComponentEvent<Detail>(element, type, detail, options?)",
            "EventTarget -> boolean",
            "Dispatches CustomEvent<Detail>; returns dispatchEvent's boolean result."
          ],
          [
            "ComponentEvent<Detail>",
            "CustomEvent<Detail>",
            "Typed custom event alias."
          ],
          [
            "ComponentEventOptions.bubbles",
            "boolean; default false",
            "Enables bubbling."
          ],
          [
            "ComponentEventOptions.composed",
            "boolean; default false",
            "Allows the event to cross a Shadow DOM boundary."
          ],
          [
            "ComponentEventOptions.cancelable",
            "boolean; default false",
            "Allows preventDefault; a prevented event makes dispatch return false."
          ],
          [
            "defineFormControl<Props>(tagName, config)",
            "ComponentConfig plus valueType? and form-state props",
            "Defines a component with reflected value, checked, selected, disabled, readonly, required properties."
          ],
          [
            "FormControlConfig.valueType",
            "AttributeType; default 'string'",
            "Attribute conversion type for value."
          ],
          [
            "FormControlConfig.props",
            "Record<string, AttributeType>",
            "Additional reflected component props; can override standard property types."
          ],
          [
            "FormControlConfig.form",
            "FormControlAssociation<Props>; optional",
            "Opts into form association. Synchronizes submission and validity after the component's onAfterRender. Cannot combine with formAssociated false."
          ],
          [
            "FormControlAssociation.value / state",
            "(context) => string | File | FormData | null",
            "value is required. null omits submission; strings/Files use host name, FormData supplies its own entries. Optional state defaults to the submission value."
          ],
          [
            "FormControlAssociation.validity",
            "(context) => FormControlValidity; optional",
            "Returns native flags, optional message and descendant anchor. Active flags require a nonempty message. Omission clears validity; required alone does not define a domain rule."
          ],
          [
            "FormControlAssociation.reset / disabled",
            "(context) => void / (context, boolean) => void; required",
            "Explicit domain reset and effective-disabled UI handling. Browser handles disabled fieldsets and submission omission; do not overwrite the host's own disabled attribute."
          ],
          [
            "FormControlAssociation.restore",
            "(context, state, mode) => void; optional",
            "Handles browser-restored state or autocomplete. form callbacks precede matching config hooks, followed by a fresh render; no automatic input/change events."
          ],
          [
            "FormControlValidity",
            "{ flags: ValidityStateFlags; message?: string; anchor?: HTMLElement }",
            "Passed to native ElementInternals.setValidity after the inner UI has rendered."
          ],
          [
            "FormControlState",
            "value, checked, selected, disabled, readonly, required",
            "Shared form state shape; value supports string, number, boolean, or null."
          ],
          [
            "dispatchFormInput<Value>(element, value, options?)",
            "EventTarget -> boolean",
            "Dispatches input with detail { value }; bubbles and is composed by default."
          ],
          [
            "dispatchFormChange<Value>(element, value, options?)",
            "EventTarget -> boolean",
            "Dispatches change with detail { value }; bubbles and is composed by default."
          ],
          [
            "FormEventOptions",
            "bubbles? / composed? / cancelable?",
            "Can override the defaults for form events."
          ]
        ],
        lessons: [
          {
            title: "Send a value across a component boundary",
            explanation: "A CustomEvent carries a typed detail object. By default, dispatchComponentEvent does not bubble and does not cross a Shadow DOM boundary; opt into both when an app-level listener should receive the event.",
            code: `dispatchComponentEvent(
  gameCard,
  "game:open",
  { gameId: "g-17" },
  { bubbles: true, composed: true },
);`
          },
          {
            title: "Make a search element behave like a form control",
            explanation: "defineFormControl adds reflected value and standard boolean form properties. delegate listens to the internal native input, while dispatchFormInput sends its string value as { value }; the defaults let a listener outside Shadow DOM receive it.",
            code: `defineFormControl("game-search", {
  shadow: true,
  props: { label: "string" },
  template: () => \`<label>Games <input type="search"></label>\`,
  onConnect: ({ delegate, element }) => {
    delegate("input", "input", (_event, target) => {
      dispatchFormInput(element, (target as HTMLInputElement).value);
    });
  },
});

search.addEventListener("input", (event) => {
  const { value } = (event as CustomEvent<{ value: string }>).detail;
  filterCollection(value);
});`
          }
        ]
      },
      {
        title: "Async state machine",
        description: "A small data-loading state controller; the consumer owns rendering and cancellation.",
        rows: [
          [
            "createAsyncState<T>(isEmpty?, options?)",
            "((data: T) => boolean, AsyncStateOptions) -> AsyncStateController<T>",
            "Starts idle; isEmpty defaults to always false. Concurrency defaults to all, preserving existing completion-order publication."
          ],
          [
            "AsyncStateOptions.concurrency",
            '"all" | "latest"; default "all"',
            "latest publishes final state only for the newest started load and invalidates pending publication at reset. It does not cancel work. Invalid policies throw TypeError."
          ],
          [
            "AsyncStatus",
            '"idle" | "loading" | "success" | "error"',
            "Possible state status values."
          ],
          [
            "AsyncState<T>",
            "{ status, data, error, empty }",
            "Published state; data is T | null and error is unknown."
          ],
          [
            "AsyncStateController.state",
            "get: AsyncState<T>",
            "Reads the latest state snapshot."
          ],
          [
            "AsyncStateController.load(loader)",
            "() => Promise<T> -> Promise<T | null>",
            "Publishes loading, then eligible success/error; retains prior data during loading/error. Stale latest-mode calls still resolve their own data or null on failure, so render shared state via subscribe."
          ],
          [
            "AsyncStateController.retry()",
            "() => Promise<T | null>",
            "Reruns the most recently supplied loader; resolves null if none has run."
          ],
          [
            "AsyncStateController.reset()",
            "() => void",
            "Clears loader and publishes idle. In latest mode, prevents previously started requests from publishing; all mode keeps its existing completion behavior."
          ],
          [
            "AsyncStateController.subscribe(listener)",
            "(AsyncState<T>) => void -> () => void",
            "Calls listener immediately, then synchronously for each state transition."
          ]
        ],
        lessons: [
          {
            title: "Keep only the newest Game Shelf search",
            explanation: "Pass concurrency latest to prevent an older search response or failure from replacing newer state. Subscribe to state rather than rendering each load return value: stale calls still resolve. Reset at disconnect invalidates publication but does not cancel fetch; cancellation remains the loader's responsibility.",
            code: `const search = createAsyncState<Game[]>(
  (games) => games.length === 0,
  { concurrency: "latest" },
);
const stop = search.subscribe((state) => {
  if (state.status === "success" && state.data) renderGames(state.data);
  if (state.status === "error") showLibraryError(state.error);
});
void search.load(() => catalogueApi.get<Game[]>("/games?search=Celeste"));
void search.load(() => catalogueApi.get<Game[]>("/games?search=Hades"));
// On disconnect: stop(); search.reset();`
          },
          {
            title: "Model loading before you render the catalogue",
            explanation: "createAsyncState is a state machine, not a renderer or a fetch client. Give it the rule for an empty result, subscribe to snapshots, and pass a loader function that your Game Shelf app owns.",
            code: `const libraryLoad = createAsyncState<Game[]>(
  (games) => games.length === 0
);

const stop = libraryLoad.subscribe((state) => {
  if (state.status === "loading") showLibrarySpinner();
  if (state.status === "success" && state.empty) showEmptyLibrary();
  if (state.status === "success" && !state.empty) renderGames(state.data!);
  if (state.status === "error") showLibraryError(state.error);
});

await libraryLoad.load(() => catalogueApi.get<Game[]>("/collection"));`
          },
          {
            title: "Retry the last loader or reset the whole attempt",
            explanation: "retry calls the same loader that was most recently passed to load. reset forgets that loader and publishes idle with no data. This controller does not accept an AbortSignal; request cancellation remains the loader's responsibility.",
            code: `if (libraryLoad.state.status === "error") {
  await libraryLoad.retry();
}

function leaveLibraryPage() {
  stop();
  libraryLoad.reset();
}`
          }
        ]
      },
      {
        title: "String templates and attributes",
        description: "Legacy string templates interpolate property paths only. This API does not sanitize raw HTML; do not interpolate untrusted input into markup.",
        rows: [
          [
            "interpolate(template, data)",
            "(string, Record<string, unknown>) => string",
            "Replaces {{path.to.value}}. Null or missing values become an empty string."
          ],
          [
            "renderTemplate(template, data?)",
            "(string, Record<string, unknown>) => DocumentFragment",
            "Interpolates, parses through a native template element, and returns a cloned fragment."
          ],
          [
            "validateTemplate(template)",
            "string -> TemplateDiagnostic[]",
            "Checks supported property-path interpolation syntax; not a complete HTML parser."
          ],
          [
            "TemplateDiagnostic",
            "{ code, message, index }",
            "Diagnostic codes: unclosed-interpolation, unexpected-interpolation-end, invalid-interpolation."
          ],
          [
            "AttributeType",
            '"string" | "boolean" | "number"',
            "Supported reflected attribute types."
          ],
          [
            "parseAttributeValue(type, raw)",
            "(AttributeType, string | null) => unknown",
            "Boolean is based on attribute presence; missing number becomes null; strings remain string or null."
          ],
          [
            "serializeAttributeValue(type, value)",
            "(AttributeType, unknown) => string | null",
            "Boolean true serializes as empty string, false removes; null/undefined removes string/number attrs."
          ],
          [
            "reflectAttribute(element, name, type)",
            "Element -> { get(): unknown; set(value): void }",
            "Returns a small property-like facade that reads and writes the named attribute."
          ]
        ],
        lessons: [
          {
            title: "Use string interpolation only for trusted markup",
            explanation: "The legacy helper replaces a property path, converts it to a string, then renderTemplate assigns the result to innerHTML. That means a player-submitted game title is not escaped. Reserve this path for trusted developer-authored templates and use a reactive text binding for user data.",
            code: `const trustedTemplate = "<h2>{{heading}}</h2>";
const markup = interpolate(trustedTemplate, { heading: "Backlog" });
const diagnostics = validateTemplate(trustedTemplate);

// Do not interpolate a player-entered game title into HTML this way.`
          },
          {
            title: "Read a reflected attribute through its declared type",
            explanation: "HTML stores every attribute as text, but reflectAttribute applies the conversion you choose. Boolean values are based on presence; a missing number becomes null. The helper writes by setting or removing the attribute.",
            code: `const pageSize = reflectAttribute(
  collectionElement,
  "page-size",
  "number",
);

pageSize.set(24);
console.log(pageSize.get()); // 24`
          }
        ]
      },
      {
        title: "Reactive templates and directives",
        description: "html returns a TemplateResult. render compiles and updates dynamic parts in place; it is explicit and does not automatically subscribe to stores.",
        rows: [
          [
            "html(strings, ...values)",
            "TemplateStringsArray -> TemplateResult",
            "Tagged template for safe text, Node, nested TemplateResult, or directive values."
          ],
          [
            "render(result, root)",
            "(TemplateResult, Element | ShadowRoot | DocumentFragment) => void",
            "Updates compatible template parts in place and manages event listener disposal."
          ],
          [
            "when(condition, truthy, falsy?)",
            "boolean + lazy branch functions -> WhenDirective",
            "Evaluates only the selected branch; falsy defaults to an empty branch."
          ],
          [
            "repeat(items, key, renderItem)",
            "Iterable + key(item,index) + render(item,index) -> RepeatDirective",
            "Requires unique stable keys; reorders and reuses keyed DOM ranges, preserving node identity and focus. Duplicate keys throw."
          ],
          [
            "unsafeHTML(value)",
            "string -> UnsafeHtmlDirective",
            "Explicitly parses a string as HTML. Never use with untrusted/user-controlled content."
          ],
          [
            "TemplateResult",
            "{ strings, values }",
            "Result type returned by html; strings and values are readonly."
          ],
          [
            "WhenDirective",
            "lazy selected branch",
            "Directive type returned by when."
          ],
          [
            "RepeatDirective",
            "keyed repeat entries",
            "Directive type returned by repeat."
          ],
          [
            "UnsafeHtmlDirective",
            "{ value: string }",
            "Directive type returned by unsafeHTML."
          ]
        ],
        lessons: [
          {
            title: "Let normal expressions render player-provided text",
            explanation: "html marks dynamic positions and render updates those parts. A string in node position becomes a text node, so a game title such as <script>...</script> is shown as text rather than parsed as markup.",
            code: `const gameCard = (game: Game) => html\`
  <li>
    <h2>\${game.title}</h2>
    <p>\${game.platform} · \${game.status}</p>
  </li>
\`;

render(gameCard(selectedGame), gameDetailRoot);`
          },
          {
            title: "Build a collection grid with stable game IDs",
            explanation: "repeat requires a unique key for each game. Native moveBefore retains focus and selection; Nala-defined components also retain their connection through connectedMoveCallback. Other Custom Elements need their own move callback to avoid reconnects. Where unavailable, a fragment fallback refocuses the render-root's active HTMLElement with preventScroll but may reconnect children; nested Shadow DOM focus is not guaranteed. A changed template or removed key still replaces/removes content. when lazily chooses the empty-library branch.",
            code: `const collectionView = (games: Game[]) => html\`
  <ul>
    \${when(games.length === 0, () => html\`<li>Your shelf is empty</li>\`)}
    \${repeat(games, (game) => game.id, (game) => html\`
      <li><button data-game-id=\${game.id}>\${game.title}</button></li>
    \`)}
  </ul>
\`;

render(collectionView(games), collectionRoot);`
          },
          {
            title: "Update a checkbox property, not just its attribute",
            explanation: "The ?disabled binding toggles an HTML boolean attribute. The .checked binding writes the live DOM property, which is the state the browser control actually uses after interaction.",
            code: `const backlogToggle = (checked: boolean) => html\`
  <input type="checkbox" .checked=\${checked} ?disabled=\${isSaving}>
  Show backlog
\`;

render(backlogToggle(showBacklog), filterRoot);`
          },
          {
            title: "An event binding belongs to the rendered node",
            explanation: "@click adds a native listener to this button. When render updates the same template, Nala keeps the part; if the template changes or is cleared, it disposes the old listener.",
            code: `const addToWishlist = (game: Game) => html\`
  <button @click=\${() => collection.actions.addToWishlist(game.id)}>
    Add \${game.title} to wishlist
  </button>
\`;`
          }
        ]
      }
    ],
    examples: [
      {
        title: "Define a reusable game card",
        explanation: "The custom element owns its markup and a component-scoped stylesheet. Its title and platform remain normal typed props, while its contents are rendered with safe text bindings.",
        code: `import { defineComponent, html } from "../../vendor/components/dist/index.js";

defineComponent<{ title: string; platform: string }>("game-card", {
  shadow: true,
  props: { title: "string", platform: "string" },
  styles: "article { padding: 1rem; }",
  template: ({ title, platform }) => html\`
    <article>
      <h2>\${title}</h2>
      <p>\${platform}</p>
      <slot></slot>
    </article>
  \`,
});

// <game-card title="Celeste" platform="Switch">...</game-card>`
      },
      {
        title: "Render and update the collection grid",
        explanation: "This app-owned page uses a stable game id as each repeat key. render reuses the template's dynamic parts, while the component context disposes the store subscription when the page disconnects.",
        code: `import { defineComponent, html, render, repeat } from "../../vendor/components/dist/index.js";

defineComponent("collection-grid", {
  template: () => html\`<ul></ul>\`,
  onConnect: ({ query, onCleanup }) => {
    const list = query<HTMLUListElement>("ul");
    if (!list) return;

    const stop = collection.subscribe(({ games }) => {
      render(html\`
        \${repeat(games, (game) => game.id, (game) => html\`
          <li>
            <game-card title=\${game.title} platform=\${game.platform}></game-card>
          </li>
        \`)}
      \`, list);
    });
    onCleanup(stop);
  },
});`
      }
    ],
    notes: [
      "Arrays in node position must be rendered with repeat() and stable unique keys. Use domain IDs, not array indexes for reorderable data.",
      "Use .value/.checked property bindings for live DOM properties, ?name for boolean attributes, @event for native listeners, and ordinary name= for attributes.",
      "Reactive templates preserve dynamic parts. Store-to-component binding is explicit today: own a subscription and call render, then dispose it with onCleanup.",
      "Native slots, CustomEvents, and Shadow DOM remain browser primitives. defineComponent does not provide a virtual DOM, validator, router, or form-associated custom-element submission contract."
    ],
    related: [
      {
        label: "Under the Hood: build the components package",
        href: "/under-the-hood/components"
      }
    ]
  },
  {
    slug: "router",
    name: "Router",
    kind: "Core package",
    sourceLines: 262,
    summary: "An injectable History API router with named params, native link interception, and a route outlet.",
    description: "We will build Game Shelf as a small single-page app: a collection list, a wishlist, and a page for one game. Follow one click from its anchor, through URL matching and browser history, to the Node mounted by router-outlet. The router handles navigation mechanics; Game Shelf still owns its game data and page behavior.",
    importPath: "vendor/router/src/index.ts",
    quickStart: `import {
  attachLinkInterceptor,
  createRouter,
  defineRouterOutlet,
} from "../../vendor/router/dist/index.js";
import type { RouterOutlet } from "../../vendor/router/dist/index.js";

defineRouterOutlet();
const router = createRouter([
  { path: "/games", component: () => document.createElement("game-list-page") },
  {
    path: "/games/:gameId",
    component: () => document.createElement("game-detail-page"),
  },
  { path: "/wishlist", component: () => document.createElement("wishlist-page") },
]);

const outlet = document.querySelector("router-outlet") as RouterOutlet;
outlet.router = router;
attachLinkInterceptor(router);`,
    sections: [
      {
        title: "Matching and route definitions",
        description: "Paths are split into slash-separated segments. A match requires the same segment count; named segments are decoded with decodeURIComponent.",
        rows: [
          [
            "matchRoute(pattern, path)",
            "(string, string) => RouteMatch | null",
            "Matches static segments and :param segments; returns null when any segment or path length differs."
          ],
          [
            "RouteMatch.params",
            "Record<string, string>",
            "Decoded values for named path parameters."
          ],
          [
            "RouteDefinition<Component>.path",
            "string",
            "Route pattern, for example /users/:id."
          ],
          [
            "RouteDefinition<Component>.component",
            "Component",
            "Value associated with the matching route; route package does not impose a component type here."
          ],
          [
            "ActiveRoute<Component>",
            "{ path, params, component: Component | null }",
            "Resolved path and params; component is null for unmatched paths."
          ]
        ],
        lessons: [
          {
            title: "Describe the pages in the game library",
            explanation: "A route is a rule: when the URL has this shape, use this page factory. The router compares path segments from top to bottom. Static segments must match; a segment beginning with : captures that part of the URL.",
            code: `const routes = [
  {
    path: "/games",
    component: () => document.createElement("game-list-page"),
  },
  {
    path: "/games/:gameId",
    component: () => document.createElement("game-detail-page"),
  },
];

matchRoute("/games/:gameId", "/games/g-17");
// { params: { gameId: "g-17" } }`
          },
          {
            title: "A match gives you route data, not game data",
            explanation: "The value g-17 is only a string extracted from the URL. Your application looks up that ID in its collection; route matching never reaches into the game store.",
            code: `const match = matchRoute("/games/:gameId", "/games/g-17");
const game = match
  ? collection.state().games.find((item) => item.id === match.params.gameId)
  : undefined;`
          }
        ]
      },
      {
        title: "Router and history API",
        description: "The initial current route is resolved from history.getPath(). Subscribers receive the current route immediately and then future navigations.",
        rows: [
          [
            "createRouter(routes, options?)",
            "RouteDefinition[] + RouterOptions -> Router",
            "Creates a router and subscribes to adapter popstate notifications."
          ],
          [
            "Router.current",
            "get: ActiveRoute<Component>",
            "Current resolved route snapshot."
          ],
          [
            "Router.navigate(path)",
            "(string) => void",
            "Pushes a different path through the history adapter and publishes its resolved route. Same current path is a no-op."
          ],
          [
            "Router.subscribe(listener)",
            "(ActiveRoute<Component>) => Unsubscribe",
            "Immediately replays current route and publishes later path changes. Same-path popstate retains current and sends no notification."
          ],
          [
            "RouterOptions.history",
            "HistoryAdapter; default browser adapter",
            "Injects path access, push behavior, and popstate subscription; useful for deterministic tests."
          ],
          [
            "HistoryAdapter.getPath()",
            "() => string",
            "Returns current route path."
          ],
          [
            "HistoryAdapter.pushPath(path)",
            "(string) => void",
            "Writes a new path without a full-page navigation."
          ],
          [
            "HistoryAdapter.onPopState(listener)",
            "(() => void) => Unsubscribe",
            "Subscribes to browser back/forward changes and returns disposer."
          ],
          [
            "createBrowserHistoryAdapter()",
            "() => HistoryAdapter",
            "Uses location.pathname, history.pushState, and global popstate listeners."
          ]
        ],
        lessons: [
          {
            title: "The router resolves once, then publishes changes",
            explanation: "createRouter reads the current path from its history adapter to build current. Internally it stores the active route in a BehaviorSubject, so subscribe immediately receives that starting route. navigate() pushes a new path, resolves it, then synchronously publishes it.",
            code: `const router = createRouter(routes);

const stopWatching = router.subscribe((route) => {
  console.log("Game Shelf URL:", route.path);
  console.log("Selected game id:", route.params.gameId);
});

router.navigate("/games/g-17");
stopWatching();`
          },
          {
            title: "Back and Forward use the same route pipeline",
            explanation: "The browser adapter listens for popstate. When Back/Forward changes location.pathname, the router resolves and publishes the route. Native fragment navigation and query-only history entries can emit popstate without changing pathname: the router compares the adapter's exact path string with current.path, preserves the current object and does not notify or remount the outlet. Native section scrolling therefore retains a connected editor. No second navigation system is needed.",
            code: `const router = createRouter(routes, {
  history: createBrowserHistoryAdapter(),
});

// This ordinary router subscription also sees browser Back/Forward updates.
router.subscribe((route) => showRouteTitle(route.path));`
          }
        ]
      },
      {
        title: "Native links and click interception",
        description: "Only plain same-origin left-clicks are intercepted; modifier clicks, downloads, non-self targets, external links, and prevented events stay with the browser.",
        rows: [
          [
            "shouldInterceptLinkClick(info)",
            "LinkClickInfo -> boolean",
            "Pure decision function; useful for testing click eligibility without a DOM."
          ],
          [
            "LinkClickInfo.href",
            "string | null",
            "Anchor's literal href attribute; null is not interceptable."
          ],
          [
            "LinkClickInfo.target",
            "string | null",
            "Only absent or _self targets are interceptable."
          ],
          [
            "LinkClickInfo.download",
            "string | null",
            "Any download attribute prevents interception."
          ],
          [
            "LinkClickInfo.hasModifierKey",
            "boolean",
            "True for meta, ctrl, shift, or alt click."
          ],
          [
            "LinkClickInfo.button",
            "number",
            "Only button 0 is intercepted."
          ],
          [
            "LinkClickInfo.isSameOrigin",
            "boolean",
            "External origins remain native navigations."
          ],
          [
            "LinkClickInfo.defaultPrevented",
            "boolean",
            "Already-handled click is not intercepted."
          ],
          [
            "attachLinkInterceptor(router, root?)",
            "Navigable router + Document -> () => void",
            "Delegates clicks from anchors under root (document by default), prevents eligible navigation, and calls router.navigate(pathname). Returns listener disposer."
          ]
        ],
        lessons: [
          {
            title: "Keep links real and let the router enhance eligible clicks",
            explanation: "Write ordinary anchors first. For a plain same-origin left click, the interceptor prevents a full reload and calls navigate(). Modifier clicks, downloads, external destinations, and non-self targets remain browser behavior.",
            code: `<nav aria-label="Game Shelf">
  <a href="/games">My collection</a>
  <a href="/wishlist">Wishlist</a>
  <a href="/games/g-17">Celeste details</a>
</nav>

const stopIntercepting = attachLinkInterceptor(router);
// If this app shell is removed, call stopIntercepting().`
          },
          {
            title: "The pure decision helper makes edge cases teachable",
            explanation: "shouldInterceptLinkClick does not touch the DOM. It receives facts about a click and returns a boolean, so the policy can be tested independently from browser event wiring.",
            code: `const shouldHandleInApp = shouldInterceptLinkClick({
  href: "/games/g-17",
  target: null,
  download: null,
  hasModifierKey: false,
  button: 0,
  isSameOrigin: true,
  defaultPrevented: false,
});
// true: this is a plain internal Game Shelf link`
          }
        ]
      },
      {
        title: "Router outlet",
        description: "defineRouterOutlet registers a native custom element. RouteComponent factories return Nodes; route changes remove the previous node and append the new one.",
        rows: [
          [
            "RouteComponent",
            "() => Node",
            "Factory used by the router outlet."
          ],
          [
            "defineRouterOutlet(tagName?)",
            "string; default router-outlet -> void",
            "Registers the outlet only if that custom element name is not already defined."
          ],
          [
            "RouterOutlet.router",
            "Router<RouteComponent> | null",
            "Assign to connect the outlet to route changes; replacing it unsubscribes the previous router."
          ],
          [
            "RouterOutlet.connectedCallback()",
            "native lifecycle callback",
            "Subscribes and renders the current route when connected."
          ],
          [
            "RouterOutlet.disconnectedCallback()",
            "native lifecycle callback",
            "Unsubscribes when disconnected."
          ]
        ],
        lessons: [
          {
            title: "The outlet is the bridge from route to DOM",
            explanation: "Assigning router connects the outlet to route updates. Subscription immediately replays the current route, so initial connection mounts exactly once, not twice. Reconnect gets one new mount of the current route. The route's component value is a factory returning a Node. Route changes remove the previous node; the outlet does not cache pages.",
            code: `defineRouterOutlet();
const outlet = document.querySelector("router-outlet") as RouterOutlet;
outlet.router = router;

// Route factories can return any Node:
const gameRoute = {
  path: "/games/:gameId",
  component: () => document.createElement("game-detail-page"),
};`
          },
          {
            title: "A route factory does not receive its parameters",
            explanation: "The component factory has the signature () => Node. It does not get gameId as an argument. Subscribe to the router or read router.current in app code, then pass the looked-up game into your page using the page's own API.",
            code: `router.subscribe((route) => {
  const gameId = route.params.gameId;
  const game = collection.state().games.find((item) => item.id === gameId);
  if (game) showGameDetails(game);
});`
          }
        ]
      }
    ],
    examples: [
      {
        title: "Inspect the selected game route",
        explanation: "The router extracts gameId from the path. Game Shelf then uses that identifier to find the full record.",
        code: `matchRoute("/games/:gameId", "/games/g-17");
// { params: { gameId: "g-17" } }

router.subscribe((route) => {
  if (route.component && route.params.gameId) {
    showGameDetailsById(route.params.gameId);
  }
});`
      },
      {
        title: "Keep downloads and outside pages native",
        explanation: "The interceptor should not take over browser features players expect, such as downloading an exported list or opening a store page in another tab.",
        code: `<a href="/games/export.csv" download>Export my collection</a>
<a href="https://store.steampowered.com/">Open the game store</a>
<a href="/games/g-17" target="_blank">Open game details in a new tab</a>`
      }
    ],
    notes: [
      "Route factories receive no params argument. Read router.current/subscribe in application code and pass domain data through your page's own API.",
      "The outlet removes the previous route node; it does not preserve route DOM or implement nested routes, guards, loaders, or scroll restoration.",
      "The link interceptor navigates with URL.pathname only; it does not pass query strings or hashes to Router.navigate. Keep those concerns explicit if Game Shelf needs them.",
      "Unknown paths resolve to an ActiveRoute with component null. Add a not-found route/view if players need a recovery path."
    ],
    related: [
      {
        label: "Under the Hood: build the router package",
        href: "/under-the-hood/router"
      }
    ]
  },
  {
    slug: "ui-components",
    name: "UI Components",
    kind: "Optional package",
    sourceLines: 3671,
    summary: "Premade themed Custom Elements for common controls, content surfaces, and navigation shells.",
    description: "This package is opt-in. Importing its entrypoint registers the nala-* component set; it depends on vendor/components, but core packages do not depend on it. Each element has its own example and API reference.",
    importPath: "vendor/ui-components/src/index.ts",
    quickStart: `import "../../vendor/ui-components/dist/index.js";

// Elements are now registered:
// <nala-color-picker>, <nala-pixel-art>, <nala-pixel-art-gallery>, <nala-spritesheet>,
// <nala-level-editor>,
// <nala-button>, <nala-input>, <nala-date-picker>, <nala-file-upload>,
// <nala-textarea>,
// <nala-checkbox>, <nala-switch>,
// <nala-select>, <nala-combobox>, <nala-progress>, <nala-loading>, <nala-dialog>,
// <nala-accordion>, <nala-grid-view>, <nala-grid-item>, <nala-radio-group>,
// <nala-multiselect>, <nala-list-view>, <nala-list-item>,
// <nala-context-menu>, <nala-context-menu-item>, <nala-card>, <nala-badge>,
// <nala-callout>, <nala-code-block>, <nala-nav-bar>, <nala-side-bar>,
// <nala-breadcrumbs>, <nala-tabs>, <nala-table>, <nala-icon>,
// <nala-playing-card>, <nala-playing-deck>, <nala-popover>`,
    sections: [
      {
        title: "Registration and component APIs",
        description: "The entrypoint side-effect imports and registers the complete component set. Each component's attributes, slots, events, defaults, and Shadow Parts are documented on its detail page.",
        rows: [
          [
            "nala-playing-deck",
            "label, decorative; NalaPlayingDeckElement; --nala-playing-deck-width and the playing-card paper/border/back palette",
            "Three overlapping face-down playing cards, announced as one image. Fixed visual layers, responsive sizing, and no card count, dealing logic, or custom events."
          ],
          [
            "nala-playing-card",
            "rank, suit, faceDown / face-down, decorative; nalaPlayingCardRanks, nalaPlayingCardSuits, NalaPlayingCardElement, NalaPlayingCardRank, NalaPlayingCardSuit",
            "All 52 SVG faces, original court portraits, optional red/black jokers, and a shared back. Scalable and automatically labelled; no game rules or custom events."
          ],
          [
            "nala-icon",
            "name, label; nalaIconNames, nalaIconGroups, NalaIconName, NalaIconGroup, NalaIconElement",
            "531 local SVGs for websites and browser games, including useful -filled variants and 30 semantic categories. RPG, TCG, Card Deck, Dice, Chess, and Strategy each have 25 base symbols. Inherits color and size; decorative unless labelled. Unknown names throw."
          ],
          [
            "nala-button",
            "variant: primary | secondary | ghost | danger; disabled",
            "Action control. Defaults to primary and enabled."
          ],
          [
            "nala-input",
            "label, hint, name, placeholder, type; value, disabled, readonly, required",
            "Labelled native text-like input; see its detailed reference below."
          ],
          [
            "nala-textarea",
            "label, hint, name, placeholder, rows; value, disabled, readonly, required",
            "Labelled native multi-line text control with string input/change events."
          ],
          [
            "nala-checkbox",
            "label, hint, name; checked, disabled, required",
            "Native checkbox; event detail.value is boolean."
          ],
          [
            "nala-color-picker",
            "label, hint, name; value, disabled; NalaColorPickerElement",
            "Native color chooser with a visible hex value. Defaults to #000000; accepts opaque six-digit RGB hex strings and reports string input/change events."
          ],
          [
            "nala-switch",
            "label, hint, name; checked, disabled, required",
            "Native checkbox announced as a switch; event detail.value is boolean."
          ],
          [
            "nala-progress",
            "label, hint; value, max",
            "Native progressbar; omit value for indeterminate progress."
          ],
          [
            "nala-loading",
            "label, variant, show-label",
            "Indeterminate spinner or animated bar for work without a known total."
          ],
          [
            "nala-dialog",
            "title, description; showModal(), show(), close()",
            "Stackable native dialog; modal dialogs use the browser top layer."
          ],
          [
            "nala-popover",
            "label, trigger-text, position; open, show(), close(), toggle(); NalaPopoverElement, NalaPopoverPosition",
            "Anchored non-modal auto popover with rich slotted content, optional native-button trigger, viewport-aware positioning, and open-change events. Requires the native Popover API."
          ],
          [
            "nala-accordion",
            "label, mode; native details children",
            "Native disclosure panels; mode selects single or multiple open panels."
          ],
          [
            "nala-list-view / nala-list-item",
            "label; image, image-alt; title/description/actions slots",
            "Accessible game list layout with optional cover art and app-owned row actions."
          ],
          [
            "nala-grid-view / nala-grid-item",
            "label, layout: grid | square | masonry; image, image-alt; title/description/actions slots",
            "Responsive, square, or masonry game tiles with optional cover art and actions."
          ],
          [
            "nala-table",
            "columns, rows, label, paging, page, pageSize, total, loading",
            "Read-only native table with client slicing or app-owned server paging through page-change."
          ],
          [
            "nala-context-menu / nala-context-menu-item",
            "label, trigger-label, trigger-text; item label, value, href, variant, disabled; icon/shortcut slots",
            "Keyboard-accessible popup for game actions and links."
          ],
          [
            "nala-select",
            "label, hint, name; value, disabled, required; native option children",
            "Native options remain in light DOM and are mirrored into its select."
          ],
          [
            "nala-combobox",
            "label, hint, placeholder, name; value, disabled, readonly, required, loading; native option children",
            "Searchable single selection; search reports query text, input/change report committed option values."
          ],
          [
            "nala-radio-group",
            "label, hint, name; value, disabled, required; native option children",
            "Always-visible native radio choices; event detail.value is the selected string."
          ],
          [
            "nala-multiselect",
            "label, hint, placeholder; values, disabled; native option children",
            "Dropdown of checkbox choices; event detail.value is a string array."
          ],
          [
            "nala-code-block",
            "language; code property; default slot",
            "Syntax-highlighted TypeScript and HTML code."
          ],
          [
            "nala-file-tree",
            "label; entries property",
            "Read-only nested file map with native collapsible folders, icons and optional notes; no fetching or selection."
          ],
          [
            "nala-process-flow",
            "label; steps property",
            "Read-only ordered diagram with visible inputs, results, locations and boundaries; no workflow execution."
          ],
          [
            "nala-terminal-transcript",
            "label, directory; entries property",
            "Read-only commands and illustrative output with explanatory notes; never executes commands."
          ],
          [
            "nala-page-outline",
            "label; default slot of in-page links",
            "Floating top-right button opening a native popover of slotted anchor links; no scroll spy."
          ],
          [
            "nala-code-workspace",
            "label, selected filename; files property",
            "Read-only IDE-style file tabs composing tabs and highlighted code blocks; no fetching, editing or execution."
          ],
          [
            "nala-tabs",
            "label, selected, orientation; tab and panel slots",
            "Accessible tablist paired with slotted panels."
          ],
          [
            "nala-card",
            "variant: outlined | raised | accent; eyebrow/title/default/actions slots",
            "Content surface; actions footer hides when its slot is empty."
          ],
          [
            "nala-badge",
            "tone: neutral | accent | success | warning | danger",
            "Compact status label."
          ],
          [
            "nala-callout",
            "tone: info | success | warning | danger; title/default slots",
            "Contextual message."
          ],
          [
            "nala-nav-bar",
            "sticky; brand/links/actions slots",
            "Responsive top navigation shell; links hide below 44rem."
          ],
          [
            "nala-side-bar",
            "label, sticky; default slot",
            "Secondary navigation shell; sticky behavior is disabled below 52rem."
          ],
          [
            "nala-breadcrumbs",
            "label; ordered list-item children",
            "Accessible, responsive hierarchy path with native links and an application-marked current page."
          ]
        ]
      },
      {
        title: "Theme API",
        description: "Theme helpers write the complete token set, merging supplied partial overrides with nalaDefaultTheme. All components consume inherited CSS custom properties.",
        rows: [
          [
            "nalaDefaultTheme",
            "Readonly<NalaUiTheme>",
            "Complete default token values."
          ],
          [
            "NalaUiTheme",
            "17 string properties",
            "colorCanvas, colorSurface, colorSurfaceMuted, colorText, colorTextMuted, colorBorder, colorAccent, colorAccentStrong, colorAccentSoft, colorWarning, colorDanger, fontBody, fontDisplay, radiusSmall, radiusMedium, radiusLarge, shadowRaised."
          ],
          [
            "NalaThemeProperties",
            "Record<string, string>",
            "CSS custom-property map using --nala-ui-* names, returned by createThemeProperties."
          ],
          [
            "createThemeProperties(overrides?)",
            "Partial<NalaUiTheme> -> NalaThemeProperties",
            "Returns all tokens, not only overridden entries."
          ],
          [
            "applyNalaTheme(target, overrides?)",
            "{ style.setProperty(name, value) } -> void",
            "Writes the complete merged theme to a style-like target; accepts document.documentElement or an element."
          ],
          [
            "CSS custom properties",
            "--nala-ui-color-* / font-* / radius-* / shadow-raised",
            "Can be set globally, on an app shell, or on one component host; Shadow DOM inherits them."
          ]
        ]
      },
      {
        title: "Import boundaries and shared contracts",
        description: "Use the full entrypoint for all components, or import individual component modules when a smaller registration surface is preferred. Each component has its own folder with its helpers, tests, and CSS stylesheet. The build embeds CSS into JavaScript, so the browser loads no extra stylesheets. Shared base.css and field.css rules stay at the package root and are composed before each component's own rules. Use deno task dev:watch:nala-documentation to rebuild and reload when a stylesheet is saved.",
        rows: [
          [
            "Full registration",
            'import ".../vendor/ui-components/dist/index.js"',
            "Registers the complete custom-element set and exports theme helpers/types."
          ],
          [
            "Individual registration",
            'import ".../vendor/ui-components/dist/input/input.js"',
            "Registers only the component defined by that module; shared styles are internal."
          ],
          [
            "Form control input/change",
            "CustomEvent<{ value: string | boolean }>",
            "Input/select emit string values; checkbox emits boolean. Events bubble and are composed."
          ],
          [
            "Shadow Parts",
            "::part(name)",
            "Targeted styling interface for each element; prefer theme tokens for shared changes."
          ],
          [
            "Component runtime",
            "vendor/components",
            "These controls are built from the lower-level component/form APIs. Core packages and applications do not implicitly import this optional package."
          ]
        ]
      }
    ],
    examples: [
      {
        title: "Compose native content and theme tokens",
        code: `import { applyNalaTheme } from "../../vendor/ui-components/dist/index.js";

applyNalaTheme(document.documentElement, {
  colorAccent: "#315f70",
  colorAccentStrong: "#224754",
});

// In HTML:
// <nala-card variant="accent">
//   <span slot="title">Account</span>
//   <p>Content remains ordinary HTML.</p>
//   <nala-button slot="actions" variant="secondary">Edit</nala-button>
// </nala-card>`
      }
    ],
    notes: [
      "The wrappers are not guaranteed to participate in native form submission. Use native controls when form association/submission is required.",
      "Navigation elements provide layout only; links, router integration, state, validation, and data fetching remain application-owned.",
      "The package does not inject global styles or change unrelated native elements. CSS custom properties and ::part are the intended customization surfaces."
    ],
    related: [
      {
        label: "Button",
        href: "/components/button"
      },
      {
        label: "Input",
        href: "/components/input"
      },
      {
        label: "Date picker",
        href: "/components/date-picker"
      },
      {
        label: "File upload",
        href: "/components/file-upload"
      },
      {
        label: "Textarea",
        href: "/components/textarea"
      },
      {
        label: "Checkbox",
        href: "/components/checkbox"
      },
      {
        label: "Color picker",
        href: "/components/color-picker"
      },
      {
        label: "Pixel art",
        href: "/components/pixel-art"
      },
      {
        label: "Pixel art gallery",
        href: "/components/pixel-art-gallery"
      },
      {
        label: "Spritesheet",
        href: "/components/spritesheet"
      },
      {
        label: "Level editor",
        href: "/components/level-editor"
      },
      {
        label: "Switch",
        href: "/components/switch"
      },
      {
        label: "Progress",
        href: "/components/progress"
      },
      {
        label: "Loading",
        href: "/components/loading"
      },
      {
        label: "Dialog",
        href: "/components/dialog"
      },
      {
        label: "Accordion",
        href: "/components/accordion"
      },
      {
        label: "List view",
        href: "/components/list-view"
      },
      {
        label: "Grid view",
        href: "/components/grid-view"
      },
      {
        label: "Pagination",
        href: "/components/pagination"
      },
      {
        label: "Table",
        href: "/components/table"
      },
      {
        label: "Context menu",
        href: "/components/context-menu"
      },
      {
        label: "Select",
        href: "/components/select"
      },
      {
        label: "Combobox / autocomplete",
        href: "/components/combobox"
      },
      {
        label: "Radio group",
        href: "/components/radio-group"
      },
      {
        label: "Multiselect",
        href: "/components/multiselect"
      },
      {
        label: "Tabs",
        href: "/components/tabs"
      },
      {
        label: "Card",
        href: "/components/card"
      },
      {
        label: "Badge",
        href: "/components/badge"
      },
      {
        label: "Callout",
        href: "/components/callout"
      },
      {
        label: "Navigation bar",
        href: "/components/nav-bar"
      },
      {
        label: "Side bar",
        href: "/components/side-bar"
      },
      {
        label: "Breadcrumbs",
        href: "/components/breadcrumbs"
      },
      {
        label: "Theme tokens",
        href: "/components/theme"
      },
      {
        label: "Code block",
        href: "/components/code-block"
      },
      {
        label: "Code workspace",
        href: "/components/code-workspace"
      },
      {
        label: "File tree",
        href: "/components/file-tree"
      },
      {
        label: "Process flow",
        href: "/components/process-flow"
      },
      {
        label: "Terminal transcript",
        href: "/components/terminal-transcript"
      },
      {
        label: "Page outline",
        href: "/components/page-outline"
      }
    ]
  }
];
export function createPackageReferencePage(slug) {
  const page = document.createElement("docs-package-reference-page");
  page.setAttribute("package", slug);
  return page;
}
defineComponent("docs-package-reference-page", {
  props: {
    package: "string"
  },
  template: ({ package: packageSlug })=>{
    const doc = packageReferences.find((item)=>item.slug === packageSlug) ?? packageReferences[0];
    const previousIndex = (packageReferences.indexOf(doc) + packageReferences.length - 1) % packageReferences.length;
    const nextIndex = (packageReferences.indexOf(doc) + 1) % packageReferences.length;
    const previous = packageReferences[previousIndex];
    const next = packageReferences[nextIndex];
    return html`
      <article class="docs-page">
        <p class="page-eyebrow">${doc.kind} · vendor/${doc.slug}</p>
        <h1>${doc.name}</h1>
        <p class="page-lead">${doc.description}</p>

        <nav class="component-doc-nav" aria-label="Vendor package references">
          ${repeat(packageReferences, (item)=>item.slug, (item)=>html`
              <a href=${`/packages/${item.slug}`} aria-current=${item.slug === doc.slug ? "page" : null}>${item.name}</a>
            `)}
        </nav>

        <h2>Quick start</h2>
        <p>${doc.summary}</p>
        <p>Public entrypoint: <code>${doc.importPath}</code></p>
        ${renderCodeExample(doc.quickStart)}
        ${doc.context ? html`<p>${doc.context}</p>` : null}

        ${repeat(doc.sections, (section)=>section.title, (section)=>{
      const rows = section.rows.map(([symbol, signature, contract])=>({
          symbol,
          signature,
          contract
        }));
      return html`
            <section>
              <h2>${section.title}</h2>
              <p>${section.description}</p>
              <div class="api-table-wrap">
                <table class="api-table">
                  <thead>
                    <tr>
                      <th scope="col">Export / option</th>
                      <th scope="col">Signature</th>
                      <th scope="col">Contract</th>
                    </tr>
                  </thead>
                  <tbody>${repeat(rows, (row)=>row.symbol, (row)=>html`
                      <tr>
                        <td><code>${row.symbol}</code></td>
                        <td><code>${row.signature}</code></td>
                        <td>${row.contract}</td>
                      </tr>
                    `)}</tbody>
                </table>
              </div>
              ${repeat(section.lessons ?? [], (lesson)=>lesson.title, (lesson)=>html`
                    <div class="learning-step">
                      <h3>${lesson.title}</h3>
                      <p>${lesson.explanation}</p>
                      ${renderCodeExample(lesson.code)}
                    </div>
                  `)}
            </section>
          `;
    })}

        <h2>Examples</h2>
        ${repeat(doc.examples, (example)=>example.title, (example)=>html`
            <section>
              <h3>${example.title}</h3>
              ${example.explanation ? html`<p>${example.explanation}</p>` : null}
              ${renderCodeExample(example.code)}
            </section>
          `)}

        <h2>Behavior and boundaries</h2>
        <ul>${repeat(doc.notes, (note)=>note, (note)=>html`<li>${note}</li>`)}</ul>

        ${doc.related?.length ? html`
            <h2>Detailed references</h2>
            <div class="button-row">${repeat(doc.related, (item)=>item.href, (item)=>html`<a href=${item.href}>${item.label}</a>`)}</div>
          ` : null}

        <p class="page-lead component-pagination">
          <a href=${`/packages/${previous.slug}`}>Previous: ${previous.name}</a>
          <span aria-hidden="true"> · </span>
          <a href=${`/packages/${next.slug}`}>Next: ${next.name}</a>
        </p>
      </article>
    `;
  }
});
