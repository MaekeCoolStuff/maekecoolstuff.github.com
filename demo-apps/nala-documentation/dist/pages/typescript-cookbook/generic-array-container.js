export const recipe = {
  slug: "generic-array-container",
  category: "Generics and inference",
  title: "Know which value a generic constraint describes",
  problem: "A generic loggingIdentity<Type> implementation reports that arg.length does not exist, even though the caller passes an array.",
  rootCause: "The type parameter Type describes the element type only when the parameter is Array<Type>. If the parameter is just Type, callers may supply a number, object, string, or any other value, and Type has no guaranteed length property.",
  solutionCode: `function loggingIdentity<Type>(arg: Array<Type>): Array<Type> {
  console.log(arg.length);
  return arg;
}

const numbers = loggingIdentity([10, 20, 30]);
const titles = loggingIdentity(["Celeste", "Hades"]);`,
  whyItWorks: "Array<Type> guarantees the parameter is an array, so length is available. Type describes each element and remains inferred from the input; the return type preserves the same element type.",
  commonTrap: "Adding Type extends { length: number } is unnecessary for an array parameter: the array container already guarantees length. That constraint is useful only when the function accepts a value itself and needs any length-bearing shape.",
  workedExampleCode: `type Lengthwise = { length: number };

function reportLength<Value extends Lengthwise>(value: Value): Value {
  console.log(value.length);
  return value;
}

reportLength([1, 2, 3]);
reportLength("game shelf");
// reportLength(42); // number has no length property.`,
  workedExampleExplanation: "Here the generic parameter is the value itself, so the constraint promises that every accepted Value has length. Returning Value preserves whether the caller passed a string, tuple, or array.",
  decisionGuide: "Use Array<Type> or Type[] when the input is specifically a collection. Use a structural constraint such as Value extends { length: number } when multiple kinds of values are valid but the implementation requires their shared length capability.",
  edgeCases: [
    "Array<Type> and Type[] describe the same mutable array type.",
    "readonly Type[] accepts readonly tuples and arrays but prevents mutation through that parameter.",
    "An array's length counts slots, including sparse holes; it does not prove every index contains a value.",
    "String length counts UTF-16 code units, not user-perceived grapheme clusters.",
    "A constraint must list the capabilities the implementation actually uses; it does not validate runtime input."
  ],
  verificationCode: `import { assertEquals, assertStrictEquals } from "jsr:@std/assert";

Deno.test("loggingIdentity preserves the array and element type", () => {
  const games = ["Celeste", "Hades"];
  const result = loggingIdentity(games);
  assertStrictEquals(result, games);
  assertEquals(result.length, 2);
});`,
  verificationNote: "The checker verifies the array and element relationship; the test verifies the function returns the same container rather than an accidental copy.",
  practice: "Write firstOrUndefined<Type>(values: readonly Type[]): Type | undefined. Then write a separate generic function for any value with a numeric length. Explain why the first needs no constraint on Type and the second does."
};
