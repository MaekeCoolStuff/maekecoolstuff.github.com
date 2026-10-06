export const bookPath = "/start-here/todo";
export function chapterId(number) {
  if (!Number.isInteger(number) || number < 1 || number > 3) {
    throw new RangeError("Authored task-manager chapter must be 1-3.");
  }
  return String(number).padStart(2, "0");
}
export function chapterPath(number) {
  if (!Number.isInteger(number) || number < 1 || number > 3) {
    throw new RangeError("Authored task-manager chapter must be 1-3.");
  }
  return `${bookPath}/${chapterId(number)}`;
}
