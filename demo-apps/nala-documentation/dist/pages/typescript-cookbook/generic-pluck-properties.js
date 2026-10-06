export const recipe = {
  slug: "generic-pluck-properties",
  category: "Generics and inference",
  title: "Project selected properties without losing their types",
  problem: "A reusable helper maps objects to one selected field, but its result becomes unknown[], any[], or a union broader than the selected property.",
  rootCause: "The selected key and result element type must share one generic parameter. keyof constrains the key, and indexed access T[Key] derives the corresponding value type.",
  solutionCode: `function pluck<Value, Key extends keyof Value>(
  items: readonly Value[],
  key: Key,
): Array<Value[Key]> {
  return items.map((item) => item[key]);
}

type Game = { id: string; title: string; hours: number };
const games: Game[] = [];

const titles = pluck(games, "title"); // string[]
const hours = pluck(games, "hours"); // number[]`,
  whyItWorks: "Value describes each item, Key is restricted to that value's keys, and Value[Key] links the result element to the chosen property. Inference chooses both parameters from the arguments.",
  commonTrap: "Returning Value[keyof Value][] loses the specific key/result relationship and gives an array containing the union of all property types. Avoid casting a broad result back to string[].",
  workedExampleCode: `const ids = pluck(games, "id");
const titles = pluck(games, "title");
// pluck(games, "platform"); // Error: platform is not a Game key`,
  workedExampleExplanation: "The key argument determines each result's element type. An invalid key is rejected at the call site rather than failing during property access.",
  decisionGuide: "Use a generic projection helper when multiple call sites select different known fields and the relationship is useful. For a single business operation, a named selector such as gameTitles may be clearer and easier to evolve.",
  edgeCases: [
    "Optional properties produce result elements that may include undefined.",
    "A union key deliberately produces a union of the selected property value types.",
    "The helper returns a new array but retains object property values by reference when those values are objects.",
    "External strings cannot be used as Key safely until validated against the allowed key set."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("pluck preserves the selected property values", () => {
  const games = [
    { id: "g-1", title: "Celeste", hours: 12 },
    { id: "g-2", title: "Hades", hours: 31 },
  ];
  assertEquals(pluck(games, "title"), ["Celeste", "Hades"]);
  assertEquals(pluck(games, "hours"), [12, 31]);
});`,
  verificationNote: "The runtime assertions check projection behavior; assign results to string[] and number[] in a compile-time example to confirm inference.",
  practice: "Extend pluck to accept a readonly tuple of keys and return a compact summary object. Decide how optional selected fields should appear and test the key/value types."
};
