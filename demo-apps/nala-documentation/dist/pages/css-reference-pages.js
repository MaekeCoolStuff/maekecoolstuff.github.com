import { defineComponent, html } from "../../../../vendor/components/dist/index.js";
import { renderLiveCssExample, renderLiveHtmlExample } from "./css-live-example.js";
import "./css-gap-pages.js";
import "./css-controls-effects-pages.js";
import "./css-cookbook-page.js";
import "./css-deep-dive-pages.js";
import "./css-gradients-page.js";
import "./css-property-reference-page.js";
import "./css-topic-pages.js";
export const cssReferencePages = [
  {
    slug: "foundations",
    tagName: "docs-css-foundations"
  },
  {
    slug: "selectors",
    tagName: "docs-css-selectors"
  },
  {
    slug: "visual-design",
    tagName: "docs-css-visual-design"
  },
  {
    slug: "interaction",
    tagName: "docs-css-interaction"
  },
  {
    slug: "spacing",
    tagName: "docs-css-spacing"
  },
  {
    slug: "borders",
    tagName: "docs-css-borders"
  },
  {
    slug: "display",
    tagName: "docs-css-display"
  },
  {
    slug: "text",
    tagName: "docs-css-text"
  },
  {
    slug: "fonts",
    tagName: "docs-css-fonts"
  },
  {
    slug: "animation",
    tagName: "docs-css-animation"
  },
  {
    slug: "animation-deep-dive",
    tagName: "docs-css-animation-deep-dive"
  },
  {
    slug: "shadows",
    tagName: "docs-css-shadows"
  },
  {
    slug: "controls",
    tagName: "docs-css-controls"
  },
  {
    slug: "effects",
    tagName: "docs-css-effects"
  },
  {
    slug: "cookbook",
    tagName: "docs-css-cookbook"
  },
  {
    slug: "backgrounds",
    tagName: "docs-css-backgrounds"
  },
  {
    slug: "gradients",
    tagName: "docs-css-gradients"
  },
  {
    slug: "media-queries",
    tagName: "docs-css-media-queries"
  },
  {
    slug: "responsive",
    tagName: "docs-css-responsive"
  },
  {
    slug: "scrolling",
    tagName: "docs-css-scrolling"
  },
  {
    slug: "components",
    tagName: "docs-css-components"
  },
  {
    slug: "production",
    tagName: "docs-css-production"
  },
  {
    slug: "property-reference",
    tagName: "docs-css-property-reference"
  }
];
export function createCssReferencePage(slug) {
  const page = cssReferencePages.find((entry)=>entry.slug === slug);
  if (!page) throw new Error(`Unknown CSS reference page: ${slug}`);
  return document.createElement(page.tagName);
}
defineComponent("docs-css-foundations", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Foundations</p>
        <h1>How CSS decides what you see</h1>
        <p class="page-lead">
          CSS is a set of rules that matches elements and assigns property
          values. You do not need to memorize every property to build a polished
          interface. You do need a reliable way to read rules, predict which
          rule wins, and choose values that adapt to content and context.
        </p>
        <nav class="component-doc-nav" aria-label="CSS foundations contents">
          <a href="#css-first-rule">First rule</a>
          <a href="#css-selectors">Selectors</a>
          <a href="#css-cascade">Cascade</a>
          <a href="#css-values">Values and units</a>
          <a href="#css-layout-model">Flow and layout</a>
        </nav>

        <h2 id="css-first-rule">1. Read a CSS rule</h2>
        <p>
          A rule has a selector and a declaration block. The selector chooses
          elements; each declaration pairs a property with a value. A browser
          reads stylesheets in document order and recalculates styles when the
          document or its state changes.
        </p>
        <p>
          In a page head, load a stylesheet with
          <code>&lt;link rel="stylesheet" href="/styles/app.css"&gt;</code>.
          The file can then contain a rule such as the one below.
        </p>
        ${renderLiveCssExample("A class selector styles the matching game title.", `.game-title {
  color: #184d3b;
  font-size: 1.25rem;
}`, `<article>
  <h2 class="game-title">Hollow Knight</h2>
  <p>Backlog · Nintendo Switch</p>
</article>`)}
        <p>
          Put most rules in a stylesheet rather than repeating inline
          <code>style</code> attributes. A shared stylesheet makes visual rules
          easier to reuse, test, override, and understand. HTML describes the
          content and its meaning; CSS controls its presentation.
        </p>
        <h2 id="css-selectors">2. Select the elements you mean</h2>
        <p>
          Start with a class when a rule represents a reusable design role.
          Element selectors are useful for document-wide defaults; IDs are best
          reserved for unique anchors and scripting, rather than reusable
          styling. Combinators describe relationships, while attribute and
          pseudo-class selectors describe attributes and states.
        </p>
        <div class="api-table-wrap">
          <table class="api-table">
            <thead><tr><th>Selector</th><th>Matches</th><th>Typical use</th></tr></thead>
            <tbody>
              <tr><td><code>.game-card</code></td><td>An element with that class</td><td>A reusable component role.</td></tr>
              <tr><td><code>.game-card h2</code></td><td>Any matching descendant heading</td><td>Content inside a component.</td></tr>
              <tr><td><code>.game-card &gt; h2</code></td><td>A direct child heading</td><td>Only when direct ownership matters.</td></tr>
              <tr><td><code>[aria-current="page"]</code></td><td>An element with that attribute value</td><td>Style an exposed semantic state.</td></tr>
              <tr><td><code>.game-card:hover</code></td><td>A card while a pointer hovers it</td><td>Pointer feedback, never the only way to reveal information.</td></tr>
              <tr><td><code>.game-card::before</code></td><td>A generated pseudo-element</td><td>Decorative content, not essential text or controls.</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Prefer a clear class over selectors coupled to deep markup such as
          <code>main section div article h2</code>. A selector that depends on
          incidental nesting becomes fragile when the HTML changes. Pseudo-
          elements such as <code>::before</code> and <code>::after</code> create
          presentation; they should not replace meaningful accessible content.
        </p>
        ${renderLiveCssExample("Classes, attributes, focus, and a decorative pseudo-element select different states.", `.game-card { border: 1px solid #cbcfc8; padding: 1rem; }
.game-card__title { margin-block: 0 0.5rem; }
.game-card[data-status="playing"] { border-color: #184d3b; }
.game-card:focus-within { outline: 2px solid #315f70; }
.game-card[data-featured="true"]::before {
  content: "Featured";
  display: inline-block;
  margin-block-end: 0.5rem;
  color: #184d3b;
  font-weight: 700;
}`, `<article class="game-card" data-status="playing" data-featured="true">
  <h2 class="game-card__title">Hollow Knight</h2>
  <a href="#game">Open game details</a>
</article>`)}

        <h2 id="css-cascade">3. Understand the cascade</h2>
        <p>
          More than one rule can match an element. The cascade considers where
          a declaration came from, whether it is important, its cascade layer,
          selector specificity, and finally source order. In ordinary author
          styles, later declarations win only when the earlier cascade factors
          tie. Inherited values are used only when the element has no winning
          declaration for that property.
        </p>
        <ol>
          <li>Check whether the property is declared directly or inherited.</li>
          <li>Check origin and importance; avoid using <code>!important</code> as a routine override.</li>
          <li>Compare cascade layers, then selector specificity.</li>
          <li>If the declarations still tie, the later applicable declaration wins.</li>
        </ol>
        <p>
          Specificity is compared as columns, not added into one score: IDs,
          classes/attributes/pseudo-classes, then type selectors and
          pseudo-elements. A class selector is usually a better component API
          than an ID selector. <code>:where(...)</code> contributes zero
          specificity; <code>:is(...)</code> takes the specificity of its most
          specific argument. These tools can make shared rules easier to
          override, but a simple class is usually clearest for beginners.
        </p>
        <p>
          A cascade layer is a named priority group for CSS rules. Layers do
          not scope selectors or require separate files; they give you an
          earlier, easier-to-understand ordering step before specificity is
          compared. The first <code>@layer</code> statement can list the layer
          names from lowest to highest priority for normal declarations.
        </p>
        ${renderLiveCssExample("The later components layer wins even though the base selector is more specific.", `@layer base, components;

@layer base {
  #featured-game { color: firebrick; }
}

@layer components {
  .game-title { color: seagreen; }
}`, `<h2 id="featured-game" class="game-title">Celeste</h2>`, 120)}
        <p>
          If both rules match the same title, it becomes green: the
          <code>components</code> layer comes later, so it wins before the
          browser compares selectors. That is true even though an ID selector
          is normally more specific than a class selector. Put shared defaults
          in an earlier layer and intentional component overrides in a later
          one instead of escalating selectors to fight the cascade.
        </p>
        ${renderLiveCssExample("Base, component, and utility rules sit in named priority groups.", `@layer reset, base, components, utilities;

@layer base {
  a { color: #184d3b; }
}

@layer components {
  .game-card a { color: #10372a; }
}

@layer utilities {
  .text-muted { color: #68716c; }
}`, `<article class="game-card">
  <a href="#game">Open Hollow Knight</a>
  <p class="text-muted">Backlog · Switch</p>
</article>`)}
        <p>
          For normal declarations, later named layers outrank earlier named
          layers, regardless of selector specificity. Unlayered normal author
          rules outrank normal rules in named layers. Important declarations
          reverse layer order, which is another reason to use importance only
          for deliberate exceptional cases. Layers are useful when a project
          has distinct reset, base, component, and utility styles.
        </p>
        <nala-callout tone="info">
          <span slot="title">The fastest cascade debugger</span>
          Inspect the element in browser developer tools. The Styles panel shows
          matching declarations and crossed-out overrides; the Computed panel
          shows the final value and where it came from.
        </nala-callout>

        <h2 id="css-values">4. Choose values and units</h2>
        <p>
          A CSS value may be a keyword, number, length, color, function, or a
          custom property. Choose a unit based on the relationship you want:
          <code>rem</code> follows the root font size, <code>em</code> follows
          the current element's font size in many properties, percentages
          follow a property's reference size, and viewport units follow the
          viewport. A unitless number is useful for ratios such as
          <code>line-height</code>.
        </p>
        <div class="api-table-wrap">
          <table class="api-table">
            <thead><tr><th>Value</th><th>Relationship</th><th>Good starting point</th></tr></thead>
            <tbody>
              <tr><td><code>1rem</code></td><td>Root text size</td><td>Reusable spacing and type scales.</td></tr>
              <tr><td><code>1.5em</code></td><td>Current text size</td><td>Proportional icon or local spacing.</td></tr>
              <tr><td><code>60ch</code></td><td>Approximate current font character measure</td><td>Readable text line length.</td></tr>
              <tr><td><code>50%</code></td><td>Property-specific containing dimension</td><td>Fluid sizing when the reference is clear.</td></tr>
              <tr><td><code>1fr</code></td><td>A share of available grid space</td><td>Flexible Grid tracks.</td></tr>
              <tr><td><code>clamp(1rem, 3vw, 2rem)</code></td><td>Bounded fluid value</td><td>Responsive space or type within limits.</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          CSS math functions such as <code>calc()</code>, <code>min()</code>,
          <code>max()</code>, and <code>clamp()</code> combine values without
          hard-coding every screen size. A percentage's meaning depends on the
          property: learn the property's reference box instead of assuming all
          percentages are measured against the viewport.
        </p>
        ${renderLiveCssExample("Fluid math keeps the reading column centered and spacing bounded.", `.reading-column {
  inline-size: min(100% - 2rem, 68ch);
  margin-inline: auto;
}

.page-section {
  padding-block: clamp(1.5rem, 4vw, 3rem);
  background: #d8e8df;
}`, `<section class="page-section">
  <p class="reading-column">A comfortable reading measure works across narrow and wide spaces.</p>
</section>`, 190)}

        <h2 id="css-layout-model">5. Normal flow is the starting point</h2>
        <p>
          Before learning layout systems, understand normal flow. Block
          elements stack in the block direction; inline content flows within a
          line and wraps. Grid and Flexbox establish new layout contexts for
          their direct children. Positioning can take an element out of normal
          flow, so use it for overlays and anchored details rather than as a
          general page-layout system.
        </p>
        <p>
          Every element has a box. With <code>content-box</code>, declared
          width describes content and padding/border are added outside it.
          <code>border-box</code> includes padding and border in the declared
          size. Most applications set border-box globally. For the detailed
          box model and layout systems, continue to
          <a href="/css-layout/overview">CSS Layout</a>.
        </p>
        <h2>Continue learning</h2>
        <p>
          Next: <a href="/css/visual-design">visual styling and design tokens</a>.
          Keep the <a href="/css-layout/grid">Grid</a>,
          <a href="/css-layout/flexbox">Flexbox</a>, and
          <a href="/css-layout/miscellaneous">layout references</a> nearby as
          you build a page.
        </p>
      </article>
    `
});
defineComponent("docs-css-visual-design", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Visual design</p>
        <h1>Build a visual system with CSS</h1>
        <p class="page-lead">
          Professional interfaces feel consistent because color, type, spacing,
          borders, and states follow a small set of intentional rules. CSS
          custom properties make those decisions reusable and adjustable
          without introducing a styling framework.
        </p>
        <nav class="component-doc-nav" aria-label="Visual design contents">
          <a href="#css-tokens">Tokens</a>
          <a href="#css-color">Color</a>
          <a href="#css-type">Typography</a>
          <a href="#css-surfaces">Surfaces</a>
          <a href="#css-content">Content elements</a>
        </nav>

        <h2 id="css-tokens">1. Define a small token system</h2>
        <p>
          A design token is a named decision, such as a surface color, text
          color, spacing step, or border radius. Define tokens as custom
          properties on <code>:root</code> when they apply across the document.
          Use names for their role, not their current color, so a theme can
          change without renaming every use.
        </p>
        ${renderLiveCssExample("One token set controls the card surface, border, radius, and spacing.", `:root {
  color-scheme: light;
  --color-canvas: #f2f0e8;
  --color-surface: #fffefa;
  --color-text: #18201d;
  --color-muted: #68716c;
  --color-accent: #184d3b;
  --color-border: #cbcfc8;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --radius-small: 4px;
}

.game-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-small);
  padding: var(--space-4);
  background: var(--color-surface);
  color: var(--color-text);
}`, `<article class="game-card">
  <h3>Hollow Knight</h3>
  <p>Backlog · Nintendo Switch · 18 hours played</p>
</article>`)}
        <p>
          Custom properties inherit through the DOM and can have fallbacks:
          <code>color: var(--color-accent, green)</code>. Keep the initial
          system modest. A few semantic color roles and a spacing scale are
          easier to maintain than a token for every individual declaration.
        </p>
        <h2 id="css-color">2. Use color with meaning and contrast</h2>
        <p>
          CSS accepts named colors, hexadecimal, <code>rgb()</code>,
          <code>hsl()</code>, and modern color functions. Pick colors by role:
          canvas, surface, primary text, muted text, accent, border, success,
          warning, and danger. For a WCAG AA baseline, normal text generally
          needs a contrast ratio of at least 4.5:1; large text and essential
          non-text control boundaries generally need 3:1. Check every theme and
          state, and never communicate status through color alone; pair color
          with a label, icon, or other visible distinction.
        </p>
        <p>
          Use <code>currentColor</code> when an icon, border, or outline should
          follow the element's text color. Use alpha only when transparency is
          part of the intended effect; translucent foregrounds can lose
          contrast over changing backgrounds. Declare
          <code>color-scheme</code> when native controls and scrollbars should
          match a supported light or dark surface.
        </p>
        ${renderLiveCssExample("Status uses a border, text label, and currentColor instead of color alone.", `.status--playing {
  border-inline-start: 0.25rem solid var(--color-accent);
  padding-inline-start: 0.65rem;
}

.status--playing::before {
  content: "";
  display: inline-block;
  inline-size: 0.55rem;
  aspect-ratio: 1;
  margin-inline-end: 0.4rem;
  border-radius: 50%;
  background: var(--color-accent);
}

.icon {
  color: currentColor;
}`, `<p class="status--playing">Currently playing · Hades</p>
<p>Save icon color follows: <span class="icon">♥</span></p>`)}

        <h3 id="css-color-functions">Modern color spaces and color-mix()</h3>
        <p>
          <code>oklch()</code> describes lightness, chroma, and hue in a more
          perceptual space than older RGB channels. <code>color-mix()</code>
          blends two colors in a chosen space. These functions are useful for
          building related hover, border, and surface colors from one token;
          they do not guarantee accessible contrast, so verify the final pair.
          Keep a conventional color first and guard newer syntax when your
          browser support target requires it.
        </p>
        ${renderLiveCssExample("The card derives a softer surface and darker text from one OKLCH accent token.", `.game-status {
  --game-accent: #184d3b;
  border-inline-start: 4px solid var(--game-accent);
  padding: 0.75rem;
  color: #10372a;
  background: #d8e8df;
}

@supports (color: oklch(52% 0.14 160)) {
  .game-status {
    --game-accent: oklch(52% 0.14 160);
    color: oklch(27% 0.06 160);
    background: color-mix(in oklch, var(--game-accent) 12%, white);
  }
}`, `<p class="game-status">Currently playing · Hades</p>`, 140)}

        <h2 id="css-type">3. Set readable typography</h2>
        <p>
          A type system needs a dependable font stack, clear hierarchy, and
          comfortable line spacing. Specify generic fallbacks such as
          <code>serif</code> or <code>sans-serif</code>; users may not have a
          preferred local font. Use <code>rem</code> for a scale that responds
          to the root text size, and a unitless <code>line-height</code> so
          leading scales with the text. Keep long reading text to a moderate
          measure, often around <code>60ch</code> to <code>75ch</code>.
        </p>
        ${renderLiveCssExample("A semantic type scale sets body text, headings, and reading measure.", `:root {
  --font-body: "Avenir Next", "Gill Sans", sans-serif;
  --font-display: "Baskerville", "Iowan Old Style", serif;
}

body {
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.5;
}

h1, h2, h3 {
  font-family: var(--font-display);
  line-height: 1.15;
}

.article-copy {
  max-inline-size: 68ch;
  line-height: 1.7;
}`, `<main>
  <h2>Sea of Stars</h2>
  <p class="article-copy">An RPG about two Children of the Solstice, with a long description set to a comfortable reading width.</p>
</main>`, 200)}
        <p>
          If you ship a web font, define it with <code>@font-face</code>, use
          appropriate formats and weights, and choose a fallback that avoids
          disruptive layout shifts. Do not make meaning depend on a typeface,
          tiny text, all-caps styling, or a specific line break. Let text wrap
          naturally; use <code>text-wrap: balance</code> as a progressive
          enhancement for short headings, not as a layout guarantee.
        </p>

        <h2 id="css-surfaces">4. Style surfaces, edges, and depth</h2>
        <p>
          Backgrounds, borders, and shadows establish grouping and hierarchy.
          Use a subtle border to define a surface; reserve shadows for elements
          that genuinely sit above surrounding content. Gradients can add
          depth, but should not reduce text contrast. Keep radius and shadow
          choices consistent through tokens rather than styling every card
          independently.
        </p>
        ${renderLiveCssExample("A bordered panel contains a locally generated cover image without network requests.", `.panel {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-small);
  background: var(--color-surface);
  box-shadow: 0 0.5rem 1.5rem rgb(24 32 29 / 10%);
}

.cover-frame {
  aspect-ratio: 3 / 4;
  overflow: hidden;
}

.cover-frame img {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}`, `<article class="panel">
  <div class="cover-frame">
    <img alt="Illustrated Game Shelf cover artwork" src="/demo-apps/nala-documentation/assets/game-cover-240.svg">
  </div>
  <h3>Game cover</h3>
</article>`, 250)}
        <p>
          Image cropping, borders, and responsive frames are covered in more
          detail in <a href="/css-layout/miscellaneous">Miscellaneous CSS</a>.
          A background image is decoration unless it is represented by an
          actual image element with suitable alternative text.
        </p>

        <h2 id="css-content">5. Style links, lists, and tables</h2>
        <p>
          Keep native semantics and change only the presentation. Links should
          remain recognizable as links and have hover and keyboard-focus
          states. Lists should preserve their list semantics even if markers
          are restyled. Tables are for tabular data, not page layout; retain
          readable headers, captions where useful, and enough contrast to track
          rows and columns.
        </p>
        ${renderLiveCssExample("Links stay recognizable and a striped data table remains readable.", `a {
  color: var(--color-accent);
  text-underline-offset: 0.15em;
}

table {
  inline-size: 100%;
  border-collapse: collapse;
}

th, td {
  border-block-end: 1px solid var(--color-border);
  padding: 0.65rem 0.8rem;
  text-align: start;
}

tbody tr:nth-child(even) {
  background: var(--color-surface-muted);
}`, `<a href="#collection">Open collection</a>
<table>
  <thead><tr><th>Game</th><th>Status</th></tr></thead>
  <tbody>
    <tr><td>Hades</td><td>Playing</td></tr>
    <tr><td>Celeste</td><td>Completed</td></tr>
  </tbody>
</table>`, 230)}
        <p>
          Continue to <a href="/css/interaction">interaction and accessible
          states</a>, or see the optional Nala design layer's
          <a href="/components/theme">theme tokens</a> for one concrete
          component library example.
        </p>
      </article>
    `
});
defineComponent("docs-css-interaction", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Interaction</p>
        <h1>Style interaction without hiding meaning</h1>
        <p class="page-lead">
          Interfaces respond to focus, hover, validation, and state. Use CSS to
          make those states clear, but keep the actual behavior and meaning in
          semantic HTML and application logic. Every pointer interaction needs
          a keyboard-equivalent path.
        </p>
        <nav class="component-doc-nav" aria-label="Interaction contents">
          <a href="#css-states">States</a>
          <a href="#css-forms">Forms</a>
          <a href="#css-motion">Motion</a>
          <a href="#css-accessibility">Accessibility</a>
        </nav>

        <h2 id="css-states">1. Style states with pseudo-classes</h2>
        <p>
          Pseudo-classes select elements in a state without adding a class to
          the HTML. Use <code>:hover</code> for pointer feedback,
          <code>:focus-visible</code> for keyboard-visible focus,
          <code>:active</code> while a control is being activated, and
          <code>:disabled</code> for a genuinely disabled native control.
          <code>:focus-within</code> is useful when a containing field or card
          should respond while one of its descendants has focus.
        </p>
        ${renderLiveCssExample("Hover or focus the collection link; the disabled action keeps its native state.", `.game-link:hover {
  text-decoration-thickness: 0.15em;
}

.game-link:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}

.filter-field {
  display: inline-block;
  border: 1px solid #68716c;
  padding: 0.35rem;
}

.filter-field:focus-within {
  border-color: var(--color-accent);
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}`, `<p><a class="game-link" href="#hades">Open Hades</a></p>
<label class="filter-field">Filter games <input type="search" placeholder="Search"></label>
<p><button disabled>Sync unavailable</button></p>`, 190)}
        <p>
          If using several link states, keep their intended order explicit and
          ensure focus remains visible when the pointer is also hovering. Avoid
          removing the outline unless you provide an equally visible
          replacement. Do not make essential content appear only on hover;
          touch screens and keyboard users may never trigger that state.
        </p>

        <h2 id="css-forms">2. Style forms while preserving native behavior</h2>
        <p>
          Native inputs, selects, buttons, and labels already provide keyboard,
          focus, and accessibility behavior. Connect a visible
          <code>&lt;label&gt;</code> to each control, keep validation messages
          in the document, and do not use color as the only error signal.
          Selectors such as <code>:required</code>, <code>:disabled</code>,
          <code>:checked</code>, and <code>:focus-visible</code> can reflect
          real control state without duplicating it in a CSS class.
        </p>
        ${renderLiveCssExample("Type, focus, or clear the required title field to inspect native states.", `label {
  display: block;
  margin-block-end: 0.4rem;
  font-weight: 700;
}

input, select, textarea, button {
  font: inherit;
}

input:focus-visible,
select:focus-visible,
textarea:focus-visible,
button:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}

input:invalid:not(:placeholder-shown) {
  border-color: var(--color-danger);
}`, `<form>
  <label for="game-title">Game title</label>
  <input id="game-title" name="title" required minlength="2" value="H" placeholder="Try Celeste">
  <button type="button">Search collection</button>
</form>`, 190)}
        <p>
          Browser validation states differ in timing and detail. Pair visual
          styling with actual validation and an understandable message; never
          rely on a red border alone. Be cautious when replacing native control
          appearance because a fully custom control also inherits your
          responsibility for keyboard, focus, disabled, and high-contrast
          behavior.
        </p>

        <h2 id="css-motion">3. Use motion to explain change</h2>
        <p>
          A transition interpolates a property when its value changes. A
          keyframe animation describes a sequence. Prefer short, purposeful
          motion that clarifies a state change; do not animate every element by
          default. Animating <code>transform</code> and <code>opacity</code> is
          often less disruptive than repeatedly changing layout properties.
        </p>
        ${renderLiveCssExample("Hover the game card to lift it; the sync indicator animates continuously.", `.game-card {
  display: grid;
  gap: 0.5rem;
  border: 1px solid var(--color-border);
  padding: 1rem;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.game-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1.5rem rgb(24 32 29 / 12%);
}

@keyframes sync-pulse {
  50% { opacity: 0.55; }
}

.sync-indicator[data-state="syncing"] {
  animation: sync-pulse 1s ease-in-out infinite;
}`, `<article class="game-card">
  <strong>Hollow Knight</strong>
  <span>Backlog · Switch</span>
  <span class="sync-indicator" data-state="syncing">Syncing collection…</span>
</article>`, 190)}
        <p>
          Avoid motion that flashes, loops without purpose, or delays access to
          content. Honor <code>prefers-reduced-motion</code>; disabling
          decorative movement is often better than merely shortening it. Keep
          state understandable when animations are unavailable.
        </p>

        <h2 id="css-accessibility">4. Treat accessibility as a styling requirement</h2>
        <ul>
          <li>Provide visible keyboard focus and make it easy to distinguish from the surrounding surface.</li>
          <li>Check text and control contrast in every theme and state.</li>
          <li>Support text zoom and reflow; avoid fixed heights around content.</li>
          <li>Pair color with text, shape, icon, or position to communicate status.</li>
          <li>Honor reduced-motion and forced-colors preferences.</li>
          <li>Keep hit areas usable and do not obscure focus with sticky or fixed content.</li>
        </ul>
        ${renderLiveCssExample("The preview follows your reduced-motion and forced-colors system preferences.", `@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto;
    animation-duration: 0.01ms;
    animation-iteration-count: 1;
    transition-duration: 0.01ms;
  }
}

@media (forced-colors: active) {
  .status-indicator {
    border: 1px solid CanvasText;
  }
}`, `<p class="status-indicator">Collection sync is ready</p>
<button type="button">Open game details</button>`, 150)}
        <p>
          Test keyboard interaction, zoom, high contrast, and real validation
          states instead of judging a design only from a static screenshot.
          Continue to <a href="/css/responsive">responsive CSS</a> for
          preference-based media queries and device-independent layouts.
        </p>
      </article>
    `
});
defineComponent("docs-css-responsive", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Responsive design</p>
        <h1>Design for the space content actually gets</h1>
        <p class="page-lead">
          Responsive design is not a list of device sizes. It is the practice
          of making content, controls, and layout adapt to available space,
          user settings, and output media. Start with a flexible foundation;
          add a breakpoint when the content relationship needs to change.
        </p>
        <nav class="component-doc-nav" aria-label="Responsive CSS contents">
          <a href="#css-viewport">Viewport and flexible base</a>
          <a href="#css-breakpoints">Media queries</a>
          <a href="#css-container">Container queries</a>
          <a href="#css-images">Responsive media</a>
          <a href="#css-preferences">Preferences and print</a>
        </nav>

        <h2 id="css-viewport">1. Start with the viewport and flexible content</h2>
        <p>
          A page needs the viewport metadata so mobile browsers lay out the
          document at the device's CSS-pixel width. Use flexible tracks, a
          readable maximum content width, and minimum sizes that allow long
          content to shrink. Avoid fixed page widths and fixed heights around
          text. CSS pixels are not physical screen pixels; browser zoom and
          display density are part of the user's environment.
        </p>
        <p>
          Include
          <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code>
          in the document head. The stylesheet below then gives the page a
          flexible width and lets its children shrink when necessary.
        </p>
        ${renderLiveCssExample("A centered page shell and two-column layout adapt to the preview width.", `.page-shell {
  inline-size: min(100% - 2rem, 76rem);
  margin-inline: auto;
}

.page-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);
  gap: clamp(1rem, 3vw, 2rem);
}

.page-layout > * {
  min-inline-size: 0;
}`, `<main class="page-shell">
  <div class="page-layout">
    <aside>Platform filters</aside>
    <section><h2>Hollow Knight</h2><p>Backlog · Switch</p></section>
  </div>
</main>`, 190)}
        <p>
          Dynamic viewport units such as <code>dvh</code> track the currently
          visible mobile viewport; <code>svh</code> uses the small viewport and
          can prevent content from being covered when browser controls expand.
          They are useful when a design genuinely needs viewport height, but
          normal document flow is usually more robust for content pages.
        </p>

        <h2 id="css-breakpoints">2. Add breakpoints when the design asks for one</h2>
        <p>
          Choose breakpoints where the layout stops working, not because a
          device has a familiar name. Start with the narrow layout and add
          enhancements as space permits, or use the order that best explains
          your design. A breakpoint should change a relationship, such as
          moving filters above results, rather than patching one specific
          phone width.
        </p>
        ${renderLiveCssExample("Resize the browser or preview width to see the sidebar move above results.", `.collection-page {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}

@media (min-width: 48rem) {
  .collection-page {
    grid-template-columns: minmax(12rem, 1fr) minmax(0, 3fr);
    gap: 1.5rem;
  }
}

@media (hover: hover) and (pointer: fine) {
  .game-card:hover { transform: translateY(-2px); }
}`, `<main class="collection-page">
  <aside>Platform filters</aside>
  <section class="game-card-list">
    <article class="game-card">Hollow Knight</article>
    <article class="game-card">Celeste</article>
  </section>
</main>`, 220)}
        <p>
          Media queries can test viewport dimensions, orientation, pointer and
          hover capabilities, color scheme, contrast, and motion preferences.
          They should adapt presentation, not make essential content or
          functionality disappear. Combine related conditions deliberately
          and keep breakpoint rules close to the component or layout they
          change.
        </p>

        <h2 id="css-container">3. Let reusable components respond to their container</h2>
        <p>
          A component can sit in a sidebar, dialog, full-width page, or narrow
          column. Its viewport may be wide while its own available width is
          small. A size container query lets descendants adapt to that local
          space. Give the ancestor a container type, then query descendants;
          a container cannot style itself through its own size query.
        </p>
        ${renderLiveCssExample("Resize the container inside the preview to change the card layout.", `.game-card-list {
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
}`, `<div class="game-card-list" style="resize: horizontal; overflow: auto; max-width: 100%;">
  <article class="game-card">
    <div class="cover">Cover</div>
    <p><strong>Celeste</strong><br>Completed · Nintendo Switch</p>
  </article>
</div>`, 220)}
        <p>
          Use viewport media queries for page-level changes and container
          queries for reusable component changes. A component should still have
          a sensible base style if a query feature is unsupported.
        </p>

        <h2 id="css-images">4. Serve and size responsive images</h2>
        <p>
          Give images intrinsic dimensions or an aspect ratio to reduce layout
          shifts while they load. Use <code>object-fit</code> when an image
          belongs in a fixed frame; choose <code>cover</code> for a crop and
          <code>contain</code> when the complete image must remain visible. For
          different source resolutions, use HTML <code>srcset</code> and
          <code>sizes</code> so the browser can select an appropriate file.
        </p>
        ${renderLiveHtmlExample("The browser chooses a local image candidate using its pixel density.", `<img
          src="/demo-apps/nala-documentation/assets/game-cover-120.svg"
          srcset="/demo-apps/nala-documentation/assets/game-cover-120.svg 120w, /demo-apps/nala-documentation/assets/game-cover-240.svg 240w"
          sizes="(min-width: 48rem) 15rem, 40vw"
  width="120"
  height="160"
          alt="Illustrated Game Shelf cover artwork"
  loading="lazy"
>`, 210)}
        ${renderLiveCssExample("The portrait cover crops neatly into a landscape card frame.", `.cover-frame {
  inline-size: min(100%, 20rem);
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.game-cover {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
  object-position: center 35%;
}`, `<div class="cover-frame">
  <img class="game-cover" alt="Illustrated Game Shelf cover artwork" src="/demo-apps/nala-documentation/assets/game-cover-240.svg">
</div>`, 220)}
        <p>
          The HTML attributes describe image candidates and intrinsic size;
          CSS controls the rendered box. Keep informative images as
          <code>&lt;img&gt;</code> elements with meaningful alternative text.
          Use CSS background images for decoration, not content users need to
          understand.
        </p>

        <h2 id="css-preferences">5. Respect preferences and output media</h2>
        <p>
          Preferences belong in media queries. If your site supports a dark
          theme, change semantic tokens rather than rewriting every component
          selector. Set <code>color-scheme</code> so browser-native controls
          know which surface they are on. Keep user-selected themes explicit
          when the application offers a theme switcher.
        </p>
        ${renderLiveCssExample("The surface and text switch when the system requests dark appearance.", `:root {
  color-scheme: light;
  --surface: #fffefa;
  --text: #18201d;
}

          .theme-card {
            padding: 1rem;
            background: var(--surface);
            color: var(--text);
          }

@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    --surface: #18201d;
    --text: #f2f0e8;
  }
}
`, `<article class="theme-card">
  <h2>Your collection</h2>
  <p>Hollow Knight · Backlog</p>
  <a href="#game">View details</a>
</article>`, 180)}
        <p>
          Test more than a narrow viewport: try keyboard use, text zoom, long
          titles, translated text, and reduced motion. Print styles are useful
          for receipts, reports, and collection lists; hide navigation and
          interactive controls while keeping the information people need.
          For example, an <code>@media print</code> rule can remove
          <code>.toolbar</code> while changing the page to black text on a white
          background; use the browser's print preview to inspect it.
          Continue to <a href="/css/components">component boundaries and
          debugging</a> for the production workflow.
        </p>
      </article>
    `
});
defineComponent("docs-css-components", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Applications</p>
        <h1>CSS in real applications</h1>
        <p class="page-lead">
          CSS has to stay understandable as pages and components multiply.
          Organize rules around clear ownership, define how styles cross
          component boundaries, and use browser tools to inspect the result.
          These habits matter more than adopting a naming methodology or
          framework.
        </p>
        <nav class="component-doc-nav" aria-label="CSS applications contents">
          <a href="#css-organization">Organization</a>
          <a href="#css-nesting-scope">Nesting and @scope</a>
          <a href="#css-boundaries">Component boundaries</a>
          <a href="#css-support">Support and enhancement</a>
          <a href="#css-debugging">Debugging</a>
          <a href="#css-checklist">Review checklist</a>
        </nav>

        <h2 id="css-organization">1. Organize CSS by responsibility</h2>
        <p>
          A maintainable stylesheet has clear ownership. Put document-wide
          defaults in a base layer, reusable component rules near their
          component, and intentional utilities in a small utility layer. Use
          class names that explain a component's role; avoid selectors whose
          meaning depends on deep nesting or source order accidents. Cascade
          layers can make this structure explicit: their declared order decides
          which group of normal rules has priority before selector specificity
          is compared. The names are priority groups, not scopes or files; see
          <a href="/css/foundations#css-cascade">the cascade explanation</a>.
        </p>
        ${renderLiveCssExample("The named layers order reset, base, component, and utility rules.", `@layer reset, base, components, utilities;

@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
}

@layer base {
  body { margin: 0; font-family: var(--font-body); }
}

@layer components {
  .game-card { border: 1px solid var(--color-border); padding: 1rem; }
  .game-card__title { margin: 0; }
}

@layer utilities {
  .text-muted { color: var(--color-muted); }
}`, `<article class="game-card">
  <h2 class="game-card__title">Sea of Stars</h2>
  <p class="text-muted">Currently playing · PC</p>
</article>`)}
        <p>
          This is one organization pattern, not a requirement. Keep files
          manageable, avoid duplicate declarations and unexplained
          <code>!important</code>, and remove obsolete rules when the markup
          changes. Do not introduce a CSS framework or build step unless the
          project benefits from the dependency and workflow.
        </p>

        <h3 id="css-nesting-scope">Nesting rules and limit their reach with @scope</h3>
        <p>
          CSS nesting keeps a short child selector beside its parent rule. The
          ampersand (<code>&amp;</code>) stands for the parent selector; use
          nesting shallowly so the final selector is still easy to understand.
          <code>@scope</code> limits matching to descendants of a chosen root
          without changing the DOM or creating Shadow DOM. Scope proximity can
          break ties between otherwise equal declarations; it does not reduce
          selector specificity. Keep a base rule for browsers that do not
          support newer syntax.
        </p>
        ${renderLiveCssExample("The base card rule still works; scoped nested rules color its title and change its border on hover.", `.game-list .game-card {
  border: 1px solid #cbcfc8;
  padding: 1rem;
}

@scope (.game-list) {
  .game-card {
    & > .game-title { color: #184d3b; }
    &:hover { border-color: #315f70; }
  }
}`, `<section class="game-list">
  <article class="game-card">
    <h2 class="game-title">Hollow Knight</h2>
    <p>Backlog · Nintendo Switch</p>
  </article>
</section>`, 180)}

        <h2 id="css-boundaries">2. Choose a component styling boundary</h2>
        <p>
          In Light DOM, component markup participates in the document cascade:
          global rules can affect it, and consumers can style internal classes.
          Shadow DOM isolates internal selectors from ordinary document
          selectors. It does not block inherited values such as font and color,
          or custom properties supplied by the host. A web component can
          intentionally expose internal targets with <code>::part</code> and
          accept slotted consumer content through native slots.
        </p>
        <div class="api-table-wrap">
          <table class="api-table">
            <thead><tr><th>Boundary</th><th>Consumer styling</th><th>Use when</th></tr></thead>
            <tbody>
              <tr><td>Light DOM</td><td>Document selectors can reach rendered markup.</td><td>Markup is intentionally open to app styling.</td></tr>
              <tr><td>Shadow DOM</td><td>Theme through inherited custom properties; target exposed parts with <code>::part</code>.</td><td>Internal styles and markup should be encapsulated.</td></tr>
              <tr><td>Slotted content</td><td>The consumer owns the assigned nodes; the component can style the slot boundary with native slot rules.</td><td>Consumers provide labels, actions, or other content.</td></tr>
            </tbody>
          </table>
        </div>
        ${renderLiveCssExample("A Shadow DOM part exposes one intentional surface for consumer styling.", `game-card::part(surface) {
  border: 1px solid var(--game-card-border, #cbcfc8);
  border-radius: 6px;
  padding: 1rem;
}`, `<game-card style="--game-card-border: #184d3b">
  <template shadowrootmode="open">
    <article part="surface">
      <h2>Sea of Stars</h2>
      <p>Currently playing · PC</p>
    </article>
  </template>
</game-card>`, 180)}
        <p>
          A component must mark an element with <code>part="surface"</code>
          before a consumer can target it through <code>::part(surface)</code>.
          Custom properties are often the cleanest shared theme API; parts
          are for targeted styling. Nala's
          <a href="/packages/components">component reference</a> documents
          Light DOM, Shadow DOM, and scoped styles, while
          <a href="/components/theme">UI component themes</a> shows the
          optional token-based approach.
        </p>

        <h2 id="css-support">3. Use progressive enhancement</h2>
        <p>
          Modern CSS features are useful, but a robust interface has a sensible
          base before optional enhancements. Use <code>@supports</code> when a
          feature needs a fallback. Check current browser support for the
          browsers your project actually serves; a compatibility table is a
          point-in-time reference, not a substitute for testing.
        </p>
        ${renderLiveCssExample("The browser enhances a wrapping Flexbox fallback with a responsive Grid.", `.game-card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

@supports (display: grid) {
  .game-card-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  }
}`, `<div class="game-card-list">
  <article>Hollow Knight</article>
  <article>Celeste</article>
  <article>Hades</article>
</div>`, 200)}
        <p>
          Prefer a usable base rule plus a narrowly scoped enhancement. Avoid
          loading entire stylesheets through CSS <code>@import</code> when a
          normal document stylesheet link gives clearer loading behavior.
          Validate stylesheet syntax and inspect the console and network panel
          for failed files and font requests.
        </p>

        <h2 id="css-debugging">4. Debug with the browser, not guesses</h2>
        <ol>
          <li>Select the element and inspect matching rules, inherited styles, and crossed-out declarations.</li>
          <li>Use the computed-style view to find the final value and the rule that supplied it.</li>
          <li>Inspect the box model, then toggle declarations one at a time to isolate the cause.</li>
          <li>Enable Grid or Flexbox overlays to see tracks, gaps, and item placement.</li>
          <li>Test the actual narrow and wide layout, keyboard focus, zoom, and long or translated content.</li>
          <li>Check the console and network panel for invalid CSS, missing stylesheets, and failed fonts or images.</li>
        </ol>
        <p>
          When an element overflows, inspect its computed width, min-size,
          padding, and descendants before hiding overflow. When
          <code>z-index</code> appears ineffective, check whether an ancestor
          created a separate stacking context. When a selector does not match,
          verify the DOM, class name, component root, and Shadow DOM boundary.
        </p>

        <h2 id="css-checklist">5. A practical styling review</h2>
        <ul>
          <li>Does semantic HTML remain meaningful with CSS disabled?</li>
          <li>Do layout rules adapt to content instead of assuming fixed text or dimensions?</li>
          <li>Are tokens and component boundaries clear enough that a theme can change safely?</li>
          <li>Can keyboard users see focus and reach every action?</li>
          <li>Do color, zoom, reduced motion, and forced-colors preferences remain usable?</li>
          <li>Have you checked real browser behavior and removed obsolete overrides?</li>
        </ul>
        <p>
          CSS is broad, and this guide is intentionally a working reference
          rather than a dictionary of every property. The foundations, visual
          design, interaction, responsive, and layout chapters together cover
          the CSS decisions needed to build and maintain complete interfaces.
          For Nala-specific component styling, the most relevant starting point is the
          <a href="/packages/components">components package guide</a>.
        </p>
      </article>
    `
});
