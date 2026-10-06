export const recipe = {
  slug: "optional-property-patch",
  category: "Application state",
  title: "Distinguish an omitted patch field from clearing a value",
  problem: "A partial update sometimes leaves an old value in place, sometimes erases it with undefined, or cannot express the user's request to clear it.",
  rootCause: "An optional property is an absence contract, not automatically a three-way command. With exactOptionalPropertyTypes, a?: string means the key may be omitted but a present value must be a string; a?: string | undefined explicitly permits undefined. Neither convention explains what clearing means to the domain.",
  solutionCode: `type Game = { id: string; title: string; releaseYear?: number };
type GamePatch = { title?: string; releaseYear?: number | null };

function applyPatch(game: Game, patch: GamePatch): Game {
  let updated = { ...game };
  if (patch.title !== undefined) updated = { ...updated, title: patch.title };
  if (patch.releaseYear === null) {
    const { releaseYear: removed, ...withoutYear } = updated;
    return withoutYear;
  }
  if (patch.releaseYear !== undefined) {
    updated = { ...updated, releaseYear: patch.releaseYear };
  }
  return updated;
}`,
  whyItWorks: "Omitted releaseYear leaves the stored value unchanged, a number sets it, and null explicitly means clear it. The patch type documents those three commands instead of relying on undefined conventions.",
  commonTrap: "Partial<Game> is useful for simple patches, but it does not define whether undefined means absent or clear under every compiler setting. A spread can also overwrite a value with undefined if the patch contract allows it.",
  workedExampleCode: `type RenamePatch = { title?: string };

function rename(game: Game, patch: RenamePatch): Game {
  return patch.title === undefined
    ? game
    : { ...game, title: patch.title };
}

const unchanged = rename(game, {});
const renamed = rename(game, { title: "Tunic" });`,
  workedExampleExplanation: "This API distinguishes omission from an intentional new string. If an empty title is invalid, validate or normalize it before applying the patch rather than treating every falsy value as missing.",
  decisionGuide: "Use optional properties for fields that may be omitted. Define an explicit clearing representation—often null or a tagged command—when callers must remove a value. Validate network patches at runtime because static optional semantics do not validate JSON.",
  edgeCases: [
    "exactOptionalPropertyTypes changes whether a present property may explicitly contain undefined.",
    "A shallow object spread can overwrite existing fields and does not deep-merge nested objects.",
    "An empty patch may be a no-op or an error; choose and test the API behavior.",
    "Null can mean clear only if that meaning is documented; otherwise it may be invalid input."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("patch omission, assignment, and clearing are distinct", () => {
  const game: Game = { id: "g-1", title: "Hades", releaseYear: 2020 };
  assertEquals(applyPatch(game, {}).releaseYear, 2020);
  assertEquals(applyPatch(game, { releaseYear: 2024 }).releaseYear, 2024);
  assertEquals("releaseYear" in applyPatch(game, { releaseYear: null }), false);
});`,
  verificationNote: "Run type checking with the project's exactOptionalPropertyTypes setting and test the runtime meaning of each patch form.",
  practice: "Design a profile patch with optional displayName and a clearable favoritePlatform. Choose how to represent clearing, validate external JSON, and ensure omitted fields preserve existing values."
};
