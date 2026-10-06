export const recipe = {
  slug: "generic-result-envelope",
  category: "Generics and inference",
  title: "Keep API envelopes generic over their payload",
  problem: "Every endpoint duplicates the same response shape, or a shared ApiResponse type loses the specific payload type and callers fall back to unknown or any.",
  rootCause: "An envelope has stable metadata and a payload that changes by endpoint. A type parameter models that reusable relationship while preserving each endpoint's concrete data shape.",
  solutionCode: `type ApiResponse<Data> = {
  data: Data;
  requestId: string;
};

type GameCard = { id: string; title: string };

async function fetchFeaturedGame(): Promise<ApiResponse<GameCard>> {
  const response = await fetch("/api/featured-game");
  if (!response.ok) throw new Error("Request failed");
  const payload: unknown = await response.json();
  return parseApiResponse(payload, parseGameCard);
}

const result = await fetchFeaturedGame();
result.data.title; // GameCard`,
  whyItWorks: "Data remains a type parameter, so the same envelope supports different endpoint payloads without erasing the relationship. The payload still must be validated at runtime before it is returned as GameCard.",
  commonTrap: "Do not write fetchJson<GameCard>() and trust the generic argument to validate a response. Generics only describe what the checker assumes; parse and validate unknown bytes at the boundary.",
  workedExampleCode: `type ApiResponse<Data, Meta = {}> = {
  data: Data;
  meta: Meta;
};

type GamePage = ApiResponse<readonly Game[], { nextCursor?: string }>;
type SettingsResponse = ApiResponse<Settings>;`,
  workedExampleExplanation: "A default metadata type makes the common case concise, while an endpoint that has pagination metadata can provide a specialized type. Avoid defaulting to any; unknown is safer when a payload's shape has not been validated.",
  decisionGuide: "Use generic envelopes when metadata is stable and payload type varies. Keep transport response types separate from domain models when API fields or versioning differ. Prefer endpoint-specific functions for status handling and validation.",
  edgeCases: [
    "HTTP non-success responses may still fulfill fetch; check response.ok before parsing success data.",
    "JSON parsing can throw, and a valid JSON value can still have the wrong payload shape.",
    "Optional metadata such as pagination cursors must be handled as possibly absent.",
    "A generic default should not make an unvalidated payload look trusted."
  ],
  verificationCode: `type ApiResponse<Data> = { data: Data; requestId: string };

function mapResponse<Input, Output>(
  response: ApiResponse<Input>,
  map: (input: Input) => Output,
): ApiResponse<Output> {
  return { ...response, data: map(response.data) };
}

const summary = mapResponse(
  { requestId: "r-1", data: { id: "g-1", title: "Tunic" } },
  (game) => game.title,
);`,
  verificationNote: "Type-check the example and inspect summary.data: it should be string while requestId remains string. Runtime response parsing still requires a validator.",
  practice: "Model a paginated game response with a generic item payload and cursor metadata. Add a parser that validates unknown JSON before returning ApiResponse<readonly Game[]>."
};
