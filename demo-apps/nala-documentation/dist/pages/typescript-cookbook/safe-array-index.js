export const recipe = {
  slug: "safe-array-index",
  category: "Values and collections",
  title: "An array item might not exist",
  problem: "A lookup like games[index].title suddenly reports that games[index] might be undefined, even though the list usually has that item.",
  rootCause: "An array's length can change, and an index can be negative, fractional, or past the last item. With noUncheckedIndexedAccess enabled, TypeScript includes undefined in indexed reads so code must account for a missing element.",
  solutionCode: `type Game = { id: string; title: string };

function titleAt(games: readonly Game[], index: number): string {
  const game = games[index];
  if (game === undefined) return "No game at this position";
  return game.title;
}`,
  whyItWorks: "The guard turns Game | undefined into Game. After the early return, the remaining code can safely read title. If the missing item is impossible by design, prefer fixing the index calculation; a non-null assertion only hides the possibility from the checker.",
  commonTrap: "Do not write games[index]! just to silence the error. If the index is wrong at runtime, the assertion does not create a Game and the property access can still crash.",
  workedExampleCode: `function selectedGame(
  games: readonly Game[],
  index: number,
): Game | undefined {
  return games[index];
}`,
  workedExampleExplanation: "The return type preserves the real possibility that there is no item. The caller must handle that case before displaying or editing a game.",
  decisionGuide: "Keep undefined in the return type when an index or key may be absent. If absence violates a domain invariant, check bounds and report a clear failure at the boundary instead of asserting the item exists.",
  edgeCases: [
    "An empty array, negative index, fractional index, or index equal to length has no element.",
    "noUncheckedIndexedAccess adds undefined to indexed reads; without it, runtime absence still exists.",
    "Sparse arrays can skip holes during iteration and differ from arrays containing explicit undefined.",
    "A stable ID lookup may be clearer than retaining a positional index across sorting or filtering."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("titleAt handles empty and out-of-range indexes", () => {
  assertEquals(titleAt([], 0), "No game at this position");
  assertEquals(titleAt([{ id: "g-1", title: "Hades" }], 1),
    "No game at this position");
  assertEquals(titleAt([{ id: "g-1", title: "Hades" }], 0), "Hades");
});`,
  verificationNote: "Test missing items explicitly even if the current UI usually supplies a valid index; collection sizes change over time.",
  practice: "Write a function that selects a game by ID and returns Game | undefined. Then update the caller to show a deliberate empty-selection state instead of using a non-null assertion."
};
