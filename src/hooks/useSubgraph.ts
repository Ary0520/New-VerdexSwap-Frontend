import { useEffect, useState } from 'react';
import {
  fetchProtocol,
  fetchAllPools,
  fetchPoolDayData,
  fetchProtocolDayData,
  fetchUserTransactions,
  fetchUserILPositions,
  fetchUserStakingPositions,
  fetchFeeConversions,
  fetchPoliciesActive,
  fetchLatestConversion,
  fetchVaultApy,
  type SubgraphPool,
  type SubgraphProtocol,
  type SubgraphPoolDayData,
} from '../lib/subgraph';

// ── Protocol stats (for Analytics KPIs + Pools page header) ──────────────────
export function useProtocolStats() {
  const [data, setData] = useState<SubgraphProtocol | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProtocol().then((d) => { setData(d); setLoading(false); });
    const interval = setInterval(() => fetchProtocol().then(setData), 60_000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading };
}

// ── All pools (for Analytics pool list) ───────────────────────────────────────
export function useAllPools() {
  const [data, setData] = useState<SubgraphPool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllPools().then((d) => { setData(d); setLoading(false); });
    const interval = setInterval(() => fetchAllPools().then(setData), 30_000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading };
}

// ── Per-pool day data (for charts) ────────────────────────────────────────────
export function usePoolDayData(poolId: string | undefined, days = 30) {
  const [data, setData] = useState<SubgraphPoolDayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!poolId) { setLoading(false); return; }
    fetchPoolDayData(poolId, days).then((d) => { setData(d); setLoading(false); });
  }, [poolId, days]);

  return { data, loading };
}

// ── Protocol day data (for TVL/volume charts) ─────────────────────────────────
export function useProtocolDayData(days = 30) {
  const [data, setData] = useState<{ date: number; volumeUSD: string; feesUSD: string; txCount: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProtocolDayData(days).then((d) => { setData(d); setLoading(false); });
  }, [days]);

  return { data, loading };
}

// ── User transactions (for Portfolio page) ────────────────────────────────────
export function useUserTransactions(userAddress: string | undefined) {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchUserTransactions>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userAddress) { setLoading(false); return; }
    fetchUserTransactions(userAddress).then((d) => { setData(d); setLoading(false); });
  }, [userAddress]);

  return { data, loading };
}

// ── User IL positions (for Portfolio LP table) ────────────────────────────────
export function useUserILPositions(userAddress: string | undefined) {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchUserILPositions>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userAddress) { setLoading(false); return; }
    fetchUserILPositions(userAddress).then((d) => { setData(d); setLoading(false); });
  }, [userAddress]);

  return { data, loading };
}

// ── User staking positions (for Portfolio staking table) ──────────────────────
export function useUserStakingPositions(userAddress: string | undefined) {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchUserStakingPositions>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userAddress) { setLoading(false); return; }
    fetchUserStakingPositions(userAddress).then((d) => { setData(d); setLoading(false); });
  }, [userAddress]);

  return { data, loading };
}

// ── Fee conversions (for Analytics FeeConverter card) ────────────────────────
export function useFeeConversions(poolId: string | undefined, first = 10) {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchFeeConversions>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!poolId) { setLoading(false); return; }
    fetchFeeConversions(poolId, first).then((d) => { setData(d); setLoading(false); });
    const interval = setInterval(() => fetchFeeConversions(poolId, first).then(setData), 30_000);
    return () => clearInterval(interval);
  }, [poolId, first]);

  return { data, loading };
}

// ── Policies active count ─────────────────────────────────────────────────────
export function usePoliciesActive() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPoliciesActive().then(n => { setCount(n); setLoading(false); });
    const interval = setInterval(() => fetchPoliciesActive().then(setCount), 60_000);
    return () => clearInterval(interval);
  }, []);

  return { count, loading };
}

// ── Latest fee conversion ─────────────────────────────────────────────────────
export function useLatestConversion() {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchLatestConversion>>>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestConversion().then(d => { setData(d); setLoading(false); });
    const interval = setInterval(() => fetchLatestConversion().then(setData), 30_000);
    return () => clearInterval(interval);
  }, []);

  // Format timestamp as relative time e.g. "3 hrs ago"
  const timeAgo = (() => {
    if (!data) return null;
    const secs = Math.floor(Date.now() / 1000) - parseInt(data.timestamp);
    if (secs < 60)   return `${secs}s ago`;
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    if (secs < 86400) return `${Math.floor(secs / 3600)} hrs ago`;
    return `${Math.floor(secs / 86400)}d ago`;
  })();

  return { data, timeAgo, loading };
}

// ── Vault APY from subgraph fee history ───────────────────────────────────────
export function useVaultApy(totalStakedUsd: number) {
  const [apy, setApy] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (totalStakedUsd <= 0) { setLoading(false); return; }
    fetchVaultApy(totalStakedUsd).then(a => { setApy(a); setLoading(false); });
  }, [totalStakedUsd]);

  return {
    apy,
    apyFormatted: apy !== null ? apy.toFixed(2) + '%' : null,
    loading,
  };
}
