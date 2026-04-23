import { useState } from 'react';

const STEPS = {
  trader: [
    { n: '01', title: 'Connect your wallet', body: 'Add Arbitrum Sepolia to MetaMask and connect. Get test tokens from the faucet — no real money required.' },
    { n: '02', title: 'Pick your pair',       body: 'Choose from WETH, WBTC, ARB, DAI, and USDC. Multi-hop routing finds the best path automatically.' },
    { n: '03', title: 'Execute the swap',     body: 'TWAP-protected pricing. Slippage you control. Fees split transparently between LPs and the IL Vault.' },
  ],
  lp: [
    { n: '01', title: 'Choose a pool',        body: 'Pick a tier that matches your risk appetite. Blue Chip pools give you IL Shield coverage from day one.' },
    { n: '02', title: 'Add liquidity',        body: 'Deposit your token pair. The protocol records your entry value using TWAP prices for accurate IL tracking.' },
    { n: '03', title: 'Earn and withdraw',    body: 'Collect swap fees continuously. When you exit, your IL is calculated on-chain and paid out in USDC automatically.' },
  ],
};

const HowItWorks = () => {
  const [tab, setTab] = useState<'trader' | 'lp'>('trader');
  const steps = STEPS[tab];

  return (
    <section id="how-it-works" className="py-24 px-8 bg-surface-container-lowest">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-headline font-black mb-4 text-center">Simple to use. Sophisticated underneath.</h2>
        <p className="text-on-surface-variant text-center mb-12 max-w-xl mx-auto">The complexity lives in the contracts. Your experience is three steps.</p>
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-surface-container-low p-1 rounded-lg">
            <button
              onClick={() => setTab('trader')}
              className={`px-8 py-2 font-bold rounded-md transition-all ${tab === 'trader' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface'}`}>
              For Traders
            </button>
            <button
              onClick={() => setTab('lp')}
              className={`px-8 py-2 font-bold rounded-md transition-all ${tab === 'lp' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface'}`}>
              For Liquidity Providers
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {steps.map(s => (
            <div key={s.n}>
              <div className="text-5xl font-headline font-black text-outline-variant mb-6">{s.n}</div>
              <h4 className="font-headline font-bold text-xl mb-4">{s.title}</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
