import TokenSelector from '../shared/TokenSelector';
import { type Token } from '../shared/tokens';

type Props = {
  value: string;
  onChange: (v: string) => void;
  token: Token;
  onTokenChange: (t: Token) => void;
  excludeSymbol?: string;
  balance?: string;
  usdValue?: string;
  onPercent?: (pct: number) => void;
  insufficientBalance?: boolean;
};

const SwapFromSection = ({
  value, onChange, token, onTokenChange, excludeSymbol,
  balance = '—', usdValue, onPercent, insufficientBalance,
}: Props) => {
  return (
    <div
      className="relative rounded-lg px-5 pt-5 pb-4 transition-colors"
      style={{
        background: 'rgba(14,14,15,0.5)',
        border: `1px solid ${insufficientBalance ? 'rgba(255,100,100,0.3)' : 'rgba(255,255,255,0.05)'}`,
        minHeight: 120,
      }}
    >
      {/* Row 1 */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-widest"
          style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}>
          From
        </span>
        <div className="flex items-center gap-2">
          <span
            className="text-xs"
            style={{ color: insufficientBalance ? '#FF6464' : '#B9CBBC', fontFamily: 'Inter' }}
          >
            Balance: {balance} {token.symbol}
          </span>
          <button
            onClick={() => onPercent?.(50)}
            className="px-2 py-0.5 rounded text-xs font-bold transition-colors hover:brightness-110"
            style={{ background: '#353436', color: '#E5E2E3', fontFamily: 'Inter' }}
          >
            50%
          </button>
          <button
            onClick={() => onPercent?.(100)}
            className="px-2 py-0.5 rounded text-xs font-bold transition-colors hover:brightness-110"
            style={{ background: 'rgba(0,255,157,0.2)', color: '#56FFA8', fontFamily: 'Inter' }}
          >
            MAX
          </button>
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent border-none outline-none p-0 font-bold flex-1 min-w-0"
          style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 30, color: '#E5E2E3' }}
          placeholder="0.0"
        />
        <TokenSelector selected={token} onChange={onTokenChange} exclude={excludeSymbol} />
      </div>

      {/* Row 3: USD value */}
      {usdValue && (
        <div className="mt-2">
          <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{usdValue}</span>
        </div>
      )}
    </div>
  );
};

export default SwapFromSection;
