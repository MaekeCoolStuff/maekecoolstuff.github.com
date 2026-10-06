import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample, renderWorkedExample } from "./shared.js";
defineComponent("docs-ts-chapter-25", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">Part 4: TypeScript in the browser · Chapter 25</p>
        <h1>Storage and serialization</h1>
        <p>
                Serialization turns runtime values into a format that can be stored
                or sent. JSON does not preserve every JavaScript value, and reading
                JSON creates untrusted data again. Handle missing keys, malformed
                JSON, old schema versions, and storage failures as normal cases.
              </p>
              ${renderCodeExample(`const savedGamesKey = "game-shelf:games";

function readSavedGameCards(storage: Storage): GameCardData[] {
  const serialized = storage.getItem(savedGamesKey);
  if (serialized === null) return [];

  try {
    const payload: unknown = JSON.parse(serialized);
    if (!Array.isArray(payload)) return [];
    return payload.map(parseGameCard);
  } catch {
    return [];
  }
}`)}
              <p>
                Parsing can throw, and individual entries still need validation.
                Durable data should have an explicit version so a future application
                can migrate older shapes instead of guessing. Storage may be disabled
                or full; a failed write should not erase a valid in-memory update.
                Do not persist credentials or derived values that can be recomputed.
              </p>
              ${renderWorkedExample(html`
                <ul>
                  <li>The key may be absent.</li>
                  <li>The JSON may be malformed or have the wrong shape.</li>
                  <li>Storage access may be unavailable or throw.</li>
                </ul>
                <p>
                  A versioned envelope lets the application choose an explicit
                  migration for old data. Validate the migrated result before
                  treating it as current Game Shelf state.
                </p>
              `)}
        <section>
          <h2>Storage is a fallible string boundary</h2>
          <p>
            <code>localStorage</code> stores string keys and values and is
            synchronous. It can be unavailable because of browser policy,
            privacy settings, or quota limits; even obtaining the storage
            object can fail. Treat reads and writes as fallible operations
            instead of assuming persistence always works.
          </p>
          ${renderCodeExample(`function readText(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeText(storage: Storage, key: string, value: string): boolean {
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}`)}
          <p>
            A failed write need not roll back a valid in-memory update. Tell
            the user when durable saving is essential, or continue in memory
            if the product permits it. Large or transactional datasets may
            need IndexedDB rather than synchronous Web Storage.
          </p>
        </section>

        <section>
          <h2>JSON does not preserve arbitrary JavaScript values</h2>
          <p>
            JSON represents a limited data model. Object properties with
            <code>undefined</code>, functions, and symbols are omitted;
            undefined array entries become null; BigInt and cyclic objects
            make <code>JSON.stringify</code> throw. Dates serialize as
            strings, and Map/Set instances do not automatically round-trip
            their entries. Define a deliberate storage DTO.
          </p>
          ${renderCodeExample(`const savedAt = new Date();
const serialized = JSON.stringify({ savedAt });
const parsed: unknown = JSON.parse(serialized);

// parsed.savedAt is a string-shaped value, not a Date instance.
// Convert and validate it before date operations.`)}
          <p>
            Parsing can fail, and successful parsing proves only that the
            text is valid JSON. Validate the result as unknown before using
            application properties. Serialization and validation solve
            different sides of the same boundary.
          </p>
        </section>

        <section>
          <h2>Version data and migrate deliberately</h2>
          <p>
            Durable data can outlive the code that wrote it. Store a schema
            version in an envelope, validate that envelope, migrate known
            older versions explicitly, and validate the current shape after
            migration. Handle unknown future versions deliberately rather
            than interpreting them optimistically.
          </p>
          ${renderCodeExample(`type StoredEnvelope = {
  version: number;
  games: unknown;
};

function decodeSavedGames(text: string): GameCard[] {
  const parsed: unknown = JSON.parse(text);
  if (!isRecord(parsed) || typeof parsed.version !== "number") {
    throw new Error("Invalid saved-game envelope");
  }
  if (parsed.version === 1) {
    return parseGameCards(migrateV1ToV2(parsed));
  }
  if (parsed.version === 2) return parseGameCards(parsed.games);
  throw new Error("Unsupported saved-game version");
}`)}
          <p>
            Migrations should be deterministic and tested with examples from
            every supported old format. Decide whether corrupt data is
            discarded, backed up, or surfaced for recovery; silently
            returning an empty list can appear to erase a collection.
          </p>
        </section>

        <section>
          <h2>Cross-tab events are not transactions</h2>
          <p>
            The <code>storage</code> event can notify another same-origin
            document that a key changed. It does not fire in the document
            that made the write, and simultaneous edits can overwrite one
            another. Treat it as a synchronization signal, not as a
            transactional database or a conflict-resolution strategy.
          </p>
          ${renderCodeExample(`window.addEventListener("storage", (event) => {
  if (event.storageArea !== localStorage) return;
  if (event.key !== savedGamesKey || event.newValue === null) return;
  try {
    const games = decodeSavedGames(event.newValue);
    console.log("Other tab stored", games.length, "games");
  } catch (error) {
    console.error("Could not read the updated collection", error);
  }
});`)}
          <p>
            Persist independent source data, not secrets, temporary
            interface state, or values that can be derived. Choose one owner
            for writes and define conflict behavior if multiple tabs may edit
            the same collection.
          </p>
        </section>

        <section>
          <h2>Test serialization and recovery</h2>
          <ul>
            <li>Test missing keys, malformed JSON, and unsupported versions.</li>
            <li>Test migrations with real examples for every supported schema version.</li>
            <li>Simulate quota and permission failures through an injected Storage boundary.</li>
            <li>Verify invalid persisted values never enter trusted state.</li>
            <li>Review privacy, retention, and cross-tab behavior explicitly.</li>
          </ul>
          ${renderWorkedExample(html`
            <h2>Practice: build a versioned envelope</h2>
            <p>
              Define a version 1 shape, a current version 2 shape, and a
              migration function. Keep parsed input unknown until
              validated, then test the migration and the current parser.
            </p>
          `)}
        </section>
      </article>
    `
});
