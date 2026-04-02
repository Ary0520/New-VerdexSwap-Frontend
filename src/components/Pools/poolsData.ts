export type PoolTier = 'Stable' | 'Blue Chip' | 'Volatile';

export type Pool = {
  id: string;
  token0: { symbol: string; icon: string; color: string };
  token1: { symbol: string; icon: string; color: string };
  tier: PoolTier;
  tvl: string;
  tvlRaw: number;
  volume24h: string;
  fees7d: string;
  apr: string;
  aprRaw: number;
  ilCoverage: string;
  reserve0: string;
  reserve1: string;
  vaultReserve: string;
  vaultUtilization: number;
  // user position (simulated as connected)
  userLpTokens: string;
  userValue: string;
  userEntryValue: string;
  userDaysInPool: number;
  userIlCoverage: number;
};

export const POOLS: Pool[] = [
  {
    id: 'eth-usdc',
    token0: { symbol: 'ETH', icon: '/swap-icons/eth-icon-56586a.png', color: '#627EEA' },
    token1: { symbol: 'USDC', icon: '/swap-icons/usdc-icon-56586a.png', color: '#2775CA' },
    tier: 'Volatile',
    tvl: '$48.2M',
    tvlRaw: 48200000,
    volume24h: '$12.4M',
    fees7d: '$86.4K',
    apr: '18.4%',
    aprRaw: 18.4,
    ilCoverage: '100%',
    reserve0: '12,840 ETH',
    reserve1: '30,041,200 USDC',
    vaultReserve: '$2,140,000',
    vaultUtilization: 34,
    userLpTokens: '142.88',
    userValue: '$4,820',
    userEntryValue: '$4,620',
    userDaysInPool: 92,
    userIlCoverage: 50,
  },
  {
    id: 'usdc-usdt',
    token0: { symbol: 'USDC', icon: '/swap-icons/usdc-icon-56586a.png', color: '#2775CA' },
    token1: { symbol: 'USDT', icon: '', color: '#26A17B' },
    tier: 'Stable',
    tvl: '$92.1M',
    tvlRaw: 92100000,
    volume24h: '$31.7M',
    fees7d: '$44.2K',
    apr: '4.8%',
    aprRaw: 4.8,
    ilCoverage: '100%',
    reserve0: '46,050,000 USDC',
    reserve1: '46,050,000 USDT',
    vaultReserve: '$920,000',
    vaultUtilization: 12,
    userLpTokens: '0',
    userValue: '$0',
    userEntryValue: '$0',
    userDaysInPool: 0,
    userIlCoverage: 0,
  },
  {
    id: 'wbtc-eth',
    token0: { symbol: 'WBTC', icon: '', color: '#F7931A' },
    token1: { symbol: 'ETH', icon: '/swap-icons/eth-icon-56586a.png', color: '#627EEA' },
    tier: 'Blue Chip',
    tvl: '$24.6M',
    tvlRaw: 24600000,
    volume24h: '$5.8M',
    fees7d: '$40.6K',
    apr: '11.2%',
    aprRaw: 11.2,
    ilCoverage: '85%',
    reserve0: '184.2 WBTC',
    reserve1: '4,820 ETH',
    vaultReserve: '$740,000',
    vaultUtilization: 58,
    userLpTokens: '0',
    userValue: '$0',
    userEntryValue: '$0',
    userDaysInPool: 0,
    userIlCoverage: 0,
  },
  {
    id: 'arb-eth',
    token0: { symbol: 'ARB', icon: '', color: '#12AAFF' },
    token1: { symbol: 'ETH', icon: '/swap-icons/eth-icon-56586a.png', color: '#627EEA' },
    tier: 'Volatile',
    tvl: '$8.9M',
    tvlRaw: 8900000,
    volume24h: '$2.1M',
    fees7d: '$14.7K',
    apr: '22.6%',
    aprRaw: 22.6,
    ilCoverage: '25%',
    reserve0: '4,820,000 ARB',
    reserve1: '1,840 ETH',
    vaultReserve: '$180,000',
    vaultUtilization: 81,
    userLpTokens: '0',
    userValue: '$0',
    userEntryValue: '$0',
    userDaysInPool: 0,
    userIlCoverage: 0,
  },
  {
    id: 'usdc-dai',
    token0: { symbol: 'USDC', icon: '/swap-icons/usdc-icon-56586a.png', color: '#2775CA' },
    token1: { symbol: 'DAI', icon: '', color: '#F5AC37' },
    tier: 'Stable',
    tvl: '$31.4M',
    tvlRaw: 31400000,
    volume24h: '$9.2M',
    fees7d: '$12.9K',
    apr: '3.1%',
    aprRaw: 3.1,
    ilCoverage: '100%',
    reserve0: '15,700,000 USDC',
    reserve1: '15,700,000 DAI',
    vaultReserve: '$314,000',
    vaultUtilization: 8,
    userLpTokens: '0',
    userValue: '$0',
    userEntryValue: '$0',
    userDaysInPool: 0,
    userIlCoverage: 0,
  },
];
