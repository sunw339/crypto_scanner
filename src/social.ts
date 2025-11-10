export type SocialScore = { sentiment: number; mentions: number };

export async function fetchSocialScore(symbol: string): Promise<SocialScore> {
  // TODO: replace with LunarCrush or X API
  return {
    sentiment: (Math.random() - 0.5) * 1.5,
    mentions: Math.floor(Math.random() * 500),
  };
}
