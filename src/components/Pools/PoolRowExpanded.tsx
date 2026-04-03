import type { PairKey } from '../../lib/contracts';
import { usePairData } from '../../hooks/usePools';

type Props = {
  pairKey: PairKey;
  onAddLiquidity: () => void;
  onRemoveLiquidity: () => void;
};

const PoolRowExpanded = ({ pairKey, onAddLiquidity, onRemoveLiquidity }: Props) => {
  const d = usePairData(pairKey);

  return (
    <div className="px-6 pb-5 grid grid-cols-1 md:grid-cols-3 gap-4"
      style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>

      {/* Reserves */}
      <div className="rounded-lg p-4 flex flex-col gap-2"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-1"
          style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}>Reserves</p>
        <div className="flex justify-between text-xs" style={{ fontFamily: 'Inter' }}>
          <span style={{ color: '#B9CBBC' }}>{d.t0.symbol}</span>
          <span style={{ color: '#E5E2E3', fontWeight: 500 }}>{d.reserve0Fmt}</span>
        </div>
        <div className="flex justify-between text-xs" style={{ fontFamily: 'Inter' }}>
          <span style={{ color: '#B9CBBC' }}>{d.t1.symbol}</span>
          <span style={{ color: '#E5E2E3', fontWeight: 500 }}>{d.reserve1Fmt}</span>
        </div>
        <div className="mt-1 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex justify-between text-xs" style={{ fontFamily: 'Inter' }}>
            <span style={{ color: '#B9CBBC' }}>Vault Reserve</span>
            <span style={{ color: '#00E38B', fontWeight: 500 }}>${d.usdcReserveFmt}</span>
          </div>
          <div className="flex justify-between text-xs mt-1.5" style={{ fontFamily: 'Inter' }}>
            <span style={{ color: '#B9CBBC' }}>Vault Utilization</span>
            <span style={{
              color: d.utilizationPct > 75 ? '#FF6464' : d.utilizationPct > 50 ? '#FFB400' : '#00E38B',
              fontWeight: 500,
            }}>{d.utilizationPct.toFixed(1)}%</span>
          </div>
          <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full transition-all" style={{
              width: `${Math.min(100, d.utilizationPct)}%`,
              background: d.utilizationPct > 75 ? '#FF6464' : d.utilizationPct > 50 ? '#FFB400' : '#00E38B',
            }} />
          </div>
        </div>
      </div>

      {/* Your Position */}
      <div className="rounded-lg p-4 flex flex-col gap-2"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-1"
          style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}>Your Position</p>
        {d.hasPosition ? (
          <>
            <div className="flex justify-between text-xs" style={{ fontFamily: 'Inter' }}>
              <span style={{ color: '#B9CBBC' }}>LP Tokens</span>
              <span style={{ color: '#E5E2E3', fontWeight: 500 }}>{d.userLpFmt}</span>
            </div>
            <div className="flex justify-between text-xs" style={{ fontFamily: 'Inter' }}>
              <span style={{ color: '#B9CBBC' }}>{d.t0.symbol}</span>
              <span style={{ color: '#E5E2E3', fontWeight: 500 }}>{d.userToken0}</span>
            </div>
            <div className="flex justify-between text-xs" style={{ fontFamily: 'Inter' }}>
              <span style={{ color: '#B9CBBC' }}>{d.t1.symbol}</span>
              <span style={{ color: '#E5E2E3', fontWeight: 500 }}>{d.userToken1}</span>
            </div>
            <div className="flex justify-between text-xs" style={{ fontFamily: 'Inter' }}>
              <span style={{ color: '#B9CBBC' }}>Days in Pool</span>
              <span style={{ color: '#E5E2E3', fontWeight: 500 }}>{d.daysInPool}d</span>
            </div>
            <div className="flex justify-between text-xs" style={{ fontFamily: 'Inter' }}>
              <span style={{ color: '#B9CBBC' }}>IL Coverage</span>
              <span style={{ color: '#00E38B', fontWeight: 600 }}>{d.coveragePct}%</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 py-4 gap-2">
            <span className="material-symbols-outlined text-2xl" style={{ color: '#3B4A3F' }}>account_balance_wallet</span>
            <p className="text-xs text-center" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
              No position yet. Add liquidity to start earning.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 justify-end">
        <button onClick={onAddLiquidity}
          className="w-full py-3 rounded-lg font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(0,255,157,0.2)] active:scale-[0.98]"
          style={{ background: '#00FF9D', color: '#007143', fontFamily: 'Space Grotesk', fontWeight: 700 }}>
          Add Liquidity
        </button>
        {d.hasPosition && (
          <button onClick={onRemoveLiquidity}
            className="w-full py-3 rounded-lg font-bold text-sm transition-all active:scale-[0.98]"
            style={{ background: 'rgba(255,100,100,0.1)', color: '#FF6464', border: '1px solid rgba(255,100,100,0.2)', fontFamily: 'Space Grotesk', fontWeight: 700 }}>
            Remove Liquidity
          </button>
        )}
        <a href={`https://sepolia.arbiscan.io/address/${d.pair.address}`} target="_blank" rel="noopener noreferrer"
          className="w-full py-3 rounded-lg font-bold text-sm text-center transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', color: '#B9CBBC', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'Space Grotesk', fontWeight: 700, textDecoration: 'none' }}>
          <span className="flex items-center justify-center gap-2">
            View on Arbiscan
            <span className="material-symbols-outlined text-sm" style={{ fontSize: 14 }}>open_in_new</span>
          </span>
        </a>
      </div>
    </div>
  );
};

export default PoolRowExpanded;
