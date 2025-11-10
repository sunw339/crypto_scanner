declare module "ccxt" {
  interface Exchange {
    loadMarkets(): Promise<any>;
    fetchTickers(symbols?: string[]): Promise<any>;
    fetchOHLCV(
      symbol: string,
      timeframe?: string,
      since?: number,
      limit?: number
    ): Promise<any[]>;
    fetchTicker(symbol: string): Promise<any>;
    [k: string]: any;
  }

  const ccxt: {
    [key: string]: any;
    Exchange: new (...args: any[]) => Exchange;
  };

  export = ccxt;
}
