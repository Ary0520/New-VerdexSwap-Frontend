const faqs = [
  {
    q: 'Is this real money?',
    a: 'No. VerdexSwap is currently live on Arbitrum Sepolia — a testnet. All tokens are test tokens with no real-world value. This lets you experience the full protocol with zero financial risk before mainnet launch.',
  },
  {
    q: 'How is the IL Shield actually funded?',
    a: 'Every swap generates fees. A portion of those fees (the vaultFeeBps) is held in the pair contract as raw token balances. The FeeConverter contract converts these to USDC and deposits them into the IL Vault. No token minting. No external subsidy. The vault grows proportionally to trading volume.',
  },
  {
    q: 'What happens if the vault runs out of USDC?',
    a: 'The vault has a circuit breaker. If utilization exceeds the configured threshold, payouts are paused until the vault rebalances. This protects stakers from catastrophic drawdown. The circuit breaker threshold is on-chain and publicly readable.',
  },
  {
    q: 'Why does coverage start at 0% for the first 7 days?',
    a: 'To prevent mercenary liquidity — LPs who add liquidity, collect fees, and immediately withdraw before any IL accumulates. The 7-day minimum ensures the vault only compensates genuine liquidity providers.',
  },
  {
    q: 'Can I lose money as a vault staker?',
    a: 'In extreme scenarios where IL payouts exceed vault reserves, staker capital absorbs the shortfall. This is the risk stakers are compensated for. The circuit breaker, cooldown period, and pool cap limits are designed to make this scenario unlikely.',
  },
  {
    q: 'When is mainnet?',
    a: 'We are in active testnet. Mainnet launch follows a security audit and community review period. Follow our channels for updates.',
  },
];

const FAQ = () => (
  <section className="py-24 px-8">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-4xl font-headline font-black mb-4 text-center">Honest answers.</h2>
      <p className="text-on-surface-variant text-center mb-12">No marketing fluff. Just how it actually works.</p>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="group bg-surface-container-low p-6 rounded-lg transition-all">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h4 className="font-headline font-bold pr-4">{faq.q}</h4>
              <span className="material-symbols-outlined transition-transform group-open:rotate-180 flex-shrink-0">expand_more</span>
            </summary>
            <p className="mt-4 text-on-surface-variant text-sm leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default FAQ;
