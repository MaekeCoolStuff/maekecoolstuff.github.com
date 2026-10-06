import { defineComponent, html } from "../../../../vendor/components/dist/index.js";
import { renderLiveCssExample } from "./css-live-example.js";
defineComponent("docs-css-spacing", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Spacing</p>
        <h1>The box model, margin, and padding</h1>
        <p class="page-lead">
          Every element is laid out as a box. Once you can distinguish its
          content, padding, border, and margin, sizing and spacing stop feeling
          like trial and error. Use flexible constraints and logical
          properties so the same styles work with different content and
          writing directions.
        </p>
        <nav class="component-doc-nav" aria-label="Spacing chapter contents">
          <a href="#spacing-box">Box sizing</a>
          <a href="#spacing-margin">Margins</a>
          <a href="#spacing-padding">Padding and gaps</a>
          <a href="#spacing-logical">Logical spacing</a>
        </nav>

        <h2 id="spacing-box">1. Size the box you mean</h2>
        <p>
          With <code>content-box</code>, width and height describe only the
          content; padding and borders are added outside. With
          <code>border-box</code>, the declared size includes padding and
          borders. Most applications use border-box consistently. Prefer
          <code>min-</code> and <code>max-</code> constraints when text or data
          can vary, and use <code>min-width: 0</code> (or its logical form) for
          grid and flex children that must shrink below their content's
          intrinsic size.
        </p>
        ${renderLiveCssExample("The card stays within its maximum width while its padding fits inside the box.", `*, *::before, *::after { box-sizing: border-box; }

.game-card {
  inline-size: min(100%, 24rem);
  border: 1px solid #cbcfc8;
  padding: 1rem;
}`, `<article class="game-card">
  <h2>Hollow Knight</h2>
  <p>Backlog · Nintendo Switch · 18 hours played</p>
</article>`, 190)}
        <p>
          Percent widths depend on a containing block; they do not always mean
          “a percentage of the viewport.” A fixed height can clip text when it
          wraps, so use a minimum height only when a design needs a floor.
        </p>

        <h2 id="spacing-margin">2. Use margin to separate neighboring boxes</h2>
        <p>
          Margin is outside the border and creates space around a box. Use
          <code>margin-inline: auto</code> to center a block with a constrained
          width. Vertical margins between normal-flow block boxes can collapse:
          adjacent margins may combine instead of adding together. Grid and
          Flexbox gaps do not collapse, which is one reason they are often
          clearer for groups of items.
        </p>
        ${renderLiveCssExample("A centered reading column uses outside margin; sibling spacing uses a parent gap.", `.collection {
  inline-size: min(100% - 2rem, 40rem);
  margin-inline: auto;
}

.game-list {
  display: grid;
  gap: 0.75rem;
}

.game-card { margin: 0; }`, `<main class="collection">
  <h2>Recently played</h2>
  <div class="game-list">
    <article class="game-card">Hades · 42 hours</article>
    <article class="game-card">Celeste · 9 hours</article>
  </div>
</main>`, 210)}
        <p>
          Avoid using margins on every child to create a layout system. Let the
          parent own the relationship with <code>gap</code>; use margins when
          an element needs space relative to surrounding flow.
        </p>

        <h2 id="spacing-padding">3. Use padding inside a box and gap between items</h2>
        <p>
          Padding is inside the border and keeps content away from an edge.
          Unlike margin, padding belongs to the element's own surface. The
          <code>gap</code> property creates consistent space between Grid or
          Flexbox children without adding space at the outer edges.
        </p>
        ${renderLiveCssExample("The card has internal breathing room; its two actions are separated by gap.", `.game-card {
  border: 1px solid #cbcfc8;
  padding: clamp(0.75rem, 4vw, 1.5rem);
}

.game-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}`, `<article class="game-card">
  <h2>Sea of Stars</h2>
  <p>Currently playing · PC</p>
  <div class="game-card__actions">
    <button type="button">Details</button>
    <button type="button">Edit</button>
  </div>
</article>`, 220)}

        <h2 id="spacing-logical">4. Prefer logical spacing properties</h2>
        <p>
          Physical properties such as <code>margin-left</code> assume a
          left-to-right page. Logical properties describe the inline and block
          axes: <code>margin-inline</code>, <code>padding-block</code>,
          <code>inline-size</code>, and <code>inset-inline-start</code> adapt
          when writing direction changes. Use the shorthand when both sides
          share a value and the longhands when each side needs its own value.
        </p>
        ${renderLiveCssExample("Inline padding and a start border follow the text direction.", `.notice {
  border-inline-start: 4px solid #184d3b;
  padding-block: 0.75rem;
  padding-inline: 1rem;
}`, `<aside class="notice" dir="rtl">
  <strong>Wishlist updated</strong>
  <p>Celeste was added to your collection.</p>
</aside>`, 150)}
        <p>
          Continue to <a href="/css-layout/grid">Grid</a> or
          <a href="/css-layout/flexbox">Flexbox</a> for layout relationships,
          or to <a href="/css/borders">borders and outlines</a> for the edges
        and focus treatments around these boxes.
        </p>
      </article>
    `
});
defineComponent("docs-css-borders", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Borders</p>
        <h1>Borders, corners, outlines, and shadows</h1>
        <p class="page-lead">
          Edges help people understand grouping, focus, and hierarchy. Use a
          border to define a box, a radius to shape its corners, an outline to
          mark focus without changing layout, and a restrained shadow to
          suggest elevation.
        </p>
        <nav class="component-doc-nav" aria-label="Borders chapter contents">
          <a href="#border-shorthand">Border shorthand</a>
          <a href="#border-radius">Rounded corners</a>
          <a href="#border-outline">Outline and focus</a>
          <a href="#border-shadow">Shadows</a>
        </nav>

        <h2 id="border-shorthand">1. Build a border from width, style, and color</h2>
        <p>
          A border needs a style other than <code>none</code> or
          <code>hidden</code> to be visible. The shorthand
          <code>border</code> sets width, style, and color together. Use
          physical sides for a deliberately physical design, or logical sides
          such as <code>border-inline-start</code> for writing-direction-aware
          components. <code>currentColor</code> makes a border follow the
          element's text color.
        </p>
        ${renderLiveCssExample("The status rail uses a logical border; the dashed rule separates metadata.", `.game-card {
  border: 1px solid #cbcfc8;
  border-inline-start: 4px solid #184d3b;
  padding: 1rem;
}

.game-card__meta {
  border-block-start: 1px dashed currentColor;
  padding-block-start: 0.5rem;
}`, `<article class="game-card">
  <h2>Hades</h2>
  <p class="game-card__meta">Currently playing · PC</p>
</article>`, 190)}

        <h2 id="border-radius">2. Use radius to describe the surface</h2>
        <p>
          <code>border-radius</code> rounds corners; it does not change the
          element's layout size. Use a small, consistent scale for related
          controls and panels. Very large radii can turn rectangular controls
          into pills, which is useful only when it matches the design system.
          A percentage radius is relative to the element's box and is often
          used for circles when width and height match.
        </p>
        ${renderLiveCssExample("A shared radius token keeps a card, cover, and action visually related.", `.game-card {
  border: 1px solid #cbcfc8;
  border-radius: 8px;
  padding: 1rem;
}

.game-card__cover { border-radius: 4px; }

.play-indicator {
  inline-size: 2rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #184d3b;
}`, `<article class="game-card">
  <div class="game-card__cover">Cover art</div>
  <h2>Celeste</h2>
  <span class="play-indicator" aria-label="Currently playing"></span>
</article>`, 210)}

        <h2 id="border-outline">3. Use outline for keyboard focus</h2>
        <p>
          An outline is drawn outside an element and does not take up layout
          space. It is well suited to keyboard focus. Keep the browser's default
          focus indicator unless you replace it with a clearly visible,
          high-contrast treatment. Do not use a color change alone to indicate
          focus.
        </p>
        ${renderLiveCssExample("Tab to the button in the preview to see a focus ring that does not move the layout.", `.game-action {
  border: 1px solid #184d3b;
  border-radius: 4px;
  padding: 0.6rem 0.85rem;
  background: #184d3b;
  color: white;
  font: inherit;
}

.game-action:focus-visible {
  outline: 3px solid #315f70;
  outline-offset: 3px;
}`, `<button class="game-action" type="button">Open game details</button>`, 120)}

        <h2 id="border-shadow">4. Use shadows sparingly</h2>
        <p>
          <code>box-shadow</code> can add depth or define a surface. Its values
          describe horizontal and vertical offsets, blur, spread, color, and
          optionally <code>inset</code>. Prefer a subtle shadow that supports
          the information hierarchy, and make sure it does not replace a
          visible border where surfaces need separation.
        </p>
        ${renderLiveCssExample("A soft shadow raises the detail panel without obscuring its border.", `.game-detail {
  border: 1px solid #cbcfc8;
  border-radius: 6px;
  padding: 1rem;
  background: #fffefa;
  box-shadow: 0 0.5rem 1.5rem rgb(24 32 29 / 14%);
}`, `<article class="game-detail">
  <h2>Hollow Knight</h2>
  <p>Backlog · Nintendo Switch</p>
</article>`, 160)}
      </article>
    `
});
defineComponent("docs-css-text", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Text</p>
        <h1>Typography and text styling</h1>
        <p class="page-lead">
          Typography determines hierarchy, reading comfort, and the amount of
          content a layout can hold. Start with readable defaults, let text
          resize and wrap, and use decoration and alignment to support meaning
          rather than replace it.
        </p>
        <nav class="component-doc-nav" aria-label="Text chapter contents">
          <a href="#text-type">Font and line height</a>
          <a href="#text-alignment">Alignment and decoration</a>
          <a href="#text-wrapping">Wrapping and truncation</a>
          <a href="#text-fonts">Font loading</a>
        </nav>

        <h2 id="text-type">1. Choose font, size, weight, and line height</h2>
        <p>
          A font stack lists preferred fonts followed by a generic family, so
          the browser always has a fallback. Use a modest type scale and
          relative units that respond to user text-size settings. A unitless
          <code>line-height</code> scales with the font size. Use a constrained
          measure for paragraphs and avoid fixed heights around text.
        </p>
        ${renderLiveCssExample("A display heading and a readable paragraph use distinct type roles.", `.game-title {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.5rem, 5vw, 2.25rem);
  font-weight: 700;
  line-height: 1.15;
}

.game-description {
  max-inline-size: 62ch;
  font-family: system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.65;
}`, `<article>
  <h2 class="game-title">The Legend of Zelda: Tears of the Kingdom</h2>
  <p class="game-description">Explore a vast world, discover floating islands, and record your discoveries in a collection that remains easy to read.</p>
</article>`, 230)}

        <h2 id="text-alignment">2. Align and decorate text intentionally</h2>
        <p>
          Use <code>text-align</code> to align a text block's inline content;
          logical values such as <code>start</code> and <code>end</code> adapt
        to writing direction. Underlines are a strong, familiar signal for
        links. Use <code>text-decoration</code> rather than border tricks for
        underlined text, and keep a visible distinction between links and
        surrounding copy. Uppercase text is a visual treatment, not a reason
        to change the underlying words.
        </p>
        ${renderLiveCssExample("A title is balanced, the link remains underlined, and text aligns to the logical start.", `.game-summary {
  text-align: start;
}

.game-summary h2 {
  max-inline-size: 18ch;
  text-wrap: balance;
}

.game-summary a {
  color: #184d3b;
  text-decoration-thickness: 0.12em;
  text-underline-offset: 0.15em;
}`, `<article class="game-summary" dir="ltr">
  <h2>Sea of Stars: A Tale of Two Solstice Warriors</h2>
  <p>Currently playing on PC.</p>
  <a href="#details">Read the game notes</a>
</article>`, 210)}

        <h2 id="text-wrapping">3. Let long text wrap without breaking normal words</h2>
        <p>
          Normal text wraps at spaces. Use <code>overflow-wrap: anywhere</code>
          for long URLs or IDs that have no natural break points. Use
          <code>white-space: nowrap</code> and <code>text-overflow: ellipsis</code>
          only for a deliberately constrained one-line label; the full text
          must remain available in context. Multi-line clamping is a visual
          preview, not a replacement for the complete description.
        </p>
        ${renderLiveCssExample("The ID breaks at the container edge while the one-line title shows an ellipsis.", `.game-id { overflow-wrap: anywhere; }

.game-title--single-line {
  max-inline-size: 15rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}`, `<article>
  <h2 class="game-title--single-line">The Legend of Zelda: Tears of the Kingdom</h2>
  <code class="game-id">collection-entry-identifier-without-natural-break-points-2026</code>
</article>`, 160)}

        <h2 id="text-fonts">4. Load fonts without making them a dependency</h2>
        <p>
          A font stack should remain attractive and readable if a preferred
          font is missing. When shipping a web font, use
          <code>@font-face</code> with a local font file, declare the weights
          you actually use, and choose <code>font-display: swap</code> or
          another deliberate loading behavior so text remains visible during
          loading. Keep the file self-hosted when offline use matters. Avoid
          depending on a specific font for line breaks or meaning.
        </p>
        <p>
          The first typography preview above is live: its generic fallbacks
          render even on a machine without the named display face. For font
          loading, use the same preview after placing your own licensed font
          file beside the stylesheet; no external font service is required.
        </p>
        <p>
          Next: <a href="/css/spacing">spacing and the box model</a> or
          <a href="/css/borders">borders and outlines</a>.
        </p>
      </article>
    `
});
defineComponent("docs-css-animation", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Animation</p>
        <h1>Transforms, transitions, and animation</h1>
        <p class="page-lead">
          Motion can clarify that something changed, but it should never block
          work or become the only way to understand state. Start with a static
          interface, add short transitions for direct interaction, and use
          keyframes only when an element needs a sequence over time.
        </p>
        <nav class="component-doc-nav" aria-label="Animation chapter contents">
          <a href="#animation-transform">Transforms</a>
          <a href="#animation-transition">Transitions</a>
          <a href="#animation-keyframes">Keyframes</a>
          <a href="#animation-reduced">Reduced motion</a>
        </nav>

        <h2 id="animation-transform">1. Transform an element without changing document flow</h2>
        <p>
          <code>transform</code> moves, rotates, scales, or skews an element's
          painted box without making neighboring content reflow. This is useful
          for small interaction feedback. The transformed element still
          occupies its original layout space, so a large transform can overlap
          nearby content. Use <code>transform-origin</code> to choose the
          point around which rotation or scaling occurs.
        </p>
        ${renderLiveCssExample("Hover the cover to lift and slightly scale it without moving the text below.", `.game-cover {
  inline-size: 8rem;
  aspect-ratio: 3 / 4;
  display: grid;
  place-items: center;
  background: #184d3b;
  color: white;
  transform-origin: center bottom;
  transition: transform 180ms ease;
}

.game-cover:hover {
  transform: translateY(-4px) scale(1.03);
}`, `<div class="game-cover" tabindex="0">Celeste</div>`, 170)}

        <h2 id="animation-transition">2. Transition only the properties that should change</h2>
        <p>
          A transition interpolates a property from its old value to its new
          value when state changes. Specify the properties, duration, timing
          function, and optionally a delay. Avoid <code>transition: all</code>:
          it can animate unintended properties and make later changes
          unpredictable. Keep feedback brief and avoid making controls feel
          slower than the action they represent.
        </p>
        ${renderLiveCssExample("Hover or keyboard-focus the button to see a short color and elevation transition.", `.game-action {
  border: 1px solid #184d3b;
  padding: 0.65rem 0.9rem;
  background: #184d3b;
  color: white;
  transition: background-color 160ms ease, transform 160ms ease;
}

.game-action:hover,
.game-action:focus-visible {
  transform: translateY(-2px);
  background: #10372a;
}`, `<button class="game-action" type="button">Add to wishlist</button>`, 130)}
        <p>
          Animating <code>transform</code> and <code>opacity</code> is often
          less disruptive than repeatedly animating layout properties such as
          width or margin. Still test the real interface; compositing is a
          browser implementation detail, not a guarantee that every animation
          is free.
        </p>

        <h2 id="animation-keyframes">3. Use keyframes for a sequence</h2>
        <p>
          <code>@keyframes</code> names a sequence of styles. The
          <code>animation</code> property selects it and sets duration, timing,
          delay, iteration, direction, and fill behavior. Use looping animation
          only to communicate ongoing activity, and provide text or another
          state cue so motion is not the sole signal.
        </p>
        ${renderLiveCssExample("The small sync marker pulses to show that synchronization is ongoing.", `@keyframes sync-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.45; transform: scale(0.82); }
}

.sync-indicator {
  display: inline-block;
  inline-size: 0.75rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #184d3b;
  animation: sync-pulse 1.4s ease-in-out infinite;
}`, `<p><span class="sync-indicator" aria-hidden="true"></span> Syncing your collection</p>`, 130)}

        <h2 id="animation-reduced">4. Respect reduced-motion preferences</h2>
        <p>
          Some people disable or reduce motion at the operating-system level.
          Use <code>prefers-reduced-motion</code> to remove nonessential
          movement while leaving the state and action understandable. Do not
          force smooth scrolling or parallax on users who request reduced
          motion.
        </p>
        ${renderLiveCssExample("This preview follows the motion preference configured on your device.", `.sync-indicator {
  animation: sync-pulse 1.4s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .sync-indicator { animation: none; }
}`, `<p><span class="sync-indicator" aria-hidden="true"></span> Syncing your collection</p>`, 130)}
        <p>
          For a complete treatment of timing, keyframes, playback controls,
          performance, and scroll-driven effects, continue to the
          <a href="/css/animation-deep-dive">Animation deep dive</a>.
        </p>
      </article>
    `
});
defineComponent("docs-css-media-queries", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Media queries</p>
        <h1>Change styles with media queries</h1>
        <p class="page-lead">
          A media query applies CSS only when a condition is true. Conditions
          can describe the viewport, input capabilities, user preferences, or
          output medium. Use them to adapt a design at the point where its
          content relationship changes, not to target named devices.
        </p>
        <nav class="component-doc-nav" aria-label="Media query chapter contents">
          <a href="#media-syntax">Syntax</a>
          <a href="#media-width">Viewport width</a>
          <a href="#media-input">Input capabilities</a>
          <a href="#media-preferences">User preferences</a>
          <a href="#media-print">Print styles</a>
        </nav>

        <h2 id="media-syntax">1. Read a media query</h2>
        <p>
          Write <code>@media</code>, a condition, and a block of ordinary CSS.
          Use <code>and</code> to require multiple conditions, commas to mean
          “either condition,” and <code>not</code> to negate a condition. A
          query does not create a new selector scope: selectors inside still
          match the document normally. If a condition is false, those
          declarations do not participate in the cascade.
        </p>
        ${renderLiveCssExample("The collection uses one column by default and adds a filter rail when space permits.", `.collection-page {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}

@media (min-width: 42rem) {
  .collection-page {
    grid-template-columns: 10rem minmax(0, 1fr);
  }
}`, `<main class="collection-page">
  <aside>Platforms<br>PC · Switch</aside>
  <section><h2>Your collection</h2><p>Hollow Knight · Celeste · Hades</p></section>
</main>`, 210)}
        <p>
          Choose a breakpoint by resizing until the current layout becomes
          cramped, then change the relationship. The exact value is a design
          decision, not a phone or tablet category. A mobile-first base rule
          keeps the simplest layout available if an enhancement is not
          supported.
        </p>

        <h2 id="media-width">2. Query the viewport and orientation</h2>
        <p>
          Width and height conditions are useful for page structure.
          <code>orientation</code> describes whether the viewport is wider than
          it is tall; it does not identify a particular device. Prefer
          <code>min-width</code> and <code>max-width</code> ranges based on
          content, and avoid overlapping breakpoints that fight over the same
          property.
        </p>
        ${renderLiveCssExample("The toolbar wraps in a narrow preview and becomes one row in a wide preview.", `.collection-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

@media (min-width: 38rem) and (orientation: landscape) {
  .collection-toolbar { flex-wrap: nowrap; }
}`, `<nav class="collection-toolbar" aria-label="Collection filters">
  <strong>My games</strong>
  <button type="button">Platform</button>
  <button type="button">Status</button>
  <button type="button">Sort</button>
</nav>`, 140)}

        <h2 id="media-input">3. Query what input the user has</h2>
        <p>
          <code>hover</code> and <code>pointer</code> describe available input
          capabilities, not a device brand. A device may have both touch and a
          mouse, so treat these as hints. Never make essential actions available
          only on hover; keep controls usable by touch and keyboard.
        </p>
        ${renderLiveCssExample("Hover feedback is enabled only when the primary input can hover precisely.", `.game-card {
  border: 1px solid #cbcfc8;
  padding: 1rem;
  transition: transform 150ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .game-card:hover { transform: translateY(-3px); }
}`, `<article class="game-card" tabindex="0">
  <h2>Hades</h2>
  <p>Currently playing · PC</p>
</article>`, 170)}

        <h2 id="media-preferences">4. Respect appearance and accessibility preferences</h2>
        <p>
          Preference queries include <code>prefers-color-scheme</code>,
          <code>prefers-reduced-motion</code>, and
          <code>prefers-contrast</code>. They can improve defaults, but should
          not override an explicit choice the application gives the user. Test
          both sides of each preference, and keep text and controls usable when
          a query does not match.
        </p>
        ${renderLiveCssExample("The card follows the operating system's color-scheme preference.", `.game-card {
  padding: 1rem;
  background: #fffefa;
  color: #18201d;
}

@media (prefers-color-scheme: dark) {
  .game-card {
    background: #18201d;
    color: #f2f0e8;
  }
}`, `<article class="game-card">
  <h2>Celeste</h2>
  <p>Completed · Nintendo Switch</p>
</article>`, 170)}

        <h2 id="media-print">5. Prepare important content for print</h2>
        <p>
          A print query is useful for reports, receipts, or collection lists.
          Hide navigation and controls that do not make sense on paper, keep
          important data, and use ink-friendly colors. Inspect the browser's
          print preview because page breaks, backgrounds, and link destinations
          vary across browsers. Print rules can be explored through the
          responsive chapter's print guidance.
        </p>
        <p>
          Continue to <a href="/css/responsive">responsive design</a> for
          container queries and responsive images, or
          <a href="/css/interaction">interaction states</a> for focus and form
          styling.
        </p>
      </article>
    `
});
