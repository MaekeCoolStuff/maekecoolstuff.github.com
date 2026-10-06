import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-23", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 4: TypeScript in the browser · Chapter 23</p>
        <h1>Working with JSON and HTTP</h1>
        <p>
                An HTTP response has status, headers, and a body. A successful status
                does not mean the body matches the type your application wants.
                Treat parsed JSON as unknown at the boundary and validate it before
                passing it into domain logic.
              </p>
              ${renderCodeExample(`async function requestGameCard(
  id: string,
  signal: AbortSignal,
): Promise<GameCardData> {
  const response = await fetch("/api/games/" + encodeURIComponent(id), {
    signal,
  });
  if (!response.ok) {
    throw new Error("Game request failed with status " + response.status);
  }

  const payload: unknown = await response.json();
  return parseGameCard(payload);
}`)}
              <p>
                This example uses the parser from the next chapter. Assigning the
                body to <code>unknown</code> prevents unchecked property access. A
                generic type argument or assertion at the fetch call would only
                change what the checker believes; it would not prove that the server
                sent that structure.
              </p>
              ${renderWorkedExample(html`
                <p>
                  Store it as <code>unknown</code> and pass it to a parser that
                  checks the required fields and returns a validated value. The
                  HTTP status check and the JSON shape check answer different
                  questions; both are needed.
                </p>
              `)}
        <section>
          <h2>Separate transport, status, and body contracts</h2>
          <p>
            <code>fetch</code> rejects for network-level failures and aborts,
            but an HTTP 404 or 500 still fulfills with a
            <code>Response</code>. Check <code>response.ok</code> or
            <code>status</code> before treating the body as successful data.
            Status handling, JSON parsing, and domain validation are three
            separate steps.
          </p>
          ${renderCodeExample(`async function fetchGame(
  id: string,
  signal: AbortSignal,
): Promise<Game> {
  const url = "/api/games/" + encodeURIComponent(id);
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error("Game request failed: " + response.status);
  }

  const payload: unknown = await response.json();
  return parseGame(payload);
}`)}
          <p>
            The body parser is the runtime validator from Chapter 24.
            Annotating the payload as <code>unknown</code> stops unchecked
            property access. Writing <code>response.json() as Game</code>
            would only change the checker's belief.
          </p>
        </section>

        <section>
          <h2>Build request URLs and headers intentionally</h2>
          <p>
            Encode dynamic path segments and query values rather than
            concatenating user text into a URL. Set content types that match
            the body, and do not send a body for methods or statuses where
            the protocol/API does not expect one. Keep credentials and tokens
            out of logs and error messages.
          </p>
          ${renderCodeExample(`const url = new URL("/api/games", location.origin);
url.searchParams.set("query", searchText);
url.searchParams.set("limit", String(pageSize));

const response = await fetch(url, {
  headers: { Accept: "application/json" },
  signal,
});`)}
          <p>
            Browser requests are subject to same-origin policy and CORS.
            TypeScript cannot grant permissions or bypass server policy.
            Keep origin and authentication behavior explicit in the data
            layer so UI components do not invent request rules.
          </p>
        </section>

        <section>
          <h2>Response bodies are streams and are consumed once</h2>
          <p>
            A response body is a stream. Calling <code>json</code>,
            <code>text</code>, or another body reader consumes it; code
            should not try to parse the same body twice. Check content type
            when the endpoint contract requires JSON, and handle responses
            such as 204 No Content without attempting to parse a missing
            body.
          </p>
          ${renderCodeExample(`async function readOptionalGame(response: Response): Promise<Game | undefined> {
  if (response.status === 204) return undefined;
  const mediaType = response.headers.get("content-type") ?? "";
  if (!mediaType.includes("application/json")) {
    throw new Error("Expected a JSON response");
  }
  const payload: unknown = await response.json();
  return parseGame(payload);
}`)}
          <p>
            A content-type header is a useful contract check, but it does not
            prove the body is valid JSON or a valid Game. Parsing can throw;
            validation can also fail after parsing succeeds.
          </p>
        </section>

        <section>
          <h2>Serialize requests with explicit rules</h2>
          <p>
            <code>JSON.stringify</code> serializes JSON-compatible values.
            It omits some values, loses prototypes, cannot represent cyclic
            objects, and throws for BigInt by default. Dates serialize as
            strings. Define request DTOs instead of assuming every runtime
            domain object round-trips through JSON unchanged.
          </p>
          ${renderCodeExample(`type UpdateGameRequest = { title: string };

async function updateGame(id: string, title: string): Promise<void> {
  const body: UpdateGameRequest = { title };
  const response = await fetch("/api/games/" + encodeURIComponent(id), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("Update failed: " + response.status);
}`)}
          <p>
            Serialization produces text, not a validated server-side update.
            The server remains responsible for validating its input and
            enforcing authorization and domain rules.
          </p>
        </section>

        <section>
          <h2>Make requests testable and reliable</h2>
          <ul>
            <li>Inject or wrap fetch when tests need deterministic responses.</li>
            <li>Test success, non-success status, invalid JSON, invalid shape, and abort separately.</li>
            <li>Use timeouts or cancellation for work that can outlive its UI.</li>
            <li>Retry only safe/idempotent operations or requests with explicit idempotency keys.</li>
            <li>Paginate large collections rather than loading them all at once.</li>
            <li>Keep transport-specific errors out of domain models unless callers need them.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: define a data boundary</h2>
            <p>
              Write a request function that checks status, handles an empty
              response, reads a JSON body once, validates it, and returns a
              domain value. Decide which failures should reject and which
              expected cases should become an explicit result.
            </p>
          `)}
        </section>
      </article>
    `
});
