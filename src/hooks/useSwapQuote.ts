import { useReadContract } from 'thirdweb/react';
import { getContract } from 'thirdweb';
import { parseUnits, formatUnits } from 'viem';
import { client, arbitrumSepolia } from '../lib/thirdweb';
import { ROUTER_ABI } from '../lib/abis/router';
import { ADDRESSES, TOKENS, type TokenSymbol } from '../lib/contracts';

const routerContract = getContract({
  client,
  chain: arbitrumSepolia,
  address: ADDRESSES.router,
  abi: ROUTER_ABI,
});

export function useSwapQuote(
  fromSymbol: TokenSymbol,
  toSymbol: TokenSymbol,
  amountIn: string,
) {
  const fromToken = TOKENS[fromSymbol];
  const toToken   = TOKENS[toSymbol];

  let parsedAmount = 0n;
  try {
    if (amountIn && parseFloat(amountIn) > 0) {
      parsedAmount = parseUnits(amountIn, fromToken.decimals);
    }
  } catch {
    parsedAmount = 0n;
  }

  const { data, isLoading, isError } = useReadContract({
    contract: routerContract,
    method: 'function getAmountsOut(uint256 amountIn, address[] path) view returns (uint256[] amounts)',
    params: [parsedAmount, [fromToken.address, toToken.address]],
    queryOptions: {
      enabled: parsedAmount > 0n,
      refetchInterval: 10_000,
    },
  });

  const amountOut = (data as bigint[] | undefined)?.[1] ?? 0n;
  const formatted = amountOut > 0n
    ? parseFloat(formatUnits(amountOut, toToken.decimals)).toFixed(
        toToken.decimals === 6 ? 2 : 6,
      )
    : '';

  return { amountOut, formatted, isLoading, isError };
}
