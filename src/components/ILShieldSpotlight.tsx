const ILShieldSpotlight = () => (
  <section id="il-shield" className="py-24 px-8 bg-surface-container-lowest">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
        <div>
          <h2 className="text-5xl font-headline font-black mb-8 leading-tight">
            The IL Shield.<br />
            <span className="text-primary-container">Not a promise. A contract.</span>
          </h2>
          <p className="text-on-surface-variant mb-10 leading-relaxed">
            The IL Shield is a deployed smart contract that automatically calculates your impermanent loss at withdrawal and issues a USDC payout — proportional to how long you have been in the pool. No forms. No governance votes. No waiting.
          </p>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="bg-primary-container/10 p-4 rounded-lg h-fit">
                <span className="material-symbols-outlined text-primary-container">account_balance</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-lg mb-1">Funded by swap fees, not tokens</h4>
                <p className="text-on-surface-variant text-sm">A fixed percentage of every swap routes into the IL Vault as USDC. The vault grows with protocol usage — no inflation, no dilution.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="bg-secondary-container/10 p-4 rounded-lg h-fit">
                <span className="material-symbols-outlined text-secondary-container">query_stats</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-lg mb-1">Coverage scales with commitment</h4>
                <p className="text-on-surface-variant text-sm">The longer you provide liquidity, the more coverage you earn. Long-term LPs get full protection. Short-term speculators get none. Incentives aligned.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="bg-tertiary-fixed-dim/10 p-4 rounded-lg h-fit">
                <span className="material-symbols-outlined text-tertiary-fixed-dim">verified_user</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-lg mb-1">Automatic payout at withdrawal</h4>
                <p className="text-on-surface-variant text-sm">When you remove liquidity, the router calculates your IL on-chain using TWAP prices and issues the payout in the same transaction. Zero manual steps.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="glass-panel p-8 rounded-xl monolith-shadow border-outline-variant/20">
          <h3 className="font-headline font-bold mb-1 text-primary-container">Coverage Schedule</h3>
          <p className="text-on-surface-variant text-xs mb-6">Based on days in pool at time of withdrawal</p>
          <div className="space-y-3">
            {[
              { range: '0 to 7 Days',  pct: '0%',    note: 'Minimum commitment period',  hi: false },
              { range: '30 Days',      pct: '12.5%', note: 'Coverage begins accruing',    hi: false },
              { range: '90 Days',      pct: '37.5%', note: 'Meaningful protection',       hi: false },
              { range: '180 Days',     pct: '75%',   note: 'Strong coverage',             hi: false },
              { range: '240+ Days',    pct: '100%',  note: 'Full IL Shield activated',    hi: true  },
            ].map(row => (
              <div key={row.range}
                className={`flex items-center justify-between p-4 rounded ${row.hi ? 'bg-primary-container/10 border border-primary-container/30' : 'bg-surface-container-high/40'}`}>
                <div>
                  <span className={`font-bold text-sm ${row.hi ? 'text-primary-container' : ''}`}>{row.range}</span>
                  <div className="text-xs text-on-surface-variant mt-0.5">{row.note}</div>
                </div>
                <span className={`font-headline font-bold ${row.hi ? 'text-primary-container' : 'text-secondary'}`}>{row.pct}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-on-surface-variant mt-4 opacity-60">Coverage = (daysInPool / 240) x maxCoverageBps. Verifiable on-chain.</p>
        </div>
      </div>
    </div>
  </section>
);

export default ILShieldSpotlight;
