import { defineComponent, html, repeat } from "../../../../vendor/components/dist/index.js";
import { packageReferences } from "./package-reference-page.js";
defineComponent("docs-packages-page", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Reference</p>
        <h1>Vendor packages</h1>
        <p class="page-lead">
          Explore public exports, configuration options, behavior contracts, and usage patterns for every vendor package.
        </p>
        <div class="docs-grid">
          ${repeat(packageReferences, (pkg)=>pkg.slug, (pkg)=>html`
                <nala-card>
                  <span slot="eyebrow">${pkg.kind} · vendor/${pkg.slug}</span>
                  <span slot="title">${pkg.name}</span>
                  <p>${pkg.summary}</p>
                  ${pkg.sourceLines !== undefined ? html`
                      <p class="package-source-stat">
                        <strong>${pkg.sourceLines.toLocaleString()}</strong>
                        lines of TypeScript source
                      </p>
                    ` : ""}
                  <a slot="actions" href=${`/packages/${pkg.slug}`}>
                    Open package reference
                  </a>
                  <nala-badge slot="actions" tone=${pkg.kind === "Optional package" ? "warning" : "accent"}>
                    ${pkg.kind === "Optional package" ? "Optional" : "Core"}
                  </nala-badge>
                </nala-card>
              `)}
        </div>
      </article>
    `
});
