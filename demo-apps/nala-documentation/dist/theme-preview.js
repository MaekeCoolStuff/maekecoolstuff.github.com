import { applyNalaTheme, nalaDefaultTheme } from "../../../vendor/ui-components/dist/index.js";
const themeOptions = {
  forest: {
    colorScheme: "light",
    theme: nalaDefaultTheme
  },
  ocean: {
    colorScheme: "light",
    theme: {
      ...nalaDefaultTheme,
      colorCanvas: "#e9f2f6",
      colorSurface: "#fbfeff",
      colorSurfaceMuted: "#f0f7fa",
      colorText: "#172a35",
      colorTextMuted: "#5a707c",
      colorBorder: "#bfd0d8",
      colorAccent: "#12627a",
      colorAccentStrong: "#0b4355",
      colorAccentSoft: "#d3eaf0",
      colorWarning: "#e8a93f",
      colorDanger: "#ad493e",
      shadowRaised: "0 1.25rem 3.5rem rgba(23, 55, 69, 0.14)"
    }
  },
  sunset: {
    colorScheme: "light",
    theme: {
      ...nalaDefaultTheme,
      colorCanvas: "#f6eee7",
      colorSurface: "#fffaf5",
      colorSurfaceMuted: "#f9f1e9",
      colorText: "#34231d",
      colorTextMuted: "#78645a",
      colorBorder: "#d9c7b9",
      colorAccent: "#a34d2b",
      colorAccentStrong: "#74351f",
      colorAccentSoft: "#f2ddd0",
      colorWarning: "#dfa83e",
      colorDanger: "#a73537",
      fontDisplay: '"Palatino Linotype", "Book Antiqua", serif',
      radiusSmall: "5px",
      radiusMedium: "9px",
      radiusLarge: "14px",
      shadowRaised: "0 1.25rem 3.5rem rgba(68, 43, 29, 0.14)"
    }
  },
  violet: {
    colorScheme: "light",
    theme: {
      ...nalaDefaultTheme,
      colorCanvas: "#f1eef8",
      colorSurface: "#fcfaff",
      colorSurfaceMuted: "#f6f2fc",
      colorText: "#282138",
      colorTextMuted: "#6b637e",
      colorBorder: "#d0c8df",
      colorAccent: "#6941a5",
      colorAccentStrong: "#492d76",
      colorAccentSoft: "#e5dcf5",
      colorWarning: "#e7ae46",
      colorDanger: "#aa4059",
      radiusSmall: "8px",
      radiusMedium: "12px",
      radiusLarge: "18px",
      shadowRaised: "0 1.25rem 3.5rem rgba(45, 34, 67, 0.14)"
    }
  },
  midnight: {
    colorScheme: "dark",
    theme: {
      ...nalaDefaultTheme,
      colorCanvas: "#151a21",
      colorSurface: "#202833",
      colorSurfaceMuted: "#29333e",
      colorText: "#edf2f5",
      colorTextMuted: "#b2bec8",
      colorBorder: "#465461",
      colorAccent: "#77c8b0",
      colorAccentStrong: "#a1e0ce",
      colorAccentSoft: "#2b4945",
      colorWarning: "#f1c76c",
      colorDanger: "#f18d83",
      fontBody: '"Avenir Next", "Gill Sans", sans-serif',
      fontDisplay: '"Avenir Next", "Gill Sans", sans-serif',
      radiusSmall: "4px",
      radiusMedium: "6px",
      radiusLarge: "8px",
      shadowRaised: "0 1.25rem 3.5rem rgba(0, 0, 0, 0.4)"
    }
  }
};
const themeStorageKey = "nala-docs:theme";
function isThemeName(value) {
  return Object.hasOwn(themeOptions, value);
}
function readSavedTheme() {
  try {
    const savedTheme = localStorage.getItem(themeStorageKey);
    if (!savedTheme) return "forest";
    if (isThemeName(savedTheme)) return savedTheme;
    console.warn(`Ignoring unsupported saved documentation theme: ${savedTheme}`);
  } catch (error) {
    console.error("Could not read the saved documentation theme.", error);
  }
  return "forest";
}
export function initializeThemeChooser() {
  const chooser = document.querySelector("#theme-choice");
  if (!chooser) {
    throw new Error("Documentation navigation is missing its theme chooser");
  }
  const root = document.documentElement;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const applyTheme = (name)=>{
    const option = themeOptions[name];
    applyNalaTheme(root, option.theme);
    root.style.colorScheme = option.colorScheme;
    if (themeColor) themeColor.content = option.theme.colorAccentStrong;
    chooser.value = name;
  };
  applyTheme(readSavedTheme());
  chooser.addEventListener("change", ()=>{
    const selectedTheme = chooser.value;
    if (!isThemeName(selectedTheme)) {
      throw new RangeError(`Unknown documentation theme: ${selectedTheme}`);
    }
    applyTheme(selectedTheme);
    try {
      localStorage.setItem(themeStorageKey, selectedTheme);
    } catch (error) {
      console.error("Could not save the documentation theme.", error);
    }
  });
}
