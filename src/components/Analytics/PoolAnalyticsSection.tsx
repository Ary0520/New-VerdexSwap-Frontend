import { useState } from 'react';
import { PAIRS, type PairKey } from '../../lib/contracts';
import { usePoolAnalytics } from '../../hooks/useAnalytics';
import ChartCard from './ChartCard';
import LineChart from './LineChart';
import BarChart from './BarChart';

const TOKEN_COLORS: Record<string, string> = {
  WETH: '#627EEA', USDC: '#2775CA', WBTC: '#F7931A', ARB: '#12AAFF', DAI: '#F5AC37',
};

const EmptyChart = ({ height = 140 }: { height?: number }) => (
  <div className="flex flex-col items-center justify-center gap-2"
    style={{ height, background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
    <span className="material-symbols-outlined" style={{ color: '#3B4A3F', fontSize: 20 }}>bar_chart</span>
    <span className="text-xs" style={{ color: '#3B4A3F', fontFamily: 'Inter' }}>Syncing…</span>
  </div>
);

const ALL_PAIRS = Object.keys(PAIRS) as PairKey[];

function PoolDot({ symbol }: { symbol: string }) {
  return <span className="rounded-full flex-shrink-0 inline-block"
    style={{ width: 10, height: 10, background: TOKEN_COLORS[symbol] ?? '#888' }} />;
}

function PoolSection({ pairKey }: { pairKey: PairKey }) {
  const d = usePoolAnalytics(pairKey);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
      {/* Reserve / TVL */}
      <ChartCard title="Reserve History" subtitle="Pool TVL over time" value={d.tvlFmt}>
        {d.dayLoading ? <EmptyChart /> : d.hasHistoricalData
          ? <LineChart data={d.dayReserve} labels={d.dayLabels} color="#00FF9D" unit="$M" height={140} gradientId={`res-${pairKey}`} />
          : <EmptyChart />}
      </ChartCard>

      {/* Volume */}
      <ChartCard title="Volume History" subtitle="Daily swap volume">
        {d.dayLoading ? <EmptyChart /> : d.hasHistoricalData
          ? <BarChart data={d.dayVolumes} labels={d.dayLabels} color="#568DFF" unit="$M" height={140} />
          : <EmptyChart />}
      </ChartCard>

      {/* Fee APR */}
      <ChartCard title="Fee APR" subtitle="Annualized fee return"
        value={d.hasHistoricalData && d.dayFeeApr.length > 0
          ? d.dayFeeApr[d.dayFeeApr.length - 1].toFixed(2) + '%'
          : undefined}>
        {d.dayLoading ? <EmptyChart /> : d.hasHistoricalData
          ? <LineChart data={d.dayFeeApr} labels={d.dayLabels} color="#56FFA8" unit="%" height={140} gradientId={`apr-${pairKey}`} />
          : <EmptyChart />}
      </ChartCard>

      {/* Pool Snapshot — always live from chain */}
      <div className="rounded-xl p-5 flex flex-col gap-3"
        style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-xs font-bold uppercase tracking-widest"
          style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}>
          Pool Snapshot · Live
        </span>
        {[
          { label: 'Pool TVL',           value: d.tvlFmt,            color: '#00FF9D' },
          { label: 'Vault Reserve',      value: d.usdcReserveFmt,    color: '#568DFF' },
          { label: 'Utilization',        value: d.utilizationFmt,    color: d.utilization > 80 ? '#FF6464' : d.utilization > 50 ? '#FFB400' : '#00E38B' },
          { label: 'Reserve Ratio',      value: d.vaultRatioFmt,     color: '#E5E2E3' },
          { label: 'Total IL Paid Out',  value: d.totalPaidOutFmt,   color: '#FFB400' },
          { label: 'Total Fees In',      value: d.totalFeesInFmt,    color: '#56FFA8' },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-sm" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{row.label}</span>
            <span className="text-sm font-bold" style={{ color: row.color, fontFamily: 'Inter' }}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* Utilization bar */}
      <div className="rounded-xl p-5 flex flex-col gap-3"
        style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-xs font-bold uppercase tracking-widest"
          style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}>
          Vault Utilization · Live
        </span>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Current</span>
            <span className="font-bold" style={{ color: d.utilization > 80 ? '#FF6464' : '#00E38B', fontFamily: 'Inter' }}>
              {d.utilizationFmt}
            </span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, d.utilization)}%`,
                background: d.utilization > 80 ? '#FF6464' : d.utilization > 50 ? '#FFB400' : '#00E38B',
              }} />
          </div>
          <div className="flex justify-between text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter', opacity: 0.6 }}>
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex justify-between text-sm">
            <span style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Outstanding Exposure</span>
            <span className="font-bold" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>
              {d.totalExposure > 0 ? '$' + d.totalExposure.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '—'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>USDC Reserve</span>
            <span className="font-bold" style={{ color: '#568DFF', fontFamily: 'Inter' }}>{d.usdcReserveFmt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const PoolAnalyticsSection = () => {
  const [selectedKey, setSelectedKey] = useState<PairKey>('WETH/USDC');
  const [dropOpen, setDropOpen] = useState(false);
  const pair = PAIRS[selectedKey];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-black text-lg font-headline" style={{ color: '#E5E2E3', letterSpacing: '-0.01em' }}>
            Per-Pool Analytics
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
            Live vault health from chain · Historical volume and fees from subgraph
          </p>
        </div>

        {/* Pool selector */}
        <div className="relative">
          <button onClick={() => setDropOpen(v => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:brightness-110"
            style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.08)', minWidth: 180 }}>
            <PoolDot symbol={pair.token0} />
            <PoolDot symbol={pair.token1} />
            <span className="flex-1 text-left text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: '#E5E2E3' }}>
              {selectedKey}
            </span>
            <span className="material-symbols-outlined flex-shrink-0"
              style={{ color: '#B9CBBC', fontSize: 18, transform: dropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
              expand_more
            </span>
          </button>
          {dropOpen && (
            <div className="absolute right-0 mt-2 rounded-xl overflow-hidden z-50"
              style={{ width: '100%', minWidth: 180, background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
              {ALL_PAIRS.map(key => (
                <button key={key} onClick={() => { setSelectedKey(key); setDropOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors"
                  style={{ background: key === selectedKey ? 'rgba(0,255,157,0.08)' : 'transparent' }}
                  onMouseEnter={e => { if (key !== selectedKey) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (key !== selectedKey) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                  <PoolDot symbol={PAIRS[key].token0} />
                  <PoolDot symbol={PAIRS[key].token1} />
                  <span className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: key === selectedKey ? '#00FF9D' : '#E5E2E3' }}>
                    {key}
                  </span>
                  {key === selectedKey && <span className="material-symbols-outlined ml-auto" style={{ color: '#00FF9D', fontSize: 16 }}>check</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <PoolSection pairKey={selectedKey} />
    </div>
  );
};

export default PoolAnalyticsSection;
