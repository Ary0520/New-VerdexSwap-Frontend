import { useState } from 'react';
import type { Pool } from './poolsData';
import TokenSelector from '../shared/TokenSelector';
import { getToken, type Token } from '../shared/tokens';

type Props = { pool: Pool; onClose: () => void };

const RATIOS: Record<string, number> = {
  'WETH-USDC': 2340.5,
  'USDC-WETH': 1 / 2340.5,
  'WBTC-WETH': 16.2,
  'WETH-WBTC': 1 / 16.2,
};

const getRatio = (a: string, b: string) =>
  RATIOS[`${a}-${b}`] ?? RATIOS[`${b}-${a}`] ?? 1;

const AddLiquidityModal = ({ pool, onClose }: Props) => {
  const [tokenA, setTokenA] = useState<Token>(getToken(pool.token0.symbol === 'ETH' ? 'WETH' : pool.token0.symbol));
  const [tokenB, setTokenB] = useState<Token>(getToken(pool.token1.symbol === 'ETH' ? 'WETH' : pool.token1.symbol));
  const [amountA, setAmountA] = useState('');
  const [slippage, setSlippage] = useState('0.5');

  const ratio = getRatio(tokenA.symbol, tokenB.symbol);
  const amountB = amountA ? (parseFloat(amountA) * ratio).toFixed(ratio < 1 ? 6 : 2) : '';
  const estimatedLp = amountA ? (parseFloat(amountA) * 142.88).toFixed(4) : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl flex flex-col"
        style={{
          background: 'rgba(28,27,28,0.95)',
          border: '1px solid rgba(132,149,135,0.15)',
          boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.5), 0 0 80px rgba(0,255,157,0.04)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
          <div>
            <h2 className="font-black text-lg font-headline" style={{ color: '#E5E2E3' }}>
              Add Liquidity
            </h2>
            <p className="text-xs mt-0.5" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
              {tokenA.symbol}/{tokenB.symbol} · {pool.tier}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
            style={{ color: '#B9CBBC' }}
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Token A input */}
          <div
            className="rounded-lg px-4 pt-3 pb-4"
            style={{ background: 'rgba(14,14,15,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex justify-between items-center mb-3">
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}
              >
                Token A
              </span>
              <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
                Balance: 1.24 {tokenA.symbol}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={amountA}
                onChange={(e) => setAmountA(e.target.value)}
                placeholder="0.0"
                className="bg-transparent border-none outline-none font-bold flex-1 min-w-0"
                style={{ fontFamily: 'Space Grotesk', fontSize: 26, color: '#E5E2E3' }}
              />
              <TokenSelector
                selected={tokenA}
                onChange={setTokenA}
                exclude={tokenB.symbol}
              />
            </div>
          </div>

          {/* Plus divider */}
          <div className="flex justify-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: '#2A2A2B', border: '2px solid #131314' }}
            >
              <span className="material-symbols-outlined text-base" style={{ color: '#00FF9D' }}>add</span>
            </div>
          </div>

          {/* Token B input */}
          <div
            className="rounded-lg px-4 pt-3 pb-4"
            style={{ background: 'rgba(14,14,15,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex justify-between items-center mb-3">
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}
              >
                Token B
              </span>
              <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
                Balance: 450 {tokenB.symbol}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={amountB}
                readOnly
                placeholder="0.0"
                className="bg-transparent border-none outline-none font-bold flex-1 min-w-0"
                style={{ fontFamily: 'Space Grotesk', fontSize: 26, color: '#B9CBBC' }}
              />
              <TokenSelector
                selected={tokenB}
                onChange={setTokenB}
                exclude={tokenA.symbol}
              />
            </div>
          </div>

          {/* Optimal ratio helper */}
          <div
            className="rounded-lg px-4 py-3 flex items-start gap-3"
            style={{ background: 'rgba(0,255,157,0.05)', border: '1px solid rgba(0,255,157,0.1)' }}
          >
            <span className="material-symbols-outlined mt-0.5 flex-shrink-0" style={{ color: '#00E38B', fontSize: 16 }}>info</span>
            <p className="text-xs leading-relaxed" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
              Optimal ratio:{' '}
              <span style={{ color: '#E5E2E3' }}>1 {tokenA.symbol}</span> per{' '}
              <span style={{ color: '#E5E2E3' }}>{ratio >= 1 ? ratio.toFixed(2) : (1 / ratio).toFixed(4)} {tokenB.symbol}</span>.
              Deposits outside this ratio will be rebalanced automatically.
            </p>
          </div>

          {/* Slippage */}
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Slippage Tolerance</span>
            <div className="flex items-center gap-2">
              {['0.1', '0.5', '1.0'].map((v) => (
                <button
                  key={v}
                  onClick={() => setSlippage(v)}
                  className="px-2.5 py-1 rounded text-xs font-bold transition-all"
                  style={{
                    fontFamily: 'Inter',
                    background: slippage === v ? 'rgba(0,255,157,0.15)' : '#353436',
                    color: slippage === v ? '#00FF9D' : '#B9CBBC',
                    border: slippage === v ? '1px solid rgba(0,255,157,0.3)' : '1px solid transparent',
                  }}
                >
                  {v}%
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          {estimatedLp && (
            <div
              className="rounded-lg px-4 py-3 flex flex-col gap-2"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Estimated LP Tokens</span>
                <span className="text-xs font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>{estimatedLp} LP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>IL Coverage Preview</span>
                <span className="text-xs font-medium" style={{ color: '#00E38B', fontFamily: 'Inter' }}>After 30 days: ~39% covered</span>
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            className="w-full py-4 rounded-lg font-black uppercase tracking-tight transition-all hover:shadow-[0_20px_40px_-10px_rgba(0,255,157,0.3)] active:scale-[0.98]"
            style={{
              background: amountA ? '#00FF9D' : '#353436',
              color: amountA ? '#007143' : '#B9CBBC',
              fontFamily: 'Space Grotesk',
              fontWeight: 900,
              fontSize: 16,
              letterSpacing: '-0.025em',
              cursor: amountA ? 'pointer' : 'not-allowed',
            }}
          >
            {amountA ? 'Add Liquidity' : 'Enter an Amount'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLiquidityModal;
