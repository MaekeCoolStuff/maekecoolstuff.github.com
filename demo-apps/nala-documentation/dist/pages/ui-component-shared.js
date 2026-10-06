import { defineComponent, html } from "../../../../vendor/components/dist/index.js";
export const stringFormEvents = [
  {
    name: "input",
    type: "CustomEvent<{ value: string }>",
    description: "Bubbles and is composed; reports the in-progress value."
  },
  {
    name: "change",
    type: "CustomEvent<{ value: string }>",
    description: "Bubbles and is composed; reports the confirmed value."
  }
];
export const checkboxEvents = [
  {
    name: "input",
    type: "CustomEvent<{ value: boolean }>",
    description: "Bubbles and is composed; reports the in-progress checked state."
  },
  {
    name: "change",
    type: "CustomEvent<{ value: boolean }>",
    description: "Bubbles and is composed; reports the confirmed checked state."
  }
];
export const formState = [
  {
    name: "value",
    type: "string property / attribute",
    defaultValue: '""',
    description: "Current value."
  },
  {
    name: "disabled",
    type: "boolean property / attribute",
    defaultValue: "false",
    description: "Disables the native control."
  },
  {
    name: "required",
    type: "boolean property / attribute",
    defaultValue: "false",
    description: "Marks the native control as required."
  }
];
export const gameTypeExample = `type Game = {
  id: string;
  title: string;
  platformId: string;
  status: "wishlist" | "backlog" | "playing" | "completed";
};`;
export const tableGames = [
  {
    title: "Hollow Knight",
    platform: "PC",
    status: "Playing"
  },
  {
    title: "Sea of Stars",
    platform: "Switch",
    status: "Backlog"
  },
  {
    title: "Celeste",
    platform: "PC",
    status: "Completed"
  },
  {
    title: "Hades",
    platform: "Switch",
    status: "Wishlist"
  },
  {
    title: "Tunic",
    platform: "PC",
    status: "Backlog"
  }
];
export const tableColumns = [
  {
    key: "title",
    label: "Game"
  },
  {
    key: "platform",
    label: "Platform"
  },
  {
    key: "status",
    label: "Play status"
  }
];
defineComponent("docs-server-table-example", {
  template: ()=>html`
      <nala-table label="Server-paged Game Shelf" paging="server" page-size="2"
        .total=${tableGames.length} .columns=${tableColumns}
        .rows=${tableGames.slice(0, 2)}></nala-table>
    `,
  onConnect: ({ query, listen })=>{
    const table = query("nala-table");
    if (!table) throw new Error("Server table example is missing its table");
    listen(table, "page-change", (event)=>{
      const { offset, pageSize } = event.detail;
      table.rows = tableGames.slice(offset, offset + pageSize);
    });
  }
});
defineComponent("docs-playing-card-example", {
  template: ()=>html`
      <div class="button-row">
        <nala-playing-card rank="Q" suit="hearts"></nala-playing-card>
        <button type="button" aria-pressed="false">Hide card</button>
      </div>
    `,
  onConnect: ({ query, listen })=>{
    const card = query("nala-playing-card");
    const button = query("button");
    if (!card || !button) {
      throw new Error("Playing-card example is missing its controls");
    }
    listen(button, "click", ()=>{
      card.faceDown = !card.faceDown;
      button.textContent = card.faceDown ? "Reveal card" : "Hide card";
      button.setAttribute("aria-pressed", String(card.faceDown));
    });
  }
});
