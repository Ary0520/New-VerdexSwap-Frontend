import { useState } from 'react';
import { POOL_ANALYTICS, DAYS_30 } from './analyticsData';
import ChartCard from './ChartCard';
import LineChart from './LineChart';
import BarChart from './BarChart';

const PoolDot = ({ color, size = 10 }: { color: string; size?: number }) => (
  <span className="rounded-full flex-shrink-0 inline-block" style={{ width: size, height: size, background: color }} />
);

const PoolAnalyticsSection = () => {
  const [selectedId, setSelectedId] = useState(POOL_ANALYTICS[0].id);
  const [dropOpen, setDropOpen] = useState(false);
  const pool = POOL_ANALYTICS.find((p) => p.id === selectedId)!;

  return (
    <div className="mb-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-black text-lg font-headline" style={{ color: '#E5E2E3', letterSpacing: '-0.01em' }}>
            Per-Pool Analytics
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
            Drill into reserve, volume, fee APR, vault health, and IL payout history.
          </p>
        </div>

        {/* Pool dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:brightness-110"
            style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.08)', minWidth: 180 }}
          >
            <PoolDot color={pool.token0Color} />
            <PoolDot color={pool.token1Color} />
            <span className="flex-1 text-left text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: '#E5E2E3' }}>
              {pool.label}
            </span>
            <span className="material-symbols-outlined flex-shrink-0"
              style={{ color: '#B9CBBC', fontSize: 18, transform: dropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
              expand_more
            </span>
          </button>
          {dropOpen && (
            <div className="absolute right-0 mt-2 rounded-xl overflow-hidden z-50"
              style={{ width: '100%', minWidth: 180, background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
              {POOL_ANALYTICS.map((p) => (
                <button key={p.id} onClick={() => { setSelectedId(p.id); setDropOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors"
                  style={{ background: p.id === selectedId ? 'rgba(0,255,157,0.08)' : 'transparent' }}
                  onMouseEnter={(e) => { if (p.id !== selectedId) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={(e) => { if (p.id !== selectedId) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <PoolDot color={p.token0Color} />
                  <PoolDot color={p.token1Color} />
                  <span className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: p.id === selectedId ? '#00FF9D' : '#E5E2E3' }}>
                    {p.label}
                  </span>
                  {p.id === selectedId && <span className="material-symbols-outlined ml-auto" style={{ color: '#00FF9D', fontSize: 16 }}>check</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <ChartCard title="Reserve History" subtitle="Pool TVL over time" value={`$${pool.reserve[pool.reserve.length - 1].toFixed(1)}M`}>
          <LineChart data={pool.reserve} labels={DAYS_30} color="#00FF9D" unit="$M" height={140} gradientId={`res-${pool.id}`} />
        </ChartCard>

        <ChartCard title="Volume History" subtitle="Daily swap volume">
          <BarChart data={pool.volume} labels={DAYS_30} color="#568DFF" unit="$M" height={140} />
        </ChartCard>

        <ChartCard title="Fee APR History" subtitle="Annualized fee return" value={`${pool.feeApr[pool.feeApr.length - 1].toFixed(1)}%`}>
          <LineChart data={pool.feeApr} labels={DAYS_30} color="#56FFA8" unit="%" height={140} gradientId={`apr-${pool.id}`} />
        </ChartCard>

        <ChartCard
          title="Vault Health Ratio"
          subtitle="Reserve / outstanding exposure"
          value={`${pool.vaultHealth[pool.vaultHealth.length - 1].toFixed(2)}x`}
          change={pool.vaultHealth[pool.vaultHealth.length - 1] > 2 ? 'Healthy' : 'Watch'}
          changePositive={pool.vaultHealth[pool.vaultHealth.length - 1] > 2}
        >
          <LineChart data={pool.vaultHealth} labels={DAYS_30} color="#FFB400" unit="x" height={140} gradientId={`vh-${pool.id}`} />
        </ChartCard>

        <ChartCard title="IL Payout History" subtitle="Cumulative payouts from vault" value={`$${pool.ilPayouts[pool.ilPayouts.length - 1].toFixed(2)}M`}>
          <LineChart data={pool.ilPayouts} labels={DAYS_30} color="#FF6464" unit="$M" height={140} gradientId={`il-${pool.id}`} />
        </ChartCard>

        {/* Pool health summary card */}
        <div className="rounded-xl p-5 flex flex-col gap-4"
          style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}>
            Pool Snapshot
          </span>
          {[
            { label: 'Current Reserve',  value: `$${pool.reserve[pool.reserve.length - 1].toFixed(1)}M`,  color: '#00FF9D' },
            { label: 'Avg Daily Volume', value: `$${(pool.volume.reduce((a,b)=>a+b,0)/pool.volume.length).toFixed(1)}M`, color: '#568DFF' },
            { label: 'Avg Fee APR',      value: `${(pool.feeApr.reduce((a,b)=>a+b,0)/pool.feeApr.length).toFixed(1)}%`,  color: '#56FFA8' },
            { label: 'Vault Health',     value: `${pool.vaultHealth[pool.vaultHealth.length - 1].toFixed(2)}x`,           color: '#FFB400' },
            { label: 'Total IL Paid',    value: `$${pool.ilPayouts[pool.ilPayouts.length - 1].toFixed(2)}M`,              color: '#FF6464' },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-sm" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{row.label}</span>
              <span className="text-sm font-bold" style={{ color: row.color, fontFamily: 'Inter' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PoolAnalyticsSection;
