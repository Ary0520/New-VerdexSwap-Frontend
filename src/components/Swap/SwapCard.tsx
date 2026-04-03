import { useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import SwapFromSection from './SwapFromSection';
import SwapToSection from './SwapToSection';
import SwapDetailsAccordion from './SwapDetailsAccordion';
import SwapSettings from './SwapSettings';
import { getToken, type Token } from '../shared/tokens';
import {
  useTokenBalance,
  useSwapQuote,
  usePairFees,
  usePriceImpact,
  useUsdPrice,
  useExecuteSwap,
  type SwapStatus,
} from '../../hooks/useSwap';
import type { TokenSymbol } from '../../lib/contracts';
import { formatUnits, parseUnits } from 'viem';

const STATUS_LABEL: Record<SwapStatus, string> = {
  idle:      'Execute Swap',
  approving: 'Approving...',
  swapping:  'Swapping...',
  success:   '✓ Swap Complete',
  error:     'Try Again',
};

const SwapCard = () => {
  const account = useActiveAccount();

  const [fromToken, setFromToken] = useState<Token>(getToken('WETH'));
  const [toToken,   setToToken]   = useState<Token>(getToken('USDC'));
  const [fromAmount, setFromAmount] = useState('');
  const [settingsOpen, setSettingsOpen]       = useState(false);
  const [slippageBps, setSlippageBps]         = useState(50);
  const [deadlineMinutes, setDeadlineMinutes] = useState(20);

  const fromSymbol = fromToken.symbol as TokenSymbol;
  const toSymbol   = toToken.symbol   as TokenSymbol;

  // On-chain data
  const fromBalance = useTokenBalance(fromSymbol);
  const toBalance   = useTokenBalance(toSymbol);
  const fromUsdPrice = useUsdPrice(fromSymbol);
  const toUsdPrice   = useUsdPrice(toSymbol);

  const {
    amountOut, formatted: toAmount, rate,
    isMultiHop, isLoading: quoteLoading, noRoute,
  } = useSwapQuote(fromSymbol, toSymbol, fromAmount);

  const fees = usePairFees(fromSymbol, toSymbol);
  const { priceImpactPct } = usePriceImpact(fromSymbol, toSymbol, fromAmount, amountOut);
  const { execute, status, txHash, error, reset } = useExecuteSwap();

  const isConnected = !!account?.address;
  const isBusy = status === 'approving' || status === 'swapping';

  // USD value displays
  const fromUsd = fromAmount && fromUsdPrice > 0
    ? `≈ $${(parseFloat(fromAmount) * fromUsdPrice).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
    : fromUsdPrice === 0 ? '' : '≈ $—';

  const toUsd = toAmount && toUsdPrice > 0
    ? `≈ $${(parseFloat(toAmount) * toUsdPrice).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
    : toUsdPrice === 0 ? '' : '≈ $—';

  // Balance guard
  const insufficientBalance = (() => {
    if (!fromAmount || fromBalance.raw === 0n) return false;
    try {
      return parseUnits(fromAmount, fromBalance.decimals) > fromBalance.raw;
    } catch { return false; }
  })();

  const handlePercent = (pct: number) => {
    if (fromBalance.raw === 0n) return;
    const val = (fromBalance.raw * BigInt(pct)) / 100n;
    setFromAmount(parseFloat(formatUnits(val, fromBalance.decimals)).toFixed(6));
  };

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount('');
    reset();
  };

  const handleExecute = () => {
    if (status === 'success' || status === 'error') { reset(); return; }
    execute(fromSymbol, toSymbol, fromAmount, amountOut, slippageBps, deadlineMinutes);
  };

  // Button logic
  const getButtonState = (): { label: string; disabled: boolean; bg: string; color: string } => {
    if (!isConnected)        return { label: 'Connect Wallet',                disabled: true,  bg: '#353436', color: '#B9CBBC' };
    if (status === 'success') return { label: '✓ Swap Complete',              disabled: false, bg: '#00E38B', color: '#003D20' };
    if (status === 'error')   return { label: 'Try Again',                    disabled: false, bg: 'rgba(255,100,100,0.15)', color: '#FF6464' };
    if (isBusy)               return { label: STATUS_LABEL[status],           disabled: true,  bg: 'rgba(0,255,157,0.3)', color: '#00E38B' };
    if (!fromAmount || parseFloat(fromAmount) === 0) return { label: 'Enter an Amount', disabled: true, bg: '#353436', color: '#B9CBBC' };
    if (insufficientBalance)  return { label: `Insufficient ${fromSymbol}`,   disabled: true,  bg: 'rgba(255,100,100,0.1)', color: '#FF6464' };
    if (noRoute)              return { label: 'No Route Found',               disabled: true,  bg: '#353436', color: '#B9CBBC' };
    if (quoteLoading)         return { label: 'Fetching Quote...',            disabled: true,  bg: '#353436', color: '#B9CBBC' };
    return { label: 'Execute Swap', disabled: false, bg: '#00FF9D', color: '#007143' };
  };

  const btn = getButtonState();

  return (
    <div
      className="relative rounded-2xl"
      style={{
        width: 480,
        background: 'rgba(28,27,28,0.6)',
        border: '1px solid rgba(132,149,135,0.15)',
        boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25), 0px 0px 100px 10px rgba(0,255,157,0.05)',
        backdropFilter: 'blur(24px)',
        borderRadius: 16,
        overflow: 'visible',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div style={{ width: 16, height: 34 }} />
        <div className="relative">
          <button
            onClick={() => setSettingsOpen((v) => !v)}
            className="flex items-center justify-center rounded-xl transition-colors"
            style={{
              width: 40, height: 40,
              color: settingsOpen ? '#00FF9D' : '#B9CBBC',
              background: settingsOpen ? 'rgba(0,255,157,0.08)' : 'transparent',
            }}
          >
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
          {settingsOpen && (
            <SwapSettings
              slippageBps={slippageBps}
              onSlippageChange={setSlippageBps}
              deadlineMinutes={deadlineMinutes}
              onDeadlineChange={setDeadlineMinutes}
              onClose={() => setSettingsOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Inputs */}
      <div className="px-6 flex flex-col gap-2 relative">
        <SwapFromSection
          value={fromAmount}
          onChange={(v) => { setFromAmount(v); if (status !== 'idle') reset(); }}
          token={fromToken}
          onTokenChange={setFromToken}
          excludeSymbol={toToken.symbol}
          balance={fromBalance.formatted}
          usdValue={fromUsd}
          onPercent={handlePercent}
          insufficientBalance={insufficientBalance}
        />

        <div className="relative h-0 z-10">
          <button
            onClick={handleSwapTokens}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
            style={{ width: 40, height: 40, background: '#2A2A2B', border: '4px solid #131314', transition: 'transform 0.2s' }}
          >
            <span className="material-symbols-outlined"
              style={{ color: '#00FF9D', fontSize: 20, fontVariationSettings: "'FILL' 1" }}>
              arrow_downward
            </span>
          </button>
        </div>

        <SwapToSection
          value={quoteLoading && fromAmount ? '...' : toAmount}
          token={toToken}
          onTokenChange={setToToken}
          excludeSymbol={fromToken.symbol}
          balance={toBalance.formatted}
          usdValue={toUsd}
          noRoute={noRoute}
        />
      </div>

      {/* Multi-hop indicator */}
      {isMultiHop && toAmount && (
        <div className="mx-6 mt-3 px-3 py-1.5 rounded-lg flex items-center gap-2"
          style={{ background: 'rgba(86,141,255,0.08)', border: '1px solid rgba(86,141,255,0.15)' }}>
          <span className="material-symbols-outlined" style={{ color: '#568DFF', fontSize: 14 }}>route</span>
          <span className="text-xs" style={{ color: '#568DFF', fontFamily: 'Inter' }}>
            Multi-hop route: {fromSymbol} → USDC → {toSymbol}
          </span>
        </div>
      )}

      {/* Details */}
      {toAmount && !noRoute && (
        <div className="px-6 mt-3">
          <SwapDetailsAccordion
            fromSymbol={fromSymbol}
            toSymbol={toSymbol}
            rate={rate}
            amountOut={toAmount}
            fees={fees}
            slippageBps={slippageBps}
            priceImpactPct={priceImpactPct}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mx-6 mt-3 px-4 py-2 rounded-lg text-xs"
          style={{ background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.2)', color: '#FF6464', fontFamily: 'Inter' }}>
          {error.length > 100 ? error.slice(0, 100) + '…' : error}
        </div>
      )}

      {/* Tx hash */}
      {txHash && (
        <div className="mx-6 mt-2 px-4 py-2 rounded-lg text-xs flex items-center gap-2"
          style={{ background: 'rgba(0,255,157,0.05)', border: '1px solid rgba(0,255,157,0.15)', color: '#00E38B', fontFamily: 'Inter' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
          <a href={`https://sepolia.arbiscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline truncate">
            {txHash.slice(0, 22)}…{txHash.slice(-6)}
          </a>
        </div>
      )}

      {/* CTA */}
      <div className="px-6 py-6">
        <button
          onClick={handleExecute}
          disabled={btn.disabled}
          className="w-full py-4 rounded-lg font-black uppercase tracking-tight transition-all active:scale-[0.98]"
          style={{
            background: btn.bg,
            color: btn.color,
            fontFamily: 'Space Grotesk',
            fontWeight: 900,
            fontSize: 18,
            letterSpacing: '-0.025em',
            boxShadow: !btn.disabled && status === 'idle' ? '0 8px 24px -4px rgba(0,255,157,0.25)' : 'none',
            cursor: btn.disabled ? 'not-allowed' : 'pointer',
          }}
        >
          {btn.label}
        </button>
      </div>
    </div>
  );
};

export default SwapCard;
