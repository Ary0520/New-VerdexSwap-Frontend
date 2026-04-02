import { useState, useRef, useEffect } from 'react';
import type { Vault } from './earnData';

type Props = {
  vaults: Vault[];
  selected: Vault;
  onChange: (v: Vault) => void;
};

const VaultIcon = ({ vault, size = 24 }: { vault: Vault; size?: number }) => (
  <div className="flex items-center flex-shrink-0" style={{ width: size + 8 }}>
    <div
      className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, background: vault.token0Color, fontSize: size * 0.4, fontFamily: 'Space Grotesk', zIndex: 1 }}
    >
      {vault.token0Symbol}
    </div>
    <div
      className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, background: vault.token1Color, fontSize: size * 0.4, fontFamily: 'Space Grotesk', marginLeft: -(size * 0.35) }}
    >
      {vault.token1Symbol}
    </div>
  </div>
);

const VaultSelector = ({ vaults, selected, onChange }: Props) => {
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
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all hover:brightness-110"
        style={{
          background: '#1C1B1C',
          border: '1px solid rgba(255,255,255,0.08)',
          minWidth: 220,
        }}
      >
        <VaultIcon vault={selected} size={22} />
        <span className="flex-1 text-left text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: '#E5E2E3' }}>
          {selected.label}
        </span>
        <span
          className="material-symbols-outlined flex-shrink-0"
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

      {open && (
        <div
          className="absolute right-0 mt-2 rounded-xl overflow-hidden z-50"
          style={{
            width: '100%',
            minWidth: 220,
            background: '#1C1B1C',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          }}
        >
          {vaults.map((vault) => {
            const isSelected = vault.id === selected.id;
            return (
              <button
                key={vault.id}
                onClick={() => { onChange(vault); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left"
                style={{ background: isSelected ? 'rgba(0,255,157,0.08)' : 'transparent' }}
                onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <VaultIcon vault={vault} size={20} />
                <span className="text-sm font-bold flex-1" style={{ fontFamily: 'Space Grotesk', color: isSelected ? '#00FF9D' : '#E5E2E3' }}>
                  {vault.label}
                </span>
                {isSelected && (
                  <span className="material-symbols-outlined" style={{ color: '#00FF9D', fontSize: 16 }}>check</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VaultSelector;
