import { defineComponent, html, when } from "../../../components/dist/index.js";
import { avatarInitials } from "./avatar-initials.js";
function showAvatarFallback(event) {
  const image = event.currentTarget;
  if (!(image instanceof HTMLImageElement)) return;
  const fallback = image.nextElementSibling;
  if (!(fallback instanceof HTMLElement)) {
    throw new Error("Avatar image is missing its fallback element");
  }
  image.hidden = true;
  fallback.hidden = false;
}
defineComponent("nala-avatar", {
  shadow: true,
  props: {
    src: "string",
    name: "string",
    size: "string"
  },
  styles: ":host {\n  box-sizing: border-box;\n  color: var(--nala-ui-color-text, #18201d);\n  font-family: var(--nala-ui-font-body, \"Avenir Next\", \"Gill Sans\", sans-serif);\n}\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n:host {\n  --avatar-size: 2.5rem;\n  display: inline-flex;\n  width: var(--avatar-size);\n  height: var(--avatar-size);\n  flex: 0 0 auto;\n  vertical-align: middle;\n}\n\n:host([size=\"small\"]) {\n  --avatar-size: 2rem;\n}\n\n:host([size=\"large\"]) {\n  --avatar-size: 3.5rem;\n}\n\n.image,\n.fallback {\n  display: grid;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  place-items: center;\n  border-radius: 50%;\n  background: var(--nala-ui-color-accent-soft, #d8e8df);\n  color: var(--nala-ui-color-accent-strong, #10372a);\n}\n\n.image {\n  object-fit: cover;\n}\n\n.fallback[hidden],\n.image[hidden] {\n  display: none;\n}\n\n.initials {\n  font-size: calc(var(--avatar-size) * 0.34);\n  font-weight: 800;\n  line-height: 1;\n  text-transform: uppercase;\n}\n\n.placeholder {\n  width: 62%;\n  height: 62%;\n  fill: currentColor;\n}\n",
  template: (props)=>{
    const source = props.src?.trim() || null;
    const name = props.name?.trim() || null;
    const initials = avatarInitials(name);
    return html`
      <img
        class="image"
        part="image"
        src=${source}
        alt=${name || "Avatar"}
        ?hidden=${!source}
        @error=${showAvatarFallback}
      >
      <div
        class="fallback"
        part="fallback"
        role="img"
        aria-label=${name || "Avatar"}
        ?hidden=${Boolean(source)}
      >
        ${when(initials.length > 0, ()=>html`<span class="initials" part="initials" aria-hidden="true">${initials}</span>`, ()=>html`
              <svg
                class="placeholder"
                part="placeholder"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M12 12a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm0 2c-4.1 0-7.5 2.2-7.5 5v1.5h15V19c0-2.8-3.4-5-7.5-5Z"></path>
              </svg>
            `)}
      </div>
    `;
  },
  onAttributeChange: ({ query, props }, name)=>{
    if (name !== "src") return;
    const image = query(".image");
    const fallback = query(".fallback");
    if (!image || !fallback) {
      throw new Error("Avatar is missing its image or fallback element");
    }
    const hasSource = Boolean(props.src?.trim());
    image.hidden = !hasSource;
    fallback.hidden = hasSource;
  }
});
