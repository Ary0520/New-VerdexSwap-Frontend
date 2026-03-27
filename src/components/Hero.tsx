
import SwapWidget from './SwapWidget';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="z-10">
          <h1 className="text-6xl md:text-8xl font-headline font-black tracking-tighter leading-[0.9] mb-8 text-primary">
            Swap freely.<br />Earn fairly.<br /><span className="text-primary-container">Sleep safely.</span>
          </h1>
          <p className="text-xl text-on-surface-variant max-w-lg mb-12 leading-relaxed">
            The next-generation DEX on Arbitrum Sepolia featuring the industry's first self-sustaining IL Shield. Institutional security for the retail liquidity provider.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-primary-container text-on-primary-container px-8 py-4 font-headline font-bold rounded-md flex items-center gap-2 hover:shadow-[0_0_30px_rgba(0,255,157,0.3)] transition-all">
              Launch App <span className="material-symbols-outlined">rocket_launch</span>
            </button>
            <button className="border border-outline-variant text-on-surface px-8 py-4 font-headline font-bold rounded-md hover:bg-surface-container-highest transition-all">
              Read the Docs
            </button>
          </div>
        </div>
        
        <SwapWidget />
      </div>
    </section>
  );
};

export default Hero;
