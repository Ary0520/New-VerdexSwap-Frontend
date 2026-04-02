import { useState } from 'react';
import { LP_POSITIONS } from './portfolioData';

const TokenIcon = ({ icon, color, symbol, size = 22 }: { icon: string; color: string; symbol: string; size?: number }) => {
  if (icon) return <img src={icon} alt={symbol} className="rounded-full flex-shrink-0" style={{ width: size, height: size }} />;
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.36, fontFamily: 'Space Grotesk' }}>
      {symbol.slice(0, 2)}
    </div>
  );
};

const CoverageBar = ({ value, max }: { value: number; max: number }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)', minWidth: 60 }}>
      <div
        className="h-full rounded-full"
        style={{
          width: `${(value / max) * 100}%`,
          background: value >= 100 ? '#00FF9D' : value >= 50 ? '#56FFA8' : '#568DFF',
          transition: 'width 0.3s',
        }}
      />
    </div>
    <span className="text-xs font-bold flex-shrink-0" style={{ color: '#00E38B', fontFamily: 'Inter' }}>{value}%</span>
  </div>
);

const LpPositionsTable = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="mb-8">
      <h2 className="font-black text-lg font-headline mb-4" style={{ color: '#E5E2E3', letterSpacing: '-0.01em' }}>
        LP Positions
      </h2>
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Header */}
        <div
          className="grid items-center px-6 py-3 text-xs font-bold uppercase"
          style={{
            gridTemplateColumns: '1.8fr 110px 110px 110px 80px 160px 120px 40px',
            background: '#1C1B1C',
            color: '#B9CBBC',
            fontFamily: 'Inter',
            letterSpacing: '0.08em',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span>Pool</span>
          <span>Entry Value</span>
          <span>Current Value</span>
          <span>IL</span>
          <span>Days</span>
          <span>Coverage</span>
          <span>Est. Payout</span>
          <span />
        </div>

        {LP_POSITIONS.map((pos, i) => {
          const isExpanded = expandedId === pos.id;
          const isLast = i === LP_POSITIONS.length - 1;
          return (
            <div
              key={pos.id}
              style={{
                background: isExpanded ? 'rgba(0,255,157,0.02)' : i % 2 === 0 ? '#131314' : 'rgba(255,255,255,0.01)',
                borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)',
              }}
            >
              {/* Main row */}
              <div
                className="grid items-center px-6 py-4 cursor-pointer"
                style={{ gridTemplateColumns: '1.8fr 110px 110px 110px 80px 160px 120px 40px' }}
                onClick={() => setExpandedId(isExpanded ? null : pos.id)}
              >
                {/* Pool */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <TokenIcon icon={pos.token0.icon} color={pos.token0.color} symbol={pos.token0.symbol} />
                    <TokenIcon icon={pos.token1.icon} color={pos.token1.color} symbol={pos.token1.symbol} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: '#E5E2E3' }}>{pos.pool}</span>
                    <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{pos.tier}</span>
                  </div>
                </div>

                <span className="text-sm" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{pos.entryValue}</span>
                <span className="text-sm font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>{pos.currentValue}</span>

                {/* IL */}
                <div className="flex flex-col">
                  <span className="text-sm font-bold" style={{ color: pos.ilNegative ? '#FF6464' : '#00E38B', fontFamily: 'Inter' }}>{pos.ilDollar}</span>
                  <span className="text-xs" style={{ color: pos.ilNegative ? '#FF6464' : '#00E38B', fontFamily: 'Inter', opacity: 0.8 }}>{pos.ilPercent}</span>
                </div>

                <span className="text-sm" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{pos.daysInPool}d</span>

                <CoverageBar value={pos.coveragePercent} max={pos.coverageMax} />

                <span className="text-sm font-bold" style={{ color: '#00E38B', fontFamily: 'Inter' }}>{pos.estPayout}</span>

                {/* Expand chevron */}
                <div className="flex items-center justify-end">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: '#B9CBBC', fontSize: 18, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                  >
                    expand_more
                  </span>
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div
                  className="px-6 pb-5 grid grid-cols-2 md:grid-cols-4 gap-4"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                >
                  {[
                    { label: 'Entry Timestamp', value: pos.entryTimestamp },
                    { label: 'Entry TWAP Price', value: pos.entryTwap },
                    { label: 'Current TWAP Price', value: pos.currentTwap },
                    { label: 'Days Until Full Coverage', value: `${Math.max(0, 240 - pos.daysInPool)}d remaining` },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg p-3 flex flex-col gap-1"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{item.label}</span>
                      <span className="text-sm font-bold" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>{item.value}</span>
                    </div>
                  ))}
                  {/* Coverage progress bar full width */}
                  <div className="col-span-2 md:col-span-4 rounded-lg p-3 flex flex-col gap-2"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex justify-between">
                      <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Coverage Schedule (0 → 240 days → 100%)</span>
                      <span className="text-xs font-bold" style={{ color: '#00E38B', fontFamily: 'Inter' }}>{pos.coveragePercent}% unlocked</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full" style={{
                        width: `${(pos.daysInPool / 240) * 100}%`,
                        background: 'linear-gradient(to right, #568DFF, #00FF9D)',
                      }} />
                    </div>
                    <div className="flex justify-between text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
                      <span>Day 0</span><span>Day 60</span><span>Day 120</span><span>Day 180</span><span>Day 240</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LpPositionsTable;
