import { fetchNewsScore } from "./news";
import { fetchSocialScore } from "./social";
import { MockOnchain } from "./onchain";

export async function scoreAsset(params: {
  symbol: string;
  close: number[];
  high: number[];
  low: number[];
  baseCapital: number;
}) {
  const last = params.close.at(-1) ?? 0;
  const atr =
    (Math.max(...params.high.slice(-14)) - Math.min(...params.low.slice(-14))) /
    14;
  const atrPct = atr / last;

  // 기술적 점수
  let score = atrPct > 0.005 && atrPct < 0.1 ? 1 : -1;

  // 뉴스
  const news = await fetchNewsScore(params.symbol);
  score += news.sentiment;

  // 소셜
  const social = await fetchSocialScore(params.symbol);
  score += social.sentiment;

  // 온체인
  const onchain = await new MockOnchain().fetch(params.symbol.split("/")[0]);
  score += onchain.whaleRisk + onchain.stableNetflow + onchain.activeAddr;

  let advice = "관망";
  if (score > 1.5) advice = "매수";
  else if (score < -1.5) advice = "회피";

  return {
    symbol: params.symbol,
    advice,
    score,
    newsHeadlines: news.headlines.slice(0, 3),
    mentions: social.mentions,
    atrPct,
    whaleRisk: onchain.whaleRisk,
  };
}
