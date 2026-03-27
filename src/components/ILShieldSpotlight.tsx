

const ILShieldSpotlight = () => {
  return (
    <section className="py-24 px-8 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
          <div>
            <h2 className="text-5xl font-headline font-black mb-8 leading-tight">The IL Shield:<br /><span className="text-primary-container">True Impermanent Loss Insurance.</span></h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="bg-primary-container/10 p-4 rounded-lg h-fit"><span className="material-symbols-outlined text-primary-container" data-icon="account_balance">account_balance</span></div>
                <div>
                  <h4 className="font-headline font-bold text-lg mb-1">How it's funded</h4>
                  <p className="text-on-surface-variant">A dedicated percentage of every swap fee is channeled into the IL Vault, denominated in stable assets.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="bg-secondary-container/10 p-4 rounded-lg h-fit"><span className="material-symbols-outlined text-secondary-container" data-icon="query_stats">query_stats</span></div>
                <div>
                  <h4 className="font-headline font-bold text-lg mb-1">How coverage grows</h4>
                  <p className="text-on-surface-variant">Coverage starts at 25% and scales linearly based on your stake duration, reaching 100% at day 240.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="bg-tertiary-fixed-dim/10 p-4 rounded-lg h-fit"><span className="material-symbols-outlined text-tertiary-fixed-dim" data-icon="verified_user">verified_user</span></div>
                <div>
                  <h4 className="font-headline font-bold text-lg mb-1">How you get paid</h4>
                  <p className="text-on-surface-variant">Payouts are automated and distributed in the same asset that experienced the loss. No claim filing required.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="glass-panel p-8 rounded-xl monolith-shadow border-outline-variant/20">
            <h3 className="font-headline font-bold mb-6 text-primary-container">Coverage Schedule</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-container-high/40 rounded">
                <span className="text-on-surface-variant">0 - 7 Days</span>
                <span className="font-headline font-bold">0% Coverage</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-high/40 rounded">
                <span className="text-on-surface-variant">30 Days</span>
                <span className="font-headline font-bold text-secondary">25% Coverage</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-high/40 rounded">
                <span className="text-on-surface-variant">90 Days</span>
                <span className="font-headline font-bold text-secondary">50% Coverage</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-high/40 rounded">
                <span className="text-on-surface-variant">180 Days</span>
                <span className="font-headline font-bold text-secondary">85% Coverage</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-primary-container/10 border border-primary-container/30 rounded">
                <span className="text-primary-container font-bold">240+ Days</span>
                <span className="font-headline font-bold text-primary-container">100% Full Shield</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ILShieldSpotlight;
