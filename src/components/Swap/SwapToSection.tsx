import TokenSelector from '../shared/TokenSelector';
import { type Token } from '../shared/tokens';

type Props = {
  value: string;
  token: Token;
  onTokenChange: (t: Token) => void;
  excludeSymbol?: string;
};

const SwapToSection = ({ value, token, onTokenChange, excludeSymbol }: Props) => {
  return (
    <div
      className="relative rounded-lg px-5 pt-5 pb-4"
      style={{
        background: 'rgba(14,14,15,0.5)',
        border: '1px solid rgba(255,255,255,0.05)',
        minHeight: 120,
      }}
    >
      {/* Row 1: TO label + balance */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}
        >
          To
        </span>
        <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
          Balance: 450 {token.symbol}
        </span>
      </div>

      {/* Row 2: Output + token selector */}
      <div className="flex items-center gap-3">
        <span
          className="font-bold flex-1 min-w-0"
          style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 30, color: '#E5E2E3' }}
        >
          {value || '0.0'}
        </span>
        <TokenSelector selected={token} onChange={onTokenChange} exclude={excludeSymbol} />
      </div>

      {/* Row 3: USD value + price impact */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
          ≈ $2,340.50
        </span>
        <span className="text-xs font-bold" style={{ color: '#00E38B', fontFamily: 'Inter' }}>
          Price Impact: -0.21%
        </span>
      </div>
    </div>
  );
};

export default SwapToSection;
