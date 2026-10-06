export const recipe = {
  slug: "generic-value-must-come-from-input",
  category: "Generics and inference",
  title: "A generic function cannot invent an arbitrary T",
  problem: "A function declared as makeDefault<T>(): T fails when it returns a string or empty object, even when one caller wants that type.",
  rootCause: "The caller chooses T. The function must be correct for every allowed choice, and a generic type parameter has no runtime value or default instance the implementation can construct.",
  solutionCode: `function withFallback<Value>(fallback: Value): Value {
  return fallback;
}

const title = withFallback<string>("Untitled");
const hours = withFallback<number>(0);

function loadOrFallback<Value>(
  load: () => Promise<Value>,
  fallback: Value,
): Promise<Value> {
  return load().catch(() => fallback);
}`,
  whyItWorks: "The caller supplies an actual value of Value, so the implementation can return that value while preserving the chosen type. Generic parameters describe relationships; they do not create values at runtime.",
  commonTrap: "Do not cast a placeholder such as {} as Value. That lets the function claim it can return any type without constructing or validating one.",
  workedExampleCode: `type Game = { id: string; title: string };

function emptyPage<Item>(): readonly Item[] {
  return [];
}

const noGames = emptyPage<Game>();`,
  workedExampleExplanation: "An empty array is valid for every element type, so this particular implementation can return it. A function that must create one Item needs a value, factory, or constructor supplied from outside.",
  decisionGuide: "If a result can be derived from input, relate it to that input with a generic. If the function must create a value of T, accept a fallback or factory that returns T, or accept a constructor when construction semantics are appropriate.",
  edgeCases: [
    "A constraint such as T extends Game does not provide a Game instance to return.",
    "Some values such as [] can be constructed without knowing their element type; arbitrary object instances cannot.",
    "A generic default type argument chooses a type, not a runtime default value.",
    "Returning undefined requires the signature to include undefined rather than pretending it is T."
  ],
  verificationCode: `function makeWith<Value>(factory: () => Value): Value {
  return factory();
}

const placeholderGame = makeWith(() => ({ id: "draft", title: "Untitled" }));`,
  verificationNote: "The factory is a runtime value that can construct Value. Type-check a call for two unrelated types to confirm the function does not assume one fixed representation.",
  practice: "Implement a generic cache lookup that accepts a key and a factory for a missing value. Decide whether the factory runs eagerly or only on a cache miss, and preserve the same Value type on both paths."
};
