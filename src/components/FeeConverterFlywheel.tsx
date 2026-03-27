

const FeeConverterFlywheel = () => {
  return (
    <section className="py-24 px-8 bg-surface-container-lowest">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-headline font-black mb-16">The Verdex Sustainable Engine</h2>
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary-container/20 blur-[150px] rounded-full"></div>
          <div className="relative bg-surface-container-low p-16 rounded-full border-2 border-outline-variant/30 monolith-shadow">
            <div className="flex flex-col items-center gap-8">
              <div className="text-primary-container text-6xl material-symbols-outlined" data-icon="autorenew">autorenew</div>
              <div className="max-w-md">
                <h4 className="text-2xl font-headline font-black mb-4">Fee Conversion Hub</h4>
                <p className="text-on-surface-variant text-sm">Fees from every swap are automatically converted to USDC. 80% goes to the IL Shield Vault, and 20% goes to Protocol Treasury. No token inflation, just real revenue.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeeConverterFlywheel;
