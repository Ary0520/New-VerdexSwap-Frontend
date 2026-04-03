import { useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import type { PairKey } from '../../lib/contracts';
import { PAIRS, TOKENS, type TokenSymbol } from '../../lib/contracts';
import { usePairData, useRemoveLiquidity } from '../../hooks/usePools';
import { getToken } from '../shared/tokens';

type Props = { pairKey: PairKey; onClose: () => void };

const PRESETS = [25, 50, 75, 100];

const TokenIcon = ({ symbol, icon, color }: { symbol: string; icon: string; color: string }) => {
  if (icon) return <img src={icon} alt={symbol} className="w-5 h-5 rounded-full" />;
  return <div className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-white text-xs"
    style={{ background: color, fontFamily: 'Space Grotesk' }}>{symbol.slice(0, 2)}</div>;
};

const RemoveLiquidityModal = ({ pairKey, onClose }: Props) => {
  const [inputVal, setInputVal] = useState('50');
  const [detailsOpen, setDetailsOpen] = useState(false);

  const data = usePairData(pairKey);
  const { remove, status, txHash, error, reset } = useRemoveLiquidity();

  const pair  = PAIRS[pairKey];
  const t0sym = pair.token0 as TokenSymbol;
  const t1sym = pair.token1 as TokenSymbol;
  const t0    = TOKENS[t0sym];
  const t1    = TOKENS[t1sym];
  const tok0  = getToken(t0sym);
  const tok1  = getToken(t1sym);

  const percent = Math.min(100, Math.max(0, parseFloat(inputVal) || 0));

  const handleInput = (raw: string) => {
    const cleaned = raw.replace(/[^0-9.]/g, '').slice(0, 6);
    const num = parseFloat(cleaned);
    if (cleaned === '' || cleaned === '.') { setInputVal(cleaned); return; }
    if (!isNaN(num) && num <= 100) setInputVal(cleaned);
    else if (num > 100) setInputVal('100');
  };

  const lpToBurn    = data.userLpRaw * BigInt(Math.round(percent * 100)) / 10000n;
  const lpToBurnFmt = parseFloat(formatUnits(lpToBurn, 18)).toFixed(6);

  const safeSupply = data.supply > 0n ? data.supply : 1n;
  const receiveA = percent > 0 && data.res0 > 0n
    ? parseFloat(formatUnits(data.res0 * lpToBurn / safeSupply, t0.decimals)).toFixed(6)
    : '0';
  const receiveB = percent > 0 && data.res1 > 0n
    ? parseFloat(formatUnits(data.res1 * lpToBurn / safeSupply, t1.decimals)).toFixed(t1.decimals === 6 ? 2 : 6)
    : '0';

  const entryVal   = parseFloat(formatUnits(data.posValueAtDeposit, 6));
  const priceRatio = data.res1 > 0n && data.res0 > 0n
    ? Number(formatUnits(data.res1, t1.decimals)) / Number(formatUnits(data.res0, t0.decimals))
    : 0;
  const currentVal = parseFloat(receiveB) + parseFloat(receiveA) * priceRatio;
  const ilAmount   = Math.max(0, entryVal * (percent / 100) - currentVal);
  const ilPayout   = data.daysInPool >= 7
    ? (ilAmount * parseFloat(data.coveragePct) / 100).toFixed(2)
    : null;

  const daysUntilUnlock = data.daysInPool < 7 ? 7 - data.daysInPool : 0;
  const vaultStressed   = data.utilizationPct > 75;
  const vaultHealthy    = data.utilizationPct <= 50;
  const isBusy          = status === 'approving' || status === 'removing';

  const handleRemove = () => {
    if (status === 'success' || status === 'error') { reset(); return; }
    if (percent === 0 || lpToBurn === 0n) return;
    const slippageBps = 50;
    const minA = parseFloat(receiveA) > 0
      ? parseUnits(receiveA, t0.decimals) * BigInt(10000 - slippageBps) / 10000n : 0n;
    const minB = parseFloat(receiveB) > 0
      ? parseUnits(receiveB, t1.decimals) * BigInt(10000 - slippageBps) / 10000n : 0n;
    remove(pairKey, lpToBurn, minA, minB);
  };

  const btnBg    = status === 'success' ? '#00E38B'
    : status === 'error' ? 'rgba(255,100,100,0.15)'
    : percent > 0 && !isBusy ? 'rgba(255,100,100,0.15)' : '#353436';
  const btnColor = status === 'success' ? '#003D20'
    : status === 'error' ? '#FF6464'
    : percent > 0 && !isBusy ? '#FF6464' : '#B9CBBC';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full flex flex-col overflow-y-auto"
        style={{ maxWidth: 480, maxHeight: '88vh', background: 'rgba(20,20,21,0.98)',
          border: '1px solid rgba(132,149,135,0.15)', borderRadius: 20,
          boxShadow: '0px 32px 64px -12px rgba(0,0,0,0.6)', backdropFilter: 'blur(24px)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <h2 className="font-black text-lg font-headline" style={{ color: '#E5E2E3' }}>Remove Liquidity</h2>
            <p className="text-xs mt-0.5" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
              {t0sym}/{t1sym} · {data.userLpFmt} LP tokens
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5"
            style={{ color: '#B9CBBC' }}>
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Amount */}
          <div className="rounded-xl px-5 py-4 flex flex-col gap-3"
            style={{ background: 'rgba(14,14,15,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest"
                style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}>Amount to Remove</span>
              <div className="flex items-center gap-1.5">
                <input type="text" inputMode="decimal" value={inputVal}
                  onChange={(e) => handleInput(e.target.value)}
                  onBlur={() => setInputVal(String(percent))}
                  className="text-right font-black font-headline bg-transparent border-none outline-none"
                  style={{ color: '#00FF9D', fontSize: 28, width: 80 }} />
                <span className="font-black font-headline" style={{ color: '#00FF9D', fontSize: 28 }}>%</span>
              </div>
            </div>
            <p className="text-xs text-right -mt-1" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
              {lpToBurnFmt} LP tokens
            </p>
            <input type="range" min={0} max={100} value={percent}
              onChange={(e) => setInputVal(String(Number(e.target.value)))}
              className="w-full" style={{ accentColor: '#00FF9D' }} />
            <div className="flex gap-2">
              {PRESETS.map((p) => (
                <button key={p} onClick={() => setInputVal(String(p))}
                  className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                  style={{
                    fontFamily: 'Inter',
                    background: percent === p ? 'rgba(0,255,157,0.15)' : '#353436',
                    color: percent === p ? '#00FF9D' : '#B9CBBC',
                    border: percent === p ? '1px solid rgba(0,255,157,0.3)' : '1px solid transparent',
                  }}>
                  {p === 100 ? 'MAX' : `${p}%`}
                </button>
              ))}
            </div>
          </div>

          {/* You Receive */}
          <div className="rounded-xl px-4 py-3 flex flex-col gap-2.5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs font-bold uppercase tracking-widest"
              style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}>You Receive</p>
            {[{ token: tok0, amount: receiveA }, { token: tok1, amount: receiveB }].map(({ token, amount }) => (
              <div key={token.symbol} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TokenIcon symbol={token.symbol} icon={token.icon} color={token.color} />
                  <span className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: '#E5E2E3' }}>{token.symbol}</span>
                </div>
                <span className="text-sm font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>{amount}</span>
              </div>
            ))}
          </div>

          {/* Position Details collapsible */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={() => setDetailsOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="text-xs font-bold uppercase tracking-widest"
                style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}>Position Details</span>
              <span className="material-symbols-outlined"
                style={{ color: '#B9CBBC', fontSize: 18, transform: detailsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                expand_more
              </span>
            </button>
            {detailsOpen && (
              <div className="px-4 pb-3 pt-1 flex flex-col gap-2"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {[
                  { label: 'Entry Value',  value: `$${parseFloat(formatUnits(data.posValueAtDeposit, 6)).toFixed(2)}`, color: '#B9CBBC' },
                  { label: 'Days in Pool', value: `${data.daysInPool} days`,                                            color: '#B9CBBC' },
                  { label: 'IL Coverage',  value: `${data.coveragePct}%`,                                               color: '#568DFF' },
                  { label: 'Vault Health', value: `${data.utilizationPct.toFixed(1)}% · ${vaultHealthy ? 'Healthy' : vaultStressed ? 'Stressed' : 'Moderate'}`,
                    color: vaultHealthy ? '#00E38B' : vaultStressed ? '#FF6464' : '#FFB400' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-0.5">
                    <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{row.label}</span>
                    <span className="text-xs font-bold" style={{ color: row.color, fontFamily: 'Inter' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* IL Shield hero */}
          {ilPayout && daysUntilUnlock === 0 && parseFloat(ilPayout) > 0 && (
            <div className="relative rounded-xl overflow-hidden"
              style={{ background: 'rgba(0,255,157,0.04)', border: '1px solid rgba(0,255,157,0.2)', boxShadow: '0 0 32px rgba(0,255,157,0.06)' }}>
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(to right, transparent, rgba(0,255,157,0.5), transparent)' }} />
              <div className="px-5 py-4 flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(0,255,157,0.15)', border: '1px solid rgba(0,255,157,0.25)' }}>
                    <span className="material-symbols-outlined" style={{ color: '#00FF9D', fontSize: 18, fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                  </div>
                  <div>
                    <p className="text-sm font-black font-headline" style={{ color: '#00FF9D' }}>IL Shield Active — You're Protected</p>
                    <p className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Your impermanent loss is covered.</p>
                  </div>
                </div>
                <div className="rounded-lg px-4 py-3 flex items-center justify-between"
                  style={{ background: 'rgba(0,255,157,0.08)', border: '1px solid rgba(0,255,157,0.15)' }}>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs uppercase tracking-widest" style={{ color: '#00E38B', fontFamily: 'Inter', letterSpacing: '0.08em', fontSize: 10 }}>Estimated IL Payout</span>
                    <span className="font-black font-headline text-2xl" style={{ color: '#00FF9D' }}>+${ilPayout} USDC</span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Coverage</span>
                    <span className="font-black text-lg font-headline" style={{ color: '#00E38B' }}>{data.coveragePct}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {daysUntilUnlock > 0 && (
            <div className="rounded-xl px-4 py-3 flex items-start gap-3"
              style={{ background: 'rgba(255,180,0,0.06)', border: '1px solid rgba(255,180,0,0.15)' }}>
              <span className="material-symbols-outlined mt-0.5 flex-shrink-0" style={{ color: '#FFB400', fontSize: 16 }}>lock_clock</span>
              <p className="text-xs leading-relaxed" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
                IL protection unlocks in <span style={{ color: '#FFB400', fontWeight: 600 }}>{daysUntilUnlock} days</span>.
              </p>
            </div>
          )}

          {vaultStressed && (
            <div className="rounded-xl px-4 py-3 flex items-start gap-3"
              style={{ background: 'rgba(255,100,100,0.06)', border: '1px solid rgba(255,100,100,0.15)' }}>
              <span className="material-symbols-outlined mt-0.5 flex-shrink-0" style={{ color: '#FF6464', fontSize: 16 }}>warning</span>
              <p className="text-xs leading-relaxed" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
                Vault utilization: <span style={{ color: '#FF6464', fontWeight: 600 }}>{data.utilizationPct.toFixed(1)}%</span> — payout may be reduced.
              </p>
            </div>
          )}

          {error && (
            <div className="px-4 py-2 rounded-lg text-xs"
              style={{ background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.2)', color: '#FF6464', fontFamily: 'Inter' }}>
              {error.length > 100 ? error.slice(0, 100) + '…' : error}
            </div>
          )}

          {txHash && (
            <div className="px-4 py-2 rounded-lg text-xs flex items-center gap-2"
              style={{ background: 'rgba(0,255,157,0.05)', border: '1px solid rgba(0,255,157,0.15)', color: '#00E38B', fontFamily: 'Inter' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
              <a href={`https://sepolia.arbiscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline truncate">
                {txHash.slice(0, 22)}…{txHash.slice(-6)}
              </a>
            </div>
          )}

          <button onClick={handleRemove} disabled={percent === 0 && status === 'idle'}
            className="w-full py-4 rounded-xl font-black uppercase tracking-tight transition-all active:scale-[0.98]"
            style={{
              background: btnBg, color: btnColor,
              fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 16, letterSpacing: '-0.025em',
              border: percent > 0 && !isBusy && status === 'idle' ? '1px solid rgba(255,100,100,0.3)' : '1px solid transparent',
              cursor: percent > 0 || status !== 'idle' ? 'pointer' : 'not-allowed',
            }}>
            {status === 'approving' ? 'Approving LP...'
              : status === 'removing' ? 'Removing...'
              : status === 'success' ? '✓ Liquidity Removed'
              : status === 'error' ? 'Try Again'
              : percent > 0 ? 'Remove Liquidity' : 'Select Amount'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveLiquidityModal;
