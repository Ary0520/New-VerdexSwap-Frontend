const ThreeTierPoolSystem = () => (
  <section id="pools" className="py-24 px-8">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-headline font-black mb-4">One protocol. Three risk profiles.</h2>
        <p className="text-on-surface-variant max-w-2xl mx-auto">Fee tiers and IL Shield coverage are calibrated per asset class. Stable pairs need no insurance. Blue chip pairs get full protection. Volatile pairs get dynamic coverage with higher fee compensation.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-surface-container-low p-10 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
            <span className="material-symbols-outlined text-6xl">toll</span>
          </div>
          <div className="text-xs font-headline font-bold text-secondary tracking-widest uppercase mb-4">Tier 1</div>
          <h3 className="text-2xl font-headline font-bold mb-2">Stable Pools</h3>
          <p className="text-on-surface-variant text-sm mb-6">USDC/DAI and similar. Price divergence is minimal, so IL Shield is unnecessary. Ultra-low fees maximize LP yield.</p>
          <div className="space-y-4 mb-10">
            <div className="flex justify-between border-b border-outline-variant/30 pb-2">
              <span className="text-on-surface-variant">Swap Fee</span>
              <span className="font-bold">0.10%</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/30 pb-2">
              <span className="text-on-surface-variant">IL Shield</span>
              <span className="font-bold">Not Required</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/30 pb-2">
              <span className="text-on-surface-variant">Best For</span>
              <span className="font-bold">Stable yield</span>
            </div>
          </div>
          <a href="/pools" className="block w-full py-3 text-center border border-outline-variant rounded hover:bg-surface-container-highest transition-all font-bold">View Pools</a>
        </div>

        <div className="bg-surface-container-low p-10 rounded-xl relative overflow-hidden border-2 border-primary-container group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <span className="material-symbols-outlined text-primary-container text-6xl">diamond</span>
          </div>
          <div className="text-xs font-headline font-bold text-primary-container tracking-widest uppercase mb-4">Tier 2 — Most Popular</div>
          <h3 className="text-2xl font-headline font-bold mb-2">Blue Chip Pools</h3>
          <p className="text-on-surface-variant text-sm mb-6">WETH/USDC, WBTC/USDC. High-quality assets with real price volatility. Full IL Shield active. The flagship experience.</p>
          <div className="space-y-4 mb-10">
            <div className="flex justify-between border-b border-outline-variant/30 pb-2">
              <span className="text-on-surface-variant">Swap Fee</span>
              <span className="font-bold">0.35%</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/30 pb-2">
              <span className="text-on-surface-variant">IL Shield</span>
              <span className="font-bold text-primary-container">Active</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/30 pb-2">
              <span className="text-on-surface-variant">Best For</span>
              <span className="font-bold">Protected yield</span>
            </div>
          </div>
          <a href="/pools" className="block w-full py-3 text-center bg-primary-container text-on-primary-container font-bold rounded hover:shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-all">Add Liquidity</a>
        </div>

        <div className="bg-surface-container-low p-10 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
            <span className="material-symbols-outlined text-6xl">bolt</span>
          </div>
          <div className="text-xs font-headline font-bold text-tertiary-fixed-dim tracking-widest uppercase mb-4">Tier 3</div>
          <h3 className="text-2xl font-headline font-bold mb-2">Volatile Pools</h3>
          <p className="text-on-surface-variant text-sm mb-6">ARB and emerging assets. Higher fees compensate for higher risk. Dynamic IL Shield coverage scales with vault capacity.</p>
          <div className="space-y-4 mb-10">
            <div className="flex justify-between border-b border-outline-variant/30 pb-2">
              <span className="text-on-surface-variant">Swap Fee</span>
              <span className="font-bold">0.55%</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/30 pb-2">
              <span className="text-on-surface-variant">IL Shield</span>
              <span className="font-bold text-tertiary-fixed-dim">Dynamic</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/30 pb-2">
              <span className="text-on-surface-variant">Best For</span>
              <span className="font-bold">High-yield seekers</span>
            </div>
          </div>
          <a href="/pools" className="block w-full py-3 text-center border border-outline-variant rounded hover:bg-surface-container-highest transition-all font-bold">Explore Pools</a>
        </div>
      </div>
    </div>
  </section>
);

export default ThreeTierPoolSystem;
