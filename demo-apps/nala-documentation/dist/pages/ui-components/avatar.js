import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "avatar",
  title: "Avatar",
  tag: "<nala-avatar>",
  summary: "Identify a player or account with a consistent image or fallback.",
  description: "Use an avatar for a person or account image. It shows initials when an image is unavailable and a neutral person placeholder when no name is available.",
  usage: `<nala-avatar
  src="/images/player-ada.jpg"
  name="Ada Lovelace"
  size="large"
></nala-avatar>
<nala-avatar name="Grace Hopper"></nala-avatar>`,
  preview: ()=>html`
      <div class="button-row">
        <nala-avatar name="Ada Lovelace" size="small"></nala-avatar>
        <nala-avatar name="Grace Hopper"></nala-avatar>
        <nala-avatar name="Player"></nala-avatar>
        <nala-avatar></nala-avatar>
      </div>
    `,
  api: [
    {
      name: "src",
      type: "string | null property / attribute",
      defaultValue: "null",
      description: "Image URL. When absent or when the image fails to load, the initials or placeholder fallback is shown."
    },
    {
      name: "name",
      type: "string | null property / attribute",
      defaultValue: "null",
      description: 'Person or account name, used for image alternative text and fallback initials. Blank names use the accessible label "Avatar" and a neutral placeholder.'
    },
    {
      name: "size",
      type: '"small" | "medium" | "large" property / attribute',
      defaultValue: '"medium"',
      description: "Sets the avatar diameter. Other values use the medium size."
    }
  ],
  slots: [],
  events: [],
  parts: [
    "image",
    "fallback",
    "initials",
    "placeholder"
  ]
};
export const lessons = [
  {
    title: "Name the person as well as showing their image",
    explanation: "The name supplies alternative text when the image loads and readable initials when it does not. Point src at an image already provided by your application.",
    code: `<nala-avatar
  src="/images/player-ada.jpg"
  name="Ada Lovelace"
></nala-avatar>`
  },
  {
    title: "Keep missing profile images useful",
    explanation: "Without an image, the component derives initials from the first and last words in the name. If there is no name, it uses a neutral person placeholder instead.",
    code: `<nala-avatar name="Grace Hopper"></nala-avatar>
<nala-avatar></nala-avatar>`,
    preview: ()=>html`
        <div class="button-row">
          <nala-avatar name="Grace Hopper"></nala-avatar>
          <nala-avatar></nala-avatar>
        </div>
      `
  }
];
