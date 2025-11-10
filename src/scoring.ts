import { fetchNewsScore } from "./news";
import { fetchSocialScore } from "./social";
import { MockOnchain } from "./onchain";

// 유틸
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// 정규화 헬퍼
function normalize(x: number, min: number, max: number) {
  if (max === min) return 0;
  const v = (x - min) / (max - min);
  return clamp(v * 2 - 1, -1, 1); // 0~1 → -1~1 로 변환
}

export async function scoreAsset(params: {
  symbol: string;
  close: number[];
  high: number[];
  low: number[];
  baseCapital: number;
}) {
  const last = params.close.at(-1) ?? 0;

  // ---------------------------
  // ✅ 기술적 분석 (테크니컬 스코어)
  // ---------------------------

  // ATR %
  const atr14 =
    (Math.max(...params.high.slice(-14)) - Math.min(...params.low.slice(-14))) /
    14;
  const atrPct = atr14 / last;

  // ATR 0.3%~8% → 정상, 너무 낮으면 박스, 너무 높으면 급등/급락
  const atrNorm = normalize(atrPct, 0.003, 0.08);

  // EMA 방향성 (추세 스코어)
  const emaShort = params.close.slice(-7).reduce((a, b) => a + b, 0) / 7;
  const emaLong = params.close.slice(-25).reduce((a, b) => a + b, 0) / 25;
  const trendNorm = emaShort > emaLong ? 1 : -1;

  // 거래량 변화율 (간단 MOCK)
  const volNorm = 0.3; // 나중에 실제 거래량 넣을 때 수정

  const technicalScore = (atrNorm + trendNorm + volNorm) / 3; // -1~1
  const weightedTechnical = technicalScore * 3; // weight 3

  // ---------------------------
  // ✅ 뉴스
  // ---------------------------
  const news = await fetchNewsScore(params.symbol);
  const newsNorm = normalize(news.sentiment, -3, 3);
  const weightedNews = newsNorm * 1;

  // ---------------------------
  // ✅ 소셜
  // ---------------------------
  const social = await fetchSocialScore(params.symbol);
  const socialNorm = normalize(social.sentiment, -5, 5);
  const weightedSocial = socialNorm * 0.5;

  // ---------------------------
  // ✅ 온체인
  // ---------------------------
  const onchain = await new MockOnchain().fetch(params.symbol.split("/")[0]);
  const onchainRaw =
    onchain.whaleRisk + onchain.stableNetflow + onchain.activeAddr;
  const onchainNorm = normalize(onchainRaw, -3, 3);
  const weightedOnchain = onchainNorm * 2;

  // ---------------------------
  // ✅ 최종 점수
  // ---------------------------
  let score =
    weightedTechnical + weightedNews + weightedSocial + weightedOnchain;

  // 범위 -10~+10 제한
  score = clamp(score, -10, 10);

  // ---------------------------
  // ✅ 매매 판단
  // ---------------------------
  let advice = "관망";

  if (score >= 6) advice = "강매수";
  else if (score >= 4) advice = "매수";
  else if (score >= 2) advice = "관망";
  else if (score >= -2) advice = "중립";
  else if (score >= -4) advice = "주의";
  else advice = "회피";

  return {
    symbol: params.symbol,
    advice,
    score,
    atrPct,
    technicalScore,
    newsHeadlines: news.headlines.slice(0, 3),
    socialMentions: social.mentions,
    whaleRisk: onchain.whaleRisk,
  };
}
