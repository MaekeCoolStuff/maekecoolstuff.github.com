export const recipe = {
  slug: "generic-constructor-factory",
  category: "Generics and inference",
  title: "Pass a constructor or factory when a generic must create T",
  problem: "TypeScript reports that T only refers to a type when code tries new T() inside a generic repository or cache helper.",
  rootCause: "Generic types are erased at runtime. T describes an instance shape to the checker but is not a JavaScript constructor value that can be called with new.",
  solutionCode: `interface HasId {
  id: string;
}

function createMany<Item>(
  Constructor: new () => Item,
  count: number,
): Item[] {
  return Array.from({ length: count }, () => new Constructor());
}

class DraftGame implements HasId {
  id: string;

  constructor(id = crypto.randomUUID()) {
    this.id = id;
  }
}

const drafts = createMany(DraftGame, 3);`,
  whyItWorks: "The constructor parameter is a runtime value with a construct signature. Item describes the created instances, while the Constructor argument supplies the actual JavaScript operation that creates them.",
  commonTrap: "A constraint such as Item extends HasId only describes instance properties; it does not provide a constructor. Do not cast a type parameter to a constructor or rely on a nonexistent runtime T value.",
  workedExampleCode: `function build<Value>(factory: () => Value): Value {
  return factory();
}

const draft = build(() => ({ id: "draft-1", title: "Untitled" }));`,
  workedExampleExplanation: "A factory is often more flexible than a constructor because it can capture dependencies, choose among implementations, or perform validation before returning the value.",
  decisionGuide: "Accept a constructor when callers should provide a class with a known construct signature. Accept a factory when creation needs arguments, dependencies, branching, or non-class values. Keep the returned instance type generic.",
  edgeCases: [
    "Constructors with required parameters need a matching argument tuple in the construct signature.",
    "Abstract classes cannot be instantiated through a concrete new signature.",
    "A factory may throw or return a Promise; reflect that behavior in the function signature.",
    "Runtime validation is still needed if the constructor or factory consumes untrusted input."
  ],
  verificationCode: `type Constructor<Arguments extends unknown[], Instance> =
  new (...args: Arguments) => Instance;

function construct<Arguments extends unknown[], Instance>(
  Type: Constructor<Arguments, Instance>,
  ...args: Arguments
): Instance {
  return new Type(...args);
}

const draft = construct(DraftGame, "draft-2");`,
  verificationNote: "The argument tuple and constructed instance stay connected. Adjust DraftGame's constructor to match the example when using this generalized version.",
  practice: "Create a generic repository factory that accepts a constructor requiring a GameId and returns that instance type. Then change it to accept a factory so the implementation can inject a clock or ID generator."
};
