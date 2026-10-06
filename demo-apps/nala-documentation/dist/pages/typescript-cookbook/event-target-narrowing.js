export const recipe = {
  slug: "event-target-narrowing",
  category: "Browser APIs",
  title: "An event target is not automatically an input",
  problem: "Inside an event listener, TypeScript says target has no value property, even though the user clicked or typed in an input.",
  rootCause: "Events can bubble from many elements, and EventTarget is a broad browser interface. The event type alone does not prove which element originated it. The target may even be a child inside the control.",
  solutionCode: `searchInput.addEventListener("input", (event) => {
  const input = event.currentTarget;
  if (!(input instanceof HTMLInputElement)) return;

  updateSearch(input.value);
});`,
  whyItWorks: "currentTarget is the element whose listener is running. The instanceof check is a real runtime test and narrows it to HTMLInputElement, so value is available.",
  commonTrap: "Casting event.target as HTMLInputElement changes only the compiler's belief. On delegated listeners, target can be a nested span or a different control entirely.",
  workedExampleCode: `checkbox.addEventListener("change", (event) => {
  const control = event.currentTarget;
  if (!(control instanceof HTMLInputElement)) return;
  if (control.type !== "checkbox") return;

  saveEnabled(control.checked);
});`,
  workedExampleExplanation: "The listener narrows the element before reading checked and verifies the control's runtime kind before applying checkbox-specific behavior.",
  decisionGuide: "Use currentTarget when the listener needs the element that owns the handler. Use target plus closest() for delegation, then verify the result is inside the intended root and is the correct element type.",
  edgeCases: [
    "A bubbling event's target may be a nested icon or span rather than the control.",
    "currentTarget is only meaningful while the listener is running; capture values you need before scheduling later work.",
    "CustomEvent detail is only trustworthy when the dispatch source and contract are trusted.",
    "A generic addEventListener target type does not validate a dynamically selected element."
  ],
  verificationCode: `const list = document.querySelector("#game-list");
list?.addEventListener("click", (event) => {
  const origin = event.target;
  if (!(origin instanceof Element)) return;
  const button = origin.closest<HTMLButtonElement>("button[data-game-id]");
  if (button === null || !list.contains(button)) return;
  console.log(button.dataset.gameId);
});`,
  verificationNote: "This is browser-only behavior: verify bubbling, nested targets, and dynamic children in a real DOM, not only with a Deno type check.",
  practice: "Delegate a remove action from a list root. Make sure a nested SVG click still finds the intended button, unrelated buttons are ignored, and the handler stops at the component boundary."
};
