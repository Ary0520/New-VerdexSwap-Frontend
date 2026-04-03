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
