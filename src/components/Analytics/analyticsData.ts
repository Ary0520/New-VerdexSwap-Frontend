// ── Helpers ──────────────────────────────────────────────────────────────────
const seed = (n: number) => {
  let s = n;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
};

const walk = (len: number, start: number, volatility: number, trend: number, rng: () => number) =>
  Array.from({ length: len }, (_, i) => {
    start = start * (1 + trend) + (rng() - 0.5) * volatility * start;
    return Math.max(0, parseFloat(start.toFixed(2)));
  });

// ── Time labels ───────────────────────────────────────────────────────────────
export const DAYS_30 = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2025, 2, 1 + i);
  return `${d.getMonth() + 1}/${d.getDate()}`;
});

// ── Protocol-level series ─────────────────────────────────────────────────────
const r1 = seed(42), r2 = seed(77), r3 = seed(13), r4 = seed(99);

export const TVL_SERIES       = walk(30, 195, 0.04, 0.003, r1);   // $M
export const VOLUME_SERIES    = walk(30, 52,  0.35, 0.001, r2);   // $M
export const FEES_CUMULATIVE  = (() => {
  let acc = 0;
  return VOLUME_SERIES.map(v => parseFloat((acc += v * 0.0055).toFixed(2)));
})();
export const IL_PAYOUT_CUMULATIVE = (() => {
  let acc = 0;
  return VOLUME_SERIES.map(v => parseFloat((acc += v * 0.0008).toFixed(2)));
})();

export const PROTOCOL_STATS = {
  tvl:          '$205.2M',
  tvlChange:    '+3.4%',
  vol24h:       '$61.2M',
  vol7d:        '$388.4M',
  vol30d:       '$1.42B',
  feesTotal:    '$8.64M',
  ilPayouts:    '$1.28M',
  activePools:  5,
  uniqueLPs:    1_842,
};

// ── Per-pool series ───────────────────────────────────────────────────────────
export type PoolAnalytics = {
  id: string;
  label: string;
  token0Color: string;
  token1Color: string;
  reserve: number[];       // $M
  volume: number[];        // $M
  feeApr: number[];        // %
  vaultHealth: number[];   // ratio (reserve/exposure)
  ilPayouts: number[];     // $K cumulative
};

const ra = seed(11), rb = seed(22), rc = seed(33), rd = seed(44), re = seed(55);
const rf = seed(66), rg = seed(77), rh = seed(88), ri = seed(99), rj = seed(10);

export const POOL_ANALYTICS: PoolAnalytics[] = [
  {
    id: 'weth-usdc',
    label: 'WETH / USDC',
    token0Color: '#627EEA',
    token1Color: '#2775CA',
    reserve:     walk(30, 48,  0.05, 0.002, ra),
    volume:      walk(30, 12,  0.4,  0.001, rb),
    feeApr:      walk(30, 18,  0.08, 0,     rc),
    vaultHealth: walk(30, 2.6, 0.06, 0,     rd),
    ilPayouts:   (() => { let a=0; return walk(30,0.8,0.3,0.02,re).map(v=>parseFloat((a+=v).toFixed(2))); })(),
  },
  {
    id: 'usdc-usdt',
    label: 'USDC / USDT',
    token0Color: '#2775CA',
    token1Color: '#26A17B',
    reserve:     walk(30, 92,  0.02, 0.001, rf),
    volume:      walk(30, 31,  0.25, 0,     rg),
    feeApr:      walk(30, 4.8, 0.04, 0,     rh),
    vaultHealth: walk(30, 8.1, 0.04, 0,     ri),
    ilPayouts:   (() => { let a=0; return walk(30,0.1,0.2,0.01,rj).map(v=>parseFloat((a+=v).toFixed(2))); })(),
  },
  {
    id: 'wbtc-weth',
    label: 'WBTC / WETH',
    token0Color: '#F7931A',
    token1Color: '#627EEA',
    reserve:     walk(30, 24,  0.07, 0.001, seed(14)),
    volume:      walk(30, 5.8, 0.4,  0,     seed(15)),
    feeApr:      walk(30, 11,  0.09, 0,     seed(16)),
    vaultHealth: walk(30, 1.7, 0.08, 0,     seed(17)),
    ilPayouts:   (() => { let a=0; return walk(30,0.4,0.3,0.015,seed(18)).map(v=>parseFloat((a+=v).toFixed(2))); })(),
  },
];

// ── FeeConverter ──────────────────────────────────────────────────────────────
export const FEE_CONVERTER = {
  lastConversion:   '3 hours ago',
  totalConverted:   '$284,120',
  nextEligible:     '42 minutes',
  conversionCount:  1_284,
  avgConversion:    '$221.28',
  weeklyConverted:  '$18,420',
  recentConversions: [
    { time: '3h ago',  amount: '$312.40', pool: 'WETH/USDC' },
    { time: '9h ago',  amount: '$198.80', pool: 'USDC/USDT' },
    { time: '18h ago', amount: '$441.20', pool: 'WBTC/WETH' },
    { time: '1d ago',  amount: '$284.60', pool: 'WETH/USDC' },
    { time: '1d ago',  amount: '$156.30', pool: 'ARB/WETH'  },
  ],
};
