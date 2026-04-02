import { useState } from 'react';
import SwapFromSection from './SwapFromSection';
import SwapToSection from './SwapToSection';
import SwapDetailsAccordion from './SwapDetailsAccordion';
import { getToken, type Token } from '../shared/tokens';

const EXCHANGE_RATE = 2340.5;

const SwapCard = () => {
  const [fromAmount, setFromAmount] = useState('1.0');
  const [fromToken, setFromToken] = useState<Token>(getToken('WETH'));
  const [toToken, setToToken] = useState<Token>(getToken('USDC'));

  const toAmount = fromAmount
    ? (parseFloat(fromAmount) * EXCHANGE_RATE).toFixed(2)
    : '';

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        width: 480,
        background: 'rgba(28,27,28,0.6)',
        border: '1px solid rgba(132,149,135,0.15)',
        boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25), 0px 0px 100px 10px rgba(0,255,157,0.05)',
        backdropFilter: 'blur(24px)',
      }}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div style={{ width: 16, height: 34 }} />
        <button
          className="flex items-center justify-center rounded-xl transition-colors hover:text-[#00FF9D]"
          style={{ width: 40, height: 40, color: '#B9CBBC' }}
        >
          <span className="material-symbols-outlined text-xl">settings</span>
        </button>
      </div>

      {/* Swap Inputs */}
      <div className="px-6 flex flex-col gap-2 relative">
        <SwapFromSection
          value={fromAmount}
          onChange={setFromAmount}
          token={fromToken}
          onTokenChange={setFromToken}
          excludeSymbol={toToken.symbol}
        />

        {/* Swap arrow button */}
        <div className="relative h-0 z-10">
          <button
            onClick={handleSwapTokens}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-transform hover:scale-110 hover:rotate-180"
            style={{
              width: 40,
              height: 40,
              background: '#2A2A2B',
              border: '4px solid #131314',
              transition: 'transform 0.2s',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: '#00FF9D', fontSize: 20, fontVariationSettings: "'FILL' 1" }}
            >
              arrow_downward
            </span>
          </button>
        </div>

        <SwapToSection
          value={toAmount}
          token={toToken}
          onTokenChange={setToToken}
          excludeSymbol={fromToken.symbol}
        />
      </div>

      {/* Details Accordion */}
      <div className="px-6 mt-4">
        <SwapDetailsAccordion />
      </div>

      {/* Execute Swap Button */}
      <div className="px-6 py-6">
        <button
          className="w-full py-4 rounded-lg font-black uppercase tracking-tight transition-all hover:shadow-[0_20px_40px_-10px_rgba(0,255,157,0.3)] active:scale-[0.98]"
          style={{
            background: '#00FF9D',
            color: '#007143',
            fontFamily: 'Space Grotesk',
            fontWeight: 900,
            fontSize: 18,
            letterSpacing: '-0.025em',
          }}
        >
          Execute Swap
        </button>
      </div>
    </div>
  );
};

export default SwapCard;
