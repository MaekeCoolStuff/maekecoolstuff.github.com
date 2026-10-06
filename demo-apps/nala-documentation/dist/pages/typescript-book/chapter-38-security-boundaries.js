import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-38", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 6: Professional TypeScript · Chapter 38</p>
        <h1>Security at boundaries</h1>
        <p>
                Types do not sanitize input, prevent injection, or protect secrets.
                Treat URL parameters, network data, stored values, and user input as
                untrusted until runtime checks establish what they contain. Render
                user-provided strings through text APIs, not as HTML, and avoid
                storing credentials in browser storage.
              </p>
              ${renderCodeExample(`function showGameTitle(container: HTMLElement, title: string): void {
  const heading = document.createElement("h2");
  heading.textContent = title;
  container.replaceChildren(heading);
}`)}
              <p>
                <code>textContent</code> displays markup-like input as text rather
                than interpreting it as elements. The parameter's string type does
                not mean its content is trusted. Validate permissions on the server
                as well as the client; hiding a button or narrowing a type is not an
                authorization check.
              </p>
              ${renderWorkedExample(html`
                <p>
                  <code>textContent</code> treats the value as text instead of
                  parsing markup. The string type describes only the JavaScript
                  value's shape; it says nothing about trust or safe content.
                </p>
              `)}
        <section>
          <h2>Types and security answer different questions</h2>
          <p>
            A TypeScript type describes values the checker permits in a
            program. It does not establish who supplied a value, whether
            the value was authorized, whether its content is safe for a
            particular output context, or whether a request is trustworthy.
            Treat network responses, URLs, storage, form data, and messages
            from other windows as untrusted until runtime checks and
            authorization establish the needed facts.
          </p>
          <p>
            A type assertion, generic fetch argument, or custom event
            detail type is not a security check. Keep security decisions
            in executable validation and at the server boundary that owns
            the protected resource.
          </p>
        </section>

        <section>
          <h2>Validate input and encode output for its context</h2>
          <p>
            Validate input against domain rules, then encode or render it
            safely for its destination. A string safe as visible text may
            not be safe as HTML, a URL, a CSS value, or a database query.
            Use APIs designed for the output context instead of
            concatenating untrusted values into a mini-language.
          </p>
          ${renderCodeExample(`function showTitle(container: HTMLElement, title: string): void {
  const heading = document.createElement("h2");
  heading.textContent = title;
  container.replaceChildren(heading);
}

function gameUrl(gameId: string): URL {
  const url = new URL("/games/" + encodeURIComponent(gameId), location.origin);
  if (url.origin !== location.origin) throw new Error("Unexpected origin");
  return url;
}`)}
          <p>
            <code>textContent</code> displays markup-like input as text.
            URL encoding protects path structure, while validating the
            resulting origin helps prevent open redirects. Neither removes
            the need to check whether the user may access the requested
            game.
          </p>
        </section>

        <section>
          <h2>Authorization belongs on the server</h2>
          <p>
            Hiding a button, narrowing a role type, or checking permissions
            only in browser code does not protect a resource. A client can
            be modified or bypassed. The server must authenticate the
            caller and authorize each protected operation using trusted
            identity and resource ownership data.
          </p>
          ${renderCodeExample(`async function updateGameForUser(
  userId: string,
  gameId: string,
  title: string,
): Promise<Response> {
  const game = await repository.findById(gameId);
  if (game === undefined) return new Response("Not found", { status: 404 });
  if (game.ownerId !== userId) return new Response("Forbidden", { status: 403 });
  return repository.updateTitle(gameId, title);
}`)}
          <p>
            The example assumes <code>userId</code> came from a verified
            server-side session, not directly from an untrusted request
            body. Validate the title independently and avoid leaking
            sensitive resource details through error messages.
          </p>
        </section>

        <section>
          <h2>Protect secrets and browser sessions</h2>
          <p>
            Anything shipped to a browser can be inspected by its user.
            Never place server credentials, private keys, or privileged
            tokens in frontend source, environment substitutions, or
            local storage. Browser storage is accessible to scripts running
            in the origin, so an XSS flaw can expose its contents.
          </p>
          <p>
            Prefer server-managed sessions with secure cookie settings
            appropriate to the application, including HttpOnly, Secure,
            and SameSite where applicable. State-changing requests also
            need an intentional CSRF strategy. Security controls depend
            on deployment and server architecture, not TypeScript syntax.
          </p>
        </section>

        <section>
          <h2>Keep parsing, authorization, and persistence distinct</h2>
          <p>
            Validation proves shape and domain constraints. Authentication
            identifies a caller. Authorization decides whether that caller
            may perform an operation. Persistence records the result.
            Combining these checks into a single client-side type
            declaration does not protect the sequence or make it atomic.
          </p>
          <p>
            Use parameterized database operations on servers, constrain
            file paths and redirects, validate message origins and payloads,
            and apply least privilege to runtime permissions. Choose
            controls that match the actual threat model and platform.
          </p>
        </section>

        <section>
          <h2>Log safely and review dependencies</h2>
          <ul>
            <li>Do not log passwords, tokens, session identifiers, or full sensitive payloads.</li>
            <li>Keep user-facing errors separate from diagnostic details.</li>
            <li>Validate redirects, origins, message sources, and file names at boundaries.</li>
            <li>Keep dependencies and build permissions minimal and review their updates.</li>
            <li>Use Content Security Policy and secure response headers as defense in depth.</li>
            <li>Test authorization on the server, including denied and cross-user cases.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: trace a value to a sensitive action</h2>
            <p>
              Trace a game ID from a URL through parsing, lookup,
              authorization, and rendering. Identify which layer checks
              each property, where untrusted text is encoded, and what
              the server does if the caller changes the ID to another
              user's game.
            </p>
          `)}
        </section>
      </article>
    `
});
