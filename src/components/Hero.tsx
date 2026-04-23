import SwapWidget from './SwapWidget';

const Hero = () => (
  <section className="relative pt-32 pb-20 px-8 overflow-hidden">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
          style={{ background: 'rgba(0,255,157,0.08)', border: '1px solid rgba(0,255,157,0.2)', color: '#00E38B', fontFamily: 'Inter' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse" />
          Live on Arbitrum Sepolia · Testnet
        </div>
        <h1 className="text-6xl md:text-8xl font-headline font-black tracking-tighter leading-[0.9] mb-8 text-primary">
          The DEX that<br />pays you back<br /><span className="text-primary-container">when it hurts.</span>
        </h1>
        <p className="text-xl text-on-surface-variant max-w-lg mb-12 leading-relaxed">
          Self-sustaining Impermanent Loss Shield. Provide liquidity and get compensated for price divergence. Automatically.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="/swap" className="bg-primary-container text-on-primary-container px-8 py-4 font-headline font-bold rounded-md flex items-center gap-2 hover:shadow-[0_0_30px_rgba(0,255,157,0.3)] transition-all">
            Launch App <span className="material-symbols-outlined">rocket_launch</span>
          </a>
          <button className="border border-outline-variant text-on-surface px-8 py-4 font-headline font-bold rounded-md hover:bg-surface-container-highest transition-all">
            How It Works
          </button>
        </div>
      </div>
      <SwapWidget />
    </div>
  </section>
);

export default Hero;
