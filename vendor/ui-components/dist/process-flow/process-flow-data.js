export function validateProcessSteps(value) {
  if (!Array.isArray(value)) {
    throw new TypeError("Process flow steps must be an array.");
  }
  const ids = new Set();
  for (const step of value){
    if (step === null || typeof step !== "object" || typeof step.id !== "string" || !step.id.trim() || typeof step.title !== "string" || !step.title.trim() || typeof step.description !== "string" || [
      "location",
      "input",
      "action",
      "output",
      "boundary"
    ].some((key)=>step[key] !== undefined && typeof step[key] !== "string")) {
      throw new TypeError("Process steps need a nonblank id and title, a description and optional string annotations.");
    }
    if (ids.has(step.id)) {
      throw new TypeError(`Duplicate process step id: ${step.id}`);
    }
    ids.add(step.id);
  }
}
