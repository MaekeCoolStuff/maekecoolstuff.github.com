export const recipe = {
  slug: "missing-dom-element",
  category: "Browser APIs",
  title: "A DOM query can return null",
  problem: "TypeScript rejects searchInput.value because querySelector might not have found an element.",
  rootCause: "The document can differ from what the code expects: an id may be misspelled, markup may not be loaded yet, or a page may not contain that control. querySelector therefore returns an element or null.",
  solutionCode: `const searchInput = document.querySelector<HTMLInputElement>(
  "#game-search",
);

if (searchInput === null) {
  console.warn("The game search control is not on this page.");
} else {
  searchInput.value = "Celeste";
}`,
  whyItWorks: "The generic parameter describes the kind of element expected, while the null check proves that an element was actually found. After the check, TypeScript narrows searchInput to HTMLInputElement.",
  commonTrap: "querySelector<HTMLInputElement>(...) does not verify the selector's result type. The generic is a promise made by your code about the markup; the null check still matters.",
  workedExampleCode: `const input = document.querySelector<HTMLInputElement>("#game-search");
if (input !== null) {
  input.focus();
}`,
  workedExampleExplanation: "The guard protects the operation when the control is absent and tells the checker that focus is available on the value.",
  decisionGuide: "For a required page invariant, report a clear failure or render a recoverable error. For an optional enhancement, return early. Keep the selector close to use and avoid spreading non-null assertions through the code.",
  edgeCases: [
    "The query may run before markup exists or on a route that omits the control.",
    "The generic selector argument is an expectation; it does not verify the matched tag at runtime.",
    "A selector can match the wrong kind of element even when it is non-null.",
    "querySelectorAll returns an empty collection rather than null when there are no matches."
  ],
  verificationCode: `const input = document.querySelector<HTMLInputElement>("#game-search");
if (input === null) {
  console.info("Search is unavailable on this view");
} else {
  input.focus();
}`,
  verificationNote: "Verify with real page markup in a browser: test both the matching element and the absent/wrong-selector case. Deno does not provide a browser DOM by default.",
  practice: "Make a required save button fail with a useful initialization error when absent, while allowing an optional search box to be omitted. Keep the two contracts distinct."
};
