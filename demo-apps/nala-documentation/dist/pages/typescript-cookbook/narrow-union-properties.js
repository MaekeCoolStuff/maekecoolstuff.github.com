export const recipe = {
  slug: "narrow-union-properties",
  category: "Type design",
  title: "A union only guarantees shared properties",
  problem: "Reading state.hoursPlayed fails because some games are in the backlog or already completed.",
  rootCause: "A union means the value may be any listed alternative. TypeScript only permits members present on every alternative until a check proves which member is present.",
  solutionCode: `function playSummary(state: PlayState): string {
  if (state.status === "playing") {
    return state.hoursPlayed + " hours played";
  }
  if (state.status === "completed") {
    return state.completedOn ?? "Completed";
  }
  return "Waiting to be played";
}`,
  whyItWorks: "The status field is a discriminant. Checking it narrows state to one union member, so hoursPlayed and completedOn are only read in branches where they exist.",
  commonTrap: "Do not add optional hoursPlayed to every alternative just to satisfy the checker. That permits nonsensical states, such as a backlog entry with play hours.",
  workedExampleCode: `function completionDate(state: PlayState): string | undefined {
  if (state.status === "completed") return state.completedOn;
  return undefined;
}`,
  workedExampleExplanation: "The completed-state check must occur before accessing completedOn, just as a union must declare a state-specific property only on alternatives where it is meaningful.",
  decisionGuide: "Narrow a union with its discriminant before reading variant-specific fields. Model fields only on states where they have meaning instead of making every field optional to avoid branch checks.",
  edgeCases: [
    "A new union member should create a compile-time prompt in exhaustive consumers.",
    "Optional fields inside a variant can still be undefined and need their own check.",
    "A broad default case can hide a newly added member if it returns a plausible fallback.",
    "Runtime data may contain an unknown status and must be validated before it becomes the trusted union."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("play summary handles each state variant", () => {
  assertEquals(playSummary({ status: "backlog" }), "Waiting to be played");
  assertEquals(playSummary({ status: "playing", hoursPlayed: 2 }), "2 hours played");
  assertEquals(playSummary({ status: "completed" }), "Completed");
});`,
  verificationNote: "The compiler checks that a property is accessed only after narrowing; runtime tests ensure each branch still expresses the intended product wording.",
  practice: "Add a paused variant with a reason and update the summary, transition logic, and tests. Avoid adding reason as an optional field to backlog and completed states."
};
