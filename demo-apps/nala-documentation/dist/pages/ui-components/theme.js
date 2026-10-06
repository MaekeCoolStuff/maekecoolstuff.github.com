import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "theme",
  title: "Themes and design tokens",
  tag: "Theme helpers",
  summary: "Give game cards, status badges, and actions one consistent visual language.",
  description: "Use theme tokens to give Game Shelf one consistent visual language. Components inherit CSS custom properties even inside Shadow DOM; helpers fill unspecified values from the complete default theme.",
  usage: `import {
  applyNalaTheme,
  createThemeProperties,
  nalaDefaultTheme,
} from "../../vendor/ui-components/dist/index.js";

applyNalaTheme(document.documentElement, {
  colorAccent: "#2b6948",
  colorAccentStrong: "#1b4931",
  colorAccentSoft: "#dcebdd",
});

console.log(nalaDefaultTheme.colorAccent);
const gameShelfTokens = createThemeProperties({ colorDanger: "#9b382e" });`,
  preview: ()=>html`
      <nala-card
        variant="accent"><span slot="eyebrow">Game Shelf theme</span><span slot="title">Your collection</span><p>Shared tokens keep game cards, status badges, and actions visually consistent.</p><div slot="actions" class="button-row"><nala-badge tone="success">Completed</nala-badge><nala-button variant="secondary">View library</nala-button></div></nala-card>
    `,
  api: [
    {
      name: "nalaDefaultTheme",
      type: "Readonly<NalaUiTheme>",
      defaultValue: "exported constant",
      description: "Complete default theme in TypeScript property form."
    },
    {
      name: "createThemeProperties(overrides?)",
      type: "function",
      defaultValue: "all defaults",
      description: "Returns all CSS tokens with optional partial overrides."
    },
    {
      name: "applyNalaTheme(target, overrides?)",
      type: "function",
      defaultValue: "all defaults",
      description: "Writes the complete token set through target.style.setProperty()."
    },
    {
      name: "NalaUiTheme",
      type: "interface",
      defaultValue: "17 string properties",
      description: "Typed theme values accepted by both helpers."
    },
    {
      name: "NalaThemeProperties",
      type: "type",
      defaultValue: "CSS property map",
      description: "Record of --nala-ui-* names to string values."
    },
    {
      name: "colorCanvas / colorSurface / colorSurfaceMuted",
      type: "color",
      defaultValue: "#f2f0e8 / #fffefa / #f7f7f2",
      description: "Page canvas and surface colors."
    },
    {
      name: "colorText / colorTextMuted / colorBorder",
      type: "color",
      defaultValue: "#18201d / #68716c / #cbcfc8",
      description: "Text and outline colors."
    },
    {
      name: "colorAccent / colorAccentStrong / colorAccentSoft",
      type: "color",
      defaultValue: "#184d3b / #10372a / #d8e8df",
      description: "Primary interaction and emphasis colors."
    },
    {
      name: "colorWarning / colorDanger",
      type: "color",
      defaultValue: "#f0b84b / #a43f35",
      description: "Semantic warning and danger colors."
    },
    {
      name: "fontBody / fontDisplay",
      type: "CSS font-family",
      defaultValue: "Avenir Next / Baskerville",
      description: "Body and display typography."
    },
    {
      name: "radiusSmall / radiusMedium / radiusLarge",
      type: "CSS length",
      defaultValue: "4px / 6px / 8px",
      description: "Shared component corner radii."
    },
    {
      name: "shadowRaised",
      type: "CSS box-shadow",
      defaultValue: "0 1.25rem 3.5rem rgba(35, 48, 42, 0.12)",
      description: "Elevation used by raised surfaces."
    }
  ],
  slots: [],
  events: [],
  parts: []
};
export const lessons = [
  {
    title: "Set the app-wide visual language",
    explanation: "applyNalaTheme merges your partial overrides with the full default theme, then writes every CSS custom property to the target element.",
    code: `applyNalaTheme(document.documentElement, {
  colorAccent: "#2b6948",
  colorAccentStrong: "#1b4931",
  colorAccentSoft: "#dcebdd",
});`
  },
  {
    title: "Scope a theme to one game collection panel",
    explanation: "CSS custom properties inherit through Shadow DOM. Apply tokens to a host when a special collection area needs its own accent.",
    code: `const wishlist = document.querySelector<HTMLElement>(".wishlist-panel");
    if (wishlist) applyNalaTheme(wishlist, { colorAccent: "#a04c25" });`
  }
];
