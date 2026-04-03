import { useRef, useEffect } from 'react';

type Props = {
  slippageBps: number;
  onSlippageChange: (bps: number) => void;
  deadlineMinutes: number;
  onDeadlineChange: (min: number) => void;
  onClose: () => void;
};

const SLIPPAGE_PRESETS = [10, 50, 100]; // 0.1%, 0.5%, 1.0%

const SwapSettings = ({
  slippageBps, onSlippageChange,
  deadlineMinutes, onDeadlineChange,
  onClose,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const customSlippage = !SLIPPAGE_PRESETS.includes(slippageBps);
  const slippagePct = (slippageBps / 100).toFixed(slippageBps % 100 === 0 ? 1 : 2);

  const handleCustomSlippage = (val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0 && num <= 50) {
      onSlippageChange(Math.round(num * 100));
    }
  };

  const isHighSlippage = slippageBps > 100;
  const isFrontrunRisk = slippageBps > 500;

  return (
    <div
      ref={ref}
      className="absolute top-16 right-4 z-50 rounded-xl p-5 flex flex-col gap-5"
      style={{
        width: 320,
        background: '#1C1B1C',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold font-headline" style={{ color: '#E5E2E3' }}>
          Transaction Settings
        </span>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-white/5"
          style={{ color: '#B9CBBC' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
        </button>
      </div>

      {/* Slippage tolerance */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-widest"
            style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}>
            Slippage Tolerance
          </span>
          <span className="material-symbols-outlined" style={{ color: '#B9CBBC', fontSize: 13 }}>info</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Preset buttons */}
          {SLIPPAGE_PRESETS.map((bps) => (
            <button
              key={bps}
              onClick={() => onSlippageChange(bps)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                fontFamily: 'Inter',
                background: slippageBps === bps ? 'rgba(0,255,157,0.15)' : '#353436',
                color: slippageBps === bps ? '#00FF9D' : '#B9CBBC',
                border: slippageBps === bps ? '1px solid rgba(0,255,157,0.3)' : '1px solid transparent',
              }}
            >
              {(bps / 100).toFixed(1)}%
            </button>
          ))}

          {/* Custom input */}
          <div
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg flex-1"
            style={{
              background: customSlippage ? 'rgba(0,255,157,0.08)' : '#353436',
              border: customSlippage ? '1px solid rgba(0,255,157,0.3)' : '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <input
              type="number"
              min="0.01"
              max="50"
              step="0.1"
              placeholder="Custom"
              defaultValue={customSlippage ? slippagePct : ''}
              onChange={(e) => handleCustomSlippage(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-bold w-full"
              style={{ color: customSlippage ? '#00FF9D' : '#B9CBBC', fontFamily: 'Inter' }}
            />
            <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>%</span>
          </div>
        </div>

        {/* Current value display */}
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
            Current: <span style={{ color: isHighSlippage ? '#FFB400' : '#00E38B', fontWeight: 600 }}>
              {slippagePct}%
            </span>
          </span>
          {isFrontrunRisk && (
            <span className="text-xs font-bold flex items-center gap-1" style={{ color: '#FF6464', fontFamily: 'Inter' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>warning</span>
              Frontrun risk
            </span>
          )}
          {isHighSlippage && !isFrontrunRisk && (
            <span className="text-xs font-bold flex items-center gap-1" style={{ color: '#FFB400', fontFamily: 'Inter' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>warning</span>
              High slippage
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

      {/* Transaction deadline */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-bold uppercase tracking-widest"
          style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}>
          Transaction Deadline
        </span>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg flex-1"
            style={{ background: '#353436', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <input
              type="number"
              min="1"
              max="4320"
              value={deadlineMinutes}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                if (!isNaN(v) && v >= 1 && v <= 4320) onDeadlineChange(v);
              }}
              className="bg-transparent border-none outline-none text-sm font-bold w-full"
              style={{ color: '#E5E2E3', fontFamily: 'Space Grotesk' }}
            />
          </div>
          <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>minutes</span>
        </div>

        <p className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter', opacity: 0.7 }}>
          Transaction reverts if not confirmed within this time.
        </p>
      </div>
    </div>
  );
};

export default SwapSettings;
