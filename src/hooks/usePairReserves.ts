import { useReadContract } from 'thirdweb/react';
import { getContract } from 'thirdweb';
import { client, arbitrumSepolia } from '../lib/thirdweb';
import { PAIR_ABI } from '../lib/abis/pair';
import { formatUnits } from 'viem';

const ZERO = '0x0000000000000000000000000000000000000000' as `0x${string}`;

function getPairContract(address: string) {
  return getContract({ client, chain: arbitrumSepolia, address: address as `0x${string}`, abi: PAIR_ABI });
}

export function usePairReserves(pairAddress: string | undefined) {
  const contract = getPairContract(pairAddress ?? ZERO);

  const { data, isLoading } = useReadContract({
    contract,
    method: 'getReserves',
    params: [],
    queryOptions: { enabled: !!pairAddress, refetchInterval: 15_000 },
  });

  const d = data as readonly [bigint, bigint, number] | undefined;
  return {
    reserve0:  d?.[0] ?? 0n,
    reserve1:  d?.[1] ?? 0n,
    timestamp: d?.[2] ?? 0,
    isLoading,
  };
}

export function useLpBalance(pairAddress: string | undefined, account: string | undefined) {
  const contract = getPairContract(pairAddress ?? ZERO);

  const { data, isLoading } = useReadContract({
    contract,
    method: 'balanceOf',
    params: [(account ?? ZERO) as `0x${string}`],
    queryOptions: { enabled: !!pairAddress && !!account },
  });

  const raw = (data as bigint | undefined) ?? 0n;
  return {
    raw,
    formatted: parseFloat(formatUnits(raw, 18)).toFixed(6),
    isLoading,
  };
}
