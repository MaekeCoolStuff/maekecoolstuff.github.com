import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "grid-view",
  title: "Grid view",
  tag: "<nala-grid-view> + <nala-grid-item>",
  summary: "Browse a game collection as responsive, square, or masonry tiles.",
  description: "Use when cover art and visual browsing should lead. The grid shares the list view's item content contract: a labelled collection of image-optional tiles with title, description, and actions slots. Choose the default grid, 1:1 square tiles, or CSS-column masonry for variable-height content.",
  usage: `<nala-grid-view label="Your game collection">
  <nala-grid-item
    image="https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_600x900.jpg"
    image-alt="Hollow Knight cover art"
  >
    <span slot="title">Hollow Knight</span>
    <span slot="description">Backlog · Nintendo Switch</span>
    <nala-button slot="actions" variant="secondary">View game</nala-button>
  </nala-grid-item>
  <nala-grid-item>
    <span slot="title">Celeste</span>
    <span slot="description">Completed · PC</span>
    <nala-button slot="actions" variant="ghost">View game</nala-button>
  </nala-grid-item>
</nala-grid-view>`,
  preview: ()=>html`
      <p>Responsive grid</p>
      <nala-grid-view label="Your game collection">
        <nala-grid-item
          class="square-menu"
          image="https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_600x900.jpg"
          image-alt="Hollow Knight cover art"
        >
          <span slot="title">Hollow Knight</span>
          <span slot="description">Backlog · Nintendo Switch</span>
          <nala-button slot="actions" variant="secondary">View game</nala-button>
          <nala-context-menu slot="actions" label="Hollow Knight actions"
            trigger-label="More Hollow Knight actions" trigger-text="...">
            <nala-context-menu-item label="Add to wishlist" value="wishlist">
              <span slot="icon" aria-hidden="true">+</span>
            </nala-context-menu-item>
            <nala-context-menu-item label="Remove from collection"
              value="remove" variant="danger">
              <span slot="icon" aria-hidden="true">×</span>
            </nala-context-menu-item>
          </nala-context-menu>
        </nala-grid-item>
        <nala-grid-item>
          <span slot="title">Celeste</span>
          <span slot="description">Completed · PC</span>
          <nala-button slot="actions" variant="ghost">View game</nala-button>
        </nala-grid-item>
      </nala-grid-view>

      <p>Square tiles</p>
      <nala-grid-view label="Square game collection" layout="square">
        <nala-grid-item
          class="square-menu"
          image="https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_600x900.jpg"
          image-alt="Hollow Knight cover art">
          <span slot="title">Hollow Knight</span>
          <div slot="description" class="grid-square-description">
            <span>Backlog · Nintendo Switch</span>
            <nala-context-menu label="Hollow Knight actions"
              trigger-label="More Hollow Knight actions" trigger-text="...">
              <nala-context-menu-item label="Add to wishlist" value="wishlist">
                <span slot="icon" aria-hidden="true">+</span>
              </nala-context-menu-item>
              <nala-context-menu-item label="Remove from collection"
                value="remove" variant="danger">
                <span slot="icon" aria-hidden="true">×</span>
              </nala-context-menu-item>
            </nala-context-menu>
          </div>
        </nala-grid-item>
        <nala-grid-item>
          <span slot="title">Celeste</span>
          <span slot="description">Completed · PC</span>
        </nala-grid-item>
      </nala-grid-view>

      <p>Masonry</p>
      <nala-grid-view label="Recent games" layout="masonry">
        <nala-grid-item
          image="https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_600x900.jpg"
          image-alt="Hollow Knight cover art">
          <span slot="title">Hollow Knight</span>
          <span slot="description">Backlog</span>
        </nala-grid-item>
        <nala-grid-item>
          <span slot="title">Celeste</span>
          <span
            slot="description">Completed · A longer note makes this tile taller than its neighbors.</span>
        </nala-grid-item>
        <nala-grid-item>
          <span slot="title">Sea of Stars</span>
          <span slot="description">Playing</span>
        </nala-grid-item>
      </nala-grid-view>
    `,
  api: [
    {
      name: "nala-grid-view label",
      type: "string attribute / property",
      defaultValue: '"Items"',
      description: "Accessible name for the grid list."
    },
    {
      name: "nala-grid-view layout",
      type: '"grid" | "square" | "masonry" attribute / property',
      defaultValue: '"grid"',
      description: "Selects responsive rows, 1:1 tiles, or variable-height CSS columns."
    },
    {
      name: "nala-grid-item image",
      type: "string attribute",
      defaultValue: '""',
      description: "Optional image URL; the portrait image area is omitted when empty."
    },
    {
      name: "nala-grid-item image-alt",
      type: "string attribute",
      defaultValue: '""',
      description: "Alternative text for informative cover art; use empty text when decorative."
    }
  ],
  slots: [
    {
      name: "default",
      description: "nala-grid-view accepts nala-grid-item children."
    },
    {
      name: "title",
      description: "Visible tile title content."
    },
    {
      name: "description",
      description: "Optional supporting text."
    },
    {
      name: "actions",
      description: "Optional buttons, links, or menus."
    }
  ],
  events: [],
  parts: [
    "grid",
    "item",
    "media",
    "content",
    "title",
    "description",
    "actions"
  ]
};
export const lessons = [
  {
    title: "Browse games as visual tiles",
    explanation: "Grid view uses the same image, title, description, and actions options as list view, but arranges items into responsive columns for cover-led browsing.",
    code: `<nala-grid-view label="Your game collection">
  <nala-grid-item
    image="https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_600x900.jpg"
    image-alt="Hollow Knight cover art"
  >
    <span slot="title">Hollow Knight</span>
    <span slot="description">Backlog · Nintendo Switch</span>
    <nala-button slot="actions" variant="secondary">View game</nala-button>
  </nala-grid-item>
</nala-grid-view>`
  },
  {
    title: "Keep artwork optional and actions app-owned",
    explanation: "Tiles without an image keep the same title and description structure. Put links, buttons, or a context menu in the actions slot; the grid only controls layout.",
    code: `<nala-grid-item>
  <span slot="title">Celeste</span>
  <span slot="description">Completed · PC</span>
  <nala-button slot="actions" variant="ghost">View game</nala-button>
</nala-grid-item>`
  },
  {
    title: "Make every tile square",
    explanation: "Square mode fixes the complete tile at 1:1, including items without art. Cover art fills the image area using object-fit: cover, so choose images that can be safely cropped.",
    code: `<nala-grid-view label="Collection" layout="square">
  <nala-grid-item
    image="https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_600x900.jpg"
    image-alt="Hollow Knight cover art"
  >
    <span slot="title">Hollow Knight</span>
    <div slot="description" class="grid-square-description">
      <span>Backlog · Nintendo Switch</span>
      <nala-context-menu label="Hollow Knight actions"
        trigger-label="More Hollow Knight actions" trigger-text="...">
        <nala-context-menu-item label="Add to wishlist" value="wishlist">
          <span slot="icon" aria-hidden="true">+</span>
        </nala-context-menu-item>
        <nala-context-menu-item label="Remove from collection" value="remove"
          variant="danger">
          <span slot="icon" aria-hidden="true">×</span>
        </nala-context-menu-item>
      </nala-context-menu>
    </div>
  </nala-grid-item>
  <nala-grid-item>
    <span slot="title">Celeste</span>
    <span slot="description">Completed · PC</span>
  </nala-grid-item>
</nala-grid-view>`
  },
  {
    title: "Let masonry fill variable-height gaps",
    explanation: "Masonry uses CSS columns to pack variable-height tiles vertically. Source and keyboard order remain in document order, top-to-bottom within each column.",
    code: `<nala-grid-view label="Backlog" layout="masonry">
  <nala-grid-item>...</nala-grid-item>
  <nala-grid-item>...</nala-grid-item>
  <nala-grid-item>...</nala-grid-item>
</nala-grid-view>`
  }
];
