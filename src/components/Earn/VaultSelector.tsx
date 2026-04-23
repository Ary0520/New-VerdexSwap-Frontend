import { useState, useRef, useEffect } from 'react';
import { PAIRS, TOKENS, type PairKey, type TokenSymbol } from '../../lib/contracts';

const TOKEN_COLORS: Record<string, string> = {
  WETH: '#627EEA', USDC: '#2775CA', WBTC: '#F7931A', ARB: '#12AAFF', DAI: '#F5AC37',
};
const TOKEN_ICONS: Record<string, string> = {
  WETH: '/swap-icons/eth-icon-56586a.png',
  USDC: '/swap-icons/usdc-icon-56586a.png',
};

const PairIcon = ({ pairKey, size = 22 }: { pairKey: PairKey; size?: number }) => {
  const pair = PAIRS[pairKey];
  const s0 = pair.token0 as TokenSymbol;
  const s1 = pair.token1 as TokenSymbol;
  const icon0 = TOKEN_ICONS[s0];
  const icon1 = TOKEN_ICONS[s1];
  const color0 = TOKEN_COLORS[s0] ?? '#888';
  const color1 = TOKEN_COLORS[s1] ?? '#888';

  const Tok = ({ sym, icon, color }: { sym: string; icon?: string; color: string }) =>
    icon
      ? <img src={icon} alt={sym} className="rounded-full flex-shrink-0" style={{ width: size, height: size }} />
      : <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
          style={{ width: size, height: size, background: color, fontSize: size * 0.38, fontFamily: 'Space Grotesk' }}>
          {sym.slice(0, 2)}
        </div>;

  return (
    <div className="flex items-center flex-shrink-0">
      <Tok sym={s0} icon={icon0} color={color0} />
      <div style={{ marginLeft: -(size * 0.35) }}>
        <Tok sym={s1} icon={icon1} color={color1} />
      </div>
    </div>
  );
};

type Props = {
  pairKeys: PairKey[];
  selected: PairKey;
  onChange: (k: PairKey) => void;
};

const VaultSelector = ({ pairKeys, selected, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all hover:brightness-110"
        style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.08)', minWidth: 220 }}
      >
        <PairIcon pairKey={selected} size={22} />
        <span className="flex-1 text-left text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: '#E5E2E3' }}>
          {selected} Vault
        </span>
        <span className="material-symbols-outlined flex-shrink-0"
          style={{ color: '#B9CBBC', fontSize: 18, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
          expand_more
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 rounded-xl overflow-hidden z-50"
          style={{ width: '100%', minWidth: 220, background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
          {pairKeys.map((key) => {
            const isSelected = key === selected;
            return (
              <button key={key} onClick={() => { onChange(key); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left"
                style={{ background: isSelected ? 'rgba(0,255,157,0.08)' : 'transparent' }}
                onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <PairIcon pairKey={key} size={20} />
                <span className="text-sm font-bold flex-1" style={{ fontFamily: 'Space Grotesk', color: isSelected ? '#00FF9D' : '#E5E2E3' }}>
                  {key} Vault
                </span>
                {isSelected && <span className="material-symbols-outlined" style={{ color: '#00FF9D', fontSize: 16 }}>check</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VaultSelector;
