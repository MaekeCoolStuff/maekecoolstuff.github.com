import { defineComponent, html, repeat } from "../../../../vendor/components/dist/index.js";
const propertyGroups = [
  {
    id: "property-display-position",
    title: "Display, flow, and positioning",
    summary: "Box participation, containing blocks, stacking, and visibility.",
    entries: [
      {
        name: "clear",
        values: "none | left | right | both | inline-start | inline-end",
        notes: "Controls whether an element moves below earlier floats."
      },
      {
        name: "content",
        values: "normal | none | <string> | <image> | <counter> | combinations",
        notes: "Generated content for pseudo-elements; do not put essential text here."
      },
      {
        name: "content-visibility",
        values: "visible | auto | hidden",
        notes: "May skip rendering work for off-screen content."
      },
      {
        name: "break-inside",
        values: "auto | avoid | avoid-page | avoid-column | avoid-region",
        notes: "Controls fragmentation inside an element, including printed pages and multicolumn flow."
      },
      {
        name: "container-type",
        values: "normal | size | inline-size",
        notes: "Establishes size query containment for descendants."
      },
      {
        name: "display",
        values: "block | inline | inline-block | flow-root | list-item | table | inline-table | flex | inline-flex | grid | inline-grid | contents | none | <outside> <inside>",
        notes: "Common values named explicitly. Two-keyword forms combine an outside value (block or inline) with an inside layout (flow, flow-root, flex, grid, table, or ruby)."
      },
      {
        name: "float",
        values: "none | left | right | inline-start | inline-end",
        notes: "For text wrapping around content; not a general layout system."
      },
      {
        name: "isolation",
        values: "auto | isolate",
        notes: "Creates a local stacking context with isolate."
      },
      {
        name: "position",
        values: "static | relative | absolute | fixed | sticky",
        notes: "Selects normal flow or a positioning scheme."
      },
      {
        name: "visibility",
        values: "visible | hidden | collapse",
        notes: "Hidden boxes keep layout space; unlike display:none."
      },
      {
        name: "z-index",
        values: "auto | <integer>",
        notes: "Orders items within their stacking context; it cannot escape an ancestor context."
      }
    ]
  },
  {
    id: "property-insets",
    title: "Offsets and insets",
    summary: "Physical offsets name top/right/bottom/left; logical offsets follow writing direction. Common values: auto, 0, 1rem, and 50%.",
    entries: [
      {
        name: "bottom",
        values: "auto | <length-percentage>",
        notes: "Physical bottom inset for positioned boxes."
      },
      {
        name: "inset",
        values: "auto | <length-percentage>{1,4}",
        notes: "Shorthand for the four physical inset sides."
      },
      {
        name: "inset-block",
        values: "auto | <length-percentage>{1,2}",
        notes: "Shorthand for logical block-start and block-end insets."
      },
      {
        name: "inset-block-end",
        values: "auto | <length-percentage>",
        notes: "Logical block-end inset."
      },
      {
        name: "inset-block-start",
        values: "auto | <length-percentage>",
        notes: "Logical block-start inset; commonly used with sticky."
      },
      {
        name: "inset-inline",
        values: "auto | <length-percentage>{1,2}",
        notes: "Shorthand for logical inline-start and inline-end insets."
      },
      {
        name: "inset-inline-end",
        values: "auto | <length-percentage>",
        notes: "Logical inline-end inset."
      },
      {
        name: "inset-inline-start",
        values: "auto | <length-percentage>",
        notes: "Logical inline-start inset."
      },
      {
        name: "left",
        values: "auto | <length-percentage>",
        notes: "Physical left inset for positioned boxes."
      },
      {
        name: "right",
        values: "auto | <length-percentage>",
        notes: "Physical right inset for positioned boxes."
      },
      {
        name: "top",
        values: "auto | <length-percentage>",
        notes: "Physical top inset for positioned boxes."
      }
    ]
  },
  {
    id: "property-sizing",
    title: "Sizing and box model",
    summary: "Lengths are open-ended CSS dimensions; percentages depend on the property's reference box.",
    entries: [
      {
        name: "aspect-ratio",
        values: "auto | <ratio>",
        notes: "Preferred width-to-height ratio, such as 3 / 4."
      },
      {
        name: "block-size",
        values: "auto | 8rem | 50% | min-content | max-content | fit-content()",
        notes: "Logical size along the block axis."
      },
      {
        name: "box-sizing",
        values: "content-box | border-box",
        notes: "Determines whether declared size includes padding and border."
      },
      {
        name: "contain-intrinsic-height",
        values: "none | auto? <length>",
        notes: "Estimated block size used with content visibility or containment."
      },
      {
        name: "contain-intrinsic-width",
        values: "none | auto? <length>",
        notes: "Estimated inline size used with content visibility or containment."
      },
      {
        name: "height",
        values: "auto | 240px | 15rem | 50% | min-content | max-content | fit-content()",
        notes: "Physical height; avoid fixed heights around variable text."
      },
      {
        name: "inline-size",
        values: "auto | 20rem | 100% | min-content | max-content | fit-content()",
        notes: "Logical size along the inline axis."
      },
      {
        name: "max-block-size",
        values: "none | 24rem | 80% | min-content | max-content | fit-content()",
        notes: "Upper bound for logical block size."
      },
      {
        name: "max-height",
        values: "none | 400px | 24rem | 80% | min-content | max-content | fit-content()",
        notes: "Upper bound for physical height."
      },
      {
        name: "max-inline-size",
        values: "none | 68ch | 100% | min-content | max-content | fit-content()",
        notes: "Upper bound for logical inline size."
      },
      {
        name: "max-width",
        values: "none | 960px | 60rem | 100% | min-content | max-content | fit-content()",
        notes: "Upper bound for physical width."
      },
      {
        name: "min-block-size",
        values: "auto | 8rem | 50% | min-content | max-content | fit-content()",
        notes: "Lower bound for logical block size."
      },
      {
        name: "min-height",
        values: "auto | 160px | 10rem | min-content | max-content | fit-content()",
        notes: "Lower bound for physical height."
      },
      {
        name: "min-inline-size",
        values: "auto | 12rem | 100% | min-content | max-content | fit-content()",
        notes: "Lower bound for logical inline size."
      },
      {
        name: "min-width",
        values: "auto | 0 | 12rem | 100% | min-content | max-content | fit-content()",
        notes: "Lower bound for physical width; min-width:0 often allows grid/flex children to shrink."
      },
      {
        name: "width",
        values: "auto | 240px | 15rem | 50% | min-content | max-content | fit-content() | min() | max() | clamp()",
        notes: "Physical width; logical inline-size is direction-aware."
      }
    ]
  },
  {
    id: "property-spacing",
    title: "Margins, padding, and gaps",
    summary: "Try 0, 8px, 0.75rem, or 5%. Margins also accept auto; padding and gaps do not. Logical sides adapt to writing mode.",
    entries: [
      {
        name: "column-gap",
        values: "normal | 12px | 0.75rem | 2%",
        notes: "Space between columns or inline flex/grid tracks."
      },
      {
        name: "gap",
        values: "normal | 0 | 12px | 0.75rem | 1rem 2rem",
        notes: "Row gap followed by optional column gap."
      },
      {
        name: "margin",
        values: "auto | 0 | 8px | 1rem | 5% (one to four sides)",
        notes: "Shorthand for physical margins; vertical margins can collapse in normal flow."
      },
      {
        name: "margin-block",
        values: "auto | 0 | 0.75rem | 1rem 2rem",
        notes: "Shorthand for block-start and block-end margins."
      },
      {
        name: "margin-block-end",
        values: "auto | <length-percentage>",
        notes: "Logical block-end margin."
      },
      {
        name: "margin-block-start",
        values: "auto | <length-percentage>",
        notes: "Logical block-start margin."
      },
      {
        name: "margin-bottom",
        values: "auto | <length-percentage>",
        notes: "Physical bottom margin."
      },
      {
        name: "margin-inline",
        values: "auto | 0 | 1rem | 1rem 2rem",
        notes: "Shorthand for inline-start and inline-end margins; auto centers constrained blocks."
      },
      {
        name: "margin-inline-end",
        values: "auto | <length-percentage>",
        notes: "Logical inline-end margin."
      },
      {
        name: "margin-inline-start",
        values: "auto | <length-percentage>",
        notes: "Logical inline-start margin."
      },
      {
        name: "margin-left",
        values: "auto | <length-percentage>",
        notes: "Physical left margin."
      },
      {
        name: "margin-right",
        values: "auto | <length-percentage>",
        notes: "Physical right margin."
      },
      {
        name: "margin-top",
        values: "auto | <length-percentage>",
        notes: "Physical top margin."
      },
      {
        name: "padding",
        values: "0 | 8px | 1rem | 1rem 2rem (one to four sides)",
        notes: "Shorthand for physical padding sides; negative values are invalid."
      },
      {
        name: "padding-block",
        values: "0 | 0.75rem | 1rem 2rem",
        notes: "Shorthand for block-start and block-end padding."
      },
      {
        name: "padding-block-end",
        values: "<length-percentage>",
        notes: "Logical block-end padding."
      },
      {
        name: "padding-block-start",
        values: "<length-percentage>",
        notes: "Logical block-start padding."
      },
      {
        name: "padding-bottom",
        values: "<length-percentage>",
        notes: "Physical bottom padding."
      },
      {
        name: "padding-inline",
        values: "0 | 1rem | 1rem 2rem",
        notes: "Shorthand for inline-start and inline-end padding."
      },
      {
        name: "padding-inline-end",
        values: "<length-percentage>",
        notes: "Logical inline-end padding."
      },
      {
        name: "padding-inline-start",
        values: "<length-percentage>",
        notes: "Logical inline-start padding."
      },
      {
        name: "padding-left",
        values: "<length-percentage>",
        notes: "Physical left padding."
      },
      {
        name: "padding-right",
        values: "<length-percentage>",
        notes: "Physical right padding."
      },
      {
        name: "padding-top",
        values: "<length-percentage>",
        notes: "Physical top padding."
      },
      {
        name: "row-gap",
        values: "normal | <length-percentage>",
        notes: "Space between rows or block flex/grid tracks."
      }
    ]
  },
  {
    id: "property-grid-flex",
    title: "Grid, Flexbox, and alignment",
    summary: "Track sizing uses lengths, fractions, intrinsic sizes, and sizing functions; alignment uses logical axes.",
    entries: [
      {
        name: "align-content",
        values: "normal | start | end | center | stretch | space-between | space-around | space-evenly | baseline",
        notes: "Distributes a collection of tracks or flex lines on the cross axis."
      },
      {
        name: "align-items",
        values: "normal | start | end | center | stretch | baseline",
        notes: "Default cross-axis alignment for children."
      },
      {
        name: "align-self",
        values: "auto | normal | start | end | center | stretch | baseline",
        notes: "Overrides the parent's item alignment for one child."
      },
      {
        name: "flex",
        values: "none | auto | initial | <grow> <shrink>? || <basis>",
        notes: "Shorthand; common values include 1, auto, and 0 0 auto."
      },
      {
        name: "flex-basis",
        values: "content | auto | 12rem | 50% | min-content | max-content | fit-content()",
        notes: "Initial main-axis size before free-space distribution."
      },
      {
        name: "flex-direction",
        values: "row | row-reverse | column | column-reverse",
        notes: "Chooses the main axis direction."
      },
      {
        name: "flex-grow",
        values: "<number> (e.g. 0 | 1 | 2)",
        notes: "Share of positive free space; must be nonnegative."
      },
      {
        name: "flex-shrink",
        values: "<number> (e.g. 0 | 1 | 2)",
        notes: "Share of negative free space; must be nonnegative."
      },
      {
        name: "flex-wrap",
        values: "nowrap | wrap | wrap-reverse",
        notes: "Controls whether flex items form additional lines."
      },
      {
        name: "grid-auto-rows",
        values: "auto | 8rem | 1fr | minmax(8rem, auto)",
        notes: "Sizes implicit rows; track sizes include auto, minmax(), and intrinsic sizes."
      },
      {
        name: "grid-column",
        values: "<'grid-column-start'> / <'grid-column-end'>?",
        notes: "Shorthand for a column start line and optional end line."
      },
      {
        name: "grid-column-end",
        values: "auto | <line> | span <integer> | span <custom-ident>",
        notes: "Grid column end line or span."
      },
      {
        name: "grid-column-start",
        values: "auto | <line> | span <integer> | span <custom-ident>",
        notes: "Grid column start line or span."
      },
      {
        name: "grid-row-end",
        values: "auto | <line> | span <integer> | span <custom-ident>",
        notes: "Grid row end line or span."
      },
      {
        name: "grid-row",
        values: "<'grid-row-start'> / <'grid-row-end'>?",
        notes: "Shorthand for a row start line and optional end line."
      },
      {
        name: "grid-row-start",
        values: "auto | <line> | span <integer> | span <custom-ident>",
        notes: "Grid row start line or span."
      },
      {
        name: "grid-template-areas",
        values: "none | one or more quoted area rows",
        notes: "Each named region must form a rectangle; a dot marks an empty cell."
      },
      {
        name: "grid-template-columns",
        values: "none | 1fr | 240px 1fr | repeat(3, 1fr) | minmax(0, 1fr) | repeat(auto-fit, minmax(12rem, 1fr)) | subgrid | masonry",
        notes: "fr means a fraction of the free track space and is valid here, not as a general length. minmax() and repeat() build flexible track lists."
      },
      {
        name: "grid-template-rows",
        values: "none | auto | 8rem | 1fr | repeat(3, minmax(0, 1fr)) | subgrid | masonry",
        notes: "Rows accept lengths, percentages, fr, minmax(), repeat(), and intrinsic sizes."
      },
      {
        name: "justify-content",
        values: "normal | start | end | center | stretch | space-between | space-around | space-evenly",
        notes: "Distributes free space along the inline/main axis."
      },
      {
        name: "justify-items",
        values: "normal | start | end | center | stretch | baseline",
        notes: "Default inline-axis alignment for items in their area."
      },
      {
        name: "justify-self",
        values: "auto | normal | start | end | center | stretch | baseline",
        notes: "Inline-axis alignment for one item."
      },
      {
        name: "place-content",
        values: "<align-content> <justify-content>?",
        notes: "Shorthand for content alignment on both axes."
      },
      {
        name: "place-items",
        values: "<align-items> <justify-items>?",
        notes: "Shorthand for item alignment on both axes."
      }
    ]
  },
  {
    id: "property-borders",
    title: "Borders, outlines, and shadows",
    summary: "A common border is 1px solid #cbcfc8; use 2px dashed #184d3b for a stronger edge. Border-image values set a source plus slicing and sizing descriptors.",
    entries: [
      {
        name: "border",
        values: "1px solid #cbcfc8 | 2px dashed #184d3b | <width> <style> <color>",
        notes: "Sets all four physical borders."
      },
      {
        name: "border-block",
        values: "<'border-width'> || <'border-style'> || <color>",
        notes: "Sets block-start and block-end borders."
      },
      {
        name: "border-block-end",
        values: "<'border-width'> || <'border-style'> || <color>",
        notes: "Logical block-end border shorthand."
      },
      {
        name: "border-block-end-color",
        values: "<color> | transparent",
        notes: "Color of the block-end border."
      },
      {
        name: "border-block-end-style",
        values: "none | hidden | solid | dashed | dotted | double | groove | ridge | inset | outset",
        notes: "Style of the block-end border."
      },
      {
        name: "border-block-end-width",
        values: "thin | medium | thick | <length>",
        notes: "Width of the block-end border."
      },
      {
        name: "border-block-start",
        values: "<'border-width'> || <'border-style'> || <color>",
        notes: "Logical block-start border shorthand."
      },
      {
        name: "border-block-start-color",
        values: "<color> | transparent",
        notes: "Color of the block-start border."
      },
      {
        name: "border-block-start-style",
        values: "none | hidden | solid | dashed | dotted | double | groove | ridge | inset | outset",
        notes: "Style of the block-start border."
      },
      {
        name: "border-block-start-width",
        values: "thin | medium | thick | <length>",
        notes: "Width of the block-start border."
      },
      {
        name: "border-bottom",
        values: "<'border-width'> || <'border-style'> || <color>",
        notes: "Physical bottom border shorthand."
      },
      {
        name: "border-bottom-color",
        values: "<color> | transparent",
        notes: "Physical bottom border color."
      },
      {
        name: "border-bottom-left-radius",
        values: "<length-percentage>{1,2}",
        notes: "Horizontal and optional vertical corner radius."
      },
      {
        name: "border-bottom-right-radius",
        values: "<length-percentage>{1,2}",
        notes: "Horizontal and optional vertical corner radius."
      },
      {
        name: "border-bottom-style",
        values: "none | hidden | solid | dashed | dotted | double | groove | ridge | inset | outset",
        notes: "Physical bottom border style."
      },
      {
        name: "border-bottom-width",
        values: "thin | medium | thick | <length>",
        notes: "Physical bottom border width."
      },
      {
        name: "border-color",
        values: "<color>{1,4}",
        notes: "Shorthand for physical border colors."
      },
      {
        name: "border-image-outset",
        values: "<length> | <number>{1,4}",
        notes: "How far the border image extends beyond the border box."
      },
      {
        name: "border-image-repeat",
        values: "stretch | repeat | round | space",
        notes: "How border image slices fill their edge regions."
      },
      {
        name: "border-image-slice",
        values: "<number-percentage>{1,4} fill?",
        notes: "Divides the source image into border regions."
      },
      {
        name: "border-image-source",
        values: "none | <image>",
        notes: "Image or gradient used to paint a border."
      },
      {
        name: "border-image-width",
        values: "[<length-percentage> | <number> | auto]{1,4}",
        notes: "Width of the border image regions."
      },
      {
        name: "border-inline",
        values: "<'border-width'> || <'border-style'> || <color>",
        notes: "Sets inline-start and inline-end borders."
      },
      {
        name: "border-inline-start",
        values: "<'border-width'> || <'border-style'> || <color>",
        notes: "Logical inline-start border shorthand."
      },
      {
        name: "border-inline-start-color",
        values: "<color> | transparent",
        notes: "Color of the inline-start border."
      },
      {
        name: "border-inline-start-style",
        values: "none | hidden | solid | dashed | dotted | double | groove | ridge | inset | outset",
        notes: "Style of the inline-start border."
      },
      {
        name: "border-inline-start-width",
        values: "thin | medium | thick | <length>",
        notes: "Width of the inline-start border."
      },
      {
        name: "border-left",
        values: "<'border-width'> || <'border-style'> || <color>",
        notes: "Physical left border shorthand."
      },
      {
        name: "border-left-color",
        values: "<color> | transparent",
        notes: "Physical left border color."
      },
      {
        name: "border-left-style",
        values: "none | hidden | solid | dashed | dotted | double | groove | ridge | inset | outset",
        notes: "Physical left border style."
      },
      {
        name: "border-left-width",
        values: "thin | medium | thick | <length>",
        notes: "Physical left border width."
      },
      {
        name: "border-radius",
        values: "4px | 0.5rem | 50% | horizontal-radii / vertical-radii",
        notes: "Corner radii; slash separates horizontal and vertical radii."
      },
      {
        name: "border-right",
        values: "<'border-width'> || <'border-style'> || <color>",
        notes: "Physical right border shorthand."
      },
      {
        name: "border-right-color",
        values: "<color> | transparent",
        notes: "Physical right border color."
      },
      {
        name: "border-right-style",
        values: "none | hidden | solid | dashed | dotted | double | groove | ridge | inset | outset",
        notes: "Physical right border style."
      },
      {
        name: "border-right-width",
        values: "thin | medium | thick | <length>",
        notes: "Physical right border width."
      },
      {
        name: "border-style",
        values: "none | hidden | solid | dashed | dotted | double | groove | ridge | inset | outset",
        notes: "One to four values for physical border sides."
      },
      {
        name: "border-top",
        values: "<'border-width'> || <'border-style'> || <color>",
        notes: "Physical top border shorthand."
      },
      {
        name: "border-top-color",
        values: "<color> | transparent",
        notes: "Physical top border color."
      },
      {
        name: "border-top-left-radius",
        values: "<length-percentage>{1,2}",
        notes: "Horizontal and optional vertical corner radius."
      },
      {
        name: "border-top-right-radius",
        values: "<length-percentage>{1,2}",
        notes: "Horizontal and optional vertical corner radius."
      },
      {
        name: "border-top-style",
        values: "none | hidden | solid | dashed | dotted | double | groove | ridge | inset | outset",
        notes: "Physical top border style."
      },
      {
        name: "border-top-width",
        values: "thin | medium | thick | <length>",
        notes: "Physical top border width."
      },
      {
        name: "border-width",
        values: "thin | medium | thick | 1px | 2px (one to four sides)",
        notes: "One to four widths for physical border sides."
      },
      {
        name: "box-shadow",
        values: "none | 0 2px 8px rgb(24 32 29 / 18%) | inset 0 1px 3px #999",
        notes: "Order: optional inset, x/y offsets, optional blur and spread, then color. Does not affect layout."
      },
      {
        name: "outline",
        values: "<'outline-width'> || <'outline-style'> || <color>",
        notes: "Drawn outside the border without taking layout space."
      },
      {
        name: "outline-color",
        values: "<color> | invert",
        notes: "Focus indicator color; ensure adequate contrast."
      },
      {
        name: "outline-offset",
        values: "<length>",
        notes: "Distance between outline and border edge; may be negative."
      },
      {
        name: "outline-style",
        values: "auto | none | solid | dashed | dotted | double | groove | ridge | inset | outset",
        notes: "Visual style of the outline."
      },
      {
        name: "outline-width",
        values: "thin | medium | thick | 2px | 3px",
        notes: "Thickness of the outline."
      }
    ]
  },
  {
    id: "property-backgrounds",
    title: "Backgrounds, images, and masks",
    summary: "Background properties take comma-separated layers. Common values include a color, url(...), linear-gradient(...), cover, contain, and positions such as center or 50% 35%.",
    entries: [
      {
        name: "background",
        values: "<'background-color'> || <'background-image'> || <'background-position'> / <'background-size'>? || <'background-repeat'> || <'background-origin'> || <'background-clip'> || <'background-attachment'>",
        notes: "Layered shorthand; color belongs to the final layer only."
      },
      {
        name: "background-attachment",
        values: "scroll | fixed | local",
        notes: "How each background layer relates to the scroll container."
      },
      {
        name: "background-blend-mode",
        values: "normal | multiply | screen | overlay | darken | lighten | color-dodge | color-burn | hard-light | soft-light | difference | exclusion | hue | saturation | color | luminosity",
        notes: "One blend mode per background layer."
      },
      {
        name: "background-clip",
        values: "border-box | padding-box | content-box | text",
        notes: "Box region to which each background layer is painted."
      },
      {
        name: "background-color",
        values: "<color>",
        notes: "Solid fallback behind all background image layers."
      },
      {
        name: "background-image",
        values: "none | <image>#",
        notes: "URLs, gradients, image-set(), and other image values."
      },
      {
        name: "background-origin",
        values: "border-box | padding-box | content-box",
        notes: "Positioning area for each background image layer."
      },
      {
        name: "background-position",
        values: "[left | center | right | <length-percentage>] [top | center | bottom | <length-percentage>]",
        notes: "Position each image layer; accepts one or two axes."
      },
      {
        name: "background-position-x",
        values: "left | center | right | <length-percentage> | side-offset",
        notes: "Horizontal background position component."
      },
      {
        name: "background-position-y",
        values: "top | center | bottom | <length-percentage> | side-offset",
        notes: "Vertical background position component."
      },
      {
        name: "background-repeat",
        values: "repeat | repeat-x | repeat-y | no-repeat | space | round",
        notes: "One repeat mode per image layer; two-value form sets each axis."
      },
      {
        name: "background-size",
        values: "auto | cover | contain | <length-percentage>{1,2}",
        notes: "One size per image layer; cover crops, contain preserves the whole image."
      },
      {
        name: "clip-path",
        values: "none | <basic-shape> || <geometry-box> | <url>",
        notes: "Clips painting and hit testing, not the element's layout box."
      },
      {
        name: "mask-image",
        values: "none | <image>#",
        notes: "Image alpha/luminance controls visibility; provide a fallback."
      },
      {
        name: "object-fit",
        values: "fill | contain | cover | none | scale-down",
        notes: "How replaced content such as an img fills its box."
      },
      {
        name: "object-position",
        values: "[left | center | right | <length-percentage>] [top | center | bottom | <length-percentage>]",
        notes: "Alignment of replaced content inside its frame."
      }
    ]
  },
  {
    id: "property-color",
    title: "Color, themes, and custom properties",
    summary: "Color values are an open grammar: named colors, hex, color functions, system colors, and currentColor.",
    entries: [
      {
        name: "color",
        values: "#184d3b | rgb(24 77 59) | hsl(...) | oklch(...) | currentColor",
        notes: "Text color; inherits. Contrast depends on the actual background."
      },
      {
        name: "color-scheme",
        values: "normal | light | dark | <custom-ident>+",
        notes: "Declares supported schemes for native controls and browser UI."
      },
      {
        name: "--color-accent",
        values: "<custom-property-value>",
        notes: "Project token shown in examples; any valid token stream can be stored."
      },
      {
        name: "--color-border",
        values: "<custom-property-value>",
        notes: "Project token shown in examples."
      },
      {
        name: "--color-canvas",
        values: "<custom-property-value>",
        notes: "Project token shown in examples."
      },
      {
        name: "--color-muted",
        values: "<custom-property-value>",
        notes: "Project token shown in examples."
      },
      {
        name: "--color-surface",
        values: "<custom-property-value>",
        notes: "Project token shown in examples."
      },
      {
        name: "--color-text",
        values: "<custom-property-value>",
        notes: "Project token shown in examples."
      },
      {
        name: "--font-body",
        values: "<custom-property-value>",
        notes: "Project token shown in examples."
      },
      {
        name: "--font-display",
        values: "<custom-property-value>",
        notes: "Project token shown in examples."
      },
      {
        name: "--game-accent",
        values: "<custom-property-value>",
        notes: "Component token shown in examples."
      },
      {
        name: "--radius-small",
        values: "<custom-property-value>",
        notes: "Project token shown in examples."
      },
      {
        name: "--space-1",
        values: "<custom-property-value>",
        notes: "Project spacing token shown in examples."
      },
      {
        name: "--space-2",
        values: "<custom-property-value>",
        notes: "Project spacing token shown in examples."
      },
      {
        name: "--space-3",
        values: "<custom-property-value>",
        notes: "Project spacing token shown in examples."
      },
      {
        name: "--space-4",
        values: "<custom-property-value>",
        notes: "Project spacing token shown in examples."
      },
      {
        name: "--surface",
        values: "<custom-property-value>",
        notes: "Theme token shown in examples."
      },
      {
        name: "--text",
        values: "<custom-property-value>",
        notes: "Theme token shown in examples."
      }
    ]
  },
  {
    id: "property-type",
    title: "Fonts and text",
    summary: "Font shorthands reset several subproperties; declare longhands after font when needed.",
    entries: [
      {
        name: "-webkit-box-orient",
        values: "horizontal | vertical | inline-axis | block-axis",
        notes: "Legacy companion to the prefixed line-clamp pattern."
      },
      {
        name: "-webkit-line-clamp",
        values: "none | <integer>",
        notes: "Legacy-prefixed line count used with display:-webkit-box and box-orient."
      },
      {
        name: "font",
        values: "font-style? font-variant? font-weight? font-stretch? font-size / line-height? font-family",
        notes: "Shorthand resets omitted font subproperties to their initial values."
      },
      {
        name: "font-family",
        values: "<family-name># | generic-family",
        notes: "Comma-separated fallback stack, ending with a generic family."
      },
      {
        name: "font-feature-settings",
        values: "normal | <feature-tag-value>#",
        notes: "Low-level OpenType feature control; prefer a high-level font-variant property."
      },
      {
        name: "font-kerning",
        values: "auto | normal | none",
        notes: "Controls font kerning data."
      },
      {
        name: "font-language-override",
        values: "normal | <string>",
        notes: "Low-level OpenType language-system override."
      },
      {
        name: "font-optical-sizing",
        values: "auto | none",
        notes: "Enables optical-size axis behavior for variable fonts."
      },
      {
        name: "font-size",
        values: "<size-keyword> | 16px | 1rem | 1.2em | 100% | clamp(1rem, 2vw, 1.5rem)",
        notes: "Relative units preserve user scaling; em and percentage are relative to the parent font size. vw-based fluid sizes should be bounded with clamp()."
      },
      {
        name: "font-size-adjust",
        values: "none | [ex-height | cap-height | ch-width | ic-width | ic-height]? <number>",
        notes: "Adjusts fallback font sizing by a metric."
      },
      {
        name: "font-stretch",
        values: "<font-stretch-keyword> | <percentage>",
        notes: "Selects a condensed/expanded face or variable width axis."
      },
      {
        name: "font-style",
        values: "normal | italic | oblique <angle>?",
        notes: "Selects normal, italic, or slanted face."
      },
      {
        name: "font-variant",
        values: "normal | small-caps | variant subproperties",
        notes: "Shorthand for font variant features such as caps, ligatures, numerals, and position."
      },
      {
        name: "font-variant-alternates",
        values: "normal | stylistic() | styleset() | character-variant() | swash() | ornaments() | annotation()",
        notes: "OpenType alternate glyph features."
      },
      {
        name: "font-variant-caps",
        values: "normal | small-caps | all-small-caps | petite-caps | unicase | titling-caps",
        notes: "Capitalization glyph variant."
      },
      {
        name: "font-variant-east-asian",
        values: "normal | jis78 | jis83 | jis90 | jis04 | simplified | traditional | full-width | proportional-width | ruby",
        notes: "East Asian glyph variants."
      },
      {
        name: "font-variant-emoji",
        values: "normal | text | emoji | unicode",
        notes: "Requests a text or emoji presentation where supported."
      },
      {
        name: "font-variant-ligatures",
        values: "normal | none | common-ligatures | no-common-ligatures | discretionary-ligatures | historical-ligatures",
        notes: "Enables or disables ligature features."
      },
      {
        name: "font-variant-numeric",
        values: "normal | lining-nums | oldstyle-nums | proportional-nums | tabular-nums | diagonal-fractions | stacked-fractions | ordinal | slashed-zero",
        notes: "Useful for aligned numeric data and typographic variants."
      },
      {
        name: "font-variant-position",
        values: "normal | sub | super",
        notes: "Subscript or superscript glyph variant."
      },
      {
        name: "font-variation-settings",
        values: "normal | [<string> <number>]#",
        notes: "Low-level variable-font axis control; prefer high-level font properties when possible."
      },
      {
        name: "font-weight",
        values: "normal (400) | bold (700) | 100..1000 (e.g. 400, 600, 700)",
        notes: "Numeric values select static or variable weights when available."
      },
      {
        name: "line-height",
        values: "normal | 1.5 | 24px | 1.5rem",
        notes: "Unitless numbers scale with font size and are a useful default."
      },
      {
        name: "text-align",
        values: "start | end | left | right | center | justify | match-parent",
        notes: "Logical start/end adapt to writing direction."
      },
      {
        name: "text-decoration",
        values: "<'text-decoration-line'> || <'text-decoration-style'> || <'text-decoration-color'> || <'text-decoration-thickness'>",
        notes: "Shorthand for underline/overline/line-through presentation."
      },
      {
        name: "text-decoration-color",
        values: "<color>",
        notes: "Color of text decoration lines."
      },
      {
        name: "text-decoration-line",
        values: "none | underline | overline | line-through",
        notes: "One or more decoration lines."
      },
      {
        name: "text-decoration-style",
        values: "solid | double | dotted | dashed | wavy",
        notes: "Style of text decoration."
      },
      {
        name: "text-decoration-thickness",
        values: "auto | from-font | <length-percentage>",
        notes: "Thickness of underline and other decoration lines."
      },
      {
        name: "text-overflow",
        values: "clip | ellipsis | <string>",
        notes: "Only affects inline overflow in a constrained line; commonly paired with nowrap and hidden overflow."
      },
      {
        name: "text-shadow",
        values: "none | <color>? <length>{2,3}#",
        notes: "Offset, optional blur, and color; multiple shadows are comma-separated."
      },
      {
        name: "text-underline-offset",
        values: "auto | <length-percentage>",
        notes: "Distance between underline and text."
      },
      {
        name: "text-wrap",
        values: "<'text-wrap-mode'> <'text-wrap-style'>?",
        notes: "Shorthand for wrapping mode and balancing/pretty style."
      },
      {
        name: "text-wrap-mode",
        values: "wrap | nowrap",
        notes: "Whether text wraps onto multiple lines."
      },
      {
        name: "text-wrap-style",
        values: "auto | balance | stable | pretty",
        notes: "Preferred line-breaking strategy; exact behavior varies by browser."
      },
      {
        name: "vertical-align",
        values: "baseline | sub | super | text-top | text-bottom | middle | top | bottom | <length-percentage>",
        notes: "Inline-level or table-cell alignment, not general flex/grid alignment."
      },
      {
        name: "white-space",
        values: "normal | pre | pre-wrap | pre-line | nowrap | break-spaces",
        notes: "Shorthand for white-space-collapse and text-wrap-mode."
      },
      {
        name: "white-space-collapse",
        values: "collapse | preserve | preserve-breaks | preserve-spaces | break-spaces",
        notes: "Controls collapsing of spaces and segment breaks."
      },
      {
        name: "overflow-wrap",
        values: "normal | break-word | anywhere",
        notes: "Allows long unbreakable tokens to wrap at overflow."
      },
      {
        name: "word-break",
        values: "normal | break-all | keep-all | auto-phrase",
        notes: "Changes line-breaking rules; avoid break-all for ordinary prose."
      }
    ]
  },
  {
    id: "property-tables-images",
    title: "Table formatting",
    summary: "Properties that affect table border layout.",
    entries: [
      {
        name: "border-collapse",
        values: "collapse | separate",
        notes: "See Borders; included here because it changes table cell borders."
      }
    ]
  },
  {
    id: "property-controls",
    title: "Controls and pointer behavior",
    summary: "Input properties should refine native controls, not remove their keyboard and accessibility behavior.",
    entries: [
      {
        name: "accent-color",
        values: "auto | <color>",
        notes: "See Controls; tints native accentable controls."
      },
      {
        name: "appearance",
        values: "none | auto | base | base-select | <appearance-role>",
        notes: "Platform appearance keywords vary; custom appearance means rebuilding all states."
      },
      {
        name: "caret-color",
        values: "auto | <color>",
        notes: "Insertion caret color in editable fields."
      },
      {
        name: "cursor",
        values: "auto | default | pointer | text | move | grab | grabbing | not-allowed | <url>+ <keyword>",
        notes: "Pointer feedback; does not itself make an element interactive."
      },
      {
        name: "pointer-events",
        values: "auto | none | SVG-specific keywords",
        notes: "none lets pointer targeting pass through an element."
      },
      {
        name: "resize",
        values: "none | both | horizontal | vertical | block | inline",
        notes: "Controls native resizability, commonly on textarea."
      },
      {
        name: "touch-action",
        values: "auto | none | manipulation | pan-x | pan-y | pinch-zoom | combinations",
        notes: "Declares which gestures the browser may handle; preserve page panning."
      },
      {
        name: "user-select",
        values: "auto | text | none | all",
        notes: "Controls selection behavior; do not disable selection across content."
      }
    ]
  },
  {
    id: "property-scroll",
    title: "Overflow and scrolling",
    summary: "Scroll properties control clipping, scroll containers, snapping, and fragment navigation offsets.",
    entries: [
      {
        name: "overflow",
        values: "visible | hidden | clip | scroll | auto",
        notes: "Shorthand for overflow-x and overflow-y; affects sticky descendants."
      },
      {
        name: "overflow-x",
        values: "visible | hidden | clip | scroll | auto",
        notes: "Overflow behavior on the physical horizontal axis."
      },
      {
        name: "overflow-y",
        values: "visible | hidden | clip | scroll | auto",
        notes: "Overflow behavior on the physical vertical axis."
      },
      {
        name: "overscroll-behavior",
        values: "auto | contain | none",
        notes: "Shorthand for overscroll-behavior-x and -y."
      },
      {
        name: "overscroll-behavior-inline",
        values: "auto | contain | none",
        notes: "Controls scroll chaining/overscroll effects on the logical inline axis."
      },
      {
        name: "scroll-behavior",
        values: "auto | smooth",
        notes: "Smooth fragment/programmatic scrolling; honor reduced motion."
      },
      {
        name: "scroll-margin-block-start",
        values: "<length>",
        notes: "Extra scroll snap/fragment margin before a target in block direction."
      },
      {
        name: "scroll-padding-block-start",
        values: "auto | <length-percentage>",
        notes: "Inset for the scrollport's optimal viewing region."
      },
      {
        name: "scroll-snap-align",
        values: "none | start | end | center [start | end | center]?",
        notes: "Alignment of a snap target within its scroll container."
      },
      {
        name: "scroll-snap-type",
        values: "none | [x | y | block | inline | both] [mandatory | proximity]?",
        notes: "Snap axis and strictness for a scroll container."
      }
    ]
  },
  {
    id: "property-motion",
    title: "Transforms, transitions, and animations",
    summary: "Durations and delays accept time values; transformable state and timing functions are property-specific.",
    entries: [
      {
        name: "animation",
        values: "<'animation-name'> || <time>{1,2} || <timing-function> || <iteration-count> || <direction> || <fill-mode> || <play-state> || <timeline>",
        notes: "Shorthand for animation-*; order is compact but can be harder to scan."
      },
      {
        name: "animation-delay",
        values: "<time> (e.g. 150ms | 0.2s | -100ms)",
        notes: "May be negative to begin partway through an animation."
      },
      {
        name: "animation-direction",
        values: "normal | reverse | alternate | alternate-reverse",
        notes: "Direction for each iteration."
      },
      {
        name: "animation-duration",
        values: "<time> (e.g. 180ms | 1s | 2.4s)",
        notes: "Active duration; negative values are invalid."
      },
      {
        name: "animation-fill-mode",
        values: "none | forwards | backwards | both",
        notes: "Whether keyframe styles apply before/after the active interval."
      },
      {
        name: "animation-iteration-count",
        values: "infinite | <number> (e.g. 1 | 2 | 0.5)",
        notes: "Number of iterations; fractional counts are allowed."
      },
      {
        name: "animation-name",
        values: "none | <keyframes-name>#",
        notes: "Name declared by @keyframes."
      },
      {
        name: "animation-play-state",
        values: "running | paused",
        notes: "Can pause a running keyframe animation."
      },
      {
        name: "animation-range-end",
        values: "normal | <timeline-range-name> <length-percentage>?",
        notes: "Ending point on a scroll/view timeline."
      },
      {
        name: "animation-range-start",
        values: "normal | <timeline-range-name> <length-percentage>?",
        notes: "Starting point on a scroll/view timeline."
      },
      {
        name: "animation-timeline",
        values: "auto | none | <scroll-timeline> | <view-timeline> | <custom-ident>",
        notes: "Time or scroll-driven timeline; support is newer."
      },
      {
        name: "animation-timing-function",
        values: "linear | ease | ease-in | ease-out | ease-in-out | steps(4, end) | cubic-bezier(0.2, 0.8, 0.2, 1)",
        notes: "Controls progress between keyframes."
      },
      {
        name: "filter",
        values: "none | <filter-function>+ | <url>",
        notes: "Functions include blur(), brightness(), contrast(), grayscale(), saturate(), and drop-shadow()."
      },
      {
        name: "backdrop-filter",
        values: "none | <filter-function>+ | <url>",
        notes: "Filters pixels behind a translucent element."
      },
      {
        name: "mix-blend-mode",
        values: "normal | multiply | screen | overlay | darken | lighten | color-dodge | color-burn | hard-light | soft-light | difference | exclusion | hue | saturation | color | luminosity",
        notes: "Blends an element with its backdrop."
      },
      {
        name: "opacity",
        values: "0 | 0.65 | 1 | 0% | 65% | 100%",
        notes: "0 is transparent; 1/100% is opaque. Values below 1 create a stacking context."
      },
      {
        name: "transform",
        values: "none | <transform-function>+",
        notes: "Functions include translate(), rotate(), scale(), skew(), and matrix()."
      },
      {
        name: "transform-origin",
        values: "[<length-percentage> | left | center | right] [<length-percentage> | top | center | bottom] <length>?",
        notes: "Pivot for transform functions."
      },
      {
        name: "transition",
        values: "<'transition-property'> || <time>{1,2} || <timing-function> || <transition-behavior>",
        notes: "Shorthand for transition-*; prefer named properties over all."
      },
      {
        name: "transition-behavior",
        values: "normal | allow-discrete",
        notes: "Whether discrete properties may transition."
      },
      {
        name: "transition-delay",
        values: "<time> (e.g. 0ms | 120ms | 0.3s)",
        notes: "Delay before each transition begins."
      },
      {
        name: "transition-duration",
        values: "<time> (e.g. 140ms | 0.2s | 1s)",
        notes: "Time each transition takes; negative values are invalid."
      },
      {
        name: "transition-property",
        values: "none | all | <custom-ident>#",
        notes: "Properties to transition; explicit lists are easier to maintain."
      },
      {
        name: "transition-timing-function",
        values: "linear | ease | ease-in | ease-out | ease-in-out | steps() | cubic-bezier()",
        notes: "Interpolation curve for transitioned values."
      },
      {
        name: "will-change",
        values: "auto | <custom-ident># | scroll-position | contents",
        notes: "Use briefly before measured work; can consume memory and create layers."
      }
    ]
  },
  {
    id: "property-special",
    title: "Legacy properties and font descriptors",
    summary: "Includes prefixed line-clamp properties and @font-face descriptors used in examples.",
    entries: [
      {
        name: "font-display",
        values: "auto | block | swap | fallback | optional",
        notes: "@font-face descriptor rather than an element property."
      },
      {
        name: "src",
        values: "local(<font-name>) | url(<url>) format(<format>)#",
        notes: "@font-face descriptor selecting local or downloadable font sources."
      }
    ]
  }
];
const propertyCount = propertyGroups.reduce((count, group)=>count + group.entries.length, 0);
defineComponent("docs-css-property-reference", {
  template: ()=>html`
      <article class="docs-page">
        <p class="page-eyebrow">CSS reference · Index</p>
        <h1>CSS property reference</h1>
        <p class="page-lead">
          A searchable index of the properties and font descriptors used or
          directly discussed in the CSS Layout and CSS Reference chapters.
          Entries are grouped by the problem they solve, not alphabetically.
          The value column gives common syntax and keywords from those topics.
        </p>
        <nala-callout tone="info">
          <span slot="title">Value syntax, in plain language</span>
          The angle brackets describe a kind of value, not text to type.
          <code>&lt;length&gt;</code> examples are <code>16px</code>,
          <code>1rem</code>, and <code>0.5em</code>; a percentage example is
          <code>50%</code>. <code>rem</code> follows the root font size,
          <code>em</code> scales with font size, and percentages depend on the
          property's reference. <code>1fr</code> means one share of available
          Grid track space; it is not a general length and cannot be used for
          <code>font-size</code>. Other examples: number <code>0.5</code>,
          angle <code>90deg</code>, time <code>180ms</code>, color
          <code>#184d3b</code>, and image <code>linear-gradient(...)</code>.
          These value types have many valid values, so rows show syntax and
          useful examples rather than finite lists. Shorthands summarize their
          component longhands. This index covers properties taught on this
          site, not every property in the CSS specifications.
        </nala-callout>

        <label class="property-search-label" for="property-search">Filter by property, value, or note</label>
        <input
          id="property-search"
          type="search"
          placeholder="Try grid, color, or hover"
          aria-describedby="property-count"
          style="display: block; inline-size: min(100%, 32rem); margin-block: 0.5rem 0.75rem; padding: 0.65rem; font: inherit;"
        />
        <p id="property-count" role="status" aria-live="polite">
          ${propertyCount} entries
        </p>
        <nav class="component-doc-nav" aria-label="Property groups">
          ${repeat(propertyGroups, (group)=>group.id, (group)=>html`<a href=${`#${group.id}`}>${group.title}</a>`)}
        </nav>

        ${repeat(propertyGroups, (group)=>group.id, (group)=>html`
              <section data-property-group id=${group.id}>
                <h2>${group.title}</h2>
                <p>${group.summary}</p>
                <div class="api-table-wrap">
                  <table class="api-table">
                    <thead>
                      <tr>
                        <th scope="col">Property or descriptor</th>
                        <th scope="col">Common values / syntax</th>
                        <th scope="col">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${repeat(group.entries, (entry)=>entry.name, (entry)=>html`
                            <tr
                              data-property-row
                              data-search=${`${entry.name} ${entry.values} ${entry.notes}`.toLowerCase()}
                            >
                              <th scope="row"><code>${entry.name}</code></th>
                              <td><code>${entry.values}</code></td>
                              <td>${entry.notes}</td>
                            </tr>
                          `)}
                    </tbody>
                  </table>
                </div>
              </section>
            `)}
        <p id="property-empty" hidden>No entries match that search.</p>
        <p>
          For complete examples that combine these properties into interface
          patterns, see the <a href="/css/cookbook">CSS Cookbook</a>. To learn
          an individual topic in sequence, return to the
          <a href="/css/foundations">CSS Reference overview</a>.
        </p>
      </article>
    `,
  onConnect: ({ listen, query, queryAll })=>{
    const input = query("#property-search");
    const count = query("#property-count");
    const empty = query("#property-empty");
    if (!input || !count || !empty) return;
    const rows = queryAll("[data-property-row]");
    const groups = queryAll("[data-property-group]");
    const updateResults = ()=>{
      const queryText = input.value.trim().toLowerCase();
      let visibleCount = 0;
      for (const row of rows){
        const matches = (row.dataset.search ?? "").includes(queryText);
        row.hidden = !matches;
        if (matches) visibleCount++;
      }
      for (const group of groups){
        group.hidden = !group.querySelector("[data-property-row]:not([hidden])");
      }
      count.textContent = `${visibleCount} ${visibleCount === 1 ? "entry" : "entries"}`;
      empty.hidden = visibleCount !== 0;
    };
    listen(input, "input", updateResults);
  }
});
