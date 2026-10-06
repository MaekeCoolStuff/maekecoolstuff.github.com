import { defineComponent, html } from "../../../components/dist/index.js";
import { iconDefinition } from "./icon-data.js";
defineComponent("nala-icon", {
  shadow: true,
  props: {
    name: "string",
    label: "string"
  },
  styles: ":host {\n  display: inline-flex;\n  width: 1em;\n  height: 1em;\n  flex: 0 0 auto;\n  vertical-align: -0.125em;\n}\n\nsvg {\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n",
  template: (props)=>{
    const icon = iconDefinition(props.name);
    const label = icon ? props.label?.trim() || null : null;
    return html`
      <svg
        part="icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill=${icon?.fill ?? "none"}
        fill-rule="evenodd"
        stroke=${icon?.stroke ?? "currentColor"}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        focusable="false"
        role=${label ? "img" : null}
        aria-label=${label}
        aria-hidden=${label ? null : "true"}
      >
        <path d=${icon?.path ?? null}></path>
      </svg>
    `;
  }
});
