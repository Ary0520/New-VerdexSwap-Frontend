

const ProblemSection = () => {
  return (
    <section className="py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl font-headline font-black mb-4">Old DeFi is Broken.</h2>
          <p className="text-on-surface-variant max-w-2xl">Traditional AMMs bleed value from LPs through inefficient designs. VerdexSwap fixes the fundamental flaws of on-chain liquidity.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface-container-low p-8 border-t-2 border-error">
            <span className="material-symbols-outlined text-error text-4xl mb-6" data-icon="trending_down">trending_down</span>
            <h3 className="text-xl font-headline font-bold mb-4">Impermanent Loss</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">LPs lose billions annually to price divergence. Standard AMMs offer zero protection, leaving yield farmers at the mercy of volatility.</p>
          </div>
          <div className="bg-surface-container-low p-8 border-t-2 border-tertiary-fixed-dim">
            <span className="material-symbols-outlined text-tertiary-fixed-dim text-4xl mb-6" data-icon="lock_open">lock_open</span>
            <h3 className="text-xl font-headline font-bold mb-4">Sandwich Attacks</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">MEV bots frontrun and backrun trades, extracting value directly from the user's slippage. Most DEXes ignore this toxicity.</p>
          </div>
          <div className="bg-surface-container-low p-8 border-t-2 border-secondary-container">
            <span className="material-symbols-outlined text-secondary-container text-4xl mb-6" data-icon="warning">warning</span>
            <h3 className="text-xl font-headline font-bold mb-4">Fake IL Protection</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Competitors use inflationary token minting to cover IL, which just devalues your assets. It's a house of cards.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
