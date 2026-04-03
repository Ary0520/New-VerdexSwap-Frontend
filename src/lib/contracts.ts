import { type Address } from 'viem';

// ── Network ───────────────────────────────────────────────────────────────────
export const CHAIN_ID = 421614; // Arbitrum Sepolia

// ── Core contracts ────────────────────────────────────────────────────────────
export const ADDRESSES = {
  factory:         '0x23942d68C74f80cE259a4dA31a59856fFde5425e' as Address,
  router:          '0x8f19EF21EDe7d881003FCa1e50285A113915Cb5f' as Address,
  vault:           '0x3e0A64d381fBc6cAc7683bBf6F1480742B6fF265' as Address,
  positionManager: '0xCAa5239e6266F4aEc2A78E10429Ab48B0E77F72B' as Address,
  oracle:          '0xA18F7Bd8be9611fD8499C15e0BC6aa9C4c0eF268' as Address,
  feeConverter:    '0x61a99BbEff17485e4DbE92b86a213F32fabE5aeE' as Address,
  treasury:        '0x97BF134cDf8A620aa0F10E140b89a2aDAAC2bBbF' as Address,
} as const;

// ── Tokens ────────────────────────────────────────────────────────────────────
export const TOKENS = {
  USDC: { address: '0x98697D7bc9ea50CE6682ed52CBC95806E7fDee0f' as Address, decimals: 6,  symbol: 'USDC', name: 'USD Coin'          },
  WETH: { address: '0x11dA2D696ddA3E569608F7E802F7CfD5BBe89d4b' as Address, decimals: 18, symbol: 'WETH', name: 'Wrapped Ether'     },
  WBTC: { address: '0xFeD51c995304775D37C54a7197a9197150147E3b' as Address, decimals: 8,  symbol: 'WBTC', name: 'Wrapped Bitcoin'   },
  ARB:  { address: '0xC4999f55d2887d003d17Dc42625354fA364c29D1' as Address, decimals: 18, symbol: 'ARB',  name: 'Arbitrum'          },
  DAI:  { address: '0x9e3b254cAdC9eaeFa80fD85F26Eb7BbBE1F59560' as Address, decimals: 18, symbol: 'DAI',  name: 'Dai Stablecoin'   },
} as const;

export type TokenSymbol = keyof typeof TOKENS;

// ── Pairs ─────────────────────────────────────────────────────────────────────
export const PAIRS = {
  'WETH/USDC': { address: '0x817caF2f184D7FAf6F68963dBB02810633966546' as Address, token0: 'WETH', token1: 'USDC' },
  'WBTC/USDC': { address: '0xFAD8e1b15B224aCD16295B3F909F5Cc0eD39E2D0' as Address, token0: 'WBTC', token1: 'USDC' },
  'ARB/USDC':  { address: '0xed31F9e699f23420B3426f1e42bA9eaD4E7CDE57' as Address, token0: 'ARB',  token1: 'USDC' },
  'DAI/USDC':  { address: '0x72576851A0a7955b3361Fe1e59EaaF0EeE931216' as Address, token0: 'DAI',  token1: 'USDC' },
  'WETH/DAI':  { address: '0x94c6014175b464Ab11D1Ad64a3F13C01130A6811' as Address, token0: 'WETH', token1: 'DAI'  },
} as const;

export type PairKey = keyof typeof PAIRS;

// ── Helpers ───────────────────────────────────────────────────────────────────
/** Get pair address for two token symbols (order-independent) */
export function getPairAddress(a: TokenSymbol, b: TokenSymbol): Address | undefined {
  const key = Object.keys(PAIRS).find((k) => {
    const p = PAIRS[k as PairKey];
    return (p.token0 === a && p.token1 === b) || (p.token0 === b && p.token1 === a);
  });
  return key ? PAIRS[key as PairKey].address : undefined;
}

/** Get token by address */
export function getTokenByAddress(addr: Address) {
  return Object.values(TOKENS).find(
    (t) => t.address.toLowerCase() === addr.toLowerCase(),
  );
}
