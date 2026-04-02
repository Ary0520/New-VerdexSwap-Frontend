export type Token = {
  symbol: string;
  name: string;
  icon: string;   // path or ''
  color: string;  // fallback bg color
};

export const TOKEN_LIST: Token[] = [
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    icon: '/swap-icons/eth-icon-56586a.png',
    color: '#627EEA',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '/swap-icons/usdc-icon-56586a.png',
    color: '#2775CA',
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    icon: '',
    color: '#F7931A',
  },
  {
    symbol: 'ARB',
    name: 'Arbitrum',
    icon: '',
    color: '#12AAFF',
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    icon: '',
    color: '#F5AC37',
  },
];

export const getToken = (symbol: string): Token =>
  TOKEN_LIST.find((t) => t.symbol === symbol) ?? TOKEN_LIST[0];
