import { defineComponent, html } from "../../../../vendor/components/dist/index.js";
import { renderLiveCssExample } from "./css-live-example.js";
defineComponent("docs-css-cookbook", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Cookbook</p>
        <h1>Recipes for everyday interface problems</h1>
        <p class="page-lead">
          Start from the user-facing problem, then adapt a small CSS pattern.
          Each recipe pairs the exact stylesheet with a live Game Shelf example.
          The previews are isolated, so you can inspect a recipe without the
          documentation site's own styles changing its result.
        </p>
        <nav class="component-doc-nav" aria-label="CSS Cookbook recipes">
          <a href="#recipe-shell">Page shell</a>
          <a href="#recipe-grid">Card grid</a>
          <a href="#recipe-card">Card actions</a>
          <a href="#recipe-split">Split layout</a>
          <a href="#recipe-tags">Wrapping tags</a>
          <a href="#recipe-cover">Cover image</a>
          <a href="#recipe-title">Long title</a>
          <a href="#recipe-button">Button states</a>
          <a href="#recipe-field">Form error</a>
          <a href="#recipe-status">Status chip</a>
          <a href="#recipe-table">Data table</a>
          <a href="#recipe-sticky">Sticky heading</a>
          <a href="#recipe-loading">Loading skeleton</a>
          <a href="#recipe-empty">Empty state</a>
          <a href="#recipe-skip">Skip link</a>
          <a href="#recipe-action-bar">Mobile action bar</a>
        </nav>

        <h2 id="recipe-shell">1. Keep a page centered with a fluid gutter</h2>
        <p>
          Use the available width on small screens, cap the reading width on
          wide screens, and center the result with auto margins. This avoids a
          fixed-width page that overflows when the viewport or text size changes.
        </p>
        ${renderLiveCssExample("The collection shell stays centered and keeps a gutter at every width.", `.page-shell {
  inline-size: min(100% - 2rem, 68rem);
  margin-inline: auto;
}

.page-shell__intro { max-inline-size: 62ch; }`, `<main class="page-shell">
  <h2>My collection</h2>
  <p class="page-shell__intro">A useful collection view stays comfortable to read on a phone and does not stretch endlessly across a wide screen.</p>
</main>`, 170)}

        <h2 id="recipe-grid">2. Let a card collection choose its columns</h2>
        <p>
          Choose a minimum useful card width and let Grid fit as many columns
          as the container allows. <code>min(100%, ...)</code> protects a card
          inside a very narrow panel; <code>minmax(0, 1fr)</code> lets its
          content shrink instead of forcing horizontal overflow.
        </p>
        ${renderLiveCssExample("The browser fits as many game cards as the available width allows.", `.game-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, 10rem), 1fr)
  );
  gap: 0.75rem;
}

.game-grid article { min-inline-size: 0; padding: 0.75rem; background: #d8e8df; }`, `<section class="game-grid">
  <article>Hollow Knight</article><article>Celeste</article><article>Hades</article><article>Tunic</article>
</section>`, 210)}

        <h2 id="recipe-card">3. Align card actions when descriptions vary</h2>
        <p>
          Make the card a column and push its action group to the end with
          <code>margin-block-start: auto</code>. The description can wrap to
          different lengths while buttons still line up along the card row.
        </p>
        ${renderLiveCssExample("Both card actions sit at the bottom even though the descriptions have different lengths.", `.game-card {
  display: flex;
  flex-direction: column;
  min-block-size: 12rem;
  gap: 0.65rem;
  border: 1px solid #cbcfc8;
  padding: 0.85rem;
}

.game-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block-start: auto;
}`, `<div class="game-grid">
  <article class="game-card"><h3>Celeste</h3><p>Completed on Switch.</p><div class="game-card__actions"><button>Details</button></div></article>
  <article class="game-card"><h3>Hollow Knight</h3><p>A longer note about the route through Hallownest and the optional content still waiting in the backlog.</p><div class="game-card__actions"><button>Details</button></div></article>
</div>`, 240)}

        <h2 id="recipe-split">4. Put filters beside results, then stack them</h2>
        <p>
          Use a narrow minimum for the filter rail and a shrinkable results
          track. Switch to one column when the content no longer fits instead
          of targeting a named phone size.
        </p>
        ${renderLiveCssExample("The filter rail sits beside results in a wide preview and above them in a narrow one.", `.collection-layout {
  display: grid;
  grid-template-columns: minmax(9rem, 1fr) minmax(0, 3fr);
  gap: 1rem;
}

@media (max-width: 34rem) {
  .collection-layout { grid-template-columns: minmax(0, 1fr); }
}`, `<main class="collection-layout">
  <aside><strong>Filters</strong><p>Platform · Status</p></aside>
  <section><h2>Collection</h2><p>Hollow Knight · Celeste · Hades</p></section>
</main>`, 190)}

        <h2 id="recipe-tags">5. Let tags wrap without manual separators</h2>
        <p>
          Use Flexbox wrapping and a gap. The gap applies both between items
          horizontally and between wrapped rows, without adding space around
          the outside of the group.
        </p>
        ${renderLiveCssExample("Platform and genre labels wrap naturally when the preview narrows.", `.game-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.game-tags span {
  border: 1px solid #cbcfc8;
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
}`, `<div class="game-tags">
  <span>Nintendo Switch</span><span>Role-playing</span><span>Currently playing</span><span>Local co-op</span>
</div>`, 150)}

        <h2 id="recipe-cover">6. Crop every cover to the same frame</h2>
        <p>
          Keep an aspect ratio, size the image to its frame, and use
          <code>object-fit: cover</code> to crop rather than distort. Set
          <code>object-position</code> when the subject is not centered. Keep
          useful cover art as an image with appropriate alternative text.
        </p>
        ${renderLiveCssExample("Local cover artwork fills a portrait frame without stretching.", `.cover-frame {
  inline-size: 7rem;
  aspect-ratio: 3 / 4;
  overflow: hidden;
}

.cover-frame img {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
  object-position: center 35%;
}`, `<div class="cover-frame"><img src="/demo-apps/nala-documentation/assets/game-cover-240.svg" alt="Illustrated Game Shelf game cover"></div>`, 180)}

        <h2 id="recipe-title">7. Keep a long title from breaking the card</h2>
        <p>
          For a one-line title, constrain the available width, prevent wrapping,
          then clip with an ellipsis. For a multi-line summary, line clamping
          creates a compact preview. Keep the full title or description
          available elsewhere; truncated text should not hide essential meaning.
        </p>
        ${renderLiveCssExample("The title stays on one line and its description is limited to three lines.", `.game-title {
  max-inline-size: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.game-summary {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}`, `<article style="max-width: 20rem;">
  <h2 class="game-title">The Legend of Zelda: Tears of the Kingdom</h2>
  <p class="game-summary">Explore a vast world, discover strange islands high above Hyrule, and find creative ways to solve puzzles. This description is a compact preview; the full notes remain available on the game details page.</p>
</article>`, 190)}

        <h2 id="recipe-button">8. Give buttons consistent interaction states</h2>
        <p>
          Keep a clear resting state, a small hover/pressed response, and a
          focus outline that does not depend on color alone. Disabled buttons
          should still remain legible enough to understand why an action is
          unavailable.
        </p>
        ${renderLiveCssExample("Hover, press, tab to, and inspect the disabled action.", `.game-action {
  border: 1px solid #184d3b;
  border-radius: 4px;
  padding: 0.6rem 0.85rem;
  background: #184d3b;
  color: white;
  font: inherit;
  cursor: pointer;
  transition: transform 140ms ease, background-color 140ms ease;
}

.game-action:hover { background: #10372a; }
.game-action:active { transform: translateY(1px); }
.game-action:focus-visible { outline: 3px solid #315f70; outline-offset: 3px; }
.game-action:disabled { cursor: not-allowed; opacity: 0.65; }`, `<button class="game-action" type="button">Add to wishlist</button>
<button class="game-action" type="button" disabled>Sync unavailable</button>`, 150)}

        <h2 id="recipe-field">9. Make a field error visible and understandable</h2>
        <p>
          Combine an explicit label, a real error message, and a state selector
          tied to the control. A border color is supplemental feedback, not the
          only way to identify an error. Keep focus visible even when the value
          is invalid.
        </p>
        ${renderLiveCssExample("The invalid value has a border and nearby text explains how to fix it.", `.form-field {
  display: grid;
  max-inline-size: 23rem;
  gap: 0.4rem;
}

.form-field input { border: 1px solid #68716c; padding: 0.6rem; font: inherit; }
.form-field input[aria-invalid="true"] { border-color: #a43f35; }
.form-field input:focus-visible { outline: 3px solid #315f70; outline-offset: 2px; }
.form-field [role="alert"] { color: #8b2f28; }`, `<div class="form-field">
  <label for="platform-name">Platform name</label>
  <input id="platform-name" value="" aria-invalid="true" aria-describedby="platform-error">
  <small id="platform-error" role="alert">Enter a platform name.</small>
</div>`, 190)}

        <h2 id="recipe-status">10. Pair a status color with text</h2>
        <p>
          A dot or accent border can help scanning, but include the status word
          in the document so meaning survives color-vision differences, forced
          colors, and monochrome output.
        </p>
        ${renderLiveCssExample("Color and a decorative marker reinforce, rather than replace, the status label.", `.game-status {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: #10372a;
}

.game-status::before {
  content: "";
  inline-size: 0.55rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #184d3b;
}`, `<p class="game-status">Currently playing · Hades</p>`, 120)}

        <h2 id="recipe-table">11. Keep numeric columns aligned</h2>
        <p>
          Tabular numerals keep digits aligned in columns. Let a wide table
          scroll inside its own wrapper on narrow screens instead of making the
          whole document overflow. Use real table headers for the data
          relationships.
        </p>
        ${renderLiveCssExample("Play-time values line up, and the table remains contained in its scroll region.", `.table-scroll { max-inline-size: 100%; overflow-x: auto; }

.collection-table { inline-size: 100%; border-collapse: collapse; }
.collection-table th, .collection-table td { padding: 0.55rem; border-block-end: 1px solid #cbcfc8; text-align: start; }
.collection-table .hours { font-variant-numeric: tabular-nums; text-align: end; }`, `<div class="table-scroll" tabindex="0" aria-label="Scrollable collection table">
  <table class="collection-table">
    <thead><tr><th>Game</th><th>Status</th><th>Hours played</th></tr></thead>
    <tbody><tr><td>Hades</td><td>Playing</td><td class="hours">142.0</td></tr><tr><td>Celeste</td><td>Completed</td><td class="hours">9.5</td></tr></tbody>
  </table>
</div>`, 210)}

        <h2 id="recipe-sticky">12. Keep a section heading visible while its list scrolls</h2>
        <p>
          Put the sticky heading and its rows in the same scroll container. The
          inset determines where it sticks; an opaque background keeps rows
          from showing through as they pass underneath.
        </p>
        ${renderLiveCssExample("Scroll the activity list while its heading remains at the top of that region.", `.activity-list { max-block-size: 8rem; overflow: auto; }

.activity-list h3 {
  position: sticky;
  inset-block-start: 0;
  margin: 0;
  padding: 0.6rem;
  background: #d8e8df;
}`, `<section class="activity-list" tabindex="0" aria-label="Recent game activity">
  <h3>Recently played</h3><p>Hades · Today</p><p>Celeste · Monday</p><p>Tunic · Sunday</p><p>Hollow Knight · Friday</p>
</section>`, 190)}

        <h2 id="recipe-loading">13. Show a loading placeholder without flashing</h2>
        <p>
          A skeleton can reserve space while content loads, preventing a large
          layout shift. Keep it decorative to assistive technology and honor
          reduced-motion preferences. The actual loading label should be real
          text in the application.
        </p>
        ${renderLiveCssExample("The skeleton reserves the shape of a game card and gently shimmers unless motion is reduced.", `.game-skeleton {
  min-block-size: 6rem;
  border-radius: 4px;
  background: linear-gradient(100deg, #e4e7e2 25%, #f4f5f2 40%, #e4e7e2 55%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer { to { background-position-x: -200%; } }

@media (prefers-reduced-motion: reduce) {
  .game-skeleton { animation: none; }
}`, `<div class="game-skeleton" aria-hidden="true"></div>
<p role="status">Loading game details…</p>`, 150)}

        <h2 id="recipe-empty">14. Center an empty state inside the results area</h2>
        <p>
          Give the parent a minimum block size and center its child with Grid.
          The content remains in normal flow and can grow when translated or
          zoomed.
        </p>
        ${renderLiveCssExample("The empty state centers in the available region but can still grow with its text.", `.empty-state {
  display: grid;
  place-content: center;
  justify-items: center;
  min-block-size: 10rem;
  padding: 1rem;
  text-align: center;
}`, `<section class="empty-state">
  <h2>No games match</h2>
  <p>Try clearing one of your filters.</p>
  <button type="button">Clear filters</button>
</section>`, 190)}

        <h2 id="recipe-skip">15. Reveal a skip link when it receives focus</h2>
        <p>
          A skip link lets keyboard users bypass repeated navigation. Keep it
          available offscreen rather than using <code>display: none</code>,
          then bring it into view on keyboard focus. The destination must exist
          and be focusable when needed.
        </p>
        ${renderLiveCssExample("Tab into the preview to reveal the skip link above the collection content.", `.skip-link {
  position: absolute;
  inset-block-start: 0.5rem;
  inset-inline-start: 0.5rem;
  transform: translateY(-200%);
  padding: 0.6rem 0.8rem;
  background: #10372a;
  color: white;
  z-index: 1;
}

.skip-link:focus { transform: translateY(0); }`, `<a class="skip-link" href="#game-results">Skip to results</a>
<nav aria-label="Example navigation">Collection · Wishlist · Backlog</nav>
<main id="game-results" tabindex="-1"><h2>Your collection</h2><p>Hollow Knight · Hades · Celeste</p></main>`, 180)}

        <h2 id="recipe-action-bar">16. Keep an important mobile action reachable</h2>
        <p>
          A sticky action bar remains in document flow and avoids covering
          content like a fixed footer can. Include the bottom safe-area inset
          on devices with a home indicator, and check that the bar does not
          obscure focused content or browser controls.
        </p>
        ${renderLiveCssExample("The action bar sticks to the bottom of its panel and includes safe-area spacing.", `.game-detail {
  min-block-size: 9rem;
  display: flex;
  flex-direction: column;
}

.game-detail__action-bar {
  position: sticky;
  inset-block-end: 0;
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-block-start: auto;
  padding: 0.75rem;
  padding-block-end: calc(0.75rem + env(safe-area-inset-bottom, 0px));
  background: #fffefa;
  border-block-start: 1px solid #cbcfc8;
}`, `<article class="game-detail">
  <h2>Hollow Knight</h2>
  <p>Backlog · Nintendo Switch</p>
  <div class="game-detail__action-bar"><button type="button">Edit</button><button type="button">Mark played</button></div>
</article>`, 210)}

        <h2>Adapt a recipe</h2>
        <ol>
          <li>Keep the semantic HTML and replace only the sample class names and values.</li>
          <li>Test with longer titles, translated labels, zoom, keyboard focus, and narrow containers.</li>
          <li>Check the behavior without color, animation, or images so meaning remains available.</li>
          <li>When a recipe depends on a newer feature, provide a usable base and consult the related reference chapter.</li>
        </ol>
        <p>
          For the layout foundations behind these patterns, continue to
          <a href="/css-layout/grid">CSS Grid</a>,
          <a href="/css-layout/flexbox">Flexbox</a>, and
          <a href="/css-layout/miscellaneous">Miscellaneous CSS</a>.
        </p>
      </article>
    `
});
