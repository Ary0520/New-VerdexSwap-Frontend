import TokenSelector from '../shared/TokenSelector';
import { type Token } from '../shared/tokens';

type Props = {
  value: string;
  token: Token;
  onTokenChange: (t: Token) => void;
  excludeSymbol?: string;
  balance?: string;
  usdValue?: string;
  noRoute?: boolean;
};

const SwapToSection = ({
  value, token, onTokenChange, excludeSymbol,
  balance = '—', usdValue, noRoute,
}: Props) => {
  return (
    <div
      className="relative rounded-lg px-5 pt-5 pb-4"
      style={{
        background: 'rgba(14,14,15,0.5)',
        border: '1px solid rgba(255,255,255,0.05)',
        minHeight: 120,
      }}
    >
      {/* Row 1 */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-widest"
          style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}>
          To
        </span>
        <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
          Balance: {balance} {token.symbol}
        </span>
      </div>

      {/* Row 2 */}
      <div className="flex items-center gap-3">
        {noRoute ? (
          <span className="text-sm flex-1" style={{ color: '#FF6464', fontFamily: 'Inter' }}>
            No route found
          </span>
        ) : (
          <span
            className="font-bold flex-1 min-w-0"
            style={{
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 30,
              color: value === '...' ? '#B9CBBC' : '#E5E2E3',
            }}
          >
            {value || '0.0'}
          </span>
        )}
        <TokenSelector selected={token} onChange={onTokenChange} exclude={excludeSymbol} />
      </div>

      {/* Row 3: USD value */}
      {usdValue && !noRoute && (
        <div className="mt-2">
          <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{usdValue}</span>
        </div>
      )}
    </div>
  );
};

export default SwapToSection;
