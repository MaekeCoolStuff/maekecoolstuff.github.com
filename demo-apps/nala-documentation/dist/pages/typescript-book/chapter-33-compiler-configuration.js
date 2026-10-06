import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-33", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 6: Professional TypeScript · Chapter 33</p>
        <h1>Compiler configuration</h1>

              <p>
                Compiler options define which checks a team relies on and how
                modules are interpreted. Enable strict checking early, use one
                consistent module strategy, and understand the libraries available
                to the project. Tighten additional options deliberately because they
                may expose assumptions that need migration.
              </p>
              ${renderCodeExample(`{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}`)}
              <p>
                Strict mode includes important checks such as null safety and
                implicit-any detection. <code>noUncheckedIndexedAccess</code> makes
                indexed reads account for missing entries. With
                <code>exactOptionalPropertyTypes</code>, an omitted optional
                property differs from one explicitly set to undefined. Use the
                configuration and module strategy selected by your project.
              </p>
              ${renderWorkedExample(html`<p>
                An indexed array lookup may be <code>undefined</code> when the
                index is absent. Exact optional properties distinguish leaving a
                field out from explicitly assigning <code>undefined</code>.
              </p>`)}
        <section>
          <h2>Configuration is part of the program contract</h2>
          <p>
            Compiler settings determine which assumptions the checker can
            reject, which JavaScript features output uses, and how modules
            are resolved. Two developers can read the same source and
            receive different guarantees under different configurations.
            Commit the project configuration and use its documented tasks
            rather than relying on editor-only defaults.
          </p>
          ${renderCodeExample(`{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true
  }
}`)}
          <p>
            <code>strict</code> enables important checks such as null safety
            and implicit-any detection. <code>noUncheckedIndexedAccess</code>
            makes indexed reads reflect possible absence.
            <code>exactOptionalPropertyTypes</code> distinguishes an omitted
            property from one explicitly set to undefined.
            <code>noImplicitOverride</code> requires subclass overrides to
            be marked. Strong settings surface assumptions early, but
            enabling them in a mature codebase may require a migration.
          </p>
        </section>

        <section>
          <h2>Understand target, libraries, and runtime</h2>
          <p>
            The JavaScript target controls which syntax is preserved or
            transformed; it does not install missing APIs. The
            <code>lib</code> setting tells the checker which built-ins exist,
            such as browser DOM types. A program can type-check against an
            API an older runtime lacks, so align configuration with the
            actual deployment environment or provide a compatible
            alternative.
          </p>
          <p>
            <code>module</code> and module-resolution settings determine how
            imports are interpreted. They must agree with the runtime or
            bundler. Do not copy module options from another toolchain
            without understanding its package and extension rules.
          </p>
          ${renderCodeExample(`  // This project uses Deno configuration, not tsconfig.json.
  // deno.json supplies compiler options and named tasks.
  // Source imports use .ts; the build rewrites browser imports.`)}
        </section>

        <section>
          <h2>Separate checking, linting, building, and running</h2>
          <p>
            Type checking verifies static contracts and module resolution.
            Linting checks additional conventions. A build transforms or
            copies assets for a target. Running executes output in a runtime.
            Tools may combine jobs, but they are not interchangeable: a
            successful check does not prove deployment works, and
            transpilation alone may not type-check.
          </p>
          ${renderCodeExample("deno task check:nala")}
          <p>
            This repository also defines tasks for tests, builds, and
            development servers. Use project tasks because they encode
            intended inputs and permissions. In another repository, inspect
            its configuration and CI rather than assuming these commands
            apply.
          </p>
        </section>

        <section>
          <h2>Adopt stricter options with a migration plan</h2>
          <p>
            Options such as <code>noUncheckedIndexedAccess</code> and
            <code>exactOptionalPropertyTypes</code> can expose real ambiguity
            in existing contracts. Enable a setting, group diagnostics by
            root cause, update types and callers, then rerun focused tests.
            Do not silence a large migration with <code>any</code> or
            assertions just to get a green check.
          </p>
          <p>
            Keep configuration consistent across editors, command-line
            tasks, tests, and continuous integration. Exceptions should be
            narrow, temporary, and documented.
          </p>
        </section>

        <section>
          <h2>Review a configuration change</h2>
          <ul>
            <li>Does the checker model APIs available in the actual runtime?</li>
            <li>Do module resolution and emitted import paths agree?</li>
            <li>Are strictness settings shared by local work and CI?</li>
            <li>Does the build check types or only transform source?</li>
            <li>Can a stricter option be adopted without hiding errors?</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: trace the toolchain</h2>
            <p>
              Trace one TypeScript module from <code>deno check</code>
              through the build to the browser. Identify where types are
              checked, erased, and where JavaScript runs. Then locate the
              CI task that enforces the same contract.
            </p>
          `)}
        </section>
      </article>
    `
});
