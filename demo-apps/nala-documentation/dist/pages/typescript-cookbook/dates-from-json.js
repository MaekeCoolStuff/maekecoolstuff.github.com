export const recipe = {
  slug: "dates-from-json",
  category: "Data boundaries",
  title: "A JSON date is a string, not a Date",
  problem: "A saved or fetched completion date has no toLocaleDateString method, despite its TypeScript field being named completedOn.",
  rootCause: "JSON has no Date value. JSON.stringify usually serializes a Date as text, and JSON.parse returns that text as a string. A declared Date field cannot change the runtime value.",
  solutionCode: `type SavedGame = { completedOn?: string };

function parseCompletedOn(value: string | undefined): Date | undefined {
  if (value === undefined) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid completion date");
  }
  return date;
}

const completedOn = parseCompletedOn(saved.completedOn);`,
  whyItWorks: "The stored contract represents the serializable value as a string. Conversion happens explicitly at the boundary, and getTime detects dates that the runtime could not parse.",
  commonTrap: "Do not write JSON.parse(text) as Game and expect nested date strings to become Date instances. JSON parsing never revives dates automatically.",
  workedExampleCode: `const stored = date.toISOString();
const restored = new Date(stored);

if (Number.isNaN(restored.getTime())) {
  throw new Error("Invalid stored date");
}`,
  workedExampleExplanation: "ISO text is portable JSON data. Constructing a Date is the explicit conversion; validating its timestamp catches malformed stored strings.",
  decisionGuide: "Use Date for an instant on the timeline, such as when a request completed. For a calendar date such as a release day, consider storing a validated YYYY-MM-DD string instead so timezone conversion does not move the day.",
  edgeCases: [
    "JSON.stringify serializes Date to text; JSON.parse does not recreate a Date instance.",
    "Invalid date text can create an Invalid Date object instead of throwing, so check getTime().",
    "Date-only strings and timestamps with offsets have different timezone semantics.",
    "Locale formatting depends on the user's environment; do not persist a display-formatted date as canonical data."
  ],
  verificationCode: `import { assertEquals, assertThrows } from "jsr:@std/assert";

Deno.test("stored timestamps are parsed and validated", () => {
  assertEquals(parseCompletedOn(undefined), undefined);
  assertEquals(parseCompletedOn("2025-01-02T03:04:05.000Z")?.toISOString(),
    "2025-01-02T03:04:05.000Z");
  assertThrows(() => parseCompletedOn("not-a-date"));
});`,
  verificationNote: "Inject or fix timezone assumptions in tests; avoid asserting a local display string when the contract is an instant.",
  practice: "Model both a completion timestamp and a release calendar date. Decide which one needs Date and which should remain a validated date-only string, then test serialization and parsing across the boundary."
};
