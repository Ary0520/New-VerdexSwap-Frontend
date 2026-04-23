const TwapOracleSecurity = () => (
  <section className="py-24 px-8">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
      <div>
        <h3 className="text-3xl font-headline font-black mb-6">Manipulation-resistant pricing.</h3>
        <p className="text-on-surface-variant mb-8">VerdexSwap uses Time-Weighted Average Pricing for all IL calculations and fee conversions. A single block cannot manipulate your payout. Flash loan attacks that exploit spot prices don't work here.</p>
        <ul className="space-y-4">
          {[
            'Price averaged over a configurable time window',
            'Resistant to single-block volatility and flash loans',
            'Staleness protection — oracle must be updated regularly',
            'Used for IL calculation, fee conversion, and payout sizing',
          ].map(item => (
            <li key={item} className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container">check_circle</span>
              <span className="text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="glass-panel p-10 rounded-xl border-secondary-container/20">
        <h3 className="text-2xl font-headline font-bold mb-8">Protocol Architecture</h3>
        <div className="space-y-4">
          {[
            { label: 'Smart Contracts',       value: 'Deployed on Arbitrum Sepolia', color: '#00FF9D' },
            { label: 'Emergency Pause',       value: 'Circuit breaker active',       color: '#56FFA8' },
            { label: 'Fee Transparency',      value: 'On-chain, immutable split',    color: '#568DFF' },
            { label: 'Protocol Take Rate',    value: '0% — growth phase',            color: '#FFB400' },
          ].map(row => (
            <div key={row.label} className="flex justify-between items-center bg-surface-container-high/40 p-4 rounded">
              <span className="text-sm">{row.label}</span>
              <span className="font-headline font-bold text-sm" style={{ color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-on-surface-variant mt-6 opacity-60">All contract addresses are public and verifiable on Arbiscan. Audit in progress.</p>
      </div>
    </div>
  </section>
);

export default TwapOracleSecurity;
