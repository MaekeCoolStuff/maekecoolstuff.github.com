export const recipe = {
  slug: "promise-allsettled-partial-results",
  category: "Failures and async work",
  title: "Keep partial results when independent tasks can fail",
  problem: "Promise.all rejects the whole batch when one game request fails, even though other requests succeeded and their data could still be shown.",
  rootCause: "Promise.all models all-or-nothing fulfillment. It rejects when any input rejects, and it does not automatically stop the other operations. That is correct when every result is required, but not when each game can load independently.",
  solutionCode: `async function loadGameDetails(ids: readonly string[]) {
  const outcomes = await Promise.allSettled(
    ids.map((id) => fetchGameDetails(id)),
  );

  const games = outcomes.flatMap((outcome) =>
    outcome.status === "fulfilled" ? [outcome.value] : []
  );
  const failures = outcomes.filter((outcome) => outcome.status === "rejected");
  return { games, failures };
}`,
  whyItWorks: "Promise.allSettled waits for every task and returns a fulfilled/rejected discriminated result for each input in input order. The caller can retain successes and decide how to report individual failures.",
  commonTrap: "allSettled does not cancel failed or slow tasks, and its rejection reason is unknown. Narrow or safely format the reason before reading Error properties.",
  workedExampleCode: `const results = await Promise.allSettled([
  fetchGameDetails("g-1"),
  fetchGameDetails("g-2"),
]);

for (const result of results) {
  if (result.status === "fulfilled") {
    console.log(result.value.title);
  } else {
    console.warn("One game could not be loaded");
  }
}`,
  workedExampleExplanation: "The status discriminant narrows each outcome. The fulfilled branch contains its game value; the rejected branch contains an unknown reason that should be handled without assuming its shape.",
  decisionGuide: "Use allSettled when each operation is independent and partial data is useful. Use Promise.all when the operation is valid only if every member succeeds. For dependent operations, await in sequence.",
  edgeCases: [
    "An empty input resolves immediately to an empty results array.",
    "Result order matches input order, not completion order.",
    "A rejected reason may be a string, object, or Error and must be treated as unknown.",
    "If a batch should stop on cancellation, propagate AbortSignal separately; allSettled itself does not cancel work.",
    "Large batches may need a concurrency limit rather than starting every request at once."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("allSettled retains success and failure outcomes in input order", async () => {
  const outcomes = await Promise.allSettled([
    Promise.resolve("Celeste"),
    Promise.reject("offline"),
  ]);
  assertEquals(outcomes[0], { status: "fulfilled", value: "Celeste" });
  assertEquals(outcomes[1].status, "rejected");
});`,
  verificationNote: "Test mixed outcomes and verify your application reports partial failure without discarding usable successful results.",
  practice: "Load a page of game cards where each image and metadata request is independent. Keep successful cards, show a retry affordance for failures, and add a concurrency limit for large pages."
};
