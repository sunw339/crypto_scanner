export type OnchainMetrics = {
  whaleRisk: number;
  stableNetflow: number;
  activeAddr: number;
};

export class MockOnchain {
  async fetch(symbol: string): Promise<OnchainMetrics> {
    // TODO: replace with real on-chain data (Glassnode/Nansen)
    return {
      whaleRisk: Math.random() * 2 - 1,
      stableNetflow: Math.random() * 2 - 1,
      activeAddr: Math.random() * 2 - 1,
    };
  }
}
