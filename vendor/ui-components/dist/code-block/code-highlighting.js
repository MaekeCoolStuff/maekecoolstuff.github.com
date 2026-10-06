const typescriptKeywords = new Set([
  "as",
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "default",
  "delete",
  "do",
  "else",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "from",
  "function",
  "if",
  "implements",
  "import",
  "in",
  "instanceof",
  "interface",
  "let",
  "new",
  "null",
  "of",
  "return",
  "static",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "type",
  "typeof",
  "undefined",
  "var",
  "void",
  "while",
  "with",
  "yield"
]);
const operators = [
  ">>>=",
  "===",
  "!==",
  "**=",
  "??=",
  "&&=",
  "||=",
  "...",
  "=>",
  "==",
  "!=",
  "<=",
  ">=",
  "&&",
  "||",
  "??",
  "?.",
  "++",
  "--",
  "+=",
  "-=",
  "*=",
  "/=",
  "%=",
  "**",
  "<<",
  ">>",
  "&=",
  "|=",
  "^=",
  "=",
  "+",
  "-",
  "*",
  "/",
  "%",
  "!",
  "~",
  "&",
  "|",
  "^",
  "<",
  ">",
  "?"
];
export function highlightCode(source, language) {
  if (language === "text") return [
    {
      type: "plain",
      text: source
    }
  ];
  if (language === "html") return tokenizeHtml(source);
  if (language === "css") return tokenizeCss(source);
  return tokenizeTypescript(source);
}
const cssGroupingAtRules = new Set([
  "@container",
  "@document",
  "@keyframes",
  "@layer",
  "@media",
  "@scope",
  "@starting-style",
  "@supports"
]);
function tokenizeCss(source) {
  const tokens = [];
  const blockModes = [
    "rules"
  ];
  let index = 0;
  let activeAtRule = "";
  let readingValue = false;
  while(index < source.length){
    const rest = source.slice(index);
    const mode = blockModes.at(-1) ?? "rules";
    let match;
    if (/\s/.test(source[index])) {
      match = rest.match(/^\s+/);
      pushToken(tokens, "plain", match[0]);
      index += match[0].length;
    } else if (rest.startsWith("/*")) {
      const end = source.indexOf("*/", index + 2);
      const length = end === -1 ? source.length - index : end + 2 - index;
      pushToken(tokens, "comment", source.slice(index, index + length));
      index += length;
    } else if (source[index] === "'" || source[index] === '"') {
      const quote = source[index];
      let end = index + 1;
      while(end < source.length){
        if (source[end] === "\\") end += 2;
        else if (source[end++] === quote) break;
      }
      pushToken(tokens, "string", source.slice(index, end));
      index = end;
    } else if (match = rest.match(/^@[\w-]+/)) {
      activeAtRule = match[0].toLowerCase();
      pushToken(tokens, "at-rule", match[0]);
      index += match[0].length;
    } else if (match = rest.match(/^!important\b/i)) {
      pushToken(tokens, "important", match[0]);
      index += match[0].length;
    } else if (mode === "declarations" && readingValue && (match = rest.match(/^#[\da-f]{3,8}\b/i))) {
      pushToken(tokens, "color", match[0]);
      index += match[0].length;
    } else if (match = rest.match(/^(?:\d*\.)?\d+(?:%|[a-z]+)?/i)) {
      pushToken(tokens, "number", match[0]);
      index += match[0].length;
    } else if (source[index] === "{") {
      pushToken(tokens, "punctuation", source[index]);
      const parentMode = blockModes.at(-1) ?? "rules";
      const nestedMode = parentMode === "rules" && cssGroupingAtRules.has(activeAtRule) ? "rules" : "declarations";
      blockModes.push(nestedMode);
      readingValue = false;
      activeAtRule = "";
      index++;
    } else if (source[index] === "}") {
      pushToken(tokens, "punctuation", source[index]);
      if (blockModes.length > 1) blockModes.pop();
      readingValue = false;
      activeAtRule = "";
      index++;
    } else if (source[index] === ";") {
      pushToken(tokens, "punctuation", source[index]);
      readingValue = false;
      activeAtRule = "";
      index++;
    } else if (source[index] === ":") {
      pushToken(tokens, "punctuation", source[index]);
      if (mode === "declarations") readingValue = true;
      index++;
    } else if (match = rest.match(/^(?:--|[-_a-z])[\w-]*/i)) {
      const identifier = match[0];
      const following = rest.slice(identifier.length).match(/^\s*([(:])/)?.[1];
      if (mode === "rules") {
        pushToken(tokens, activeAtRule ? "plain" : "selector", identifier);
      } else if (!readingValue && following === ":") {
        pushToken(tokens, "property", identifier);
      } else if (readingValue && following === "(") {
        pushToken(tokens, "function", identifier);
      } else if (readingValue) {
        pushToken(tokens, "value", identifier);
      } else {
        pushToken(tokens, "plain", identifier);
      }
      index += identifier.length;
    } else {
      const character = source[index];
      const type = "()[],:;".includes(character) ? "punctuation" : "{}=<>+~*/!".includes(character) ? "operator" : mode === "rules" && !activeAtRule ? "selector" : "plain";
      pushToken(tokens, type, character);
      index++;
    }
  }
  return tokens;
}
function tokenizeTypescript(source) {
  const tokens = [];
  let index = 0;
  while(index < source.length){
    const rest = source.slice(index);
    let match = null;
    if (/\s/.test(source[index])) {
      match = rest.match(/^\s+/);
      pushToken(tokens, "plain", match[0]);
    } else if (rest.startsWith("//")) {
      match = rest.match(/^\/\/[^\r\n]*/);
      pushToken(tokens, "comment", match[0]);
    } else if (rest.startsWith("/*")) {
      const end = source.indexOf("*/", index + 2);
      const length = end === -1 ? source.length - index : end + 2 - index;
      pushToken(tokens, "comment", source.slice(index, index + length));
      index += length;
      continue;
    } else if (source[index] === "/" && canStartRegex(source, index)) {
      const end = findRegexEnd(source, index);
      if (end !== null) {
        pushToken(tokens, "regex", source.slice(index, end));
        index = end;
        continue;
      }
    } else if (source[index] === "'" || source[index] === '"' || source[index] === "`") {
      const quote = source[index];
      let end = index + 1;
      while(end < source.length){
        if (source[end] === "\\") end += 2;
        else if (source[end++] === quote) break;
      }
      pushToken(tokens, "string", source.slice(index, end));
      index = end;
      continue;
    } else if (match = rest.match(/^[\p{L}_$][\p{L}\p{N}_$]*/u)) {
      pushToken(tokens, typescriptKeywords.has(match[0]) ? "keyword" : "plain", match[0]);
    } else if (match = rest.match(/^(?:0[xob][\da-f]+|\d+(?:\.\d+)?(?:e[+-]?\d+)?n?)/i)) {
      pushToken(tokens, "number", match[0]);
    } else {
      const operator = operators.find((candidate)=>rest.startsWith(candidate));
      if (operator) {
        pushToken(tokens, "operator", operator);
      } else {
        const character = source[index];
        pushToken(tokens, "{}()[];,. :".includes(character) ? "punctuation" : "plain", character);
      }
    }
    index += match?.[0].length ?? operators.find((candidate)=>rest.startsWith(candidate))?.length ?? 1;
  }
  return tokens;
}
function canStartRegex(source, index) {
  const before = source.slice(0, index).trimEnd();
  if (before.length === 0) return true;
  const previous = before.at(-1);
  if ("=([{!,:;?&|+-*%^~<>".includes(previous)) return true;
  const previousWord = before.match(/[\p{L}_$][\p{L}\p{N}_$]*$/u)?.[0];
  return previousWord !== undefined && /^(?:await|case|delete|in|instanceof|new|of|return|throw|typeof|void|yield)$/.test(previousWord);
}
function findRegexEnd(source, start) {
  let index = start + 1;
  let inCharacterClass = false;
  while(index < source.length){
    const character = source[index];
    if (character === "\n" || character === "\r") return null;
    if (character === "\\") {
      index += 2;
      continue;
    }
    if (character === "[") inCharacterClass = true;
    else if (character === "]") inCharacterClass = false;
    else if (character === "/" && !inCharacterClass) {
      index++;
      while(/[a-z]/i.test(source[index] ?? ""))index++;
      return index;
    }
    index++;
  }
  return null;
}
function tokenizeHtml(source) {
  const tokens = [];
  let index = 0;
  while(index < source.length){
    if (!source.startsWith("<", index)) {
      const nextTag = source.indexOf("<", index);
      const end = nextTag === -1 ? source.length : nextTag;
      pushToken(tokens, "plain", source.slice(index, end));
      index = end;
      continue;
    }
    if (source.startsWith("<!--", index)) {
      const closingComment = source.indexOf("-->", index + 4);
      const end = closingComment === -1 ? source.length : closingComment + 3;
      pushToken(tokens, "comment", source.slice(index, end));
      index = end;
      continue;
    }
    pushToken(tokens, "punctuation", "<");
    index++;
    if (source[index] === "/") {
      pushToken(tokens, "punctuation", "/");
      index++;
    }
    if (source[index] === "!" || source[index] === "?") {
      pushToken(tokens, "punctuation", source[index++]);
    }
    const tagName = source.slice(index).match(/^[\w:-]+/)?.[0];
    if (tagName) {
      pushToken(tokens, "tag", tagName);
      index += tagName.length;
    }
    while(index < source.length && source[index] !== ">"){
      if (/\s/.test(source[index])) {
        const whitespace = source.slice(index).match(/^\s+/)[0];
        pushToken(tokens, "plain", whitespace);
        index += whitespace.length;
      } else if (source.startsWith("/>", index)) {
        pushToken(tokens, "punctuation", "/>");
        index += 2;
      } else if (source[index] === "=") {
        pushToken(tokens, "punctuation", "=");
        index++;
      } else if (source[index] === "'" || source[index] === '"') {
        const quote = source[index];
        let end = index + 1;
        while(end < source.length && source[end] !== quote)end++;
        if (end < source.length) end++;
        pushToken(tokens, "string", source.slice(index, end));
        index = end;
      } else {
        const attribute = source.slice(index).match(/^[^\s=/>]+/)?.[0];
        if (!attribute) {
          pushToken(tokens, "plain", source[index++]);
        } else {
          pushToken(tokens, "attribute", attribute);
          index += attribute.length;
        }
      }
    }
    if (source[index] === ">") {
      pushToken(tokens, "punctuation", ">");
      index++;
    }
  }
  return tokens;
}
function pushToken(tokens, type, text) {
  if (!text) return;
  const previous = tokens.at(-1);
  if (previous?.type === type) previous.text += text;
  else tokens.push({
    type,
    text
  });
}
