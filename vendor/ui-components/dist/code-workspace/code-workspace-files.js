export function validateCodeFiles(value) {
  if (!Array.isArray(value)) {
    throw new TypeError("Code workspace files must be an array.");
  }
  const names = new Set();
  for (const file of value){
    if (file === null || typeof file !== "object" || typeof file.name !== "string" || !file.name.trim() || typeof file.code !== "string" || file.language !== undefined && ![
      "typescript",
      "html",
      "css",
      "text"
    ].includes(file.language)) {
      throw new TypeError("Each code file needs a nonblank name, string code and supported language.");
    }
    if (names.has(file.name)) {
      throw new TypeError(`Duplicate code file name: ${file.name}`);
    }
    names.add(file.name);
  }
}
export function codeFileIndex(files, selected) {
  const index = files.findIndex((file)=>file.name === selected);
  return index < 0 ? 0 : index;
}
export function codeFileId(name) {
  return name.split("").map((unit)=>unit.charCodeAt(0).toString(16)).join("-");
}
