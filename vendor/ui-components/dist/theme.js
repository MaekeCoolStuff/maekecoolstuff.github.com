export const nalaDefaultTheme = {
  colorCanvas: "#f2f0e8",
  colorSurface: "#fffefa",
  colorSurfaceMuted: "#f7f7f2",
  colorText: "#18201d",
  colorTextMuted: "#68716c",
  colorBorder: "#cbcfc8",
  colorAccent: "#184d3b",
  colorAccentStrong: "#10372a",
  colorAccentSoft: "#d8e8df",
  colorWarning: "#f0b84b",
  colorDanger: "#a43f35",
  fontBody: '"Avenir Next", "Gill Sans", sans-serif',
  fontDisplay: '"Baskerville", "Iowan Old Style", serif',
  radiusSmall: "4px",
  radiusMedium: "6px",
  radiusLarge: "8px",
  shadowRaised: "0 1.25rem 3.5rem rgba(35, 48, 42, 0.12)"
};
const themeProperties = {
  colorCanvas: "--nala-ui-color-canvas",
  colorSurface: "--nala-ui-color-surface",
  colorSurfaceMuted: "--nala-ui-color-surface-muted",
  colorText: "--nala-ui-color-text",
  colorTextMuted: "--nala-ui-color-text-muted",
  colorBorder: "--nala-ui-color-border",
  colorAccent: "--nala-ui-color-accent",
  colorAccentStrong: "--nala-ui-color-accent-strong",
  colorAccentSoft: "--nala-ui-color-accent-soft",
  colorWarning: "--nala-ui-color-warning",
  colorDanger: "--nala-ui-color-danger",
  fontBody: "--nala-ui-font-body",
  fontDisplay: "--nala-ui-font-display",
  radiusSmall: "--nala-ui-radius-small",
  radiusMedium: "--nala-ui-radius-medium",
  radiusLarge: "--nala-ui-radius-large",
  shadowRaised: "--nala-ui-shadow-raised"
};
export function createThemeProperties(overrides = {}) {
  const theme = {
    ...nalaDefaultTheme,
    ...overrides
  };
  return Object.fromEntries(Object.keys(themeProperties).map((key)=>[
      themeProperties[key],
      theme[key]
    ]));
}
export function applyNalaTheme(target, overrides = {}) {
  for (const [name, value] of Object.entries(createThemeProperties(overrides))){
    target.style.setProperty(name, value);
  }
}
