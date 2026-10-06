import { html } from "../../../../vendor/components/dist/index.js";
export function renderCodeExample(source, language = getLanguage(source)) {
  return html`
    <nala-code-block language=${language}
      .code=${source}>${source}</nala-code-block>
  `;
}
function getLanguage(source) {
  const code = source.trimStart();
  if (/^(?:<!--|<\/?[a-z][\w:-]*(?:\s|>|\/))/i.test(code)) return "html";
  const cssCode = code.replace(/^(?:\/\*[\s\S]*?\*\/\s*)+/, "");
  const firstLine = cssCode.split(/\r?\n/, 1)[0].trim();
  const selectorPrelude = cssCode.match(/^([^{}]+)\{/)?.[1].trim() ?? "";
  const hasCssRule = /^(?:[.#*:][\w*:-]*|[a-z][\w-]*)[^{}]*$/i.test(selectorPrelude) && !/^(?:class|const|export|for|function|if|import|interface|let|return|type|var|while)\b/i.test(selectorPrelude);
  if (/^@(?:container|font-face|import|keyframes|layer|media|page|property|scope|supports)\b/i.test(firstLine) || hasCssRule) {
    return "css";
  }
  if (/^(?:deno|git|curl|npm|npx)\s/.test(code)) {
    return "text";
  }
  return "typescript";
}
