import { defineComponent, html, repeat, when } from "../../../components/dist/index.js";
import { validateFileTreeEntries } from "./file-tree-data.js";
function entryLabel(entry) {
  const folder = entry.kind === "folder";
  const extension = entry.name.split(".").pop()?.toLowerCase();
  const type = !folder && [
    "ts",
    "js",
    "html",
    "css"
  ].includes(extension ?? "") ? extension : "file";
  return html`
    <span class="icon" data-type=${folder ? "folder" : type} aria-hidden="true">
      ${when(folder, ()=>html`
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M3 7V5h6l2 2h10v13H3Z" />
            <path d="M3 10h18" />
          </svg>
        `, ()=>html`
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M6 3h8l4 4v14H6Z" />
            <path d="M14 3v5h4M9 12h6M9 16h6" />
          </svg>
        `)}
    </span>
    <span class="name" part="name">${entry.name}</span>
    ${when(!folder && type !== "file", ()=>html`<span class="extension" aria-hidden="true">${type}</span>`)}
    ${when(entry.note !== undefined, ()=>html`<span class="note" part="note">${entry.note}</span>`)}
  `;
}
function entryList(entries) {
  return html`
    <ul part="list">${repeat(entries, (entry)=>entry.id, (entry)=>html`
        <li>
          ${when(entry.kind === "folder", ()=>{
      if (entry.kind !== "folder") {
        throw new TypeError("Expected a folder.");
      }
      return html`
              <details part="folder" open>
                <summary class="row" part="row">
                  <span class="chevron" aria-hidden="true"></span>${entryLabel(entry)}
                </summary>
                ${entryList(entry.children)}
              </details>
            `;
    }, ()=>html`<div class="row file" part="row">${entryLabel(entry)}</div>`)}
        </li>
      `)}</ul>
  `;
}
defineComponent("nala-file-tree", {
  shadow: true,
  styles: ":host {\n  display: block;\n  min-width: 0;\n  color: var(--nala-ui-color-text, #18201d);\n}\n* {\n  box-sizing: border-box;\n}\n.explorer {\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-radius: var(--nala-ui-radius-medium, 8px);\n  overflow: hidden;\n  background: var(--nala-ui-color-surface, #fffefa);\n}\nheader {\n  display: flex;\n  align-items: center;\n  gap: .6rem;\n  padding: .85rem 1rem;\n  border-bottom: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  background: var(--nala-ui-color-surface-muted, #f7f7f2);\n  font: 600 .8rem/1.5 system-ui, sans-serif;\n  letter-spacing: .04em;\n}\n.heading-icon {\n  width: .8rem;\n  height: .8rem;\n  border: 1px solid currentColor;\n  box-shadow: 3px -3px 0 -1px var(--nala-ui-color-surface-muted, #f7f7f2), 3px\n    -3px 0 currentColor;\n}\nul {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.explorer > ul {\n  padding: .5rem .75rem;\n}\ndetails > ul {\n  margin-left: 1.05rem;\n  padding-left: .65rem;\n  border-left: 1px solid var(--nala-ui-color-border, #cbcfc8);\n}\n.row {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: .5rem;\n  min-height: 1.85rem;\n  padding: .2rem .5rem;\n  border-radius: 5px;\n  font: .9rem/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;\n}\nsummary {\n  cursor: pointer;\n  list-style: none;\n}\nsummary::-webkit-details-marker {\n  display: none;\n}\nsummary:hover {\n  background: var(--nala-ui-color-surface-muted, #f7f7f2);\n}\nsummary:focus-visible {\n  outline: 2px solid var(--nala-ui-color-accent, #246c50);\n  outline-offset: -2px;\n}\n.chevron {\n  width: .4rem;\n  height: .4rem;\n  border-right: 1.5px solid currentColor;\n  border-bottom: 1.5px solid currentColor;\n  transform: rotate(-45deg);\n  margin-right: .25rem;\n}\ndetails[open] > summary .chevron {\n  transform: rotate(45deg);\n}\n.file {\n  padding-left: 1.4rem;\n}\n.icon {\n  display: inline-flex;\n  width: 1.15rem;\n  height: 1.15rem;\n  flex-shrink: 0;\n}\n.icon svg {\n  width: 100%;\n  height: 100%;\n}\n[data-type=\"folder\"] {\n  color: var(--nala-file-tree-folder-color, #9a7025);\n}\n[data-type=\"ts\"] {\n  color: var(--nala-file-tree-typescript-color, #3178a5);\n}\n[data-type=\"js\"] {\n  color: var(--nala-file-tree-javascript-color, #927315);\n}\n[data-type=\"html\"] {\n  color: var(--nala-file-tree-html-color, #b04f32);\n}\n[data-type=\"css\"] {\n  color: var(--nala-file-tree-css-color, #7757a0);\n}\n.name {\n  overflow-wrap: anywhere;\n  min-width: 0;\n}\n.extension {\n  font: 600 .65rem/1.5 system-ui, sans-serif;\n  text-transform: uppercase;\n  padding: .05rem .35rem;\n  border-radius: 4px;\n  background: var(--nala-ui-color-surface-muted, #f7f7f2);\n}\n.note {\n  font: .8rem/1.5 system-ui, sans-serif;\n  color: var(--nala-ui-color-text-muted, #68716c);\n  overflow-wrap: anywhere;\n}\n.empty {\n  padding: .5rem 1rem;\n  color: var(--nala-ui-color-text-muted, #68716c);\n}\n",
  props: {
    label: {
      type: "string",
      default: "Project files"
    }
  },
  properties: {
    entries: {
      default: ()=>[],
      validate: validateFileTreeEntries
    }
  },
  template: ({ entries, label })=>html`
      <section class="explorer" part="explorer" aria-label=${label}>
        <header part="heading"><span class="heading-icon" aria-hidden="true"></span>${label}</header>
        ${when(entries.length > 0, ()=>entryList(entries), ()=>html`<p class="empty" part="empty">No files to display.</p>`)}
      </section>
    `
});
