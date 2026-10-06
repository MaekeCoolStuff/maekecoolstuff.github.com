export const guitarStringNames = [
  "Low E",
  "A",
  "D",
  "G",
  "B",
  "high e"
];
function sixTokens(value, input) {
  if (typeof value !== "string") {
    throw new TypeError(`${input} must be a string with six string positions`);
  }
  const text = value.trim();
  const tokens = /\s/.test(text) ? text.split(/\s+/) : [
    ...text
  ];
  if (tokens.length !== 6) {
    throw new TypeError(`${input} must contain six positions, low E to high e`);
  }
  return tokens;
}
export function parseGuitarTab(value) {
  return sixTokens(value, "tab").map((token)=>{
    if (/^x$/i.test(token)) return null;
    if (!/^(0|[1-9]|1[0-9]|2[0-4])$/.test(token)) {
      throw new TypeError("tab positions must be x or a fret from 0 to 24");
    }
    return Number(token);
  });
}
export function parseGuitarFingers(value) {
  return sixTokens(value, "fingers").map((token)=>{
    if (token === "-") return "";
    if (!/^[1-4T]$/.test(token)) {
      throw new TypeError("fingers positions must be -, 1, 2, 3, 4, or T");
    }
    return token;
  });
}
export function guitarNeckFrets(tab) {
  const pressed = tab.filter((fret)=>fret !== null && fret > 0);
  const low = pressed.length ? Math.min(...pressed) : 1;
  const high = pressed.length ? Math.max(...pressed) : 1;
  const start = low <= 5 ? 1 : Math.min(low, 20);
  const end = Math.max(start + 4, high);
  return Array.from({
    length: end - start + 1
  }, (_, index)=>start + index);
}
export function guitarNeckDescription(tab, fingers) {
  return guitarStringNames.map((name, index)=>{
    const fret = tab[index];
    const position = fret === null ? "muted" : fret === 0 ? "open" : `fret ${fret}`;
    const finger = fret !== null && fret > 0 && fingers[index] ? `, ${fingers[index] === "T" ? "thumb" : `finger ${fingers[index]}`}` : "";
    return `${name}: ${position}${finger}`;
  }).join("; ");
}
