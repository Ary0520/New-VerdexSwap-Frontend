import { useReadContract } from 'thirdweb/react';
import { getContract } from 'thirdweb';
import { formatUnits } from 'viem';
import { client, arbitrumSepolia } from '../lib/thirdweb';
import { VAULT_ABI } from '../lib/abis/vault';
import { PAIR_ABI } from '../lib/abis/pair';
import { FACTORY_ABI } from '../lib/abis/factory';
import { ADDRESSES, PAIRS, TOKENS, type PairKey, type TokenSymbol } from '../lib/contracts';
import { useProtocolDayData, usePoolDayData, useFeeConversions, useProtocolStats } from './useSubgraph';

const vaultContract   = getContract({ client, chain: arbitrumSepolia, address: ADDRESSES.vault,   abi: VAULT_ABI });
const factoryContract = getContract({ client, chain: arbitrumSepolia, address: ADDRESSES.factory, abi: FACTORY_ABI });

// ── Protocol KPIs (mix of chain + subgraph) ───────────────────────────────────
export function useProtocolKPIs() {
  const { data: subgraph, loading: sgLoading } = useProtocolStats();

  // Active pools count from factory (chain)
  const { data: pairsLen } = useReadContract({
    contract: factoryContract, method: 'allPairsLength', params: [],
    queryOptions: { refetchInterval: 60_000 },
  });

  // Vault TVL: sum stakerDeposits + feeDeposits across all pairs (chain)
  const pairKeys = Object.keys(PAIRS) as PairKey[];
  const vaultHealthResults = pairKeys.map(key => {
    const pair = PAIRS[key];
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data } = useReadContract({
      contract: vaultContract, method: 'getPoolHealth', params: [pair.address],
      queryOptions: { refetchInterval: 30_000 },
    });
    return data as readonly [bigint, bigint, bigint, bigint, bigint] | undefined;
  });

  // Pair TVLs: reserve1 (USDC side) * 2 for USDC-quoted pairs
  const pairTvls = pairKeys.map(key => {
    const pair = PAIRS[key];
    const t1 = TOKENS[pair.token1 as TokenSymbol];
    const pc = getContract({ client, chain: arbitrumSepolia, address: pair.address, abi: PAIR_ABI });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data } = useReadContract({
      contract: pc, method: 'getReserves', params: [],
      queryOptions: { refetchInterval: 30_000 },
    });
    const res = data as readonly [bigint, bigint, number] | undefined;
    const res1 = res?.[1] ?? 0n;
    const isStable = t1.symbol === 'USDC' || t1.symbol === 'DAI';
    return isStable ? parseFloat(formatUnits(res1, t1.decimals)) * 2 : 0;
  });

  const totalPairTvl = pairTvls.reduce((s, v) => s + v, 0);
  const vaultTvl = vaultHealthResults.reduce((s, d) => {
    const stakerDep = d?.[1] ?? 0n;
    const feeDep    = d?.[2] ?? 0n;
    return s + parseFloat(formatUnits(stakerDep + feeDep, 6));
  }, 0);

  function fmtUsd(n: number) {
    if (n >= 1_000_000_000) return '$' + (n / 1_000_000_000).toFixed(2) + 'B';
    if (n >= 1_000_000)     return '$' + (n / 1_000_000).toFixed(2) + 'M';
    if (n >= 1_000)         return '$' + (n / 1_000).toFixed(1) + 'K';
    return '$' + n.toFixed(2);
  }

  return {
    // Chain-sourced (always real)
    tvl:         fmtUsd(totalPairTvl),
    vaultTvl:    fmtUsd(vaultTvl),
    activePools: Number(pairsLen ?? 0),
    // Subgraph-sourced (real once synced, else null)
    vol24h:      subgraph ? fmtUsd(parseFloat(subgraph.totalVolumeUSD) / 30) : null, // rough daily avg
    feesTotal:   subgraph ? fmtUsd(parseFloat(subgraph.totalFeesUSD)) : null,
    ilPayouts:   subgraph ? fmtUsd(parseFloat(subgraph.totalILPayoutsUSD)) : null,
    feeConversions: subgraph ? fmtUsd(parseFloat(subgraph.totalFeeConversionsUSD)) : null,
    txCount:     subgraph ? Number(subgraph.txCount).toLocaleString() : null,
    loading: sgLoading,
  };
}

// ── Protocol chart data (subgraph day data) ───────────────────────────────────
export function useProtocolChartData(days = 30) {
  const { data, loading } = useProtocolDayData(days);

  const labels  = data.map(d => {
    const date = new Date(d.date * 1000);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });
  const volumes = data.map(d => parseFloat(d.volumeUSD));
  const fees    = data.map(d => parseFloat(d.feesUSD));

  // Cumulative fees
  let acc = 0;
  const cumulativeFees = fees.map(f => { acc += f; return acc; });

  return { labels, volumes, fees, cumulativeFees, loading, hasData: data.length > 0 };
}

// ── Per-pool analytics (chain reserves + subgraph volume/fees) ────────────────
export function usePoolAnalytics(pairKey: PairKey, days = 30) {
  const pair = PAIRS[pairKey];
  const t0   = TOKENS[pair.token0 as TokenSymbol];
  const t1   = TOKENS[pair.token1 as TokenSymbol];
  const pc   = getContract({ client, chain: arbitrumSepolia, address: pair.address, abi: PAIR_ABI });

  // Live reserves (chain)
  const { data: reserves } = useReadContract({
    contract: pc, method: 'getReserves', params: [],
    queryOptions: { refetchInterval: 15_000 },
  });
  const res = reserves as readonly [bigint, bigint, number] | undefined;
  const res0 = parseFloat(formatUnits(res?.[0] ?? 0n, t0.decimals));
  const res1 = parseFloat(formatUnits(res?.[1] ?? 0n, t1.decimals));
  const isStable = t1.symbol === 'USDC' || t1.symbol === 'DAI';
  const tvlUsd = isStable ? res1 * 2 : 0;

  // Vault health (chain)
  const { data: vaultHealth } = useReadContract({
    contract: vaultContract, method: 'getPoolHealth', params: [pair.address],
    queryOptions: { refetchInterval: 15_000 },
  });
  const vh = vaultHealth as readonly [bigint, bigint, bigint, bigint, bigint] | undefined;
  const usdcReserve   = parseFloat(formatUnits(vh?.[0] ?? 0n, 6));
  const totalExposure = parseFloat(formatUnits(vh?.[4] ?? 0n, 6));
  const utilization   = Number(vh?.[3] ?? 0n) / 100;
  const vaultRatio    = totalExposure > 0 ? usdcReserve / totalExposure : 0;

  // Vault pool stats (chain)
  const { data: poolStats } = useReadContract({
    contract: vaultContract, method: 'pools', params: [pair.address],
    queryOptions: { refetchInterval: 30_000 },
  });
  const ps = poolStats as readonly [bigint, bigint, bigint, bigint, bigint, bigint] | undefined;
  const totalPaidOut = parseFloat(formatUnits(ps?.[3] ?? 0n, 6));
  const totalFeesIn  = parseFloat(formatUnits(ps?.[4] ?? 0n, 6));

  // Historical day data (subgraph)
  const { data: dayData, loading: dayLoading } = usePoolDayData(pair.address.toLowerCase(), days);
  const dayLabels  = dayData.map(d => {
    const date = new Date(d.date * 1000);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });
  const dayVolumes = dayData.map(d => parseFloat(d.volumeUSD));
  const dayFees    = dayData.map(d => parseFloat(d.feesUSD));
  const dayReserve = dayData.map(d => parseFloat(d.reserve1) * 2); // USDC side * 2

  // Fee APR: (daily fees / TVL) * 365 * 100
  const dayFeeApr = dayData.map((d) => {
    const tvl = parseFloat(d.reserve1) * 2;
    const fee = parseFloat(d.feesUSD);
    return tvl > 0 ? (fee / tvl) * 365 * 100 : 0;
  });

  function fmtUsd(n: number) {
    if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
    if (n >= 1_000)     return '$' + (n / 1_000).toFixed(1) + 'K';
    return '$' + n.toFixed(2);
  }

  return {
    pairKey, pair, t0, t1,
    // Live chain data
    res0, res1, tvlUsd,
    usdcReserve, totalExposure, utilization, vaultRatio,
    totalPaidOut, totalFeesIn,
    tvlFmt:         fmtUsd(tvlUsd),
    usdcReserveFmt: fmtUsd(usdcReserve),
    totalPaidOutFmt: fmtUsd(totalPaidOut),
    totalFeesInFmt:  fmtUsd(totalFeesIn),
    utilizationFmt:  utilization.toFixed(1) + '%',
    vaultRatioFmt:   totalExposure > 0 ? vaultRatio.toFixed(2) + 'x' : '—',
    // Historical subgraph data
    dayLabels, dayVolumes, dayFees, dayReserve, dayFeeApr,
    hasHistoricalData: dayData.length > 0,
    dayLoading,
  };
}

// ── FeeConverter analytics ────────────────────────────────────────────────────
export function useFeeConverterAnalytics(pairKey: PairKey) {
  const pair = PAIRS[pairKey];
  const { data: conversions, loading } = useFeeConversions(pair.address.toLowerCase(), 10);

  const totalUsdcConverted = conversions.reduce((s, c) => s + parseFloat(c.usdcOut), 0);
  const totalCallerBonus   = conversions.reduce((s, c) => s + parseFloat(c.callerBonus), 0);

  function fmtTs(unix: string) {
    const secs = Math.floor(Date.now() / 1000) - parseInt(unix);
    if (secs < 60)    return `${secs}s ago`;
    if (secs < 3600)  return `${Math.floor(secs / 60)}m ago`;
    if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
    return `${Math.floor(secs / 86400)}d ago`;
  }

  function fmtUsd(n: number) {
    if (n >= 1_000) return '$' + (n / 1_000).toFixed(1) + 'K';
    return '$' + n.toFixed(2);
  }

  return {
    conversions: conversions.map(c => ({
      time:        fmtTs(c.timestamp),
      usdcOut:     fmtUsd(parseFloat(c.usdcOut)),
      callerBonus: fmtUsd(parseFloat(c.callerBonus)),
      caller:      c.caller as string,
      txHash:      c.txHash as string,
    })),
    totalUsdcConverted: fmtUsd(totalUsdcConverted),
    totalCallerBonus:   fmtUsd(totalCallerBonus),
    conversionCount:    conversions.length,
    loading,
    hasData: conversions.length > 0,
  };
}
