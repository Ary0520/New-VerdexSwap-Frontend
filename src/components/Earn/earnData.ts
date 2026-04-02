export type Vault = {
  id: string;
  label: string;
  token0Symbol: string;
  token0Color: string;
  token1Symbol: string;
  token1Color: string;
  totalStaked: string;
  vaultReserve: string;
  utilization: number;
  utilizationLabel: string;
  utilizationTier: 'BLUE CHIP' | 'STABLE' | 'VOLATILE';
  outstandingExposure: string;
  maxDrawdown: string;
  reserveRatio: string;
  // user position
  stakedUsdc: string;
  vaultShares: string;
  entryPrice: string;
  pendingFees: string;
};

export const VAULTS: Vault[] = [
  {
    id: 'weth-usdc',
    label: 'WETH / USDC Vault',
    token0Symbol: 'W',
    token0Color: '#627EEA',
    token1Symbol: 'S',
    token1Color: '#2775CA',
    totalStaked: '$12.4M',
    vaultReserve: '$4.8M',
    utilization: 68.4,
    utilizationLabel: 'Payouts / Received',
    utilizationTier: 'BLUE CHIP',
    outstandingExposure: '$2.1M',
    maxDrawdown: '14.5%',
    reserveRatio: '1:2.58',
    stakedUsdc: '12,450.00',
    vaultShares: '11,822.41 vLP',
    entryPrice: '$1.0000',
    pendingFees: '142.84 USDC',
  },
  {
    id: 'wbtc-weth',
    label: 'WBTC / WETH Vault',
    token0Symbol: 'B',
    token0Color: '#F7931A',
    token1Symbol: 'W',
    token1Color: '#627EEA',
    totalStaked: '$8.2M',
    vaultReserve: '$2.1M',
    utilization: 42.1,
    utilizationLabel: 'Payouts / Received',
    utilizationTier: 'STABLE',
    outstandingExposure: '$840K',
    maxDrawdown: '9.2%',
    reserveRatio: '1:3.90',
    stakedUsdc: '0.00',
    vaultShares: '0.00 vLP',
    entryPrice: '—',
    pendingFees: '0.00 USDC',
  },
  {
    id: 'arb-weth',
    label: 'ARB / WETH Vault',
    token0Symbol: 'A',
    token0Color: '#12AAFF',
    token1Symbol: 'W',
    token1Color: '#627EEA',
    totalStaked: '$3.1M',
    vaultReserve: '$620K',
    utilization: 81.3,
    utilizationLabel: 'Payouts / Received',
    utilizationTier: 'VOLATILE',
    outstandingExposure: '$504K',
    maxDrawdown: '22.1%',
    reserveRatio: '1:1.23',
    stakedUsdc: '0.00',
    vaultShares: '0.00 vLP',
    entryPrice: '—',
    pendingFees: '0.00 USDC',
  },
];

export const PROTOCOL_STATS = [
  { label: 'Vault TVL', value: '$23,700,000' },
  { label: 'Avg. APY', value: '58.30%' },
  { label: 'Policies Active', value: '3,045' },
  { label: 'Last Rebalance', value: '4 hrs ago' },
];

export type ConverterToken = {
  symbol: string;
  icon: string;
  color: string;
  accumulated: string;
  estUsdcOut: string;
  yourBonus: string;
  cooldownMinutes: number; // 0 = ready
  balanceTooLow: boolean;
  twapStale: boolean;
};

export const CONVERTER_TOKENS: Record<string, ConverterToken[]> = {
  'weth-usdc': [
    { symbol: 'WETH', icon: '/swap-icons/eth-icon-56586a.png', color: '#627EEA', accumulated: '0.42 WETH', estUsdcOut: '~$840', yourBonus: '~$0.84', cooldownMinutes: 0,  balanceTooLow: false, twapStale: false },
    { symbol: 'ARB',  icon: '',                                 color: '#12AAFF', accumulated: '124 ARB',   estUsdcOut: '~$124', yourBonus: '~$0.12', cooldownMinutes: 47, balanceTooLow: false, twapStale: false },
  ],
  'wbtc-weth': [
    { symbol: 'WBTC', icon: '', color: '#F7931A', accumulated: '0.002 WBTC', estUsdcOut: '~$132', yourBonus: '~$0.13', cooldownMinutes: 0,   balanceTooLow: false, twapStale: false },
    { symbol: 'WETH', icon: '/swap-icons/eth-icon-56586a.png', color: '#627EEA', accumulated: '0.004 WETH', estUsdcOut: '~$9',   yourBonus: '~$0.01', cooldownMinutes: 0,   balanceTooLow: true,  twapStale: false },
  ],
  'arb-weth': [
    { symbol: 'ARB',  icon: '', color: '#12AAFF', accumulated: '18 ARB',    estUsdcOut: '~$18',  yourBonus: '~$0.02', cooldownMinutes: 0,   balanceTooLow: false, twapStale: true  },
    { symbol: 'WETH', icon: '/swap-icons/eth-icon-56586a.png', color: '#627EEA', accumulated: '0.001 WETH', estUsdcOut: '~$2',   yourBonus: '~$0.00', cooldownMinutes: 0,   balanceTooLow: true,  twapStale: false },
  ],
};
