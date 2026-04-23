const FeeConverterFlywheel = () => (
  <section className="py-24 px-8 bg-surface-container-lowest">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl font-headline font-black mb-6">The flywheel that funds itself.</h2>
      <p className="text-on-surface-variant mb-16 max-w-2xl mx-auto">Most protocols rely on token emissions to incentivize liquidity. VerdexSwap uses a closed-loop system where swap fees directly fund the insurance vault — no external subsidy required.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {[
          { icon: 'swap_horiz',       color: '#568DFF', title: 'Swap happens',         body: 'A trader executes a swap. The fee is split: a portion goes to LPs, a portion routes to the IL Vault.' },
          { icon: 'currency_exchange', color: '#00FF9D', title: 'Fees convert to USDC', body: 'The FeeConverter contract converts accumulated fee tokens to USDC using TWAP pricing. Anyone can trigger this and earn a small bonus.' },
          { icon: 'verified_user',    color: '#FFB400', title: 'Vault pays LPs',        body: 'When an LP withdraws, the vault calculates their IL and issues a USDC payout. The cycle continues.' },
        ].map(s => (
          <div key={s.title} className="bg-surface-container-low p-8 rounded-xl">
            <span className="material-symbols-outlined text-3xl mb-4 block" style={{ color: s.color }}>{s.icon}</span>
            <h4 className="font-headline font-bold text-lg mb-3">{s.title}</h4>
            <p className="text-on-surface-variant text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeeConverterFlywheel;
