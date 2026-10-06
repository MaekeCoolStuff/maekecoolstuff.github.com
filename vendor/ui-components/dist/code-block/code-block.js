import { highlightCode } from "./code-highlighting.js";
const styles = ":host {\n  display: block;\n  min-width: 0;\n}\n\npre {\n  overflow-x: auto;\n  margin: 0;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-small, 4px);\n  padding: 1rem 1.1rem;\n  background: #18201d;\n  color: #f2f4ec;\n  font: 0.88rem/1.65 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;\n  tab-size: 2;\n}\n\n.token-keyword { color: #d6a8ff; }\n.token-string { color: #a8dba5; }\n.token-regex { color: #9fd6c2; }\n.token-comment { color: #a1ada5; font-style: italic; }\n.token-number { color: #f2c879; }\n.token-operator, .token-punctuation { color: #f0a98c; }\n.token-tag { color: #82c9df; }\n.token-attribute { color: #f2c879; }\n.token-selector, .token-function { color: #82c9df; }\n.token-property, .token-color { color: #f2c879; }\n.token-at-rule { color: #d6a8ff; }\n.token-value { color: #a8dba5; }\n.token-important { color: #f0a98c; font-weight: 700; }\n";
class NalaCodeBlock extends HTMLElement {
  static observedAttributes = [
    "language"
  ];
  #root;
  #code;
  constructor(){
    super();
    this.#root = this.attachShadow({
      mode: "open"
    });
  }
  get code() {
    return this.#code ?? this.textContent ?? "";
  }
  set code(value) {
    this.#code = String(value);
    if (this.isConnected) this.#render();
  }
  connectedCallback() {
    this.#code ??= this.textContent ?? "";
    this.#render();
  }
  attributeChangedCallback() {
    if (this.isConnected) this.#render();
  }
  #render() {
    const requestedLanguage = this.getAttribute("language");
    const language = requestedLanguage === "html" || requestedLanguage === "css" || requestedLanguage === "text" ? requestedLanguage : "typescript";
    const style = document.createElement("style");
    style.textContent = styles;
    const pre = document.createElement("pre");
    pre.part.add("code-block");
    const code = document.createElement("code");
    code.setAttribute("data-language", language);
    for (const token of highlightCode(this.code, language)){
      if (token.type === "plain") {
        code.append(document.createTextNode(token.text));
      } else {
        const span = document.createElement("span");
        span.className = `token-${token.type}`;
        span.textContent = token.text;
        code.append(span);
      }
    }
    pre.append(code);
    this.#root.replaceChildren(style, pre);
  }
}
customElements.define("nala-code-block", NalaCodeBlock);
