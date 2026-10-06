export function avatarInitials(name) {
  const words = name?.trim().split(/\s+/u).filter(Boolean) ?? [];
  if (words.length === 0) return "";
  const first = Array.from(words[0]);
  if (words.length === 1) return first.slice(0, 2).join("").toUpperCase();
  const last = Array.from(words.at(-1) ?? "");
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}
