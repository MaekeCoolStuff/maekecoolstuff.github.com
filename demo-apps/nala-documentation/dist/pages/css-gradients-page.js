import { defineComponent, html } from "../../../../vendor/components/dist/index.js";
import { renderLiveCssExample } from "./css-live-example.js";
defineComponent("docs-css-gradients", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Gradients</p>
        <h1>CSS gradients, from color stops to layered effects</h1>
        <p class="page-lead">
          A gradient is an image generated from color stops. It can fill a
          surface without a downloaded asset, scale with its box, and combine
          with other background layers. This chapter starts with simple fades
          and builds toward repeating patterns, modern color interpolation,
          gradient borders, and masks.
        </p>
        <nav class="component-doc-nav" aria-label="Gradient chapter contents">
          <a href="#gradient-model">Color stops</a>
          <a href="#gradient-linear">Linear</a>
          <a href="#gradient-radial">Radial</a>
          <a href="#gradient-conic">Conic</a>
          <a href="#gradient-repeating">Repeating</a>
          <a href="#gradient-layers">Layered backgrounds</a>
          <a href="#gradient-color">Color interpolation</a>
          <a href="#gradient-border">Gradient borders</a>
          <a href="#gradient-mask">Gradient masks</a>
        </nav>

        <h2 id="gradient-model">1. Understand the image and its color stops</h2>
        <p>
          A gradient is an image value, not a color value. It has no intrinsic
          dimensions; the background positioning area determines where it is
          painted. A color stop pairs a color with an optional position. If
          positions are omitted, CSS distributes them; if positions are
          specified, the browser interpolates between them. Duplicate stop
          positions create a hard edge instead of a smooth blend.
        </p>
        ${renderLiveCssExample("Three stops blend across the panel; moving a stop changes how much space its color occupies.", `.gradient-panel {
  min-block-size: 5rem;
  background-color: #184d3b;
  background-image: linear-gradient(
    90deg,
    #184d3b 0%,
    #315f70 52%,
    #f0b84b 100%
  );
}`, `<div class="gradient-panel" role="img" aria-label="Linear green, blue, and gold gradient"></div>`, 130)}
        <p>
          Keep a solid <code>background-color</code> underneath a gradient as
          a fallback. A gradient is decorative; put meaningful labels and
          status text in HTML, not into a gradient or generated image.
        </p>

        <h2 id="gradient-linear">2. Direct a linear gradient</h2>
        <p>
          <code>linear-gradient()</code> travels along an angle or toward a
          side or corner. The direction describes where the final color points:
          <code>to right</code>, <code>to bottom</code>, or an angle such as
          <code>135deg</code>. Use explicit stop positions when a state or
          layout needs a consistent boundary, and use a smooth transition for
          atmosphere rather than conveying information by color alone.
        </p>
        ${renderLiveCssExample("Equal stop positions make sharp segments for a labeled status strip.", `.status-strip {
  min-block-size: 2.5rem;
  background-image: linear-gradient(
    90deg,
    #184d3b 0 40%,
    #f0b84b 40% 68%,
    #315f70 68% 100%
  );
}`, `<div class="status-strip" role="img" aria-label="Three-segment status strip"></div>
<p>Backlog · Playing · Completed</p>`, 140)}

        <h2 id="gradient-radial">3. Place a radial highlight</h2>
        <p>
          <code>radial-gradient()</code> expands outward from a center. It can
          be circular or elliptical, and its size keywords describe where its
          edge meets the box. Use <code>at</code> to move the center. Radial
          gradients work well as restrained highlights behind an image or
          surface, but keep foreground content readable across the whole area.
        </p>
        ${renderLiveCssExample("A warm radial highlight sits near the cover and fades into a cool surface.", `.game-panel {
  min-block-size: 8rem;
  padding: 1rem;
  color: #18201d;
  background-color: #d8e8df;
  background-image: radial-gradient(
    ellipse at 22% 28%,
    #f0b84b 0%,
    rgb(240 184 75 / 45%) 18%,
    transparent 55%
  );
}`, `<section class="game-panel">
  <h2>Celeste</h2>
  <p>Completed · Nintendo Switch</p>
</section>`, 180)}

        <h2 id="gradient-conic">4. Use conic gradients for circular data</h2>
        <p>
          <code>conic-gradient()</code> rotates through color stops around a
          center point. It can draw a progress ring or categorical wheel when
          paired with a circular box. Always provide the value as real text or
          a semantic progress control; the gradient alone has no accessible
          data meaning.
        </p>
        ${renderLiveCssExample("The ring is decorative; the completion value remains readable text.", `.completion-ring {
  inline-size: 6rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: conic-gradient(
    #184d3b 0 72%,
    #d8e8df 72% 100%
  );
}

.completion-ring span {
  display: grid;
  inline-size: 4rem;
  aspect-ratio: 1;
  place-items: center;
  border-radius: 50%;
  background: #fffefa;
}`, `<div class="completion-ring" aria-hidden="true"><span>72%</span></div>
<p>Collection completed: 72%</p>`, 160)}

        <h2 id="gradient-repeating">5. Repeat a gradient to make a pattern</h2>
        <p>
          Repeating gradients extend a sequence of stops across the image.
          Give each repeated segment explicit positions so its period is
          predictable. They can create stripes and grid marks without a
          separate image file. Keep patterns subtle behind text and controls.
        </p>
        ${renderLiveCssExample("A repeated diagonal pattern marks a decorative collection header.", `.collection-header {
  min-block-size: 5rem;
  padding: 1rem;
  color: #10372a;
  background-color: #fffefa;
  background-image: repeating-linear-gradient(
    135deg,
    #d8e8df 0 8px,
    #fffefa 8px 16px
  );
}`, `<header class="collection-header"><h2>Game Shelf</h2></header>`, 150)}

        <h2 id="gradient-layers">6. Layer gradients with images and overlays</h2>
        <p>
          Background layers are comma-separated, with the first layer painted
          nearest the viewer. The final background color is behind every
          image. Each layer can have its own position, size, and repeat value.
          A common pattern is a darkening gradient over an image so a separate
          HTML heading remains readable.
        </p>
        ${renderLiveCssExample("The overlay gradient sits above a local cover and keeps the HTML title legible.", `.featured-game {
  min-block-size: 9rem;
  display: grid;
  align-content: end;
  padding: 1rem;
  color: white;
  background-color: #184d3b;
  background-image:
    linear-gradient(0deg, rgb(16 55 42 / 90%), transparent 75%),
    url("/demo-apps/nala-documentation/assets/game-cover-240.svg");
  background-position: center, center 38%;
  background-size: cover, cover;
}`, `<section class="featured-game">
  <h2>Featured: Sea of Stars</h2>
</section>`, 190)}
        <p>
          The image remains decorative here. For content artwork with meaning,
          use a responsive <code>&lt;img&gt;</code> and alternative text; see
          <a href="/css/responsive">Responsive design</a>.
        </p>

        <h2 id="gradient-color">7. Choose a color interpolation space</h2>
        <p>
          Browsers interpolate stops in a color space. Newer CSS syntax can
          request spaces such as <code>oklab</code> or <code>oklch</code>, which
          can produce more perceptually even transitions than legacy sRGB for
          some palettes. Support is newer, so provide a valid conventional
          gradient first and guard the enhancement with <code>@supports</code>.
        </p>
        ${renderLiveCssExample("The browser uses perceptual interpolation when available and retains the sRGB fallback otherwise.", `.palette {
  min-block-size: 4rem;
  background: linear-gradient(90deg, #184d3b, #f0b84b);
}

@supports (background: linear-gradient(90deg in oklab, black, white)) {
  .palette {
    background: linear-gradient(90deg in oklab, #184d3b, #f0b84b);
  }
}`, `<div class="palette" role="img" aria-label="Green to gold color palette"></div>`, 130)}

        <h2 id="gradient-border">8. Build a gradient border from layered backgrounds</h2>
        <p>
          A gradient border can be made by stacking a surface gradient in the
          padding box over a colorful gradient in the border box. The border
          itself must be transparent for the background layers to show through.
          This pattern gives control over corner radius and content surface
          without using an image file.
        </p>
        ${renderLiveCssExample("The inner surface covers the first background while the second creates the border ring.", `.gradient-border {
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 1rem;
  background:
    linear-gradient(#fffefa, #fffefa) padding-box,
    linear-gradient(120deg, #184d3b, #315f70, #f0b84b) border-box;
}`, `<article class="gradient-border">
  <h2>Game notes</h2>
  <p>Keep this surface readable while its edge carries the accent.</p>
</article>`, 170)}

        <h2 id="gradient-mask">9. Use a gradient as a mask</h2>
        <p>
          A mask controls which parts of an element remain visible. A gradient
          mask can fade an image at an edge, but masking support and forced
          color behavior vary; keep essential text outside the mask and provide
          a useful unmasked fallback. Use a real gradient background when you
          only need color, not transparency.
        </p>
        ${renderLiveCssExample("The cover fades toward its lower edge; the title remains separate HTML.", `.cover-fade {
  min-block-size: 8rem;
  background: linear-gradient(135deg, #184d3b, #315f70);
}

@supports (mask-image: linear-gradient(#000, transparent)) {
  .cover-fade {
    mask-image: linear-gradient(#000 55%, transparent 100%);
  }
}`, `<div class="cover-fade" role="img" aria-label="Decorative gradient cover"></div>
<h2>Hades · Currently playing</h2>`, 180)}
        <p>
          For general background sizing and contrast, continue to
          <a href="/css/backgrounds">Backgrounds and images</a>.
        </p>
      </article>
    `
});
