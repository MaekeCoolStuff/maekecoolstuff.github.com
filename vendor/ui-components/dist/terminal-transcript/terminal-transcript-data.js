export function validateTerminalEntries(value) {
  if (!Array.isArray(value)) {
    throw new TypeError("Terminal entries must be an array.");
  }
  const ids = new Set();
  for (const entry of value){
    if (entry === null || typeof entry !== "object" || typeof entry.id !== "string" || !entry.id.trim() || typeof entry.command !== "string" || !entry.command.trim() || entry.output !== undefined && typeof entry.output !== "string" || entry.note !== undefined && typeof entry.note !== "string") {
      throw new TypeError("Terminal entries need a nonblank id and command with optional string output and note.");
    }
    if (ids.has(entry.id)) {
      throw new TypeError(`Duplicate terminal entry id: ${entry.id}`);
    }
    ids.add(entry.id);
  }
}
