

const LiveStatsBar = () => {
  return (
    <section className="bg-surface-container-lowest py-10 border-y border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="text-center">
          <div className="text-on-surface-variant text-xs font-headline uppercase tracking-widest mb-2">Total Volume</div>
          <div className="text-3xl font-bold font-headline text-primary">$1.42B</div>
        </div>
        <div className="text-center">
          <div className="text-on-surface-variant text-xs font-headline uppercase tracking-widest mb-2">TVL</div>
          <div className="text-3xl font-bold font-headline text-secondary">$284.5M</div>
        </div>
        <div className="text-center">
          <div className="text-on-surface-variant text-xs font-headline uppercase tracking-widest mb-2">IL Payouts</div>
          <div className="text-3xl font-bold font-headline text-primary-container">$12.8M</div>
        </div>
        <div className="text-center">
          <div className="text-on-surface-variant text-xs font-headline uppercase tracking-widest mb-2">Active Pools</div>
          <div className="text-3xl font-bold font-headline text-tertiary-fixed-dim">142</div>
        </div>
      </div>
    </section>
  );
};

export default LiveStatsBar;
