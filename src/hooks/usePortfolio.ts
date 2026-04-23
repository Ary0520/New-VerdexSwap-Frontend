import { useActiveAccount, useReadContract } from 'thirdweb/react';
import { getContract } from 'thirdweb';
import { formatUnits } from 'viem';
import { client, arbitrumSepolia } from '../lib/thirdweb';
import { PAIR_ABI } from '../lib/abis/pair';
import { VAULT_ABI } from '../lib/abis/vault';
import { POSITION_MANAGER_ABI } from '../lib/abis/positionManager';
import { ORACLE_ABI } from '../lib/abis/oracle';
import { FACTORY_ABI } from '../lib/abis/factory';
import { ADDRESSES, PAIRS, TOKENS, type PairKey, type TokenSymbol } from '../lib/contracts';

const vaultContract   = getContract({ client, chain: arbitrumSepolia, address: ADDRESSES.vault,           abi: VAULT_ABI });
const pmContract      = getContract({ client, chain: arbitrumSepolia, address: ADDRESSES.positionManager, abi: POSITION_MANAGER_ABI });
const oracleContract  = getContract({ client, chain: arbitrumSepolia, address: ADDRESSES.oracle,          abi: ORACLE_ABI });
const factoryContract = getContract({ client, chain: arbitrumSepolia, address: ADDRESSES.factory,         abi: FACTORY_ABI });

const ZERO = '0x0000000000000000000000000000000000000000' as `0x${string}`;

function fmtUsd(n: number): string {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000)     return '$' + (n / 1_000).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}

// ── Per-pair LP position ──────────────────────────────────────────────────────
export function useLpPosition(pairKey: PairKey) {
  const account = useActiveAccount();
  const addr = account?.address ?? ZERO;
  const pair = PAIRS[pairKey];
  const t0 = TOKENS[pair.token0 as TokenSymbol];
  const t1 = TOKENS[pair.token1 as TokenSymbol];
  const pc = getContract({ client, chain: arbitrumSepolia, address: pair.address, abi: PAIR_ABI });

  const { data: userLp }      = useReadContract({ contract: pc, method: 'balanceOf',   params: [addr],         queryOptions: { enabled: !!account, refetchInterval: 15_000 } });
  const { data: totalSupply } = useReadContract({ contract: pc, method: 'totalSupply', params: [],             queryOptions: { refetchInterval: 15_000 } });
  const { data: reserves }    = useReadContract({ contract: pc, method: 'getReserves', params: [],             queryOptions: { refetchInterval: 15_000 } });
  const { data: ilPos }       = useReadContract({ contract: pmContract,      method: 'getPosition',  params: [pair.address, addr], queryOptions: { enabled: !!account, refetchInterval: 15_000 } });
  const { data: tierConfig }  = useReadContract({ contract: factoryContract, method: 'getPairConfig', params: [pair.address],      queryOptions: { refetchInterval: 60_000 } });
  const { data: twapRaw }     = useReadContract({ contract: oracleContract,  method: 'getTWAPForTokens', params: [pair.address, t0.address], queryOptions: { refetchInterval: 30_000 } });

  const lpRaw  = (userLp as bigint | undefined) ?? 0n;
  const supply = (totalSupply as bigint | undefined) ?? 0n;
  const res    = reserves as readonly [bigint, bigint, number] | undefined;
  const res0   = res?.[0] ?? 0n;
  const res1   = res?.[1] ?? 0n;
  const pos    = ilPos as { liquidity: bigint; valueAtDeposit: bigint; timestamp: bigint } | undefined;
  const tc     = tierConfig as readonly [bigint, bigint, bigint, bigint] | undefined;
  const maxCovBps = Number(tc?.[3] ?? 10000n);

  const hasLp    = lpRaw > 0n;
  const hasIlPos = (pos?.liquidity ?? 0n) > 0n;

  // User's share of pool reserves — use BigInt math to avoid precision loss
  // Use higher precision: multiply by 1e9 to get 9 decimal places of share
  const SHARE_PRECISION = 1_000_000_000n;
  const sharePct  = supply > 0n
    ? Number((lpRaw * SHARE_PRECISION) / supply) / Number(SHARE_PRECISION)
    : 0;
  const token0Amt = parseFloat(formatUnits(res0, t0.decimals)) * sharePct;
  const token1Amt = parseFloat(formatUnits(res1, t1.decimals)) * sharePct;

  // TWAP price: getTWAPForTokens returns Q112 fixed-point
  // Formula: humanPrice = (twapQ / 2^112) * (10^t0.decimals / 10^t1.decimals)
  // This gives token1 per token0 in human units (e.g. USDC per WETH)
  const Q112 = 2n ** 112n;
  const twapQ = (twapRaw as bigint | undefined) ?? 0n;
  const decAdj = Math.pow(10, t0.decimals - t1.decimals);
  const twapPrice = twapQ > 0n ? (Number(twapQ) / Number(Q112)) * decAdj : 0;

  // Current USD value — only meaningful when share > 0 and TWAP available or stable pair
  const t1IsStable = t1.symbol === 'USDC' || t1.symbol === 'DAI';
  const hasMeaningfulShare = sharePct > 1e-9 && (token0Amt > 0 || token1Amt > 0);
  const currentValueUSD = hasMeaningfulShare
    ? (t1IsStable && twapPrice > 0
        ? token0Amt * twapPrice + token1Amt
        : (t1IsStable ? token1Amt * 2 : 0)) // fallback only for stable pairs
    : 0;

  // IL: only show when we have both a valid entry AND current value
  const entryValueUSD = parseFloat(formatUnits(pos?.valueAtDeposit ?? 0n, 6));
  const ilUSD = hasIlPos && currentValueUSD > 0 && entryValueUSD > 0 && hasMeaningfulShare
    ? currentValueUSD - entryValueUSD
    : 0;
  const ilPct = entryValueUSD > 0 ? (ilUSD / entryValueUSD) * 100 : 0;

  // Coverage
  const timestamp  = pos?.timestamp ?? 0n;
  const nowSecs    = BigInt(Math.floor(Date.now() / 1000));
  const daysInPool = timestamp > 0n ? Math.floor(Number(nowSecs - timestamp) / 86400) : 0;
  const coveragePct = Math.min(maxCovBps / 100, (daysInPool / 240) * (maxCovBps / 100));
  const estPayoutUSD = ilUSD < 0 ? Math.abs(ilUSD) * (coveragePct / 100) : 0;

  return {
    pairKey, pair, t0, t1,
    hasLp, hasIlPos,
    lpRaw,
    lpFmt: parseFloat(formatUnits(lpRaw, 18)).toFixed(6),
    sharePct,
    token0Amt, token1Amt,
    currentValueUSD,
    entryValueUSD,
    ilUSD,
    ilPct,
    daysInPool,
    coveragePct,
    estPayoutUSD,
    timestamp,
    entryValueFmt:   entryValueUSD > 0 ? fmtUsd(entryValueUSD) : '—',
    currentValueFmt: currentValueUSD > 0 ? fmtUsd(currentValueUSD) : '—',
    ilFmt:    ilUSD !== 0 ? (ilUSD >= 0 ? '+' : '-') + fmtUsd(Math.abs(ilUSD)).slice(1) : '$0.00',
    ilPctFmt: ilPct !== 0 ? (ilPct >= 0 ? '+' : '') + ilPct.toFixed(2) + '%' : '0.00%',
    ilIsLoss: ilUSD < 0,
    estPayoutFmt: estPayoutUSD > 0 ? fmtUsd(estPayoutUSD) : '$0.00',
    entryTimestamp: timestamp > 0n
      ? new Date(Number(timestamp) * 1000).toISOString().replace('T', ' · ').slice(0, 19) + ' UTC'
      : '—',
    currentTwapFmt: twapPrice > 0 ? '$' + twapPrice.toFixed(2) : '—',
    daysToFull: Math.max(0, 240 - daysInPool),
  };
}

// ── Per-pair staking position ─────────────────────────────────────────────────
export function useStakingPosition(pairKey: PairKey) {
  const account = useActiveAccount();
  const addr = account?.address ?? ZERO;
  const pair = PAIRS[pairKey];

  const { data: posData }     = useReadContract({ contract: vaultContract, method: 'stakerPositions', params: [pair.address, addr], queryOptions: { enabled: !!account, refetchInterval: 15_000 } });
  const { data: pendingData } = useReadContract({ contract: vaultContract, method: 'pendingFees',     params: [pair.address, addr], queryOptions: { enabled: !!account, refetchInterval: 15_000 } });

  const d = posData as readonly [bigint, bigint, bigint, bigint] | undefined;
  const amount             = d?.[0] ?? 0n;
  const unstakeRequestTime = d?.[3] ?? 0n;
  const pendingFees        = (pendingData as bigint | undefined) ?? 0n;

  const amountUSD  = parseFloat(formatUnits(amount, 6));
  const pendingUSD = parseFloat(formatUnits(pendingFees, 6));

  const unstakeStatus: 'Active' | 'Requested' =
    unstakeRequestTime === 0n ? 'Active' : 'Requested';

  return {
    pairKey, pair,
    hasPosition: amount > 0n,
    amount, unstakeRequestTime, pendingFees,
    amountUSD, pendingUSD,
    amountFmt:  fmtUsd(amountUSD),
    pendingFmt: '$' + pendingUSD.toFixed(4),
    unstakeStatus,
  };
}

// ── Aggregate for summary cards ───────────────────────────────────────────────
export function usePortfolioSummary(
  lpPositions: ReturnType<typeof useLpPosition>[],
  stakingPositions: ReturnType<typeof useStakingPosition>[],
) {
  const totalLpValueUSD    = lpPositions.reduce((s, p) => s + (p.hasLp ? p.currentValueUSD : 0), 0);
  const totalIlExposureUSD = lpPositions.reduce((s, p) => s + (p.ilUSD < 0 ? Math.abs(p.ilUSD) : 0), 0);
  const totalStakingUSD    = stakingPositions.reduce((s, p) => s + (p.hasPosition ? p.amountUSD : 0), 0);
  const totalEarnedUSD     = stakingPositions.reduce((s, p) => s + p.pendingUSD, 0);

  return {
    totalLpValue:    fmtUsd(totalLpValueUSD),
    totalIlExposure: totalIlExposureUSD > 0 ? fmtUsd(totalIlExposureUSD) : '$0.00',
    totalStaking:    fmtUsd(totalStakingUSD),
    totalEarned:     fmtUsd(totalEarnedUSD),
  };
}
