import { defineComponent, html } from "../../../../vendor/components/dist/index.js";
import { renderCodeExample } from "./code-example.js";
defineComponent("docs-ui-layouts-page", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">UI components · Layout recipes</p>
        <h1>Build a screen by composing components</h1>
        <p class="page-lead">
          A useful screen is more than a row of components. Put related content
          into native elements, choose the right Nala components for repeated
          interface patterns, then use ordinary CSS Grid and Flexbox to arrange
          the page. These Game Shelf examples show three different ways to do
          that.
        </p>

        <nala-callout tone="info">
          <span slot="title">Components provide patterns, CSS provides the page layout</span>
          <code>nala-card</code>, <code>nala-side-bar</code>, and
          <code>nala-grid-view</code> each arrange their own content. Your
          application still decides where those elements sit in the page,
          whether the page is responsive, and what their links and actions do.
        </nala-callout>

        <h2>1. A collection dashboard</h2>
        <p>
          Start with the largest relationships: a top navigation bar, then a
          filter sidebar beside the main collection. Grid gives the page its
          two-column structure; a smaller grid arranges the summary cards. The
          sidebar and each card continue to own only their internal layout.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · collection dashboard</p>
          <nala-nav-bar>
            <a slot="brand" href="#dashboard">Game Shelf</a>
            <nav slot="links" aria-label="Main navigation">
              <a href="#dashboard">Collection</a>
              <a href="#dashboard-wishlist">Wishlist</a>
            </nav>
            <nala-button slot="actions" variant="secondary">Add a game</nala-button>
          </nala-nav-bar>
          <nav class="ui-layout-mobile-nav" aria-label="Compact game navigation">
            <a href="#dashboard">Collection</a>
            <a href="#dashboard-wishlist">Wishlist</a>
          </nav>
          <div class="ui-layout-dashboard">
            <nala-side-bar label="Collection filters">
              <nav aria-label="Game status">
                <a href="#dashboard">All games</a>
                <a href="#dashboard-playing">Playing</a>
                <a href="#dashboard-backlog">Backlog</a>
                <a href="#dashboard-finished">Finished</a>
              </nav>
            </nala-side-bar>
            <section class="ui-layout-dashboard-main" id="dashboard"
              aria-label="Collection overview">
              <div class="ui-layout-toolbar">
                <div>
                  <p class="page-eyebrow">Your library</p>
                  <h3>Collection overview</h3>
                </div>
              </div>
              <div class="ui-layout-metrics">
                <nala-card>
                  <span slot="eyebrow">COLLECTION</span>
                  <span slot="title">42 games</span>
                  <p>Across 4 platforms</p>
                </nala-card>
                <nala-card variant="accent">
                  <span slot="eyebrow">IN PROGRESS</span>
                  <span slot="title">3 playing</span>
                  <p>Pick up where you left off.</p>
                </nala-card>
              </div>
              <nala-card>
                <span slot="eyebrow">RECENTLY ADDED</span>
                <span slot="title">Your latest games</span>
                <nala-list-view label="Recently added games">
                  <nala-list-item>
                    <span slot="title">Sea of Stars</span>
                    <span slot="description">Nintendo Switch · Playing</span>
                  </nala-list-item>
                  <nala-list-item>
                    <span slot="title">Hollow Knight</span>
                    <span slot="description">PC · Backlog</span>
                  </nala-list-item>
                </nala-list-view>
              </nala-card>
            </main>
          </div>
        </div>
        ${renderCodeExample(`<nala-nav-bar>
  <a slot="brand" href="/">Game Shelf</a>
  <nav slot="links" aria-label="Main navigation">
    <a href="/collection">Collection</a>
    <a href="/wishlist">Wishlist</a>
  </nav>
  <nala-button slot="actions">Add a game</nala-button>
</nala-nav-bar>

<div class="game-dashboard">
  <nala-side-bar label="Collection filters">
    <nav aria-label="Game status">
      <a href="/collection">All games</a>
      <a href="/collection/playing">Playing</a>
      <a href="/collection/backlog">Backlog</a>
    </nav>
  </nala-side-bar>

  <main class="game-dashboard__main">
    <section class="game-dashboard__summary" aria-label="Collection summary">
      <nala-card>
        <span slot="title">42 games</span>
        <p>Across 4 platforms</p>
      </nala-card>
      <nala-card>
        <span slot="title">3 playing</span>
        <p>Pick up where you left off.</p>
      </nala-card>
    </section>

    <nala-card>
      <span slot="title">Recently added</span>
      <nala-list-view label="Recently added games">
        <nala-list-item>
          <span slot="title">Sea of Stars</span>
          <span slot="description">Nintendo Switch · Playing</span>
        </nala-list-item>
      </nala-list-view>
    </nala-card>
  </main>
</div>`)}
        ${renderCodeExample(`.game-dashboard {
  display: grid;
  grid-template-columns: minmax(11rem, 15rem) minmax(0, 1fr);
  gap: 1.5rem;
}

.game-dashboard__main {
  display: grid;
  min-width: 0;
  align-content: start;
  gap: 1rem;
}

.game-dashboard__summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
  gap: 1rem;
}

@media (max-width: 52rem) {
  .game-dashboard {
    grid-template-columns: minmax(0, 1fr);
  }
}`)}
        <p>
          The breakpoint belongs to the application because it describes the
          relationship between this sidebar and this main region. On narrow
          screens the sidebar moves above the collection. Also note that
          <code>nala-nav-bar</code> hides its links below 44rem, so this example
          supplies a separate compact navigation for those destinations.
        </p>

        <h2>2. A visual collection browser</h2>
        <p>
          When cover-led browsing matters more than scanning rows, put search
          and filters in a wrapping toolbar above <code>nala-grid-view</code>.
          The grid component handles its responsive collection of game tiles;
          the surrounding CSS only aligns the toolbar with the content below.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · cover-led collection</p>
          <section class="ui-layout-catalog" aria-labelledby="catalog-title">
            <div class="ui-layout-toolbar">
              <div>
                <p class="page-eyebrow">Browse</p>
                <h3 id="catalog-title">All games</h3>
              </div>
              <label>
                Search
                <input type="search" placeholder="Find a game" />
              </label>
              <nala-select label="Platform">
                <option value="all">All platforms</option>
                <option value="pc">PC</option>
                <option value="switch">Nintendo Switch</option>
              </nala-select>
            </div>
            <nala-grid-view label="Your game collection">
              <nala-grid-item>
                <span slot="title">Hollow Knight</span>
                <span slot="description">Backlog · PC</span>
                <nala-button slot="actions" variant="ghost">View game</nala-button>
              </nala-grid-item>
              <nala-grid-item>
                <span slot="title">Celeste</span>
                <span slot="description">Finished · PC</span>
                <nala-button slot="actions" variant="ghost">View game</nala-button>
              </nala-grid-item>
              <nala-grid-item>
                <span slot="title">Sea of Stars</span>
                <span slot="description">Playing · Switch</span>
                <nala-button slot="actions" variant="ghost">View game</nala-button>
              </nala-grid-item>
            </nala-grid-view>
          </section>
        </div>
        ${renderCodeExample(`<section class="game-catalog" aria-labelledby="catalog-title">
  <header class="game-catalog__toolbar">
    <h1 id="catalog-title">All games</h1>
    <label>
      Search your collection
      <input type="search" name="query" />
    </label>
    <nala-select label="Platform">
      <option value="all">All platforms</option>
      <option value="pc">PC</option>
      <option value="switch">Nintendo Switch</option>
    </nala-select>
  </header>

  <nala-grid-view label="Your game collection">
    <nala-grid-item>
      <span slot="title">Hollow Knight</span>
      <span slot="description">Backlog · PC</span>
      <nala-button slot="actions" variant="secondary">View game</nala-button>
    </nala-grid-item>
    <nala-grid-item>
      <span slot="title">Celeste</span>
      <span slot="description">Finished · PC</span>
      <nala-button slot="actions" variant="secondary">View game</nala-button>
    </nala-grid-item>
  </nala-grid-view>
</section>`)}
        ${renderCodeExample(`.game-catalog {
  display: grid;
  gap: 1.25rem;
}

.game-catalog__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 1rem;
}

.game-catalog__toolbar h1 {
  flex: 1 1 100%;
}

.game-catalog__toolbar label {
  display: grid;
  flex: 1 1 14rem;
  gap: 0.35rem;
}`)}
        <p>
          Keep search and filtering behavior in your app: native form controls
          collect the input, and your state or router decides which games to
          show. The UI components provide the presentation and semantics, not
          hidden collection logic.
        </p>

        <h2>3. A game detail workspace</h2>
        <p>
          A detail screen can use a main-and-aside grid: closely related tabs
          hold the game's sections, while a status card stays beside them. The
          page grid collapses on small screens; the tabs component handles
          selecting and exposing its own panels.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · one game's workspace</p>
          <section class="ui-layout-detail" aria-label="Sea of Stars details">
            <section class="ui-layout-detail-main" aria-labelledby="detail-title">
              <p class="page-eyebrow">Nintendo Switch · RPG</p>
              <h3 id="detail-title">Sea of Stars</h3>
              <nala-tabs label="Sea of Stars details">
                <button slot="tab">Overview</button>
                <button slot="tab">Notes</button>
                <section slot="panel">
                  <p>A turn-based adventure in the Game Shelf collection.</p>
                  <nala-badge>Playing</nala-badge>
                </section>
                <section slot="panel">
                  <p>Remember to explore the western island next.</p>
                </section>
              </nala-tabs>
            </main>
            <aside class="ui-layout-status" aria-label="Play status">
              <nala-card variant="accent">
                <span slot="eyebrow">CURRENT STATUS</span>
                <span slot="title">Playing</span>
                <p>Last played yesterday</p>
                <nala-progress value="64" max="100" label="Story progress"></nala-progress>
              </nala-card>
              <nala-button variant="secondary">Edit game</nala-button>
            </aside>
          </section>
        </div>
        ${renderCodeExample(`<section class="game-detail" aria-labelledby="game-title">
  <main class="game-detail__content">
    <h1 id="game-title">Sea of Stars</h1>
    <nala-tabs label="Sea of Stars details">
      <button slot="tab">Overview</button>
      <button slot="tab">Notes</button>
      <section slot="panel">A turn-based adventure in your collection.</section>
      <section slot="panel">Remember to explore the western island next.</section>
    </nala-tabs>
  </main>

  <aside class="game-detail__status" aria-label="Play status">
    <nala-card>
      <span slot="title">Playing</span>
      <p>Last played yesterday</p>
      <nala-progress value="64" max="100" label="Story progress"></nala-progress>
    </nala-card>
    <nala-button variant="secondary">Edit game</nala-button>
  </aside>
</section>`)}
        ${renderCodeExample(`.game-detail {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(13rem, 18rem);
  align-items: start;
  gap: 1.5rem;
}

.game-detail__content,
.game-detail__status {
  display: grid;
  min-width: 0;
  gap: 1rem;
}

@media (max-width: 52rem) {
  .game-detail {
    grid-template-columns: minmax(0, 1fr);
  }
}`)}

        <h2>How to design your own composition</h2>
        <ol>
          <li>Sketch the screen's major regions before choosing components.</li>
          <li>Use semantic HTML for page regions and native links and controls for behavior.</li>
          <li>Choose a UI component when it provides a useful repeated pattern, such as a card, list, grid, sidebar, or tab set.</li>
          <li>Use CSS Grid for relationships across rows and columns, and Flexbox for a row or column that can wrap.</li>
          <li>Check the narrow layout and ensure hidden navigation or side content still has a usable alternative.</li>
        </ol>
        <p>
          These components are optional. If their presentation does not fit your
          application, keep the same layout relationships and build the
          individual patterns with native elements or your own components.
        </p>
      </article>
    `
});
