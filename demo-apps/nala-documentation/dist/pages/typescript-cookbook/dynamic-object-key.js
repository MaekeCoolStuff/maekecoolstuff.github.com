export const recipe = {
  slug: "dynamic-object-key",
  category: "Type design",
  title: "Index objects with keys they actually have",
  problem: "TypeScript rejects labels[field] because field is just a string, even though it contains a valid Game property name.",
  rootCause: "Any string could be a typo or a key that does not exist. An object's key type is narrower than string, so a dynamic lookup needs a value constrained to those keys.",
  solutionCode: `type Game = { id: string; title: string; platform: string };
type GameField = keyof Game;

function readField(game: Game, field: GameField): string {
  return game[field];
}

readField(game, "title");`,
  whyItWorks: `keyof Game creates the union "id" | "title" | "platform". A caller can choose any real field, but a misspelled name is rejected before it reaches the lookup.`,
  commonTrap: "Do not cast the field to keyof Game without checking its source. If it comes from a URL or user input, validate it at runtime first.",
  workedExampleCode: `type GameField = keyof Game;

function gameValue(game: Game, field: GameField): Game[GameField] {
  return game[field];
}`,
  workedExampleExplanation: "The field parameter is limited to keys of Game. Indexed access derives the result type from the property's possible values.",
  decisionGuide: "Use keyof when a key is selected from a known object contract and the key/value relationship should stay checked. If the key comes from a URL or user input, validate it at runtime before indexing.",
  edgeCases: [
    "keyof on an object with an index signature may be broader than a finite literal union.",
    "An optional property read can include undefined even when the key is valid.",
    "A dictionary lookup may be missing; enable noUncheckedIndexedAccess or handle absence explicitly.",
    "A cast to keyof Game does not check an external string."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("field lookup returns the selected property", () => {
  const game = { id: "g-1", title: "Tunic", platform: "PC" };
  assertEquals(readField(game, "title"), "Tunic");
  assertEquals(readField(game, "platform"), "PC");
});`,
  verificationNote: "Invalid keys are best demonstrated with a compile-time negative example or a runtime parser test when the key is external.",
  practice: "Extend the lookup to a Game with numeric hours and a possibly absent releaseYear. Preserve the precise return type, and add a separate validator for keys received from a query parameter."
};
