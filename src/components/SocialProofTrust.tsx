const SocialProofTrust = () => (
  <section className="py-16 px-8 bg-surface-container-lowest">
    <div className="max-w-7xl mx-auto">
      <p className="text-center text-xs font-headline uppercase tracking-widest text-on-surface-variant mb-10">Built in public. Verifiable on-chain.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center">
        {[
          { icon: 'search',   label: 'Arbiscan',       sub: 'All contracts verified' },
          { icon: 'code',     label: 'Open Source',    sub: 'GitHub repository public' },
          { icon: 'verified', label: 'Audit Pending',  sub: 'Testnet phase — pre-audit' },
          { icon: 'group',    label: 'Community',      sub: 'Discord & governance' },
        ].map(item => (
          <div key={item.label} className="flex flex-col items-center gap-2 text-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            <span className="font-headline font-bold text-sm">{item.label}</span>
            <span className="text-xs text-on-surface-variant">{item.sub}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProofTrust;
