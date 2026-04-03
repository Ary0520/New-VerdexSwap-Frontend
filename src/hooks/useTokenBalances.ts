import { useReadContract } from 'thirdweb/react';
import { getContract } from 'thirdweb';
import { balanceOf } from 'thirdweb/extensions/erc20';
import { client, arbitrumSepolia } from '../lib/thirdweb';
import { TOKENS, type TokenSymbol } from '../lib/contracts';
import { formatUnits } from 'viem';

type BalanceResult = { raw: bigint; formatted: string; decimals: number };
type BalanceMap = Record<TokenSymbol, BalanceResult>;

/** Returns balances for all 5 tokens for the connected account */
export function useTokenBalance(symbol: TokenSymbol, account: string | undefined) {
  const token = TOKENS[symbol];

  const contract = getContract({
    client,
    chain: arbitrumSepolia,
    address: token.address,
  });

  const { data, isLoading } = useReadContract(balanceOf, {
    contract,
    address: (account ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
    queryOptions: { enabled: !!account },
  });

  const raw = data ?? 0n;
  return {
    raw,
    formatted: parseFloat(formatUnits(raw, token.decimals)).toFixed(
      token.decimals === 6 ? 2 : 4,
    ),
    decimals: token.decimals,
    isLoading,
  };
}

export type { BalanceMap, BalanceResult };
