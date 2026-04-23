import { PAIRS, type PairKey, type TokenSymbol } from '../../lib/contracts';
import { useFeeConverterPreview } from '../../hooks/useFeeConverter';
import { useConvertFees } from '../../hooks/useVaultActions';

// Non-USDC tokens that can accumulate as fees in each pair
const PAIR_FEE_TOKENS: Record<PairKey, TokenSymbol[]> = {
  'WETH/USDC': ['WETH'],
  'WBTC/USDC': ['WBTC'],
  'ARB/USDC':  ['ARB'],
  'DAI/USDC':  ['DAI'],
  'WETH/DAI':  ['WETH', 'DAI'],
};

const TOKEN_ICONS: Record<string, string> = {
  WETH: '/swap-icons/eth-icon-56586a.png',
  USDC: '/swap-icons/usdc-icon-56586a.png',
};
const TOKEN_COLORS: Record<string, string> = {
  WETH: '#627EEA', WBTC: '#F7931A', ARB: '#12AAFF', DAI: '#F5AC37',
};

const TokenIcon = ({ symbol }: { symbol: string }) => {
  const icon = TOKEN_ICONS[symbol];
  if (icon) return <img src={icon} alt={symbol} className="rounded-full flex-shrink-0" style={{ width: 22, height: 22 }} />;
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: 22, height: 22, background: TOKEN_COLORS[symbol] ?? '#888', fontSize: 8, fontFamily: 'Space Grotesk' }}>
      {symbol.slice(0, 2)}
    </div>
  );
};

type RowProps = { pairKey: PairKey; tokenSymbol: TokenSymbol; isLast: boolean; index: number };

const FeeRow = ({ pairKey, tokenSymbol, isLast, index }: RowProps) => {
  const pair = PAIRS[pairKey];
  const { accumulated, estUsdcOut, yourBonus, cooldownMinutes, convertible, isLoading } = useFeeConverterPreview(pair.address, tokenSymbol);
  const { convert, status } = useConvertFees();

  const isConverting = status === 'pending';
  const isDone = status === 'success';

  return (
    <div className="grid items-center px-5 py-4 transition-colors"
      style={{
        gridTemplateColumns: '1fr 120px 120px 110px 100px 120px',
        background: convertible
          ? (index % 2 === 0 ? 'rgba(0,255,157,0.02)' : 'rgba(0,255,157,0.015)')
          : (index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'),
        borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)',
      }}>
      <div className="flex items-center gap-2.5">
        <TokenIcon symbol={tokenSymbol} />
        <span className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: '#E5E2E3' }}>{tokenSymbol}</span>
      </div>

      <span className="text-sm font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>
        {isLoading ? '…' : accumulated}
      </span>

      <span className="text-sm font-bold" style={{ color: '#00E38B', fontFamily: 'Inter' }}>
        {isLoading ? '…' : estUsdcOut}
      </span>

      <div className="flex items-center gap-1.5">
        <span className="material-symbols-outlined" style={{ color: '#56FFA8', fontSize: 14, fontVariationSettings: "'FILL' 1" }}>toll</span>
        <span className="text-sm font-black" style={{ color: '#56FFA8', fontFamily: 'Inter' }}>
          {isLoading ? '…' : yourBonus}
        </span>
      </div>

      <div>
        {cooldownMinutes > 0 ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg"
            style={{ fontFamily: 'Inter', color: '#FFB400', background: 'rgba(255,180,0,0.1)', border: '1px solid rgba(255,180,0,0.2)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>timer</span>
            {cooldownMinutes}m
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-black uppercase px-2.5 py-1 rounded-lg tracking-widest"
            style={{ fontFamily: 'Inter', fontSize: 9, letterSpacing: '0.08em', color: '#00E38B', background: 'rgba(0,255,157,0.1)', border: '1px solid rgba(0,255,157,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#00FF9D' }} />
            Ready
          </span>
        )}
      </div>

      <div className="flex justify-end">
        {isDone ? (
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black"
            style={{ color: '#00E38B', fontFamily: 'Space Grotesk', background: 'rgba(0,255,157,0.1)', border: '1px solid rgba(0,255,157,0.2)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span>Done
          </span>
        ) : convertible ? (
          <button onClick={() => convert(pair.address, tokenSymbol)} disabled={isConverting}
            className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-tight transition-all active:scale-95"
            style={{
              fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 12, letterSpacing: '-0.01em',
              background: isConverting ? 'rgba(0,255,157,0.3)' : '#00FF9D',
              color: isConverting ? '#00E38B' : '#007143',
              boxShadow: isConverting ? 'none' : '0 0 16px rgba(0,255,157,0.35)',
              cursor: isConverting ? 'wait' : 'pointer', minWidth: 90,
            }}>
            {isConverting ? (
              <span className="flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 14 }}>progress_activity</span>
                Converting
              </span>
            ) : 'Convert →'}
          </button>
        ) : (
          <button disabled className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-tight cursor-not-allowed"
            style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 12, letterSpacing: '-0.01em', background: '#252526', color: '#3B4A3F', border: '1px solid rgba(255,255,255,0.04)', minWidth: 90 }}>
            Convert
          </button>
        )}
      </div>
    </div>
  );
};

const VaultFeeConverter = ({ pairKey }: { pairKey: PairKey }) => {
  const tokens = PAIR_FEE_TOKENS[pairKey] ?? [];

  return (
    <div className="relative mt-5 rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(0,255,157,0.2)', boxShadow: '0 0 40px rgba(0,255,157,0.06), inset 0 1px 0 rgba(0,255,157,0.08)', background: 'rgba(14,14,15,0.8)' }}>
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(0,255,157,0.5), transparent)' }} />

      {/* Header */}
      <div className="relative flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid rgba(0,255,157,0.1)', background: 'rgba(0,255,157,0.03)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(0,255,157,0.12)', border: '1px solid rgba(0,255,157,0.2)' }}>
            <span className="material-symbols-outlined" style={{ color: '#00FF9D', fontSize: 18, fontVariationSettings: "'FILL' 1" }}>currency_exchange</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="font-black text-base font-headline" style={{ color: '#E5E2E3', letterSpacing: '-0.01em' }}>Vault Fee Converter</span>
              <span className="text-xs font-black uppercase px-2 py-0.5 rounded-sm tracking-widest"
                style={{ fontFamily: 'Inter', fontSize: 9, letterSpacing: '0.1em', color: '#007143', background: '#00FF9D', boxShadow: '0 0 8px rgba(0,255,157,0.4)' }}>
                Earn Bonus
              </span>
            </div>
            <p className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
              Convert accumulated swap fees to USDC and earn a bonus. Anyone can call this.
            </p>
          </div>
        </div>
      </div>

      {/* Table header */}
      <div className="grid items-center px-5 py-2.5 text-xs font-bold uppercase"
        style={{ gridTemplateColumns: '1fr 120px 120px 110px 100px 120px', color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em', fontSize: 10, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
        <span>Token</span><span>Accumulated</span><span>Est. USDC Out</span><span>Your Bonus</span><span>Cooldown</span><span />
      </div>

      {tokens.length === 0 ? (
        <div className="flex items-center justify-center py-10">
          <span className="text-sm" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>No convertible tokens for this vault.</span>
        </div>
      ) : (
        tokens.map((sym, i) => (
          <FeeRow key={sym} pairKey={pairKey} tokenSymbol={sym} isLast={i === tokens.length - 1} index={i} />
        ))
      )}
    </div>
  );
};

export default VaultFeeConverter;
