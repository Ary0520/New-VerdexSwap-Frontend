import { useReadContract } from 'thirdweb/react';
import { getContract } from 'thirdweb';
import { formatUnits } from 'viem';
import { client, arbitrumSepolia } from '../lib/thirdweb';
import { VAULT_ABI } from '../lib/abis/vault';
import { ADDRESSES } from '../lib/contracts';

const vaultContract = getContract({
  client,
  chain: arbitrumSepolia,
  address: ADDRESSES.vault,
  abi: VAULT_ABI,
});

export function useVaultHealth(pairAddress: string | undefined) {
  const { data, isLoading } = useReadContract({
    contract: vaultContract,
    method: 'function getPoolHealth(address pair) view returns (uint256 usdcReserve, uint256 stakerDeposits, uint256 feeDeposits, uint256 utilization, uint256 totalExposure)',
    params: [(pairAddress ?? '0x0000000000000000000000000000000000000000') as `0x${string}`],
    queryOptions: { enabled: !!pairAddress, refetchInterval: 15_000 },
  });

  const usdcReserve    = (data as bigint[] | undefined)?.[0] ?? 0n;
  const stakerDeposits = (data as bigint[] | undefined)?.[1] ?? 0n;
  const utilization    = (data as bigint[] | undefined)?.[3] ?? 0n;
  const totalExposure  = (data as bigint[] | undefined)?.[4] ?? 0n;

  return {
    usdcReserve,
    stakerDeposits,
    utilization: Number(utilization) / 100, // bps → %
    totalExposure,
    usdcReserveFormatted:    parseFloat(formatUnits(usdcReserve, 6)).toFixed(2),
    stakerDepositsFormatted: parseFloat(formatUnits(stakerDeposits, 6)).toFixed(2),
    isLoading,
  };
}

export function useStakerPosition(pairAddress: string | undefined, account: string | undefined) {
  const { data, isLoading } = useReadContract({
    contract: vaultContract,
    method: 'function stakerPositions(address, address) view returns (uint256 amount, uint256 shares, uint256 rewardDebt, uint256 unstakeRequestTime)',
    params: [
      (pairAddress ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      (account    ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
    ],
    queryOptions: { enabled: !!pairAddress && !!account },
  });

  const amount             = (data as bigint[] | undefined)?.[0] ?? 0n;
  const shares             = (data as bigint[] | undefined)?.[1] ?? 0n;
  const unstakeRequestTime = (data as bigint[] | undefined)?.[3] ?? 0n;

  return {
    amount,
    shares,
    unstakeRequestTime,
    amountFormatted: parseFloat(formatUnits(amount, 6)).toFixed(2),
    isLoading,
  };
}

export function usePendingFees(pairAddress: string | undefined, account: string | undefined) {
  const { data, isLoading } = useReadContract({
    contract: vaultContract,
    method: 'function pendingFees(address pair, address staker) view returns (uint256)',
    params: [
      (pairAddress ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      (account    ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
    ],
    queryOptions: { enabled: !!pairAddress && !!account, refetchInterval: 15_000 },
  });

  const raw = (data as bigint | undefined) ?? 0n;
  return {
    raw,
    formatted: parseFloat(formatUnits(raw, 6)).toFixed(4),
    isLoading,
  };
}
