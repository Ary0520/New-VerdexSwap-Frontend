import { useState } from 'react';
import { formatUnits } from 'viem';
import type { PairKey } from '../../lib/contracts';
import { PAIRS, TOKENS, type TokenSymbol } from '../../lib/contracts';
import { useTokenBalance } from '../../hooks/useSwap';
import { useAddLiquidity, useAddLiquidityQuote } from '../../hooks/usePools';
import TokenSelector from '../shared/TokenSelector';
import { getToken } from '../shared/tokens';

type Props = { pairKey: PairKey; onClose: () => void };

const STATUS_LABEL: Record<string, string> = {
  idle:        'Add Liquidity',
  approving_a: 'Approving Token A...',
  approving_b: 'Approving Token B...',
  adding:      'Adding Liquidity...',
  success:     '✓ Liquidity Added',
  error:       'Try Again',
};

const AddLiquidityModal = ({ pairKey, onClose }: Props) => {
  const pair   = PAIRS[pairKey];
  const t0sym  = pair.token0 as TokenSymbol;
  const t1sym  = pair.token1 as TokenSymbol;

  const [amountA, setAmountA] = useState('');
  const [slippage, setSlippage] = useState(50); // bps

  const balA = useTokenBalance(t0sym);
  const balB = useTokenBalance(t1sym);
  const { amountB, ratio, estimatedLp } = useAddLiquidityQuote(pairKey, amountA);
  const { add, status, txHash, error, reset } = useAddLiquidity();

  const t0 = TOKENS[t0sym];
  const t1 = TOKENS[t1sym];
  const tokenA = getToken(t0sym);
  const tokenB = getToken(t1sym);

  const isBusy = status === 'approving_a' || status === 'approving_b' || status === 'adding';
  const canAdd = !!amountA && parseFloat(amountA) > 0 && !!amountB && !isBusy && status !== 'success';

  const handleAdd = () => {
    if (status === 'success' || status === 'error') { reset(); return; }
    if (!amountA || !amountB) return;
    add(pairKey, amountA, amountB, slippage);
  };

  const btnBg = status === 'success' ? '#00E38B'
    : status === 'error' ? 'rgba(255,100,100,0.15)'
    : canAdd ? '#00FF9D' : '#353436';
  const btnColor = status === 'success' ? '#003D20'
    : status === 'error' ? '#FF6464'
    : canAdd ? '#007143' : '#B9CBBC';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl flex flex-col overflow-y-auto"
        style={{
          maxHeight: '90vh',
          background: 'rgba(28,27,28,0.95)',
          border: '1px solid rgba(132,149,135,0.15)',
          boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5 flex-shrink-0">
          <div>
            <h2 className="font-black text-lg font-headline" style={{ color: '#E5E2E3' }}>Add Liquidity</h2>
            <p className="text-xs mt-0.5" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
              {t0sym}/{t1sym}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5"
            style={{ color: '#B9CBBC' }}>
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Token A */}
          <div className="rounded-lg px-4 pt-3 pb-4"
            style={{ background: 'rgba(14,14,15,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-widest"
                style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}>Token A</span>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
                  Balance: {balA.formatted} {t0sym}
                </span>
                <button onClick={() => setAmountA(formatUnits(balA.raw, t0.decimals))}
                  className="px-2 py-0.5 rounded text-xs font-bold"
                  style={{ background: 'rgba(0,255,157,0.2)', color: '#56FFA8', fontFamily: 'Inter' }}>
                  MAX
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="number" value={amountA}
                onChange={(e) => { setAmountA(e.target.value); if (status !== 'idle') reset(); }}
                placeholder="0.0"
                className="bg-transparent border-none outline-none font-bold flex-1 min-w-0"
                style={{ fontFamily: 'Space Grotesk', fontSize: 26, color: '#E5E2E3' }} />
              <TokenSelector selected={tokenA} onChange={() => {}} />
            </div>
          </div>

          {/* Plus */}
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: '#2A2A2B', border: '2px solid #131314' }}>
              <span className="material-symbols-outlined text-base" style={{ color: '#00FF9D' }}>add</span>
            </div>
          </div>

          {/* Token B — auto-calculated from reserves */}
          <div className="rounded-lg px-4 pt-3 pb-4"
            style={{ background: 'rgba(14,14,15,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-widest"
                style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}>Token B</span>
              <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
                Balance: {balB.formatted} {t1sym}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input type="number" value={amountB} readOnly placeholder="0.0"
                className="bg-transparent border-none outline-none font-bold flex-1 min-w-0"
                style={{ fontFamily: 'Space Grotesk', fontSize: 26, color: '#B9CBBC' }} />
              <TokenSelector selected={tokenB} onChange={() => {}} />
            </div>
          </div>

          {/* Optimal ratio info */}
          {ratio > 0 && (
            <div className="rounded-lg px-4 py-3 flex items-start gap-3"
              style={{ background: 'rgba(0,255,157,0.05)', border: '1px solid rgba(0,255,157,0.1)' }}>
              <span className="material-symbols-outlined mt-0.5 flex-shrink-0"
                style={{ color: '#00E38B', fontSize: 16 }}>info</span>
              <p className="text-xs leading-relaxed" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
                Current pool ratio: <span style={{ color: '#E5E2E3' }}>1 {t0sym}</span> ={' '}
                <span style={{ color: '#E5E2E3' }}>{ratio.toFixed(t1.decimals === 6 ? 2 : 6)} {t1sym}</span>.
                Token B is auto-calculated to match the pool ratio.
              </p>
            </div>
          )}

          {/* Slippage */}
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Slippage Tolerance</span>
            <div className="flex items-center gap-2">
              {[10, 50, 100].map((bps) => (
                <button key={bps} onClick={() => setSlippage(bps)}
                  className="px-2.5 py-1 rounded text-xs font-bold transition-all"
                  style={{
                    fontFamily: 'Inter',
                    background: slippage === bps ? 'rgba(0,255,157,0.15)' : '#353436',
                    color: slippage === bps ? '#00FF9D' : '#B9CBBC',
                    border: slippage === bps ? '1px solid rgba(0,255,157,0.3)' : '1px solid transparent',
                  }}>
                  {(bps / 100).toFixed(1)}%
                </button>
              ))}
            </div>
          </div>

          {/* LP tokens you'll receive */}
          {estimatedLp && (
            <div className="rounded-lg px-4 py-3 flex items-center justify-between"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
                LP Tokens You'll Receive
              </span>
              <span className="text-xs font-bold" style={{ color: '#00FF9D', fontFamily: 'Inter' }}>
                {estimatedLp} LP
              </span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="px-4 py-2 rounded-lg text-xs"
              style={{ background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.2)', color: '#FF6464', fontFamily: 'Inter' }}>
              {error.length > 100 ? error.slice(0, 100) + '…' : error}
            </div>
          )}

          {/* Tx hash */}
          {txHash && (
            <div className="px-4 py-2 rounded-lg text-xs flex items-center gap-2"
              style={{ background: 'rgba(0,255,157,0.05)', border: '1px solid rgba(0,255,157,0.15)', color: '#00E38B', fontFamily: 'Inter' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
              <a href={`https://sepolia.arbiscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline truncate">
                {txHash.slice(0, 22)}…{txHash.slice(-6)}
              </a>
            </div>
          )}

          {/* CTA */}
          <button onClick={handleAdd} disabled={!canAdd && status === 'idle'}
            className="w-full py-4 rounded-lg font-black uppercase tracking-tight transition-all active:scale-[0.98]"
            style={{
              background: btnBg, color: btnColor,
              fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 16,
              letterSpacing: '-0.025em',
              boxShadow: canAdd && status === 'idle' ? '0 8px 24px -4px rgba(0,255,157,0.2)' : 'none',
              cursor: canAdd || status !== 'idle' ? 'pointer' : 'not-allowed',
            }}>
            {STATUS_LABEL[status] ?? 'Add Liquidity'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLiquidityModal;
