export const recipe = {
  slug: "generic-filter-defined",
  category: "Generics and inference",
  title: "Write a reusable generic guard for nullish collection items",
  problem: "filter(Boolean) seems to remove undefined values, but TypeScript does not reliably narrow the resulting array and the check also discards valid falsy data.",
  rootCause: "Boolean converts any value to truthiness. That is not the same contract as excluding only null and undefined, and an ordinary boolean callback does not always communicate the remaining subtype to filter.",
  solutionCode: `function isDefined<Value>(
  value: Value,
): value is NonNullable<Value> {
  return value !== null && value !== undefined;
}

const foundGames: Array<Game | undefined> = [
  findGame("g-1"),
  findGame("g-2"),
];

const games = foundGames.filter(isDefined); // Game[]`,
  whyItWorks: "The generic predicate accepts each member type, and NonNullable<Value> removes only null and undefined. The type predicate lets filter construct an array of the remaining values.",
  commonTrap: "filter(Boolean) removes 0, false, and empty strings along with nullish values. Do not use it on collections where those are valid values or assume it provides the intended narrowing.",
  workedExampleCode: `const ratings: Array<number | undefined> = [0, 8, undefined, 10];
const presentRatings = ratings.filter(isDefined);
// number[] containing 0, 8, and 10`,
  workedExampleExplanation: "The zero rating is preserved because the predicate checks absence directly rather than truthiness. The result is still a new array; the source list is unchanged.",
  decisionGuide: "Use a reusable type guard when many collections need to exclude only null and undefined. Use a domain-specific predicate when filtering on business meaning such as positive ratings or completed games.",
  edgeCases: [
    "NonNullable removes null and undefined, not other invalid domain values such as NaN or empty text.",
    "The predicate must match its declared claim; an incorrect `value is ...` signature can mislead all callers.",
    "filter preserves order and does not mutate the input array.",
    "If null means an intentional state distinct from undefined, this helper discards both and may be inappropriate."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("isDefined removes nullish values but preserves falsy values", () => {
  assertEquals([0, undefined, 2].filter(isDefined), [0, 2]);
  assertEquals(["", null, "game"].filter(isDefined), ["", "game"]);
});`,
  verificationNote: "The type checker confirms the filtered element type; these assertions check that zero and empty text survive at runtime.",
  practice: "Parse optional release years from several records and filter missing years with isDefined. Then write a separate predicate for positive release years so its narrower domain rule is explicit."
};
