export const recipe = {
  slug: "object-literal-widening",
  category: "Type design",
  title: "Keep discriminant literals narrow in object values",
  problem: "An object initialized with status: 'backlog' cannot be passed to a function expecting PlayState because the nested status widened to string.",
  rootCause: "A const binding prevents reassignment of the binding, but nested properties of a mutable object can still change. TypeScript often widens those properties so later assignments remain possible.",
  solutionCode: `type PlayState =
  | { status: "backlog" }
  | { status: "playing"; hoursPlayed: number };

const game = {
  playState: { status: "backlog" as const },
};

function label(state: PlayState): string {
  return state.status === "backlog" ? "Backlog" : "Playing";
}

label(game.playState);`,
  whyItWorks: "The as const assertion preserves the nested literal type as backlog instead of widening it to string. A contextual annotation or satisfies check can also validate a complete object against its intended contract.",
  commonTrap: "Applying as const to the whole object makes nested arrays and properties readonly. That is useful for constants but can conflict with APIs that need mutable arrays or writable properties.",
  workedExampleCode: `type GameAction =
  | { type: "renamed"; title: string }
  | { type: "removed"; gameId: string };

const action = {
  type: "renamed",
  title: "Tunic",
} satisfies GameAction;`,
  workedExampleExplanation: "satisfies checks that the object is a valid action while keeping the useful literal information for later narrowing. It performs no runtime validation.",
  decisionGuide: "Use an explicit type annotation when a variable should have a broader writable contract. Use satisfies when checking a source literal while retaining its narrower inferred details. Use as const when literal values and readonly structure are both intended.",
  edgeCases: [
    "const prevents rebinding the variable, not mutating its object properties.",
    "A literal may widen differently in a direct variable, nested property, function argument, or satisfies context.",
    "A type assertion can force an incorrect literal without checking the whole contract.",
    "Readonly tuples and arrays from as const may not be assignable to mutable collection parameters."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("a literal action keeps its discriminant at runtime", () => {
  assertEquals(action.type, "renamed");
  assertEquals(label(game.playState), "Backlog");
});`,
  verificationNote: "The runtime test checks the values. Try removing as const or the contextual satisfies contract and inspect the compile-time inferred type separately.",
  practice: "Create a configuration object for a Game Shelf action menu. Preserve exact action names for exhaustive handling, but keep mutable user-entered text typed as string."
};
