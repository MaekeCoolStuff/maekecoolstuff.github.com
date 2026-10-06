export const recipe = {
  slug: "generic-function-wrapper",
  category: "Generics and inference",
  title: "Wrap a function without losing its call signature",
  problem: "A logging, timing, or memoization wrapper accepts Function or any, so callers lose parameter checking and the wrapped return type.",
  rootCause: "A wrapper must preserve the relationship between a function's argument tuple and its return type. The broad Function type does not describe a safe call signature, while any disables checking.",
  solutionCode: `function withLogging<Arguments extends unknown[], Result>(
  name: string,
  fn: (...args: Arguments) => Result,
): (...args: Arguments) => Result {
  return (...args) => {
    console.log("Calling " + name);
    return fn(...args);
  };
}

function findGame(id: string, includeArchived: boolean): Game | undefined {
  return games.find((game) => game.id === id);
}

const loggedFindGame = withLogging("findGame", findGame);
const selected = loggedFindGame("g-1", false); // Game | undefined`,
  whyItWorks: "Arguments is inferred as a tuple of the original parameter types, and Result is inferred from the return type. The wrapper accepts exactly the original calls and returns exactly the original result type.",
  commonTrap: "Do not annotate the callback as Function or (...args: any[]) => any. Those types allow invalid calls and erase the useful relationship the wrapper is meant to preserve.",
  workedExampleCode: `function withTiming<Arguments extends unknown[], Result>(
  fn: (...args: Arguments) => Result,
): (...args: Arguments) => Result {
  return (...args) => {
    const start = performance.now();
    try {
      return fn(...args);
    } finally {
      console.log("Elapsed", performance.now() - start);
    }
  };
}

const timedParse = withTiming(parseGameCard);
const game = timedParse(payload);`,
  workedExampleExplanation: "The wrapper preserves the parser's argument and return contract. This timing wrapper measures only synchronous work; if Result is a Promise, the finally block runs before that Promise settles.",
  decisionGuide: "Use this pattern for synchronous wrappers that should preserve a callback's call signature. Async wrappers need a deliberate policy for measuring and forwarding Promise fulfillment, rejection, and cancellation.",
  edgeCases: [
    "The generic wrapper shown does not preserve a function's this parameter; use an explicit this type and call/apply when receiver behavior matters.",
    "A synchronous finally block does not measure the duration of asynchronous work returned as a Promise.",
    "Overloads and generic functions can lose some specialized relationships when captured by a simple callback signature.",
    "Wrappers can alter stack traces, function names, identity, or error behavior; preserve those semantics when callers rely on them."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("wrapper preserves argument and result behavior", () => {
  const add = (left: number, right: number): number => left + right;
  const wrapped = withLogging("add", add);
  assertEquals(wrapped(2, 3), 5);
  // wrapped("2", 3); // Compile-time error: argument contract is preserved.
});`,
  verificationNote: "Run the type check for the negative call and a runtime test for forwarding. Add separate tests for thrown errors and Promise behavior if the wrapper handles those cases.",
  practice: "Write an async timing wrapper that returns Promise<Awaited<Result>> or another clearly documented contract, measures until settlement, rethrows rejection unchanged, and forwards an AbortSignal argument without widening the original parameter tuple."
};
