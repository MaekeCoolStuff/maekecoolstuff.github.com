export const recipe = {
  slug: "literal-union-membership",
  category: "Type design",
  title: "Check a broad string against a literal list",
  problem: "Calling allowedStatuses.includes(status) fails because status is string while the tuple's includes method accepts only its narrow literal union.",
  rootCause: "A const tuple preserves exact member types. includes accepts a value of those member types, so a broad string cannot be passed until runtime code establishes that it is one of the allowed values.",
  solutionCode: `const playStatuses = ["backlog", "playing", "completed"] as const;
type PlayStatus = typeof playStatuses[number];

function parsePlayStatus(value: string): PlayStatus | undefined {
  return playStatuses.find((status) => status === value);
}

const status = parsePlayStatus(statusFromUrl);`,
  whyItWorks: "find compares the broad string with each literal and returns a member only when one matches. Its result is PlayStatus | undefined, so unrecognized input stays untrusted and callers handle failure.",
  commonTrap: "Do not cast a URL string to PlayStatus before checking it. The cast removes the error but accepts arbitrary runtime values such as paused or a typo.",
  workedExampleCode: `function isPlayStatus(value: string): value is PlayStatus {
  return playStatuses.some((status) => status === value);
}

if (isPlayStatus(statusFromStorage)) {
  setPlayStatus(statusFromStorage);
}`,
  workedExampleExplanation: "The predicate returns true only when a runtime comparison matched a declared literal, so the checked branch can safely use PlayStatus.",
  decisionGuide: "Use a literal list as the source of truth for finite values and derive the union from it. Use find when you need the parsed member, or a tested type predicate when many callers need the same validation.",
  edgeCases: [
    "An empty literal list can never match and produces the never element type.",
    "String comparisons are case-sensitive unless you normalize deliberately.",
    "A runtime value may come from JSON, URL state, or an older persisted version and must be checked every time it crosses that boundary.",
    "Avoid maintaining a separate list and union by hand; they can drift apart."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("only declared play statuses parse", () => {
  assertEquals(parsePlayStatus("playing"), "playing");
  assertEquals(parsePlayStatus("paused"), undefined);
});`,
  verificationNote: "Test both a valid literal and a near-miss value; the latter proves the helper does runtime work rather than asserting a type.",
  practice: "Create a list of valid platform names and parse a string loaded from a saved game. Decide whether to normalize case or reject differently cased values and test that rule."
};
