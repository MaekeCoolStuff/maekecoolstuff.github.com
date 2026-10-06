import { defineComponent, html, repeat } from "../../../components/dist/index.js";
import { guitarNeckDescription, guitarNeckFrets, guitarStringNames, parseGuitarFingers, parseGuitarTab } from "./guitar-neck-data.js";
defineComponent("nala-guitar-neck", {
  shadow: true,
  props: {
    tab: {
      type: "string",
      default: "xxxxxx",
      validate: parseGuitarTab
    },
    fingers: {
      type: "string",
      default: "------",
      validate: parseGuitarFingers
    },
    label: {
      type: "string",
      default: "Guitar chord"
    }
  },
  styles: ":host {\n  display: block;\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  contain: inline-size;\n  color: var(--nala-ui-color-text, #18201d);\n  font-family: var(--nala-ui-font-body, system-ui, sans-serif);\n}\nfigure {\n  margin: 0;\n}\nfigcaption {\n  margin-bottom: 0.5rem;\n  font-weight: 700;\n}\n.viewport {\n  overflow-x: auto;\n  border-radius: var(--nala-ui-radius-small, 4px);\n}\n.viewport:focus-visible {\n  outline: 2px solid var(--nala-ui-color-accent, #184d3b);\n  outline-offset: 2px;\n}\nsvg {\n  overflow: visible;\n}\nsvg[part=\"neck\"] {\n  display: block;\n  width: 100%;\n  height: auto;\n}\ntext {\n  fill: currentColor;\n  text-anchor: middle;\n  font-size: 16px;\n}\n.fretboard {\n  fill: var(--nala-guitar-neck-board, #f0dfc0);\n}\n.fret {\n  stroke: var(--nala-guitar-neck-fret, #8c8170);\n}\n.string {\n  stroke: var(--nala-guitar-neck-string, #514b43);\n}\n.inlay {\n  fill: var(--nala-guitar-neck-inlay, #c5b18e);\n}\n.finger {\n  fill: var(--nala-guitar-neck-finger, var(--nala-ui-color-accent, #184d3b));\n}\n.finger-label {\n  fill: var(--nala-guitar-neck-finger-text, #fff);\n  font-size: 14px;\n  font-weight: 700;\n}\n.open {\n  fill: none;\n  stroke: currentColor;\n  stroke-width: 2;\n}\n.status,\n.string-label {\n  font-weight: 700;\n}\n@media (forced-colors: active) {\n  .fretboard {\n    fill: Canvas;\n  }\n  .fret,\n  .string,\n  .open {\n    stroke: CanvasText;\n  }\n  .inlay {\n    fill: GrayText;\n  }\n  .finger {\n    fill: Highlight;\n  }\n  .finger-label {\n    fill: HighlightText;\n  }\n}\n",
  template: ({ tab: input, fingers: inputFingers, label })=>{
    const tab = parseGuitarTab(input);
    const fingers = parseGuitarFingers(inputFingers);
    const frets = guitarNeckFrets(tab);
    const start = frets[0];
    const width = 84 + frets.length * 64 + 18;
    // Nested SVG roots keep separately parsed template fragments in the SVG namespace.
    return html`
      <figure part="figure">
        <figcaption part="caption">${label}</figcaption>
        <div part="viewport" class="viewport" tabindex="0" role="region"
          aria-label=${`${label}: scrollable fretboard`}>
          <svg part="neck" role="img" aria-label=${`${label}. ${guitarNeckDescription(tab, fingers)}`} viewBox=${`0 0 ${width} 250`}
            width=${width} height="250"
            focusable="false" style=${`min-width: ${width}px`}>
            <g aria-hidden="true">
              <rect part="fretboard" class="fretboard" x="84" y="35"
                width=${frets.length * 64} height="180" rx="4"></rect>
              ${repeat(frets.filter((fret)=>[
        3,
        5,
        7,
        9,
        12,
        15,
        17,
        19,
        21,
        24
      ].includes(fret)), (fret)=>fret, (fret)=>html`
                    <svg width=${width} height="250" aria-hidden="true" focusable="false">
                      <g part="inlay" class="inlay">
                        <circle cx=${84 + (fret - start + 0.5) * 64}
                          cy=${fret % 12 === 0 ? 95 : 125} r="5"></circle>
                        <circle cx=${84 + (fret - start + 0.5) * 64}
                          cy="155" r=${fret % 12 === 0 ? 5 : 0}></circle>
                      </g>
                    </svg>
                  `)}
              ${repeat([
      ...frets,
      frets.at(-1) + 1
    ], (fret)=>fret, (fret)=>html`
                    <svg width=${width} height="250" aria-hidden="true" focusable="false">
                      <line part=${fret === 1 ? "nut" : "fret"} class="fret"
                        x1=${84 + (fret - start) * 64} y1="35"
                        x2=${84 + (fret - start) * 64} y2="215"
                        stroke-width=${fret === 1 ? 6 : 2}></line>
                    </svg>
                  `)}
              ${repeat(frets, (fret)=>fret, (fret)=>html`
                  <svg width=${width} height="250" aria-hidden="true" focusable="false">
                    <text part="fret-label" class="fret-label"
                      x=${84 + (fret - start + 0.5) * 64} y="240">${fret}</text>
                  </svg>
                `)}
              ${repeat(guitarStringNames, (name)=>name, (name, index)=>{
      const fret = tab[index];
      const y = 50 + (5 - index) * 30;
      return html`
                  <svg width=${width} height="250" aria-hidden="true" focusable="false">
                    <text part="string-label" class="string-label" x="18" y=${y + 5}>
                      ${index === 0 ? "E" : index === 5 ? "e" : name}
                    </text>
                    <line part="string" class="string" x1="84" y1=${y}
                      x2=${width - 18} y2=${y} stroke-width=${1 + (5 - index) * 0.35}></line>
                    ${fret === null ? html`
                        <svg width=${width} height="250" aria-hidden="true" focusable="false">
                          <text part="muted" class="status" x="58" y=${y + 5}>X</text>
                        </svg>
                      ` : fret === 0 ? html`
                        <svg width=${width} height="250" aria-hidden="true" focusable="false">
                          <circle part="open" class="open" cx="58" cy=${y} r="7"></circle>
                        </svg>
                      ` : html`
                        <svg width=${width} height="250" aria-hidden="true" focusable="false">
                          <g part="position">
                            <circle part="finger" class="finger"
                              cx=${84 + (fret - start + 0.5) * 64} cy=${y} r="12"></circle>
                            <text part="finger-label" class="finger-label"
                              x=${84 + (fret - start + 0.5) * 64} y=${y + 5}>${fingers[index]}</text>
                          </g>
                        </svg>
                      `}
                  </svg>
                `;
    })}
            </g>
          </svg>
        </div>
      </figure>
    `;
  }
});
