export type LpPosition = {
  id: string;
  pool: string;
  token0: { symbol: string; icon: string; color: string };
  token1: { symbol: string; icon: string; color: string };
  tier: string;
  entryValue: string;
  currentValue: string;
  ilDollar: string;
  ilPercent: string;
  ilNegative: boolean;
  daysInPool: number;
  coveragePercent: number;
  coverageMax: number;
  estPayout: string;
  entryTimestamp: string;
  entryTwap: string;
  currentTwap: string;
};

export type StakingPosition = {
  id: string;
  vault: string;
  token0Color: string;
  token1Color: string;
  token0Symbol: string;
  token1Symbol: string;
  stakedUsdc: string;
  currentValue: string;
  earnedFees: string;
  apr: string;
  unstakeStatus: 'Active' | 'Requested' | 'Unlocked';
};

export type TxType = 'Swap' | 'Liquidity' | 'Staking' | 'IL Payout';

export type Transaction = {
  id: string;
  date: string;
  type: TxType;
  tokens: string;
  amount: string;
  ilPayout: string;
  txHash: string;
};

export const LP_POSITIONS: LpPosition[] = [
  {
    id: 'eth-usdc',
    pool: 'WETH / USDC',
    token0: { symbol: 'WETH', icon: '/swap-icons/eth-icon-56586a.png', color: '#627EEA' },
    token1: { symbol: 'USDC', icon: '/swap-icons/usdc-icon-56586a.png', color: '#2775CA' },
    tier: 'Volatile',
    entryValue: '$4,820.00',
    currentValue: '$5,104.40',
    ilDollar: '-$38.20',
    ilPercent: '-0.79%',
    ilNegative: true,
    daysInPool: 92,
    coveragePercent: 50,
    coverageMax: 100,
    estPayout: '$19.10',
    entryTimestamp: '2024-12-28 · 14:32 UTC',
    entryTwap: '$2,318.40',
    currentTwap: '$2,340.50',
  },
  {
    id: 'usdc-dai',
    pool: 'USDC / DAI',
    token0: { symbol: 'USDC', icon: '/swap-icons/usdc-icon-56586a.png', color: '#2775CA' },
    token1: { symbol: 'DAI', icon: '', color: '#F5AC37' },
    tier: 'Stable',
    entryValue: '$2,000.00',
    currentValue: '$2,014.80',
    ilDollar: '-$2.10',
    ilPercent: '-0.10%',
    ilNegative: true,
    daysInPool: 34,
    coveragePercent: 25,
    coverageMax: 100,
    estPayout: '$0.53',
    entryTimestamp: '2025-02-14 · 09:11 UTC',
    entryTwap: '$1.0002',
    currentTwap: '$1.0001',
  },
];

export const STAKING_POSITIONS: StakingPosition[] = [
  {
    id: 'weth-usdc-vault',
    vault: 'WETH / USDC Vault',
    token0Color: '#627EEA',
    token1Color: '#2775CA',
    token0Symbol: 'W',
    token1Symbol: 'S',
    stakedUsdc: '$12,450.00',
    currentValue: '$12,842.30',
    earnedFees: '$142.84',
    apr: '58.3%',
    unstakeStatus: 'Active',
  },
];

export const TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2025-03-28 · 11:04', type: 'Swap',      tokens: 'WETH → USDC',  amount: '$2,340.50', ilPayout: '—',      txHash: '0x4f2a...c81e' },
  { id: 't2', date: '2025-03-22 · 08:17', type: 'IL Payout', tokens: 'WETH / USDC',  amount: '$19.10',    ilPayout: '$19.10', txHash: '0x9b1d...f44a' },
  { id: 't3', date: '2025-03-15 · 16:55', type: 'Liquidity', tokens: 'WETH / USDC',  amount: '$4,820.00', ilPayout: '—',      txHash: '0x3c8e...2d90' },
  { id: 't4', date: '2025-02-28 · 12:30', type: 'Staking',   tokens: 'USDC → Vault', amount: '$12,450.00',ilPayout: '—',      txHash: '0x7a3f...b12c' },
  { id: 't5', date: '2025-02-14 · 09:11', type: 'Liquidity', tokens: 'USDC / DAI',   amount: '$2,000.00', ilPayout: '—',      txHash: '0x1e9c...8f3b' },
  { id: 't6', date: '2025-01-30 · 20:44', type: 'Swap',      tokens: 'ARB → WETH',   amount: '$840.00',   ilPayout: '—',      txHash: '0x6d2b...a77f' },
];

export const SUMMARY = {
  totalLpValue:     '$7,119.20',
  totalIlExposure:  '$40.30',
  totalIlPayouts:   '$19.10',
  stakingRewards:   '$142.84',
};
