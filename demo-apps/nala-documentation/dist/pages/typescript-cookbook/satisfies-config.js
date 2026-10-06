export const recipe = {
  slug: "satisfies-config",
  category: "Type design",
  title: "Validate a config without widening useful literals",
  problem: "Annotating a settings object checks it, but later code loses the exact keys or literal values needed for precise behavior.",
  rootCause: "An annotation can widen a value to the full declared type. A type assertion goes further and tells the checker to trust a value without checking that it meets the shape.",
  solutionCode: `type PlayStatus = "backlog" | "playing" | "completed";

const statusLabels = {
  backlog: "Backlog",
  playing: "In progress",
  completed: "Completed",
} satisfies Record<PlayStatus, string>;

const playingLabel: "In progress" = statusLabels.playing;`,
  whyItWorks: "satisfies verifies that every required key exists and every value is a string, while preserving the expression's inferred literal values for later use.",
  commonTrap: "satisfies checks compatibility at compile time; it does not inspect a JSON object or add runtime validation.",
  workedExampleCode: `const labels = {
  backlog: "Waiting",
  playing: "In progress",
  completed: "Finished",
} satisfies Record<PlayStatus, string>;`,
  workedExampleExplanation: "If a status key is omitted or misspelled, the check fails. The individual values remain narrow literals instead of widening to string.",
  decisionGuide: "Use satisfies for authored source objects such as route tables, labels, and feature configuration when you want a shape checked without widening useful literal values. Use runtime parsing for configuration loaded from JSON or environment variables.",
  edgeCases: [
    "satisfies checks assignability; it does not validate or transform the runtime object.",
    "Fresh object literals receive excess-property checks, but satisfies does not create a general exact-object type.",
    "A literal can still have a value type narrower than the target and that may affect later mutation.",
    "Do not use an assertion instead: `as Config` can silence a mismatch rather than check it."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

const statusLabels = {
  backlog: "Backlog",
  playing: "In progress",
  completed: "Completed",
} satisfies Record<PlayStatus, string>;

Deno.test("configured labels are available at runtime", () => {
  assertEquals(statusLabels.playing, "In progress");
});`,
  verificationNote: "The satisfies constraint is verified by the type checker; the test checks runtime behavior. To see the compile-time benefit, temporarily remove or misspell a required key and run the check.",
  practice: "Create a route configuration that requires every RouteName and preserves each path literal. Confirm a missing route fails type checking, then validate an equivalent object loaded from JSON at runtime."
};
