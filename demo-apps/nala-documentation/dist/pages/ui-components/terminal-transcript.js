import { html } from "../../../../../vendor/components/dist/index.js";
const entries = [
  {
    id: "check",
    command: "deno check app/src/main.ts",
    output: "Check app/src/main.ts",
    note: "Check the Game Shelf source before compiling. Cached checks may print less. No reported error is the important signal."
  },
  {
    id: "compile",
    command: "deno transpile app/src/main.ts --output app/dist/main.js",
    note: "For this single import-free file, confirm app/dist/main.js exists afterward. Imported app graphs need their own verified build workflow."
  }
];
export const doc = {
  slug: "terminal-transcript",
  title: "Terminal transcript",
  tag: "<nala-terminal-transcript>",
  summary: "Clearly distinguish commands, illustrative output and the evidence a reader should check.",
  description: "A dark, terminal-style presentation with neon-green commands and theme-tinted chrome, not a shell emulator. Commands are safe literal text and are never executed. A Read only badge and Example output · may vary labels distinguish documentation from execution without a repeated disclaimer. Focusable code areas allow keyboard scrolling of long commands without page-level overflow. Decorative window lights are not controls. Override --nala-terminal-background, --nala-terminal-text, --nala-terminal-muted or --nala-terminal-command-color for custom palettes; inherited --nala-ui-color-accent tints borders, chrome and heading highlights. There is no blinking or typing animation.",
  usage: `import type { NalaTerminalTranscriptElement } from "./vendor/ui-components/dist/index.js";

const transcript = document.querySelector<NalaTerminalTranscriptElement>("nala-terminal-transcript");
if (!transcript) throw new Error("Terminal transcript is missing.");
transcript.entries = [{
  id: "check", command: "deno check app/src/main.ts",
  output: "Check app/src/main.ts",
  note: "No reported error; output can differ on cached checks.",
}];
// HTML: <nala-terminal-transcript label="Game Shelf · check" directory="Repository root"></nala-terminal-transcript>`,
  preview: ()=>html`
      <nala-terminal-transcript label="Game Shelf · check and compile"
        directory="Repository root" .entries=${entries}></nala-terminal-transcript>
    `,
  api: [
    {
      name: "compact",
      type: "boolean property / attribute",
      defaultValue: "false",
      description: "Presence hides the application bar and tightens entry/code spacing for short transcripts inside panels. The section keeps its accessible label; directory, command/output labels and notes remain visible without smaller text. Remove the attribute or set the property to false to restore the bar and normal spacing."
    },
    {
      name: "entries",
      type: "readonly NalaTerminalEntry[] property",
      defaultValue: "[]",
      description: "Each entry has a unique nonblank id and command, with optional string output and note. Omitted output renders no output block; empty output is allowed and shows an empty labelled block. Invalid assignments throw before replacing valid state. Assign new arrays, not in-place mutations. Stable ids preserve entry nodes during reorder."
    },
    {
      name: "label",
      type: "string property / attribute",
      defaultValue: '"Terminal transcript"',
      description: "Visible title and accessible section name."
    },
    {
      name: "directory",
      type: "string property / attribute",
      defaultValue: '""',
      description: "Human-readable working-directory label; empty hides the directory line. This does not change directories or access files."
    }
  ],
  slots: [],
  events: [],
  parts: [
    "terminal",
    "heading",
    "directory",
    "entry",
    "command",
    "output",
    "note",
    "empty"
  ]
};
export const lessons = [
  {
    title: "A compact transcript for small panels",
    explanation: 'Use compact when a short command sits beside another setup choice. It omits the application bar while keeping command/output labels and supplied directory or notes visible. Give the containing panel a clear heading; label still names the transcript for assistive tools. As with other boolean attributes, compact="false" still enables it; remove the attribute or set the compact property to false.',
    code: `<nala-terminal-transcript compact label="Terminal · check"
  directory="Repository root"></nala-terminal-transcript>
<!-- Assign entries through the property as above. -->`,
    preview: ()=>html`
      <nala-terminal-transcript compact label="Game Shelf · compact check"
        directory="Repository root" .entries=${entries.slice(0, 1)}></nala-terminal-transcript>
    `
  }
];
