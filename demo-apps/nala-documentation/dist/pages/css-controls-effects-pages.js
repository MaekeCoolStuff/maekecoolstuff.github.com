import { defineComponent, html } from "../../../../vendor/components/dist/index.js";
import { renderLiveCssExample } from "./css-live-example.js";
defineComponent("docs-css-controls", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Controls and input</p>
        <h1>Style controls without losing native behavior</h1>
        <p class="page-lead">
          Production interfaces rely on more than color and layout. Focus,
          selection, pointer feedback, and native control states communicate
          what can be used and how. Start with browser controls; customize
          their appearance only when you can preserve keyboard and accessibility
          behavior.
        </p>
        <nav class="component-doc-nav" aria-label="Controls chapter contents">
          <a href="#control-native">Native controls</a>
          <a href="#control-appearance">Appearance</a>
          <a href="#control-feedback">Focus and validation</a>
          <a href="#control-input">Pointer and touch</a>
          <a href="#control-textarea">Text input and resize</a>
        </nav>

        <h2 id="control-native">1. Keep native controls when they fit</h2>
        <p>
          Native checkboxes, radios, ranges, and progress indicators already
          expose state to assistive technology and respond to keyboard input.
          <code>accent-color</code> changes their accent while preserving that
          behavior. It is usually a lower-risk first step than replacing native
          appearance.
        </p>
        ${renderLiveCssExample("Checkbox, radio, range, and progress controls share the application accent.", `input[type="checkbox"],
input[type="radio"],
input[type="range"],
progress {
  accent-color: #184d3b;
}

label { display: block; margin-block: 0.5rem; }`, `<label><input type="checkbox" checked> Include completed games</label>
<label><input type="radio" name="view" checked> Grid view</label>
<label>Completion <input type="range" min="0" max="100" value="72"></label>
<progress value="72" max="100">72%</progress>`, 210)}

        <h2 id="control-appearance">2. Reset appearance only when rebuilding the control</h2>
        <p>
          <code>appearance: none</code> removes much of a platform's native
          control styling. That can make a custom design possible, but it also
          makes you responsible for checked, disabled, focus, forced-colors,
          and high-contrast states. Do not remove a native indicator without
          drawing an equally clear replacement and testing it with a keyboard.
        </p>
        ${renderLiveCssExample("The radio keeps native selection semantics while a custom circle makes its state visible.", `.status-choice input {
  appearance: none;
  inline-size: 1.1rem;
  aspect-ratio: 1;
  margin: 0 0.4rem 0 0;
  border: 2px solid #68716c;
  border-radius: 50%;
  vertical-align: -0.15em;
}

.status-choice input:checked {
  border-color: #184d3b;
  background: radial-gradient(circle, #184d3b 45%, #fffefa 50%);
}

.status-choice input:focus-visible {
  outline: 3px solid #315f70;
  outline-offset: 2px;
}`, `<fieldset class="status-choice">
  <legend>Game status</legend>
  <label><input type="radio" name="game-status" checked> Backlog</label>
  <label><input type="radio" name="game-status"> Playing</label>
</fieldset>`, 190)}

        <h2 id="control-feedback">3. Style focus and validation states</h2>
        <p>
          Keyboard focus needs a visible indicator; prefer
          <code>:focus-visible</code> when pointer clicks should not always
          leave a ring. Pair invalid styling with a real validation message,
          not just a red border. <code>:user-invalid</code> can avoid showing
          an error before a person has interacted; support varies, so keep a
          sensible baseline.
        </p>
        ${renderLiveCssExample("Focus the title input and try a one-character value to inspect focus and validation feedback.", `.game-field {
  display: grid;
  max-inline-size: 24rem;
  gap: 0.4rem;
}

.game-field input {
  border: 1px solid #68716c;
  border-radius: 4px;
  padding: 0.65rem;
  font: inherit;
}

.game-field input:focus-visible {
  outline: 3px solid #315f70;
  outline-offset: 2px;
}

.game-field input:user-invalid { border-color: #a43f35; }`, `<form class="game-field">
  <label for="game-title">Game title</label>
  <input id="game-title" name="title" required minlength="2" placeholder="Enter at least two characters">
  <small>Required · at least two characters</small>
</form>`, 190)}

        <h2 id="control-input">4. Make pointer and touch behavior explicit</h2>
        <p>
          <code>cursor</code> gives pointer feedback on devices that have a
          pointer. <code>user-select</code> can keep a drag handle from
          highlighting its label, but do not disable selection across normal
          content. <code>pointer-events: none</code> lets pointer input pass
          through a purely decorative layer. <code>touch-action</code> is a
          contract for custom touch gestures; reserve it for interfaces that
          implement those gestures and keep ordinary page panning available.
        </p>
        ${renderLiveCssExample("The handle advertises dragging; a decorative badge does not intercept the button click.", `.drag-handle {
  cursor: grab;
  user-select: none;
  touch-action: pan-y;
}

.drag-handle:active { cursor: grabbing; }

.game-action { position: relative; }
.game-action__badge {
  pointer-events: none;
  position: absolute;
  inset-block-start: -0.4rem;
  inset-inline-end: -0.5rem;
}`, `<button class="game-action" type="button">Open collection item <span class="game-action__badge">New</span></button>
<p class="drag-handle" tabindex="0">⠿ Reorder platform filter</p>`, 170)}

        <h2 id="control-textarea">5. Give text inputs useful editing behavior</h2>
        <p>
          <code>caret-color</code> changes the insertion caret, not the text
          selection. <code>resize</code> controls whether a textarea can grow;
          vertical resizing is often useful while horizontal resizing can
          disrupt a form layout. Keep focus styling and sufficient room for
          longer values.
        </p>
        ${renderLiveCssExample("The caret follows the accent, and the notes field can grow vertically.", `.session-notes {
  inline-size: min(100%, 28rem);
  min-block-size: 5rem;
  resize: vertical;
  caret-color: #184d3b;
  border: 1px solid #68716c;
  border-radius: 4px;
  padding: 0.75rem;
  font: inherit;
}

.session-notes:focus-visible {
  outline: 3px solid #315f70;
  outline-offset: 2px;
}`, `<label for="session-notes">Session notes</label>
<textarea class="session-notes" id="session-notes" rows="3">Try the optional side quests before the final area.</textarea>`, 190)}
        <p>
          For control state semantics and form contracts, continue to
          <a href="/css/interaction">Interaction and accessibility</a>.
        </p>
      </article>
    `
});
defineComponent("docs-css-effects", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Filters and effects</p>
        <h1>Filters, blur, clipping, and compositing</h1>
        <p class="page-lead">
          Visual effects can refine imagery and build layered surfaces, but
          they also affect contrast, stacking, and rendering cost. Start with
          the smallest effect that solves the design problem and keep the
          unenhanced state useful.
        </p>
        <nav class="component-doc-nav" aria-label="Effects chapter contents">
          <a href="#effects-filter">Filter functions</a>
          <a href="#effects-backdrop">Backdrop blur</a>
          <a href="#effects-clip">Clip paths</a>
          <a href="#effects-mask">Masks</a>
          <a href="#effects-blend">Blend modes</a>
          <a href="#effects-review">Support and cost</a>
        </nav>

        <h2 id="effects-filter">1. Compose filter functions</h2>
        <p>
          <code>filter</code> applies image-like effects to an element and its
          rendered descendants. Common functions include
          <code>blur()</code>, <code>brightness()</code>,
          <code>contrast()</code>, <code>grayscale()</code>,
          <code>saturate()</code>, <code>hue-rotate()</code>, and
          <code>drop-shadow()</code>. Functions apply in written order. A
          filtered element creates a stacking context, so avoid adding a
          filter casually to a component that contains overlays.
        </p>
        ${renderLiveCssExample("The cover becomes slightly brighter and more saturated on hover; the resting image remains unchanged.", `.game-cover {
  inline-size: 9rem;
  aspect-ratio: 3 / 4;
  background: linear-gradient(145deg, #184d3b, #315f70 60%, #f0b84b);
  filter: saturate(1.05) contrast(1.02);
  transition: filter 180ms ease;
}

.game-cover:hover { filter: saturate(1.35) brightness(1.08); }`, `<div class="game-cover" tabindex="0" role="img" aria-label="Decorative game cover"></div>`, 180)}

        <h2 id="effects-backdrop">2. Blur what is behind a translucent surface</h2>
        <p>
          <code>backdrop-filter</code> filters pixels behind an element, while
          <code>filter</code> filters the element itself. The surface needs
          some transparency for the backdrop to show through. Provide an opaque
          or less transparent fallback first, and keep text contrast adequate
          over changing background details.
        </p>
        ${renderLiveCssExample("The translucent panel blurs the decorative art behind it when supported.", `.art-stage {
  min-block-size: 9rem;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: linear-gradient(120deg, #184d3b, #f0b84b 52%, #315f70);
}

.frosted-panel {
  padding: 1rem 1.5rem;
  border: 1px solid rgb(255 255 255 / 55%);
  background: rgb(255 254 250 / 72%);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}`, `<div class="art-stage"><div class="frosted-panel"><strong>Game details</strong><br>Hades · Currently playing</div></div>`, 190)}

        <h2 id="effects-clip">3. Clip a box to a shape</h2>
        <p>
          <code>clip-path</code> clips the painted result to a basic shape or
          polygon. The original layout box remains; clipping does not resize
          neighboring content. A clipped shape can also affect hit testing,
          so do not clip important controls into unexpectedly small targets.
        </p>
        ${renderLiveCssExample("The polygon clips a decorative cover to a simple badge shape.", `.game-badge {
  inline-size: 8rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  color: white;
  background: linear-gradient(145deg, #184d3b, #315f70);
  clip-path: polygon(50% 0, 96% 25%, 82% 82%, 50% 100%, 18% 82%, 4% 25%);
}`, `<div class="game-badge" role="img" aria-label="Decorative hexagonal game badge">Featured</div>`, 170)}

        <h2 id="effects-mask">4. Fade an image with a mask</h2>
        <p>
          A mask controls how much of an element is visible at each point. A
          gradient mask is useful for soft fades; unlike a solid clip path, a
          mask can have partial transparency. Keep a fallback for browsers
          without mask support and never fade essential text or status
          information.
        </p>
        ${renderLiveCssExample("The cover fades toward its lower edge while the title remains outside the mask.", `.cover-art {
  inline-size: 8rem;
  aspect-ratio: 3 / 4;
  background: linear-gradient(145deg, #184d3b, #315f70 60%, #f0b84b);
}

@supports (mask-image: linear-gradient(#000, transparent)) {
  .cover-art {
    -webkit-mask-image: linear-gradient(#000 55%, transparent);
    mask-image: linear-gradient(#000 55%, transparent);
  }
}`, `<div class="cover-art" aria-hidden="true"></div>
<h2>Sea of Stars</h2><p>Currently playing · PC</p>`, 190)}

        <h2 id="effects-blend">5. Blend layers intentionally</h2>
        <p>
          <code>mix-blend-mode</code> blends an element with the pixels behind
          it; <code>background-blend-mode</code> blends the element's own
          background layers. The result depends on the backdrop. Use
          <code>isolation: isolate</code> when a component's blend should not
          affect content outside its local stacking context.
        </p>
        ${renderLiveCssExample("The accent label blends with the colored cover only inside its isolated tile.", `.cover-tile {
  isolation: isolate;
  min-block-size: 8rem;
  display: grid;
  place-items: center;
  background: linear-gradient(130deg, #184d3b, #f0b84b);
}

.cover-tile strong {
  padding: 0.4rem 0.6rem;
  color: #184d3b;
  background: #f0b84b;
  mix-blend-mode: screen;
}`, `<div class="cover-tile"><strong>Wishlist</strong></div>`, 160)}

        <h2 id="effects-review">6. Check fallback, contrast, and rendering cost</h2>
        <ul>
          <li>Keep a readable fallback before blur, mask, or blend enhancements.</li>
          <li>Test text contrast over the full range of underlying colors.</li>
          <li>Do not animate large blur radii or filters across many elements without profiling.</li>
          <li>Remember that filters and backdrop filters can create stacking contexts.</li>
          <li>Use borders and outlines for essential separation and keyboard focus.</li>
        </ul>
        <p>
          For shadows on surfaces and clipped silhouettes, continue to
          <a href="/css/shadows">Shadows deep dive</a>. For gradient masks and
          color layers, see <a href="/css/gradients">Gradients</a>.
        </p>
      </article>
    `
});
