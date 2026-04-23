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
    method: 'getPoolHealth',
    params: [(pairAddress ?? '0x0000000000000000000000000000000000000000') as `0x${string}`],
    queryOptions: { enabled: !!pairAddress, refetchInterval: 15_000 },
  });

  const d = data as readonly [bigint, bigint, bigint, bigint, bigint] | undefined;
  const usdcReserve    = d?.[0] ?? 0n;
  const stakerDeposits = d?.[1] ?? 0n;
  const utilization    = d?.[3] ?? 0n;
  const totalExposure  = d?.[4] ?? 0n;

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
    method: 'stakerPositions',
    params: [
      (pairAddress ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      (account    ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
    ],
    queryOptions: { enabled: !!pairAddress && !!account },
  });

  const d = data as readonly [bigint, bigint, bigint, bigint] | undefined;
  const amount             = d?.[0] ?? 0n;
  const shares             = d?.[1] ?? 0n;
  const unstakeRequestTime = d?.[3] ?? 0n;

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
    method: 'pendingFees',
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

// ── Protocol-wide vault stats (sum across all pairs) ─────────────────────────
// Reads getPoolHealth for every known pair and aggregates.
// Vault TVL = sum of stakerDeposits across all pairs (on-chain, real).
// APY, policiesActive, lastConversion come from subgraph once synced.
import { PAIRS, type PairKey } from '../lib/contracts';

function usePairHealth(pairKey: PairKey) {
  const pair = PAIRS[pairKey];
  const { data } = useReadContract({
    contract: vaultContract,
    method: 'getPoolHealth',
    params: [pair.address],
    queryOptions: { refetchInterval: 30_000 },
  });
  const d = data as readonly [bigint, bigint, bigint, bigint, bigint] | undefined;
  return {
    usdcReserve:    d?.[0] ?? 0n,
    stakerDeposits: d?.[1] ?? 0n,
    feeDeposits:    d?.[2] ?? 0n,
    totalExposure:  d?.[4] ?? 0n,
  };
}

export function useProtocolVaultStats() {
  const wethUsdc  = usePairHealth('WETH/USDC');
  const wbtcUsdc  = usePairHealth('WBTC/USDC');
  const arbUsdc   = usePairHealth('ARB/USDC');
  const daiUsdc   = usePairHealth('DAI/USDC');
  const wethDai   = usePairHealth('WETH/DAI');

  const totalStakerDeposits =
    wethUsdc.stakerDeposits + wbtcUsdc.stakerDeposits +
    arbUsdc.stakerDeposits  + daiUsdc.stakerDeposits  + wethDai.stakerDeposits;

  const totalUsdcReserve =
    wethUsdc.usdcReserve + wbtcUsdc.usdcReserve +
    arbUsdc.usdcReserve  + daiUsdc.usdcReserve  + wethDai.usdcReserve;

  const totalFeeDeposits =
    wethUsdc.feeDeposits + wbtcUsdc.feeDeposits +
    arbUsdc.feeDeposits  + daiUsdc.feeDeposits  + wethDai.feeDeposits;

  // TVL = staker deposits + fee deposits (all USDC, 6 decimals)
  const tvlRaw = totalStakerDeposits + totalFeeDeposits;
  const tvlUsd = parseFloat(formatUnits(tvlRaw, 6));

  function fmtUsd(n: number): string {
    if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
    if (n >= 1_000)     return '$' + (n / 1_000).toFixed(1) + 'K';
    return '$' + n.toFixed(2);
  }

  return {
    tvlRaw,
    tvlFormatted: fmtUsd(tvlUsd),
    totalStakerDeposits,
    totalUsdcReserve,
    totalFeeDeposits,
  };
}

// ── Vault global config (cooldown, circuit breaker, fee share, etc.) ──────────
export function useVaultConfig() {
  const { data, isLoading } = useReadContract({
    contract: vaultContract,
    method: 'config',
    params: [],
    queryOptions: { refetchInterval: 60_000 },
  });

  const d = data as readonly [bigint, bigint, bigint, bigint, bigint, bigint] | undefined;
  // config() returns: maxPayoutBps, poolCapBps, circuitBreakerBps, pauseThresholdBps, stakerFeeShareBps, unstakeCooldown
  const maxPayoutBps       = d?.[0] ?? 0n;
  const poolCapBps         = d?.[1] ?? 0n;
  const circuitBreakerBps  = d?.[2] ?? 0n;
  const pauseThresholdBps  = d?.[3] ?? 0n;
  const stakerFeeShareBps  = d?.[4] ?? 0n;
  const unstakeCooldown    = d?.[5] ?? 0n; // seconds

  return {
    maxPayoutBps,
    poolCapBps,
    circuitBreakerBps,
    pauseThresholdBps,
    stakerFeeShareBps,
    unstakeCooldown,
    // human-readable
    maxPayoutPct:      Number(maxPayoutBps) / 100,
    circuitBreakerPct: Number(circuitBreakerBps) / 100,
    stakerFeeSharePct: Number(stakerFeeShareBps) / 100,
    unstakeCooldownSecs: Number(unstakeCooldown),
    isLoading,
  };
}

// ── Global pause state ────────────────────────────────────────────────────────
export function useVaultGlobalPause() {
  const { data, isLoading } = useReadContract({
    contract: vaultContract,
    method: 'globalPause',
    params: [],
    queryOptions: { refetchInterval: 15_000 },
  });
  return {
    isPaused: (data as boolean | undefined) ?? false,
    isLoading,
  };
}

// ── Per-pool cumulative stats (totalPaidOut, totalFeesIn) ─────────────────────
export function usePoolStats(pairAddress: string | undefined) {
  const { data, isLoading } = useReadContract({
    contract: vaultContract,
    method: 'pools',
    params: [(pairAddress ?? '0x0000000000000000000000000000000000000000') as `0x${string}`],
    queryOptions: { enabled: !!pairAddress, refetchInterval: 30_000 },
  });

  // pools() returns: usdcReserve, stakerDeposits, feeDeposits, totalPaidOut, totalFeesIn, totalExposureUSDC
  const d = data as readonly [bigint, bigint, bigint, bigint, bigint, bigint] | undefined;
  const totalPaidOut = d?.[3] ?? 0n;
  const totalFeesIn  = d?.[4] ?? 0n;

  return {
    totalPaidOut,
    totalFeesIn,
    totalPaidOutFmt: parseFloat(formatUnits(totalPaidOut, 6)).toLocaleString('en-US', { maximumFractionDigits: 2 }),
    totalFeesInFmt:  parseFloat(formatUnits(totalFeesIn,  6)).toLocaleString('en-US', { maximumFractionDigits: 2 }),
    isLoading,
  };
}

// ── Total shares for a pool (used to compute share price) ─────────────────────
export function useTotalShares(pairAddress: string | undefined) {
  const { data } = useReadContract({
    contract: vaultContract,
    method: 'totalShares',
    params: [(pairAddress ?? '0x0000000000000000000000000000000000000000') as `0x${string}`],
    queryOptions: { enabled: !!pairAddress, refetchInterval: 15_000 },
  });
  return (data as bigint | undefined) ?? 0n;
}

// ── Cooldown countdown helper ─────────────────────────────────────────────────
// Returns seconds remaining until unstake is unlocked, or 0 if already unlocked.
export function useCooldownRemaining(
  unstakeRequestTime: bigint,
  unstakeCooldownSecs: number,
): { secsRemaining: number; label: string; unlocked: boolean } {
  const nowSecs = Math.floor(Date.now() / 1000);
  const requestedAt = Number(unstakeRequestTime);

  if (requestedAt === 0) return { secsRemaining: 0, label: '', unlocked: false };

  const unlockAt = requestedAt + unstakeCooldownSecs;
  const remaining = Math.max(0, unlockAt - nowSecs);

  let label = '';
  if (remaining > 0) {
    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;
    if (h > 0)      label = `${h}h ${m}m remaining`;
    else if (m > 0) label = `${m}m ${s}s remaining`;
    else            label = `${s}s remaining`;
  } else {
    label = 'Unlocked — ready to unstake';
  }

  return { secsRemaining: remaining, label, unlocked: remaining === 0 };
}
