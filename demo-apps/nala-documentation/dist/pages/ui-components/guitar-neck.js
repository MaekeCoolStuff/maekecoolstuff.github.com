import { defineComponent, html } from "../../../../../vendor/components/dist/index.js";
const chords = [
  {
    name: "C major",
    tab: "x32010",
    fingers: "-32-1-"
  },
  {
    name: "G major",
    tab: "320003",
    fingers: "21---3"
  },
  {
    name: "D major",
    tab: "xx0232",
    fingers: "---132"
  },
  {
    name: "F major (barre)",
    tab: "133211",
    fingers: "134211"
  },
  {
    name: "C major (8th fret)",
    tab: "8 10 10 9 8 8",
    fingers: "134211"
  }
];
defineComponent("docs-guitar-neck-example", {
  template: ()=>html`
      <label>Choose a chord
        <select @change=${(event)=>{
      const select = event.currentTarget;
      if (!(select instanceof HTMLSelectElement)) {
        throw new TypeError("Chord example requires a native select");
      }
      const neck = select.closest("docs-guitar-neck-example")?.querySelector("nala-guitar-neck");
      const chord = chords[Number(select.value)];
      if (!neck || !chord) {
        throw new Error("Chord example is missing its chord or neck");
      }
      neck.fingers = chord.fingers;
      neck.tab = chord.tab;
      neck.label = chord.name;
    }}>
          <option value="0">C major</option>
          <option value="1">G major</option>
          <option value="2">D major</option>
          <option value="3">F major (barre)</option>
          <option value="4">C major (8th fret)</option>
        </select>
      </label>
      <nala-guitar-neck label="C major" tab="x32010"
        fingers="-32-1-"></nala-guitar-neck>
      <p>Read each shape from low E to high e. X means muted; a hollow circle means open.</p>
    `
});
export const doc = {
  slug: "guitar-neck",
  title: "Guitar neck",
  tag: "<nala-guitar-neck>",
  summary: "Show a six-string chord shape without building a fretboard renderer.",
  description: "A local SVG fretboard for standard six-string guitar chord shapes. The neck runs horizontally with high e at the top, low E at the bottom, and increasing frets from left to right. Your application owns lessons, chord selection, and sound.",
  usage: `<nala-guitar-neck label="C major" tab="x32010" fingers="-32-1-"></nala-guitar-neck>
<nala-guitar-neck label="C major, higher voicing"
  tab="8 10 10 9 8 8" fingers="134211"></nala-guitar-neck>`,
  preview: ()=>html`<docs-guitar-neck-example></docs-guitar-neck-example>`,
  api: [
    {
      name: "tab",
      type: "string property / attribute",
      defaultValue: '"xxxxxx"',
      description: "Exactly six positions ordered low E, A, D, G, B, high e. x or X mutes, 0 is open, 1-24 presses a fret. Use compact x32010 for single-digit frets or spaces for multi-digit frets. Invalid input throws TypeError; removing the attribute restores all-muted."
    },
    {
      name: "fingers",
      type: "string property / attribute",
      defaultValue: '"------"',
      description: "Six positions in the same order: - omits a label, 1 is index, 2 middle, 3 ring, 4 little finger, T thumb. Compact or space-separated. Labels only appear on pressed strings; repeated numbers can indicate a barre. Invalid input throws TypeError. Removal clears labels."
    },
    {
      name: "label",
      type: "string property / attribute",
      defaultValue: '"Guitar chord"',
      description: "Visible caption and prefix of the accessible name, followed by all six string positions and provided fingers. Removing the attribute restores the default."
    },
    {
      name: "NalaGuitarNeckElement",
      type: "exported TypeScript element interface",
      defaultValue: "type only",
      description: "Typed tab, fingers, and label properties exported from the UI package entrypoint."
    },
    {
      name: "CSS custom properties",
      type: "--nala-guitar-neck-board / fret / string / inlay / finger / finger-text",
      defaultValue: "#f0dfc0 / #8c8170 / #514b43 / #c5b18e / theme accent / #fff",
      description: "Replace the final name after --nala-guitar-neck-. Font, text, focus ring, and corner radius inherit the UI theme. Set host width to control size; narrow containers scroll rather than shrinking finger labels indefinitely."
    }
  ],
  slots: [],
  events: [],
  parts: [
    "figure",
    "caption",
    "viewport",
    "neck",
    "fretboard",
    "nut",
    "fret",
    "inlay",
    "string",
    "string-label",
    "fret-label",
    "muted",
    "open",
    "position",
    "finger",
    "finger-label"
  ]
};
export const lessons = [
  {
    title: "A chord shape is one snapshot, not a song",
    explanation: "In a Game Shelf music-practice screen, or a separate guitar lesson app, a chord shape answers where to press now. x32010 means mute low E, press A at fret 3 and D at fret 2, leave G open, press B at fret 1, and leave high e open. Notice that input order runs from thickest to thinnest string, while the picture puts high e above low E, like conventional tablature. The component does not parse multi-line song tabs, infer chord names, play audio, or manage a timeline.",
    code: `<nala-guitar-neck label="C major" tab="x32010"></nala-guitar-neck>`
  },
  {
    title: "Choose fingering explicitly",
    explanation: "A fret number is not a finger number. In the C shape, finger 3 presses A, finger 2 presses D, and finger 1 presses B, so the matching fingers string is -32-1-. The dash means no label, not muted. Fingering is optional because the same shape can be played in different ways. For a barre chord, repeat a finger number on its strings; F major uses finger 1 at fret 1 on low E, B, and high e. These remain separate dots: the component does not infer a connecting barre or check anatomical playability.",
    code: `<nala-guitar-neck label="F major" tab="133211" fingers="134211"></nala-guitar-neck>`,
    preview: ()=>html`
        <nala-guitar-neck label="F major" tab="133211"
          fingers="134211"></nala-guitar-neck>
      `
  },
  {
    title: "Use spaces when a fret has two digits",
    explanation: "The compact format uses one character per string. For higher positions, separate all six values with whitespace: 8 10 10 9 8 8 is C major at the eighth fret. Leading zeros, decimals, negative numbers, commas, and frets above 24 are rejected. At least five frets are shown, and every pressed position is included. Low shapes retain fret 1 and its thicker nut; higher shapes start near the lowest pressed note, with fret numbers making the offset explicit. Open and muted indicators remain beside the string names even in a higher window.",
    code: `<nala-guitar-neck label="C major at fret 8"
  tab="8 10 10 9 8 8" fingers="134211"></nala-guitar-neck>`,
    preview: ()=>html`
        <nala-guitar-neck label="C major at fret 8" tab="8 10 10 9 8 8"
          fingers="134211"></nala-guitar-neck>
      `
  },
  {
    title: "Let your app select the next lesson",
    explanation: "Assign ordinary element properties to change the current shape; they reflect to attributes and update the existing SVG in place. The live select above uses this pattern. There is no hidden store or automatic binding: a lesson app can use a store subscription and register its disposer with onCleanup. Bad property assignments throw before replacing the previous value. Direct invalid HTML attributes are reported as browser custom-element errors. No custom events or slots are provided because the neck is a read-only visualization.",
    code: `import type { NalaGuitarNeckElement } from "../../vendor/ui-components/dist/index.js";
// The page has already imported the UI package to register its elements.
const neck = document.querySelector<NalaGuitarNeckElement>("nala-guitar-neck");
if (!neck) throw new Error("Lesson fretboard is missing");
neck.fingers = "---132";
neck.tab = "xx0232";
neck.label = "D major";`
  },
  {
    title: "Keep the picture usable without sight or a wide screen",
    explanation: "The SVG exposes one image name containing the caption plus every string's open, muted, or fretted position and optional finger. The dots are not buttons. The viewport can receive keyboard focus and scroll horizontally when necessary, preserving readable markers on phones or unusually wide fret spans. All artwork and styles are local, so the diagram works offline. Use the inherited theme, component CSS variables, or Shadow Parts to customize it while preserving contrast. Standard string labels are fixed; alternate tuning, left-handed mirroring, capo offsets, and editing are not implemented.",
    code: `<nala-guitar-neck label="C major" tab="x32010"
  style="max-width: 30rem; --nala-guitar-neck-finger: #9d174d"></nala-guitar-neck>`
  }
];
