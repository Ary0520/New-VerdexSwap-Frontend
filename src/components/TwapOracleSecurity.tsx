

const TwapOracleSecurity = () => {
  return (
    <section className="py-24 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h3 className="text-3xl font-headline font-black mb-6">Precision TWAP Oracles</h3>
          <p className="text-on-surface-variant mb-8">We utilize Time-Weighted Average Pricing to protect against manipulation. No more oracle-based flash loan exploits.</p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container" data-icon="check_circle">check_circle</span>
              <span>30-minute rolling price averages</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container" data-icon="check_circle">check_circle</span>
              <span>Resistant to single-block volatility</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container" data-icon="check_circle">check_circle</span>
              <span>Multi-source price verification</span>
            </li>
          </ul>
        </div>
        <div className="glass-panel p-10 rounded-xl border-secondary-container/20">
          <h3 className="text-2xl font-headline font-bold mb-8">Security Architecture</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-surface-container-high/40 p-4 rounded">
              <span>Smart Contract Audit</span>
              <span className="text-primary-container font-headline font-bold">PASSED</span>
            </div>
            <div className="flex justify-between items-center bg-surface-container-high/40 p-4 rounded">
              <span>Timelock Governance</span>
              <span className="text-secondary font-headline font-bold">48 HOURS</span>
            </div>
            <div className="flex justify-between items-center bg-surface-container-high/40 p-4 rounded">
              <span>Emergency Pause Circuit</span>
              <span className="text-tertiary-fixed-dim font-headline font-bold">ENABLED</span>
            </div>
            <div className="flex justify-between items-center bg-surface-container-high/40 p-4 rounded">
              <span>Multi-Sig Treasury</span>
              <span className="text-on-surface font-headline font-bold">3 of 5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwapOracleSecurity;
