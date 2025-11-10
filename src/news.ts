import fetch from "node-fetch";

export type NewsScore = { sentiment: number; headlines: string[] };

export async function fetchNewsScore(symbol: string): Promise<NewsScore> {
  const API_KEY = process.env.CRYPTOPANIC_KEY;
  if (!API_KEY) return { sentiment: 0, headlines: [] };
  try {
    const url = `https://cryptopanic.com/api/v1/posts/?auth_token=${API_KEY}&currencies=${symbol}`;
    const res = await fetch(url);
    const data: any = await res.json();
    let sentiment = 0;
    const headlines: string[] = [];
    for (const p of data.results ?? []) {
      headlines.push(p.title);
      if (p.votes?.negative > p.votes?.positive) sentiment -= 0.3;
      else if (p.votes?.positive > p.votes?.negative) sentiment += 0.3;
    }
    return { sentiment: Math.max(-1, Math.min(1, sentiment)), headlines };
  } catch {
    return { sentiment: 0, headlines: [] };
  }
}
