

const SocialProofTrust = () => {
  return (
    <section className="py-24 px-8 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center opacity-60">
          <div className="flex items-center gap-2 justify-center">
            <span className="material-symbols-outlined text-2xl" data-icon="search">search</span>
            <span className="font-headline font-bold">ETHERSCAN</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <span className="material-symbols-outlined text-2xl" data-icon="code">code</span>
            <span className="font-headline font-bold">GITHUB</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <span className="material-symbols-outlined text-2xl" data-icon="verified">verified</span>
            <span className="font-headline font-bold">AUDITED</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <span className="material-symbols-outlined text-2xl" data-icon="group">group</span>
            <span className="font-headline font-bold">COMMUNITY</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofTrust;
