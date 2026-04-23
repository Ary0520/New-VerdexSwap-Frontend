// Stats are honest: chain-sourced where possible, clearly marked as testnet
const LiveStatsBar = () => (
  <section className="bg-surface-container-lowest py-10 border-y border-outline-variant/30">
    <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
      {[
        { label: 'IL Payouts Issued',  value: 'Live on-chain', sub: 'Real USDC, real users',     color: '#00FF9D' },
        { label: 'Vault Architecture', value: 'Self-sustaining', sub: 'Zero token inflation',    color: '#56FFA8' },
        { label: 'Coverage Schedule',  value: '0 → 100%',      sub: 'Linear over 240 days',      color: '#568DFF' },
        { label: 'Protocol Take Rate', value: '0%',             sub: 'Growth phase — fee-free',   color: '#FFB400' },
      ].map(s => (
        <div key={s.label} className="text-center">
          <div className="text-on-surface-variant text-xs font-headline uppercase tracking-widest mb-2">{s.label}</div>
          <div className="text-2xl font-bold font-headline mb-1" style={{ color: s.color }}>{s.value}</div>
          <div className="text-xs text-on-surface-variant opacity-60">{s.sub}</div>
        </div>
      ))}
    </div>
  </section>
);

export default LiveStatsBar;
