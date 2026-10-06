import { defineComponent, html, repeat } from "../../../../vendor/components/dist/index.js";
import { renderCodeExample } from "./code-example.js";
export const nativeLibraryPages = [
  {
    slug: "overview",
    label: "Native Libraries",
    title: "Build with the platform, not against it.",
    lead: "Nala is a small set of libraries that removes repeated plumbing while keeping the browser's own programming model visible.",
    sections: [
      {
        title: "The browser is already a library",
        paragraphs: [
          "A web application already has a component model, an event system, a network client, a URL model, a history stack, a module loader, and a document tree. These are not theoretical conveniences: they are the APIs the browser knows how to schedule, render, cancel, inspect, and make accessible.",
          "Nala starts from those capabilities. Its packages add the missing repetition around them, but they do not hide the underlying contract. A developer who knows fetch, customElements, EventTarget, and history can understand the corresponding Nala code without learning an entirely separate runtime."
        ]
      },
      {
        title: "Plumbing is useful until it becomes the product",
        paragraphs: [
          "Complex applications still need routing setup, typed attribute conversion, lifecycle cleanup, JSON parsing, timeout handling, subscriptions, and derived state. Repeating that wiring in every app is noise and a source of bugs. Nala centralizes those chores in focused modules with small public APIs.",
          "The boundary stays deliberate: Nala can decide how to clean up a listener, but the browser still dispatches the event; it can normalize a failed response, but fetch still owns the request; it can match a route, but the URL and History APIs still own navigation."
        ],
        code: `const api = new HttpClient({ baseUrl: "/api" });
const router = createRouter(routes);

// The app composes libraries; it does not inherit a framework runtime.
const games = await api.get<Game[]>('/games');`
      },
      {
        title: "Why this is a set of libraries, not a framework",
        paragraphs: [
          "A framework normally owns the application lifecycle and asks the application to fit its rendering, routing, state, and project conventions. Nala keeps those concerns independently importable. You can use the HTTP client without the router, native elements without the optional UI package, or plain browser APIs beside any Nala module.",
          "That makes the app layer the place where product decisions live. Nala supplies reusable answers to common plumbing problems; it does not dictate a component tree, a file convention, a state architecture, or a build system. The result is less magic and more visible composition."
        ]
      }
    ]
  },
  {
    slug: "observables",
    label: "Native Libraries · vendor/observables",
    title: "Callbacks, Set, and publish/subscribe",
    lead: "Observables is the smallest useful stream model built from callbacks, collections, and explicit subscriptions.",
    demo: {
      label: "Publish values and unsubscribe a listener",
      markup: `<button id="emit">Emit value</button><button id="remove">Remove listener</button><output id="out">Ready</output>`,
      script: `const out = document.querySelector("#out"); const listeners = new Set([value => out.textContent += "\\nReceived " + value]); let value = 0;
document.querySelector("#emit").onclick = () => { for (const listener of [...listeners]) listener(++value); };
document.querySelector("#remove").onclick = () => { listeners.clear(); out.textContent += "\\nUnsubscribed"; };`
    },
    sections: [
      {
        title: "Subscription is a callback plus cleanup",
        paragraphs: [
          "A subscriber registers a function and receives a way to remove it. Subject broadcasts synchronously to a Set of observers, making identity and cleanup explicit."
        ],
        code: `const stop = subject.subscribe((game) => render(game));
stop();`
      },
      {
        title: "EventTarget versus typed streams",
        paragraphs: [
          "Use EventTarget for browser interaction, bubbling, cancellation, and Event objects. Use a Subject for a typed application value stream that does not need DOM propagation."
        ],
        code: `button.addEventListener("click", handleClick);
gamesSubject.subscribe((games) => render(games));`
      },
      {
        title: "Cold and hot producers",
        paragraphs: [
          "Observable is cold: each subscriber starts its own producer. Subject is hot: subscribers observe one already-running source. BehaviorSubject additionally replays its current value."
        ],
        code: `const once = new Observable(() => readCollection());
const shared = new Subject<Game[]>();`
      },
      {
        title: "Completion and re-entrancy",
        paragraphs: [
          "Synchronous callbacks run in the publisher's call stack. Snapshot observers before emission so an unsubscribe during next does not skip the next observer; complete clears future work."
        ],
        code: `for (const observer of [...observers]) observer(value);
subject.complete();`
      }
    ]
  },
  {
    slug: "state",
    label: "Native Libraries · vendor/state",
    title: "Closures, identity, and precise updates",
    lead: "State uses functions, closures, Set, and Object.is to make reactive updates explicit.",
    demo: {
      label: "A signal changes only when its identity changes",
      markup: `<button id="change">Change value</button><button id="same">Write same value</button><output id="out">Value: 0 · notifications: 0</output>`,
      script: `let value = 0; let notifications = 0; const out = document.querySelector("#out");
const render = () => out.textContent = "Value: " + value + " · notifications: " + notifications;
document.querySelector("#change").onclick = () => { value += 1; notifications += 1; render(); };
document.querySelector("#same").onclick = render;`
    },
    sections: [
      {
        title: "A signal is a closure",
        paragraphs: [
          "A signal can be built from a getter, a setter, and a set of subscribers. Reading the getter records a dependency; setting it publishes only when Object.is says the value changed."
        ],
        code: `const [count, setCount] = createSignal(0);
const doubled = computed(() => count() * 2);
setCount(4);`
      },
      {
        title: "Identity is the change boundary",
        paragraphs: [
          "JavaScript has no universal definition of meaningful change. Object.is makes the rule precise: the same primitive or object reference is a no-op, while a new object or array is an intentional update."
        ],
        code: `const next = { completed: true };
setState(next);
setState(next); // no second notification`
      },
      {
        title: "Computed values follow reads",
        paragraphs: [
          "computed and effect track signals read during the latest run. This creates a dynamic dependency graph without rendering an entire component tree for every update."
        ],
        code: `const label = computed(() =>
  count() === 0 ? "Empty shelf" : \`\${count()} games\`
);`
      },
      {
        title: "Stores and persistence",
        paragraphs: [
          "A store adds plain state, named actions, immutable commits, selectors, and optional versioned storage. Keep source state in the store and derive filters and counts."
        ],
        code: `const active = store.select(
  (state) => state.games.filter((game) => !game.played),
);`
      },
      {
        title: "Production rules",
        paragraphs: [
          "Return new objects from updates, keep writes in actions, use effects for synchronization, and dispose effects with their owner. Mutation hides the change boundary from observers."
        ],
        code: `update((state) => ({
  ...state,
  games: [...state.games, game],
}));`
      }
    ]
  },
  {
    slug: "http",
    label: "Native Libraries · Fetch API",
    title: "The Fetch API, from first request to streaming response",
    lead: "Fetch is the browser's programmable network boundary: construct a request, receive a response, inspect metadata, consume a body, and decide what success means.",
    demo: {
      label: "Request JSON, inspect headers, and cancel work",
      markup: `<button id="json">Fetch JSON</button><button id="headers">Inspect headers</button><button id="cancel">Abort</button><pre id="result">Ready. Try a request.</pre>`,
      script: `const result = document.querySelector("#result");
document.querySelector("#json").onclick = async () => { const r = await fetch("data:application/json,%7B%22game%22%3A%22Celeste%22%7D"); result.textContent = r.ok + "\\n" + JSON.stringify(await r.json(), null, 2); };
document.querySelector("#headers").onclick = async () => { const r = await fetch("data:text/plain,hello"); result.textContent = r.status + " " + r.headers.get("content-type"); };
document.querySelector("#cancel").onclick = async () => { const c = new AbortController(); c.abort(); try { await fetch("data:text/plain,late", { signal: c.signal }); } catch (e) { result.textContent = e.name + ": request cancelled"; } };`,
      height: 210
    },
    sections: [
      {
        title: "The mental model: request, response, body",
        paragraphs: [
          "fetch(input, init) resolves to a Response when headers arrive. Request describes the outgoing operation, Response describes metadata about what arrived, and the body is a one-use stream."
        ],
        code: `const response = await fetch("/games/zelda");
if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
const game = await response.json();`
      },
      {
        title: "fetch() and its contexts",
        paragraphs: [
          "fetch is global in Window and Worker contexts. It accepts a string, URL, or Request plus an init object containing method, headers, body, mode, credentials, cache, redirect, referrer policy, integrity, keepalive, and signal."
        ],
        code: `const response = await fetch(new URL("/api/games", location.origin), {
  headers: { accept: "application/json" },
});`
      },
      {
        title: "Request: the outgoing contract",
        paragraphs: [
          "Request is inspectable and reusable. Constructing one does not send it. Clone a request when a stream body needs a second consumer or retry."
        ],
        code: `const request = new Request("/api/games", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ title: "Hades" }),
});
const response = await fetch(request);`
      },
      {
        title: "Headers: metadata with rules",
        paragraphs: [
          "Headers is a case-insensitive map. Use set, append, get, has, delete, and iteration. Browsers restrict forbidden request headers; headers are part of HTTP semantics, not arbitrary metadata."
        ],
        code: `const headers = new Headers({ accept: "application/json" });
headers.set("x-client-version", "1");
const response = await fetch("/api/games", { headers });`
      },
      {
        title: "Request bodies: JSON, forms, files, and streams",
        paragraphs: [
          "Bodies can be strings, URLSearchParams, FormData, Blob, buffers, or streams. JSON requires stringify and a content type. FormData creates its own multipart boundary, so do not set that boundary manually."
        ],
        code: `const form = new FormData();
form.append("title", "Sea of Stars");
await fetch("/api/games", { method: "POST", body: form });`
      },
      {
        title: "Response: status, headers, and one-use bodies",
        paragraphs: [
          "Response exposes status, ok, url, redirected, type, headers, body, and bodyUsed. Consume a body once with json, text, blob, formData, or arrayBuffer; clone before creating a second consumer."
        ],
        code: `const response = await fetch("/api/games");
if (response.status === 404) showEmptyState();
const games = await response.json();`
      },
      {
        title: "Streaming bodies and progressive UI",
        paragraphs: [
          "response.body is a ReadableStream. Read chunks progressively with getReader and TextDecoder, preserving decoder state and cancelling the reader when the view leaves."
        ],
        code: `const reader = response.body.getReader();
const decoder = new TextDecoder();
for (;;) {
  const { value, done } = await reader.read();
  if (done) break;
  renderPartial(decoder.decode(value, { stream: true }));
}`
      },
      {
        title: "HTTP errors are not network errors",
        paragraphs: [
          "fetch rejects for transport, CORS, and abort failures, but resolves for 400 and 500 responses. Handle rejected Promises and inspect response.ok separately."
        ],
        code: `try {
  const response = await fetch("/api/games");
  if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
} catch (error) {
  showNetworkOrHttpError(error);
}`
      },
      {
        title: "AbortController, timeouts, and races",
        paragraphs: [
          "Pass signal to fetch to cancel it. AbortController is one-shot. Aborting saves work, but fast-changing searches should also identify the current request before committing its result."
        ],
        code: `const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000);
try { await fetch("/api/games", { signal: controller.signal }); }
finally { clearTimeout(timeout); }`
      },
      {
        title: "Mode, CORS, credentials, and origins",
        paragraphs: [
          "cors, same-origin, and no-cors define cross-origin visibility; the server controls CORS permission. credentials controls cookies and authentication data, and cross-origin credentials require compatible server headers and CSRF protection."
        ],
        code: `await fetch("https://api.example.test/games", {
  mode: "cors",
  credentials: "include",
});`
      },
      {
        title: "Cache, redirects, referrer, and integrity",
        paragraphs: [
          "cache, redirect, referrerPolicy, integrity, and keepalive express browser and HTTP policy. Server cache headers still matter, and keepalive is quota-limited rather than a general upload channel."
        ],
        code: `await fetch("/assets/game-data.json", {
  cache: "no-cache",
  redirect: "error",
  referrerPolicy: "strict-origin-when-cross-origin",
});`
      },
      {
        title: "Service workers and deferred fetch",
        paragraphs: [
          "A service worker can intercept fetch events for offline responses and caching. fetchLater is an experimental deferred request API and should remain an optional enhancement."
        ],
        code: `self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then(
    (cached) => cached ?? fetch(event.request),
  ));
});`
      }
    ]
  },
  /* The previous malformed State/Fetch draft is retained below only as a patch boundary.
  {
    slug: "observables",
    label: "Native Libraries · vendor/observables",
    title: "Callbacks, Set, and the publish/subscribe pattern",
    lead:
      "Observables builds the smallest useful stream model from JavaScript functions and collections, while leaving browser events as ordinary native events.",
    demo: {
      label: "Subscribe, publish, and unsubscribe",
      markup: `<button id="publish">Publish value</button>
<button id="unsubscribe">Unsubscribe second listener</button>
<output id="log" aria-live="polite">No values yet.</output>`,
      script: `const log = document.querySelector("#log");
const listeners = new Set();
const first = (value) => log.textContent += "\\nFirst saw " + value;
const second = (value) => log.textContent += "\\nSecond saw " + value;
listeners.add(first);
listeners.add(second);
let value = 0;
document.querySelector("#publish").onclick = () => {
  value += 1;
  for (const listener of [...listeners]) listener(value);
};
document.querySelector("#unsubscribe").onclick = () => listeners.delete(second);`,
    },
    sections: [
      {
        title: "The native idea: a function that receives a value",
        paragraphs: [
          "At its core, subscription is just registering a callback and receiving an unsubscribe function. Subject adds a collection of callbacks and broadcasts synchronously. Set is a good fit because it gives each observer identity and makes removal explicit.",
          "This is intentionally smaller than an operator ecosystem. There are no schedulers, hidden queues, or asynchronous timing rules: next() calls current observers in the same turn.",
        ],
        code: `const listeners = new Set<(value: Game[]) => void>();
const unsubscribe = (listener) => listeners.delete(listener);

function publish(games: Game[]) {
  for (const listener of [...listeners]) listener(games);
}`,
      },
      {
        title: "How it relates to EventTarget",
        paragraphs: [
          "The browser already provides EventTarget for DOM and application events. Nala does not replace it with a second event system: components continue to use addEventListener and dispatchEvent. Observables is useful when a typed value stream needs a direct TypeScript API, replay, or lazy production rather than an Event object.",
          "That distinction keeps boundaries clear. Use native events for interaction and DOM integration; use Subject or BehaviorSubject for an in-memory stream shared by application code.",
        ],
      },
      {
        title: "Where the library stops",
        paragraphs: [
          "Observable is cold: its producer runs for each subscriber. Subject is hot: all subscribers observe one already-running source. BehaviorSubject adds one native-looking piece of state, value, and immediately replays it to a new subscriber. There is no attempt to model every asynchronous primitive in the platform.",
        ],
      },
      {
        title: "Errors, completion, and re-entrancy",
        paragraphs: [
          "A subscription callback runs synchronously, so an exception is part of the publisher's call stack. Subject snapshots its observers before emission; an observer can unsubscribe during next() without causing the next observer to be skipped. complete() marks the subject closed and clears its listeners.",
          "These details matter when a stream represents a DOM event, a store bridge, or a websocket. Decide who owns error handling and completion; do not assume a Subject is a queue or an error channel.",
        ],
      },
      {
        title: "Choosing the right native boundary",
        paragraphs: [
          "Use EventTarget when the source is a browser interaction or needs bubbling, cancellation, and DevTools-friendly Event objects. Use Subject when a domain value is already in application code. Use Observable when each subscriber should create its own producer, such as an independent read or subscription to a source.",
          "For async iteration, streams, or backpressure, reach for the platform primitive that expresses that contract instead of stretching this small library into a general-purpose reactive runtime.",
        ],
      },
    ],
  },
  {
    slug: "state",
    label: "Native Libraries · vendor/state",
    title: "Closures, identity, and precise updates",
    lead:
      "State uses JavaScript closures, functions, Set, and Object.is to make reads and writes explicit without a virtual DOM or reducer protocol.",
    demo: {
      label: "A signal, a computed value, and an effect",
      markup: `<button id="add">Increase score</button>
<button id="same">Write the same value</button>
<p>Score: <output id="score">0</output></p>
<p>Effect runs: <output id="runs">1</output></p>`,
      script: `let score = 0;
let runs = 1;
        label: "Native Libraries · Fetch API",
        title: "The Fetch API, from first request to streaming response",
const render = () => {
          "Fetch is the browser's programmable network boundary: construct a request, receive a response, inspect its metadata, consume its body, and decide what your application considers successful.",
  runsOutput.value = String(runs++);
          label: "Request JSON, inspect headers, and cancel work",
          markup: `<button id="json">Fetch JSON</button>
    <button id="headers">Inspect headers</button>
    <button id="cancel">Abort delayed request</button>
    <pre id="result">Ready. Try a request.</pre>`,
          script: `let controller;
    const result = document.querySelector("#result");
    document.querySelector("#json").onclick = async () => {
      const response = await fetch("data:application/json,%7B%22game%22%3A%22Celeste%22%7D");
      result.textContent = response.ok + "\\n" + JSON.stringify(await response.json(), null, 2);
    };
    document.querySelector("#headers").onclick = async () => {
      const response = await fetch("data:text/plain,hello");
      result.textContent = "status: " + response.status + "\\ncontent-type: " + response.headers.get("content-type");
    };
    document.querySelector("#cancel").onclick = async () => {
      controller = new AbortController();
      result.textContent = "Waiting...";
      setTimeout(() => controller.abort(), 50);
      try { await new Promise(resolve => setTimeout(resolve, 200)); await fetch("data:text/plain,late", { signal: controller.signal }); }
      catch (error) { result.textContent = error.name + ": request cancelled"; }
    };`,
          height: 250,
      },
      {
        title: "Object.is is the change boundary",
            title: "The mental model: request, response, body",
          "The browser and JavaScript do not provide a universal definition of meaningful state change. Nala chooses Object.is for signals, stores, and derived values. The same reference is therefore a no-op; a new object or array is an intentional update.",
              "fetch(input, init) starts a resource request and returns a Promise that resolves to a Response once response headers arrive. It does not wait for the full body, and it does not reject merely because the server returned 404 or 500.",
              "Think in three layers: Request describes what you are asking for, Response describes what came back, and the body is a one-use stream that you choose to read as text, JSON, a Blob, an ArrayBuffer, or a stream of chunks. That separation is the key to using Fetch confidently.",
        ],
            code: `const response = await fetch("/games/zelda");
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    const game = await response.json();`,
          "computed and effect track the signals read during their latest run. This is a small dependency graph built from function calls, not a component-wide render pass. When nobody observes a computed value, its dependencies can be released.",
          "The store layer uses the same principle for selectors, adding a plain object state shape and action functions for application workflows.",
            title: "The fetch() function and its contexts",
      },
              "fetch is available as a global in Window and Worker contexts, so the same request model can be used by a page, a dedicated worker, or a service worker. In a page, relative URLs resolve against the document URL; absolute URLs can target another origin subject to CORS.",
              "The function accepts a URL string, a URL object, or an existing Request. The optional init object can override properties such as method, headers, body, mode, credentials, cache, redirect, referrer policy, integrity, keepalive, and signal.",
        paragraphs: [
            code: `const url = new URL("/api/games", location.origin);
    const response = await fetch(url, {
      method: "GET",
      headers: { accept: "application/json" },
    });`,
          "Tracking follows the reads from the latest execution. If a computed value reads one signal only when a mode is enabled, the next run can remove that dependency. This is why computed values should be pure and effects should keep side effects at the edge.",
          "A lazy computed value can be read without a permanent subscription. Once observed, Nala shares one memoized computation; after the last observer leaves, it releases its dependency subscriptions.",
            title: "Request: make the outgoing contract explicit",
      },
              "Request is an inspectable description of an outgoing operation. Its url, method, headers, destination, referrer, mode, credentials, cache, redirect, integrity, signal, and bodyUsed-related properties let code and service workers reason about the request before it is sent.",
              "Constructing a Request does not send it. You can clone a Request when you need another body reader or a second attempt, but request and response bodies are streams and generally cannot be consumed twice without cloning first.",
        title: "Stores, selectors, and persistence",
            code: `const request = new Request("/api/games", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Hades" }),
    });
    const response = await fetch(request);`,
        paragraphs: [
          "createStore is the larger application primitive: plain state, named action functions, immutable commits, subscriptions, and selectors. Keep source state in the store and derive counts, filters, and percentages with select or computed.",
            title: "Headers: metadata with rules",
        ],
              "Headers is a case-insensitive map used by both Request and Response. Use set to replace a value, append to add another value, get to read one, has to test presence, and delete to remove a value. Iterating headers is useful for diagnostics and content negotiation.",
              "Browsers restrict certain forbidden request headers and may add or normalize others. Content-Type, Accept, Authorization, caching directives, and conditional request headers are meaningful HTTP decisions, not arbitrary metadata fields.",
        title: "Production rules",
            code: `const headers = new Headers({ accept: "application/json" });
    headers.set("x-client-version", "1");
    if (headers.has("accept")) console.log(headers.get("accept"));

    const response = await fetch("/api/games", { headers });`,
        paragraphs: [
          "Return new objects and arrays from updates, use Object.is as the mental model, and keep actions as the only write path. Avoid mutating a stored object in place: the reference has not changed, so observers have no reliable signal that anything happened.",
            title: "Request bodies: JSON, forms, files, and streams",
        ],
              "A request body can be a string, URLSearchParams, FormData, Blob, ArrayBuffer, typed array, or ReadableStream. JSON is a convention: stringify the value yourself and set content-type to application/json.",
              "FormData is the natural choice for forms and file uploads because the browser creates the multipart boundary. Do not manually set multipart/form-data's boundary header. For streaming uploads, ReadableStream and duplex behavior have browser support constraints, so verify compatibility before depending on them.",
  },
            code: `const form = new FormData();
    form.append("title", "Sea of Stars");
    form.append("cover", fileInput.files[0]);

    await fetch("/api/games", { method: "POST", body: form });`,
  {
    slug: "http",
            title: "Response: status, headers, and one-use bodies",
    title: "Fetch API, with the missing decisions made explicit",
              "Response exposes status, statusText, ok, url, redirected, type, headers, and body. Check ok or status yourself before treating a response as successful. A 404 is a resolved Response, not a rejected Promise.",
              "Read the body with exactly one consumption method: json(), text(), blob(), formData(), or arrayBuffer(). bodyUsed becomes true after consumption begins. Use response.clone() when two independent consumers genuinely need the same body, such as application code and a cache.",
    demo: {
            code: `const response = await fetch("/api/games");
    if (response.status === 404) showEmptyState();
    else if (!response.ok) throw new Error(response.statusText);

    const games = await response.json();`,
          },
          {
            title: "Streaming bodies and progressive UI",
            paragraphs: [
              "Response.body is a ReadableStream when a body is available. Reading with getReader() lets an application process chunks as they arrive instead of waiting for the complete payload. TextDecoder converts byte chunks into text, but a chunk can split a character or a line, so preserve decoder state.",
              "Streams are valuable for large downloads, generated text, progress indicators, and lower time-to-first-content. They also create ownership responsibilities: release the reader, cancel when leaving the view, and handle a stream that ends before the expected format is complete.",
            ],
            code: `const response = await fetch("/api/activity.log");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let text = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
      renderPartial(text);
    }`,
          },
          {
            title: "HTTP errors are not network errors",
            paragraphs: [
              "fetch rejects for failures such as DNS errors, connection failures, blocked CORS requests, or an abort. It resolves for HTTP responses across the status range, including 400 and 500. This distinction is one of the most important Fetch API rules.",
              "A useful boundary handles both: catch rejected Promises for transport failures, then inspect response.ok and parse the error body for application-level failures. Never infer success from Promise resolution alone.",
            ],
            code: `try {
      const response = await fetch("/api/games");
      if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
      return await response.json();
    } catch (error) {
      showNetworkOrHttpError(error);
    }`,
          },
          {
            title: "AbortController, timeouts, and races",
            paragraphs: [
              "Pass an AbortSignal through init.signal to cancel a request. AbortController is one-shot; aborting it rejects fetch with an AbortError. A timeout is an application policy built from a timer and abort, or from AbortSignal.timeout where supported.",
              "Cancellation prevents work from continuing, but it does not solve every stale-result race. When search terms change quickly, abort the previous request and also track which request is current before committing its result.",
      label: "Inspect a native Response and cancel a request",
            code: `const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      const response = await fetch("/api/games", { signal: controller.signal });
      return await response.json();
    } finally {
      clearTimeout(timeout);
    }`,
          },
          {
            title: "Mode, CORS, credentials, and origins",
            paragraphs: [
              "mode controls cross-origin behavior: cors is the normal mode for permitted cross-origin requests, same-origin rejects cross-origin URLs, and no-cors produces an opaque response with deliberately restricted visibility. CORS is enforced by the browser using server response headers; JavaScript cannot bypass it.",
              "credentials controls whether cookies, TLS client certificates, and authentication data participate: omit, same-origin, or include. Cross-origin credentials require compatible server CORS headers and careful CSRF protection. Do not treat credentials as an authentication strategy by itself.",
            ],
            code: `const response = await fetch("https://api.example.test/games", {
      mode: "cors",
      credentials: "include",
      headers: { accept: "application/json" },
    });`,
          },
          {
            title: "Cache, redirects, referrer, and integrity",
            paragraphs: [
              "cache selects how the browser's HTTP cache participates, with choices such as default, no-store, reload, no-cache, force-cache, and only-if-cached. The server's cache headers still matter. redirect can follow, error, or expose a redirect response where permitted.",
              "referrer and referrerPolicy control what referrer information is sent. integrity lets a resource request verify a cryptographic hash, especially for static assets. keepalive allows small requests to continue during page dismissal, but it has quotas and is not a general background upload mechanism.",
            ],
            code: `await fetch("/assets/game-data.json", {
      cache: "no-cache",
      redirect: "error",
      referrerPolicy: "strict-origin-when-cross-origin",
      integrity: "sha256-BASE64_HASH_HERE",
    });`,
          },
          {
            title: "Service workers and deferred fetch",
            paragraphs: [
              "A service worker can intercept fetch events, serve cached responses, provide offline fallbacks, and populate a cache while keeping page code on the normal fetch contract. The service worker is a separate lifecycle and security boundary; register it deliberately and version its caches.",
              "The newer fetchLater() API can request a deferred fetch that may be sent later or when a page is closed or navigated away from. It is experimental and quota-controlled, so treat it as an optional enhancement rather than a replacement for ordinary fetch or send-beacon-style telemetry.",
            ],
            code: `self.addEventListener("fetch", (event) => {
      event.respondWith(
        caches.match(event.request).then((cached) =>
          cached ?? fetch(event.request)
        ),
      );
    });`,
      markup: `<button id="request">Run request</button>
<button id="cancel">Cancel</button>
<pre id="result">Idle</pre>`,
      script: `let controller;
const result = document.querySelector("#result");
document.querySelector("#request").onclick = async () => {
  controller = new AbortController();
  result.textContent = "Requesting...";
  try {
    const response = await fetch("data:application/json,%7B%22ok%22%3Atrue%7D", { signal: controller.signal });
    result.textContent = response.status + " " + JSON.stringify(await response.json());
  } catch (error) { result.textContent = error.name + ": " + error.message; }
};
document.querySelector("#cancel").onclick = () => controller?.abort();`,
    },
    sections: [
      {
        title: "Fetch already does the network work",
        paragraphs: [
          "fetch returns a Promise<Response>, supports standard RequestInit options, and exposes streaming response primitives. Nala does not invent a transport or hide those browser types. HttpClient mainly chooses a base URL, serializes JSON bodies, parses JSON responses, and returns typed results.",
        ],
        code: `const game = await api.get<Game>("/games/zelda");
const saved = await api.post<Game>("/games", {
  body: { title: "The Legend of Zelda" },
});`,
      },
      {
        title: "Errors and cancellation are platform concepts",
        paragraphs: [
          "fetch does not reject merely because a server returns 404 or 500. HttpError adds response context for that case. AbortController remains the cancellation primitive, and HttpTimeoutError only identifies the special case where Nala's timer caused the abort; an external abort stays an ordinary abort.",
          "This preserves an important fetch distinction: a completed HTTP response is not the same thing as a transport failure.",
        ],
      },
      {
        title: "Interceptors are a narrow convenience",
        paragraphs: [
          "Request and response interceptors are ordered functions over Request-like and Response values. They are useful for auth headers, tracing, or a shared envelope, but the client does not create a global service container or a second request DSL. fetch remains injectable so tests can use deterministic stubs.",
        ],
      },
      {
        title: "Request construction",
        paragraphs: [
          "A Request has a URL, method, headers, body, credentials, cache policy, mode, redirect behavior, and signal. Headers is case-insensitive and can be composed from HeadersInit. A body can be text, JSON, FormData, URLSearchParams, a Blob, or a stream; JSON is only one application convention.",
          "HttpClient deliberately serializes an object body as JSON and adds content-type when the caller has not supplied it. For uploads or streaming bodies, use the native fetch options directly or extend the client without pretending every body is JSON.",
        ],
      },
      {
        title: "Response handling and status semantics",
        paragraphs: [
          "Response.ok covers 200 through 299, but a response can still be a redirect, an empty 204, or a non-JSON content type. A response body is consumable once: json(), text(), blob(), and arrayBuffer() read it. HttpClient chooses JSON when the content type says so and text otherwise.",
          "Always inspect status and content type at the boundary. A successful HTTP response can contain an application-level error, while a failed status can contain useful structured error data.",
        ],
      },
      {
        title: "Cancellation, timeouts, and races",
        paragraphs: [
          "AbortController is one-shot. Pass its signal into every operation that should stop together, and treat AbortError as a normal control-flow result when the user navigates away. A timeout is an application policy implemented with setTimeout plus abort, not a special fetch protocol.",
          "When replacing an in-flight request, abort the old controller before starting the new one or tag results with a request identity. Cancellation prevents wasted work, but it does not automatically prevent every stale-result race in application code.",
        ],
      },
    ],
  },
  */
  {
    slug: "components",
    label: "Native Libraries · vendor/components",
    title: "Custom Elements, DOM templates, and lifecycle",
    lead: "Components removes repetitive Custom Elements ceremony while retaining native elements, slots, events, attributes, and DOM nodes as the component model.",
    demo: {
      label: "A real Custom Element with an attribute and event",
      markup: `<game-badge game="Celeste"></game-badge>
<button id="change">Change attribute</button>
<output id="event">No custom event yet.</output>`,
      script: `customElements.define("game-badge", class extends HTMLElement {
  connectedCallback() { this.innerHTML = "<strong>" + this.getAttribute("game") + "</strong>"; }
});
document.querySelector("#change").onclick = () => {
  const badge = document.querySelector("game-badge");
  badge.setAttribute("game", "Hades");
  document.querySelector("#event").textContent = "The DOM changed; an app event could be dispatched here.";
};`
    },
    sections: [
      {
        title: "Custom Elements are the component boundary",
        paragraphs: [
          "customElements.define, HTMLElement, connectedCallback, and disconnectedCallback already provide registration and lifecycle. defineComponent packages the recurring parts: typed reflected props, a template, optional Shadow DOM, and lifecycle context helpers.",
          "The browser still owns upgrade timing, connection, DOM tree membership, and event propagation. There is no virtual DOM reconciliation layer to keep in sync with the real document."
        ],
        code: `defineComponent("game-card", {
  props: { title: "string", selected: "boolean" },
  template: ({ title }) => html\`<h2>\${title}</h2>\`,
});`
      },
      {
        title: "DOM, templates, and slots stay visible",
        paragraphs: [
          "Nala renders into a real root with document.createElement, template.content, text nodes, and attributes. Reactive parts update the relevant node or property instead of rebuilding the whole component. repeat preserves keyed DOM ranges for collections.",
          "Native slot elements provide composition. Native properties such as value and checked are written as properties, while attributes remain the right tool for serialized configuration."
        ]
      },
      {
        title: "Lifecycle helpers solve cleanup plumbing",
        paragraphs: [
          "EventTarget listeners, AbortController, and signal subscriptions are easy to attach and easy to leak. The component context groups them into a connection scope: listeners stop first on disconnect, then effects and cleanup callbacks run. Reconnection receives a fresh scope."
        ]
      },
      {
        title: "Attributes and properties are different channels",
        paragraphs: [
          "HTML attributes begin as strings and participate in markup, serialization, and CSS selectors. DOM properties can hold objects, booleans, numbers, and live element state. A robust component decides which values are configuration attributes and which are runtime properties.",
          "defineComponent reflects declared string, boolean, and number props. For native controls, write value, checked, and indeterminate as properties; setting only an attribute can leave the live control state wrong."
        ]
      },
      {
        title: "Shadow DOM, Light DOM, and slots",
        paragraphs: [
          "Shadow DOM gives a component a native encapsulation boundary for markup and styles. Light DOM keeps the rendered nodes in the document tree and is often better when application CSS, querying, or server output needs to see them. Neither is universally superior.",
          "Slots are native composition points. The consumer owns the slotted content and the component owns the layout around it. This is less coupled than inventing a component-specific content language."
        ]
      },
      {
        title: "Events and cleanup",
        paragraphs: [
          "CustomEvent carries a detail payload, while bubbles and composed decide whether the event can cross DOM boundaries. Use native addEventListener and dispatchEvent contracts so components remain usable without Nala.",
          "Every listener, effect, observer, and timer needs an owner. Nala's connection scope disposes registered work on disconnect and creates a new scope on reconnect, preventing duplicate listeners and stale references."
        ]
      },
      {
        title: "Rendering without a virtual DOM",
        paragraphs: [
          "The DOM is already a retained tree. Nala's reactive template compiler creates a real template once, records dynamic parts, and updates only the relevant text, attribute, property, event, or keyed repeat range. This keeps focus and node identity stable when a list changes.",
          "The tradeoff is explicitness: application code still chooses when to render and what owns state. That is the price of keeping the browser's DOM model visible."
        ]
      }
    ]
  },
  {
    slug: "router",
    label: "Native Libraries · History API",
    title: "The History API, from first principles to production",
    lead: "The History API lets a document inspect and manipulate the browser's session history, move between entries, and create same-document navigations without replacing the page.",
    demo: {
      label: "pushState, replaceState, popstate, and Back",
      markup: `<p>Current path: <output id="path"></output></p>
    <button id="push">Push /games</button>
    <button id="replace">Replace query</button>
    <button id="back">Back</button>
    <pre id="log">Open the controls to watch history events.</pre>`,
      script: `const path = document.querySelector("#path");
    const log = document.querySelector("#log");
    const update = (message) => { path.textContent = JSON.stringify(history.state); log.textContent += "\\n" + message; };
    update("Initial entry; state is " + JSON.stringify(history.state));
    addEventListener("popstate", (event) => update("popstate; state is " + JSON.stringify(event.state)));
    document.querySelector("#push").onclick = () => { history.pushState({ page: "games" }, "", null); update("pushState created a new entry"); };
    document.querySelector("#replace").onclick = () => { history.replaceState({ page: "library" }, "", null); update("replaceState changed the current entry"); };
    document.querySelector("#back").onclick = () => history.back();`,
      height: 260
    },
    sections: [
      {
        title: "What session history is",
        paragraphs: [
          "A browser tab maintains a session history: an ordered list of entries associated with the documents and same-document states visited in that tab. The active entry is the one currently displayed. The browser's Back and Forward controls move the active position through that list.",
          "The History API is available as the window.history object on the main thread. It is separate from browser history extensions and is not available inside workers or worklets. The current URL is exposed separately through window.location and document.location."
        ],
        code: `history.pushState({}, "", "/games/zelda");
addEventListener("popstate", (event) => {
  console.log(location.href, event.state);
});`
      },
      {
        title: "The History object: properties",
        paragraphs: [
          "history.length is the number of entries in the current session-history list that the document can observe. It is a count, not an index, and it does not tell you how many entries are before or after the current one.",
          "history.state is the state object associated with the active entry. It is null when the active entry has no state. Reading it does not trigger navigation, and its value is separate from the URL.",
          "history.scrollRestoration controls whether the browser automatically restores scroll positions when traversing history. Its values are auto and manual. Manual mode means the application takes responsibility for restoring scroll position."
        ],
        code: `console.log(history.length);
console.log(history.state);
history.scrollRestoration = "manual";`
      },
      {
        title: "Traversal: back, forward, and go",
        paragraphs: [
          "history.back() moves one entry backward, just like the browser Back button. history.forward() moves one entry forward. Both are asynchronous: the active URL and document state change when traversal completes, and a popstate event may then be dispatched.",
          "history.go(delta) moves by a relative number of entries. go(-1) is equivalent to back(), go(1) is equivalent to forward(), and go(0), or go() with no argument, requests a reload. If the requested position does not exist, nothing happens."
        ],
        code: `history.back();
history.forward();
history.go(-2);
history.go(0);`
      },
      {
        title: "pushState: create a same-document entry",
        paragraphs: [
          "history.pushState(state, unused, url) adds a new session-history entry without loading a new document. The active URL changes immediately, but pushState itself does not dispatch popstate. The application must update its visible content after calling it.",
          "The state value is structured-cloned. Store serializable, reasonably small data such as an identifier, tab name, or scroll position; do not store DOM nodes, functions, or a complete application cache. The URL must be same-origin, and relative URLs are resolved against the current document URL.",
          "The middle argument is retained for historical reasons and should be passed as an empty string. The URL argument is optional; omitting it keeps the current URL. Updating the URL does not perform a network request, so refreshing later still requires the server to understand that URL."
        ],
        code: `history.pushState(
  { panel: "details", gameId: "zelda" },
  "",
  "/games/zelda",
);
renderCurrentView();`
      },
      {
        title: "replaceState: update the current entry",
        paragraphs: [
          "history.replaceState(state, unused, url) changes the state and optional URL of the active entry without adding another entry. It is appropriate when correcting the current entry, changing a filter without making Back step through every keystroke, or normalizing an initial URL.",
          "Like pushState, replaceState does not dispatch popstate and does not reload the document. It also applies the same same-origin and structured-clone rules. Choose pushState when the user should be able to traverse to the previous view; choose replaceState when the current entry should be rewritten."
        ],
        code: `history.replaceState(
  { filter: "completed" },
  "",
  "?filter=completed",
);`
      },
      {
        title: "popstate and PopStateEvent",
        paragraphs: [
          "The popstate event is dispatched when the active history entry changes through Back, Forward, or go(), including when the user uses browser controls. Its event.state property contains the state associated with the newly active entry.",
          "pushState and replaceState do not fire popstate. The initial page load does not rely on popstate either, so initialize the view from location and history.state before registering the listener. A listener should read the URL and state, then render the matching view.",
          "The event does not tell you whether the user clicked Back or Forward; it tells you that the active entry changed. Compare application-owned state or maintain an index in each state object if direction matters."
        ],
        code: `addEventListener("popstate", (event) => {
  const url = new URL(location.href);
  render({ path: url.pathname, query: url.searchParams, state: event.state });
});`
      },
      {
        title: "URL rules, security, and failure modes",
        paragraphs: [
          "The URL passed to pushState or replaceState must be same-origin. A cross-origin URL throws a SecurityError; use a normal link or location assignment when leaving the site. Invalid or uncloneable state can throw DataCloneError, and browsers may reject excessively large state objects.",
          "Use URL and URLSearchParams instead of manual string concatenation. Encode user-controlled path segments with encodeURIComponent, validate identifiers after parsing, and do not put secrets in URLs because URLs are logged, copied, bookmarked, and sent in referrers according to browser policy.",
          "History traversal can be unavailable at the requested offset, and navigation may be throttled by the browser. Treat these methods as requests to the browser, not synchronous commands that guarantee a render before the next line runs."
        ]
      },
      {
        title: "Building robust same-document navigation",
        paragraphs: [
          "A typical navigation function updates the URL, updates the document title, renders the new view, and manages focus for accessibility. The popstate handler performs the same render path for Back and Forward. Keep one render function so programmatic and browser navigation cannot drift apart.",
          "If scrollRestoration is manual, record scroll positions in state before leaving and restore them after rendering. For hash fragments, let the browser's fragment navigation work unless the application has a strong reason to coordinate it. For deep links, configure the server to return the application entry point for every client route."
        ],
        code: `function navigate(url, state = {}) {
  history.pushState(state, "", url);
  document.title = "Game Shelf";
  renderCurrentView();
}
addEventListener("popstate", renderCurrentView);
renderCurrentView();`
      }
    ]
  }
];
export function createNativeLibraryPage(slug) {
  const page = document.createElement("docs-native-library-page");
  page.setAttribute("library", slug);
  return page;
}
defineComponent("docs-native-library-page", {
  props: {
    library: "string"
  },
  template: ({ library })=>{
    const page = nativeLibraryPages.find((entry)=>entry.slug === library) ?? nativeLibraryPages[0];
    const packageHref = page.slug === "overview" ? "/packages" : `/packages/${page.slug}`;
    return html`
      <article class="docs-page">
        <p class="page-eyebrow">${page.label}</p>
        <h1>${page.title}</h1>
        <p class="page-lead">${page.lead}</p>
        ${page.demo ? html`
            <div class="layout-demo">
              <p class="layout-demo-label">Live example · ${page.demo.label}</p>
              <iframe
                title=${`Live native API example: ${page.demo.label}`}
                sandbox="allow-scripts allow-same-origin"
                srcdoc=${createNativeDemoDocument(page.demo)}
                style=${`display: block; width: 100%; height: ${page.demo.height ?? 190}px; border: 1px solid #cbcfc8; background: #fffefa;`}
              ></iframe>
            </div>
          ` : ""}
        ${repeat(page.sections, (section)=>section.title, (section)=>html`
            <section>
              <h2>${section.title}</h2>
              ${repeat(section.paragraphs, (paragraph)=>paragraph, (paragraph)=>html`<p>${paragraph}</p>`)}
              <div class="layout-demo">
                <p class="layout-demo-label">Live example · ${section.title}</p>
                <iframe
                  title=${`Live example: ${section.title}`}
                  sandbox="allow-scripts allow-same-origin"
                  srcdoc=${createSectionDemoDocument(page.slug, section.title)}
                  style="display: block; width: 100%; height: 150px; border: 1px solid #cbcfc8; background: #fffefa;"
                ></iframe>
              </div>
              ${section.code ? renderCodeExample(section.code) : ""}
            </section>
          `)}
        <p>
          ${page.slug === "router" ? "Continue with the Native Libraries overview." : html`
              Continue to the
              <a href=${packageHref}>vendor package reference</a>
              or return to the Native Libraries overview.
            `}
          ${page.slug === "router" ? html`<a href="/native-libraries/overview">Open the overview</a>.` : html`<a href="/native-libraries/overview">Open the overview</a>.`}
        </p>
      </article>
    `;
  }
});
function createNativeDemoDocument(demo) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      body { margin: 0; padding: 1rem; background: #fffefa; color: #18201d; font: 1rem/1.5 system-ui, sans-serif; }
      button { margin: 0 .5rem .75rem 0; border: 1px solid #184d3b; border-radius: 4px; padding: .5rem .7rem; background: #d8e8df; color: #10372a; cursor: pointer; }
      output, pre { display: block; white-space: pre-wrap; }
      pre { margin: .5rem 0 0; padding: .7rem; background: #202723; color: #edf4ef; }
      game-badge { display: inline-block; margin-bottom: .75rem; border: 1px solid #184d3b; padding: .5rem .7rem; }
    </style>
  </head>
  <body>
    ${demo.markup}
    <script>${demo.script}</script>
  </body>
</html>`;
}
function createSectionDemoDocument(slug, title) {
  const kind = slug === "observables" ? "observable" : slug === "state" ? "state" : slug === "http" ? "http" : slug === "components" ? "component" : slug === "router" ? "history" : "overview";
  const demos = {
    observable: {
      markup: `<button id="emit">Emit value</button><button id="remove">Remove listener</button><output id="out">Ready</output>`,
      script: `const out = document.querySelector("#out");
const listeners = new Set([value => out.textContent += "\\nListener received " + value]);
let count = 0;
document.querySelector("#emit").onclick = () => { for (const listener of [...listeners]) listener(++count); };
document.querySelector("#remove").onclick = () => { listeners.clear(); out.textContent += "\\nUnsubscribed"; };`
    },
    state: {
      markup: `<button id="change">Change value</button><button id="same">Write same value</button><output id="out">Value: 0 · notifications: 0</output>`,
      script: `let value = 0;
let notifications = 0;
const out = document.querySelector("#out");
const render = () => out.textContent = "Value: " + value + " · notifications: " + notifications;
document.querySelector("#change").onclick = () => { value += 1; notifications += 1; render(); };
document.querySelector("#same").onclick = () => { render(); };`
    },
    http: {
      markup: `<button id="run">Read Response</button><output id="out">No response yet.</output>`,
      script: `document.querySelector("#run").onclick = async () => {
  const response = await fetch("data:text/plain,Hello%20from%20fetch");
  document.querySelector("#out").textContent = response.status + " " + await response.text();
};`
    },
    component: {
      markup: `<demo-badge label="Native element"></demo-badge><button id="change">Change attribute</button>`,
      script: `customElements.define("demo-badge", class extends HTMLElement {
  connectedCallback() { this.render(); }
  static get observedAttributes() { return ["label"]; }
  attributeChangedCallback() { this.render(); }
  render() { this.textContent = this.getAttribute("label"); }
});
document.querySelector("#change").onclick = () => document.querySelector("demo-badge").setAttribute("label", "Attribute changed");`
    },
    history: {
      markup: `<button id="push">Add entry</button><button id="replace">Replace state</button><output id="out">State: null</output>`,
      script: `const out = document.querySelector("#out");
const show = message => out.textContent = message + " · state: " + JSON.stringify(history.state);
document.querySelector("#push").onclick = () => { history.pushState({ step: 1 }, "", null); show("pushState added an entry"); };
document.querySelector("#replace").onclick = () => { history.replaceState({ step: "replaced" }, "", null); show("replaceState changed the entry"); };
addEventListener("popstate", event => show("popstate fired"));`
    },
    overview: {
      markup: `<button id="run">Run native code</button><output id="out">The browser is ready.</output>`,
      script: `document.querySelector("#run").onclick = () => document.querySelector("#out").textContent = "The platform primitive just ran.";`
    }
  };
  const demo = createGameDemo(slug, title, demos[kind]);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
body { margin: 0; padding: 1rem; color: #18201d; font: 1rem/1.5 system-ui, sans-serif; }
button { margin: 0 .5rem .75rem 0; border: 1px solid #184d3b; border-radius: 4px; padding: .5rem .7rem; background: #d8e8df; color: #10372a; cursor: pointer; }
output { display: block; white-space: pre-wrap; }
demo-badge { display: inline-block; margin: 0 .5rem .75rem 0; border: 1px solid #184d3b; border-radius: 4px; padding: .5rem .7rem; }
</style></head><body><p>${title}</p>${demo.markup}<script>${demo.script}</script></body></html>`;
}
function createGameDemo(slug, title, fallback) {
  const button = (id, label)=>`<button id="${id}">${label}</button>`;
  const output = `<output id="out">Game Shelf is ready.</output>`;
  if (slug === "observables") {
    if (title.includes("EventTarget")) {
      return {
        markup: `${button("play", "Mark game played")}${output}`,
        script: `const game = document.querySelector("#play");
game.addEventListener("click", (event) => document.querySelector("#out").textContent = "Native click event: " + event.type + " → Celeste is played");`
      };
    }
    if (title.includes("Cold")) {
      return {
        markup: `${button("load", "Subscribe library panel")}${button("load2", "Subscribe wishlist")}${output}`,
        script: `let reads = 0;
const subscribe = (name) => document.querySelector("#out").textContent = name + " subscribed → collection read #" + (++reads);
document.querySelector("#load").onclick = () => subscribe("Library");
document.querySelector("#load2").onclick = () => subscribe("Wishlist");`
      };
    }
    if (title.includes("Completion")) {
      return {
        markup: `${button("emit", "Add activity")}${button("complete", "Complete feed")}${output}`,
        script: `let closed = false; let count = 0;
document.querySelector("#emit").onclick = () => { if (!closed) document.querySelector("#out").textContent = "Activity " + (++count) + " received"; };
document.querySelector("#complete").onclick = () => { closed = true; document.querySelector("#out").textContent = "Activity feed completed"; };`
      };
    }
  }
  if (slug === "state") {
    if (title.includes("computed")) {
      return {
        markup: `<button id="add">Add game</button>${output}`,
        script: `let games = 0;
document.querySelector("#add").onclick = () => { games += 1; document.querySelector("#out").textContent = "Collection: " + games + " games · derived count updated"; };`
      };
    }
    if (title.includes("Stores")) {
      return {
        markup: `${button("played", "Toggle played filter")}${output}`,
        script: `let playedOnly = false;
document.querySelector("#played").onclick = () => { playedOnly = !playedOnly; document.querySelector("#out").textContent = playedOnly ? "Showing played games" : "Showing full collection"; };`
      };
    }
    if (title.includes("Production")) {
      return {
        markup: `${button("save", "Save game")}${output}`,
        script: `document.querySelector("#save").onclick = () => document.querySelector("#out").textContent = "Action committed: Hades added with a new state reference";`
      };
    }
  }
  if (slug === "http") {
    if (title.includes("mental model")) {
      return {
        markup: `${button("request", "Fetch game card")}${output}`,
        script: `document.querySelector("#request").onclick = async () => { const response = await fetch("data:application/json,%7B%22title%22%3A%22Celeste%22,%22status%22%3A%22backlog%22%7D"); const game = await response.json(); document.querySelector("#out").textContent = "Response arrived → " + game.title + " (" + game.status + ")"; };`
      };
    }
    if (title.includes("contexts")) {
      return {
        markup: `<select id="source"><option>/collection</option><option>Worker: cover-art</option><option>Service worker: offline cache</option></select>${output}`,
        script: `document.querySelector("#source").onchange = (event) => document.querySelector("#out").textContent = "fetch() context selected: " + event.target.value;`
      };
    }
    if (title.includes("Headers")) {
      return {
        markup: `${button("accept", "Set JSON Accept")}${button("auth", "Add session header")}${output}`,
        script: `const headers = new Headers();
document.querySelector("#accept").onclick = () => { headers.set("accept", "application/json"); document.querySelector("#out").textContent = "Accept: " + headers.get("accept"); };
document.querySelector("#auth").onclick = () => { headers.set("x-game-session", "shelf-42"); document.querySelector("#out").textContent = "Headers now include a game session"; };`
      };
    }
    if (title.includes("Request bodies")) {
      return {
        markup: `<input id="title" value="Sea of Stars"><button id="save">Send game</button>${output}`,
        script: `document.querySelector("#save").onclick = () => document.querySelector("#out").textContent = "POST body: { title: \"" + document.querySelector("#title").value + "\" }";`
      };
    }
    if (title.includes("Response")) {
      return {
        markup: `${button("read", "Read game response")}${output}`,
        script: `document.querySelector("#read").onclick = async () => { const response = await fetch("data:application/json,%7B%22title%22%3A%22Hades%22%7D"); document.querySelector("#out").textContent = "status " + response.status + " · " + (await response.json()).title; };`
      };
    }
    if (title.includes("Streaming")) {
      return {
        markup: `${button("stream", "Stream activity log")}${output}`,
        script: `document.querySelector("#stream").onclick = () => { let index = 0; const timer = setInterval(() => { document.querySelector("#out").textContent += (index++ ? "\\n" : "") + "Activity chunk: played game " + index; if (index === 3) clearInterval(timer); }, 180); };`
      };
    }
    if (title.includes("errors")) {
      return {
        markup: `${button("missing", "Request missing game")}${output}`,
        script: `document.querySelector("#missing").onclick = async () => { const response = await fetch("data:text/plain,not-found"); document.querySelector("#out").textContent = "Promise resolved · application status: 404"; };`
      };
    }
    if (title.includes("Abort")) {
      return {
        markup: `${button("search", "Search collection")}${button("cancel", "Cancel search")}${output}`,
        script: `let active = false;
document.querySelector("#search").onclick = () => { active = true; document.querySelector("#out").textContent = "Searching backlog..."; };
document.querySelector("#cancel").onclick = () => { active = false; document.querySelector("#out").textContent = "Search aborted before stale results arrived"; };`
      };
    }
    if (title.includes("Mode") || title.includes("Cache")) {
      return {
        markup: `${button("public", "Load public cover")}${button("private", "Load private notes")}${output}`,
        script: `document.querySelector("#public").onclick = () => document.querySelector("#out").textContent = "Public request: cache allowed";
document.querySelector("#private").onclick = () => document.querySelector("#out").textContent = "Private request: credentials and cache policy matter";`
      };
    }
  }
  if (slug === "components") {
    if (title.includes("Attributes")) {
      return {
        markup: `<game-card title="Celeste"></game-card>${button("change", "Change title")}`,
        script: `customElements.define("game-card", class extends HTMLElement { static get observedAttributes() { return ["title"]; } connectedCallback() { this.render(); } attributeChangedCallback() { this.render(); } render() { this.textContent = "Game card: " + this.getAttribute("title"); } });
document.querySelector("#change").onclick = () => document.querySelector("game-card").setAttribute("title", "Hades");`
      };
    }
    if (title.includes("Events")) {
      return {
        markup: `${button("play", "Play Celeste")}${output}`,
        script: `document.querySelector("#play").onclick = () => document.querySelector("#out").textContent = "game-played event received by the collection";`
      };
    }
    if (title.includes("Rendering")) {
      return {
        markup: `${button("add", "Add keyed game")}${output}`,
        script: `let games = ["Hades", "Celeste"]; const render = () => document.querySelector("#out").textContent = games.join(" · "); render(); document.querySelector("#add").onclick = () => { games = ["Sea of Stars", ...games]; render(); };`
      };
    }
  }
  if (slug === "router") {
    if (title.includes("properties")) {
      return {
        markup: `${button("collection", "Open collection")}${button("wishlist", "Open wishlist")}${output}`,
        script: `document.querySelector("#collection").onclick = () => { history.replaceState({ tab: "collection" }, "", null); document.querySelector("#out").textContent = "state.tab = collection · history length " + history.length; };
document.querySelector("#wishlist").onclick = () => { history.replaceState({ tab: "wishlist" }, "", null); document.querySelector("#out").textContent = "state.tab = wishlist · history length " + history.length; };`
      };
    }
    if (title.includes("replaceState")) {
      return {
        markup: `${button("filter", "Change backlog filter")}${output}`,
        script: `document.querySelector("#filter").onclick = () => { history.replaceState({ filter: "backlog" }, "", null); document.querySelector("#out").textContent = "Current entry rewritten: backlog filter"; };`
      };
    }
    if (title.includes("popstate") || title.includes("Traversal")) {
      return {
        markup: `${button("push", "Visit game details")}${button("back", "Back")}${output}`,
        script: `document.querySelector("#push").onclick = () => { history.pushState({ game: "Hades" }, "", null); document.querySelector("#out").textContent = "Viewing Hades details"; };
document.querySelector("#back").onclick = () => history.back(); addEventListener("popstate", () => document.querySelector("#out").textContent = "Returned to collection");`
      };
    }
    if (title.includes("URL rules") || title.includes("robust")) {
      return {
        markup: `<input id="game" value="zelda"><button id="open">Open game URL</button>${output}`,
        script: `document.querySelector("#open").onclick = () => { const id = encodeURIComponent(document.querySelector("#game").value); history.pushState({ id }, "", null); document.querySelector("#out").textContent = "Safe route state for game: " + id; };`
      };
    }
  }
  return fallback;
}
