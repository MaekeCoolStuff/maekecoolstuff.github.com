import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-30", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 5: From feature to application · Chapter 30</p>
        <h1>Routing and navigation</h1>
        <p>
                The URL is browser state that can be shared, bookmarked, and revisited
                with back and forward. Use real links for navigation so the browser
                retains open-in-new-tab, copy-link, and keyboard behavior. A client
                router may intercept eligible clicks, but it must preserve those
                native contracts and respond to <code>popstate</code>.
              </p>
              ${renderCodeExample(`<a href="/games/g-1">Open Celeste</a>

function visitGame(game: Game): void {
  const path = "/games/" + encodeURIComponent(game.id);
  history.pushState(null, "", path);
  renderCurrentRoute();
}

window.addEventListener("popstate", renderCurrentRoute);`)}
              <p>
                <code>pushState</code> changes the URL but does not emit
                <code>popstate</code>; the code that calls it should render the new
                route. Back and forward do emit the event, so the application listens
                and renders from the URL again. Keep route parsing separate from
                domain data and handle malformed or unknown paths deliberately.
              </p>
              ${renderWorkedExample(html`
                <p>
                  An anchor preserves native link behavior and accessibility.
                  <code>pushState</code> does not emit <code>popstate</code>, so
                  the click handler must update the route view itself; the
                  <code>popstate</code> listener handles later back/forward changes.
                </p>
              `)}
        <section>
          <h2>The URL is shareable application state</h2>
          <p>
            A route should be reproducible from the URL so users can
            bookmark it, share it, open it in another tab, and use browser
            back/forward navigation. Keep route parsing separate from
            rendering and domain loading. The URL is input, so malformed
            paths and unknown identifiers need an explicit outcome.
          </p>
          ${renderCodeExample(`type Route =
  | { kind: "library" }
  | { kind: "game"; gameId: string }
  | { kind: "not-found" };

function routeFromUrl(url: URL): Route {
  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length === 0) return { kind: "library" };
  if (segments.length !== 2 || segments[0] !== "games") {
    return { kind: "not-found" };
  }
  try {
    const gameId = decodeURIComponent(segments[1]);
    return gameId === "" ? { kind: "not-found" } : { kind: "game", gameId };
  } catch {
    return { kind: "not-found" };
  }
}`)}
          <p>
            A discriminated route union makes the renderer handle each route
            kind. Parsing must not assume every segment is a valid game ID;
            load and validate the requested entity at the data boundary
            after recognizing the path.
          </p>
        </section>

        <section>
          <h2>Preserve native link behavior</h2>
          <p>
            Use anchors with real <code>href</code> values for navigation.
            A client router may intercept eligible same-origin left clicks,
            but should leave modified clicks, downloads, new-tab targets,
            and external URLs to the browser. This preserves open-in-new-tab,
            copy-link, keyboard, and no-JavaScript behavior.
          </p>
          ${renderCodeExample(`function shouldHandleClick(event: MouseEvent, link: HTMLAnchorElement): boolean {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (link.hasAttribute("download") || link.target !== "") return false;
  const destination = new URL(link.href);
  return destination.origin === location.origin;
}`)}
          <p>
            Prevent the default only after deciding a click is eligible.
            Never turn every clickable element into a link without
            preserving link semantics.
          </p>
        </section>

        <section>
          <h2>Understand History API transitions</h2>
          <p>
            <code>pushState</code> adds a history entry;
            <code>replaceState</code> changes the current entry. Neither
            fires <code>popstate</code>. The code that calls either method
            should update the view itself. Back and forward traverse history
            and trigger <code>popstate</code>, so render again from the
            current URL rather than an unrelated cached click argument.
          </p>
          ${renderCodeExample(`function navigate(path: string): void {
  const next = new URL(path, location.href);
  if (next.origin !== location.origin) {
    location.assign(next.href);
    return;
  }
  history.pushState(null, "", next.href);
  renderRoute(routeFromUrl(new URL(location.href)));
}

window.addEventListener("popstate", () => {
  renderRoute(routeFromUrl(new URL(location.href)));
});`)}
          <p>
            Decide whether a filter belongs in the path, query string, or
            ephemeral interface state. Query parameters are untrusted text:
            parse numbers, enumerated values, and repeated keys according
            to an explicit policy. Consider scroll and focus behavior after
            a route change.
          </p>
        </section>

        <section>
          <h2>Handle deployment and unknown routes</h2>
          <p>
            An application deployed below a path prefix must build links
            and asset URLs using that base. A development server may
            provide history fallback for client routes; a static host may
            need route rewrites or a hash strategy. Test refreshing a
            nested route directly, not only navigating from the home page.
          </p>
          <p>
            Render a deliberate not-found view for unknown paths. Do not let
            malformed decoding, missing records, or failed loads become a
            blank screen. Keep route state separate from remote request
            state so each failure can be represented appropriately.
          </p>
        </section>

        <section>
          <h2>Test navigation as browser behavior</h2>
          <ul>
            <li>Test direct loading and refreshing of nested routes.</li>
            <li>Test back/forward, query strings, malformed paths, and unknown IDs.</li>
            <li>Verify external, modified, download, and new-tab links remain native.</li>
            <li>Check focus and scroll behavior after in-app navigation.</li>
            <li>Inject history to unit-test route transitions without a browser.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: design a game detail route</h2>
            <p>
              Define a route for one game, parse and decode its ID, load the
              game, and distinguish not-found from a request failure. Add a
              real anchor from the collection and verify direct entry and
              back/forward behavior.
            </p>
          `)}
        </section>
      </article>
    `
});
