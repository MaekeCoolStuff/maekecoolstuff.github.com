import { defineComponent, html } from "../../../../vendor/components/dist/index.js";
import { renderLiveCssExample } from "./css-live-example.js";
defineComponent("docs-css-animation-deep-dive", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Animation deep dive</p>
        <h1>CSS animation, from first motion to scroll timelines</h1>
        <p class="page-lead">
          Motion should explain a change, direct attention, or show progress.
          This chapter builds from a single hover transition to keyframe
          sequences, choreography, reduced-motion support, and scroll-driven
          effects. Each preview uses CSS only and can be interacted with
          directly.
        </p>
        <nav class="component-doc-nav" aria-label="Animation deep dive contents">
          <a href="#animation-model">Model</a>
          <a href="#animation-transform">Transforms</a>
          <a href="#animation-transition">Transitions</a>
          <a href="#animation-timing">Timing</a>
          <a href="#animation-keyframes">Keyframes</a>
          <a href="#animation-control">Control and stagger</a>
          <a href="#animation-accessibility">Accessibility</a>
          <a href="#animation-performance">Performance</a>
          <a href="#animation-scroll">Scroll-driven</a>
        </nav>

        <h2 id="animation-model">1. Start with a stable state and a trigger</h2>
        <p>
          A transition interpolates between two computed states when a value
          changes. Define the resting state first, then change only the
          properties that communicate the interaction. The trigger can be a
          pseudo-class such as <code>:hover</code> or
          <code>:focus-visible</code>, or an application-owned data attribute.
          The interface must remain understandable if motion is disabled.
        </p>
        ${renderLiveCssExample("Hover or keyboard-focus the card to reveal a small state change.", `.game-card {
  border: 1px solid #cbcfc8;
  padding: 1rem;
  background: #fffefa;
  transition: transform 160ms ease, border-color 160ms ease;
}

.game-card:hover,
.game-card:focus-within {
  transform: translateY(-2px);
  border-color: #184d3b;
}`, `<article class="game-card">
  <h2>Hollow Knight</h2>
  <a href="#details">Open game details</a>
</article>`, 170)}

        <h2 id="animation-transform">2. Move the painted box with transforms</h2>
        <p>
          Transforms change an element's painted coordinate system without
          changing normal-flow layout. <code>translate()</code> moves,
          <code>rotate()</code> turns, <code>scale()</code> resizes, and
          <code>skew()</code> shears. The order of transform functions matters
          because each operation changes the coordinate system for the next.
          <code>transform-origin</code> chooses the pivot for rotation and
          scaling. Large transforms can overlap neighbors even though the
          original layout space remains reserved.
        </p>
        ${renderLiveCssExample("Hover or focus the cover to lift, rotate, and slightly scale it around its lower edge.", `.game-cover {
  display: grid;
  inline-size: 8rem;
  aspect-ratio: 3 / 4;
  place-items: center;
  background: #184d3b;
  color: white;
  transform-origin: center bottom;
  transition: transform 180ms ease;
}

.game-cover:hover,
.game-cover:focus-visible {
  transform: translateY(-4px) rotate(-2deg) scale(1.03);
}`, `<div class="game-cover" tabindex="0">Celeste</div>`, 190)}

        <h2 id="animation-transition">3. Configure transitions deliberately</h2>
        <p>
          The transition shorthand can include property, duration, timing
          function, and delay. Longhands make complex behavior easier to read.
          Avoid <code>transition: all</code>: new properties can begin
          animating accidentally, and debugging which value is transitioning
          becomes harder. A zero duration changes immediately; a positive delay
          postpones the start.
        </p>
        ${renderLiveCssExample("Hover or focus the button; color and movement use separate easing curves.", `.game-action {
  border: 1px solid #184d3b;
  padding: 0.65rem 0.9rem;
  background: #184d3b;
  color: white;
  transition-property: background-color, transform;
  transition-duration: 160ms, 220ms;
  transition-timing-function: ease-out, cubic-bezier(0.2, 0.8, 0.2, 1);
  transition-delay: 0ms, 0ms;
}

.game-action:hover,
.game-action:focus-visible {
  transform: translateY(-2px);
  background: #10372a;
}`, `<button class="game-action" type="button">Add to wishlist</button>`, 140)}
        <p>
          Prefer transitions for direct changes between states. They are easy
          to interrupt: if the pointer leaves halfway through a hover, the
          browser transitions back from the current value.
        </p>

        <h2 id="animation-timing">4. Shape the timing curve</h2>
        <p>
          Timing functions control progress over time. <code>linear</code>
          advances evenly; <code>ease</code> and its in/out variants accelerate
          or decelerate; <code>cubic-bezier()</code> lets you tune the curve;
          <code>steps()</code> moves through discrete frames. Choose a curve
          that helps the user read the change instead of making a control feel
          sluggish.
        </p>
        ${renderLiveCssExample("The playhead advances in four discrete steps; the timing function is visible as a stepped fill.", `@keyframes playhead {
  to { transform: scaleX(1); }
}

.progress-track {
  overflow: hidden;
  block-size: 0.75rem;
  background: #d8e8df;
}

.progress-track::before {
  content: "";
  display: block;
  inline-size: 100%;
  block-size: 100%;
  background: #184d3b;
  transform: scaleX(0);
  transform-origin: left;
  animation: playhead 2s steps(4, end) infinite alternate;
}`, `<div class="progress-track" role="img" aria-label="Animated playback progress"></div>`, 120)}

        <h2 id="animation-keyframes">5. Describe a sequence with @keyframes</h2>
        <p>
          Keyframes define property values at named points in an animation.
          The browser interpolates between those points using the timing
          function. Use <code>from</code>/<code>to</code> for a simple change
          or percentages for a sequence. The longhand properties clarify what
          the shorthand controls: name, duration, timing, delay, iteration
          count, direction, fill mode, and play state.
        </p>
        ${renderLiveCssExample("The syncing message follows a short entrance, readable hold, and exit sequence.", `@keyframes sync-notice {
  0% { opacity: 0; transform: translateY(0.5rem); }
  15%, 85% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-0.5rem); }
}

.sync-notice {
  display: inline-block;
  padding: 0.5rem 0.75rem;
  background: #d8e8df;
  animation-name: sync-notice;
  animation-duration: 2.4s;
  animation-timing-function: ease-in-out;
  animation-delay: 150ms;
  animation-iteration-count: infinite;
  animation-direction: normal;
  animation-fill-mode: both;
  animation-play-state: running;
}`, `<p class="sync-notice">Collection synced</p>`, 150)}
        <p>
          The equivalent shorthand is
          <code>animation: sync-notice 2.4s ease-in-out 150ms infinite normal both running</code>.
          The shorthand order can be difficult to scan, so use longhands when
          teaching or when a sequence needs careful review.
        </p>

        <h2 id="animation-control">6. Control playback and stage a sequence</h2>
        <p>
          <code>animation-fill-mode</code> controls whether keyframe styles
          apply before or after the active interval. <code>alternate</code>
          reverses every other iteration; <code>forwards</code> keeps the
          final keyframe after a finite run. <code>animation-play-state</code>
          can pause a sequence. Staggered delays can guide the eye through a
          short list, but should not delay access to its content.
        </p>
        ${renderLiveCssExample("Toggle Pause animation; each game enters in order and the checked control pauses the sequence.", `@keyframes appear {
  from { opacity: 0; transform: translateY(0.5rem); }
  to { opacity: 1; transform: translateY(0); }
}

.game-list > * {
  animation: appear 500ms ease both;
}

.game-list > :nth-child(2) { animation-delay: 120ms; }
.game-list > :nth-child(3) { animation-delay: 240ms; }

#pause-motion:checked ~ .game-list > * {
  animation-play-state: paused;
}`, `<input id="pause-motion" type="checkbox">
<label for="pause-motion">Pause animation</label>
<div class="game-list">
  <p>Hollow Knight · Backlog</p>
  <p>Celeste · Completed</p>
  <p>Hades · Playing</p>
</div>`, 210)}

        <h2 id="animation-accessibility">7. Honor motion preferences</h2>
        <p>
          Some people request reduced motion at the operating-system level.
          Keep content and state understandable without animation, and remove
          or simplify nonessential movement with
          <code>prefers-reduced-motion</code>. Avoid flashing, large
          parallax, and motion that is the only indication of progress.
        </p>
        ${renderLiveCssExample("This activity indicator follows your device's reduced-motion preference.", `.sync-indicator {
  display: inline-block;
  inline-size: 0.7rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #184d3b;
  animation: pulse 1s ease-in-out infinite alternate;
}

@keyframes pulse {
  to { opacity: 0.35; transform: scale(0.75); }
}

@media (prefers-reduced-motion: reduce) {
  .sync-indicator { animation: none; }
}`, `<p><span class="sync-indicator" aria-hidden="true"></span> Syncing your collection</p>`, 130)}

        <h2 id="animation-performance">8. Prefer properties that do not reflow layout</h2>
        <p>
          Animating width, height, margin, or position can repeatedly recalculate
          layout. Small transitions on <code>transform</code> and
          <code>opacity</code> are often less disruptive, but still profile the
          real interface. Do not apply <code>will-change</code> everywhere; it
          can reserve memory and create extra layers. Use browser performance
          tools to find an actual bottleneck before optimizing.
        </p>
        ${renderLiveCssExample("Hover the card; the cover scales without changing the surrounding card layout.", `.game-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid #cbcfc8;
  padding: 0.75rem;
}

.game-cover {
  inline-size: 3rem;
  aspect-ratio: 3 / 4;
  background: #184d3b;
  transition: transform 160ms ease, opacity 160ms ease;
}

.game-card:hover .game-cover { transform: scale(1.06); }`, `<article class="game-card">
  <div class="game-cover" aria-hidden="true"></div>
  <div><strong>Hollow Knight</strong><p>Backlog · Switch</p></div>
</article>`, 150)}

        <h2 id="animation-scroll">9. Progress an effect with scrolling</h2>
        <p>
          Scroll-driven animations use a scroll or view timeline instead of a
          fixed duration. They are useful for small reading or progress cues,
          but support is newer than transitions and keyframes. Keep the base
          state usable and guard the enhancement with <code>@supports</code>.
          Do not make scrolling motion necessary to reveal essential content.
        </p>
        ${renderLiveCssExample("Scroll the preview; supported browsers reveal each collection section as it enters view.", `@keyframes reveal-section {
  from { opacity: 0.25; transform: translateY(1rem); }
  to { opacity: 1; transform: translateY(0); }
}

.collection-section {
  min-block-size: 6rem;
  padding: 1rem;
  border-block-end: 1px solid #cbcfc8;
}

@supports (animation-timeline: view()) {
  .collection-section {
    animation: reveal-section linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 80%;
  }
}`, `<section class="collection-section"><h2>Recently played</h2><p>Hades · 42 hours</p></section>
<section class="collection-section"><h2>Completed</h2><p>Celeste · 9 hours</p></section>
<section class="collection-section"><h2>Backlog</h2><p>Hollow Knight · Switch</p></section>
<section class="collection-section"><h2>Wishlist</h2><p>Tunic · PC</p></section>`, 250)}
        <p>
          For a concise introduction, return to
          <a href="/css/animation">Transforms and animation</a>. For the
          visual depth that often accompanies motion, continue to
          <a href="/css/shadows">Shadows</a>.
        </p>
      </article>
    `
});
defineComponent("docs-css-shadows", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Shadows deep dive</p>
        <h1>CSS shadows, from first value to design system</h1>
        <p class="page-lead">
          Shadows can separate a surface, describe elevation, or improve the
          legibility of text over an image. They do not change layout, and they
          should never carry meaning that is otherwise missing. This chapter
          explains the geometry, common patterns, accessibility, and rendering
          tradeoffs of box, text, and filter shadows.
        </p>
        <nav class="component-doc-nav" aria-label="Shadows deep dive contents">
          <a href="#shadow-model">Box-shadow model</a>
          <a href="#shadow-layers">Layered elevation</a>
          <a href="#shadow-inset">Inset shadows</a>
          <a href="#shadow-text">Text shadows</a>
          <a href="#shadow-filter">Drop shadows</a>
          <a href="#shadow-accessibility">Focus and contrast</a>
          <a href="#shadow-performance">Performance</a>
        </nav>

        <h2 id="shadow-model">1. Read the box-shadow values</h2>
        <p>
          A box shadow can specify horizontal offset, vertical offset, blur,
          spread, color, and the optional <code>inset</code> keyword. Blur
          cannot be negative; spread may be negative to pull the shadow inward.
          The shadow paints outside the box and does not reserve space, so it
          can overlap nearby content or be clipped by overflow.
        </p>
        ${renderLiveCssExample("The card uses a small offset and blur; change spread to see how far the shadow grows.", `.game-card {
  border: 1px solid #cbcfc8;
  border-radius: 6px;
  padding: 1rem;
  background: #fffefa;
  box-shadow: 0.25rem 0.4rem 0.75rem 0.1rem rgb(24 32 29 / 18%);
}`, `<article class="game-card">
  <h2>Hollow Knight</h2>
  <p>Backlog · Nintendo Switch</p>
</article>`, 170)}
        <p>
          A useful reading order is <code>x y blur spread color</code>.
          Offsets move the shadow; blur softens its edge; spread expands or
          contracts its shape. Use an explicit color rather than relying on a
          browser default. Alpha is useful for a subtle shadow that blends
          with a surface.
        </p>

        <h2 id="shadow-layers">2. Combine ambient and directional layers</h2>
        <p>
          Multiple shadows are comma-separated. The first listed shadow is
          painted on top. A broad, low-opacity ambient shadow can pair with a
          smaller directional shadow to make depth feel less like a hard
          outline. Keep elevation levels consistent and avoid giving every
          element a shadow.
        </p>
        ${renderLiveCssExample("Two soft layers create a little lift without making the card look outlined.", `.game-card {
  border: 1px solid #d5d9d3;
  border-radius: 6px;
  padding: 1rem;
  background: #fffefa;
  box-shadow:
    0 0.15rem 0.35rem rgb(24 32 29 / 10%),
    0 0.8rem 1.8rem rgb(24 32 29 / 12%);
}`, `<article class="game-card">
  <h2>Sea of Stars</h2>
  <p>Currently playing · PC</p>
</article>`, 180)}

        <h2 id="shadow-inset">3. Use inset shadows for pressed or recessed surfaces</h2>
        <p>
          Add <code>inset</code> to draw the shadow inside the border box. A
          subtle inset can suggest a well, pressed surface, or input boundary.
          It is a visual treatment only; use real control state and accessible
          names rather than using an inset alone to indicate selection.
        </p>
        ${renderLiveCssExample("The search field uses an inset edge while the selected filter has a separate visible state.", `.game-search {
  border: 1px solid #68716c;
  border-radius: 4px;
  padding: 0.65rem 0.75rem;
  box-shadow: inset 0 1px 3px rgb(24 32 29 / 18%);
}

.filter[aria-pressed="true"] {
  background: #d8e8df;
  box-shadow: inset 0 0 0 1px #184d3b;
}`, `<label>Search games <input class="game-search" type="search" placeholder="Try Hades"></label>
<p><button class="filter" type="button" aria-pressed="true">Currently playing</button></p>`, 170)}

        <h2 id="shadow-text">4. Keep text shadows subtle and purposeful</h2>
        <p>
          <code>text-shadow</code> uses horizontal offset, vertical offset,
          blur, and color. It can help foreground text stay readable over a
          photograph or gradient, but a large or high-contrast shadow makes
          small text harder to read. Start with a stronger background overlay
          before using a heavy text shadow.
        </p>
        ${renderLiveCssExample("A small text shadow separates the heading from the image behind it.", `.featured-game {
  min-block-size: 8rem;
  display: grid;
  align-content: end;
  padding: 1rem;
  color: white;
  background: linear-gradient(135deg, #184d3b, #315f70);
}

.featured-game h2 {
  margin: 0;
  text-shadow: 0 1px 3px rgb(0 0 0 / 65%);
}`, `<section class="featured-game"><h2>Featured: Tunic</h2></section>`, 160)}

        <h2 id="shadow-filter">5. Use filter: drop-shadow for alpha shapes</h2>
        <p>
          <code>box-shadow</code> follows an element's box. The
          <code>drop-shadow()</code> filter follows the rendered alpha shape,
          which is useful for transparent images or clipped icons. It accepts
          offsets, blur, and color, but not spread or <code>inset</code>.
          Filters can be more expensive than a simple box shadow, so use them
          where the silhouette matters.
        </p>
        ${renderLiveCssExample("The shadow follows the clipped star silhouette rather than a square box.", `.game-mark {
  inline-size: 4rem;
  aspect-ratio: 1;
  background: #f0b84b;
  clip-path: polygon(50% 0%, 62% 35%, 98% 35%, 69% 57%, 80% 92%, 50% 71%, 20% 92%, 31% 57%, 2% 35%, 38% 35%);
  filter: drop-shadow(0.25rem 0.35rem 0.3rem rgb(24 32 29 / 35%));
}`, `<div class="game-mark" role="img" aria-label="Featured game marker"></div>`, 140)}

        <h2 id="shadow-accessibility">6. Never make a shadow the only focus signal</h2>
        <p>
          Shadows can disappear in forced-colors mode, print, or a theme with
          little contrast. Keyboard focus needs a clear outline or another
          robust indicator. Pair a shadow with border, color, or shape changes
          where state matters, and test controls without shadows enabled.
        </p>
        ${renderLiveCssExample("Tab to the button: its outline stays visible independently of its hover shadow.", `.game-action {
  border: 1px solid #184d3b;
  border-radius: 4px;
  padding: 0.65rem 0.9rem;
  background: #184d3b;
  color: white;
}

.game-action:hover { box-shadow: 0 0.4rem 1rem rgb(24 32 29 / 22%); }

.game-action:focus-visible {
  outline: 3px solid #315f70;
  outline-offset: 3px;
}

@media (forced-colors: active) {
  .game-action:focus-visible { outline-color: Highlight; }
}`, `<button class="game-action" type="button">Open game details</button>`, 130)}

        <h2 id="shadow-performance">7. Treat animated shadows as paint work</h2>
        <p>
          A shadow can be visually expensive to repaint, especially when it is
          large, blurred, or applied to many moving elements. Avoid animating a
          large shadow across a long list. A common pattern is to keep a subtle
          static shadow and animate a small <code>transform</code> instead.
          Profile before adding <code>will-change</code> or other rendering
          hints.
        </p>
        ${renderLiveCssExample("Hover the card: the subtle shadow remains steady while transform supplies the motion.", `.game-card {
  border: 1px solid #cbcfc8;
  padding: 1rem;
  background: #fffefa;
  box-shadow: 0 0.2rem 0.5rem rgb(24 32 29 / 10%);
  transition: transform 160ms ease;
}

.game-card:hover { transform: translateY(-2px); }`, `<article class="game-card">
  <h2>Hades</h2>
  <p>Currently playing · PC</p>
</article>`, 170)}
        <p>
          For borders and outlines, continue to
          <a href="/css/borders">Borders and outlines</a>. For the broader
          surface and token system, see
          <a href="/css/visual-design">Visual design</a>.
        </p>
      </article>
    `
});
