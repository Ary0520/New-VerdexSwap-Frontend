import { PROTOCOL_STATS } from './earnData';

const ProtocolStatsBar = () => (
  <div
    className="grid grid-cols-4 gap-px rounded-xl overflow-hidden mt-8"
    style={{ border: '1px solid rgba(255,255,255,0.06)' }}
  >
    {PROTOCOL_STATS.map((stat, i) => (
      <div
        key={stat.label}
        className="flex flex-col gap-1 px-6 py-4"
        style={{ background: '#1C1B1C' }}
      >
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}
        >
          {stat.label}
        </span>
        <span
          className="text-xl font-black font-headline"
          style={{
            color: i === 0 ? '#00FF9D' : i === 1 ? '#568DFF' : '#E5E2E3',
          }}
        >
          {stat.value}
        </span>
      </div>
    ))}
  </div>
);

export default ProtocolStatsBar;
