import { defineComponent, html, render, repeat } from "../../../../vendor/components/dist/index.js";
import { renderCodeExample } from "./code-example.js";
const tutorialSteps = [
  {
    title: "1. Begin with the browser primitive",
    goal: "Fetch one game and decode its JSON response.",
    explanation: [
      "The browser already knows how to send HTTP requests. fetch(url) returns a Promise<Response>; the Response separates metadata such as status and headers from the body. Calling response.json() reads the body stream and parses its text as JSON.",
      "This first version works, but every caller must remember parsing and error handling. It also hides an important fetch rule: a 404 or 500 still resolves successfully. fetch rejects for network and abort failures, not merely because the server returned an unsuccessful status."
    ],
    code: `type CatalogGame = {
  id: string;
  title: string;
  platform: string;
};

async function getGame(path: string): Promise<CatalogGame> {
  const response = await fetch("https://games.example.test/api" + path);
  if (!response.ok) throw new Error("The catalogue request failed");
  return await response.json() as CatalogGame;
}

const game = await getGame("/games/g-17");`,
    checkpoint: "Working version: GET requests succeed and non-2xx responses fail. The next version removes repeated URL, method, and parsing code."
  },
  {
    title: "2. Put request construction in a client",
    goal: "Create one reusable request method and small verb helpers.",
    explanation: [
      "HttpClient owns values shared by many calls. A constructor accepts an optional base URL and an injectable fetch function. Injection matters because a test can supply a deterministic function instead of changing globalThis.fetch or contacting a real server.",
      "The generic T exists only for TypeScript. Returning Promise<T> describes what the caller expects; it does not prove that remote JSON really has that shape. Runtime validation remains an application responsibility."
    ],
    code: `interface HttpClientConfig {
  baseUrl?: string;
  fetch?: typeof fetch;
}

class HttpClient {
  #baseUrl: string;
  #fetch: typeof fetch;

  constructor(config: HttpClientConfig = {}) {
    this.#baseUrl = config.baseUrl ?? "";
    this.#fetch = config.fetch ?? globalThis.fetch;
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  async request<T>(method: string, path: string): Promise<T> {
    const response = await this.#fetch(this.#baseUrl + path, { method });
    return await response.json() as T;
  }
}`,
    checkpoint: "Working version: callers share configuration and GET delegates to request(). post, put, patch, and delete will use exactly the same delegation pattern."
  },
  {
    title: "3. Describe bodies, headers, and the interceptor boundary",
    goal: "Serialize JSON consistently and let applications transform requests.",
    explanation: [
      "RequestOptions is the caller-facing shape. body is unknown because JSON.stringify accepts many JavaScript values. HeadersInit is the native input type accepted by new Headers(), and BodyInit is the native output type fetch accepts after serialization.",
      "The check uses body !== undefined rather than truthiness, so false, 0, null, and an empty string are all intentional bodies. A new Headers object normalizes every supported header input and lets an interceptor mutate headers through the native API.",
      "Each interceptor may be synchronous or asynchronous. Await works for both and registration order is preserved. The returned HttpRequest becomes the input to the next interceptor, so an interceptor may mutate the current object or return a replacement."
    ],
    code: `interface RequestOptions {
  body?: unknown;
  headers?: HeadersInit;
}

interface HttpRequest {
  url: string;
  method: string;
  headers: Headers;
  body?: BodyInit;
}

type RequestInterceptor =
  (request: HttpRequest) => HttpRequest | Promise<HttpRequest>;

interface HttpClientConfig {
  baseUrl?: string;
  fetch?: typeof fetch;
}

class HttpClient {
  #baseUrl: string;
  #fetch: typeof fetch;
  #requestInterceptors: RequestInterceptor[] = [];

  constructor(config: HttpClientConfig = {}) {
    this.#baseUrl = config.baseUrl ?? "";
    this.#fetch = config.fetch ??
      ((...args: Parameters<typeof fetch>) => globalThis.fetch(...args));
  }

  useRequestInterceptor(interceptor: RequestInterceptor): void {
    this.#requestInterceptors.push(interceptor);
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", path, options);
  }

  post<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("POST", path, options);
  }

  async request<T>(
    method: string,
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const headers = new Headers(options.headers);
    const hasBody = options.body !== undefined;
    if (hasBody && !headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }

    let httpRequest: HttpRequest = {
      url: this.#baseUrl + path,
      method,
      headers,
      body: hasBody ? JSON.stringify(options.body) : undefined,
    };
    for (const interceptor of this.#requestInterceptors) {
      httpRequest = await interceptor(httpRequest);
    }

    const response = await this.#fetch(httpRequest.url, {
      method: httpRequest.method,
      headers: httpRequest.headers,
      body: httpRequest.body,
    });
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    return await response.json() as T;
  }
}`,
    checkpoint: "Working version: JSON bodies, custom headers, and ordered request interceptors all reach fetch in one normalized request object."
  },
  {
    title: "4. Combine timeouts with caller cancellation",
    goal: "Abort one fetch for either reason without confusing the two outcomes.",
    explanation: [
      "A request can stop because Nala's timer elapsed or because application code aborted its own signal. One internal AbortController gives fetch a single signal. The timer and the external signal both forward cancellation to that controller.",
      "Check signal.throwIfAborted before request construction and again after asynchronous request interceptors. A canceled view must not send a request merely because its abort happened before the listener was installed. The timer checks the internal signal before aborting: the first cancellation wins. A caller cancellation therefore preserves its reason even if transport rejection arrives late. finally clears the timer and removes the named caller listener on either success or failure.",
      "After await fetch, checking the internal signal also rejects a transport that incorrectly resolved despite cancellation. The timer and forwarding listener cover fetch settlement only, not response interceptors or body decoding. These are deliberate scope boundaries, not a deadline for the entire method.",
      "Per-request timeoutMs uses the nullish-coalescing operator. A supplied value, including 0, wins; otherwise the client's default is used. When neither exists no timer is scheduled."
    ],
    code: `class HttpTimeoutError extends Error {
  constructor(readonly url: string, readonly timeoutMs: number) {
    super(\`Request to \${url} timed out after \${timeoutMs}ms\`);
    this.name = "HttpTimeoutError";
  }
}

interface RequestOptions {
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
  timeoutMs?: number;
}

interface HttpClientConfig {
  baseUrl?: string;
  timeoutMs?: number;
  fetch?: typeof fetch;
}

class HttpClient {
  #baseUrl: string;
  #defaultTimeoutMs?: number;
  #fetch: typeof fetch;

  constructor(config: HttpClientConfig = {}) {
    this.#baseUrl = config.baseUrl ?? "";
    this.#defaultTimeoutMs = config.timeoutMs;
    this.#fetch = config.fetch ??
      ((...args: Parameters<typeof fetch>) => globalThis.fetch(...args));
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", path, options);
  }

  async request<T>(
    method: string,
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    options.signal?.throwIfAborted();
    const url = this.#baseUrl + path;
    const headers = new Headers(options.headers);
    const hasBody = options.body !== undefined;
    if (hasBody && !headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }

    const timeoutMs = options.timeoutMs ?? this.#defaultTimeoutMs;
    const controller = new AbortController();
    let timedOut = false;
    const timeoutId = timeoutMs !== undefined
      ? setTimeout(() => {
        if (controller.signal.aborted) return;
        timedOut = true;
        controller.abort();
      }, timeoutMs)
      : undefined;
    const abortFromCaller = () => controller.abort(options.signal?.reason);
    options.signal?.addEventListener("abort", abortFromCaller, { once: true });

    let response: Response;
    try {
      response = await this.#fetch(url, {
        method,
        headers,
        body: hasBody ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });
      controller.signal.throwIfAborted();
    } catch (error) {
      if (timedOut) throw new HttpTimeoutError(url, timeoutMs!);
      if (options.signal?.aborted) throw options.signal.reason;
      throw error;
    } finally {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      options.signal?.removeEventListener("abort", abortFromCaller);
    }

    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    return await response.json() as T;
  }
}`,
    checkpoint: "Working version: default and per-request timeouts produce HttpTimeoutError, while external cancellation remains a native abort failure."
  },
  {
    title: "5. Transform, parse, and normalize responses",
    goal: "Finish the response path without hiding useful failure details.",
    explanation: [
      "Response interceptors run before parsing. This lets an application inspect status and headers or return a replacement Response. As with request interceptors, awaiting each result supports both synchronous and asynchronous transforms.",
      "The Content-Type header chooses the parser. JSON parse failures become undefined so an unsuccessful response can still become a useful HttpError. Other response types are read as text. This deliberately does not implement blobs, streams, or runtime schema validation.",
      "Parsing happens before response.ok is checked. Therefore HttpError can carry the server's parsed error body together with status, status text, and the requested URL. Successful data is finally asserted as T; that assertion changes compile-time knowledge only."
    ],
    code: `class HttpError extends Error {
  constructor(
    readonly details: {
      status: number;
      statusText: string;
      url: string;
      body: unknown;
    },
  ) {
    super(
      \`HTTP \${details.status} \${details.statusText} for \${details.url}\`,
    );
    this.name = "HttpError";
  }
}

type ResponseInterceptor =
  (response: Response) => Response | Promise<Response>;

class ResponseHandler {
  #responseInterceptors: ResponseInterceptor[] = [];

  useResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.#responseInterceptors.push(interceptor);
  }

  async parse<T>(response: Response, url: string): Promise<T> {
    for (const interceptor of this.#responseInterceptors) {
      response = await interceptor(response);
    }

    const contentType = response.headers.get("content-type") ?? "";
    const body = contentType.includes("application/json")
      ? await response.json().catch(() => undefined)
      : await response.text();

    if (!response.ok) {
      throw new HttpError({
        status: response.status,
        statusText: response.statusText,
        url,
        body,
      });
    }

    return body as T;
  }
}

// Add one ResponseHandler field to the checkpoint 4 client, delegate
// useResponseInterceptor() to it, and replace its final three lines with:
// return await this.#responseHandler.parse<T>(response, url);`,
    checkpoint: "Working version: the client now has the complete runtime behavior. The remaining work organizes errors, types, exports, and test-only helpers into focused files."
  },
  {
    title: "6. Make the design independently testable",
    goal: "Prove behavior without a server or mocking package.",
    explanation: [
      "fetchStub adapts a small handler to the full fetch signature. Tests inspect URL and RequestInit, then return a real Response. delayedFetchStub adds time and listens to init.signal so timeout and cancellation tests exercise the same AbortController path as production.",
      "The tests move from the public behavior inward: verbs and JSON, rich HTTP errors, both interceptor chains, timeout classification, external abort classification, and error object fields. A passing suite is the executable definition of each checkpoint."
    ],
    code: `const client = new HttpClient({
  fetch: fetchStub((url, init) =>
    new Response(
      JSON.stringify({ url, method: init?.method }),
      { headers: { "content-type": "application/json" } },
    )
  ),
});

const result = await client.get<{ method: string }>("/games");
assertEquals(result.method, "GET");`,
    checkpoint: "Working version: all network boundaries are injectable and each public contract can run deterministically in Deno."
  }
];
const sourceFiles = [
  {
    path: "vendor/http/src/interceptors.ts",
    purpose: "The shared request shape and the two interceptor function contracts.",
    source: `export interface HttpRequest {
  url: string;
  method: string;
  headers: Headers;
  body?: BodyInit;
}

/** Runs before a request is sent; may return a modified request (e.g. add an auth header). */
export type RequestInterceptor = (request: HttpRequest) => HttpRequest | Promise<HttpRequest>;

/** Runs after a response is received, before it's parsed; may return a modified response. */
export type ResponseInterceptor = (response: Response) => Response | Promise<Response>;`
  },
  {
    path: "vendor/http/src/http-error.ts",
    purpose: "Two distinct failures with fields callers can inspect without parsing messages.",
    source: `/** Thrown when a response has a non-2xx status. */
export class HttpError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly url: string;
  readonly body: unknown;

  constructor(options: { status: number; statusText: string; url: string; body: unknown }) {
    super(\`HTTP \${options.status} \${options.statusText} for \${options.url}\`);
    this.name = "HttpError";
    this.status = options.status;
    this.statusText = options.statusText;
    this.url = options.url;
    this.body = options.body;
  }
}

/** Thrown when a request is aborted because it exceeded its configured timeout. */
export class HttpTimeoutError extends Error {
  readonly url: string;
  readonly timeoutMs: number;

  constructor(url: string, timeoutMs: number) {
    super(\`Request to \${url} timed out after \${timeoutMs}ms\`);
    this.name = "HttpTimeoutError";
    this.url = url;
    this.timeoutMs = timeoutMs;
  }
}`
  },
  {
    path: "vendor/http/src/http-client.ts",
    purpose: "The complete client reached by combining checkpoints two through five.",
    source: `import { HttpError, HttpTimeoutError } from "./http-error.js";
import type { HttpRequest, RequestInterceptor, ResponseInterceptor } from "./interceptors.js";

export interface RequestOptions {
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export interface HttpClientConfig {
  baseUrl?: string;
  timeoutMs?: number;
  /** injectable for tests; defaults to the global \`fetch\`. */
  fetch?: typeof fetch;
}

/** A thin, predictable wrapper around \`fetch\`: JSON by default, interceptors, timeouts, normalized errors. */
export class HttpClient {
  #baseUrl: string;
  #defaultTimeoutMs?: number;
  #fetch: typeof fetch;
  #requestInterceptors: RequestInterceptor[] = [];
  #responseInterceptors: ResponseInterceptor[] = [];

  constructor(config: HttpClientConfig = {}) {
    this.#baseUrl = config.baseUrl ?? "";
    this.#defaultTimeoutMs = config.timeoutMs;
    this.#fetch = config.fetch ?? ((...args: Parameters<typeof fetch>) => globalThis.fetch(...args));
  }

  useRequestInterceptor(interceptor: RequestInterceptor): void {
    this.#requestInterceptors.push(interceptor);
  }

  useResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.#responseInterceptors.push(interceptor);
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", path, options);
  }

  post<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("POST", path, options);
  }

  put<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("PUT", path, options);
  }

  patch<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("PATCH", path, options);
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("DELETE", path, options);
  }

  async request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
    const url = this.#baseUrl + path;
    const headers = new Headers(options.headers);
    const hasBody = options.body !== undefined;
    if (hasBody && !headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }

    let httpRequest: HttpRequest = {
      url,
      method,
      headers,
      body: hasBody ? JSON.stringify(options.body) : undefined,
    };
    for (const interceptor of this.#requestInterceptors) {
      httpRequest = await interceptor(httpRequest);
    }

    const timeoutMs = options.timeoutMs ?? this.#defaultTimeoutMs;
    const controller = new AbortController();
    let timedOut = false;
    const timeoutId = timeoutMs !== undefined
      ? setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, timeoutMs)
      : undefined;
    options.signal?.addEventListener("abort", () => controller.abort(options.signal?.reason));

    let response: Response;
    try {
      response = await this.#fetch(httpRequest.url, {
        method: httpRequest.method,
        headers: httpRequest.headers,
        body: httpRequest.body,
        signal: controller.signal,
      });
    } catch (error) {
      if (timedOut) {
        throw new HttpTimeoutError(httpRequest.url, timeoutMs!);
      }
      throw error;
    } finally {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    }

    for (const interceptor of this.#responseInterceptors) {
      response = await interceptor(response);
    }

    const contentType = response.headers.get("content-type") ?? "";
    const body = contentType.includes("application/json")
      ? await response.json().catch(() => undefined)
      : await response.text();

    if (!response.ok) {
      throw new HttpError({ status: response.status, statusText: response.statusText, url: httpRequest.url, body });
    }

    return body as T;
  }
}`
  },
  {
    path: "vendor/http/src/internal/fetch-stub.ts",
    purpose: "Internal deterministic fetch implementations used by the package tests.",
    source: `/** Wraps a handler as a \`fetch\`-compatible function, for use in tests — no real network calls. */
export function fetchStub(
  handler: (url: string, init: RequestInit | undefined) => Response | Promise<Response>,
): typeof fetch {
  return ((input: RequestInfo | URL, init?: RequestInit) => Promise.resolve(handler(String(input), init))) as typeof fetch;
}

/** A \`fetch\` stub that resolves after \`ms\` milliseconds, or rejects with an AbortError if its signal aborts first. */
export function delayedFetchStub(ms: number, respond: () => Response): typeof fetch {
  return ((_input: RequestInfo | URL, init?: RequestInit) =>
    new Promise<Response>((resolve, reject) => {
      const id = setTimeout(() => resolve(respond()), ms);
      init?.signal?.addEventListener("abort", () => {
        clearTimeout(id);
        reject(new DOMException("Aborted", "AbortError"));
      });
    })) as typeof fetch;
}`
  },
  {
    path: "vendor/http/src/index.ts",
    purpose: "The public boundary: runtime values use export, while TypeScript-only contracts use export type.",
    source: `export { HttpClient } from "./http-client.js";
export type { HttpClientConfig, RequestOptions } from "./http-client.js";
export { HttpError, HttpTimeoutError } from "./http-error.js";
export type { HttpRequest, RequestInterceptor, ResponseInterceptor } from "./interceptors.js";`
  }
];
const testFiles = [
  {
    path: "vendor/http/src/http-error.test.ts",
    purpose: "The exact error-object contract tests.",
    source: `import { assertEquals } from "jsr:@std/assert";
import { HttpError, HttpTimeoutError } from "./http-error.js";

Deno.test("HttpError captures status, statusText, url and body", () => {
  const error = new HttpError({
    status: 404,
    statusText: "Not Found",
    url: "https://example.test/x",
    body: { message: "nope" },
  });

  assertEquals(error.status, 404);
  assertEquals(error.statusText, "Not Found");
  assertEquals(error.url, "https://example.test/x");
  assertEquals(error.body, { message: "nope" });
  assertEquals(error.name, "HttpError");
});

Deno.test("HttpTimeoutError carries the url and configured timeout", () => {
  const error = new HttpTimeoutError("https://example.test/slow", 50);
  assertEquals(error.url, "https://example.test/slow");
  assertEquals(error.timeoutMs, 50);
  assertEquals(error.name, "HttpTimeoutError");
});`
  },
  {
    path: "vendor/http/src/http-client.test.ts",
    purpose: "The exact behavior suite for verbs, parsing, errors, interceptors, timeout, and cancellation.",
    source: `import { assertEquals, assertRejects } from "jsr:@std/assert";
import { HttpClient } from "./http-client.js";
import { HttpError, HttpTimeoutError } from "./http-error.js";
import { delayedFetchStub, fetchStub } from "./internal/fetch-stub.js";

function jsonResponse(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "content-type": "application/json" },
    ...init,
  });
}

Deno.test("get/post/put/patch/delete send the right method and return deserialized JSON", async () => {
  const client = new HttpClient({
    fetch: fetchStub((url, init) => jsonResponse({ url, method: init?.method })),
  });

  assertEquals((await client.get<{ method: string }>("/x")).method, "GET");
  assertEquals((await client.post<{ method: string }>("/x", { body: {} })).method, "POST");
  assertEquals((await client.put<{ method: string }>("/x", { body: {} })).method, "PUT");
  assertEquals((await client.patch<{ method: string }>("/x", { body: {} })).method, "PATCH");
  assertEquals((await client.delete<{ method: string }>("/x")).method, "DELETE");
});

Deno.test("a non-2xx response throws HttpError with status and body", async () => {
  const client = new HttpClient({
    fetch: fetchStub(() => jsonResponse({ message: "nope" }, { status: 404, statusText: "Not Found" })),
  });

  const error = await assertRejects(() => client.get("/missing"), HttpError);
  assertEquals(error.status, 404);
  assertEquals(error.body, { message: "nope" });
});

Deno.test("request interceptors can modify headers before the request is sent", async () => {
  let seenAuth: string | null = null;
  const client = new HttpClient({
    fetch: fetchStub((_url, init) => {
      seenAuth = (init?.headers as Headers).get("authorization");
      return jsonResponse({ ok: true });
    }),
  });
  client.useRequestInterceptor((request) => {
    request.headers.set("authorization", "Bearer token");
    return request;
  });

  await client.get("/x");
  assertEquals(seenAuth, "Bearer token");
});

Deno.test("response interceptors can transform the response before parsing", async () => {
  const client = new HttpClient({
    fetch: fetchStub(() => jsonResponse({ value: 1 })),
  });
  client.useResponseInterceptor(async (response) => {
    const data = await response.json();
    return jsonResponse({ ...data, transformed: true });
  });

  const result = await client.get<{ value: number; transformed: boolean }>("/x");
  assertEquals(result, { value: 1, transformed: true });
});

Deno.test("a request that exceeds its timeout aborts and throws HttpTimeoutError", async () => {
  const client = new HttpClient({
    fetch: delayedFetchStub(50, () => jsonResponse({})),
  });

  await assertRejects(() => client.get("/slow", { timeoutMs: 5 }), HttpTimeoutError);
});

Deno.test("an externally aborted signal still rejects, without being reported as a timeout", async () => {
  const client = new HttpClient({
    fetch: delayedFetchStub(50, () => jsonResponse({})),
  });
  const controller = new AbortController();
  queueMicrotask(() => controller.abort());

  await assertRejects(() => client.get("/slow", { signal: controller.signal }), DOMException);
});`
  }
];
function httpOutput(event) {
  return event.currentTarget.closest("[data-live-example]").querySelector("[data-live-output]");
}
function renderHttpLiveExample(step) {
  switch(step){
    case 1:
      return html`
        <div class="layout-demo" data-live-example="http-1">
          <p class="layout-demo-label">Live example · Response metadata and body</p>
          <div
            style="display:flex;gap:.5rem;align-items:center;margin:.75rem 0;flex-wrap:wrap"><span data-status style="padding:.6rem .8rem;background:#d9e9ed;color:#184d3b;font-weight:700">200 OK</span><span data-body style="padding:.6rem .8rem;background:#f2f0e8">{ title: "Celeste" }</span></div>
          <button @click=${(event)=>{
        const root = event.currentTarget.closest("[data-live-example]");
        root.querySelector("[data-status]").textContent = "200 OK";
        root.querySelector("[data-body]").textContent = '{ title: "Celeste" }';
        httpOutput(event).textContent = "fetch resolved; response.json() decoded the body";
      }}>Fetch game</button>
          <button @click=${(event)=>{
        const root = event.currentTarget.closest("[data-live-example]");
        root.querySelector("[data-status]").textContent = "404 Not Found";
        root.querySelector("[data-status]").setAttribute("style", "padding:.6rem .8rem;background:#f7deda;color:#a43f35;font-weight:700");
        root.querySelector("[data-body]").textContent = '{ message: "missing" }';
        httpOutput(event).textContent = "fetch resolved, but response.ok was false";
      }}>Simulate 404</button>
          <output data-live-output aria-live="polite">No request yet.</output>
        </div>
      `;
    case 2:
      return html`
        <div class="layout-demo" data-live-example="http-2">
          <p class="layout-demo-label">Live example · one client, many verbs</p>
          <div
            style="display:flex;align-items:center;gap:.5rem;margin:.75rem 0;flex-wrap:wrap"><code data-url>https://games.example.test/api/games</code><span data-method style="padding:.5rem;background:#eedde4">GET</span></div>
          <label>Path <input value="/games" @input=${(event)=>{
        const input = event.currentTarget;
        input.closest("[data-live-example]").querySelector("[data-url]").textContent = `https://games.example.test/api${input.value}`;
      }}></label>
          <button @click=${(event)=>{
        event.currentTarget.closest("[data-live-example]").querySelector("[data-method]").textContent = "GET";
        httpOutput(event).textContent = 'get<T>(path) delegated to request("GET", path)';
      }}>GET</button>
          <button @click=${(event)=>{
        event.currentTarget.closest("[data-live-example]").querySelector("[data-method]").textContent = "POST";
        httpOutput(event).textContent = 'post<T>(path, options) delegated to request("POST", path)';
      }}>POST</button>
          <output data-live-output aria-live="polite">Choose a verb.</output>
        </div>
      `;
    case 3:
      return html`
        <div class="layout-demo" data-live-example="http-3">
          <p class="layout-demo-label">Live example · normalized request pipeline</p>
          <div
            style="display:flex;align-items:center;gap:.45rem;flex-wrap:wrap;margin:.75rem 0"><span style="padding:.55rem;background:#f2f0e8">body</span><span>→</span><span style="padding:.55rem;background:#d9e9ed">JSON + Headers</span><span>→</span><span style="padding:.55rem;background:#eedde4">interceptor</span><span>→</span><span style="padding:.55rem;background:#edf5f0">fetch</span></div>
          <label>Token <input value="demo-token" @input=${(event)=>{
        const value = event.currentTarget.value;
        event.currentTarget.closest("[data-live-example]").querySelector("[data-token]").textContent = `authorization: Bearer ${value || "(empty)"}`;
      }}></label>
          <span data-token
            style="display:inline-block;margin:.5rem 0;padding:.5rem;background:#f2f0e8">authorization: Bearer demo-token</span>
          <button @click=${(event)=>{
        httpOutput(event).textContent = "POST body serialized; content-type added; auth interceptor ran";
      }}>Send normalized request</button>
          <output data-live-output
            aria-live="polite">Nothing has reached fetch yet.</output>
        </div>
      `;
    case 4:
      return html`
        <div class="layout-demo" data-live-example="http-4">
          <p class="layout-demo-label">Live example · timeout versus external abort</p>
          <div
            style="position:relative;height:1rem;background:#f2f0e8;border-radius:99px;overflow:hidden;margin:.9rem 0"><span data-progress style="display:block;width:0%;height:100%;background:#315f70"></span></div>
          <button @click=${(event)=>{
        const root = event.currentTarget.closest("[data-live-example]");
        const progress = root.querySelector("[data-progress]");
        progress.setAttribute("style", "display:block;width:100%;height:100%;background:#315f70;transition:width 1s linear");
        const output = httpOutput(event);
        output.textContent = "request running with timeoutMs: 1000";
        setTimeout(()=>{
          progress.setAttribute("style", "display:block;width:100%;height:100%;background:#a43f35");
          output.textContent = "HttpTimeoutError: request exceeded 1000ms";
        }, 1000);
      }}>Start slow request</button>
          <button @click=${(event)=>{
        httpOutput(event).textContent = "AbortError: caller canceled; not reported as timeout";
      }}>Cancel externally</button>
          <output data-live-output aria-live="polite">No request is running.</output>
        </div>
      `;
    case 5:
      return html`
        <div class="layout-demo" data-live-example="http-5">
          <p class="layout-demo-label">Live example · parse then classify response</p>
          <div
            style="display:flex;gap:.5rem;align-items:center;margin:.75rem 0;flex-wrap:wrap"><span data-content style="padding:.6rem;background:#d9e9ed">application/json</span><span data-result style="padding:.6rem;background:#f2f0e8">unparsed</span></div>
          <button @click=${(event)=>{
        const root = event.currentTarget.closest("[data-live-example]");
        root.querySelector("[data-content]").textContent = "application/json";
        root.querySelector("[data-result]").textContent = "body → JSON object";
        httpOutput(event).textContent = "response interceptor ran before JSON parsing";
      }}>Parse JSON</button>
          <button @click=${(event)=>{
        const root = event.currentTarget.closest("[data-live-example]");
        root.querySelector("[data-content]").textContent = "text/plain";
        root.querySelector("[data-result]").textContent = "body → text";
        httpOutput(event).textContent = "non-JSON content used response.text()";
      }}>Parse text</button>
          <button @click=${(event)=>{
        httpOutput(event).textContent = "HttpError: 422 Unprocessable Entity; body preserved";
      }}>Simulate HttpError</button>
          <output data-live-output aria-live="polite">Choose a response parser.</output>
        </div>
      `;
    case 6:
      return html`
        <div class="layout-demo" data-live-example="http-6">
          <p class="layout-demo-label">Live example · deterministic fetch stub</p>
          <div
            style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.5rem;margin:.75rem 0"><output data-test-a style="padding:.65rem;border:1px solid #cbcfc8">verbs: pending</output><output data-test-b style="padding:.65rem;border:1px solid #cbcfc8">errors: pending</output><output data-test-c style="padding:.65rem;border:1px solid #cbcfc8">timeouts: pending</output></div>
          <button @click=${(event)=>{
        const root = event.currentTarget.closest("[data-live-example]");
        root.querySelector("[data-test-a]").textContent = "verbs: pass";
        root.querySelector("[data-test-b]").textContent = "errors: pass";
        root.querySelector("[data-test-c]").textContent = "timeouts: pass";
        httpOutput(event).textContent = "fetchStub handled every test without a real network";
      }}>Run deterministic tests</button>
          <output data-live-output aria-live="polite">No test run yet.</output>
        </div>
      `;
    default:
      return html``;
  }
}
defineComponent("docs-under-the-hood-http-page", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Under the Hood · vendor/http</p>
        <h1>Build the HTTP package from fetch</h1>
        <p class="page-lead">
          Start with one native request, keep each version working, and add one
          responsibility at a time until the result is the exact Nala HTTP
          implementation. No framework, network library, or hidden runtime is
          involved.
        </p>

        <nala-callout tone="info">
          <span slot="title">How to use this chapter</span>
          Build each checkpoint in order. Read the final source only after the
          smaller version makes sense. Every TypeScript line currently stored
          in <code>vendor/http/src</code>, including tests and internal test
          helpers, appears in the final sections below.
        </nala-callout>

        <h2>The finished request path</h2>
        <ol>
          <li>Join the configured base URL and caller's path.</li>
          <li>Normalize headers and serialize a defined body as JSON.</li>
          <li>Run request interceptors in registration order.</li>
          <li>Combine the configured timeout and external abort signal.</li>
          <li>Call the injected or global fetch implementation.</li>
          <li>Run response interceptors in registration order.</li>
          <li>Parse JSON or text, then return data or throw a rich error.</li>
        </ol>

        ${repeat(tutorialSteps, (step)=>step.title, (step)=>html`
            <section>
              <h2>${step.title}</h2>
              <p><strong>Goal:</strong> ${step.goal}</p>
              ${repeat(step.explanation, (paragraph)=>paragraph, (paragraph)=>html`<p>${paragraph}</p>`)}
              ${renderCodeExample(step.code)}
              ${renderHttpLiveExample(Number(step.title[0]))}
              <nala-callout tone="success">
                <span slot="title">Checkpoint</span>
                ${step.checkpoint}
              </nala-callout>
            </section>
          `)}

        <section>
          <h2>7. Compare with every implementation file</h2>
          <p>
            The checkpoints now converge on the repository. These are complete,
            exact snapshots rather than shortened examples. Imports make file
            boundaries explicit, private fields protect client configuration,
            and the entrypoint exposes only the supported public API.
          </p>
          <div data-current-implementation><p role="status">Loading current implementation sources...</p></div>
        </section>

        <section>
          <h2>8. Read every test as a behavioral promise</h2>
          <p>
            Tests are part of the package's source and complete the tutorial.
            They show what callers may rely on and make each intermediate idea
            falsifiable without performing a real network request.
          </p>
          <p>The cancellation regression suite checks pre-abort before and after an interceptor, counts installed/removed listeners on success and failure, and delays transport rejection beyond the timer to prove caller reasons are not reclassified.</p>
          <div data-current-tests><p role="status">Loading current test sources...</p></div>
        </section>

        <section>
          <h2>What is deliberately not inside the package</h2>
          <p>
            HttpClient does not retry requests, cache responses, validate JSON,
            refresh credentials, upload progress, or provide an HTTP-specific
            reactive system. Those policies vary by application. The package
            stays small by composing native fetch, Headers, Response,
            AbortController, Error, and Promise behavior.
          </p>
          <p>
            Continue with the concise <a href="/packages/http">HTTP reference</a>
            when you need signatures and contracts rather than the construction
            story.
          </p>
        </section>
      </article>
    `,
  onConnect: ({ query, onCleanup })=>{
    const implementation = query("[data-current-implementation]");
    const tests = query("[data-current-tests]");
    if (!implementation || !tests) throw new Error("HTTP source archive is missing.");
    const controller = new AbortController();
    onCleanup(()=>controller.abort());
    const load = async (files, root)=>{
      try {
        const current = await Promise.all(files.map(async (file)=>{
          const response = await fetch(`/${file.path}`, {
            signal: controller.signal
          });
          if (!response.ok) throw new Error(`Could not load ${file.path}: HTTP ${response.status}`);
          return {
            ...file,
            source: await response.text()
          };
        }));
        if (controller.signal.aborted) return;
        render(html`${repeat(current, (file)=>file.path, (file)=>html`<section><h3>${file.path}</h3><p>${file.purpose}</p>${renderCodeExample(file.source)}</section>`)}`, root);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("HTTP source archive failed:", error);
        render(html`<p role="alert">Could not load current sources: ${error instanceof Error ? error.message : String(error)}</p>`, root);
      }
    };
    void load(sourceFiles, implementation);
    void load(testFiles, tests);
  }
});
