import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "list-view",
  title: "List view",
  tag: "<nala-list-view> + <nala-list-item>",
  summary: "Scan a game collection with optional cover art, descriptions, and row actions.",
  description: "Use for a dense, scannable collection or search-results view. The list view provides an accessible list name and responsive layout; each list item provides an optional image and dedicated title, description, and actions slots. Content and action behavior remain app-owned.",
  usage: `<nala-list-view label="Your game collection">
  <nala-list-item
    image="https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_600x900.jpg"
    image-alt="Hollow Knight cover art"
  >
    <span slot="title">Hollow Knight</span>
    <span slot="description">Backlog · Nintendo Switch</span>
    <nala-button slot="actions" variant="secondary">View game</nala-button>
    <details slot="actions">
      <summary>More</summary>
      <button type="button">Add to wishlist</button>
    </details>
  </nala-list-item>
  <nala-list-item>
    <span slot="title">Celeste</span>
    <span slot="description">Completed · PC</span>
    <nala-button slot="actions" variant="ghost">View game</nala-button>
  </nala-list-item>
</nala-list-view>`,
  preview: ()=>html`
      <nala-list-view label="Your game collection">
        <nala-list-item
          image="https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_600x900.jpg"
          image-alt="Hollow Knight cover art"
        >
          <span slot="title">Hollow Knight</span>
          <span slot="description">Backlog · Nintendo Switch</span>
          <nala-button slot="actions" variant="secondary">View game</nala-button>
          <nala-context-menu slot="actions" label="Hollow Knight actions"
            trigger-label="More Hollow Knight actions" trigger-text="...">
            <nala-context-menu-item label="Add to wishlist" value="wishlist">
              <svg slot="icon" aria-hidden="true" viewBox="0 0 16 16" fill="none"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round">
                <path
                  d="m8 1.5 2 4.2 4.6.6-3.3 3.2.8 4.5L8 11.8l-4.1 2.2.8-4.5-3.3-3.2L6 5.7 8 1.5Z" />
              </svg>
            </nala-context-menu-item>
            <nala-context-menu-item label="Remove from collection"
              value="remove" variant="danger">
              <svg slot="icon" aria-hidden="true" viewBox="0 0 16 16" fill="none"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4.5 4.5l.6 9h5.8l.6-9" />
                <path d="M6.5 7v4M9.5 7v4" />
              </svg>
            </nala-context-menu-item>
          </nala-context-menu>
        </nala-list-item>
        <nala-list-item>
          <span slot="title">Celeste</span>
          <span slot="description">Completed · PC</span>
          <nala-button slot="actions" variant="ghost">View game</nala-button>
        </nala-list-item>
      </nala-list-view>
    `,
  api: [
    {
      name: "nala-list-view label",
      type: "string attribute / property",
      defaultValue: '"Items"',
      description: "Accessible name for the list."
    },
    {
      name: "nala-list-item image",
      type: "string attribute",
      defaultValue: '""',
      description: "Optional image URL; the image region is omitted when empty."
    },
    {
      name: "nala-list-item image-alt",
      type: "string attribute",
      defaultValue: '""',
      description: "Alternative text for informative cover art; use empty text when the image is decorative."
    }
  ],
  slots: [
    {
      name: "default",
      description: "nala-list-view accepts nala-list-item children."
    },
    {
      name: "title",
      description: "Visible row title content."
    },
    {
      name: "description",
      description: "Optional supporting row text."
    },
    {
      name: "actions",
      description: "Optional buttons, links, or menus."
    }
  ],
  events: [],
  parts: [
    "list",
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
    title: "Compose a game row from meaningful content",
    explanation: "The list view owns list semantics and row layout. Each list item keeps title, description, and actions as native slotted content, while image and image-alt are optional attributes.",
    code: `<nala-list-view label="Your game collection">
  <nala-list-item
    image="https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_600x900.jpg"
    image-alt="Hollow Knight cover art"
  >
    <span slot="title">Hollow Knight</span>
    <span slot="description">Backlog · Nintendo Switch</span>
    <nala-button slot="actions" variant="secondary">View game</nala-button>
  </nala-list-item>
</nala-list-view>`
  },
  {
    title: "Use native controls for secondary actions",
    explanation: "The actions slot can contain a primary link or button and a context menu. The list item lays them out but does not take ownership of their behavior.",
    code: `<nala-list-item>
  <span slot="title">Celeste</span>
  <span slot="description">Completed · PC</span>
  <nala-button slot="actions" variant="secondary">View game</nala-button>
  <nala-context-menu slot="actions" label="Celeste actions" trigger-text="...">
    <nala-context-menu-item label="Add to wishlist" value="wishlist">
      <svg slot="icon" aria-hidden="true" viewBox="0 0 16 16" fill="none"
        stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round">
        <path d="m8 1.5 2 4.2 4.6.6-3.3 3.2.8 4.5L8 11.8l-4.1 2.2.8-4.5-3.3-3.2L6 5.7 8 1.5Z" />
      </svg>
    </nala-context-menu-item>
    <nala-context-menu-item label="Remove from collection" value="remove"
      variant="danger">
      <svg slot="icon" aria-hidden="true" viewBox="0 0 16 16" fill="none"
        stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4.5 4.5l.6 9h5.8l.6-9" />
        <path d="M6.5 7v4M9.5 7v4" />
      </svg>
    </nala-context-menu-item>
  </nala-context-menu>
</nala-list-item>`
  }
];
