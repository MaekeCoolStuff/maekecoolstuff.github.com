export const nalaPlayingCardRanks = Object.freeze([
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K"
]);
export const nalaPlayingCardSuits = Object.freeze([
  "spades",
  "hearts",
  "diamonds",
  "clubs"
]);
export function validatePlayingCardRank(value) {
  if (value !== "joker" && !nalaPlayingCardRanks.some((rank)=>rank === value)) {
    throw new RangeError('Playing card rank must be A, 2-10, J, Q, K, or "joker"');
  }
}
export function validatePlayingCardSuit(value) {
  if (!nalaPlayingCardSuits.some((suit)=>suit === value)) {
    throw new RangeError("Playing card suit must be spades, hearts, diamonds, or clubs");
  }
}
const pipPositions = {
  A: [
    [
      50,
      70
    ]
  ],
  "2": [
    [
      50,
      32
    ],
    [
      50,
      108
    ]
  ],
  "3": [
    [
      50,
      32
    ],
    [
      50,
      70
    ],
    [
      50,
      108
    ]
  ],
  "4": [
    [
      30,
      32
    ],
    [
      70,
      32
    ],
    [
      30,
      108
    ],
    [
      70,
      108
    ]
  ],
  "5": [
    [
      30,
      32
    ],
    [
      70,
      32
    ],
    [
      50,
      70
    ],
    [
      30,
      108
    ],
    [
      70,
      108
    ]
  ],
  "6": [
    [
      30,
      32
    ],
    [
      70,
      32
    ],
    [
      30,
      70
    ],
    [
      70,
      70
    ],
    [
      30,
      108
    ],
    [
      70,
      108
    ]
  ],
  "7": [
    [
      30,
      32
    ],
    [
      70,
      32
    ],
    [
      50,
      51
    ],
    [
      30,
      70
    ],
    [
      70,
      70
    ],
    [
      30,
      108
    ],
    [
      70,
      108
    ]
  ],
  "8": [
    [
      30,
      32
    ],
    [
      70,
      32
    ],
    [
      50,
      51
    ],
    [
      30,
      70
    ],
    [
      70,
      70
    ],
    [
      50,
      89
    ],
    [
      30,
      108
    ],
    [
      70,
      108
    ]
  ],
  "9": [
    [
      30,
      32
    ],
    [
      70,
      32
    ],
    [
      30,
      57
    ],
    [
      70,
      57
    ],
    [
      50,
      70
    ],
    [
      30,
      83
    ],
    [
      70,
      83
    ],
    [
      30,
      108
    ],
    [
      70,
      108
    ]
  ],
  "10": [
    [
      30,
      32
    ],
    [
      70,
      32
    ],
    [
      50,
      44
    ],
    [
      30,
      57
    ],
    [
      70,
      57
    ],
    [
      30,
      83
    ],
    [
      70,
      83
    ],
    [
      50,
      96
    ],
    [
      30,
      108
    ],
    [
      70,
      108
    ]
  ]
};
export function playingCardPips(rank) {
  validatePlayingCardRank(rank);
  return (pipPositions[rank] ?? []).map(([x, y])=>({
      x,
      y,
      inverted: y > 70
    }));
}
const rankNames = {
  A: "Ace",
  "2": "Two",
  "3": "Three",
  "4": "Four",
  "5": "Five",
  "6": "Six",
  "7": "Seven",
  "8": "Eight",
  "9": "Nine",
  "10": "Ten",
  J: "Jack",
  Q: "Queen",
  K: "King",
  joker: "Joker"
};
export function playingCardIsRed(suit) {
  validatePlayingCardSuit(suit);
  return suit === "hearts" || suit === "diamonds";
}
export function playingCardLabel(rank, suit, faceDown) {
  validatePlayingCardRank(rank);
  validatePlayingCardSuit(suit);
  if (faceDown) return "Face-down playing card";
  if (rank === "joker") {
    return playingCardIsRed(suit) ? "Red joker" : "Black joker";
  }
  return `${rankNames[rank]} of ${suit}`;
}
