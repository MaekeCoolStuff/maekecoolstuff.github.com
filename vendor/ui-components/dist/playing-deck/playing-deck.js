import { defineComponent, html } from "../../../components/dist/index.js";
import "../playing-card/playing-card.js";
defineComponent("nala-playing-deck", {
  shadow: true,
  props: {
    label: {
      type: "string",
      default: "Face-down playing deck"
    },
    decorative: "boolean"
  },
  styles: ":host {\n  display: inline-block;\n  width: var(--nala-playing-deck-width, var(--nala-playing-card-width, 7.5rem));\n  max-width: 100%;\n  vertical-align: middle;\n  line-height: 0;\n}\n.stack {\n  position: relative;\n  width: 100%;\n  aspect-ratio: 108 / 148;\n}\nnala-playing-card {\n  position: absolute;\n  width: calc(100% * 100 / 108);\n}\n.bottom { left: calc(100% * 8 / 108); top: calc(100% * 8 / 148); }\n.middle { left: calc(100% * 4 / 108); top: calc(100% * 4 / 148); }\n.top { left: 0; top: 0; }\n",
  template: (props)=>html`
      <div class="stack" part="stack"
        role=${props.decorative ? null : "img"}
        aria-hidden=${props.decorative ? "true" : null}
        aria-label=${props.decorative ? null : props.label.trim() || "Face-down playing deck"}>
        <nala-playing-card class="bottom" part="layer" face-down
          decorative></nala-playing-card>
        <nala-playing-card class="middle" part="layer" face-down
          decorative></nala-playing-card>
        <nala-playing-card class="top" part="top-card" face-down
          decorative></nala-playing-card>
      </div>
    `
});
