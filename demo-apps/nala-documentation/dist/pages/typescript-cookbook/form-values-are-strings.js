export const recipe = {
  slug: "form-values-are-strings",
  category: "Browser APIs",
  title: "A number field still gives you text",
  problem: "A value read from an input will not fit a number field in your game model, or adding it to another number produces an unexpected result.",
  rootCause: `HTML inputs and FormData expose text. The input's type="number" affects browser editing and validation, but its value property remains a string. Convert and validate at the boundary before storing a number.`,
  solutionCode: `function parseHours(raw: string): number | undefined {
  const text = raw.trim();
  if (text === "") return undefined;

  const hours = Number(text);
  if (!Number.isFinite(hours) || hours < 0) return undefined;
  return hours;
}

const hours = parseHours(input.value);
if (hours !== undefined) savePlayTime(hours);`,
  whyItWorks: "The function accepts what the browser actually gives you, validates it, then returns either a usable number or an explicit failure value. Domain state never has to pretend an unparsed string is a number.",
  commonTrap: `Number("") is 0, and parseInt("12hours", 10) is 12. Check for blank text and validate the whole value instead of accepting a plausible prefix.`,
  workedExampleCode: `function parseRating(raw: string): number | undefined {
  const text = raw.trim();
  if (!/^\\d+$/.test(text)) return undefined;

  const rating = Number(text);
  return rating >= 1 && rating <= 10 ? rating : undefined;
}`,
  workedExampleExplanation: "The digit check rejects decimals and trailing text; the numeric range check enforces the domain rule after conversion.",
  decisionGuide: "Parse at the browser boundary, before assigning a value to a numeric domain field. Choose a parser based on the UI contract: decimal numbers, integer counts, and fixed-scale money need different accepted syntax and range rules.",
  edgeCases: [
    "An empty string converts to 0 with Number(), so reject blank text before conversion when zero is not the intended empty value.",
    "Number('12hours') becomes NaN, while parseInt('12hours', 10) accepts a prefix; validate the full representation.",
    "The browser may provide multiple FormData entries or a File rather than a string.",
    "Check finiteness, sign, precision, and domain range independently of the input element's visual constraints."
  ],
  verificationCode: `import { assertEquals } from "jsr:@std/assert";

Deno.test("hours parsing distinguishes valid and invalid text", () => {
  assertEquals(parseHours("1.5"), 1.5);
  assertEquals(parseHours(""), undefined);
  assertEquals(parseHours("12hours"), undefined);
  assertEquals(parseHours("-2"), undefined);
});`,
  verificationNote: "Keep parsing logic in a pure function so Deno can test it without constructing an input element.",
  practice: "Write a parser for an integer collection count. Decide whether leading zeros, whitespace, signs, and values above a maximum are allowed, then test each decision explicitly."
};
