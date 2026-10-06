import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "tooltip",
  title: "Tooltip",
  tag: "<nala-tooltip>",
  summary: "Show short supplementary help on hover or keyboard focus.",
  description: "Attach a concise hint to a visible trigger. The tooltip appears while the trigger is hovered or contains focus, and its text is connected to slotted trigger elements with aria-describedby. Keep essential information visible elsewhere.",
  usage: `<nala-tooltip text="Games you have not started yet">
  <button type="button">Backlog</button>
</nala-tooltip>

<nala-tooltip text="View collection summary" position="right">
  <button type="button" aria-label="Collection summary">?</button>
</nala-tooltip>`,
  preview: ()=>html`
      <div class="button-row">
        <nala-tooltip text="Games you have not started yet">
          <button type="button">Backlog</button>
        </nala-tooltip>
        <nala-tooltip text="View collection summary" position="right">
          <button type="button" aria-label="Collection summary">?</button>
        </nala-tooltip>
      </div>
    `,
  api: [
    {
      name: "text",
      type: "string property / attribute",
      defaultValue: '""',
      description: "Short supplementary message. Whitespace is trimmed and content is rendered as text."
    },
    {
      name: "position",
      type: '"top" | "right" | "bottom" | "left" property / attribute',
      defaultValue: '"top"',
      description: "Preferred side of the trigger. Unknown or absent values use top."
    },
    {
      name: "CSS custom properties",
      type: "--nala-tooltip-background / --nala-tooltip-color / --nala-tooltip-max-width",
      defaultValue: "theme text / theme surface / min(18rem, viewport width - 2rem)",
      description: "Customize the tooltip surface, text, or maximum width. The trigger is also available as ::part(trigger)."
    }
  ],
  slots: [
    {
      name: "default",
      description: "Visible trigger, usually a button or a link."
    }
  ],
  events: [],
  parts: [
    "trigger"
  ]
};
export const lessons = [];
