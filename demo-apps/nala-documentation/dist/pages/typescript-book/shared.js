import { html } from "../../../../../vendor/components/dist/index.js";
import { renderCodeExample } from "../code-example.js";
export { renderCodeExample };
export function renderPartOneCodeExample(source) {
  const lines = source.trim().split(/\r?\n/);
  const indentation = lines.slice(1).filter((line)=>line.trim() !== "").map((line)=>line.match(/^[ \t]*/)?.[0].length ?? 0);
  const commonIndent = indentation.length > 0 ? Math.min(...indentation) : 0;
  const normalized = lines.map((line, index)=>index === 0 || line.trim() === "" ? line : line.slice(commonIndent)).join("\n");
  return renderCodeExample(normalized);
}
export const firstProgram = `const gameTitle: string = "Sea of Stars";
const hoursPlayed: number = 18;

function describeGame(title: string, hours: number): string {
  return title + " has " + hours + " hours played.";
}

console.log(describeGame(gameTitle, hoursPlayed));`;
export const javascriptFoundations = `const title = "Hollow Knight";
let hoursPlayed = 0;

if (hoursPlayed === 0) {
  console.log(title + " is still in the backlog.");
}

for (const platform of ["PC", "Nintendo Switch"]) {
  console.log(title + " is available on " + platform);
}`;
export const functionExamples = `function formatPlayTime(hours: number, label = "hours"): string {
  return hours + " " + label;
}

function findGame(title: string, games: string[]): string | undefined {
  return games.find((game) => game === title);
}

const result = findGame("Celeste", ["Celeste", "Hades"]);`;
export const objectAndArrayExamples = `type Game = {
  id: string;
  title: string;
  platform: string;
  hoursPlayed: number;
};

const collection: Game[] = [
  { id: "g-1", title: "Celeste", platform: "PC", hoursPlayed: 12 },
  { id: "g-2", title: "Hades", platform: "Switch", hoursPlayed: 31 },
];

const titles = collection.map((game) => game.title);`;
export const moduleExamples = `// game.ts
export type Game = {
  id: string;
  title: string;
};

export function gameLabel(game: Game): string {
  return game.title;
}

// collection.ts
import { gameLabel, type Game } from "./game.js";

export const games: Game[] = [
  { id: "g-1", title: "Sea of Stars" },
];

console.log(gameLabel(games[0]));`;
export function renderWorkedExample(example) {
  return html`
    <aside class="learning-step">
      <h3>Worked example</h3>
      ${example}
    </aside>
  `;
}
