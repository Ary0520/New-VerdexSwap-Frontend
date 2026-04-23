import { useReadContract } from 'thirdweb/react';
import { getContract } from 'thirdweb';
import { client, arbitrumSepolia } from '../lib/thirdweb';
import { ORACLE_ABI } from '../lib/abis/oracle';
import { ADDRESSES, TOKENS, type TokenSymbol } from '../lib/contracts';

const oracleContract = getContract({
  client,
  chain: arbitrumSepolia,
  address: ADDRESSES.oracle,
  abi: ORACLE_ABI,
});

export function useTwapPrice(pairAddress: string | undefined, tokenASymbol: TokenSymbol) {
  const tokenA = TOKENS[tokenASymbol];

  const { data, isLoading, isError } = useReadContract({
    contract: oracleContract,
    method: 'function getTWAPForTokens(address pair, address tokenA) view returns (uint256)',
    params: [
      (pairAddress ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      tokenA.address,
    ],
    queryOptions: { enabled: !!pairAddress, refetchInterval: 30_000 },
  });

  const raw   = (data as bigint | undefined) ?? 0n;
  const Q112  = 2n ** 112n;
  const price = raw > 0n ? Number(raw) / Number(Q112) : 0;

  return {
    raw,
    price,
    formatted: price > 0 ? price.toFixed(2) : '—',
    isLoading,
    isStale: isError,
  };
}

// ── Current LP position value in USD using TWAP ───────────────────────────────
// Given a user's share of pool reserves and the TWAP price of token0 in terms
// of token1 (which is USDC for most pairs), compute current USD value.
// token0Amount: user's token0 balance (already formatted, e.g. 0.5 WETH)
// token1Amount: user's token1 balance (already formatted, e.g. 1200 USDC)
// For USDC-quoted pairs: currentValueUSD = token0Amount * twapPrice + token1Amount
// For WETH/DAI: DAI ≈ $1, same formula applies
export function useCurrentPositionValueUSD(
  pairAddress: string | undefined,
  token0Symbol: TokenSymbol,
  token0Amount: number,   // already in human units
  token1Amount: number,   // already in human units (USDC or DAI ≈ $1)
  token1IsStable: boolean, // true if token1 is USDC or DAI
) {
  // Get TWAP price of token0 expressed in token1 units
  const { price: twapPrice, isLoading, isStale } = useTwapPrice(pairAddress, token0Symbol);

  let currentValueUSD = 0;
  if (token1IsStable && twapPrice > 0) {
    // token0 value in USD + token1 value in USD (token1 ≈ $1)
    currentValueUSD = token0Amount * twapPrice + token1Amount;
  } else if (token1IsStable) {
    // TWAP not available yet, fall back to token1 only (underestimates)
    currentValueUSD = token1Amount * 2; // rough 50/50 pool approximation
  }

  return {
    currentValueUSD,
    currentValueFormatted: currentValueUSD > 0 ? currentValueUSD.toFixed(2) : '—',
    isLoading,
    isStale,
  };
}
