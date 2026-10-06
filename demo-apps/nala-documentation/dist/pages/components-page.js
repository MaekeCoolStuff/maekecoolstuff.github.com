import { defineComponent, html, repeat } from "../../../../vendor/components/dist/index.js";
import { uiComponentDocs, uiComponentReferenceRouter } from "./ui-component-page.js";
const componentCategories = [
  {
    slug: "controls",
    title: "Controls and forms",
    components: [
      "button",
      "input",
      "date-picker",
      "textarea",
      "file-upload",
      "checkbox",
      "slider",
      "color-picker",
      "pixel-art",
      "switch",
      "select",
      "combobox",
      "radio-group",
      "multiselect"
    ]
  },
  {
    slug: "navigation",
    title: "Navigation and interaction",
    components: [
      "dialog",
      "popover",
      "accordion",
      "context-menu",
      "tabs",
      "breadcrumbs",
      "nav-bar",
      "side-bar",
      "tooltip"
    ]
  },
  {
    slug: "collection",
    title: "Collection and content",
    components: [
      "pixel-art-gallery",
      "spritesheet",
      "level-editor",
      "guitar-neck",
      "playing-deck",
      "playing-card",
      "icon",
      "avatar",
      "table",
      "pagination",
      "list-view",
      "grid-view",
      "card"
    ]
  },
  {
    slug: "feedback",
    title: "Feedback and status",
    components: [
      "progress",
      "loading",
      "badge",
      "callout",
      "notification"
    ]
  },
  {
    slug: "customization",
    title: "Customization and code",
    components: [
      "theme",
      "code-block",
      "code-workspace",
      "file-tree",
      "process-flow",
      "terminal-transcript",
      "page-outline"
    ]
  }
];
export function createComponentsPage(selected = null) {
  const page = document.createElement("docs-components-page");
  if (selected) page.setAttribute("selected", selected);
  return page;
}
defineComponent("docs-components-page", {
  props: {
    selected: "string"
  },
  template: (props)=>html`
      <article class="docs-page">
        <div class="component-reference-layout">
          <router-outlet
            class="component-reference-outlet"
            aria-label="Selected component reference"
          ></router-outlet>

          <aside class="component-directory" aria-label="Component directory">
            <h2>Components</h2>
            ${repeat(componentCategories, (category)=>category.slug, (category)=>{
      const components = uiComponentDocs.filter((doc)=>category.components.some((slug)=>slug === doc.slug));
      const isActive = category.components.some((slug)=>slug === props.selected);
      return html`
                  <details class="component-category" ?open=${isActive}>
                    <summary>
                      ${category.title}
                      <span class="component-category-count">
                        ${components.length}
                      </span>
                    </summary>
                    <nav
                      class="component-doc-nav"
                      aria-label=${category.title}
                    >
                      ${repeat(components, (doc)=>doc.slug, (doc)=>html`
                            <a
                              href=${`/components/${doc.slug}`}
                              aria-current=${doc.slug === props.selected ? "page" : null}
                            >${doc.title}</a>
                          `)}
                    </nav>
                  </details>
                `;
    })}
          </aside>
        </div>
      </article>
    `,
  onConnect: ({ query, onCleanup })=>{
    const outlet = query("router-outlet");
    if (!outlet) {
      throw new Error("UI component page is missing its reference outlet");
    }
    let connected = true;
    onCleanup(()=>{
      connected = false;
    });
    queueMicrotask(()=>{
      if (!connected || !outlet.isConnected) return;
      uiComponentReferenceRouter.navigate(globalThis.location.pathname);
      outlet.router = uiComponentReferenceRouter;
    });
  }
});
