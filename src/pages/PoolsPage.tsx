import { useState } from 'react';
import { useReadContract } from 'thirdweb/react';
import { getContract } from 'thirdweb';
import { formatUnits } from 'viem';
import SwapTopNav from '../components/Swap/SwapTopNav';
import AppSidebar from '../components/Swap/AppSidebar';
import PoolsTable from '../components/Pools/PoolsTable';
import CreatePoolModal from '../components/Pools/CreatePoolModal';
import { client, arbitrumSepolia } from '../lib/thirdweb';
import { PAIR_ABI } from '../lib/abis/pair';
import { FACTORY_ABI } from '../lib/abis/factory';
import { ADDRESSES, PAIRS, TOKENS, type PairKey, type TokenSymbol } from '../lib/contracts';
const factoryContract = getContract({ client, chain: arbitrumSepolia, address: ADDRESSES.factory, abi: FACTORY_ABI });

function usePoolsPageStats() {
  const { data: pairsLen } = useReadContract({
    contract: factoryContract, method: 'allPairsLength', params: [],
    queryOptions: { refetchInterval: 60_000 },
  });

  // Sum TVL across all pairs (USDC-quoted: reserve1 * 2)
  const pairKeys = Object.keys(PAIRS) as PairKey[];
  const tvlParts = pairKeys.map(key => {
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

  const totalTvl = tvlParts.reduce((s, v) => s + v, 0);

  function fmtUsd(n: number) {
    if (n >= 1_000_000_000) return '$' + (n / 1_000_000_000).toFixed(2) + 'B';
    if (n >= 1_000_000)     return '$' + (n / 1_000_000).toFixed(2) + 'M';
    if (n >= 1_000)         return '$' + (n / 1_000).toFixed(1) + 'K';
    return '$' + n.toFixed(2);
  }

  return {
    tvl: fmtUsd(totalTvl),
    activePools: Number(pairsLen ?? 0),
  };
}

const PoolsPage = () => {
  const [createModal, setCreateModal] = useState(false);
  const { tvl, activePools } = usePoolsPageStats();

  return (
    <div className="min-h-screen font-body" style={{ background: '#131314', color: '#E5E2E3' }}>
      <SwapTopNav />
      <AppSidebar />

      <main style={{ marginLeft: 200, paddingTop: 65, minHeight: '100vh' }}>
        <div className="pointer-events-none fixed"
          style={{ width: 600, height: 600, background: 'rgba(0,255,157,0.03)', filter: 'blur(120px)', borderRadius: '50%', top: '20%', right: '10%', zIndex: 0 }} />

        <div className="relative z-10 px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-black text-3xl font-headline" style={{ color: '#E5E2E3', letterSpacing: '-0.02em' }}>
                Pools
              </h1>
              <p className="text-sm mt-1" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
                Provide liquidity and earn fees with IL Shield protection.
              </p>
            </div>
            <button
              onClick={() => setCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(0,255,157,0.25)] active:scale-[0.98]"
              style={{ background: '#00FF9D', color: '#007143', fontFamily: 'Space Grotesk', fontWeight: 700 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
              Create Pool
            </button>
          </div>

          {/* Stats strip — TVL and pool count from chain, volume from subgraph (shows — until synced) */}
          <div className="grid grid-cols-3 gap-px rounded-xl overflow-hidden mb-8"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { label: 'Total TVL',       value: tvl,                    color: '#00FF9D', live: true  },
              { label: 'Total 24h Volume', value: '—',                   color: '#568DFF', live: false },
              { label: 'Active Pools',    value: String(activePools || '—'), color: '#B9CBBC', live: true  },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col gap-1 px-6 py-4" style={{ background: '#1C1B1C' }}>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs uppercase tracking-widest"
                    style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}>
                    {stat.label}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: stat.live ? '#00FF9D' : '#3B4A3F' }} />
                </div>
                <span className="text-2xl font-black font-headline" style={{ color: stat.color }}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          <PoolsTable />
        </div>
      </main>

      {createModal && <CreatePoolModal onClose={() => setCreateModal(false)} />}
    </div>
  );
};

export default PoolsPage;
