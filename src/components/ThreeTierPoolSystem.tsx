

const ThreeTierPoolSystem = () => {
  return (
    <section className="py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-headline font-black mb-4">Designed for Every Asset Class</h2>
          <p className="text-on-surface-variant">Custom fee structures and coverage limits optimized for risk-adjusted returns.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Stable */}
          <div className="bg-surface-container-low p-10 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <span className="material-symbols-outlined text-6xl" data-icon="toll">toll</span>
            </div>
            <div className="text-xs font-headline font-bold text-secondary tracking-widest uppercase mb-4">Tier 1</div>
            <h3 className="text-2xl font-headline font-bold mb-6">Stable Pools</h3>
            <div className="space-y-4 mb-10">
              <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                <span className="text-on-surface-variant">Swap Fee</span>
                <span className="font-bold">0.01%</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                <span className="text-on-surface-variant">IL Shield</span>
                <span className="font-bold">None Needed</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                <span className="text-on-surface-variant">Concentration</span>
                <span className="font-bold">Infinite</span>
              </div>
            </div>
            <button className="w-full py-3 border border-outline-variant rounded hover:bg-surface-container-highest transition-all">View Assets</button>
          </div>
          
          {/* Blue Chip */}
          <div className="bg-surface-container-low p-10 rounded-xl relative overflow-hidden border-2 border-primary-container group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
              <span className="material-symbols-outlined text-primary-container text-6xl" data-icon="diamond">diamond</span>
            </div>
            <div className="text-xs font-headline font-bold text-primary-container tracking-widest uppercase mb-4">Tier 2 - Recommended</div>
            <h3 className="text-2xl font-headline font-bold mb-6">Blue Chip Pools</h3>
            <div className="space-y-4 mb-10">
              <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                <span className="text-on-surface-variant">Swap Fee</span>
                <span className="font-bold">0.30%</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                <span className="text-on-surface-variant">IL Shield</span>
                <span className="font-bold text-primary-container">Active</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                <span className="text-on-surface-variant">Coverage Cap</span>
                <span className="font-bold">$2.5M</span>
              </div>
            </div>
            <button className="w-full py-3 bg-primary-container text-on-primary-container font-bold rounded hover:shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-all">Stake Now</button>
          </div>
          
          {/* Volatile */}
          <div className="bg-surface-container-low p-10 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <span className="material-symbols-outlined text-6xl" data-icon="bolt">bolt</span>
            </div>
            <div className="text-xs font-headline font-bold text-tertiary-fixed-dim tracking-widest uppercase mb-4">Tier 3</div>
            <h3 className="text-2xl font-headline font-bold mb-6">Volatile Pools</h3>
            <div className="space-y-4 mb-10">
              <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                <span className="text-on-surface-variant">Swap Fee</span>
                <span className="font-bold">1.00%</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                <span className="text-on-surface-variant">IL Shield</span>
                <span className="font-bold text-tertiary-fixed-dim">Dynamic</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                <span className="text-on-surface-variant">Coverage Cap</span>
                <span className="font-bold">$500K</span>
              </div>
            </div>
            <button className="w-full py-3 border border-outline-variant rounded hover:bg-surface-container-highest transition-all">Explore Risks</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThreeTierPoolSystem;
