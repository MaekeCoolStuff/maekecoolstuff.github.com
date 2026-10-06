import { html } from "../../../../vendor/components/dist/index.js";
import { renderCodeExample } from "./code-example.js";
export function renderLiveCssExample(label, source, markup, height = 160) {
  const srcdoc = createPreviewDocument(source, markup);
  return html`
    <div class="layout-demo">
      <p class="layout-demo-label">Live example · ${label}</p>
      <iframe
        title=${`Live CSS example: ${label}`}
        sandbox="allow-forms allow-same-origin"
        loading="lazy"
        srcdoc=${srcdoc}
        style=${`display: block; width: 100%; height: ${height}px; border: 1px solid #cbcfc8; background: #fffefa;`}
      ></iframe>
    </div>
    ${renderCodeExample(source)}
  `;
}
export function renderLiveHtmlExample(label, markup, height = 160) {
  return html`
    <div class="layout-demo">
      <p class="layout-demo-label">Live example · ${label}</p>
      <iframe
        title=${`Live HTML example: ${label}`}
        sandbox="allow-forms allow-same-origin"
        loading="lazy"
        srcdoc=${createPreviewDocument("", markup)}
        style=${`display: block; width: 100%; height: ${height}px; border: 1px solid #cbcfc8; background: #fffefa;`}
      ></iframe>
    </div>
    ${renderCodeExample(markup)}
  `;
}
function createPreviewDocument(styles, markup) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      :root {
        --color-border: #cbcfc8;
        --color-surface: #fffefa;
        --color-surface-muted: #f2f0e8;
        --color-text: #18201d;
        --color-muted: #68716c;
        --color-accent: #184d3b;
        --color-danger: #a43f35;
        --font-body: system-ui, sans-serif;
        --radius-small: 4px;
        --space-4: 1rem;
      }
      body {
        margin: 0;
        padding: 1rem;
        background: #fffefa;
        color: #18201d;
        font: 1rem/1.5 system-ui, sans-serif;
      }
      img { max-inline-size: 100%; }
      ${styles}
    </style>
  </head>
  <body>${markup}</body>
</html>`;
}
