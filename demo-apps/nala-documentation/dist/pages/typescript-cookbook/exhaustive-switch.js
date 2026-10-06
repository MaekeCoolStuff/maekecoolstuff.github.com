export const recipe = {
  slug: "exhaustive-switch",
  category: "Type design",
  title: "Notice a new union case everywhere it matters",
  problem: "A new play state is added, but one label function silently returns a generic fallback and displays the wrong text.",
  rootCause: "A switch with a default branch can hide missing cases. The code still compiles, so new domain states may never receive a deliberate UI label or action.",
  solutionCode: `function assertNever(value: never): never {
  throw new Error("Unhandled play state");
}

function labelFor(state: PlayState): string {
  switch (state.status) {
    case "backlog": return "Backlog";
    case "playing": return "Playing";
    case "completed": return "Completed";
    default: return assertNever(state);
  }
}`,
  whyItWorks: "When all union members are handled, the remaining value is never. If a developer adds paused to PlayState, state is no longer never in the default branch and the checker reports the missing decision.",
  commonTrap: `A default branch returning "Unknown" is convenient but can conceal a missing product decision. Use a fallback only when an unknown case is genuinely valid at runtime and still handled intentionally.`,
  workedExampleCode: `type Outcome = "saved" | "failed" | "cancelled";

function outcomeLabel(outcome: Outcome): string {
  switch (outcome) {
    case "saved": return "Saved";
    case "failed": return "Could not save";
    case "cancelled": return "Cancelled";
    default: return assertNever(outcome);
  }
}`,
  workedExampleExplanation: "The never check ties the switch to the full union, so future alternatives must be considered here instead of falling through unnoticed.",
  decisionGuide: "Use an exhaustive switch when every union variant requires a deliberate user-facing result, transition, or error policy. For truly forward-compatible wire formats, validate unknown tags at the boundary before converting to the closed application union.",
  edgeCases: [
    "A broad default return value can silently hide a new union member.",
    "The assertNever helper should receive the remaining value after every known branch returns.",
    "Runtime JSON may contain a variant not present in the compiled union; validate it before exhaustive domain handling.",
    "Add both a runtime test for each branch and a compile-time check when a new variant is introduced."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("every play state has a label", () => {
  assertEquals(labelFor({ status: "backlog" }), "Backlog");
  assertEquals(labelFor({ status: "playing", hoursPlayed: 3 }), "Playing");
  assertEquals(labelFor({ status: "completed" }), "Completed");
});`,
  verificationNote: "A type check provides the missing-member guarantee; behavior tests verify that each branch produces the intended result.",
  practice: "Add a paused state with a reason field. Update the model, label, transition rules, and tests; confirm that any unhandled switch becomes a compiler error until you decide its behavior."
};
