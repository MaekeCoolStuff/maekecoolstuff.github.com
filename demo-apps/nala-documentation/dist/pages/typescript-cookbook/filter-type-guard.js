export const recipe = {
  slug: "filter-type-guard",
  category: "Values and collections",
  title: "Narrow array members with a type predicate",
  problem: "Filtering missing or mixed values removes them at runtime, but TypeScript still sees the result as an array containing undefined or unrelated union members.",
  rootCause: "Array.filter has an overload that narrows when its callback returns a type predicate. A callback that merely returns boolean describes selection behavior, but does not necessarily tell the checker which subtype remains.",
  solutionCode: `type Game = { id: string; title: string };

const fetched: Array<Game | undefined> = [
  { id: "g-1", title: "Celeste" },
  undefined,
];

const games = fetched.filter((game): game is Game => game !== undefined);
// games is Game[]`,
  whyItWorks: "The predicate game is Game tells filter that true means the value is a Game. The runtime comparison is the evidence that justifies the narrower output type.",
  commonTrap: "filter(Boolean) is not a general null-removal helper: it can remove valid 0, false, and empty-string values, and it does not express which union member remains.",
  workedExampleCode: `type SearchResult =
  | { kind: "game"; game: Game }
  | { kind: "message"; text: string };

const gameResults = results.filter(
  (result): result is Extract<SearchResult, { kind: "game" }> =>
    result.kind === "game",
);`,
  workedExampleExplanation: "The discriminant check proves which union member remains. Extract names that member's type so consumers retain its game property without assertions.",
  decisionGuide: "Use a type-predicate callback when filtering a union to one known member or removing a well-defined absent value. Use an ordinary boolean predicate when the element type stays the same and only the set of values changes.",
  edgeCases: [
    "A predicate can lie; TypeScript checks its syntax but not that its runtime test proves the claimed type.",
    "Filtering removes elements from a new array and does not mutate the source array.",
    "A truthiness predicate removes all falsy values, which may include valid domain values.",
    "Use a named predicate when the same narrowing rule is reused in several call sites."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("filter removes missing games and keeps valid entries", () => {
  const input: Array<Game | undefined> = [
    { id: "g-1", title: "Celeste" },
    undefined,
  ];
  const games = input.filter((game): game is Game => game !== undefined);
  assertEquals(games.map((game) => game.id), ["g-1"]);
  assertEquals(input.length, 2);
});`,
  verificationNote: "The type check verifies the narrowed result element type; the test verifies the runtime filter and that the source array was not changed.",
  practice: "Filter a readonly list of SearchResult to only game results. Give the callback a type predicate, then access game.title without casting and test the message variant is excluded."
};
