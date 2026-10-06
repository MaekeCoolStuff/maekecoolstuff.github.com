import { defineComponent, html } from "../../../../vendor/components/dist/index.js";
import { renderLiveCssExample } from "./css-live-example.js";
defineComponent("docs-css-selectors", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Selectors</p>
        <h1>Selectors, states, and pseudo-elements</h1>
        <p class="page-lead">
          Selectors connect a stylesheet to document elements. Keep them
          readable and based on meaningful classes, attributes, or states so
          a rule remains understandable when markup evolves.
        </p>
        <nav class="component-doc-nav" aria-label="Selector chapter contents">
          <a href="#selector-relations">Relations</a>
          <a href="#selector-attributes">Attributes and states</a>
          <a href="#selector-logical">Logical selectors</a>
          <a href="#selector-pseudo">Pseudo-elements</a>
        </nav>

        <h2 id="selector-relations">1. Match a role and its relationship</h2>
        <p>
          A class selector matches every element carrying that class. A
          descendant combinator (a space) matches at any depth; a child
          combinator (<code>&gt;</code>) matches only direct children. Group
          selectors with commas when the same rule applies to each. Prefer
          stable class names over selectors that depend on many incidental
          wrapper elements.
        </p>
        ${renderLiveCssExample("The direct-child rule styles game cards; the descendant rule reaches their titles.", `.collection > .game-card {
  border-block-end: 1px solid #cbcfc8;
  padding-block: 0.75rem;
}

.collection .game-title {
  margin-block: 0 0.25rem;
  color: #184d3b;
}

.game-title, .game-status { font-family: Georgia, serif; }`, `<section class="collection">
  <article class="game-card">
    <h2 class="game-title">Hollow Knight</h2>
    <p class="game-status">Backlog · Nintendo Switch</p>
  </article>
</section>`, 190)}
        <p>
          Keep reading and keyboard order in the HTML. A selector changes
          presentation; it should not make semantically unrelated elements
          look like the same control.
        </p>

        <h2 id="selector-attributes">2. Select attributes and real states</h2>
        <p>
          Attribute selectors can match presence or values. Operators include
          exact match (<code>=</code>), prefix (<code>^=</code>), suffix
          (<code>$=</code>), and substring (<code>*=</code>). Prefer exact
          values for application-owned state. Pseudo-classes such as
          <code>:checked</code>, <code>:disabled</code>, and
          <code>:focus-visible</code> reflect the browser's current control
          state without copying it into a second CSS class.
        </p>
        ${renderLiveCssExample("The status attribute marks a playing game; the search field exposes focus.", `[data-status="playing"] {
  border-inline-start: 4px solid #184d3b;
}

input[name^="game-"]:focus-visible {
  outline: 3px solid #315f70;
  outline-offset: 2px;
}

input:checked + label { font-weight: 700; }`, `<article data-status="playing" style="padding: 0.75rem;">
  <strong>Hades</strong> · Currently playing
</article>
<p><input name="game-search" type="search" placeholder="Focus this search"></p>
<p><input id="wishlist" type="checkbox" checked> <label for="wishlist">On wishlist</label></p>`, 210)}

        <h2 id="selector-logical">3. Combine conditions without deep selectors</h2>
        <p>
          <code>:is()</code> groups alternatives and takes the specificity of
          its most specific argument. <code>:where()</code> groups the same
          way but contributes zero specificity, making shared defaults easier
          to override. <code>:not()</code> excludes a match. The relational
          selector <code>:has()</code> can style a parent based on a descendant
          or sibling; use it when the relationship is useful, not as a reason
          to create an opaque selector puzzle.
        </p>
        ${renderLiveCssExample("A card gets a playing marker when it contains that status; grouped headings share a rule.", `.game-card {
  border: 1px solid #cbcfc8;
  padding: 0.75rem;
}

.game-card:has(.game-status[data-status="playing"]) {
  border-inline-start: 4px solid #184d3b;
}

.game-card :is(h2, h3) { margin-block-start: 0; }
.game-card :where(a, button) { font: inherit; }
.game-card :not(.game-status) { color: #18201d; }`, `<article class="game-card">
  <h2>Sea of Stars</h2>
  <p class="game-status" data-status="playing">Currently playing</p>
  <a href="#game">Open details</a>
</article>`, 190)}

        <h2 id="selector-pseudo">4. Style generated parts, not missing content</h2>
        <p>
          Pseudo-elements address a part of an element's presentation.
          <code>::before</code> and <code>::after</code> generate decorative
          content, <code>::marker</code> styles a list marker, and
          <code>::placeholder</code> styles placeholder text. Keep information
          and controls in HTML; generated content is not a reliable place for
          essential words.
        </p>
        ${renderLiveCssExample("The list marker and placeholder are styled while labels remain real text.", `.game-list li::marker { color: #184d3b; }

input::placeholder { color: #68716c; }

.featured-game::before {
  content: "";
  display: inline-block;
  inline-size: 0.5rem;
  aspect-ratio: 1;
  margin-inline-end: 0.5rem;
  border-radius: 50%;
  background: #f0b84b;
}`, `<p class="featured-game"><strong>Featured: Celeste</strong></p>
<ul class="game-list"><li>Hades</li><li>Hollow Knight</li></ul>
<input aria-label="Filter games" placeholder="Search your collection">`, 190)}
        <p>
          For how selector strength participates in the cascade, return to
          <a href="/css/foundations#css-cascade">Foundations and cascade</a>.
        </p>
      </article>
    `
});
defineComponent("docs-css-display", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Display and positioning</p>
        <h1>Flow, display, and positioning</h1>
        <p class="page-lead">
          Most elements begin in normal document flow. Display changes how a
          box participates in that flow; positioning is for deliberate
          exceptions such as an anchored badge, sticky heading, or overlay.
        </p>
        <nav class="component-doc-nav" aria-label="Display chapter contents">
          <a href="#display-flow">Block and inline</a>
          <a href="#display-context">Formatting context</a>
          <a href="#display-position">Position</a>
          <a href="#display-stack">Stacking</a>
          <a href="#display-hidden">Hide or remove</a>
        </nav>

        <h2 id="display-flow">1. Choose how a box participates in flow</h2>
        <p>
          A block box starts on a new line and usually fills the available
          inline space. Inline content flows within a line and does not accept
          every box dimension in the same way. <code>inline-block</code> stays
          in a text line while accepting width and height. Grid and Flexbox
          create layout contexts for their direct children. Use the simplest
          display mode that expresses the relationship.
        </p>
        ${renderLiveCssExample("Inline tags share a line; the block title starts a row and the badge keeps its box.", `.game-title { display: block; margin: 0 0 0.5rem; }
.platform { display: inline; }
.game-status { display: inline-block; padding: 0.2rem 0.45rem; background: #d8e8df; }
.game-summary { display: grid; gap: 0.5rem; }`, `<article class="game-summary">
  <h2 class="game-title">Hollow Knight</h2>
  <span class="platform">Nintendo Switch</span>
  <span class="game-status">Backlog</span>
</article>`, 170)}

        <h2 id="display-context">2. Establish a formatting context deliberately</h2>
        <p>
          Floats were designed for text wrapping around images, not general
          page layout. A float can make a parent appear to have no height when
          its children are all floated. <code>display: flow-root</code> creates
          a new block formatting context that contains those floats without
          adding a clearing element. Prefer Grid or Flexbox for modern
          component layout.
        </p>
        ${renderLiveCssExample("flow-root contains the floated cover so the card background surrounds both columns.", `.game-card {
  display: flow-root;
  border: 1px solid #cbcfc8;
  padding: 0.75rem;
  background: #f2f0e8;
}

.game-cover {
  float: inline-start;
  inline-size: 4rem;
  aspect-ratio: 3 / 4;
  margin-inline-end: 0.75rem;
  background: #184d3b;
}`, `<article class="game-card">
  <div class="game-cover" aria-hidden="true"></div>
  <h2>Celeste</h2>
  <p>Completed · Nintendo Switch</p>
</article>`, 180)}

        <h2 id="display-position">3. Position relative to the intended ancestor</h2>
        <p>
          <code>relative</code> keeps an element in flow and establishes a
          containing block for positioned descendants. <code>absolute</code>
          removes the positioned element from normal flow and places it against
          its nearest positioned containing block. <code>fixed</code> usually
          anchors to the viewport; transforms and other properties can create a
          different containing block. Sticky positioning remains constrained
          by its scroll container and needs an inset such as
          <code>inset-block-start</code>.
        </p>
        ${renderLiveCssExample("The wishlist badge is anchored to the card, not to the viewport.", `.game-card {
  position: relative;
  min-block-size: 7rem;
  padding: 1rem;
  border: 1px solid #cbcfc8;
}

.wishlist-badge {
  position: absolute;
  inset-block-start: 0.5rem;
  inset-inline-end: 0.5rem;
  padding: 0.2rem 0.45rem;
  background: #f0b84b;
}`, `<article class="game-card">
  <span class="wishlist-badge">Wishlist</span>
  <h2>Sea of Stars</h2>
  <p>Not started · PC</p>
</article>`, 170)}

        <h2 id="display-stack">4. Reason about stacking contexts</h2>
        <p>
          <code>z-index</code> orders positioned elements and flex/grid items
          within a stacking context. A child cannot escape its ancestor's
          context just by using a very large number. Opacity below one,
          transforms, and properties such as <code>isolation: isolate</code>
          can create a new context. Use a small, documented scale for overlays
          instead of escalating arbitrary integers.
        </p>
        ${renderLiveCssExample("The dialog and backdrop share a local stacking context; the dialog appears above its backdrop.", `.dialog-stage { position: relative; isolation: isolate; min-block-size: 9rem; }
.backdrop { position: absolute; inset: 1rem; z-index: 1; background: rgb(24 32 29 / 20%); }
.dialog { position: absolute; inset: 2rem; z-index: 2; padding: 1rem; background: #fffefa; border: 1px solid #cbcfc8; }`, `<div class="dialog-stage">
  <div class="backdrop"></div>
  <section class="dialog"><strong>Remove Hades?</strong><p>This game stays in your archive.</p></section>
</div>`, 210)}

        <h2 id="display-hidden">5. Hide content without confusing its behavior</h2>
        <p>
          <code>display: none</code> removes an element from layout and the
          accessibility tree. <code>visibility: hidden</code> preserves its
          layout space while hiding it. <code>opacity: 0</code> makes pixels
          transparent but leaves the element in layout and often still
          interactive. Choose based on the behavior you intend; do not hide
          important content only visually.
        </p>
        ${renderLiveCssExample("The hidden row leaves a gap; the removed row does not; the transparent row still occupies space.", `.row--invisible { visibility: hidden; }
.row--removed { display: none; }
.row--transparent { opacity: 0; }`, `<div class="game-list">
  <p>Hollow Knight</p>
  <p class="row--invisible">Celeste · hidden but space remains</p>
  <p class="row--removed">Hades · removed from layout</p>
  <p class="row--transparent">Sea of Stars · transparent but present</p>
  <p>Tunic</p>
</div>`, 210)}
        <p>
          For two-dimensional and one-dimensional layout, continue to
          <a href="/css-layout/grid">Grid</a> and
          <a href="/css-layout/flexbox">Flexbox</a>.
        </p>
      </article>
    `
});
defineComponent("docs-css-fonts", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Fonts</p>
        <h1>Choose and load fonts responsibly</h1>
        <p class="page-lead">
          A font choice affects tone, line wrapping, and page stability. Use a
          fallback stack so text is always available, and self-host web fonts
          when you need a specific face or offline reliability.
        </p>
        <nav class="component-doc-nav" aria-label="Fonts chapter contents">
          <a href="#fonts-stack">Font stacks</a>
          <a href="#fonts-face">@font-face</a>
          <a href="#fonts-numbers">Numerals and data</a>
          <a href="#fonts-scale">Type scale</a>
        </nav>

        <h2 id="fonts-stack">1. Provide a complete fallback stack</h2>
        <p>
          List preferred families first and always end with a generic family
          such as <code>serif</code>, <code>sans-serif</code>, or
          <code>monospace</code>. Local font names are not guaranteed to exist
          on another machine. A fallback is part of the design, not an error
          state; test the layout with it because different fonts have different
          metrics.
        </p>
        ${renderLiveCssExample("Display and body roles use different stacks, each with a generic fallback.", `:root {
  --font-body: "Avenir Next", "Gill Sans", sans-serif;
  --font-display: "Baskerville", "Iowan Old Style", serif;
}

body { font-family: var(--font-body); }
.game-title { font-family: var(--font-display); }`, `<article>
  <h2 class="game-title">Hollow Knight</h2>
  <p>Backlog · Nintendo Switch</p>
</article>`, 160)}

        <h2 id="fonts-face">2. Define a web font with @font-face</h2>
        <p>
          <code>@font-face</code> associates a CSS family name with a font
          resource. Use a local file you are licensed to distribute, declare
          the weights and styles you actually ship, and set
          <code>font-display</code> so fallback text remains visible while the
          file loads. This offline example uses a local system face when
          available and still falls back if it is not; for a real app, replace
          the <code>local()</code> source with a self-hosted font file.
        </p>
        ${renderLiveCssExample("The title uses a named local face when available, then falls back without blocking text.", `@font-face {
  font-family: "Shelf Display";
  src: local("Georgia");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

.game-title {
  font-family: "Shelf Display", Georgia, serif;
  font-weight: 400;
}`, `<article>
  <h2 class="game-title">Sea of Stars</h2>
  <p>The title remains readable before and without a custom font file.</p>
</article>`, 180)}
        <p>
          If you use a variable font, declare its supported weight range in
          <code>@font-face</code> and test intermediate weights. Avoid loading
          every style or weight when the interface only uses a few.
        </p>

        <h2 id="fonts-numbers">3. Align numerals in data-heavy interfaces</h2>
        <p>
          In tables, counters, and play-time totals, tabular numerals have equal
          widths so values align. Use <code>font-variant-numeric</code> for
          common typographic features instead of low-level feature strings when
          the browser provides a direct property.
        </p>
        ${renderLiveCssExample("Tabular numerals line up the play-time totals in the collection.", `.play-time {
  font-variant-numeric: tabular-nums;
  text-align: end;
}`, `<table>
  <thead><tr><th>Game</th><th>Hours</th></tr></thead>
  <tbody>
    <tr><td>Hollow Knight</td><td class="play-time">18.4</td></tr>
    <tr><td>Hades</td><td class="play-time">142.0</td></tr>
    <tr><td>Celeste</td><td class="play-time">9.5</td></tr>
  </tbody>
</table>`, 200)}

        <h2 id="fonts-scale">4. Keep the type scale flexible</h2>
        <p>
          Relative sizes preserve user scaling. Use a small hierarchy and a
          bounded fluid value when type should grow gradually between screen
          sizes. A unitless line height scales naturally with the font size.
          Do not force line breaks to make one chosen font fit.
        </p>
        ${renderLiveCssExample("The bounded heading grows with its container while body text remains comfortable.", `.game-title {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  line-height: 1.1;
}

.game-notes {
  max-inline-size: 65ch;
  font-size: 1rem;
  line-height: 1.65;
}`, `<article>
  <h2 class="game-title">The Legend of Zelda: Tears of the Kingdom</h2>
  <p class="game-notes">Keep useful notes in a comfortable measure. They should remain readable when the font changes, when text is zoomed, or when the content is translated.</p>
</article>`, 220)}
        <p>
          Continue to <a href="/css/text">Typography and text</a> for
          alignment, decoration, wrapping, and truncation.
        </p>
      </article>
    `
});
defineComponent("docs-css-backgrounds", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Backgrounds</p>
        <h1>Backgrounds, gradients, and image crops</h1>
        <p class="page-lead">
          Backgrounds decorate a box; they do not replace semantic images or
          text. Use them to establish surface and depth, then keep foreground
          content readable across themes and viewport sizes.
        </p>
        <nav class="component-doc-nav" aria-label="Backgrounds chapter contents">
          <a href="#background-color">Color and gradients</a>
          <a href="#background-layers">Layered backgrounds</a>
          <a href="#background-image">Image sizing</a>
          <a href="#background-effects">Blend and contrast</a>
        </nav>

        <h2 id="background-color">1. Start with a surface color</h2>
        <p>
          Set a background color even when a gradient or image is present; it
          remains visible while an image loads and can provide a useful
          fallback. Gradients are images generated by CSS. They have no
          intrinsic dimensions, so the element's box determines how they are
          painted.
        </p>
        ${renderLiveCssExample("The card uses a solid fallback and a restrained linear gradient.", `.collection-panel {
  padding: 1rem;
  color: #18201d;
  background-color: #d8e8df;
  background-image: linear-gradient(135deg, #fffefa, #d8e8df);
}`, `<section class="collection-panel">
  <h2>Recently added</h2>
  <p>Sea of Stars · Added yesterday</p>
</section>`, 160)}

        <h2 id="background-layers">2. Layer decorative backgrounds</h2>
        <p>
          Comma-separated background images are painted as layers: the first
          listed image is nearest the viewer. Each layer can have its own
          repeat, size, and position values. Keep the color as the final
          fallback and check that text remains legible over every part of the
          pattern.
        </p>
        ${renderLiveCssExample("A subtle dot pattern sits above the surface color without covering the game title.", `.game-card {
  padding: 1rem;
  color: #18201d;
  background-color: #fffefa;
  background-image:
    radial-gradient(#9eb8a9 1px, transparent 1px),
    linear-gradient(135deg, #fffefa, #f2f0e8);
  background-size: 1rem 1rem, auto;
}`, `<article class="game-card">
  <h2>Hollow Knight</h2>
  <p>Backlog · Nintendo Switch</p>
</article>`, 170)}

        <h2 id="background-image">3. Size and position a background image</h2>
        <p>
          <code>background-size: cover</code> fills a box and crops excess;
          <code>contain</code> shows the full image and may leave empty space.
          Use <code>background-position</code> to choose which area stays
          visible. A background image is decorative: if the image conveys
          information, use an <code>&lt;img&gt;</code> with alternative text.
        </p>
        ${renderLiveCssExample("A local Game Shelf cover fills the banner while its title stays in HTML.", `.game-banner {
  min-block-size: 9rem;
  display: grid;
  align-content: end;
  padding: 1rem;
  background-color: #184d3b;
  background-image:
    linear-gradient(0deg, rgb(16 55 42 / 88%), transparent 75%),
    url("/demo-apps/nala-documentation/assets/game-cover-240.svg");
  background-position: center, center 42%;
  background-size: cover;
  color: white;
}`, `<section class="game-banner">
  <h2>Featured in your collection: Sea of Stars</h2>
</section>`, 190)}

        <h2 id="background-effects">4. Use blend effects only when they help</h2>
        <p>
          Blend modes combine background layers or an element with what is
          behind it. They can vary dramatically with the underlying colors, so
          keep a fallback surface and test contrast in light and dark themes.
          Avoid using a blend effect to encode state or meaning.
        </p>
        ${renderLiveCssExample("A multiply blend tints a local cover while a text label remains explicit.", `.game-cover-tile {
  min-block-size: 8rem;
  display: grid;
  place-items: center;
  background-color: #f0b84b;
  background-image: url("/demo-apps/nala-documentation/assets/game-cover-240.svg");
  background-size: 6rem auto;
  background-position: left center;
  background-repeat: no-repeat;
  background-blend-mode: multiply;
}`, `<div class="game-cover-tile"><strong>Hollow Knight · Backlog</strong></div>`, 170)}
        <p>
          For framed surfaces and borders, see
          <a href="/css/borders">Borders and outlines</a>; for
          <a href="/css/responsive">responsive images</a>, keep content art in
          semantic HTML.
        </p>
      </article>
    `
});
defineComponent("docs-css-scrolling", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Scrolling</p>
        <h1>Overflow, sticky content, and scroll behavior</h1>
        <p class="page-lead">
          Scrolling is part of layout, not an afterthought. Decide which box
          should scroll, keep important content and focus indicators reachable,
          and account for sticky headers when navigating to in-page sections.
        </p>
        <nav class="component-doc-nav" aria-label="Scrolling chapter contents">
          <a href="#scroll-overflow">Overflow</a>
          <a href="#scroll-sticky">Sticky content</a>
          <a href="#scroll-anchors">Anchor offsets</a>
          <a href="#scroll-snap">Scroll snapping</a>
        </nav>

        <h2 id="scroll-overflow">1. Choose an overflow behavior</h2>
        <p>
          <code>overflow: auto</code> creates scrolling only when content needs
          it. <code>scroll</code> reserves a scroll mechanism even when it is
          not needed; <code>hidden</code> clips and still creates a scroll
          container; <code>clip</code> clips without creating one. Prefer
          <code>auto</code> for long content and fix accidental overflow at its
          cause rather than concealing it.
        </p>
        ${renderLiveCssExample("The activity log scrolls inside its own region while the surrounding page stays put.", `.activity-log {
  max-block-size: 8rem;
  overflow: auto;
  border: 1px solid #cbcfc8;
  padding: 0.75rem;
}

.activity-log p { margin-block: 0 0.65rem; }`, `<div class="activity-log" tabindex="0" aria-label="Scrollable play activity">
  <p>Hades · Played yesterday</p>
  <p>Celeste · Completed last week</p>
  <p>Hollow Knight · Added last month</p>
  <p>Sea of Stars · Currently playing</p>
  <p>Tunic · Backlog</p>
</div>`, 210)}
        <p>
          A scroll container can affect sticky descendants and keyboard focus.
          Avoid clipping focus rings or placing essential controls outside the
          scrollable area.
        </p>

        <h2 id="scroll-sticky">2. Keep a heading visible while a region scrolls</h2>
        <p>
          A sticky element stays in normal flow until it reaches an inset such
          as <code>inset-block-start: 0</code>. It sticks relative to its
          nearest scroll container and remains bounded by its containing block.
          An ancestor's overflow can therefore change which region it follows.
        </p>
        ${renderLiveCssExample("Scroll the activity list; its section heading sticks to the top of that list.", `.activity-log {
  max-block-size: 9rem;
  overflow: auto;
}

.activity-heading {
  position: sticky;
  inset-block-start: 0;
  z-index: 1;
  margin: 0;
  padding: 0.6rem;
  background: #d8e8df;
}`, `<section class="activity-log" tabindex="0" aria-label="Scrollable game activity">
  <h2 class="activity-heading">Recently played</h2>
  <p>Hades · Yesterday</p><p>Celeste · Monday</p><p>Tunic · Sunday</p>
  <p>Sea of Stars · Saturday</p><p>Hollow Knight · Friday</p>
</section>`, 220)}

        <h2 id="scroll-anchors">3. Leave room for anchored headings</h2>
        <p>
          When a page has a fixed or sticky header, a fragment link can place
          its heading underneath that header. Set
          <code>scroll-padding-block-start</code> on the scrolling container
          for a shared offset, or <code>scroll-margin-block-start</code> on
          individual targets. These properties affect scrolling, not the
          element's layout box.
        </p>
        ${renderLiveCssExample("Follow the section link; the target leaves space above itself.", `html {
  scroll-behavior: smooth;
  scroll-padding-block-start: 1rem;
}

.article-section { scroll-margin-block-start: 1rem; }`, `<nav><a href="#backlog">Jump to backlog</a></nav>
<div style="block-size: 5rem;">Collection summary</div>
<section id="backlog" class="article-section"><h2>Backlog</h2><p>Games waiting to be played.</p></section>`, 190)}

        <h2 id="scroll-snap">4. Add scroll snapping to deliberate carousels</h2>
        <p>
          Scroll snapping can help a horizontal strip settle on meaningful
          cards. Set a snap axis and strictness on the scroll container, then a
          snap alignment on its children. Keep free scrolling usable, preserve
          keyboard access, and do not make snapping so aggressive that it
          prevents a person from reaching content between snap points.
        </p>
        ${renderLiveCssExample("Swipe or shift-scroll the shelf; each card settles at its start edge.", `.game-shelf {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  scroll-snap-type: inline mandatory;
  overscroll-behavior-inline: contain;
  padding-block: 0.5rem;
}

.game-shelf article {
  flex: 0 0 75%;
  min-block-size: 5rem;
  scroll-snap-align: start;
  padding: 1rem;
  background: #d8e8df;
}`, `<div class="game-shelf" tabindex="0" aria-label="Scrollable game shelf">
  <article>Hollow Knight</article><article>Celeste</article><article>Hades</article>
</div>`, 160)}
      </article>
    `
});
defineComponent("docs-css-production", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Production</p>
        <h1>Print, support, and performance</h1>
        <p class="page-lead">
          Production CSS has to work beyond the ideal screen: it should degrade
          gracefully, keep content available in print, and avoid expensive
          rendering tricks that create more problems than they solve.
        </p>
        <nav class="component-doc-nav" aria-label="Production CSS contents">
          <a href="#production-print">Print styles</a>
          <a href="#production-support">Feature support</a>
          <a href="#production-rendering">Rendering cost</a>
          <a href="#production-review">Review checklist</a>
        </nav>

        <h2 id="production-print">1. Make useful print styles</h2>
        <p>
          A print stylesheet can remove navigation and controls while preserving
          the information someone needs on paper. Prefer dark text on a light
          page, keep meaningful links identifiable, and avoid relying on
          background colors to communicate essential state. Use the browser's
          print preview to see this live example in its print medium.
        </p>
        ${renderLiveCssExample("Print this preview to hide its toolbar and keep the collection details.", `.collection-toolbar { display: flex; gap: 0.5rem; }

@media print {
  .collection-toolbar,
  .screen-only { display: none; }

  body { color: #000; background: #fff; }
  a { color: inherit; text-decoration: underline; }
  .game-card { break-inside: avoid; }
}`, `<nav class="collection-toolbar"><button type="button">Filter</button><button type="button">Sort</button></nav>
<article class="game-card"><h2>Hollow Knight</h2><p>Backlog · Nintendo Switch</p><a href="#game">Game details</a></article>
<p class="screen-only">This toolbar is only useful on screen.</p>`, 190)}

        <h2 id="production-support">2. Add enhancements behind feature queries</h2>
        <p>
          A progressive enhancement starts with a usable baseline and applies
          advanced CSS only when the browser supports it. <code>@supports</code>
          tests a declaration or selector; it does not detect a browser brand.
          Keep the fallback meaningful and test both paths when the fallback
          matters to your audience.
        </p>
        ${renderLiveCssExample("The list begins as wrapping Flexbox and becomes a track-based grid when supported.", `.game-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

@supports (display: grid) {
  .game-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  }
}`, `<div class="game-list">
  <article>Hollow Knight</article><article>Celeste</article><article>Hades</article>
</div>`, 170)}

        <h2 id="production-rendering">3. Use rendering optimizations deliberately</h2>
        <p>
          <code>content-visibility: auto</code> can let the browser skip
          rendering off-screen sections until they approach the viewport.
          <code>contain-intrinsic-size</code> provides an estimated size so
          skipping does not collapse the page. These tools help long pages,
          but measure first; they do not replace efficient DOM and sensible
          layout. Use <code>will-change</code> only shortly before a known
          change, not as a blanket performance hint.
        </p>
        ${renderLiveCssExample("The long activity list keeps an estimated block size while off-screen entries are skipped.", `.activity-list {
  content-visibility: auto;
  contain-intrinsic-size: auto 8rem;
  border-block-end: 1px solid #cbcfc8;
  padding: 1rem;
}`, `<section class="activity-list"><h2>Recently played</h2><p>Hades · 42 hours</p></section>
<section class="activity-list"><h2>Completed</h2><p>Celeste · 9 hours</p></section>
<section class="activity-list"><h2>Backlog</h2><p>Hollow Knight · Nintendo Switch</p></section>
<section class="activity-list"><h2>Wishlist</h2><p>Tunic · PC</p></section>`, 240)}

        <h2 id="production-review">4. Review CSS as part of the whole interface</h2>
        <ul>
          <li>Test narrow and wide layouts with realistic and translated content.</li>
          <li>Check keyboard focus, forced colors, text zoom, and reduced motion.</li>
          <li>Use developer tools to inspect computed styles, layout overlays, and failed assets.</li>
          <li>Check current browser support for features that matter to your users.</li>
          <li>Remove stale overrides and avoid unexplained <code>!important</code> declarations.</li>
        </ul>
        <p>
          For the component-specific styling boundary, continue to
          <a href="/css/components">CSS in real applications</a>. For
          responsive layout patterns, see
          <a href="/css/responsive">Responsive design</a>.
        </p>
      </article>
    `
});
