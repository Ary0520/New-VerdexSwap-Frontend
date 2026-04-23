const ProtocolFeeTransparency = () => (
  <section className="py-24 px-8 text-center bg-surface-container-lowest">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-headline font-black mb-6">We don't extract. We build.</h2>
      <p className="text-on-surface-variant mb-4">During the testnet phase, the protocol take rate is set to <span className="text-primary-container font-black">0%</span>. Every fee collected goes to LPs and the IL Vault. No skim, no hidden extraction.</p>
      <p className="text-on-surface-variant mb-8 text-sm">When a protocol fee is eventually introduced, it will be set transparently via on-chain governance — not a unilateral decision. The current split is verifiable in the Factory contract's <code className="text-primary-container">tierConfig</code> mapping.</p>
      <div className="inline-flex items-center gap-2 px-6 py-2 border border-primary-container/30 text-primary-container rounded-full text-sm font-bold uppercase tracking-widest">
        <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
        Protocol Fee: 0% — Testnet Phase
      </div>
    </div>
  </section>
);

export default ProtocolFeeTransparency;
