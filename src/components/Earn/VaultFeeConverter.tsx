import { useState } from 'react';
import type { Vault } from './earnData';
import { CONVERTER_TOKENS, type ConverterToken } from './earnData';

type Props = { vault: Vault };

const TokenIcon = ({ token }: { token: ConverterToken }) => {
  if (token.icon) {
    return <img src={token.icon} alt={token.symbol} className="rounded-full flex-shrink-0" style={{ width: 22, height: 22 }} />;
  }
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: 22, height: 22, background: token.color, fontSize: 8, fontFamily: 'Space Grotesk' }}>
      {token.symbol.slice(0, 2)}
    </div>
  );
};

type TooltipProps = { text: string; children: React.ReactNode };
const Tooltip = ({ text, children }: TooltipProps) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap pointer-events-none z-50"
          style={{
            background: '#0E0E0F',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#B9CBBC',
            fontFamily: 'Inter',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

const VaultFeeConverter = ({ vault }: Props) => {
  const [converting, setConverting] = useState<string | null>(null);
  const [justConverted, setJustConverted] = useState<string | null>(null);
  const tokens = CONVERTER_TOKENS[vault.id] ?? [];

  const isActive = (t: ConverterToken) =>
    t.cooldownMinutes === 0 && !t.balanceTooLow && !t.twapStale;

  const disabledReason = (t: ConverterToken): string => {
    if (t.twapStale)           return 'TWAP price stale — wait for oracle update';
    if (t.balanceTooLow)       return 'Below $10 minimum threshold';
    if (t.cooldownMinutes > 0) return `Cooldown active — ${t.cooldownMinutes} min remaining`;
    return '';
  };

  const handleConvert = (symbol: string) => {
    setConverting(symbol);
    setTimeout(() => {
      setConverting(null);
      setJustConverted(symbol);
      setTimeout(() => setJustConverted(null), 2500);
    }, 1600);
  };

  const readyCount = tokens.filter(isActive).length;

  return (
    <div
      className="relative mt-5 rounded-xl overflow-hidden"
      style={{
        border: '1px solid rgba(0,255,157,0.2)',
        boxShadow: '0 0 40px rgba(0,255,157,0.06), inset 0 1px 0 rgba(0,255,157,0.08)',
        background: 'rgba(14,14,15,0.8)',
      }}
    >
      {/* Subtle top glow bar */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(0,255,157,0.5), transparent)' }}
      />

      {/* Header */}
      <div
        className="relative flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid rgba(0,255,157,0.1)', background: 'rgba(0,255,157,0.03)' }}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(0,255,157,0.12)', border: '1px solid rgba(0,255,157,0.2)' }}
          >
            <span className="material-symbols-outlined" style={{ color: '#00FF9D', fontSize: 18, fontVariationSettings: "'FILL' 1" }}>
              currency_exchange
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="font-black text-base font-headline" style={{ color: '#E5E2E3', letterSpacing: '-0.01em' }}>
                Vault Fee Converter
              </span>
              {/* Earn Bonus badge */}
              <span
                className="text-xs font-black uppercase px-2 py-0.5 rounded-sm tracking-widest"
                style={{
                  fontFamily: 'Inter',
                  fontSize: 9,
                  letterSpacing: '0.1em',
                  color: '#007143',
                  background: '#00FF9D',
                  boxShadow: '0 0 8px rgba(0,255,157,0.4)',
                }}
              >
                Earn Bonus
              </span>
              {/* Ready indicator */}
              {readyCount > 0 && (
                <span
                  className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    fontFamily: 'Inter',
                    color: '#00E38B',
                    background: 'rgba(0,255,157,0.1)',
                    border: '1px solid rgba(0,255,157,0.2)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00FF9D' }} />
                  {readyCount} ready
                </span>
              )}
            </div>
            <p className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
              Convert accumulated swap fees to USDC and earn a bonus. Anyone can call this.
            </p>
          </div>
        </div>
      </div>

      {/* Table header */}
      <div
        className="grid items-center px-5 py-2.5 text-xs font-bold uppercase"
        style={{
          gridTemplateColumns: '1fr 120px 120px 110px 100px 120px',
          color: '#B9CBBC',
          fontFamily: 'Inter',
          letterSpacing: '0.08em',
          fontSize: 10,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <span>Token</span>
        <span>Accumulated</span>
        <span>Est. USDC Out</span>
        <span>Your Bonus</span>
        <span>Cooldown</span>
        <span />
      </div>

      {/* Rows */}
      {tokens.length === 0 ? (
        <div className="flex items-center justify-center py-10">
          <span className="text-sm" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>No convertible tokens for this vault.</span>
        </div>
      ) : (
        tokens.map((token, i) => {
          const active = isActive(token);
          const reason = disabledReason(token);
          const isConverting = converting === token.symbol;
          const converted = justConverted === token.symbol;
          const isLast = i === tokens.length - 1;

          return (
            <div
              key={token.symbol}
              className="grid items-center px-5 py-4 transition-colors"
              style={{
                gridTemplateColumns: '1fr 120px 120px 110px 100px 120px',
                background: active
                  ? (i % 2 === 0 ? 'rgba(0,255,157,0.02)' : 'rgba(0,255,157,0.015)')
                  : (i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'),
                borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)',
              }}
            >
              {/* Token */}
              <div className="flex items-center gap-2.5">
                <TokenIcon token={token} />
                <span className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: '#E5E2E3' }}>
                  {token.symbol}
                </span>
              </div>

              {/* Accumulated */}
              <span className="text-sm font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>
                {token.accumulated}
              </span>

              {/* Est. USDC Out */}
              <span className="text-sm font-bold" style={{ color: '#00E38B', fontFamily: 'Inter' }}>
                {token.estUsdcOut}
              </span>

              {/* Your Bonus — highlighted */}
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ color: '#56FFA8', fontSize: 14, fontVariationSettings: "'FILL' 1" }}>
                  toll
                </span>
                <span className="text-sm font-black" style={{ color: '#56FFA8', fontFamily: 'Inter' }}>
                  {token.yourBonus}
                </span>
              </div>

              {/* Cooldown */}
              <div>
                {token.cooldownMinutes > 0 ? (
                  <span
                    className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg"
                    style={{
                      fontFamily: 'Inter',
                      color: '#FFB400',
                      background: 'rgba(255,180,0,0.1)',
                      border: '1px solid rgba(255,180,0,0.2)',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>timer</span>
                    {token.cooldownMinutes}m
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 text-xs font-black uppercase px-2.5 py-1 rounded-lg tracking-widest"
                    style={{
                      fontFamily: 'Inter',
                      fontSize: 9,
                      letterSpacing: '0.08em',
                      color: '#00E38B',
                      background: 'rgba(0,255,157,0.1)',
                      border: '1px solid rgba(0,255,157,0.2)',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#00FF9D' }} />
                    Ready
                  </span>
                )}
              </div>

              {/* Action */}
              <div className="flex justify-end">
                {converted ? (
                  <span
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black"
                    style={{ color: '#00E38B', fontFamily: 'Space Grotesk', background: 'rgba(0,255,157,0.1)', border: '1px solid rgba(0,255,157,0.2)' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span>
                    Done
                  </span>
                ) : active ? (
                  <button
                    onClick={() => handleConvert(token.symbol)}
                    disabled={isConverting}
                    className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-tight transition-all active:scale-95"
                    style={{
                      fontFamily: 'Space Grotesk',
                      fontWeight: 900,
                      fontSize: 12,
                      letterSpacing: '-0.01em',
                      background: isConverting ? 'rgba(0,255,157,0.3)' : '#00FF9D',
                      color: isConverting ? '#00E38B' : '#007143',
                      boxShadow: isConverting ? 'none' : '0 0 16px rgba(0,255,157,0.35)',
                      cursor: isConverting ? 'wait' : 'pointer',
                      minWidth: 90,
                    }}
                  >
                    {isConverting ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <span className="material-symbols-outlined animate-spin" style={{ fontSize: 14 }}>progress_activity</span>
                        Converting
                      </span>
                    ) : 'Convert →'}
                  </button>
                ) : (
                  <Tooltip text={reason}>
                    <button
                      disabled
                      className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-tight cursor-not-allowed"
                      style={{
                        fontFamily: 'Space Grotesk',
                        fontWeight: 900,
                        fontSize: 12,
                        letterSpacing: '-0.01em',
                        background: '#252526',
                        color: '#3B4A3F',
                        border: '1px solid rgba(255,255,255,0.04)',
                        minWidth: 90,
                      }}
                    >
                      Convert
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default VaultFeeConverter;
