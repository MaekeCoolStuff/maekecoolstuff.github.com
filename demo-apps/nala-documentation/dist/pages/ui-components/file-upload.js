import { html } from "../../../../../vendor/components/dist/index.js";
export const doc = {
  slug: "file-upload",
  title: "File upload",
  tag: "<nala-file-upload>",
  summary: "Choose or drop files with a labeled, keyboard-accessible control.",
  description: "A native file picker with an accessible drop target. It reports selected File objects but leaves upload requests and progress to the application.",
  usage: `<nala-file-upload id="game-cover" label="Game cover"
  accept="image/*" hint="Choose an image or drop one here"></nala-file-upload>

const upload = document.querySelector("#game-cover");
upload?.addEventListener("change", (event) => {
  const { value: files } =
    (event as CustomEvent<{ value: readonly File[] }>).detail;
  console.log("Selected files:", files);
});`,
  preview: ()=>html`
      <nala-file-upload label="Choose a game cover" accept="image/*"
        hint="PNG, JPEG, or another browser-supported image format"></nala-file-upload>
    `,
  api: [
    {
      name: "label",
      type: "string property / attribute",
      defaultValue: '"Upload files"',
      description: "Visible label and accessible name for the native picker."
    },
    {
      name: "hint",
      type: "string property / attribute",
      defaultValue: '""',
      description: "Supporting text announced with the file picker."
    },
    {
      name: "accept",
      type: "string property / attribute",
      defaultValue: '""',
      description: "Native file-picker hint and drop filter; accepts comma-separated extensions, MIME types, and MIME wildcards."
    },
    {
      name: "multiple",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Allows picking or dropping more than one file."
    },
    {
      name: "disabled",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Disables the picker and ignores dropped files."
    },
    {
      name: "required",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Marks the native picker as required."
    },
    {
      name: "files",
      type: "readonly File[] property",
      defaultValue: "[]",
      description: "Current accepted selection from the picker or drop target. Use clear() to reset it."
    },
    {
      name: "clear()",
      type: "method",
      defaultValue: "—",
      description: "Clears the native picker and current selection without emitting events."
    }
  ],
  slots: [],
  events: [
    {
      name: "input",
      type: "CustomEvent<{ value: readonly File[] }>",
      description: "Bubbles and is composed; reports the current selection as it changes."
    },
    {
      name: "change",
      type: "CustomEvent<{ value: readonly File[] }>",
      description: "Bubbles and is composed; reports the confirmed selection."
    },
    {
      name: "file-reject",
      type: "CustomEvent<{ files: File[] }>",
      description: "Bubbles and is composed when dropped or selected files do not match accept, or a single-file control receives multiple dropped files."
    }
  ],
  parts: [
    "field",
    "label",
    "dropzone",
    "control",
    "prompt",
    "selection",
    "hint"
  ]
};
export const lessons = [
  {
    title: "Select files and read the event",
    explanation: "The control keeps file selection native: keyboard users can focus the hidden native input and open the browser file picker, while pointer users can activate the visible drop area. Both paths emit input and change events whose detail.value is an array of File objects. The component does not upload data; the app decides what to do with the files.",
    code: `const upload = document.querySelector("#game-cover");

upload?.addEventListener("change", async (event) => {
  const { value: files } =
    (event as CustomEvent<{ value: readonly File[] }>).detail;
  const body = new FormData();
  for (const file of files) body.append("covers", file);

  // Send body with fetch or the application's upload service.
  // Do not set multipart/form-data manually; the browser adds its boundary.
});`
  },
  {
    title: "Allow multiple files and filter drops",
    explanation: "Set multiple to allow multiple selections. accept uses the browser's normal file-picker hint syntax and the component also checks dropped files against the same comma-separated extensions or MIME types. Rejected files are reported in file-reject; the application can explain the reason. Browser accept filters are hints, not security validation, so the server must validate uploaded content too.",
    code: `<nala-file-upload
  label="Choose screenshots"
  accept="image/*,.webp"
  multiple
  hint="Drop one or more screenshots here">
</nala-file-upload>`
  },
  {
    title: "Clear selected files",
    explanation: "The readonly files property returns the accepted selection as a new array. Call clear() to clear the browser input and the visible selection summary. Clearing programmatically is silent and does not upload or delete any remote file.",
    code: `const upload = document.querySelector("#game-cover");
console.log(upload?.files);
upload?.clear();`
  }
];
