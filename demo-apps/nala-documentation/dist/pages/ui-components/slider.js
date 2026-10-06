import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "slider",
  title: "Slider",
  tag: "<nala-slider>",
  summary: "Choose an approximate numeric value, such as a game's rating or play-time filter.",
  description: "Use a slider when a value is easier to choose by feel than by typing exactly. It wraps a native range input, so pointer, touch, keyboard, focus, and assistive-technology behavior come from the browser.",
  usage: `import type { NalaSliderElement } from "../../vendor/ui-components/dist/index.js";

<nala-slider id="minimum-rating" label="Minimum rating"
  min="1" max="10" step="1" value="7"></nala-slider>

const rating = document.querySelector("#minimum-rating") as
  NalaSliderElement | null;
rating?.addEventListener("input", (event) => {
  const { value } = (event as CustomEvent<{ value: number }>).detail;
  visibleGames = games.filter((game) => game.rating >= value);
});`,
  preview: ()=>html`
      <div class="control-grid">
        <nala-slider label="Minimum rating" min="1" max="10" step="1"
          value="7"></nala-slider>
        <nala-slider label="Weekly play-time filter"
          hint="Show games estimated at or below this many hours."
          min="0" max="100" step="5" value="35"></nala-slider>
      </div>
    `,
  api: [
    {
      name: "label",
      type: "string attribute",
      defaultValue: '""',
      description: "Visible label associated with the native range input; provide one for an accessible name."
    },
    {
      name: "hint",
      type: "string attribute",
      defaultValue: '""',
      description: "Supporting text below the slider."
    },
    {
      name: "name",
      type: "string attribute",
      defaultValue: '""',
      description: "Name forwarded to the native range input."
    },
    {
      name: "value",
      type: "number property / attribute",
      defaultValue: "native range midpoint",
      description: "Current numeric value. When omitted, the browser chooses the native range midpoint."
    },
    {
      name: "min",
      type: "number property / attribute",
      defaultValue: "0",
      description: "Lower bound; the native range input supplies the default."
    },
    {
      name: "max",
      type: "number property / attribute",
      defaultValue: "100",
      description: "Upper bound; the native range input supplies the default."
    },
    {
      name: "step",
      type: "number property / attribute",
      defaultValue: "1",
      description: "Allowed step size; the native range input supplies the default."
    },
    {
      name: "disabled",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Disables the native range input."
    }
  ],
  slots: [],
  events: [
    {
      name: "input",
      type: "CustomEvent<{ value: number }>",
      description: "Bubbles and is composed; reports and reflects each in-progress value."
    },
    {
      name: "change",
      type: "CustomEvent<{ value: number }>",
      description: "Bubbles and is composed; reports and reflects the confirmed value."
    }
  ],
  parts: [
    "field",
    "label",
    "control",
    "hint"
  ]
};
export const lessons = [
  {
    title: "Choose a useful scale",
    explanation: "Set min, max, and step to match the domain. The browser handles the input mechanics, while the component reports a number instead of the native input's string.",
    code: `<nala-slider id="minimum-rating" label="Minimum rating"
  min="1" max="10" step="1" value="7"></nala-slider>`
  },
  {
    title: "React while the thumb moves",
    explanation: "The bubbling input event carries a numeric detail.value on every adjustment. Read it to update a filtered collection or a nearby value display.",
    code: `const rating = document.querySelector("#minimum-rating");

rating?.addEventListener("input", (event) => {
  const { value } = (event as CustomEvent<{ value: number }>).detail;
  visibleGames = games.filter((game) => game.rating >= value);
});`
  },
  {
    title: "Set the value from application code",
    explanation: "Assign the number through the public value property. The component reflects it to its value attribute and updates the native input.",
    code: `rating.value = 8;
console.log(rating.value); // 8`
  }
];
