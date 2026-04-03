import { useReadContract } from 'thirdweb/react';
import { getContract } from 'thirdweb';
import { formatUnits } from 'viem';
import { client, arbitrumSepolia } from '../lib/thirdweb';
import { POSITION_MANAGER_ABI } from '../lib/abis/positionManager';
import { ADDRESSES } from '../lib/contracts';

const pmContract = getContract({
  client,
  chain: arbitrumSepolia,
  address: ADDRESSES.positionManager,
  abi: POSITION_MANAGER_ABI,
});

export function useILPosition(pairAddress: string | undefined, account: string | undefined) {
  const { data, isLoading } = useReadContract({
    contract: pmContract,
    method: 'getPosition',
    params: [
      (pairAddress ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      (account    ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
    ],
    queryOptions: { enabled: !!pairAddress && !!account },
  });

  const pos = data as { liquidity: bigint; valueAtDeposit: bigint; timestamp: bigint } | undefined;

  const liquidity      = pos?.liquidity      ?? 0n;
  const valueAtDeposit = pos?.valueAtDeposit ?? 0n;
  const timestamp      = pos?.timestamp      ?? 0n;

  const secondsInPool = timestamp > 0n
    ? BigInt(Math.floor(Date.now() / 1000)) - timestamp
    : 0n;

  return {
    liquidity,
    valueAtDeposit,
    timestamp,
    daysInPool: Math.floor(Number(secondsInPool) / 86400),
    valueAtDepositFormatted: parseFloat(formatUnits(valueAtDeposit, 6)).toFixed(2),
    hasPosition: liquidity > 0n,
    isLoading,
  };
}
