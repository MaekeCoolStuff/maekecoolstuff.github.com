import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
import { stringFormEvents } from "../ui-component-shared.js";
defineComponent("docs-color-picker-example", {
  template: ()=>html`
      <div class="control-grid">
        <nala-color-picker label="Backlog tag color" value="#184d3b"
          hint="Choose a color for your Game Shelf backlog tag."></nala-color-picker>
        <div>
          <span class="game-tag">Backlog</span>
          <p class="color-description">Current tag color: #184d3b</p>
        </div>
      </div>
    `,
  onConnect: ({ query, listen })=>{
    const picker = query("nala-color-picker");
    const tag = query(".game-tag");
    const description = query(".color-description");
    if (!picker || !tag || !description) {
      throw new Error("Color picker example is missing its controls");
    }
    tag.style.borderLeft = "0.5rem solid #184d3b";
    tag.style.paddingLeft = "0.5rem";
    listen(picker, "input", (event)=>{
      const { value } = event.detail;
      tag.style.borderLeftColor = value;
      description.textContent = `Current tag color: ${value}`;
    });
  }
});
export const doc = {
  slug: "color-picker",
  title: "Color picker",
  tag: "<nala-color-picker>",
  summary: "Choose a color for a Game Shelf collection tag.",
  description: "A labelled native color input opens the browser's color chooser. Use it for personalizing tag colors or collection accents. The visible hex value updates as you choose; the application decides where to use or save that color.",
  usage: `<nala-color-picker id="tag-color" label="Backlog tag color"
  hint="Choose an accent for this collection tag."
  value="#184d3b"></nala-color-picker>

const picker = document.querySelector("#tag-color");
const tag = document.querySelector<HTMLElement>(".game-tag");
picker?.addEventListener("input", (event) => {
  const { value } = (event as CustomEvent<{ value: string }>).detail;
  if (tag) tag.style.borderLeftColor = value;
});`,
  preview: ()=>html`
      <docs-color-picker-example></docs-color-picker-example>
      <nala-color-picker label="Locked wishlist color" value="#a43f35"
        hint="This collection's color cannot be changed."
        disabled></nala-color-picker>
    `,
  api: [
    {
      name: "value",
      type: "string property / attribute",
      defaultValue: '"#000000"',
      description: "Six-digit hex color such as #184d3b. Uppercase is accepted; display and user events use lowercase. Other formats throw RangeError. Removing the attribute restores black."
    },
    {
      name: "label",
      type: "string property / attribute",
      defaultValue: "null",
      description: "Visible accessible name associated with the native input. Always supply a meaningful label."
    },
    {
      name: "hint",
      type: "string property / attribute",
      defaultValue: "null",
      description: "Optional supporting text connected to the input by aria-describedby."
    },
    {
      name: "name",
      type: "string property / attribute",
      defaultValue: "null",
      description: "Forwarded to the internal input. The host is not form-associated and does not submit a native form value."
    },
    {
      name: "disabled",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Disables the native color chooser."
    }
  ],
  slots: [],
  events: stringFormEvents,
  parts: [
    "field",
    "label",
    "control",
    "value",
    "hint"
  ]
};
export const lessons = [
  {
    title: "Start with a color the browser can represent",
    explanation: "Use an opaque six-digit RGB hex value. For example, #184d3b contains red, green, and blue channel values. This component deliberately excludes alpha, shorthand colors, named colors, and other color spaces. With no value it defaults to black (#000000).",
    code: `<nala-color-picker label="Backlog tag color"
  value="#184d3b"></nala-color-picker>`
  },
  {
    title: "Preview now, save on confirmation",
    explanation: "Listen to input for live previews and change for the browser's confirmed choice. Both events bubble across Shadow DOM, carry a lowercase hex string in detail.value, and reflect the chosen value on the host before listeners run. The chooser's appearance and when it emits events are browser and operating-system dependent.",
    code: `picker.addEventListener("input", (event) => {
  const { value } = (event as CustomEvent<{ value: string }>).detail;
  tag.style.borderLeftColor = value;
});

picker.addEventListener("change", (event) => {
  const { value } = (event as CustomEvent<{ value: string }>).detail;
  // In the surrounding Game Shelf app, persist value with your tag action.
  console.log("Confirmed tag color:", value);
});`
  },
  {
    title: "Restore a saved tag color",
    explanation: "Import the element type to get typed property access. Assigning value updates the input and hex display without emitting user input or change events. Keep text contrast and non-color labels in mind: color should supplement a tag name, not replace it.",
    code: `import type { NalaColorPickerElement } from "../../vendor/ui-components/dist/index.js";

const picker = document.querySelector<NalaColorPickerElement>("#tag-color");
if (picker) picker.value = "#a43f35";`
  }
];
