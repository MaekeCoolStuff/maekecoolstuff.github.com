export const recipe = {
  slug: "object-keys-are-strings",
  category: "Type design",
  title: "Object.keys returns strings, not keyof T",
  problem: "A loop over Object.keys(settings) cannot use each key to index settings without a type error, even though the object type lists those keys.",
  rootCause: "TypeScript object types are open and structural: a value typed as Settings may have additional runtime properties. Object.keys returns the actual enumerable string keys, so the library correctly returns string[] rather than claiming every runtime key is keyof Settings.",
  solutionCode: `type Game = { id: string; title: string; hours: number };

const visibleFields = ["title", "hours"] as const satisfies readonly (keyof Game)[];
const game: Game = { id: "g-1", title: "Tunic", hours: 9 };

for (const key of visibleFields) {
  console.log(key, game[key]);
}`,
  whyItWorks: "The authored tuple is checked against Game's keys while preserving its literal members. Iterating that tuple gives a key union safe for indexing.",
  commonTrap: "Casting Object.keys(value) to Array<keyof typeof value> is not generally sound: a structurally compatible runtime value can contain extra own properties that are absent from its declared type.",
  workedExampleCode: `function logOwnEntries(value: Record<string, unknown>): void {
  for (const key of Object.keys(value)) {
    if (!Object.hasOwn(value, key)) continue;
    console.log(key, value[key]); // value remains unknown
  }
}`,
  workedExampleExplanation: "For genuinely dynamic records, use string keys and keep the values unknown until validated. For a fixed schema, define an explicit key tuple or handle known properties directly.",
  decisionGuide: "Use a literal key list for application-defined fields, satisfying it against keyof T. Use Object.keys with string keys for open-ended records, and validate values before domain use. Do not pretend runtime keys are exact just to silence indexing errors.",
  edgeCases: [
    "Object.keys includes own enumerable string keys, not symbol keys or inherited properties.",
    "Numeric property names are returned as strings.",
    "Prototype-based and class instances may have useful members that Object.keys does not enumerate.",
    "Unknown dictionary values should remain unknown until checked, even after the key is confirmed."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("the authored field tuple indexes only known Game fields", () => {
  const game: Game = { id: "g-1", title: "Tunic", hours: 9 };
  assertEquals(visibleFields.map((key) => game[key]), ["Tunic", 9]);
});`,
  verificationNote: "The satisfies clause checks every listed key at compile time. Runtime tests check the values; try misspelling a tuple key to see the static failure.",
  practice: "Build a settings display that lists only theme and pageSize, even when the runtime object has extra fields. Then write a separate renderer for arbitrary Record<string, unknown> data that safely handles each unknown value."
};
