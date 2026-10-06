export const recipe = {
  slug: "generic-constraint-preserves-type",
  category: "Generics and inference",
  title: "Constrain a generic without discarding its extra fields",
  problem: "A lookup needs an id property, but typing every item only as { id: string } makes the returned game lose title, platforms, and play state.",
  rootCause: "A concrete base shape guarantees id but forgets which more specific type the caller supplied. A generic type parameter constrained by that shape lets the implementation use id while preserving the caller's full item type.",
  solutionCode: `type Identified = { id: string };

type Game = Identified & {
  title: string;
  platforms: readonly string[];
};

function findById<Item extends Identified>(
  items: readonly Item[],
  id: string,
): Item | undefined {
  return items.find((item) => item.id === id);
}

const games: Game[] = [];
const selected = findById(games, "g-1"); // Game | undefined`,
  whyItWorks: "Item extends Identified gives the function permission to read id, while the return type remains Item. Inference chooses Game from the input array, so callers keep access to every Game field after checking for undefined.",
  commonTrap: "If the function accepts Identified[] and returns Identified, the call is valid but information is lost. Do not recover it with `as Game`; express the input/output relationship in the generic signature.",
  workedExampleCode: `type HasTitle = { title: string };

function firstMatching<Item extends HasTitle>(
  items: readonly Item[],
  predicate: (item: Item) => boolean,
): Item | undefined {
  return items.find(predicate);
}

const found = firstMatching(games, (game) => game.platforms.includes("PC"));`,
  workedExampleExplanation: "The constraint gives the implementation and predicate the title capability, but Item is still inferred as Game, so the result preserves the platform and play-state details too.",
  decisionGuide: "Use a constraint when an algorithm needs a small shared capability such as id, title, or length, but callers need their original subtype returned. Prefer a concrete base type when callers genuinely need only that base contract.",
  edgeCases: [
    "A string ID does not guarantee uniqueness; enforce that domain invariant separately.",
    "The lookup may fail, so retain undefined in the return type.",
    "Do not constrain to an entire application entity if the algorithm only needs one property.",
    "A cast at the call site can hide that the generic has already erased useful type information."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("findById preserves the caller's Game type", () => {
  const games: Game[] = [{ id: "g-1", title: "Tunic", platforms: ["PC"] }];
  const selected = findById(games, "g-1");
  assertEquals(selected?.platforms, ["PC"]);
});`,
  verificationNote: "The test checks runtime lookup behavior; the editor/type checker verifies selected is Game | undefined and preserves its fields.",
  practice: "Write a generic groupById helper that accepts any item with a string id and returns a Map whose values keep the original Item type. Decide how duplicate IDs are handled and test that policy."
};
