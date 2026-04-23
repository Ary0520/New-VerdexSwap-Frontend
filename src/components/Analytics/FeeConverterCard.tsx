import { useState } from 'react';
import { PAIRS, type PairKey } from '../../lib/contracts';
import { useFeeConverterAnalytics } from '../../hooks/useAnalytics';

const ALL_PAIRS = Object.keys(PAIRS) as PairKey[];
function fmtHash(h: string) { return h.length > 14 ? h.slice(0, 8) + '…' + h.slice(-6) : h; }

function PairFeeConverter({ pairKey }: { pairKey: PairKey }) {
  const d = useFeeConverterAnalytics(pairKey);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total USDC Converted', value: d.totalUsdcConverted, color: '#00FF9D', icon: 'currency_exchange' },
          { label: 'Total Caller Bonuses',  value: d.totalCallerBonus,   color: '#56FFA8', icon: 'toll'             },
          { label: 'Conversions Indexed',   value: String(d.conversionCount), color: '#E5E2E3', icon: 'repeat'      },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl p-4 flex flex-col gap-2"
            style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs uppercase tracking-widest"
                  style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.07em', fontSize: 9 }}>
                  {stat.label}
                </span>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: d.hasData ? '#00FF9D' : '#3B4A3F' }} />
              </div>
              <span className="material-symbols-outlined"
                style={{ color: stat.color, fontSize: 16, opacity: 0.7, fontVariationSettings: "'FILL' 1" }}>
                {stat.icon}
              </span>
            </div>
            <span className="font-black font-headline text-lg" style={{ color: stat.color }}>
              {d.hasData ? stat.value : '—'}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-4 py-3" style={{ background: '#1C1B1C', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-bold uppercase tracking-widest"
            style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}>
            Recent Conversions
          </span>
        </div>
        {d.loading ? (
          <div className="flex items-center justify-center py-8 gap-2" style={{ background: '#131314' }}>
            <span className="material-symbols-outlined animate-spin" style={{ color: '#B9CBBC', fontSize: 18 }}>progress_activity</span>
            <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Loading…</span>
          </div>
        ) : d.conversions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2" style={{ background: '#131314' }}>
            <span className="material-symbols-outlined" style={{ color: '#3B4A3F', fontSize: 24 }}>currency_exchange</span>
            <span className="text-xs" style={{ color: '#3B4A3F', fontFamily: 'Inter' }}>No conversions yet · Subgraph syncing</span>
          </div>
        ) : d.conversions.map((c, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3"
            style={{ background: i % 2 === 0 ? '#131314' : 'rgba(255,255,255,0.01)', borderBottom: i < d.conversions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined"
                style={{ color: '#00E38B', fontSize: 16, fontVariationSettings: "'FILL' 1" }}>
                currency_exchange
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-bold" style={{ color: '#E5E2E3', fontFamily: 'Space Grotesk' }}>{c.usdcOut}</span>
                <span className="text-xs" style={{ color: '#56FFA8', fontFamily: 'Inter' }}>+{c.callerBonus} bonus</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{c.time}</span>
              <a href={`https://sepolia.arbiscan.io/tx/${c.txHash}`} target="_blank" rel="noopener noreferrer"
                className="text-xs font-mono hover:text-[#568DFF]"
                style={{ color: '#B9CBBC', textDecoration: 'none' }}>
                {fmtHash(c.txHash)}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const FeeConverterCard = () => {
  const [selectedKey, setSelectedKey] = useState<PairKey>('WETH/USDC');
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-black text-lg font-headline" style={{ color: '#E5E2E3', letterSpacing: '-0.01em' }}>
          FeeConverter Activity
        </h2>
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: '#1C1B1C' }}>
          {ALL_PAIRS.map(key => (
            <button key={key} onClick={() => setSelectedKey(key)}
              className="px-3 py-1.5 rounded text-xs font-bold transition-all"
              style={{
                fontFamily: 'Space Grotesk',
                background: selectedKey === key ? 'rgba(0,255,157,0.15)' : 'transparent',
                color: selectedKey === key ? '#00FF9D' : '#B9CBBC',
                border: selectedKey === key ? '1px solid rgba(0,255,157,0.25)' : '1px solid transparent',
              }}>
              {key}
            </button>
          ))}
        </div>
      </div>
      <PairFeeConverter pairKey={selectedKey} />
    </div>
  );
};

export default FeeConverterCard;
