import { defineComponent, html, render, repeat } from "../../../../vendor/components/dist/index.js";
import { renderCodeExample } from "./code-example.js";
const tutorialSteps = [
  {
    id: "paths",
    title: "1. Reduce a URL to path segments",
    goal: "Compare static paths without involving browser history or the DOM.",
    paragraphs: [
      "A router answers a small first question: does the current path belong to this route pattern? Nala works with pathnames such as /games and /games/g-17. Splitting on / and removing empty pieces turns a path into segments that can be compared in order.",
      "Filtering empty segments means /games, /games/, and //games// all produce the same single segment. The root path produces an empty array. Exact segment counts prevent /games/:id from accidentally matching /games or /games/g-17/edit.",
      "This layer is deliberately independent of location, history, links, and components. A pure function is easy to understand and deterministic to test in Deno."
    ],
    points: [
      "Static segments must match exactly and are case-sensitive.",
      "Trailing and repeated slashes are ignored by the current splitter.",
      "Query strings are not parsed here; createBrowserHistoryAdapter supplies location.pathname only."
    ],
    code: `function splitPath(path: string): string[] {
  return path.split("/").filter((segment) => segment.length > 0);
}

function matchesStaticPath(pattern: string, path: string): boolean {
  const expected = splitPath(pattern);
  const actual = splitPath(path);
  if (expected.length !== actual.length) return false;

  for (let index = 0; index < expected.length; index++) {
    if (expected[index] !== actual[index]) return false;
  }
  return true;
}

matchesStaticPath("/games", "/games"); // true
matchesStaticPath("/games", "/games/g-17"); // false
matchesStaticPath("/", "/"); // true`,
    checkpoint: "Deno: test an exact match, a different static segment, too few/many segments, root, trailing slashes, and repeated slashes."
  },
  {
    id: "params",
    title: "2. Extract named parameters",
    goal: "Reach the exact matchRoute implementation.",
    paragraphs: [
      "A pattern segment beginning with : is a named placeholder. Instead of comparing that segment literally, matchRoute stores the actual segment under the name after the colon. Static and parameter segments can be mixed in one pattern.",
      "Path segments are URL encoded. decodeURIComponent turns g%2017 into g 17 before application code receives it. Invalid percent encoding throws a URIError because the implementation does not catch decoding failures.",
      "The returned object contains only params. The caller already knows which route definition it was checking. A null result distinguishes no match from a successful route with no parameters."
    ],
    points: [
      "The same param name appearing twice is overwritten by the later segment.",
      "An empty name such as : creates an empty-string object key; route authors should avoid it.",
      "Matching remains exact by segment count."
    ],
    code: `interface RouteMatch {
  params: Record<string, string>;
}

function matchRoute(pattern: string, path: string): RouteMatch | null {
  const patternSegments = splitPath(pattern);
  const pathSegments = splitPath(path);
  if (patternSegments.length !== pathSegments.length) return null;

  const params: Record<string, string> = {};
  for (let index = 0; index < patternSegments.length; index++) {
    const patternSegment = patternSegments[index];
    const pathSegment = pathSegments[index];
    if (patternSegment.startsWith(":")) {
      params[patternSegment.slice(1)] = decodeURIComponent(pathSegment);
    } else if (patternSegment !== pathSegment) {
      return null;
    }
  }
  return { params };
}

matchRoute("/games/:id", "/games/g-17");
// { params: { id: "g-17" } }`,
    checkpoint: "Deno: run route-matcher.test.ts. Its six tests cover static, missing, extra, single/multiple parameter, decoded, and root paths."
  },
  {
    id: "history-boundary",
    title: "3. Put browser history behind an adapter",
    goal: "Make navigation logic testable without location or history globals.",
    paragraphs: [
      "A router needs to read the current path, push a new path, and hear browser back/forward changes. HistoryAdapter names only those three capabilities. Router logic can depend on this interface instead of reaching directly into global browser state.",
      "The browser adapter reads location.pathname, calls history.pushState, and registers a popstate listener on globalThis. pushState changes the address bar but does not emit popstate; the router must publish its own programmatic navigation separately.",
      "Deno has no browser location or history. The internal fake stores a path in a closure and keeps popstate listeners in a Set. firePopState changes the path and synchronously invokes listeners, giving tests deterministic back/forward behavior."
    ],
    points: [
      "The adapter is a browser boundary, not a second routing system.",
      "onPopState returns cleanup even though createRouter currently keeps its listener for the router lifetime.",
      "The fake is internal test support and is not exported from index.ts."
    ],
    code: `interface HistoryAdapter {
  getPath(): string;
  pushPath(path: string): void;
  onPopState(listener: () => void): () => void;
}

function createFakeHistoryAdapter(initialPath: string) {
  let path = initialPath;
  const listeners = new Set<() => void>();

  return {
    getPath: () => path,
    pushPath: (next: string) => {
      path = next;
    },
    onPopState: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    firePopState: (next: string) => {
      path = next;
      for (const listener of listeners) listener();
    },
  };
}`,
    checkpoint: "Deno: create the fake at /, push /games, subscribe to popstate, fire /wishlist, then unsubscribe and prove a later popstate no longer calls that listener."
  },
  {
    id: "router-core",
    title: "4. Resolve routes and publish navigation",
    goal: "Combine ordered route definitions, history, and current route state.",
    paragraphs: [
      "A RouteDefinition pairs a path pattern with an application-chosen component value. The router is generic: tests use strings, while the browser outlet later uses functions returning Nodes. resolve checks definitions from first to last and returns the first match.",
      "Route order therefore matters. Put /games/export before /games/:id if export is a literal page; otherwise the parameter route wins with id equal to export. An unmatched path remains a valid ActiveRoute with empty params and component null.",
      "BehaviorSubject stores and immediately replays the current ActiveRoute. current reads its value. navigate ignores an identical path, otherwise pushes history and publishes the resolved route. A popstate callback reads the adapter path once and makes the same strict comparison before resolving: unchanged paths retain the existing snapshot and do not notify.",
      "Native fragment navigation can emit popstate even though location.pathname stays the same; query-only history entries can do the same. const path captures the adapter's current string. The equality guard returns before resolve constructs a new object and BehaviorSubject publishes it. This preserves a connected Game Shelf editor or tutorial iframe during section scrolling. Back/Forward to a different pathname still resolves and publishes, even if it selects the same component with different params."
    ],
    points: [
      "subscribe synchronously receives the current route before it returns.",
      "Same-path navigation is a strict string comparison and causes no push or notification.",
      "Same-path popstate causes no resolution, snapshot replacement, outlet remount or scroll reset; a custom adapter defines the exact path string being compared.",
      "createRouter installs a popstate listener but exposes no router disposer today."
    ],
    code: `type RouteDefinition<Component> = {
  path: string;
  component: Component;
};

type ActiveRoute<Component> = {
  path: string;
  params: Record<string, string>;
  component: Component | null;
};

function resolve<Component>(
  routes: RouteDefinition<Component>[],
  path: string,
): ActiveRoute<Component> {
  for (const route of routes) {
    const match = matchRoute(route.path, path);
    if (match) {
      return { path, params: match.params, component: route.component };
    }
  }
  return { path, params: {}, component: null };
}

const changes = new BehaviorSubject(resolve(routes, history.getPath()));
history.onPopState(() => {
  const path = history.getPath();
  if (path === changes.value.path) return;
  changes.next(resolve(routes, path));
});`,
    checkpoint: "Deno: inject the fake history and verify initial resolution, immediate subscription replay, navigation, same-path suppression, unmatched routes, and simulated popstate. Repeated same-path popstate must preserve current by reference and notify zero extra times, including for an unmatched path; a changed parameter path must still notify. In a browser, follow a section fragment and Back/Forward within that pathname without remounting, then navigate to another pathname and verify normal outlet replacement."
  },
  {
    id: "click-decision",
    title: "5. Decide which link clicks belong to the SPA",
    goal: "Preserve normal browser behavior before adding a DOM listener.",
    paragraphs: [
      "Intercepting every anchor click would break expected browser features. shouldInterceptLinkClick receives plain data and rejects clicks that another handler already prevented, non-left clicks, modifier clicks, missing hrefs, non-self targets, downloads, cross-origin links, and same-page fragments.",
      "Keeping this decision pure makes every branch testable in Deno. It also makes the policy readable as a sequence of guard clauses instead of hiding it among DOM traversal and URL parsing.",
      "The optional isSamePageFragment flag preserves native in-page scrolling when pathname and search already match and the original href contains #. A fragment on a different pathname remains eligible for interception by this decision layer."
    ],
    points: [
      "Command/Ctrl-click and middle-click must remain available for new tabs.",
      "download is checked for attribute presence, so an empty string still means download.",
      "target=_self is eligible; any other non-empty target remains native."
    ],
    code: `function shouldInterceptLinkClick(info: LinkClickInfo): boolean {
  if (info.defaultPrevented) return false;
  if (info.button !== 0) return false;
  if (info.hasModifierKey) return false;
  if (!info.href) return false;
  if (info.target && info.target !== "_self") return false;
  if (info.download !== null) return false;
  if (!info.isSameOrigin) return false;
  if (info.isSamePageFragment) return false;
  return true;
}

shouldInterceptLinkClick({
  href: "/games/g-17",
  target: null,
  download: null,
  hasModifierKey: false,
  button: 0,
  isSameOrigin: true,
  defaultPrevented: false,
}); // true`,
    checkpoint: "Deno: run link-interceptor.test.ts. Its nine tests exercise the one accepted path and every rejection guard."
  },
  {
    id: "link-wiring",
    title: "6. Attach the decision to real anchor clicks",
    goal: "Navigate eligible links without a page reload.",
    paragraphs: [
      'attachLinkInterceptor adds one delegated click listener to a Document. It starts from event.target and uses closest("a") to find an ancestor anchor. The current implementation does not inspect event.composedPath(), so links inside a separate Shadow Root are not discovered by a listener on document.',
      "A native URL resolves relative hrefs and provides origin, pathname, search, and hash data. Only after the pure decision returns true does the handler prevent the browser default and call router.navigate.",
      "Navigation passes url.pathname only. Query strings and hashes are not forwarded to createRouter. In particular, an eligible cross-page link containing a hash loses that hash; a same-path link whose search differs can be prevented but collapse to same-path no-op. Use native links or extend the router deliberately when query/hash routing is required."
    ],
    points: [
      "The root parameter defaults to document and is injectable for focused browser scopes.",
      "The returned function removes exactly the installed click listener.",
      "External, download, target, modified, and same-page-fragment links remain native."
    ],
    code: `function attachLinkInterceptor(
  router: { navigate(path: string): void },
  root: Document = document,
): () => void {
  function onClick(event: MouseEvent): void {
    const target = event.target as Element | null;
    const anchor = target?.closest?.("a");
    if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;

    const url = new URL(anchor.href, location.href);
    const info = readLinkClickInfo(anchor, url, event);
    if (!shouldInterceptLinkClick(info)) return;

    event.preventDefault();
    router.navigate(url.pathname);
  }

  root.addEventListener("click", onClick);
  return () => root.removeEventListener("click", onClick);
}`,
    checkpoint: "Browser: click a plain internal link and confirm no document reload. Then verify modified, external, download, target=_blank, and same-page fragment links retain native behavior."
  },
  {
    id: "outlet",
    title: "7. Mount route components in a native outlet",
    goal: "Swap real Nodes as ActiveRoute values change.",
    paragraphs: [
      "RouterOutlet is a plain Custom Element because its router is a live object property, not a string attribute. RouteComponent is a factory returning a Node. Assigning router tears down an old subscription and subscribes immediately when the outlet is connected.",
      "Each route update removes the previously mounted Node, calls the new factory when component is non-null, appends its result, and scrolls the global page to the top. An unmatched route therefore empties the outlet. Removed page nodes are not cached and lose their local DOM state.",
      "BehaviorSubject already replays the current route during subscribe. #subscribeAndRender uses that replay as the only initial render; a second explicit render would run the factory twice and immediately tear down the first page. connectedCallback only subscribes when no subscription already exists: a parent's connection callback may assign router while the outlet is already connected. Disconnect unsubscribes; reconnect subscribes again and mounts the current route once because the router property remains assigned. The boundary test counts factories during connect, repeated connect callbacks, navigation, detached updates, and reconnect; the core-only tutorial also checks this with a real outlet."
    ],
    points: [
      "Component factories receive no params; app code reads router.current.params or uses another app-owned handoff.",
      "defineRouterOutlet is idempotent because it checks customElements.get first.",
      "Actual Custom Elements, Node mounting, and scrolling require browser verification."
    ],
    code: `type RouteComponent = () => Node;

class RouterOutlet extends HTMLElement {
  #router: Router<RouteComponent> | null = null;
  #unsubscribe: (() => void) | null = null;
  #mounted: Node | null = null;

  set router(router: Router<RouteComponent> | null) {
    this.#unsubscribe?.();
    this.#unsubscribe = null;
    this.#router = router;
    if (router && this.isConnected) this.#subscribeAndRender(router);
  }

  connectedCallback(): void {
    if (this.#router && !this.#unsubscribe) this.#subscribeAndRender(this.#router);
  }

  #subscribeAndRender(router: Router<RouteComponent>): void {
    this.#unsubscribe = router.subscribe((route) => this.#renderRoute(route));
  }

  disconnectedCallback(): void {
    this.#unsubscribe?.();
    this.#unsubscribe = null;
  }

  #renderRoute(route: ActiveRoute<RouteComponent>): void {
    if (this.#mounted) this.removeChild(this.#mounted);
    this.#mounted = route.component ? route.component() : null;
    if (this.#mounted) this.appendChild(this.#mounted);
    globalThis.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }
}`,
    checkpoint: "Browser: assign a router, navigate between two factories, verify old-node removal and scroll reset, navigate unmatched, then disconnect/reconnect and verify updates resume."
  },
  {
    id: "integration",
    title: "8. Assemble the complete browser workflow",
    goal: "Register routes, connect the outlet, intercept links, and publish one API.",
    paragraphs: [
      "The application defines route component factories, creates one router, assigns it to the outlet, and attaches link interception. These are explicit steps: importing the package does not modify document clicks or register the outlet automatically.",
      "The entrypoint exports runtime functions/classes and uses export type for TypeScript-only contracts. The fake history adapter remains internal because production consumers should inject their own adapter only when they need a different platform boundary.",
      "Tests cover matching, router state, and pure click policy in Deno. The thin browser wiring and RouterOutlet require a real browser workflow like the one running this documentation site."
    ],
    points: [
      "Keep ordinary anchors so navigation still has native semantics before JavaScript starts.",
      "Call the interceptor cleanup when the application shell is disposed.",
      "Route factories may close over the router when they need current params."
    ],
    code: `defineRouterOutlet();

const routes: Array<{
  path: string;
  component: RouteComponent;
}> = [
  { path: "/", component: () => document.createElement("home-page") },
  {
    path: "/games/:id",
    component: () => {
      const page = document.createElement("game-detail-page");
      page.setAttribute("game-id", router.current.params.id);
      return page;
    },
  },
];

const router = createRouter(routes);
const outlet = document.querySelector("router-outlet") as RouterOutlet;
outlet.router = router;
const stopIntercepting = attachLinkInterceptor(router);`,
    checkpoint: "Browser: load a deep link directly, navigate through anchors, inspect params, use back/forward, test an unmatched path, and confirm there are no failed requests or console errors."
  }
];
const sourceFiles = [
  {
    path: "vendor/router/src/route-matcher.ts",
    role: "Pure static/parameter path matching.",
    test: false
  },
  {
    path: "vendor/router/src/history-adapter.ts",
    role: "Injectable browser History API boundary.",
    test: false
  },
  {
    path: "vendor/router/src/internal/fake-history-adapter.ts",
    role: "In-memory history and popstate simulation for tests.",
    test: false
  },
  {
    path: "vendor/router/src/router.ts",
    role: "Route resolution, current state, navigation, and popstate updates.",
    test: false
  },
  {
    path: "vendor/router/src/link-interceptor.ts",
    role: "Pure click policy and delegated document wiring.",
    test: false
  },
  {
    path: "vendor/router/src/router-outlet.ts",
    role: "Custom Element route-component mounting lifecycle.",
    test: false
  },
  {
    path: "vendor/router/src/index.ts",
    role: "Supported public package exports.",
    test: false
  },
  {
    path: "vendor/router/src/route-matcher.test.ts",
    role: "Path matching and parameter promises.",
    test: true
  },
  {
    path: "vendor/router/src/router.test.ts",
    role: "Initial, programmatic, repeated and changed-path popstate promises, including reference identity and no notifications on matched/unmatched same-path events.",
    test: true
  },
  {
    path: "vendor/router/src/router-outlet.test.ts",
    role: "Counts exactly one factory per connection/navigation and verifies detached updates stop. A lightweight boundary fake does not simulate browser layout.",
    test: true
  },
  {
    path: "vendor/router/src/link-interceptor.test.ts",
    role: "Every pure click-interception decision branch.",
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
      Deno covers pure matching, router state, fake history, and click policy.
      Browser-only outlet and DOM interception behavior is covered by the
      checkpoints and real-browser verification.
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
function routerOutput(event) {
  return event.currentTarget.closest("[data-live-example]").querySelector("[data-live-output]");
}
function renderRouterLiveExample(id) {
  switch(id){
    case "paths":
      return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · exact path matching</p>
          <label>Pattern <input data-pattern value="/games/:id"></label>
          <label>Path <input data-path value="/games/g-17"></label>
          <button @click=${(event)=>{
        const root = event.currentTarget.closest("[data-live-example]");
        const pattern = root.querySelector("[data-pattern]").value;
        const path = root.querySelector("[data-path]").value;
        routerOutput(event).textContent = pattern.split("/").filter(Boolean).length === path.split("/").filter(Boolean).length ? "segment count matches; compare each segment" : "no match: segment counts differ";
      }}>Match path</button>
          <output data-live-output aria-live="polite">Try a pattern and path.</output>
        </div>
      `;
    case "params":
      return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · named parameter extraction</p>
          <label>Path <input data-param-path value="/games/g%2017"></label>
          <button @click=${(event)=>{
        const value = event.currentTarget.closest("[data-live-example]").querySelector("[data-param-path]");
        routerOutput(event).textContent = `matchRoute("/games/:id") → params.id = "${decodeURIComponent(value.value.split("/").pop() ?? "")}"`;
      }}>Extract :id</button>
          <output data-live-output
            aria-live="polite">URL-encoded params have not been decoded yet.</output>
        </div>
      `;
    case "history-boundary":
      {
        let path = "/";
        return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · injectable history adapter</p>
          <div
            style="display:flex;align-items:center;gap:.5rem;margin:.75rem 0"><span style="padding:.7rem;background:#d9e9ed">fake history</span><span>→</span><strong data-history-path>/</strong></div>
          <button @click=${(event)=>{
          path = path === "/" ? "/games" : "/";
          const root = event.currentTarget.closest("[data-live-example]");
          root.querySelector("[data-history-path]").textContent = path;
          routerOutput(event).textContent = `pushPath("${path}") changed memory only`;
        }}>pushPath()</button>
          <button @click=${(event)=>{
          path = "/wishlist";
          const root = event.currentTarget.closest("[data-live-example]");
          root.querySelector("[data-history-path]").textContent = path;
          routerOutput(event).textContent = "firePopState() synchronously notified listeners";
        }}>firePopState()</button>
          <output data-live-output aria-live="polite">No history operation yet.</output>
        </div>
      `;
      }
    case "router-core":
      {
        let path = "/";
        return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · active route resolution</p>
          <div
            style="display:flex;gap:.45rem;flex-wrap:wrap;margin:.75rem 0"><span data-route style="padding:.6rem;background:#184d3b;color:white">/</span><span data-component style="padding:.6rem;background:#f2f0e8">HomePage</span></div>
          <button @click=${(event)=>{
          path = path === "/" ? "/games/g-17" : "/";
          const root = event.currentTarget.closest("[data-live-example]");
          root.querySelector("[data-route]").textContent = path;
          root.querySelector("[data-component]").textContent = path === "/" ? "HomePage" : "GameDetailPage (id: g-17)";
          routerOutput(event).textContent = `navigate("${path}") published ActiveRoute`;
        }}>navigate()</button>
          <button @click=${(event)=>{
          routerOutput(event).textContent = "same path ignored: no push or notification";
        }}>navigate same path</button>
          <output data-live-output aria-live="polite">Current route is /.</output>
        </div>
      `;
      }
    case "click-decision":
      return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · link eligibility guards</p>
          <div
            style="display:flex;gap:.5rem;flex-wrap:wrap;margin:.75rem 0"><a href="/games" data-link="internal">Internal link</a><a href="https://example.com" data-link="external">External link</a><a href="/games" data-link="modified">Modified link</a></div>
          <button @click=${(event)=>{
        const root = event.currentTarget.closest("[data-live-example]");
        const link = root.querySelector(`a[data-link="${event.currentTarget.dataset.link ?? "internal"}"]`);
        void link;
        routerOutput(event).textContent = "eligible: left-click, same-origin, no modifier, no download";
      }}>Test eligible policy</button>
          <button data-link="modified" @click=${(event)=>{
        routerOutput(event).textContent = "rejected: modifier or non-left click preserves native behavior";
      }}>Test rejected policy</button>
          <output data-live-output aria-live="polite">Choose a click policy.</output>
        </div>
      `;
    case "link-wiring":
      {
        let path = "/";
        return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · delegated anchor navigation</p>
          <nav
            style="display:flex;gap:.75rem;margin:.75rem 0"><a href="/games" @click=${(event)=>{
          event.preventDefault();
          path = "/games";
          const root = event.currentTarget.closest("[data-live-example]");
          root.querySelector("[data-address]").textContent = path;
          routerOutput(event).textContent = "preventDefault() → router.navigate('/games')";
        }}>Games</a><a href="/wishlist" @click=${(event)=>{
          event.preventDefault();
          path = "/wishlist";
          const root = event.currentTarget.closest("[data-live-example]");
          root.querySelector("[data-address]").textContent = path;
          routerOutput(event).textContent = "preventDefault() → router.navigate('/wishlist')";
        }}>Wishlist</a></nav>
          <strong data-address
            style="display:block;padding:.7rem;background:#f2f0e8">/</strong>
          <output data-live-output aria-live="polite">Click an internal link.</output>
        </div>
      `;
      }
    case "outlet":
      {
        let page = "HomePage";
        return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · RouterOutlet mounts one Node</p>
          <div data-outlet
            style="min-height:3rem;padding:1rem;border:2px solid #315f70;background:#edf5f0;margin:.75rem 0">${page}</div>
          <button @click=${(event)=>{
          page = page === "HomePage" ? "GameDetailPage" : "HomePage";
          const root = event.currentTarget.closest("[data-live-example]");
          root.querySelector("[data-outlet]").textContent = page;
          routerOutput(event).textContent = "old Node removed; new route component appended";
        }}>Navigate outlet</button>
          <button @click=${(event)=>{
          const root = event.currentTarget.closest("[data-live-example]");
          root.querySelector("[data-outlet]").textContent = "(empty unmatched route)";
          routerOutput(event).textContent = "unmatched route: outlet emptied";
        }}>Unmatched route</button>
          <output data-live-output
            aria-live="polite">The outlet mounted HomePage.</output>
        </div>
      `;
      }
    case "integration":
      {
        let index = 0;
        const paths = [
          "/",
          "/games/g-17",
          "/wishlist"
        ];
        return html`
        <div class="layout-demo" data-live-example=${id}>
          <p class="layout-demo-label">Live example · complete browser workflow</p>
          <div
            style="display:flex;align-items:center;gap:.5rem;margin:.75rem 0"><span data-step style="padding:.65rem;background:#d9e9ed">1. route</span><span>→</span><span data-page style="padding:.65rem;background:#eedde4">HomePage</span></div>
          <button @click=${(event)=>{
          index = (index + 1) % paths.length;
          const root = event.currentTarget.closest("[data-live-example]");
          root.querySelector("[data-step]").textContent = `${index + 1}. route`;
          root.querySelector("[data-page]").textContent = index === 0 ? "HomePage" : index === 1 ? "GameDetailPage (id: g-17)" : "WishlistPage";
          routerOutput(event).textContent = `history → router → outlet: ${paths[index]}`;
        }}>Next route</button>
          <button @click=${(event)=>{
          index = index === 0 ? paths.length - 1 : index - 1;
          const root = event.currentTarget.closest("[data-live-example]");
          root.querySelector("[data-step]").textContent = `${index + 1}. route`;
          root.querySelector("[data-page]").textContent = index === 0 ? "HomePage" : index === 1 ? "GameDetailPage (id: g-17)" : "WishlistPage";
          routerOutput(event).textContent = `popstate → router → outlet: ${paths[index]}`;
        }}>Back</button>
          <output data-live-output
            aria-live="polite">Start the complete navigation workflow.</output>
        </div>
      `;
      }
    default:
      return html``;
  }
}
defineComponent("docs-under-the-hood-router-page", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Under the Hood · vendor/router</p>
        <h1>Build the router from URLs and history</h1>
        <p class="page-lead">
          Start with pure path comparison, isolate the browser History API, then
          add route state, native link interception, and a Custom Element outlet
          until the result is Nala's exact router package.
        </p>

        <nala-callout tone="info">
          <span slot="title">Test decisions separately from browser wiring</span>
          Matching, route state, fake history, and click eligibility run in Deno.
          Real location, history, anchors, Custom Elements, Nodes, and scrolling
          require a browser.
        </nala-callout>

        <h2>The navigation path</h2>
        <ol>
          <li>Match a pathname against ordered route definitions.</li>
          <li>Read or change the path through a HistoryAdapter.</li>
          <li>Publish the resolved ActiveRoute to subscribers.</li>
          <li>Preserve native links unless a click is eligible for SPA navigation.</li>
          <li>Mount the active route's Node in router-outlet.</li>
        </ol>
        <p>
          Game, page element names, and application helpers in examples belong to
          Game Shelf. The router owns URL matching and navigation mechanics, not
          application data or page rendering internals.
        </p>

        <nav class="component-doc-nav" aria-label="Router tutorial chapters">
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
              ${renderRouterLiveExample(step.id)}
              <nala-callout tone="success">
                <span slot="title">Working checkpoint</span>
                ${step.checkpoint}
              </nala-callout>
            </section>
          `)}

        <section id="exact-source">
          <h2>9. Reach the exact repository implementation</h2>
          <p>
            The source below is loaded directly from this checkout. Every current
            implementation, internal helper, export, and test line is present, so
            the final comparison cannot silently drift from the package.
          </p>
          <div data-source-archive>
            <p role="status">Loading the exact router source...</p>
          </div>
        </section>

        <section>
          <h2>Where the router deliberately stops</h2>
          <p>
            This package has no nested route tree, query/hash state, route guards,
            lazy module loading, transition scheduler, page cache, server routing,
            or automatic parameter injection. It composes pathname matching,
            native history, ordinary anchors, and Custom Elements explicitly.
          </p>
          <p>
            Continue with the concise
            <a href="/packages/router">Router reference</a> when you need API
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
