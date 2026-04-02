import { FEE_CONVERTER } from './analyticsData';

const FeeConverterCard = () => {
  const fc = FEE_CONVERTER;

  return (
    <div className="mb-8">
      <h2 className="font-black text-lg font-headline mb-5" style={{ color: '#E5E2E3', letterSpacing: '-0.01em' }}>
        FeeConverter Activity
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
        {/* Left: stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Last Conversion',    value: fc.lastConversion,              color: '#00E38B', icon: 'schedule'       },
            { label: 'Total USDC Converted', value: fc.totalConverted,            color: '#00FF9D', icon: 'currency_exchange' },
            { label: 'Next Eligible',      value: fc.nextEligible,                color: '#568DFF', icon: 'timer'          },
            { label: 'Total Conversions',  value: fc.conversionCount.toLocaleString(), color: '#E5E2E3', icon: 'repeat'    },
            { label: 'Avg per Conversion', value: fc.avgConversion,               color: '#56FFA8', icon: 'bar_chart'      },
            { label: '7d Converted',       value: fc.weeklyConverted,             color: '#FFB400', icon: 'calendar_today' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-4 flex flex-col gap-2"
              style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest" style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.07em', fontSize: 9 }}>
                  {stat.label}
                </span>
                <span className="material-symbols-outlined" style={{ color: stat.color, fontSize: 16, opacity: 0.7, fontVariationSettings: "'FILL' 1" }}>
                  {stat.icon}
                </span>
              </div>
              <span className="font-black font-headline text-lg" style={{ color: stat.color }}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Right: recent conversions */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-4 py-3" style={{ background: '#1C1B1C', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}>
              Recent Conversions
            </span>
          </div>
          {fc.recentConversions.map((c, i) => (
            <div key={i}
              className="flex items-center justify-between px-4 py-3"
              style={{
                background: i % 2 === 0 ? '#131314' : 'rgba(255,255,255,0.01)',
                borderBottom: i < fc.recentConversions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined" style={{ color: '#00E38B', fontSize: 16, fontVariationSettings: "'FILL' 1" }}>
                  currency_exchange
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold" style={{ color: '#E5E2E3', fontFamily: 'Space Grotesk' }}>{c.amount}</span>
                  <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{c.pool}</span>
                </div>
              </div>
              <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{c.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeeConverterCard;
