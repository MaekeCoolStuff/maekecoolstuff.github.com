export const recipe = {
  slug: "nullish-defaults",
  category: "Values and collections",
  title: "Choose the right default for missing values",
  problem: "A user setting of 0 or an empty string is unexpectedly replaced by the default value.",
  rootCause: "The logical OR operator returns the right side for every falsy value, including 0, false, and empty text. Often the real intent is to default only when a value is absent (null or undefined).",
  solutionCode: `type ShelfSettings = { pageSize?: number };

function visiblePageSize(settings: ShelfSettings): number {
  return settings.pageSize ?? 20;
}

visiblePageSize({ pageSize: 0 }); // 0`,
  whyItWorks: "Nullish coalescing uses the fallback only for null or undefined. A valid zero stays zero, while an omitted pageSize gets the default.",
  commonTrap: "Do not mechanically replace every || with ??. If an empty string really means 'use the fallback' in your domain, OR may be the correct rule. Decide which values mean missing.",
  workedExampleCode: `function labelOrDefault(label: string | undefined): string {
  return label ?? "Untitled";
}`,
  workedExampleExplanation: "An empty string is not nullish, so it remains empty. Only undefined triggers the default.",
  decisionGuide: "Use ?? when only absent values should trigger a fallback. Use || when every falsy value, including zero or empty text, truly means 'not supplied' in the domain. Write the condition that matches the product rule.",
  edgeCases: [
    "Falsy values include 0, false, NaN, and the empty string; all are preserved by ??.",
    "Null and undefined both trigger ??; use an explicit check if they have different meanings.",
    "Optional chaining can produce undefined, which may then trigger a nullish fallback.",
    "Do not default malformed external values before validating them if the distinction matters."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("nullish defaults preserve valid zero", () => {
  assertEquals(visiblePageSize({ pageSize: 0 }), 0);
  assertEquals(visiblePageSize({}), 20);
});`,
  verificationNote: "Test both an absent setting and each falsey value your domain accepts so a later operator change cannot silently alter behavior.",
  practice: "Give a filter label a fallback only when it is null or undefined, but treat an empty string as an intentional blank. Then compare the behavior with a count field where zero is valid."
};
