

const IlVaultStaking = () => {
  return (
    <section className="py-24 px-8">
      <div className="max-w-7xl mx-auto glass-panel p-12 rounded-2xl border-primary-container/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-headline font-black mb-6">Earn Yield by Protecting Others.</h2>
            <p className="text-on-surface-variant mb-10 text-lg">Stake your USDC in the IL Vault to underwrite the insurance system. Earn protocol fees while providing a critical service to the ecosystem.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="bg-primary-container p-2 rounded-full text-on-primary"><span className="material-symbols-outlined text-sm" data-icon="star">star</span></span>
                <span>Earn 15-22% APY in USDC</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-primary-container p-2 rounded-full text-on-primary"><span className="material-symbols-outlined text-sm" data-icon="star">star</span></span>
                <span>Zero exposure to volatile market pairs</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-primary-container p-2 rounded-full text-on-primary"><span className="material-symbols-outlined text-sm" data-icon="star">star</span></span>
                <span>First-loss protection via treasury buffer</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/40">
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="text-xs font-headline uppercase tracking-widest text-on-surface-variant">Staked TVL</div>
                <div className="text-3xl font-black font-headline text-primary">$42.4M</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-headline uppercase tracking-widest text-on-surface-variant">Active APY</div>
                <div className="text-3xl font-black font-headline text-primary-container">18.4%</div>
              </div>
            </div>
            <div className="p-4 bg-error-container/20 border border-error/30 rounded mb-8">
              <div className="flex gap-3 items-center text-error">
                <span className="material-symbols-outlined" data-icon="info">info</span>
                <span className="text-sm font-bold">14-Day Cooldown Notice</span>
              </div>
              <p className="text-xs mt-2 text-on-surface-variant">Withdrawals from the IL Vault require a 14-day unstaking period to maintain coverage stability for LPs.</p>
            </div>
            <button className="w-full py-4 bg-primary text-on-primary font-bold rounded-md hover:bg-primary-container transition-all">Go to Vault</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IlVaultStaking;
