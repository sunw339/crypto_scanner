import dayjs from "dayjs";
import {
  buildExchange,
  listUSDT,
  topByQuoteVolume,
  fetchOHLCV,
} from "./exchange";
import { scoreAsset } from "./scoring";
import { notify } from "./notifier";

export async function scanAndNotify() {
  const ex = buildExchange("binance");
  const syms = await listUSDT(ex, "USDT");
  const top = await topByQuoteVolume(ex, syms, 10, true);

  const results = [];
  for (const s of top) {
    const ohlc = await fetchOHLCV(ex, s.symbol, "1d", 200);
    const scored = await scoreAsset({
      symbol: s.symbol,
      close: ohlc.c,
      high: ohlc.h,
      low: ohlc.l,
      baseCapital: 1000,
    });
    results.push(scored);
  }

  const lines = results.map(
    (r) =>
      `${r.symbol} | ${r.advice} | 점수:${r.score.toFixed(
        2
      )} | 뉴스:${r.newsHeadlines.join(" / ")}`
  );
  const text = lines.join("\n\n");
  await notify(`코인 스캐너 ${dayjs().format("YYYY-MM-DD HH:mm")}`, text);
}
