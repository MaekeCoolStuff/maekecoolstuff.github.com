import { defineComponent, html, repeat, when } from "../../../components/dist/index.js";
import { validateTerminalEntries } from "./terminal-transcript-data.js";
defineComponent("nala-terminal-transcript", {
  shadow: true,
  styles: ":host {\n  display: block;\n  min-width: 0;\n  --terminal-accent: var(--nala-ui-color-accent, #246c50);\n  --terminal-surface: var(--nala-terminal-background, color-mix(in srgb, #090f0d 94%, var(--terminal-accent)));\n  --terminal-border: color-mix(in srgb, #52615b 65%, var(--terminal-accent));\n  --terminal-highlight: color-mix(in srgb, #e4eee8 80%, var(--terminal-accent));\n  color: var(--nala-terminal-text, #c4d4ca);\n}\n* {\n  box-sizing: border-box;\n}\n.terminal {\n  min-width: 0;\n  overflow: hidden;\n  border: 1px solid var(--terminal-border);\n  border-radius: var(--nala-ui-radius-medium, 8px);\n  background: var(--terminal-surface);\n  box-shadow: 0 .6rem 1.5rem #0000001a;\n  font: .85rem/1.7 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;\n  color-scheme: dark;\n}\nheader {\n  display: flex;\n  align-items: center;\n  gap: .75rem;\n  padding: .8rem 1rem;\n  background: color-mix(in srgb, #202a25 85%, var(--terminal-accent));\n  color: var(--terminal-highlight);\n  font-weight: 700;\n  border-bottom: 1px solid var(--terminal-border);\n}\n.window-lights {\n  display: inline-flex;\n  flex-shrink: 0;\n  gap: .35rem;\n}\n.window-lights i {\n  width: .55rem;\n  height: .55rem;\n  border-radius: 50%;\n  background: #fa7770;\n}\n.window-lights i:nth-child(2) {\n  background: #edc667;\n}\n.window-lights i:nth-child(3) {\n  background: #70d897;\n}\n.window-title {\n  min-width: 0;\n  flex: 1;\n  overflow-wrap: anywhere;\n}\n.readonly {\n  flex-shrink: 0;\n  border: 1px solid var(--terminal-border);\n  border-radius: 4px;\n  padding: .1rem .4rem;\n  font-size: .65rem;\n  font-weight: 400;\n}\n.directory,\n.empty {\n  padding: 0 1rem;\n  overflow-wrap: anywhere;\n}\n.directory {\n  font: .8rem/1.6 ui-monospace, monospace;\n  color: var(--terminal-highlight);\n}\nol {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\nli {\n  min-width: 0;\n  padding: 1rem;\n  border-top: 1px solid var(--terminal-border);\n}\n.caption {\n  font-size: .7rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: .06em;\n  margin: 0 0 .5rem;\n  color: var(--terminal-highlight);\n}\npre {\n  margin: 0 0 1rem;\n  padding: .8rem;\n  overflow: auto;\n  background: color-mix(in srgb, #000 25%, var(--terminal-surface));\n  color: var(--nala-terminal-text, #c4d4ca);\n  border-radius: 4px;\n  font: .85rem/1.6 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;\n}\n.command {\n  border-left: 3px solid var(--nala-terminal-command-color, #83ffad);\n  color: var(--nala-terminal-command-color, #83ffad);\n  text-shadow: 0 0 .8rem #83ffad22;\n}\npre:focus-visible {\n  outline: 2px solid var(--terminal-highlight);\n  outline-offset: -2px;\n}\n.note {\n  margin: 0;\n  overflow-wrap: anywhere;\n}\n.empty {\n  color: var(--nala-terminal-muted, #a1b6a8);\n}\n:host([compact]) header {\n  display: none;\n}\n:host([compact]) li:first-child {\n  border-top: 0;\n}\n:host([compact]) :is(.directory, .empty) {\n  padding: 0 .65rem;\n  margin: .5rem 0;\n}\n:host([compact]) li {\n  padding: .65rem;\n}\n:host([compact]) .caption {\n  margin-bottom: .3rem;\n}\n:host([compact]) pre {\n  padding: .5rem .6rem;\n  margin-bottom: .5rem;\n}\n:host([compact]) pre:last-child {\n  margin-bottom: 0;\n}\n@media (forced-colors: active) {\n  .terminal,\n  header,\n  pre {\n    background: Canvas;\n    color: CanvasText;\n  }\n  .command,\n  .directory,\n  .caption,\n  .empty {\n    color: CanvasText;\n    text-shadow: none;\n  }\n  .terminal,\n  header,\n  li,\n  .readonly,\n  .command {\n    border-color: CanvasText;\n  }\n  pre:focus-visible {\n    outline-color: Highlight;\n  }\n}\n",
  props: {
    label: {
      type: "string",
      default: "Terminal transcript"
    },
    directory: {
      type: "string",
      default: ""
    },
    compact: {
      type: "boolean",
      default: false
    }
  },
  properties: {
    entries: {
      default: ()=>[],
      validate: validateTerminalEntries
    }
  },
  template: ({ entries, label, directory })=>html`
      <section class="terminal" part="terminal" aria-label=${label}>
        <header part="heading">
          <span class="window-lights" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="window-title">${label}</span>
          <span class="readonly">Read only</span>
        </header>
        ${when(!!directory, ()=>html`
            <p class="directory"
              part="directory">Working directory: <strong>${directory}</strong></p>
          `)}
        ${when(entries.length > 0, ()=>html`
            <ol>${repeat(entries, (entry)=>entry.id, (entry)=>html`
                <li part="entry">
                  <p class="caption">Command to run</p>
                  <pre class="command" part="command" tabindex="0" aria-label="Command to run"><code>${entry.command}</code></pre>
                  ${when(entry.output !== undefined, ()=>html`
                      <p class="caption">Example output · may vary</p>
                      <pre part="output" tabindex="0"
                        aria-label="Illustrative output"><samp>${entry.output}</samp></pre>
                    `)}
                  ${when(entry.note !== undefined, ()=>html`<p class="note" part="note">${entry.note}</p>`)}
                </li>
              `)}</ol>
          `, ()=>html`<p class="empty" part="empty">No commands to display.</p>`)}
      </section>
    `
});
