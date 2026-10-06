export const recipe = {
  slug: "immutable-update",
  category: "Application state",
  title: "Update one field without mutating the shared object",
  problem: "A component changes a game title in place, but subscribers, tests, or UI updates do not notice the change reliably.",
  rootCause: "Other parts of the application may compare object identity or hold a reference to the old value. Mutating an object changes its contents without changing its reference, which hides the update from those observers.",
  solutionCode: `type Game = { id: string; title: string; platform: string };

function renameGame(game: Game, title: string): Game {
  return { ...game, title };
}

const renamed = renameGame(game, "Celeste");`,
  whyItWorks: "The spread copies the existing fields into a new object and the later title property replaces the old value. Callers can observe a new reference and the original remains unchanged.",
  commonTrap: "Object spread is shallow. If you mutate a nested array or object after copying, both versions can still share that nested reference.",
  workedExampleCode: `type GameWithPreferences = {
  id: string;
  preferences: { pinned: boolean };
};

const game: GameWithPreferences = {
  id: "g-1",
  preferences: { pinned: false },
};

const updated: GameWithPreferences = {
  ...game,
  preferences: {
    ...game.preferences,
    pinned: true,
  },
};`,
  workedExampleExplanation: "Each changed level gets a new object. Unchanged levels can remain shared as long as they are treated as immutable.",
  decisionGuide: "Use immutable updates when state is shared with subscribers, compared by identity, or used for undo/history. A local object with clear single ownership may be mutated deliberately, but document that ownership and do not mutate values callers still hold.",
  edgeCases: [
    "Object spread copies only one level; nested objects and arrays remain shared references.",
    "Later properties in a spread literal overwrite earlier properties with the same key.",
    "Returning a new object for a no-op can trigger unnecessary subscribers or rendering.",
    "Readonly is a compile-time restriction and does not freeze JavaScript values at runtime."
  ],
  verificationCode: `import { assertEquals, assertNotStrictEquals } from "jsr:@std/assert";

Deno.test("renaming returns a new game and preserves the original", () => {
  const original = { id: "g-1", title: "Hades", platform: "PC" };
  const renamed = renameGame(original, "Celeste");
  assertNotStrictEquals(renamed, original);
  assertEquals(renamed.title, "Celeste");
  assertEquals(original.title, "Hades");
});`,
  verificationNote: "For nested updates, also assert that the changed nested object is new and unchanged branches retain their intended identity.",
  practice: "Implement a platform update that adds one platform without mutating the source array, preserves existing platforms, and returns the original game when the platform is already present."
};
