export const recipe = {
  slug: "type-only-import",
  category: "Modules and APIs",
  title: "A type import should not become a runtime dependency",
  problem: "A browser build tries to load a module that only exports an interface, or a circular dependency appears even though one file only needs a type.",
  rootCause: "Interfaces and type aliases disappear at runtime. A normal import can look like a JavaScript value dependency to tools and readers even though it is only used for type checking.",
  solutionCode: `import type { Game } from "./game.js";
import { findGame } from "./game-search.js";

export function openGame(game: Game): void {
  findGame(game.id);
}`,
  whyItWorks: "import type clearly marks a compile-time-only dependency. It is erased from emitted JavaScript, while findGame remains a runtime import because the code calls it.",
  commonTrap: "Do not use import type for something the code calls or constructs at runtime. Keep values and types distinct; classes and functions can have both a type-side and value-side role.",
  workedExampleCode: `import { createGame, type Game } from "./game.js";

const game: Game = createGame("Celeste");`,
  workedExampleExplanation: "The type-only specifier is erased, while createGame remains available in the generated JavaScript.",
  decisionGuide: "Use import type when a dependency is needed only for static contracts. Keep a value import for anything called, constructed, or read at runtime. Inline `type` specifiers can separate both uses in one import declaration.",
  edgeCases: [
    "Classes have both a runtime value and an instance type; import the value when constructing or extending one.",
    "A type-only import does not execute module registration or other side effects.",
    "Compiler and runtime module rules differ; follow the repository's explicit import convention.",
    "Type-only syntax does not fix a circular runtime dependency if another value import still creates the cycle."
  ],
  verificationCode: `import { createGame, type Game } from "./game.js";

const game: Game = createGame("Celeste");
console.log(game.title);`,
  verificationNote: "Run the project type check and inspect the emitted JavaScript when the runtime import graph matters: Game should be erased while createGame remains.",
  practice: "Split a module's imports into runtime values and types. Remove any type-only dependency that currently causes unnecessary module initialization, then check that required registration side effects still run through an explicit value import."
};
