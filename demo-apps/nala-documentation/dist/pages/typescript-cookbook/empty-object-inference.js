export const recipe = {
  slug: "empty-object-inference",
  category: "Type design",
  title: "Give an initially empty object its intended shape",
  problem: "An empty object used as evolving application state rejects later properties or forces a cast when a field is assigned.",
  rootCause: "The literal {} contains no evidence about future fields. TypeScript does not infer the shape you plan to add later, and widening it to any disables useful checking.",
  solutionCode: `type SearchState = {
  query: string;
  selectedGameId?: string;
};

const searchState: SearchState = {
  query: "",
};

searchState.query = "Celeste";
searchState.selectedGameId = "g-1";`,
  whyItWorks: "The annotation declares the state contract before updates occur. Required fields have initial values, while selectedGameId is intentionally optional.",
  commonTrap: "Avoid `const state = {} as SearchState` as an initialization shortcut. It permits a value that violates required fields and postpones the failure until runtime.",
  workedExampleCode: `type Counters = Record<string, number>;
const playCounts: Counters = {};
playCounts["g-1"] = 3;

const initialShelf = {
  games: [] as Game[],
  selectedGameId: undefined as string | undefined,
};`,
  workedExampleExplanation: "A record annotation is appropriate for an open-ended dictionary. For a known object contract, prefer a named shape with required and optional properties rather than an unconstrained empty object.",
  decisionGuide: "Annotate empty state when its shape is known. Use Record<K, V> for an intentionally dynamic key space, and a named object type for a fixed domain model. Use satisfies for checking a fully initialized source literal while retaining useful narrow types.",
  edgeCases: [
    "An optional property differs from a required property whose value happens to be undefined.",
    "Record<string, Value> does not prove every possible string key is present.",
    "An empty array nested inside an object can also need an explicit element type.",
    "With exactOptionalPropertyTypes enabled, explicitly assigning undefined may differ from omitting the property."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("initial state exposes its intended fields", () => {
  const state: SearchState = { query: "" };
  state.query = "Hades";
  assertEquals(state.query, "Hades");
  assertEquals(state.selectedGameId, undefined);
});`,
  verificationNote: "The test checks runtime updates; the annotation and project type check ensure required fields and writes are valid at compile time.",
  practice: "Model a form draft with required title text, a platform list that starts empty, and an optional selected ID. Initialize each field intentionally and avoid any or assertions."
};
