const ProblemSection = () => (
  <section className="py-24 px-8">
    <div className="max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="text-4xl font-headline font-black mb-4">Every other DEX takes from you.<br />We give back.</h2>
        <p className="text-on-surface-variant max-w-2xl">Liquidity provision has always been a losing game for retail. You earn fees, but price divergence quietly erodes your position. VerdexSwap is the first protocol designed to fix this at the architecture level.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-surface-container-low p-8 border-t-2 border-error">
          <span className="material-symbols-outlined text-error text-4xl mb-6">trending_down</span>
          <h3 className="text-xl font-headline font-bold mb-4">Impermanent Loss</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">When token prices diverge, AMMs rebalance against you. LPs collectively lose billions annually. Every other DEX calls this "the cost of doing business." We call it a solvable problem.</p>
        </div>
        <div className="bg-surface-container-low p-8 border-t-2 border-tertiary-fixed-dim">
          <span className="material-symbols-outlined text-tertiary-fixed-dim text-4xl mb-6">lock_open</span>
          <h3 className="text-xl font-headline font-bold mb-4">Inflationary "Protection"</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">Competitors cover IL by minting their own governance tokens. That's not insurance — it's dilution. The payout devalues the very asset you're being compensated in. VerdexSwap pays in USDC, funded by real swap fees.</p>
        </div>
        <div className="bg-surface-container-low p-8 border-t-2 border-secondary-container">
          <span className="material-symbols-outlined text-secondary-container text-4xl mb-6">warning</span>
          <h3 className="text-xl font-headline font-bold mb-4">Opaque Fee Extraction</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">Most protocols quietly skim protocol fees from LP earnings without disclosure. VerdexSwap's fee split is on-chain, immutable, and publicly verifiable. Currently: 0% protocol take rate.</p>
        </div>
      </div>
    </div>
  </section>
);

export default ProblemSection;
