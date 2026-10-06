export function validateFileTreeEntries(value) {
  const ids = new Set();
  const visit = (entries, depth)=>{
    if (!Array.isArray(entries) || depth > 32) {
      throw new TypeError("File tree entries must be arrays nested at most 32 levels.");
    }
    for (const entry of entries){
      if (entry === null || typeof entry !== "object" || typeof entry.id !== "string" || !entry.id.trim() || typeof entry.name !== "string" || !entry.name.trim() || entry.note !== undefined && typeof entry.note !== "string" || entry.kind !== "file" && entry.kind !== "folder") {
        throw new TypeError("File tree entries need an id, name, kind and optional string note.");
      }
      if (ids.has(entry.id)) {
        throw new TypeError(`Duplicate file tree id: ${entry.id}`);
      }
      ids.add(entry.id);
      if (entry.kind === "folder") visit(entry.children, depth + 1);
      else if ("children" in entry) {
        throw new TypeError("File tree files cannot have children.");
      }
    }
  };
  visit(value, 0);
}
