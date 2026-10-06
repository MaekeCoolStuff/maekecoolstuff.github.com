import { partOne } from "./part-one.js";
export const todoBookParts = [
  {
    number: 1,
    title: "Foundation",
    chapters: partOne
  }
];
export const todoBookChapters = todoBookParts.flatMap((part)=>[
    ...part.chapters
  ]);
