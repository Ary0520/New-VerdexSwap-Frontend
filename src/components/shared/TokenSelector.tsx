import { useState, useRef, useEffect } from 'react';
import { TOKEN_LIST, type Token } from './tokens';

type Props = {
  selected: Token;
  onChange: (token: Token) => void;
  exclude?: string; // symbol to exclude (the other selected token)
};

const TokenIcon = ({ token, size = 20 }: { token: Token; size?: number }) => {
  if (token.icon) {
    return (
      <img
        src={token.icon}
        alt={token.symbol}
        className="rounded-full flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white"
      style={{
        width: size,
        height: size,
        background: token.color,
        fontSize: size * 0.36,
        fontFamily: 'Space Grotesk',
      }}
    >
      {token.symbol.slice(0, 2)}
    </div>
  );
};

const TokenSelector = ({ selected, onChange, exclude }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const options = TOKEN_LIST.filter((t) => t.symbol !== exclude);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:brightness-110 active:scale-95"
        style={{
          background: '#353436',
          border: '1px solid rgba(255,255,255,0.06)',
          minWidth: 100,
        }}
      >
        <TokenIcon token={selected} size={20} />
        <span
          className="font-bold text-sm flex-1 text-left"
          style={{ fontFamily: 'Space Grotesk', color: '#E5E2E3', lineHeight: 1 }}
        >
          {selected.symbol}
        </span>
        <span
          className="material-symbols-outlined flex-shrink-0 transition-transform"
          style={{
            color: '#B9CBBC',
            fontSize: 18,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s',
          }}
        >
          expand_more
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 rounded-xl overflow-hidden z-50"
          style={{
            width: 200,
            background: '#1C1B1C',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          }}
        >
          <div className="px-3 py-2 border-b border-white/5">
            <p className="text-xs uppercase tracking-widest" style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}>
              Select Token
            </p>
          </div>
          {options.map((token) => {
            const isSelected = token.symbol === selected.symbol;
            return (
              <button
                key={token.symbol}
                type="button"
                onClick={() => { onChange(token); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left"
                style={{
                  background: isSelected ? 'rgba(0,255,157,0.08)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                <TokenIcon token={token} size={28} />
                <div className="flex flex-col min-w-0">
                  <span
                    className="text-sm font-bold leading-tight"
                    style={{
                      fontFamily: 'Space Grotesk',
                      color: isSelected ? '#00FF9D' : '#E5E2E3',
                    }}
                  >
                    {token.symbol}
                  </span>
                  <span
                    className="text-xs leading-tight truncate"
                    style={{ fontFamily: 'Inter', color: '#B9CBBC' }}
                  >
                    {token.name}
                  </span>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined ml-auto flex-shrink-0" style={{ color: '#00FF9D', fontSize: 16 }}>
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TokenSelector;
export { TokenIcon };
