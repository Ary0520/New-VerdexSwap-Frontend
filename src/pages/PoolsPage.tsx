import { useState } from 'react';
import SwapTopNav from '../components/Swap/SwapTopNav';
import AppSidebar from '../components/Swap/AppSidebar';
import PoolsTable from '../components/Pools/PoolsTable';
import AddLiquidityModal from '../components/Pools/AddLiquidityModal';
import { POOLS } from '../components/Pools/poolsData';

const PoolsPage = () => {
  const [createModal, setCreateModal] = useState(false);

  return (
    <div className="min-h-screen font-body" style={{ background: '#131314', color: '#E5E2E3' }}>
      <SwapTopNav />
      <AppSidebar />

      <main
        style={{
          marginLeft: 200,
          paddingTop: 65,
          minHeight: '100vh',
        }}
      >
        {/* Subtle ambient glow */}
        <div
          className="pointer-events-none fixed"
          style={{
            width: 600,
            height: 600,
            background: 'rgba(0,255,157,0.03)',
            filter: 'blur(120px)',
            borderRadius: '50%',
            top: '20%',
            right: '10%',
            zIndex: 0,
          }}
        />

        <div className="relative z-10 px-8 py-8">
          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className="font-black text-3xl font-headline"
                style={{ color: '#E5E2E3', letterSpacing: '-0.02em' }}
              >
                Pools
              </h1>
              <p className="text-sm mt-1" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
                Provide liquidity and earn fees with IL Shield protection.
              </p>
            </div>
            <button
              onClick={() => setCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(0,255,157,0.25)] active:scale-[0.98]"
              style={{
                background: '#00FF9D',
                color: '#007143',
                fontFamily: 'Space Grotesk',
                fontWeight: 700,
              }}
            >
              <span className="material-symbols-outlined text-base" style={{ fontSize: 18 }}>add</span>
              Create Pool
            </button>
          </div>

          {/* Stats strip */}
          <div
            className="grid grid-cols-3 gap-px rounded-xl overflow-hidden mb-8"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {[
              { label: 'Total TVL', value: '$205.2M', color: '#00FF9D' },
              { label: 'Total 24h Volume', value: '$61.2M', color: '#568DFF' },
              { label: 'Active Pools', value: '5', color: '#B9CBBC' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-1 px-6 py-4"
                style={{ background: '#1C1B1C' }}
              >
                <span className="text-xs uppercase tracking-widest" style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}>
                  {stat.label}
                </span>
                <span className="text-2xl font-black font-headline" style={{ color: stat.color }}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* Table */}
          <PoolsTable />
        </div>
      </main>

      {/* Create Pool modal — reuses Add Liquidity with first pool as placeholder */}
      {createModal && (
        <AddLiquidityModal pool={POOLS[0]} onClose={() => setCreateModal(false)} />
      )}
    </div>
  );
};

export default PoolsPage;
