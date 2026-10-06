import { defineComponent, dispatchComponentEvent, html, repeat, when } from "../../../components/dist/index.js";
import "../tabs/tabs.js";
import "../code-block/code-block.js";
import { codeFileId, codeFileIndex, validateCodeFiles } from "./code-workspace-files.js";
defineComponent("nala-code-workspace", {
  shadow: true,
  styles: ":host {\n  display: block;\n  min-width: 0;\n  color: var(--nala-ui-color-text, #18201d);\n}\n.workspace {\n  min-width: 0;\n  overflow: hidden;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-medium, 8px);\n  background: var(--nala-ui-color-surface, #fffefa);\n}\nheader,\nfooter {\n  display: flex;\n  justify-content: space-between;\n  gap: 1rem;\n  padding: .65rem 1rem;\n  background: var(--nala-ui-color-surface-muted, #f7f7f2);\n  font: .8rem/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;\n  overflow-wrap: anywhere;\n}\nheader {\n  font-weight: 700;\n  border-bottom: 1px solid var(--nala-ui-color-border, #cbcfc8);\n}\n.readonly {\n  flex-shrink: 0;\n  font-weight: 400;\n  color: var(--nala-ui-color-text-muted, #68716c);\n}\nfooter {\n  border-top: 1px solid var(--nala-ui-color-border, #cbcfc8);\n}\nnala-tabs {\n  min-width: 0;\n}\nnala-tabs::part(tablist) {\n  background: var(--nala-ui-color-surface-muted, #f7f7f2);\n  gap: 0;\n}\nbutton[slot=\"tab\"] {\n  font: .85rem/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;\n}\nsection[slot=\"panel\"] {\n  min-width: 0;\n  padding: 0;\n}\nnala-code-block::part(code-block) {\n  border: 0;\n  border-radius: 0;\n  min-height: 12rem;\n}\n.empty {\n  padding: 1rem;\n  color: var(--nala-ui-color-text-muted, #68716c);\n}\n",
  props: {
    label: {
      type: "string",
      default: "Code files"
    },
    selected: {
      type: "string",
      default: ""
    }
  },
  properties: {
    files: {
      default: ()=>[],
      validate: validateCodeFiles
    }
  },
  template: ({ files, selected, label })=>{
    const index = codeFileIndex(files, selected);
    return html`
      <section class="workspace" part="workspace" aria-label=${label}>
        <header part="heading"><span>${label}</span><span class="readonly">Read only</span></header>
        ${when(files.length > 0, ()=>html`
              <nala-tabs label=${label} .selected=${index} exportparts="tablist">
                ${repeat(files, (file)=>file.name, (file)=>html`<button id=${`code-tab-${codeFileId(file.name)}`} slot="tab" part="file-tab">${file.name}</button>`)}
                ${repeat(files, (file)=>file.name, (file)=>html`
                    <section id=${`code-panel-${codeFileId(file.name)}`} slot="panel" part="file-panel">
                      <nala-code-block language=${file.language ?? "typescript"} .code=${file.code}
                        exportparts="code-block"></nala-code-block>
                    </section>
                  `)}
              </nala-tabs>
              <footer part="status"><span>${files[index].name}</span><span>${files[index].language ?? "typescript"}</span></footer>
            `, ()=>html`<p class="empty" part="empty">No files to display.</p>`)}
      </section>
    `;
  },
  onConnect ({ element, root, listen }) {
    listen(root, "change", (event)=>{
      if (!(event instanceof CustomEvent)) return;
      const workspace = element;
      const index = event.detail?.value;
      if (typeof index !== "number" || !Number.isInteger(index) || index < 0 || index >= workspace.files.length) {
        throw new TypeError("Code workspace received an invalid tab selection.");
      }
      event.stopPropagation();
      const value = workspace.files[index].name;
      workspace.selected = value;
      dispatchComponentEvent(element, "change", {
        value
      }, {
        bubbles: true,
        composed: true
      });
    });
  }
});
