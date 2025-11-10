import ccxt = require("ccxt");

export const buildExchange = (id = "binance") => {
  const C: any = (ccxt as any)[id];
  if (!C) throw new Error(`Unsupported exchange ${id}`);
  return new C({ enableRateLimit: true });
};

export const listUSDT = async (ex: any, quote = "USDT") => {
  const m = await ex.loadMarkets();
  return Object.values(m)
    .filter(
      (x: any) => x.spot && x.active && (x.quote || "").toUpperCase() === quote
    )
    .map((x: any) => x.symbol);
};

export const topByQuoteVolume = async (
  ex: any,
  syms: string[],
  n: number,
  includeSmall = false
) => {
  const t = await ex.fetchTickers(syms);
  const arr = Object.entries(t).map(([s, v]: any) => ({
    symbol: s,
    last: v.last || v.close || 0,
    qv: v.quoteVolume ?? (v.last || 0) * (v.baseVolume || 0),
  }));
  const sorted = arr.filter((x) => x.qv > 0).sort((a, b) => b.qv - a.qv);
  return includeSmall
    ? sorted.slice(0, n)
    : sorted.filter((x) => x.qv > 5_000_000).slice(0, n);
};

export const fetchOHLCV = async (
  ex: any,
  sym: string,
  tf = "1d",
  limit = 200
) => {
  const raw = await ex.fetchOHLCV(sym, tf, undefined, limit);
  const o = raw.map((r: number[]) => r[1]);
  const h = raw.map((r: number[]) => r[2]);
  const l = raw.map((r: number[]) => r[3]);
  const c = raw.map((r: number[]) => r[4]);
  const v = raw.map((r: number[]) => r[5]);

  return { o, h, l, c, v };
};
