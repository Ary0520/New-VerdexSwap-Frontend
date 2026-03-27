

const HowItWorks = () => {
  return (
    <section className="py-24 px-8 bg-surface-container-lowest">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-headline font-black mb-12 text-center">Seamless Execution</h2>
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-surface-container-low p-1 rounded-lg">
            <button className="px-8 py-2 bg-primary-container text-on-primary-container font-bold rounded-md">For Traders</button>
            <button className="px-8 py-2 text-on-surface-variant hover:text-on-surface">For Liquidity Providers</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-5xl font-headline font-black text-outline-variant mb-6">01</div>
            <h4 className="font-headline font-bold text-xl mb-4">Connect Wallet</h4>
            <p className="text-on-surface-variant text-sm">Join the Arbitrum Sepolia network and link your preferred Web3 wallet.</p>
          </div>
          <div>
            <div className="text-5xl font-headline font-black text-outline-variant mb-6">02</div>
            <h4 className="font-headline font-bold text-xl mb-4">Analyze Yields</h4>
            <p className="text-on-surface-variant text-sm">Select from our vetted pools with transparent APY and IL coverage projections.</p>
          </div>
          <div>
            <div className="text-5xl font-headline font-black text-outline-variant mb-6">03</div>
            <h4 className="font-headline font-bold text-xl mb-4">Swap &amp; Stake</h4>
            <p className="text-on-surface-variant text-sm">Execute lightning-fast swaps or provide liquidity to start earning the Verdex Flywheel rewards.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
