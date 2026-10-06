export const recipe = {
  slug: "catch-unknown",
  category: "Failures and async work",
  title: "A caught error is unknown",
  problem: "TypeScript will not let you read error.message inside catch, even though most thrown values you have seen are Error objects.",
  rootCause: "JavaScript allows throwing any value: an Error, a string, or an arbitrary object. In strict TypeScript, a caught value is unknown until your code establishes what it is.",
  solutionCode: `try {
  await loadCollection();
} catch (error: unknown) {
  const message = error instanceof Error
    ? error.message
    : "An unexpected value was thrown";

  showError(message);
}`,
  whyItWorks: "The instanceof check distinguishes Error objects from all other possible thrown values. The fallback keeps error reporting safe even when a dependency throws something unusual.",
  commonTrap: "Avoid catch (error) followed by (error as Error). That cast can make the error screen itself throw when a library rejects with a string or plain object.",
  workedExampleCode: `function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong";
}`,
  workedExampleExplanation: "Each branch narrows unknown through runtime evidence; the final branch handles anything not covered by the earlier checks.",
  decisionGuide: "Use unknown at catch and trust boundaries. Narrow only the information needed for logging or recovery, and translate an error only in a layer that understands its meaning.",
  edgeCases: [
    "JavaScript permits throwing strings, objects, null, and other values, not only Error instances.",
    "Some cross-realm Error objects may fail instanceof checks; prefer a safe fallback and avoid assuming every object with a message is trusted.",
    "Do not expose stack traces, tokens, server paths, or raw response data to users.",
    "Logging and continuing is not recovery if the operation still failed."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("error messages handle non-Error thrown values", () => {
  assertEquals(errorMessage(new Error("offline")), "offline");
  assertEquals(errorMessage("unexpected"), "unexpected");
  assertEquals(errorMessage({ message: "untrusted" }), "Something went wrong");
});`,
  verificationNote: "Keep the formatter pure so the fallback policy can be tested without throwing or mocking browser UI.",
  practice: "Add a domain-specific error translation at the repository boundary, but rethrow unexpected programming errors. Test both the recognized failure and an arbitrary thrown value."
};
