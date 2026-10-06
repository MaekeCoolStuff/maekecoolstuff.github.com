export const recipe = {
  slug: "generic-inference-and-type-arguments",
  category: "Generics and inference",
  title: "Let generic arguments infer from inputs when possible",
  problem: "A generic helper returns unknown or reports that its type argument cannot be inferred, even though the call already supplies values that reveal the type.",
  rootCause: "Type parameters are inferred from positions where they occur. If there is no input containing a type parameter, or several inputs provide conflicting evidence, inference may need an explicit type argument or a clearer signature.",
  solutionCode: `function makePair<Left, Right>(left: Left, right: Right): [Left, Right] {
  return [left, right];
}

const pair = makePair("Celeste", 12); // [string, number]

function emptyList<Item>(): Item[] {
  return [];
}

const games = emptyList<Game>(); // No value exists to infer Item from.`,
  whyItWorks: "The pair inputs provide inference candidates for Left and Right. emptyList has no type-bearing input, so the caller supplies Item explicitly when it knows which list it needs.",
  commonTrap: "Do not add explicit type arguments to every call when inference already preserves the desired type. Conversely, do not use any just because a generic function has no inference source.",
  workedExampleCode: `type Page<Item, Cursor = string> = {
  items: readonly Item[];
  nextCursor?: Cursor;
};

const firstPage: Page<Game> = { items: games };
const numericPage: Page<Game, number> = {
  items: games,
  nextCursor: 2,
};`,
  workedExampleExplanation: "The default cursor type is used when the second type argument is omitted. A caller with numeric cursors can specify it without changing the item relationship.",
  decisionGuide: "Prefer inferred arguments for normal calls; add explicit arguments when inference has no evidence, when widening is intentional, or when an API's type parameter cannot be inferred from its parameters. A default type argument is useful when one common type is a reasonable default.",
  edgeCases: [
    "An empty array or null-like input often provides too little evidence for a useful generic type.",
    "Multiple arguments can infer a union or a broader common type rather than one literal type.",
    "Type parameter defaults must follow required type parameters and are used only when omitted.",
    "If callers must repeatedly write the same type argument, the parameter may belong on a containing generic type instead."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("generic pair keeps the input relationships", () => {
  const pair = makePair("Tunic", 9);
  assertEquals(pair, ["Tunic", 9]);
});`,
  verificationNote: "The runtime assertion checks the pair values; hover pair or assign its positions to string and number variables to inspect inferred types.",
  practice: "Implement emptyResult<Value>() returning a discriminated success result with no inputs. Call it with an explicit Game type, then redesign it to accept an input that lets TypeScript infer Value instead."
};
