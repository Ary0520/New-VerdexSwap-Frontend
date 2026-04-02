import { useState } from 'react';
import type { Pool } from './poolsData';

type Props = { pool: Pool; onClose: () => void };

const PRESETS = [25, 50, 75, 100];

const RemoveLiquidityModal = ({ pool, onClose }: Props) => {
  const [inputVal, setInputVal] = useState('50');
  const [detailsOpen, setDetailsOpen] = useState(false);

  const percent = Math.min(100, Math.max(0, parseFloat(inputVal) || 0));

  const handleInput = (raw: string) => {
    const cleaned = raw.replace(/[^0-9.]/g, '').slice(0, 6);
    const num = parseFloat(cleaned);
    if (cleaned === '' || cleaned === '.') { setInputVal(cleaned); return; }
    if (!isNaN(num) && num <= 100) setInputVal(cleaned);
    else if (num > 100) setInputVal('100');
  };

  const totalLp  = parseFloat(pool.userLpTokens);
  const lpAmount = ((totalLp * percent) / 100).toFixed(4);

  const currentVal = parseFloat(pool.userValue.replace('$', '').replace(',', ''));
  const entryVal   = parseFloat(pool.userEntryValue.replace('$', '').replace(',', ''));
  const ilAmount   = Math.max(0, entryVal - currentVal);
  const ilPct      = entryVal > 0 ? ((ilAmount / entryVal) * 100).toFixed(2) : '0.00';

  const receiveA = percent > 0 ? ((currentVal * percent) / 100 / 2 / 2340.5).toFixed(6) : '0';
  const receiveB = percent > 0 ? ((currentVal * percent) / 100 / 2).toFixed(2) : '0';

  const ilPayout        = pool.userDaysInPool >= 7
    ? ((ilAmount * (pool.userIlCoverage / 100) * percent) / 100).toFixed(2)
    : null;
  const daysUntilUnlock = pool.userDaysInPool < 7 ? 7 - pool.userDaysInPool : 0;
  const vaultStressed   = pool.vaultUtilization > 75;
  const vaultHealthy    = pool.vaultUtilization <= 50;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full flex flex-col overflow-y-auto"
        style={{
          maxWidth: 480,
          maxHeight: '88vh',
          background: 'rgba(20,20,21,0.98)',
          border: '1px solid rgba(132,149,135,0.15)',
          borderRadius: 20,
          boxShadow: '0px 32px 64px -12px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <h2 className="font-black text-lg font-headline" style={{ color: '#E5E2E3' }}>
              Remove Liquidity
            </h2>
            <p className="text-xs mt-0.5" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
              {pool.token0.symbol}/{pool.token1.symbol} · {pool.userLpTokens} LP tokens
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
            style={{ color: '#B9CBBC' }}>
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">

          {/* ── Amount input + slider ── */}
          <div className="rounded-xl px-5 py-4 flex flex-col gap-3"
            style={{ background: 'rgba(14,14,15,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>

            {/* Typeable % input */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest"
                style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}>
                Amount to Remove
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  inputMode="decimal"
                  value={inputVal}
                  onChange={(e) => handleInput(e.target.value)}
                  onBlur={() => setInputVal(String(percent))}
                  className="text-right font-black font-headline bg-transparent border-none outline-none"
                  style={{ color: '#00FF9D', fontSize: 28, width: 80 }}
                />
                <span className="font-black font-headline" style={{ color: '#00FF9D', fontSize: 28 }}>%</span>
              </div>
            </div>

            <p className="text-xs text-right -mt-1" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
              {lpAmount} LP tokens
            </p>

            {/* Slider */}
            <input
              type="range" min={0} max={100} value={percent}
              onChange={(e) => { const v = Number(e.target.value); setInputVal(String(v)); }}
              className="w-full" style={{ accentColor: '#00FF9D' }}
            />

            {/* Preset buttons */}
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

          {/* ── You Receive ── */}
          <div className="rounded-xl px-4 py-3 flex flex-col gap-2.5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs font-bold uppercase tracking-widest"
              style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}>
              You Receive
            </p>
            {[
              { token: pool.token0, amount: receiveA },
              { token: pool.token1, amount: receiveB },
            ].map(({ token, amount }) => (
              <div key={token.symbol} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {token.icon
                    ? <img src={token.icon} alt={token.symbol} className="w-5 h-5 rounded-full" />
                    : <div className="w-5 h-5 rounded-full" style={{ background: token.color }} />}
                  <span className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: '#E5E2E3' }}>{token.symbol}</span>
                </div>
                <span className="text-sm font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>{amount}</span>
              </div>
            ))}
          </div>

          {/* ── Position Details (collapsible) ── */}
          <div className="rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => setDetailsOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-white/5"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <span className="text-xs font-bold uppercase tracking-widest"
                style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}>
                Position Details
              </span>
              <span
                className="material-symbols-outlined"
                style={{
                  color: '#B9CBBC', fontSize: 18,
                  transform: detailsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              >
                expand_more
              </span>
            </button>

            {detailsOpen && (
              <div className="px-4 pb-3 pt-1 flex flex-col gap-2"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {[
                  { label: 'Entry Value',   value: pool.userEntryValue,                    color: '#B9CBBC' },
                  { label: 'Current Value', value: pool.userValue,                          color: '#E5E2E3' },
                  { label: 'IL Amount',     value: `-$${ilAmount.toFixed(2)} (${ilPct}%)`, color: ilAmount > 0 ? '#FF6464' : '#00E38B' },
                  { label: 'IL Coverage',   value: `${pool.userIlCoverage}%`,              color: '#568DFF' },
                  { label: 'Days in Pool',  value: `${pool.userDaysInPool} days`,           color: '#B9CBBC' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-0.5">
                    <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{row.label}</span>
                    <span className="text-xs font-bold" style={{ color: row.color, fontFamily: 'Inter' }}>{row.value}</span>
                  </div>
                ))}
                {/* Vault health */}
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Vault Health</span>
                  <span className="text-xs font-black uppercase px-2 py-0.5 rounded-sm"
                    style={{
                      fontFamily: 'Inter', fontSize: 9, letterSpacing: '0.08em',
                      color: vaultHealthy ? '#00E38B' : vaultStressed ? '#FF6464' : '#FFB400',
                      background: vaultHealthy ? 'rgba(0,255,157,0.1)' : vaultStressed ? 'rgba(255,100,100,0.1)' : 'rgba(255,180,0,0.1)',
                      border: `1px solid ${vaultHealthy ? 'rgba(0,255,157,0.2)' : vaultStressed ? 'rgba(255,100,100,0.2)' : 'rgba(255,180,0,0.2)'}`,
                    }}>
                    {pool.vaultUtilization}% · {vaultHealthy ? 'Healthy' : vaultStressed ? 'Stressed' : 'Moderate'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── IL Shield Payout — the hero card ── */}
          {ilPayout && daysUntilUnlock === 0 && (
            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                background: 'rgba(0,255,157,0.04)',
                border: '1px solid rgba(0,255,157,0.2)',
                boxShadow: '0 0 32px rgba(0,255,157,0.06)',
              }}
            >
              {/* Top glow line */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(to right, transparent, rgba(0,255,157,0.5), transparent)' }} />

              <div className="px-5 py-4 flex flex-col gap-3">
                {/* Header row */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(0,255,157,0.15)', border: '1px solid rgba(0,255,157,0.25)' }}>
                    <span className="material-symbols-outlined"
                      style={{ color: '#00FF9D', fontSize: 18, fontVariationSettings: "'FILL' 1" }}>
                      verified_user
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-black font-headline" style={{ color: '#00FF9D' }}>
                      IL Shield Active — You're Protected
                    </p>
                    <p className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
                      Your impermanent loss is covered. Here's your payout.
                    </p>
                  </div>
                </div>

                {/* Payout amount — big and prominent */}
                <div className="rounded-lg px-4 py-3 flex items-center justify-between"
                  style={{ background: 'rgba(0,255,157,0.08)', border: '1px solid rgba(0,255,157,0.15)' }}>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs uppercase tracking-widest"
                      style={{ color: '#00E38B', fontFamily: 'Inter', letterSpacing: '0.08em', fontSize: 10 }}>
                      Estimated IL Payout
                    </span>
                    <span className="font-black font-headline text-2xl" style={{ color: '#00FF9D' }}>
                      +${ilPayout} USDC
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Coverage tier</span>
                    <span className="font-black text-lg font-headline" style={{ color: '#00E38B' }}>
                      {pool.userIlCoverage}%
                    </span>
                  </div>
                </div>

                {/* Reassurance message */}
                <p className="text-xs leading-relaxed" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
                  After <span style={{ color: '#E5E2E3', fontWeight: 600 }}>{pool.userDaysInPool} days</span> in the pool,
                  your IL Shield has reached <span style={{ color: '#00E38B', fontWeight: 600 }}>{pool.userIlCoverage}% coverage</span>.
                  The payout is sent automatically in USDC — no claim needed.
                </p>
              </div>
            </div>
          )}

          {/* ── Lock warning ── */}
          {daysUntilUnlock > 0 && (
            <div className="rounded-xl px-4 py-3 flex items-start gap-3"
              style={{ background: 'rgba(255,180,0,0.06)', border: '1px solid rgba(255,180,0,0.15)' }}>
              <span className="material-symbols-outlined mt-0.5 flex-shrink-0"
                style={{ color: '#FFB400', fontSize: 16 }}>lock_clock</span>
              <p className="text-xs leading-relaxed" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
                IL protection unlocks in{' '}
                <span style={{ color: '#FFB400', fontWeight: 600 }}>{daysUntilUnlock} days</span>.
                You can still remove liquidity but won't receive IL coverage.
              </p>
            </div>
          )}

          {/* ── Vault stress warning ── */}
          {vaultStressed && (
            <div className="rounded-xl px-4 py-3 flex items-start gap-3"
              style={{ background: 'rgba(255,100,100,0.06)', border: '1px solid rgba(255,100,100,0.15)' }}>
              <span className="material-symbols-outlined mt-0.5 flex-shrink-0"
                style={{ color: '#FF6464', fontSize: 16 }}>warning</span>
              <p className="text-xs leading-relaxed" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
                Vault utilization is{' '}
                <span style={{ color: '#FF6464', fontWeight: 600 }}>{pool.vaultUtilization}%</span> — payout may be
                partially reduced during high-demand periods.
              </p>
            </div>
          )}

          {/* ── CTA ── */}
          <button
            className="w-full py-4 rounded-xl font-black uppercase tracking-tight transition-all active:scale-[0.98]"
            style={{
              background: percent > 0 ? 'rgba(255,100,100,0.15)' : '#353436',
              color: percent > 0 ? '#FF6464' : '#B9CBBC',
              border: percent > 0 ? '1px solid rgba(255,100,100,0.3)' : '1px solid transparent',
              boxShadow: percent > 0 ? '0 8px 24px -4px rgba(255,100,100,0.15)' : 'none',
              fontFamily: 'Space Grotesk',
              fontWeight: 900,
              fontSize: 16,
              letterSpacing: '-0.025em',
              cursor: percent > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            {percent > 0 ? 'Remove Liquidity' : 'Select Amount'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveLiquidityModal;
