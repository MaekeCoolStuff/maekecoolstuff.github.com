import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-39", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 6: Professional TypeScript · Chapter 39</p>
        <h1>Shipping and deployment</h1>

              <p>
                TypeScript types are removed from browser output. A production
                workflow should check types, run tests, build browser assets, and
                serve the generated files. A successful type check does not prove
                that deployment paths, requests, or navigation work.
              </p>
              ${renderCodeExample(`deno task check:nala
deno test -A
deno task build:nala
deno task dev:nala-documentation`)}
              <p>
                This repository's build checks and transpiles source modules, then
                rewrites imports for browser JavaScript. The browser loads generated
                files; type annotations are not runtime checks. Verify the deployed
                app over its real base path and confirm that requests, navigation,
                and assets succeed.
              </p>
              ${renderWorkedExample(html`<p>
                Type checking does not execute the app or contact deployed
                services. Tests exercise behavior; a browser workflow catches
                missing assets, failed requests, routing problems, and interaction
                regressions.
              </p>`)}
        <section>
          <h2>Make the release pipeline reproducible</h2>
          <p>
            A release should be produced from a known revision using the
            same checks developers run locally. A useful pipeline formats
            and lints source, checks types, runs tests, builds artifacts,
            and performs a smoke test on the built application. Fail early
            when a gate fails; do not deploy from a developer's untracked
            working tree.
          </p>
          ${renderCodeExample("deno task check:nala")}
          <p>
            This repository also provides test and build tasks. A different
            project may use other commands, but CI should invoke its
            documented project tasks rather than maintain a second,
            inconsistent recipe.
          </p>
          <ul>
            <li>Check formatting and lint rules.</li>
            <li>Type-check every application and package entry point.</li>
            <li>Run unit and integration tests with deterministic dependencies.</li>
            <li>Build the exact artifacts that will be deployed.</li>
            <li>Smoke-test the built application in a browser-like environment.</li>
          </ul>
        </section>

        <section>
          <h2>Deploy artifacts, not TypeScript assumptions</h2>
          <p>
            Browsers execute JavaScript, not TypeScript annotations. Deploy
            the generated JavaScript, HTML, CSS, and assets from the build
            output. Do not edit generated files by hand; change source and
            rebuild so the artifact corresponds to the reviewed revision.
            Verify MIME types, relative imports, asset paths, and cache
            behavior at the actual host.
          </p>
          <p>
            A single-page application may need the host to serve its entry
            document for nested client routes. Test a direct request and
            refresh on a deep URL, not only client-side navigation from
            the root. Applications deployed under a path prefix must use
            that base for links and assets.
          </p>
        </section>

        <section>
          <h2>Separate public configuration from secrets</h2>
          <p>
            Browser configuration is visible to every user. API base URLs,
            public feature flags, and analytics identifiers may be public
            by design; credentials, signing keys, and privileged tokens
            must remain server-side. Build-time environment substitution
            does not make a secret safe if it is included in a browser
            bundle.
          </p>
          <p>
            Validate required deployment configuration at startup and fail
            with a clear operational message. Keep development, preview,
            and production values separate, and ensure test deployments do
            not point at production data accidentally.
          </p>
        </section>

        <section>
          <h2>Plan caching, source maps, and security headers</h2>
          <p>
            Cache immutable, content-addressed assets for long periods and
            keep the entry HTML fresh enough to reference the current
            assets. Decide whether source maps are public, privately
            uploaded for error reporting, or omitted; source maps can
            reveal implementation details. Use secure response headers
            such as Content Security Policy as defense in depth, and test
            them with the deployed application.
          </p>
          <p>
            A correct TypeScript build does not configure TLS, cookies,
            CORS, permissions, or content policy. Those are deployment and
            server contracts that need independent review.
          </p>
        </section>

        <section>
          <h2>Release safely and prepare to recover</h2>
          <p>
            Deployments can fail after passing CI because of environment
            differences, schema mismatches, or unavailable services. Use
            staged rollout or a preview environment for risky changes,
            monitor errors and core workflows, and know how to roll back
            the application artifact. Database and persisted-data
            migrations should be backward-compatible or have an explicit
            recovery plan.
          </p>
          <p>
            A rollback of frontend code cannot automatically reverse an
            irreversible data migration. Design migration order, feature
            flags, and compatibility windows together.
          </p>
        </section>

        <section>
          <h2>Verify the deployed user journey</h2>
          <ul>
            <li>Load and refresh nested routes over the deployed base path.</li>
            <li>Check browser console errors, failed requests, and missing assets.</li>
            <li>Exercise keyboard navigation, forms, focus, and error states.</li>
            <li>Confirm configuration points to the intended environment.</li>
            <li>Verify monitoring, rollback, and data recovery procedures.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: prepare a release checklist</h2>
            <p>
              Choose a Game Shelf release and write down its revision,
              checks, build artifact, public configuration, data changes,
              smoke-test path, monitoring signal, and rollback plan. Have
              another developer follow the checklist without relying on
              local machine state.
            </p>
          `)}
        </section>
      </article>
    `
});
