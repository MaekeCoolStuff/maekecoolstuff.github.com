import { defineComponent, html } from "../../../../vendor/components/dist/index.js";
import { renderCodeExample } from "./code-example.js";
export const cssLayoutPages = [
  {
    slug: "overview",
    tagName: "docs-css-layout-overview"
  },
  {
    slug: "grid",
    tagName: "docs-css-layout-grid"
  },
  {
    slug: "flexbox",
    tagName: "docs-css-layout-flexbox"
  },
  {
    slug: "miscellaneous",
    tagName: "docs-css-layout-miscellaneous"
  },
  {
    slug: "cookbook",
    tagName: "docs-css-layout-cookbook"
  }
];
export function createCssLayoutPage(slug) {
  const page = cssLayoutPages.find((entry)=>entry.slug === slug);
  if (!page) throw new Error(`Unknown CSS layout page: ${slug}`);
  return document.createElement(page.tagName);
}
defineComponent("docs-css-layout-overview", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Reference · CSS Layout</p>
        <h1>Layout belongs to CSS.</h1>
        <p class="page-lead">
          Nala does not ship a custom grid system. The browser already has two
          powerful, interoperable layout tools: CSS Grid for arranging things in
          two dimensions, and Flexbox for arranging things along one dimension.
          This guide teaches both from first principles, then combines them into
          responsive page layouts.
        </p>

        <h2>Why there is no Nala grid system</h2>
        <p>
          A framework grid often asks you to wrap content in rows and columns,
          choose a fixed column count, and attach framework-specific class names.
          That can be useful when a team needs one rigid design convention, but it
          also creates a second layout vocabulary on top of CSS. The markup then
          describes the framework instead of the relationship between the content.
        </p>
        <p>
          Nala is frameworkless by design. A reusable runtime layout system would
          duplicate browser features, impose opinions on every application, and
          make otherwise portable markup depend on Nala. Native CSS lets a
          component, a plain page, and a third-party custom element participate in
          the same layout without an adapter.
        </p>

        <nala-callout tone="info">
          <span slot="title">The UI grid component is not a CSS grid system</span>
          <code>nala-grid-view</code> is an optional, ready-made collection
          presentation component. It helps render a particular kind of UI; it
          does not replace CSS Grid, define a page-wide column framework, or limit
          how you arrange your own elements.
        </nala-callout>

        <h2>Choose the relationship, then choose the tool</h2>
        <div class="api-table-wrap">
          <table class="api-table">
            <thead><tr><th>Question</th><th>Use</th><th>Reason</th></tr></thead>
            <tbody>
              <tr><td>Do rows and columns need to line up together?</td><td><code>display: grid</code></td><td>Grid controls tracks in two dimensions at the same time.</td></tr>
              <tr><td>Are items arranged in one row or one column?</td><td><code>display: flex</code></td><td>Flexbox distributes items along one main axis and lets them adapt.</td></tr>
              <tr><td>Does the page have both kinds of relationships?</td><td>Combine them</td><td>A grid can place major regions while a flex row aligns a toolbar inside one region.</td></tr>
            </tbody>
          </table>
        </div>

        <h2>A real page uses both</h2>
        <p>
          Imagine Game Shelf: a filter panel beside a collection, with each game
          represented by an image and a title. Grid gives the page its two-column
          structure and lays the collection cards into tracks. Flexbox is a good
          fit inside a card when its cover and details need to sit beside each
          other, or in a toolbar when controls should share a row.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · responsive collection workspace</p>
          <div class="layout-grid-workspace">
            <div class="layout-tile filters">Filters<br />Platform · Status</div>
            <div class="layout-tile collection">
              <span class="layout-demo-label">Your collection</span>
              <div class="collection-list">
                <div class="layout-tile">Hollow Knight</div>
                <div class="layout-tile">Celeste</div>
                <div class="layout-tile">Hades</div>
                <div class="layout-tile">Sea of Stars</div>
              </div>
            </div>
          </div>
        </div>
        ${renderCodeExample(`.collection-page {
  display: grid;
  grid-template-columns: minmax(12rem, 1fr) minmax(0, 3fr);
  gap: 1.5rem;
}

.game-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 1rem;
}

.game-card__heading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}`)}
        <p>
          Notice that each declaration answers a layout question at the level
          where it occurs. The page owns the sidebar relationship; the list owns
          its card tracks; a card heading owns its internal alignment. This
          composition is easier to adjust than one global grid with a fixed set
          of framework columns.
        </p>

        <h2>A useful mental model</h2>
        <ol>
          <li>Put the related elements in the same parent container.</li>
          <li>Choose Grid when rows and columns should coordinate; choose Flexbox when items flow along one axis.</li>
          <li>Give the container the layout rules. Give children only the placement or sizing rules they need.</li>
          <li>Let content size itself, and add constraints where a design needs them.</li>
          <li>Test at narrow widths, with longer text, and with the real amount of content.</li>
        </ol>

        <h2>Start learning</h2>
        <div class="docs-grid">
          <nala-card variant="accent">
            <span slot="eyebrow">Two dimensions</span>
            <span slot="title">CSS Grid</span>
            <p>Build track-based page regions, responsive card collections, and named layouts.</p>
            <a slot="actions" href="/css-layout/grid">Read the Grid guide</a>
          </nala-card>
          <nala-card>
            <span slot="eyebrow">One dimension</span>
            <span slot="title">Flexbox</span>
            <p>Align, wrap, and distribute items along a row or a column.</p>
            <a slot="actions" href="/css-layout/flexbox">Read the Flexbox guide</a>
          </nala-card>
          <nala-card>
            <span slot="eyebrow">More CSS tools</span>
            <span slot="title">Miscellaneous CSS</span>
            <p>Learn sizing, positioning, overflow, responsive units, and more.</p>
            <a slot="actions" href="/css-layout/miscellaneous">Read the CSS reference</a>
          </nala-card>
          <nala-card>
            <span slot="eyebrow">Practical recipes</span>
            <span slot="title">CSS Cookbook</span>
            <p>Start with a common styling problem and adapt a small solution.</p>
            <a slot="actions" href="/css-layout/cookbook">Browse recipes</a>
          </nala-card>
        </div>
      </article>
    `
});
defineComponent("docs-css-layout-grid", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Reference · CSS Layout</p>
        <h1>CSS Grid layout</h1>
        <p class="page-lead">
          CSS Grid is a two-dimensional layout system. Define columns and rows on
          a container, then let its children fill, span, or occupy named areas in
          those tracks. It is especially useful when the alignment of one row
          should relate to the rows around it.
        </p>
        <nav class="component-doc-nav" aria-label="Grid guide contents">
          <a href="#grid-first-layout">First layout</a>
          <a href="#grid-tracks">Tracks and sizing</a>
          <a href="#grid-placement">Placement</a>
          <a href="#grid-alignment">Alignment</a>
          <a href="#grid-responsive">Responsive grids</a>
          <a href="#grid-patterns">Page patterns</a>
        </nav>

        <h2 id="grid-first-layout">1. Your first grid</h2>
        <p>
          A grid begins when an element becomes a grid container. Its direct
          children become grid items. Start by describing the columns, then add
          space between tracks with <code>gap</code>.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · three equal columns</p>
          <div class="layout-grid-basic">
            <div class="layout-tile">Wishlist</div>
            <div class="layout-tile">Playing</div>
            <div class="layout-tile">Completed</div>
            <div class="layout-tile">Backlog</div>
            <div class="layout-tile">On hold</div>
            <div class="layout-tile">Archived</div>
          </div>
        </div>
        ${renderCodeExample(`.status-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}`)}
        <p>
          <code>grid-template-columns</code> creates three explicit columns. The
          <code>repeat(3, 1fr)</code> notation means “repeat this track three
          times, each taking one fraction of the available space.” The grid makes
          as many rows as it needs for the children. A grid item does not need an
          extra wrapper or a special class to become part of the grid.
        </p>

        <h2 id="grid-tracks">2. Tracks, gaps, and useful sizing</h2>
        <p>
          A <em>track</em> is a row or column. CSS Grid has several sizing units;
          the best choice depends on whether the content or the container should
          control the final size.
        </p>
        <div class="api-table-wrap">
          <table class="api-table">
            <thead><tr><th>Value</th><th>Meaning</th><th>Typical use</th></tr></thead>
            <tbody>
              <tr><td><code>12rem</code></td><td>A fixed track size</td><td>A known narrow rail, when overflow is accounted for.</td></tr>
              <tr><td><code>1fr</code></td><td>A share of remaining free space</td><td>Equal or proportional flexible columns.</td></tr>
              <tr><td><code>minmax(12rem, 1fr)</code></td><td>A lower and upper track size</td><td>A column that can grow but should not become too narrow.</td></tr>
              <tr><td><code>min-content</code> / <code>max-content</code></td><td>Content-based intrinsic sizes</td><td>Specialized tracks that follow the smallest or unwrapped content width.</td></tr>
              <tr><td><code>auto</code></td><td>Content-sensitive automatic sizing</td><td>Rows or columns sized by their items and alignment rules.</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Use <code>minmax(0, 1fr)</code> for a flexible track that must be
          allowed to shrink below the intrinsic width of long content. Grid
          items have an automatic minimum size tied to their contents in many
          cases; without that zero minimum, a long title or code token can push
          a column wider than its container. Also consider
          <code>min-width: 0</code> on a child that must be allowed to shrink.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · a flexible sidebar beside a collection</p>
          <div class="layout-grid-workspace">
            <div class="layout-tile filters">Platform<br />Status</div>
            <div class="layout-tile collection">Hollow Knight · Celeste · Hades</div>
          </div>
        </div>
        ${renderCodeExample(`.collection-layout {
  display: grid;
  grid-template-columns: minmax(12rem, 1fr) minmax(0, 3fr);
  gap: 1.5rem;
}

.collection-main {
  min-width: 0;
}`)}
        <p>
          <code>gap</code>, <code>column-gap</code>, and
          <code>row-gap</code> create space between tracks without adding extra
          margins to the first or last item. Prefer them for layout spacing.
        </p>

        <h2>Implicit rows and automatic placement</h2>
        <p>
          When you define columns but not enough rows, Grid creates implicit
          rows as items arrive. This default auto-placement is row-first: it
          fills the first row, then moves to the next. Set
          <code>grid-auto-rows</code> to control rows that are created this way.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · automatic rows follow each card's content</p>
          <div class="layout-grid-implicit">
            <div class="layout-tile">Hollow Knight</div>
            <div class="layout-tile">Celeste<br />A longer note makes this row taller.</div>
            <div class="layout-tile">Hades</div>
            <div class="layout-tile">Sea of Stars</div>
          </div>
        </div>
        ${renderCodeExample(`.game-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: minmax(8rem, auto);
  gap: 1rem;
}`)}

        <h2 id="grid-placement">3. Place items on the grid</h2>
        <p>
          Grid lines are the boundaries around tracks. Lines are numbered from
          one at the start of the grid, so an item can name a start and end line,
          or start on one line and span a number of tracks. Most collections do
          not need explicit placement; use it for elements that genuinely span
          multiple tracks.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · the featured game spans two tracks</p>
          <div class="layout-grid-span-demo">
            <div class="layout-tile featured">Featured · Sea of Stars</div>
            <div class="layout-tile">Hades</div>
            <div class="layout-tile">Celeste</div>
            <div class="layout-tile">Tunic</div>
          </div>
        </div>
        ${renderCodeExample(`.featured-game {
  grid-column: 1 / 3; /* from line 1 up to line 3 */
}

.featured-game--wide {
  grid-column: span 2;
}`)}
        <p>
          Grid also supports named lines and named areas. Areas are often easier
          to read when laying out page regions because the CSS diagram resembles
          the intended page. Use a dot for a deliberately empty cell.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · named areas</p>
          <div class="layout-grid-areas">
            <div class="layout-tile cover">Game cover</div>
            <div class="layout-tile title">Game title</div>
            <div class="layout-tile details">Platform · status · play time</div>
            <div class="layout-tile actions">Open details</div>
          </div>
        </div>
        ${renderCodeExample(`.game-card {
  display: grid;
  grid-template-columns: minmax(5rem, 1fr) 2fr;
  grid-template-areas:
    "cover title"
    "cover details"
    "cover actions";
  gap: 0.75rem;
}

.game-cover { grid-area: cover; }
.game-title { grid-area: title; }
.game-details { grid-area: details; }
.game-actions { grid-area: actions; }`)}
        <p>
          Every cell in the area diagram must form a rectangle. The names are
          author-defined labels, not HTML semantics; keep the DOM in a sensible
          reading order for assistive technology and keyboard navigation.
        </p>

        <h2 id="grid-alignment">4. Align tracks and items</h2>
        <p>
          Grid alignment has two levels. <code>justify-content</code> and
          <code>align-content</code> align the whole track collection when it is
          smaller than its container. <code>justify-items</code> and
          <code>align-items</code> align each item inside its own grid area.
          Their place-shorthand forms are <code>place-content</code> and
          <code>place-items</code>. On an individual item, use
          <code>justify-self</code> or <code>align-self</code>.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · center the panel, align one action to the end</p>
          <div class="layout-grid-alignment-examples">
            <div class="layout-grid-center-demo">
              <div class="layout-tile">Centered empty state</div>
            </div>
            <div class="layout-grid-align-demo">
              <div class="layout-tile">Game details</div>
              <div class="layout-tile actions">Open game</div>
            </div>
          </div>
        </div>
        ${renderCodeExample(`.centered-grid {
  display: grid;
  place-items: center;
  min-height: 12rem;
}

.actions {
  justify-self: end;
  align-self: center;
}`)}
        <p>
          <code>justify-*</code> usually describes the inline axis (left to right
          in common horizontal writing); <code>align-*</code> usually describes
          the block axis (top to bottom). The logical axes adapt to writing
          direction, while physical words such as “left” do not.
        </p>

        <h2 id="grid-responsive">5. Responsive grids without breakpoints</h2>
        <p>
          A card collection often only needs a minimum useful card width. Let the
          browser determine how many columns fit instead of choosing a different
          count at every viewport width. <code>auto-fit</code> collapses empty
          tracks after placement so the remaining tracks can stretch;
          <code>auto-fill</code> keeps the empty tracks in the calculation. With
          full rows of cards they often look the same. Choose based on whether
          empty slots should reserve room.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · resize to change the column count</p>
          <div class="layout-grid-responsive">
            <div class="layout-tile">Hollow Knight</div>
            <div class="layout-tile">Celeste</div>
            <div class="layout-tile">Hades</div>
            <div class="layout-tile">Sea of Stars</div>
            <div class="layout-tile">Tunic</div>
          </div>
        </div>
        ${renderCodeExample(`.game-cards {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, 13rem), 1fr)
  );
  gap: 1rem;
}`)}
        <p>
          The inner <code>min(100%, 13rem)</code> prevents the minimum card size
          from overflowing a container narrower than 13rem. This is a useful
          guard for small screens and narrow side panels. Media queries remain
          valuable when the design itself must change, such as moving filters
          above results rather than merely reducing the number of columns.
        </p>

        <h2 id="grid-patterns">6. Build a responsive page</h2>
        <p>
          Named areas make a page structure easy to scan. At the narrow
          breakpoint, the same regions can be rearranged without moving or
          duplicating their HTML. CSS changes visual placement only, so keep the
          source order meaningful.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · filters collapse above the collection on narrow screens</p>
          <div class="layout-grid-workspace">
            <div class="layout-tile filters">Filters<br />Platform · Status</div>
            <div class="layout-tile collection">
              <span class="layout-demo-label">Collection</span>
              <div class="collection-list">
                <div class="layout-tile">Hollow Knight</div>
                <div class="layout-tile">Celeste</div>
                <div class="layout-tile">Hades</div>
                <div class="layout-tile">Sea of Stars</div>
              </div>
            </div>
          </div>
        </div>
        ${renderCodeExample(`.shelf {
  display: grid;
  grid-template-columns: minmax(12rem, 1fr) minmax(0, 3fr);
  grid-template-areas: "filters collection";
  gap: 1.5rem;
}

.filters { grid-area: filters; }
.collection { grid-area: collection; min-width: 0; }

.collection__games {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 13rem), 1fr));
  gap: 1rem;
}

@media (max-width: 48rem) {
  .shelf {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "filters"
      "collection";
    gap: 1rem;
  }
}`)}

        <h2>Subgrid and nested layouts</h2>
        <p>
          A nested grid normally calculates its tracks independently. When child
          cards need their internal rows to line up across the parent grid,
          <code>subgrid</code> lets a nested grid adopt tracks from its parent.
          It is useful for aligned cards with variable text, but is not required
          for ordinary nesting. Check target browser support if your project
          includes older browsers.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · matching card rows use subgrid</p>
          <div class="layout-grid-subgrid">
            <article class="subgrid-card">
              <div class="layout-tile">Hollow Knight</div>
              <div class="layout-tile">Backlog · Switch</div>
              <div class="layout-tile">Open details</div>
            </article>
            <article class="subgrid-card">
              <div class="layout-tile">Sea of Stars</div>
              <div class="layout-tile">Currently playing · PC</div>
              <div class="layout-tile">Open details</div>
            </article>
          </div>
        </div>
        ${renderCodeExample(`.game-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.game-card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid;
}`)}

        <h2>Common mistakes and debugging</h2>
        <ul>
          <li><strong>Too many explicit positions:</strong> let regular content auto-place. Explicit line numbers become brittle when columns change.</li>
          <li><strong>Overflowing long content:</strong> try <code>minmax(0, 1fr)</code> for flexible tracks and <code>min-width: 0</code> for shrinkable children.</li>
          <li><strong>Using <code>dense</code> casually:</strong> dense auto-placement may visually move later items into earlier holes while keyboard and screen-reader order stays unchanged.</li>
          <li><strong>Using Grid for every small alignment:</strong> if items simply form one row or column, Flexbox may express the intent more directly.</li>
        </ul>
        <p>
          In browser developer tools, inspect the grid container and turn on its
          grid overlay. Track lines, named areas, gaps, and implicit tracks become
          visible; this is often the quickest way to understand an unexpected
          size or placement.
        </p>

        <h2>When Grid is the right choice</h2>
        <p>
          Reach for Grid when the layout has meaningful rows and columns, when
          the alignment of different rows should stay coordinated, or when named
          page regions make the design clearer. For a navigation bar, a row of
          actions, or a compact media object, continue to the Flexbox guide.
        </p>
        <p><a href="/css-layout/flexbox">Continue to Flexbox layout</a></p>
      </article>
    `
});
defineComponent("docs-css-layout-flexbox", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Reference · CSS Layout</p>
        <h1>Flexbox layout</h1>
        <p class="page-lead">
          Flexbox arranges items along one main axis: a row or a column. It is
          designed for relationships where items can grow, shrink, wrap, or
          distribute their free space as a group. Use it for toolbars, navigation,
          media objects, button rows, and many component internals.
        </p>
        <nav class="component-doc-nav" aria-label="Flexbox guide contents">
          <a href="#flex-first-layout">First layout</a>
          <a href="#flex-axis">Axes</a>
          <a href="#flex-sizing">Sizing</a>
          <a href="#flex-alignment">Alignment</a>
          <a href="#flex-responsive">Wrapping</a>
          <a href="#flex-patterns">Patterns</a>
        </nav>

        <h2 id="flex-first-layout">1. Your first flex layout</h2>
        <p>
          Set <code>display: flex</code> on a parent to make its direct children
          flex items. By default, they sit in one row. The parent controls their
          direction, spacing, alignment, and wrapping; the children can control
          their own growth and shrinkage.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · items share a row, with a wider first item</p>
          <div class="layout-flex-row">
            <div class="layout-tile">Collection</div>
            <div class="layout-tile">Wishlist</div>
            <div class="layout-tile">Settings</div>
          </div>
        </div>
        ${renderCodeExample(`.toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toolbar__brand {
  flex: 2 1 0;
}

.toolbar__action {
  flex: 1 1 0;
}`)}
        <p>
          <code>gap</code> inserts consistent space between items. It does not
          add a margin before the first or after the last item, so it is usually
          simpler than spacing every child individually.
        </p>

        <h2 id="flex-axis">2. Understand the axes</h2>
        <p>
          Every flex container has a <em>main axis</em> and a perpendicular
          <em>cross axis</em>. <code>flex-direction</code> chooses the main axis:
          <code>row</code> (the default), <code>row-reverse</code>,
          <code>column</code>, or <code>column-reverse</code>.
        </p>
        <p>
          <code>justify-content</code> distributes items along the main axis;
          <code>align-items</code> aligns them along the cross axis. If you switch
          from <code>row</code> to <code>column</code>, those physical directions
          switch too. Start with the axis before reaching for an alignment
          property; it prevents a lot of “why did this move vertically?”
          confusion.
        </p>
        <div class="api-table-wrap">
          <table class="api-table">
            <thead><tr><th>Property</th><th>Axis</th><th>Common values</th></tr></thead>
            <tbody>
              <tr><td><code>justify-content</code></td><td>Main</td><td><code>flex-start</code>, <code>center</code>, <code>space-between</code>, <code>space-around</code>, <code>space-evenly</code></td></tr>
              <tr><td><code>align-items</code></td><td>Cross, for each line</td><td><code>stretch</code>, <code>flex-start</code>, <code>center</code>, <code>baseline</code></td></tr>
              <tr><td><code>align-content</code></td><td>Cross, between wrapped lines</td><td><code>stretch</code>, <code>center</code>, <code>space-between</code></td></tr>
              <tr><td><code>align-self</code></td><td>Cross, one item</td><td>Overrides that item's <code>align-items</code> alignment.</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="flex-sizing">3. Let items grow and shrink</h2>
        <p>
          Flex items start with a basis, then share free space or surrender space
          when the line is too small. The three longhand properties are
          <code>flex-grow</code>, <code>flex-shrink</code>, and
          <code>flex-basis</code>; the usual shorthand is
          <code>flex: grow shrink basis</code>.
        </p>
        <div class="api-table-wrap">
          <table class="api-table">
            <thead><tr><th>Part</th><th>What it controls</th><th>Example</th></tr></thead>
            <tbody>
              <tr><td><code>flex-grow</code></td><td>How an item shares positive free space relative to its siblings.</td><td><code>flex-grow: 1</code></td></tr>
              <tr><td><code>flex-shrink</code></td><td>How an item gives up space when the line is too small.</td><td><code>flex-shrink: 1</code></td></tr>
              <tr><td><code>flex-basis</code></td><td>The starting size before free space is distributed.</td><td><code>flex-basis: 12rem</code></td></tr>
            </tbody>
          </table>
        </div>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · fixed cover, flexible details, and equal toolbar actions</p>
          <div class="layout-flex-sizing-demo">
            <div class="layout-tile cover">Cover</div>
            <div class="layout-tile details">Sea of Stars · currently playing on PC</div>
            <div class="layout-flex-equal-row">
              <div class="layout-tile toolbar-item">Wishlist</div>
              <div class="layout-tile toolbar-item">Backlog</div>
              <div class="layout-tile toolbar-item">Completed</div>
            </div>
          </div>
        </div>
        ${renderCodeExample(`/* Flexible item: can grow and shrink from a 12rem basis. */
.details {
  flex: 1 1 12rem;
}

/* Fixed-size item: do not grow or shrink. */
.cover {
  flex: 0 0 5rem;
}

/* Equal share of the remaining space. */
.toolbar__item {
  flex: 1 1 0;
}`)}
        <p>
          <code>flex: 1</code> is a convenient common shorthand for a flexible
          item; browsers expand shorthand defaults in ways that differ from
          writing only one longhand, so prefer an explicit three-part value when
          the basis or shrink behavior matters. Flex items also have a content-
          based minimum size by default. If a text-heavy item refuses to shrink,
          <code>min-width: 0</code> is often the missing rule.
        </p>

        <h2 id="flex-alignment">4. Alignment and free space</h2>
        <p>
          Use <code>justify-content</code> when the items as a group need to be
          positioned or spaced along the main axis. Use <code>align-items</code>
          for cross-axis alignment. <code>align-content</code> only affects the
          spacing of multiple flex lines, so it has no visible effect on a
          single-line container.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · baseline title and right-aligned actions</p>
          <div class="layout-flex-heading">
            <h3>Sea of Stars</h3>
            <div class="heading-actions">
              <div class="layout-tile">Wishlist</div>
              <div class="layout-tile">More</div>
            </div>
          </div>
        </div>
        ${renderCodeExample(`.game-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.game-heading__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}`)}
        <p>
          A flexible auto margin can absorb free space and push one item away
          from the others. This is a useful way to pin a toolbar action to the
          far edge without applying a space-distribution rule to every gap.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · auto margin separates the final action</p>
          <div class="layout-flex-toolbar">
            <div class="layout-tile">Select all</div>
            <div class="layout-tile">Sort</div>
            <span class="toolbar-spacer"></span>
            <div class="layout-tile">Add game</div>
          </div>
        </div>
        ${renderCodeExample(`.collection-toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.collection-toolbar__primary-action {
  margin-inline-start: auto;
}`)}

        <h2 id="flex-responsive">5. Wrap items for smaller screens</h2>
        <p>
          Flexbox is one-dimensional, but it can create multiple lines with
          <code>flex-wrap: wrap</code>. Each line distributes its own items. This
          is helpful for tags, filters, and controls that should move onto a new
          line instead of becoming too narrow. Set a basis or minimum width to
          make the wrapping threshold intentional.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · chips wrap naturally as space changes</p>
          <div class="layout-flex-wrap">
            <div class="layout-tile">Nintendo Switch</div>
            <div class="layout-tile">PlayStation 5</div>
            <div class="layout-tile">Windows PC</div>
            <div class="layout-tile">Currently playing</div>
            <div class="layout-tile">Completed</div>
          </div>
        </div>
        ${renderCodeExample(`.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-chip {
  flex: 0 1 auto;
  max-width: 100%;
}`)}
        <p>
          <code>align-content</code> is the cross-axis control for the wrapped
          lines as a group. <code>align-items</code> controls items within each
          line. If you need every row and column to align across the whole
          collection, use Grid instead: wrapped flex lines do not share column
          track sizes.
        </p>

        <h2 id="flex-patterns">6. Everyday flex patterns</h2>
        <h3>A media object</h3>
        <p>
          Keep a cover at a predictable size and let the details take the
          remaining width. Use <code>min-width: 0</code> on the flexible text
          region when long titles or descriptions must wrap.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · fixed cover and flexible details</p>
          <div class="layout-flex-card">
            <div class="layout-tile">Cover</div>
            <div class="layout-tile">Sea of Stars<br />Playing · PC<br />A long note can wrap in this flexible text region.</div>
          </div>
        </div>
        ${renderCodeExample(`.game-summary {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.game-summary__cover {
  flex: 0 0 5rem;
}

.game-summary__details {
  flex: 1 1 auto;
  min-width: 0;
}`)}

        <h3>A responsive navigation row</h3>
        <p>
          Allow the link group to wrap when necessary instead of shrinking each
          link until it is difficult to read. Real site navigation may need a
          separate compact menu at a breakpoint; Flexbox does not decide that
          interaction for you.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · brand and links keep their content size</p>
          <div class="layout-flex-nav">
            <div class="layout-tile">Game Shelf</div>
            <div class="nav-links">
              <div class="layout-tile">Collection</div>
              <div class="layout-tile">Wishlist</div>
              <div class="layout-tile">Backlog</div>
            </div>
          </div>
        </div>
        ${renderCodeExample(`.site-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.site-nav__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}`)}

        <h2>Reordering, accessibility, and common mistakes</h2>
        <ul>
          <li><strong>Do not use <code>order</code> to repair source order.</strong> It changes visual order, not keyboard tab order or the order announced by assistive technology. Keep the DOM meaningful first.</li>
          <li><strong>Do not expect wrapped lines to share columns.</strong> Each flex line calculates its sizes independently. Use Grid for shared row-and-column alignment.</li>
          <li><strong>Do not confuse main and cross axes.</strong> Their direction depends on <code>flex-direction</code>, especially when using <code>column</code>.</li>
          <li><strong>Watch automatic minimum sizes.</strong> A long word can prevent a flex item from shrinking; use <code>min-width: 0</code> when that content should fit the available space.</li>
          <li><strong>Use gaps instead of child margins for ordinary spacing.</strong> Gaps are predictable across wrapping and do not create outer spacing.</li>
        </ul>
        <p>
          Browser developer tools can highlight a flex container, its main and
          cross axes, each item’s size, and free space. Use the overlay to inspect
          the actual flex basis and shrink behavior rather than guessing from the
          shorthand.
        </p>

        <h2>Grid or Flexbox?</h2>
        <p>
          Prefer Flexbox when the items should flow together in a row or column
          and their sizes respond to the space available on that line. Prefer
          Grid when the layout needs coordinated columns and rows. They are not
          competitors: a grid page can contain flex toolbars, and a flex card can
          contain a small grid of metadata.
        </p>
        <p><a href="/css-layout/grid">Review CSS Grid layout</a> · <a href="/css-layout/overview">Back to CSS Layout overview</a></p>
      </article>
    `
});
defineComponent("docs-css-layout-miscellaneous", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Reference · CSS Layout</p>
        <h1>Miscellaneous CSS</h1>
        <p class="page-lead">
          Grid and Flexbox arrange elements, but a finished interface also
          depends on sizing, positioning, overflow, images, text, and responsive
          constraints. This guide collects the browser-native CSS tools that
          solve those everyday layout problems.
        </p>
        <nav class="component-doc-nav" aria-label="Miscellaneous CSS guide contents">
          <a href="#misc-box-model">Box model</a>
          <a href="#misc-logical">Logical properties</a>
          <a href="#misc-position">Positioning</a>
          <a href="#misc-overflow">Overflow</a>
          <a href="#misc-images">Images</a>
          <a href="#misc-responsive">Responsive sizing</a>
          <a href="#misc-text">Text and motion</a>
        </nav>

        <h2 id="misc-box-model">1. Make sizing predictable</h2>
        <p>
          By default, <code>width</code> describes an element's content box;
          padding and borders are added outside that width. With
          <code>box-sizing: border-box</code>, the declared width includes the
          padding and border. Applying it to every element makes percentage and
          fixed widths much easier to reason about.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · equal declared widths, different box-sizing</p>
          <div class="misc-sizing-compare">
            <div class="misc-sizing-box content-box">content-box · declared 7rem</div>
            <div class="misc-sizing-box border-box">border-box · declared 7rem</div>
          </div>
        </div>
        ${renderCodeExample(`*,
*::before,
*::after {
  box-sizing: border-box;
}

.sidebar {
  inline-size: 16rem;
  padding: 1rem;
  border: 1px solid currentColor;
}`)}
        <p>
          Prefer constraints such as <code>max-inline-size</code> and
          <code>min-block-size</code> to hard-coded dimensions when content can
          vary. Grid and Flexbox children sometimes need
          <code>min-inline-size: 0</code> to shrink below their content's
          intrinsic width; this is the logical equivalent of
          <code>min-width: 0</code> in a horizontal writing mode.
        </p>

        <h2 id="misc-logical">2. Use logical properties</h2>
        <p>
          Properties such as <code>margin-left</code> assume that content flows
          from left to right. Logical properties describe the content's
          inline and block directions instead. In English, inline usually means
          left-to-right and block means top-to-bottom, but those directions can
          change with writing mode or language direction.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · inline-start and inline-end follow text direction</p>
          <div class="misc-logical-examples">
            <div class="misc-logical-card" dir="ltr">
              <span class="misc-logical-control">Inline end</span>
              <strong>Left-to-right</strong>
              <span>Border at inline start</span>
            </div>
            <div class="misc-logical-card" dir="rtl">
              <span class="misc-logical-control">Inline end</span>
              <strong>Right-to-left</strong>
              <span>Border at inline start</span>
            </div>
          </div>
        </div>
        ${renderCodeExample(`.page-shell {
  max-inline-size: 72rem;
  margin-inline: auto;
  padding-inline: 1.25rem;
}

.article-section {
  padding-block: 2rem;
  border-block-end: 1px solid #ccd2ce;
}

.dismiss-button {
  inset-inline-end: 0.75rem;
  inset-block-start: 0.75rem;
}`)}
        <p>
          Common pairs include <code>inline-size</code> and
          <code>block-size</code> for width and height along logical axes,
          <code>padding-inline</code> and <code>padding-block</code> for
          spacing, and <code>inset-inline-start</code> for a positioned
          element's logical leading edge. Logical properties make components
          more reusable when the writing direction changes.
        </p>

        <h2 id="misc-position">3. Position an element deliberately</h2>
        <p>
          Most elements use <code>position: static</code> and remain in normal
          document flow. Use <code>relative</code> when a child needs a local
          positioning reference, <code>absolute</code> for a label or icon
          anchored inside that reference, <code>sticky</code> for an element
          that should follow scrolling within its container, and
          <code>fixed</code> for an element attached to the viewport.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · an absolute badge uses the card as its anchor</p>
          <div class="misc-position-stage">
            <div class="layout-tile misc-position-card">Game cover</div>
            <span class="misc-position-badge">Wishlist</span>
          </div>
        </div>
        ${renderCodeExample(`.game-cover {
  position: relative;
}

.wishlist-badge {
  position: absolute;
  inset-block-start: 0.5rem;
  inset-inline-end: 0.5rem;
}`)}
        <p>
          An absolutely positioned element is removed from normal flow, so
          reserve space or anchor it to the intended nearest positioned
          ancestor. A non-auto <code>z-index</code> controls stacking only
          inside its stacking context. Properties such as
          <code>transform</code>, <code>opacity</code> below 1, and some
          containment settings can create new stacking contexts; a very large
          <code>z-index</code> cannot escape its parent's context.
        </p>

        <h2 id="misc-overflow">4. Control overflow and scrolling</h2>
        <p>
          Content can overflow when its natural size exceeds its container.
          <code>overflow: auto</code> makes a region scroll when needed;
          <code>hidden</code> clips overflow, while <code>clip</code> clips it
          without creating a scroll container. Avoid hiding overflow merely to
          conceal a sizing bug: important text and focus indicators can become
          unreachable.
        </p>
        <p>
          Sticky positioning needs an inset such as <code>top: 0</code> or
          <code>inset-block-start: 0</code>. It sticks relative to its nearest
          scrolling ancestor and remains constrained by its containing block.
          An ancestor with <code>overflow: auto</code> or
          <code>overflow: hidden</code> can therefore change what the sticky
          element follows.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · scroll inside this region to see its heading stick</p>
          <div class="misc-scrollport" tabindex="0" aria-label="Scrollable game list example">
            <div class="misc-sticky-bar">Recently played</div>
            <div class="misc-scroll-row">Hollow Knight · 18 hours</div>
            <div class="misc-scroll-row">Celeste · 9 hours</div>
            <div class="misc-scroll-row">Hades · 42 hours</div>
            <div class="misc-scroll-row">Sea of Stars · 26 hours</div>
            <div class="misc-scroll-row">Tunic · 12 hours</div>
          </div>
        </div>
        ${renderCodeExample(`.scroll-region {
  max-block-size: 16rem;
  overflow: auto;
}

.scroll-region__heading {
  position: sticky;
  inset-block-start: 0;
  z-index: 1;
  background: white;
}`)}

        <h2 id="misc-images">5. Size images without distortion</h2>
        <p>
          Set an image frame's <code>aspect-ratio</code> to reserve space while
          the image loads and keep cards visually consistent. For a crop that
          fills the frame, combine a fixed frame size or ratio with
          <code>object-fit: cover</code>. Use <code>object-position</code> to
          choose which part stays visible. Use <code>contain</code> when the
          entire image must remain visible and empty space is acceptable.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · cover image cropped to a landscape frame</p>
          <div class="misc-image-frame">
            <img src="https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_600x900.jpg" alt="Hollow Knight game cover" />
          </div>
        </div>
        ${renderCodeExample(`<img class="game-cover" src="cover.jpg" alt="Hollow Knight cover" />

.game-cover {
  display: block;
  inline-size: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  object-position: center 35%;
  border-radius: 0.4rem;
}`)}
        <p>
          The <code>alt</code> text describes the image's purpose, not its CSS
          crop. Use empty alt text only when an image is purely decorative and
          adds no information.
        </p>

        <h2 id="misc-responsive">6. Size for the available space</h2>
        <p>
          Responsive CSS does not have to mean a long list of viewport-specific
          sizes. <code>min()</code>, <code>max()</code>, and
          <code>clamp()</code> express a lower limit, upper limit, or bounded
          range directly. Use viewport units carefully: dynamic viewport units
          such as <code>dvh</code> follow the currently visible mobile browser
          area, while <code>svh</code> represents the small viewport and avoids
          content being hidden behind expanded browser controls.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · bounded type and a centered reading measure</p>
          <div class="misc-fluid-screen">
            <h3 class="misc-fluid-title">Your game collection</h3>
            <p class="misc-fluid-reading">A useful reading column stays comfortable on wide screens and still fits the space available on a phone.</p>
          </div>
        </div>
        ${renderCodeExample(`.page-title {
  font-size: clamp(2rem, 5vw, 4rem);
}

.reading-column {
  inline-size: min(100% - 2rem, 68ch);
  margin-inline: auto;
}

.app-screen {
  min-block-size: 100svh;
}`)}
        <p>
          Use a media query when the viewport itself should change the design,
          for example when a sidebar moves above the results. Use a container
          query when a component should adapt to the space its parent gives it,
          which may be narrower than the viewport.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · resize this container; its card responds to its own width</p>
          <div class="misc-container-demo">
            <div class="misc-container-card">
              <div class="layout-tile">Game cover</div>
              <p><strong>Celeste</strong><br />Completed · Nintendo Switch</p>
            </div>
          </div>
        </div>
        ${renderCodeExample(`.game-card-list {
  container-type: inline-size;
}

.game-card {
  display: grid;
  grid-template-columns: 5rem minmax(0, 1fr);
  gap: 1rem;
}

@container (max-width: 22rem) {
  .game-card {
    grid-template-columns: minmax(0, 1fr);
  }
}`)}
        <p>
          Container queries style descendants based on a query container; the
          container itself is not selected by its own query. They work well for
          reusable cards placed in different page regions. Check browser
          support if your audience includes older engines.
        </p>

        <h2 id="misc-text">7. Keep text readable and motion considerate</h2>
        <p>
          Text is content, so let it wrap. A readable article line is often
          around <code>60ch</code> to <code>75ch</code> wide. Use
          <code>overflow-wrap: anywhere</code> for unbroken IDs or URLs that
          would otherwise force a page wider. <code>text-wrap: balance</code>
          can improve short headings, but should not replace a sensible maximum
          width or be relied on for exact line breaks.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · readable measure and a breakable long identifier</p>
          <div class="misc-readable-demo">
            <h3>Game details</h3>
            <p class="misc-readable-copy">Sea of Stars is a role-playing adventure. This paragraph has a constrained reading width and a balanced heading instead of stretching across the whole page.</p>
            <code class="misc-readable-token">collection-entry-identifier-without-natural-break-points-2026</code>
          </div>
        </div>
        ${renderCodeExample(`.article-copy {
  max-inline-size: 68ch;
  line-height: 1.65;
}

.untrusted-token {
  overflow-wrap: anywhere;
}

h1 {
  text-wrap: balance;
}`)}
        <p>
          If an interface animates layout or position, respect a user's reduced
          motion preference. Keep a visible keyboard focus style as well; do not
          remove outlines without providing an equally clear replacement.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · tab to the control to see its focus indicator</p>
          <div class="misc-focus-demo">
            <button type="button">Focus with the keyboard</button>
            <span>Motion effects honor your system preference.</span>
          </div>
        </div>
        ${renderCodeExample(`:focus-visible {
  outline: 3px solid #315f70;
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}`)}
        <p>
          These tools complement Grid and Flexbox rather than replacing them.
          For ready-to-adapt solutions to a particular interface problem, open
          the <a href="/css-layout/cookbook">CSS Cookbook</a>.
        </p>
      </article>
    `
});
defineComponent("docs-css-layout-cookbook", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Reference · CSS Layout</p>
        <h1>CSS Cookbook</h1>
        <p class="page-lead">
          A collection of small, practical answers to recurring styling
          problems. Each recipe explains the layout idea, shows a live preview
          where it helps, and gives CSS you can adapt to your own markup. Start
          with the relationship between elements, not a framework class name.
        </p>
        <nav class="component-doc-nav" aria-label="CSS Cookbook contents">
          <a href="#recipe-center">Center an element</a>
          <a href="#recipe-reading-width">Center a page</a>
          <a href="#recipe-card-grid">Responsive cards</a>
          <a href="#recipe-sidebar">Sidebar layout</a>
          <a href="#recipe-sticky-footer">Push down a footer</a>
          <a href="#recipe-image">Crop an image</a>
          <a href="#recipe-overlay">Overlay a badge</a>
          <a href="#recipe-truncate">Truncate text</a>
          <a href="#recipe-long-words">Break long text</a>
          <a href="#recipe-focus">Show focus clearly</a>
        </nav>

        <h2 id="recipe-center">1. Center a child vertically and horizontally</h2>
        <p>
          When a parent has a known area and one child should sit in its center,
          CSS Grid's <code>place-items</code> is the shortest expression. The
          parent needs a height or minimum height for vertical centering to be
          visible. Grid does not require the child to have a known size.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · the parent centers its child on both axes</p>
          <div class="cookbook-center-demo">
            <div class="layout-tile">Centered message</div>
          </div>
        </div>
        ${renderCodeExample(`.empty-state {
  display: grid;
  place-items: center;
  min-block-size: 16rem;
}`)}
        <p>
          Flexbox is equally useful when the parent is already a row or column:
          use <code>justify-content: center</code> on the main axis and
          <code>align-items: center</code> on the cross axis. For a one-off
          overlay that must be removed from flow, an absolutely positioned
          child with <code>inset: 0; margin: auto</code> is another option, but
          Grid is usually clearer for ordinary content.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · Flexbox centers a control; Grid centers an overlay</p>
          <div class="cookbook-center-alternatives">
            <div class="cookbook-flex-center">
              <div class="layout-tile">Flexbox center</div>
            </div>
            <div class="cookbook-overlay-stage">
              <div class="layout-tile">Game cover</div>
              <div class="cookbook-overlay">Centered overlay</div>
            </div>
          </div>
        </div>
        ${renderCodeExample(`/* Center with an existing flex container. */
.toolbar-slot {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Center a positioned overlay; parent needs position: relative. */
.overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}`)}

        <h2 id="recipe-reading-width">2. Center a page and keep paragraphs readable</h2>
        <p>
          Constrain the content's maximum width, let it shrink on narrow
          screens, and center its margins. The <code>ch</code> unit follows the
          width of the current font's zero character, which makes it useful for
          setting a comfortable text measure.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · centered measure capped at a readable line length</p>
          <div class="cookbook-reading-preview">
            <strong>Game Shelf notes</strong>
            <p>Keep long-form writing in a comfortable column. The margins center it while the inline size leaves a gutter on narrower screens.</p>
          </div>
        </div>
        ${renderCodeExample(`.article {
  inline-size: min(100% - 2rem, 68ch);
  margin-inline: auto;
}

@media (min-width: 48rem) {
  .article {
    inline-size: min(100% - 4rem, 72ch);
  }
}`)}
        <p>
          The first declaration is a CSS math expression: use the available
          width minus a gutter, but never let the text measure exceed
          <code>68ch</code>. This avoids a fixed width that causes horizontal
          scrolling on phones.
        </p>

        <h2 id="recipe-card-grid">3. Make a responsive card collection</h2>
        <p>
          Let the browser choose how many cards fit based on a useful minimum
          card width. This avoids a breakpoint for every column count. The
          <code>min()</code> guard lets a card become narrower than its
          preferred minimum when its container is itself very narrow.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · cards find their own column count</p>
          <div class="cookbook-card-grid">
            <div class="layout-tile">Hollow Knight</div>
            <div class="layout-tile">Celeste</div>
            <div class="layout-tile">Hades</div>
            <div class="layout-tile">Sea of Stars</div>
          </div>
        </div>
        ${renderCodeExample(`.game-cards {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, 14rem), 1fr)
  );
  gap: 1rem;
}`)}

        <h2 id="recipe-sidebar">4. Put a sidebar beside content, then stack it</h2>
        <p>
          Use Grid for the two-column relationship and change its tracks at a
          breakpoint. Keep the source order logical so the filters still come
          before the results when they stack.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · filters stack above results at narrow widths</p>
          <div class="layout-grid-workspace">
            <div class="layout-tile filters">Filters</div>
            <div class="layout-tile collection">Game results</div>
          </div>
        </div>
        ${renderCodeExample(`.collection-page {
  display: grid;
  grid-template-columns: minmax(12rem, 1fr) minmax(0, 3fr);
  gap: 1.5rem;
}

@media (max-width: 48rem) {
  .collection-page {
    grid-template-columns: minmax(0, 1fr);
    gap: 1rem;
  }
}`)}

        <h2 id="recipe-sticky-footer">5. Keep a footer at the bottom when a page is short</h2>
        <p>
          Do not position the footer at a fixed screen coordinate. Make the
          page a column at least as tall as the viewport, then let the main
          content take the spare space with <code>flex: 1</code>. On a long
          page, the footer naturally follows the content.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · the footer follows short content to the bottom of its shell</p>
          <div class="cookbook-footer-preview">
            <div class="cookbook-footer-main">
              <strong>Game Shelf</strong>
              <p>Your collection is up to date.</p>
            </div>
            <footer>Last synced just now</footer>
          </div>
        </div>
        ${renderCodeExample(`.app-shell {
  display: flex;
  flex-direction: column;
  min-block-size: 100svh;
}

.app-main {
  flex: 1;
}

.app-footer {
  padding-block: 1rem;
}`)}
        <p>
          This is a normal-flow footer, not a sticky footer that remains visible
          while the user scrolls. Fixed-position footers can cover content and
          need extra care for small screens, zoom, and on-screen keyboards.
        </p>

        <h2 id="recipe-image">6. Crop a cover image without stretching it</h2>
        <p>
          Set a predictable frame, clip its overflow, and use
          <code>object-fit: cover</code>. The browser scales the image until the
          frame is filled, cropping the excess instead of distorting the art.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · source portrait cover inside a landscape frame</p>
          <div class="cookbook-image-frame">
            <img src="https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_600x900.jpg" alt="Hollow Knight cover cropped for a game card" />
          </div>
        </div>
        ${renderCodeExample(`.cover-frame {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.cover-frame img {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
  object-position: center;
}`)}
        <p>
          Use <code>object-fit: contain</code> for logos or diagrams that must
          remain fully visible. Supply useful <code>alt</code> text unless the
          image is decorative.
        </p>

        <h2 id="recipe-overlay">7. Place a badge over a card corner</h2>
        <p>
          Establish a local coordinate system with <code>position: relative</code>
          on the card. Position only the badge absolutely, so it does not
          change the card's size or push other content around.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · corner badge stays attached to its card</p>
          <div class="misc-position-stage">
            <div class="layout-tile misc-position-card">Game card</div>
            <span class="misc-position-badge">New</span>
          </div>
        </div>
        ${renderCodeExample(`.game-card {
  position: relative;
}

.game-card__badge {
  position: absolute;
  inset-block-start: 0.75rem;
  inset-inline-end: 0.75rem;
}`)}

        <h2 id="recipe-truncate">8. Truncate a title on one or several lines</h2>
        <p>
          For a one-line label, prevent wrapping and hide overflow before adding
          an ellipsis. For a multi-line preview, use line clamping and a known
          line count. Truncated text should remain available in an accessible
          way, for example through the full page title or an explicit details
          view; do not make essential information visible only on hover.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · one-line ellipsis and a three-line summary</p>
          <div class="cookbook-truncate-preview">
            <strong class="cookbook-truncate-title">The Legend of Zelda: Tears of the Kingdom</strong>
            <p class="cookbook-truncate-summary">Explore a vast world, discover strange islands high above Hyrule, and find creative ways to solve puzzles. This description is limited to three lines so other game cards stay aligned and scannable.</p>
          </div>
        </div>
        ${renderCodeExample(`.single-line-title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.summary {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}`)}
        <p>
          The element must have a constrained inline size for truncation to
          occur. Otherwise it simply grows to fit its text.
        </p>

        <h2 id="recipe-long-words">9. Stop a long URL or ID from widening a page</h2>
        <p>
          Let normal text wrap at spaces, but allow especially long tokens to
          break when they would overflow their container. Prefer this to
          applying <code>word-break: break-all</code> to all text, which can
          make ordinary words unpleasant to read.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · this long ID wraps instead of widening the page</p>
          <div class="cookbook-long-text">
            <strong>Collection entry ID</strong>
            <code>collection-entry-with-a-very-long-unbroken-identifier-2026-09-26</code>
          </div>
        </div>
        ${renderCodeExample(`.game-id,
.user-note {
  overflow-wrap: anywhere;
}`)}

        <h2>10. Add responsive breathing room</h2>
        <p>
          <code>clamp(minimum, preferred, maximum)</code> keeps spacing fluid
          without letting it become too small or too large. Use it for gutters
          and section spacing when a few viewport sizes should interpolate
          smoothly.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · fluid section padding responds to viewport width</p>
          <div class="cookbook-fluid-spacing-preview">
            <div class="cookbook-fluid-spacing">
              <strong>Recently played</strong>
              <p>Sea of Stars · Hades · Celeste</p>
            </div>
          </div>
        </div>
        ${renderCodeExample(`.page-section {
  padding-block: clamp(1.5rem, 5vw, 4rem);
  padding-inline: clamp(1rem, 4vw, 3rem);
}`)}

        <h2>11. Align an icon and label without manual offsets</h2>
        <p>
          Put them in one flex row, center them on the cross axis, and use a
          gap. Avoid nudging an icon with relative positioning to compensate
          for mismatched line boxes; align the relationship at the parent.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · icon and label share a centered inline row</p>
          <div class="cookbook-icon-label">
            <span class="cookbook-icon-dot" aria-hidden="true"></span>
            <span>Wishlist</span>
          </div>
        </div>
        ${renderCodeExample(`.icon-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
}`)}

        <h2 id="recipe-focus">12. Keep keyboard focus visible</h2>
        <p>
          Use <code>:focus-visible</code> to show a clear outline when keyboard
          users move through controls. Do not remove the browser outline unless
          you replace it with an equally visible indicator.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · tab to the button to reveal its focus ring</p>
          <div class="cookbook-focus-preview">
            <button type="button">Open game details</button>
          </div>
        </div>
        ${renderCodeExample(`:focus-visible {
  outline: 3px solid #315f70;
  outline-offset: 3px;
}`)}

        <h2>13. Make a two-line header without fragile spacing</h2>
        <p>
          Use Flexbox with wrapping and a gap. The items can move to a second
          line when they no longer fit, without fixed widths or whitespace
          characters in the markup.
        </p>
        <div class="layout-demo">
          <p class="layout-demo-label">Live example · header items wrap when their combined width no longer fits</p>
          <div class="cookbook-header-demo">
            <strong>Game Shelf</strong>
            <nav aria-label="Example site links">
              <span>Collection</span>
              <span>Wishlist</span>
              <span>Backlog</span>
            </nav>
          </div>
        </div>
        ${renderCodeExample(`.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}`)}

        <h2>How to adapt a recipe</h2>
        <ol>
          <li>Use your own semantic elements and class names; the recipe's names are examples.</li>
          <li>Keep content order logical in the HTML. CSS placement should not create a confusing keyboard or reading order.</li>
          <li>Replace sample colors, dimensions, and breakpoints with values from your design.</li>
          <li>Try long text, zoom, keyboard navigation, and a narrow viewport before calling the layout finished.</li>
        </ol>
        <p>
          For the underlying rules, continue to
          <a href="/css-layout/grid">CSS Grid</a>,
          <a href="/css-layout/flexbox">Flexbox</a>, or
          <a href="/css-layout/miscellaneous">Miscellaneous CSS</a>.
        </p>
      </article>
    `
});
