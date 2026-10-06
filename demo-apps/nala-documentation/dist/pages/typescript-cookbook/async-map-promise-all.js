export const recipe = {
  slug: "async-map-promise-all",
  category: "Failures and async work",
  title: "Wait for every async map result",
  problem: "A function promised an array of game covers, but the value is actually an array of unresolved Promise objects.",
  rootCause: "An async callback always returns a Promise. Array.map runs the callback and collects its return values; it does not await them for you.",
  solutionCode: `async function loadCovers(games: readonly Game[]): Promise<Cover[]> {
  return Promise.all(games.map((game) => fetchCover(game.id)));
}`,
  whyItWorks: "map creates Promise<Cover>[] and Promise.all waits for them together, producing Promise<Cover[]> while preserving the result order from the input array.",
  commonTrap: "Use Promise.allSettled instead when one failed request should not discard all other successful results. Promise.all rejects as soon as any member rejects.",
  workedExampleCode: `async function loadRatings(games: readonly Game[]): Promise<number[]> {
  const ratingPromises = games.map((game) => fetchRating(game.id));
  return Promise.all(ratingPromises);
}`,
  workedExampleExplanation: "The element type of the promises is preserved, so awaiting Promise.all returns number[].",
  decisionGuide: "Use Promise.all when every independent request is required and results should keep input order. Use sequential await when later work depends on an earlier result. Use allSettled when partial success is useful and each outcome needs handling.",
  edgeCases: [
    "If any promise rejects, Promise.all rejects; it does not cancel the remaining operations.",
    "An empty input resolves to an empty result array.",
    "Large input lists may need bounded concurrency to avoid overwhelming a service.",
    "Propagate AbortSignal when obsolete work should stop, and keep cancellation distinct from missing data."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("Promise.all preserves map input order", async () => {
  const promises = [
    Promise.resolve("first"),
    Promise.resolve("second"),
  ];
  assertEquals(await Promise.all(promises), ["first", "second"]);
});`,
  verificationNote: "Also test one rejection and decide whether that should fail the whole operation or produce partial results.",
  practice: "Load ratings for a list of games. Decide whether one failed rating should hide all other ratings or be displayed as an individual failure, then choose Promise.all or Promise.allSettled and test that policy."
};
