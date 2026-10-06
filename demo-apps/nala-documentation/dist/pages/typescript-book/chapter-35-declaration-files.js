import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-35", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 6: Professional TypeScript · Chapter 35</p>
        <h1>Declaration files and JavaScript interop</h1>
        <p>
                A declaration file describes the types of JavaScript that already
                exists. It contains no implementation. Declarations help the
                checker understand a library or legacy module, but an incorrect
                declaration can make unsafe code appear safe. Check the actual
                runtime behavior and keep custom declarations as narrow as possible.
              </p>
              ${renderCodeExample(`declare module "legacy-game-catalog" {
  export function findTitle(id: string): string | undefined;
}`)}
              <p>
                This declaration is a promise to the compiler that the module exports
                a function with that contract. It does not create the module, verify
                its return value, or make a missing dependency available. For
                JavaScript you own, gradual migration can add JSDoc types and
                <code>checkJs</code> before converting files to TypeScript.
              </p>
              ${renderWorkedExample(html`
                <p>
                  The declaration is inaccurate. Change it to describe the
                  runtime, then handle null or validate and normalize the result
                  before exposing a stronger application contract. A declaration
                  never changes JavaScript behavior.
                </p>
              `)}
        <section>
          <h2>Declarations describe code; they do not implement it</h2>
          <p>
            A <code>.d.ts</code> file tells the checker what JavaScript
            exports and accepts. It contains no executable implementation.
            A precise declaration helps callers, but an inaccurate one can
            make unsafe runtime behavior look safe. Inspect the actual
            library and keep declarations no broader than the evidence.
          </p>
          ${renderCodeExample(`// legacy-game-catalog.d.ts
declare module "legacy-game-catalog" {
  export function findTitle(id: string): string | null;
}`)}
          <p>
            This declaration claims the module exports
            <code>findTitle</code>; it does not create the module or verify
            the return value. The caller must still handle null, and
            external data may need validation before becoming a domain
            value.
          </p>
        </section>

        <section>
          <h2>Use JSDoc to migrate JavaScript gradually</h2>
          <p>
            JavaScript files can benefit from TypeScript checking before
            they are renamed. Enable <code>checkJs</code> in the project
            or use a <code>// @ts-check</code> directive for a focused
            file. JSDoc annotations describe parameters, returns, and
            object shapes without changing runtime behavior.
          </p>
          ${renderCodeExample(`// @ts-check
  /** @typedef {{ id: string, title: string }} GameCard */
  /** @param {GameCard} game
   *  @returns {string}
   */
  export function gameLabel(game) {
    return game.title;
  }`)}
          <p>
            JSDoc types are checked only when the toolchain includes that
            file and enables the relevant checking. Incremental migration
            lets a team add contracts around stable boundaries, then
            convert files when type and module conventions are ready.
          </p>
        </section>

        <section>
          <h2>Match declarations to module behavior</h2>
          <p>
            JavaScript ecosystems include ESM, CommonJS, and interop
            wrappers. A declaration must describe the shape consumers
            actually import. Declaring a default export for a named-export
            module can make the checker happy while runtime imports fail.
            Package export conditions may select different entrypoints
            for different runtimes.
          </p>
          ${renderCodeExample(`declare module "legacy-game-catalog" {
  export interface GameCard {
    id: string;
    title: string;
  }
  export function findTitle(id: string): GameCard | undefined;
}`)}
          <p>
            Keep declarations beside JavaScript you own. For third-party
            packages, verify the installed version and actual export shape.
            Do not mask a mismatch with an ambient declaration that claims
            an import exists when it does not.
          </p>
        </section>

        <section>
          <h2>Use ambient declarations and augmentation carefully</h2>
          <p>
            An ambient declaration describes a module or global supplied
            elsewhere. Module augmentation can add types to an existing
            declaration, but it must match a real runtime extension.
            Global augmentation affects a broad scope and can create
            conflicts; prefer module-scoped contracts and explicit
            adapters when possible.
          </p>
          ${renderCodeExample(`declare global {
  interface Window {
    gameShelfVersion?: string;
  }
}

export {}; // Keep this declaration file a module.`)}
          <p>
            The declaration only tells TypeScript that other code may set
            this property; it does not initialize it. Check for absence at
            runtime and avoid augmenting built-in globals without a clear
            owner and documentation.
          </p>
        </section>

        <section>
          <h2>Keep interop declarations honest</h2>
          <ul>
            <li>Use <code>unknown</code> for values whose shape is not proven.</li>
            <li>Model nullability and returned outcomes accurately.</li>
            <li>Match named/default exports and the actual module system.</li>
            <li>Ensure declaration files ship with the package they describe.</li>
            <li>Type-check a real consumer against custom declarations.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: audit a JavaScript dependency</h2>
            <p>
              Inspect an exported function in a JavaScript library. Record
              accepted values, return values, null behavior, and module
              export shape. Write the narrow declaration, type-check a
              consumer, and test the runtime boundary.
            </p>
          `)}
        </section>
      </article>
    `
});
