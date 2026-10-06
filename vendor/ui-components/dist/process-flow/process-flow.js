import { defineComponent, html, repeat, when } from "../../../components/dist/index.js";
import { validateProcessSteps } from "./process-flow-data.js";
defineComponent("nala-process-flow", {
  shadow: true,
  styles: ":host {\n  display: block;\n  min-width: 0;\n  color: var(--nala-ui-color-text, #18201d);\n  container-type: inline-size;\n}\n* {\n  box-sizing: border-box;\n}\nsection {\n  min-width: 0;\n}\nheader {\n  margin-bottom: 1rem;\n  font: 700 1rem/1.5 system-ui, sans-serif;\n}\nol {\n  display: grid;\n  gap: .85rem;\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\nli {\n  position: relative;\n  min-width: 0;\n  padding: 1rem;\n  border: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  border-top: 3px solid var(--nala-ui-color-accent, #246c50);\n  border-radius: var(--nala-ui-radius-medium, 8px);\n  background: var(--nala-ui-color-surface, #fffefa);\n  font: .9rem/1.6 system-ui, sans-serif;\n  overflow-wrap: anywhere;\n}\n.step-heading {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: .65rem;\n  margin: -1rem -1rem 0;\n  padding: 1rem;\n  border-radius: inherit;\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0;\n  background: linear-gradient(\n    135deg,\n    var(--nala-ui-color-accent-soft, #d8e8df),\n    transparent 65%\n  );\n}\n.number {\n  display: inline-grid;\n  place-items: center;\n  flex-shrink: 0;\n  width: 1.6rem;\n  height: 1.6rem;\n  border-radius: 50%;\n  background: var(--nala-ui-color-surface, #fffefa);\n  border: 1px solid var(--nala-ui-color-accent, #246c50);\n  font: 600 .75rem/1.8 ui-monospace, monospace;\n  color: var(--nala-ui-color-text, #18201d);\n}\np {\n  margin: .65rem 0;\n}\n.location {\n  margin-left: auto;\n  padding: .15rem .5rem;\n  border-radius: 4px;\n  background: var(--nala-ui-color-surface-muted, #f7f7f2);\n  font-size: .75rem;\n  font-weight: 600;\n  color: var(--nala-ui-color-text-muted, #68716c);\n}\ndl {\n  display: grid;\n  gap: .5rem;\n  margin: 0;\n}\ndl > div {\n  min-width: 0;\n  padding: .5rem .65rem;\n  border-radius: 4px;\n  background: var(--nala-ui-color-surface-muted, #f7f7f2);\n}\ndt {\n  font-weight: 700;\n  font-size: .8rem;\n}\ndd {\n  margin: 0;\n  font: .8rem/1.6 ui-monospace, monospace;\n}\n.action {\n  border-left: 3px solid var(--nala-ui-color-accent, #246c50);\n  background: var(--nala-ui-color-accent-soft, #d8e8df);\n}\n.boundary {\n  margin-bottom: 0;\n  padding-top: .65rem;\n  border-top: 1px solid var(--nala-ui-color-border, #cbcfc8);\n  font-size: .8rem;\n}\n.empty {\n  color: var(--nala-ui-color-text-muted, #68716c);\n}\n@container (min-width: 40rem) {\n  ol {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    align-items: start;\n  }\n}\n",
  props: {
    label: {
      type: "string",
      default: "Process"
    }
  },
  properties: {
    steps: {
      default: ()=>[],
      validate: validateProcessSteps
    }
  },
  template: ({ steps, label })=>html`
      <section part="flow" aria-label=${label}>
        <header part="heading">${label}</header>
        ${when(steps.length > 0, ()=>html`
              <ol part="list">${repeat(steps, (step)=>step.id, (step, index)=>html`
                    <li part="step">
                      <div class="step-heading"><span class="number" aria-hidden="true">${index + 1}</span>
                        <strong part="title">${step.title}</strong>
                      ${when(step.location !== undefined, ()=>html`<span class="location" part="location">${step.location}</span>`)}
                      </div>
                      <p part="description">${step.description}</p>
                      <dl>
                        ${when(step.input !== undefined, ()=>html`
                            <div>
                              <dt>Input</dt>
                              <dd>${step.input}</dd>
                            </div>
                          `)}
                        ${when(step.action !== undefined, ()=>html`
                            <div class="action" part="action">
                              <dt>Action</dt>
                              <dd>${step.action}</dd>
                            </div>
                          `)}
                        ${when(step.output !== undefined, ()=>html`
                            <div>
                              <dt>Result</dt>
                              <dd>${step.output}</dd>
                            </div>
                          `)}
                      </dl>
                      ${when(step.boundary !== undefined, ()=>html`<p class="boundary" part="boundary">${step.boundary}</p>`)}
                    </li>
                  `)}</ol>
            `, ()=>html`<p class="empty" part="empty">No steps to display.</p>`)}
      </section>
    `
});
