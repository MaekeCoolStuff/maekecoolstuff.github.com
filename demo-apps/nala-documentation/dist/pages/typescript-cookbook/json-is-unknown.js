export const recipe = {
  slug: "json-is-unknown",
  category: "Data boundaries",
  title: "JSON is not your domain type yet",
  problem: "The compiler accepts a server response as Game, but the page later crashes because the server omitted title or sent it as a number.",
  rootCause: "A TypeScript annotation or generic on response.json() does not inspect bytes from the network. JSON parsing produces runtime data; it must be validated before the application relies on its shape.",
  solutionCode: `type GameCard = { id: string; title: string };

function isGameCard(value: unknown): value is GameCard {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return typeof record.id === "string" && typeof record.title === "string";
}

const payload: unknown = await response.json();
if (!isGameCard(payload)) throw new Error("Invalid game data");
showGame(payload);`,
  whyItWorks: "The parser starts from unknown and checks each field at runtime. Its type predicate lets the checker treat the value as GameCard only after all required checks pass.",
  commonTrap: "Writing await response.json() as GameCard makes the error disappear without checking the server. Assertions are not parsers and are unsafe at external boundaries.",
  workedExampleCode: `function hasStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isGameCard(value: unknown): value is GameCard {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return typeof record.id === "string" &&
    typeof record.title === "string" &&
    hasStringArray(record.platforms);
}`,
  workedExampleExplanation: "Array.isArray proves the outer value is an array, and every verifies each entry. The full guard validates all three fields before trusting the object.",
  decisionGuide: "Start every external JSON boundary as unknown, validate the fields your application depends on, and return a trusted domain object. Use a parser that reports structured issues when users need field-level feedback or several errors at once.",
  edgeCases: [
    "JSON.parse can throw before validation begins.",
    "typeof null is object, and arrays also satisfy broad object checks.",
    "A type assertion or generic response.json<Game>() does not inspect the payload.",
    "Unexpected fields may be accepted, stripped, or rejected; choose a policy for your API versioning needs.",
    "Structural validation does not enforce cross-record rules such as unique IDs unless the parser checks them."
  ],
  verificationCode: `import { assertEquals, assertThrows } from "jsr:@std/assert";

Deno.test("game card parser accepts valid data and rejects invalid fields", () => {
  assertEquals(isGameCard({ id: "g-1", title: "Tunic" }), true);
  assertEquals(isGameCard({ id: 3, title: "Tunic" }), false);
  assertEquals(isGameCard(null), false);
  assertThrows(() => JSON.parse("not JSON"));
});`,
  verificationNote: "Test the parser separately from fetch so malformed payload behavior is deterministic and does not require a live server.",
  practice: "Extend GameCard with platforms and a PlayState union. Validate every branch, reject unknown status tags, and decide whether invalid extra fields are ignored or rejected."
};
