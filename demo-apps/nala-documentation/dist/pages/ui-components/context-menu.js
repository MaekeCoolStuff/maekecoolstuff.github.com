import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "context-menu",
  title: "Context menu",
  tag: "<nala-context-menu> + <nala-context-menu-item>",
  summary: "Offer polished per-game actions in a compact, keyboard-accessible popup.",
  description: "Use for secondary actions on a game row, card, or other focused object. The menu owns popup state, focus, outside dismissal, and keyboard navigation; each item can be a command or link, with optional icon and shortcut slots.",
  usage: `<nala-context-menu label="Hollow Knight actions"
  trigger-label="More Hollow Knight actions" trigger-text="...">
  <nala-context-menu-item label="Edit game" value="edit">
    <span slot="icon" aria-hidden="true">✎</span>
    <span slot="shortcut">E</span>
  </nala-context-menu-item>
  <nala-context-menu-item label="Open game page" href="/games/hollow-knight">
    <span slot="icon" aria-hidden="true">↗</span>
  </nala-context-menu-item>
  <nala-context-menu-item label="Remove from collection" value="remove"
    variant="danger">
    <span slot="icon" aria-hidden="true">×</span>
  </nala-context-menu-item>
</nala-context-menu>

const actions = document.querySelector("nala-context-menu");
actions?.addEventListener("select", (event) => {
  const { value } = (event as CustomEvent<{ value: string }>).detail;
  if (value === "remove") collection.actions.removeGame("g-17");
});`,
  preview: ()=>html`
      <nala-context-menu label="Hollow Knight actions"
        trigger-label="More Hollow Knight actions" trigger-text="...">
        <nala-context-menu-item label="Edit game" value="edit">
          <span slot="icon" aria-hidden="true">✎</span>
          <span slot="shortcut">E</span>
        </nala-context-menu-item>
        <nala-context-menu-item label="Open game page"
          href="/games/hollow-knight">
          <span slot="icon" aria-hidden="true">↗</span>
        </nala-context-menu-item>
        <nala-context-menu-item label="Remove from collection"
          value="remove" variant="danger">
          <span slot="icon" aria-hidden="true">×</span>
        </nala-context-menu-item>
      </nala-context-menu>
    `,
  api: [
    {
      name: "nala-context-menu label",
      type: "string attribute / property",
      defaultValue: '"Actions"',
      description: "Accessible name for the popup menu."
    },
    {
      name: "nala-context-menu trigger-label",
      type: "string attribute / property",
      defaultValue: '"More actions"',
      description: "Accessible name for the menu trigger button."
    },
    {
      name: "nala-context-menu-item label",
      type: "string attribute / property",
      defaultValue: '"Action"',
      description: "Visible action text and accessible menu-item name."
    },
    {
      name: "nala-context-menu trigger-text",
      type: "string attribute / property",
      defaultValue: '"More"',
      description: "Visible trigger caption; set to ... for a compact text trigger while trigger-label stays descriptive."
    },
    {
      name: "nala-context-menu-item value",
      type: "string attribute / property",
      defaultValue: '""',
      description: "Command identifier returned by the select event."
    },
    {
      name: "nala-context-menu-item href",
      type: "string attribute",
      defaultValue: '""',
      description: "Opens a link instead of dispatching a command selection."
    },
    {
      name: "disabled / variant",
      type: 'boolean attribute / "default" | "danger"',
      defaultValue: "false / default",
      description: "Disables an unavailable action or emphasizes a destructive one."
    }
  ],
  slots: [
    {
      name: "default",
      description: "nala-context-menu-item elements."
    },
    {
      name: "trigger",
      description: "Optional trigger content, such as an icon."
    },
    {
      name: "icon",
      description: "Optional decorative icon in a menu item."
    },
    {
      name: "shortcut",
      description: "Optional keyboard shortcut hint."
    }
  ],
  events: [
    {
      name: "select",
      type: "CustomEvent<{ value: string }>",
      description: "Bubbles and is composed; emitted when an enabled command item is activated. Link items navigate and close without emitting this event."
    }
  ],
  parts: [
    "menu",
    "trigger"
  ]
};
export const lessons = [];
