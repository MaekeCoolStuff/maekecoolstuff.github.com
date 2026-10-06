import { defineComponent, html, repeat } from "../../../components/dist/index.js";
import { iconPaths } from "../icon/icon-web-data.js";
import { playingCardIsRed, playingCardLabel, playingCardPips, validatePlayingCardRank, validatePlayingCardSuit } from "./playing-card-data.js";
const suitPaths = {
  spades: iconPaths["cards-spade-filled"],
  hearts: iconPaths["cards-heart-filled"],
  diamonds: iconPaths["cards-diamond-filled"],
  clubs: iconPaths["cards-club-filled"]
};
function courtFigure(rank, inverted) {
  const crown = rank === "J" ? "M10 12V6l20 3 20-3v6Z" : rank === "Q" ? "M10 12L7 2l12 6L30 1l11 7 12-6-3 10Z" : "M10 12V3h8v5h8V1h8v7h8V3h8v9Z";
  return html`
    <svg x="20" y="28" width="60" height="84" viewBox="0 0 60 84" part="portrait">
      <g transform=${inverted ? "rotate(180 30 42)" : null}>
        <path d="M8 41l3-12 19-7 19 7 3 12Z" fill="currentColor"></path>
        <circle cx="30" cy="19" r="8" fill="var(--nala-playing-card-paper, #fff)"
          stroke="currentColor" stroke-width="1.5"></circle>
        <path d=${crown} fill="var(--nala-playing-card-gold, #b88624)"></path>
        <path d="M27 18h1M33 18h1M28 23h4" fill="none"
          stroke="currentColor" stroke-linecap="round"></path>
        <path d="M20 30l10 8 10-8M14 37h32" fill="none"
          stroke="var(--nala-playing-card-gold, #b88624)" stroke-width="2"></path>
        <text x="30" y="35" text-anchor="middle" font-size="8"
          fill="var(--nala-playing-card-paper, #fff)">${rank}</text>
      </g>
    </svg>
  `;
}
function cardFace(props) {
  const suitPath = suitPaths[props.suit];
  const joker = props.rank === "joker";
  return html`
    <svg viewBox="0 0 100 140" width="100" height="140" part="face"
      aria-hidden="true">
      ${repeat([
    false,
    true
  ], (inverted)=>inverted, (inverted)=>html`
          <svg viewBox="0 0 100 140" width="100" height="140">
            <g part="corner" transform=${inverted ? "rotate(180 50 70)" : null}>
              <text x="12" y="18" text-anchor="middle"
                font-size=${joker ? 10 : 15}>${joker ? "Jkr" : props.rank}</text>
              <svg x="5" y="21" width="14" height="14" viewBox="0 0 24 24">
                <path d=${suitPath} fill="currentColor"></path>
              </svg>
            </g>
          </svg>
        `)}
      ${joker ? html`
          <svg x="22" y="35" width="56" height="70" viewBox="0 0 56 70" part="portrait">
            <path d="M7 30L3 6l16 9L28 2l9 13L53 6l-4 24Z"
              fill="var(--nala-playing-card-gold, #b88624)" stroke="currentColor"></path>
            <circle cx="28" cy="36" r="16" fill="var(--nala-playing-card-paper, #fff)"
              stroke="currentColor" stroke-width="2"></circle>
            <path d="M19 33h3M34 33h3M18 40q10 14 20 0M10 66l18-13 18 13Z"
              fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round"></path>
            <text x="28" y="70" text-anchor="middle" font-size="7">JOKER</text>
          </svg>
        ` : props.rank === "J" || props.rank === "Q" || props.rank === "K" ? html`<svg viewBox="0 0 100 140" width="100" height="140">
          <rect x="22" y="28" width="56" height="84" rx="2" fill="none"
            stroke="currentColor" stroke-width="0.8"></rect>
          ${repeat([
    false,
    true
  ], (inverted)=>inverted, (inverted)=>courtFigure(props.rank, inverted))}
        </svg>` : repeat(playingCardPips(props.rank), (pip)=>`${pip.x},${pip.y}`, (pip)=>{
    const size = props.rank === "A" ? 32 : 18;
    return html`
              <svg x=${pip.x - size / 2} y=${pip.y - size / 2}
                width=${size} height=${size} viewBox="0 0 24 24" part="pip">
                <path d=${suitPath} transform=${pip.inverted ? "rotate(180 12 12)" : null}
                  fill="currentColor"></path>
              </svg>
            `;
  })}
    </svg>
  `;
}
defineComponent("nala-playing-card", {
  shadow: true,
  props: {
    rank: {
      type: "string",
      default: "A",
      validate: validatePlayingCardRank
    },
    suit: {
      type: "string",
      default: "spades",
      validate: validatePlayingCardSuit
    },
    faceDown: {
      type: "boolean",
      attribute: "face-down"
    },
    decorative: "boolean"
  },
  styles: ":host {\n  display: inline-block;\n  width: var(--nala-playing-card-width, 7.5rem);\n  max-width: 100%;\n  vertical-align: middle;\n  line-height: 0;\n}\nsvg { display: block; overflow: visible; }\n.card { width: 100%; height: auto; }\n.black { color: var(--nala-playing-card-black, #18201d); }\n.red { color: var(--nala-playing-card-red, #b42332); }\ntext {\n  font-family: var(--nala-ui-font-body, system-ui, sans-serif);\n  font-weight: 700;\n}\n",
  template: (props)=>html`
      <svg class=${`card ${playingCardIsRed(props.suit) ? "red" : "black"}`}
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 140" fill="currentColor"
        width="100" height="140" part="card" focusable="false"
        role=${props.decorative ? null : "img"}
        aria-hidden=${props.decorative ? "true" : null}
        aria-label=${props.decorative ? null : playingCardLabel(props.rank, props.suit, props.faceDown)}>
        <rect x="1" y="1" width="98" height="138" rx="7"
          fill="var(--nala-playing-card-paper, #fff)"
          stroke="var(--nala-playing-card-border, #cbcfc8)"></rect>
        ${props.faceDown ? html`
            <svg viewBox="0 0 100 140" width="100" height="140" part="back"
              aria-hidden="true">
              <rect x="7" y="7" width="86" height="126" rx="4"
                fill="var(--nala-playing-card-back, var(--nala-ui-color-accent, #184d3b))"></rect>
              <rect x="12" y="12" width="76" height="116" rx="2"
                fill="none" stroke="var(--nala-playing-card-paper, #fff)"></rect>
              <path d="M50 25l28 45-28 45-28-45ZM50 40l19 30-19 30-19-30Z"
                fill="none" stroke="var(--nala-playing-card-paper, #fff)"
                stroke-width="2"></path>
              <circle cx="50" cy="70" r="7"
                fill="var(--nala-playing-card-paper, #fff)"></circle>
            </svg>
          ` : cardFace(props)}
      </svg>
    `
});
