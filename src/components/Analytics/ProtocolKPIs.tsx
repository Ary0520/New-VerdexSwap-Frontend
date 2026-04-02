import { PROTOCOL_STATS } from './analyticsData';

const kpis = [
  { label: 'Total TVL',      value: PROTOCOL_STATS.tvl,         sub: PROTOCOL_STATS.tvlChange,  color: '#00FF9D', subPositive: true  },
  { label: '24h Volume',     value: PROTOCOL_STATS.vol24h,      sub: '↑ vs yesterday',          color: '#568DFF', subPositive: true  },
  { label: '7d Volume',      value: PROTOCOL_STATS.vol7d,       sub: null,                      color: '#568DFF', subPositive: true  },
  { label: 'Total Fees',     value: PROTOCOL_STATS.feesTotal,   sub: 'all time',                color: '#56FFA8', subPositive: true  },
  { label: 'IL Payouts',     value: PROTOCOL_STATS.ilPayouts,   sub: 'all time',                color: '#FFB400', subPositive: true  },
  { label: 'Active Pools',   value: String(PROTOCOL_STATS.activePools), sub: null,             color: '#E5E2E3', subPositive: true  },
  { label: 'Unique LPs',     value: PROTOCOL_STATS.uniqueLPs.toLocaleString(), sub: null,      color: '#E5E2E3', subPositive: true  },
];

const ProtocolKPIs = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
    {kpis.map((k) => (
      <div
        key={k.label}
        className="rounded-xl px-4 py-3 flex flex-col gap-1"
        style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="text-xs uppercase tracking-widest" style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.07em', fontSize: 9 }}>
          {k.label}
        </span>
        <span className="font-black font-headline text-lg leading-tight" style={{ color: k.color }}>
          {k.value}
        </span>
        {k.sub && (
          <span className="text-xs" style={{ color: k.subPositive ? '#00E38B' : '#FF6464', fontFamily: 'Inter', fontSize: 10 }}>
            {k.sub}
          </span>
        )}
      </div>
    ))}
  </div>
);

export default ProtocolKPIs;
