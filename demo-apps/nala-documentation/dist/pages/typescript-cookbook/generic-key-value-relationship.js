export const recipe = {
  slug: "generic-key-value-relationship",
  category: "Generics and inference",
  title: "Keep a generic key connected to its property value",
  problem: "A helper accepts keyof Game but returns a broad union of all Game property values, so a title lookup can be typed as string | number | GameState.",
  rootCause: "A union of keys tells the compiler which keys are allowed, but the return type must use the specific key parameter to preserve the relationship between the chosen key and that property's value type.",
  solutionCode: `type Game = { id: string; title: string; hours: number };

function getProperty<ObjectType, Key extends keyof ObjectType>(
  object: ObjectType,
  key: Key,
): ObjectType[Key] {
  return object[key];
}

const game: Game = { id: "g-1", title: "Tunic", hours: 9 };
const title = getProperty(game, "title"); // string
const hours = getProperty(game, "hours"); // number`,
  whyItWorks: "Key is inferred from the argument and is constrained to keyof ObjectType. ObjectType[Key] indexes the object type with that same specific key, so the selected property's type flows to the result.",
  commonTrap: "Returning ObjectType[keyof ObjectType] loses the correlation and produces a union of every property's type. A cast to string merely hides that the selected key might not be a string property.",
  workedExampleCode: `function setProperty<ObjectType, Key extends keyof ObjectType>(
  object: ObjectType,
  key: Key,
  value: ObjectType[Key],
): ObjectType {
  return { ...object, [key]: value };
}

const updated = setProperty(game, "hours", 10);
// setProperty(game, "hours", "ten"); // Error`,
  workedExampleExplanation: "The value parameter is indexed by the same Key as the property name. The checker accepts matching pairs and rejects values from another property type.",
  decisionGuide: "Use this pattern for reusable form-field helpers, object selectors, and configuration utilities where callers choose a known key. Use a direct domain function if it expresses the operation more clearly.",
  edgeCases: [
    "An optional property can produce a value type that includes undefined.",
    "A string index signature broadens keyof and may weaken typo detection.",
    "Symbols and numeric keys can also appear in keyof; do not assume every key is a string.",
    "At runtime, a key received from a URL or user must still be validated before indexing."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("property lookup returns the type-associated value", () => {
  const game = { id: "g-1", title: "Tunic", hours: 9 };
  assertEquals(getProperty(game, "title"), "Tunic");
  assertEquals(getProperty(game, "hours"), 9);
});`,
  verificationNote: "The test checks values at runtime; try the commented bad setProperty call to observe the compile-time key/value relationship.",
  practice: "Write updateField for a readonly object that returns a copy with one key changed. Keep the key and value types correlated and decide whether updating a readonly property is allowed by your API."
};
