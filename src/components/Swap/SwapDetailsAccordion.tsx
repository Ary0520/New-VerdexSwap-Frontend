import type { TokenSymbol } from '../../lib/contracts';

type Props = {
  fromSymbol: TokenSymbol;
  toSymbol: TokenSymbol;
  rate: string | null;
  amountOut: string;
  fees: { vaultFeeBps: number; treasuryFeeBps: number; lpFeeBps: number };
  slippageBps: number;
  priceImpactPct: string;
};

const bpsToLabel = (bps: number) => `${(bps / 100).toFixed(2)}%`;

const SwapDetailsAccordion = ({
  fromSymbol, toSymbol, rate, amountOut, fees, slippageBps, priceImpactPct,
}: Props) => {
  const out = parseFloat(amountOut) || 0;

  const vaultFee    = out > 0 ? (out * fees.vaultFeeBps    / 10000).toFixed(4) : '—';
  const treasuryFee = out > 0 ? (out * fees.treasuryFeeBps / 10000).toFixed(4) : '—';
  const lpFee       = out > 0 ? (out * fees.lpFeeBps       / 10000).toFixed(4) : '—';
  const minReceived = out > 0 ? (out * (10000 - slippageBps) / 10000).toFixed(4) : '—';

  return (
    <div className="rounded-lg p-4 flex flex-col gap-3"
      style={{ background: 'rgba(255,255,255,0.05)' }}>

      {/* Rate */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Rate</span>
        <span className="text-xs font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>
          {rate ? `1 ${fromSymbol} = ${rate} ${toSymbol}` : '—'}
        </span>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

      {/* Price impact — real, from reserves */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Price Impact</span>
          <span className="material-symbols-outlined" style={{ color: '#B9CBBC', fontSize: 12 }}>info</span>
        </div>
        <span
          className="text-xs font-medium"
          style={{
            fontFamily: 'Inter',
            color: priceImpactPct === '—' ? '#E5E2E3'
              : parseFloat(priceImpactPct) > 5 ? '#FF6464'
              : parseFloat(priceImpactPct) > 1 ? '#FFB400'
              : '#00E38B',
          }}
        >
          {priceImpactPct}
        </span>
      </div>

      {/* Min received */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Minimum Received</span>
        <span className="text-xs font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>
          {minReceived !== '—' ? `${minReceived} ${toSymbol}` : '—'}
        </span>
      </div>

      {/* Vault fee */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
          Vault Fee (IL Shield) · {bpsToLabel(fees.vaultFeeBps)}
        </span>
        <span className="text-xs font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>
          {vaultFee !== '—' ? `${vaultFee} ${toSymbol}` : '—'}
        </span>
      </div>

      {/* Treasury fee */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
          Treasury Fee · {bpsToLabel(fees.treasuryFeeBps)}
        </span>
        <span className="text-xs font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>
          {treasuryFee !== '—' ? `${treasuryFee} ${toSymbol}` : '—'}
        </span>
      </div>

      {/* LP fee */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
          LP Fee · {bpsToLabel(fees.lpFeeBps)}
        </span>
        <span className="text-xs font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>
          {lpFee !== '—' ? `${lpFee} ${toSymbol}` : '—'}
        </span>
      </div>

      {/* Route */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Route</span>
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>{fromSymbol}</span>
          <span className="material-symbols-outlined" style={{ color: '#E5E2E3', fontSize: 12 }}>arrow_forward</span>
          <span className="text-xs font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>{toSymbol}</span>
        </div>
      </div>

      {/* Slippage */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Slippage Tolerance</span>
        <span className="text-xs font-bold" style={{ color: '#00E38B', fontFamily: 'Inter' }}>
          {bpsToLabel(slippageBps)}
        </span>
      </div>
    </div>
  );
};

export default SwapDetailsAccordion;
