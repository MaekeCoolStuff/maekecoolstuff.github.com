export const recipe = {
  slug: "empty-array-inference",
  category: "Values and collections",
  title: "Give an empty collection its element type",
  problem: "An initially empty list rejects a Game later, or becomes an overly broad any array depending on compiler settings and where it was created.",
  rootCause: "An empty array contains no examples from which TypeScript can infer its intended element type. Its contextual inference can also differ between declarations and object properties.",
  solutionCode: `type Game = { id: string; title: string };

const wishlist: Game[] = [];
const initialState: { games: Game[] } = { games: [] };

wishlist.push({ id: "g-1", title: "Hades" });`,
  whyItWorks: "The annotation tells TypeScript the intended element shape before the first item exists. Future writes and reads are then checked consistently.",
  commonTrap: "Avoid any[] as a workaround. It accepts every value and discards the protection the collection type is meant to provide.",
  workedExampleCode: `type Platform = "PC" | "Switch";
const platforms: Platform[] = [];`,
  workedExampleExplanation: "The annotation gives the empty collection its domain before values are pushed into it.",
  decisionGuide: "Annotate an empty collection at the boundary where its intended element type is known, especially for component state, object properties, and values returned from a function before items are added.",
  edgeCases: [
    "Inference for [] can differ between a local variable, an object property, and a generic call context.",
    "any[] suppresses checks for later pushes and reads; do not use it to get past inference.",
    "A readonly collection may be appropriate when a consumer should read but not mutate the list.",
    "An array type describes elements, not non-emptiness; an empty typed array is still valid."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("an initially empty game list accepts games and stays typed", () => {
  const games: Game[] = [];
  games.push({ id: "g-1", title: "Hades" });
  assertEquals(games[0]?.title, "Hades");
});`,
  verificationNote: "Run the snippet with the same strict compiler options as the project so tests exercise the inference behavior you depend on.",
  practice: "Create an initially empty map from GameId to Game, add one game, and write a lookup that correctly handles a missing key without using any or a non-null assertion."
};
