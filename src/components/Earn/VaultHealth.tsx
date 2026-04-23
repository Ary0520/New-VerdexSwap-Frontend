import { formatUnits } from 'viem';
import { useVaultHealth, useVaultConfig, usePoolStats } from '../../hooks/useVaultHealth';
import { PAIRS, type PairKey } from '../../lib/contracts';

function fmtUsdc(raw: bigint): string {
  const n = parseFloat(formatUnits(raw, 6));
  if (n >= 1_000_000_000) return '$' + (n / 1_000_000_000).toFixed(2) + 'B';
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000)     return '$' + (n / 1_000).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}

const VaultHealth = ({ pairKey }: { pairKey: PairKey }) => {
  const pair = PAIRS[pairKey];
  const { usdcReserve, totalExposure, utilization, isLoading } = useVaultHealth(pair.address);
  const { circuitBreakerPct, maxPayoutPct, stakerFeeSharePct, isLoading: configLoading } = useVaultConfig();
  const { totalPaidOut, totalFeesIn, isLoading: statsLoading } = usePoolStats(pair.address);

  const u = utilization;
  const cb = circuitBreakerPct; // circuit breaker threshold %
  const isOptimal  = u >= 40 && u <= cb;
  const isCritical = u > cb;

  const reserveRatio = totalExposure > 0n
    ? '1:' + (Number(usdcReserve) / Number(totalExposure)).toFixed(2)
    : '—';

  const maxDrawdownPct = usdcReserve > 0n
    ? Math.min(100, (Number(totalExposure) / Number(usdcReserve)) * 100).toFixed(1) + '%'
    : '—';

  const loading = isLoading || configLoading;

  return (
    <div className="rounded-xl p-5 flex flex-col gap-4"
      style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest"
          style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}>
          Vault Health
        </span>
        <span className="material-symbols-outlined"
          style={{ color: isCritical ? '#FF6464' : '#00E38B', fontSize: 20, fontVariationSettings: "'FILL' 1" }}>
          {isCritical ? 'warning' : 'verified_user'}
        </span>
      </div>

      {/* Utilization bar */}
      <div>
        <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="absolute inset-0 rounded-full"
            style={{ background: 'linear-gradient(to right, #FF6464 0%, #568DFF 45%, #00FF9D 100%)', opacity: 0.25 }} />
          <div className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, u)}%`, background: 'linear-gradient(to right, #FF6464 0%, #568DFF 45%, #00FF9D 100%)' }} />
          {/* Circuit breaker marker */}
          {!configLoading && cb > 0 && (
            <div className="absolute top-0 bottom-0 w-px"
              style={{ left: `${Math.min(100, cb)}%`, background: '#FFB400', opacity: 0.8 }} />
          )}
          {/* Utilization needle */}
          <div className="absolute top-0 bottom-0 w-0.5 rounded-full"
            style={{ left: `${Math.min(100, u)}%`, background: '#fff', boxShadow: '0 0 6px rgba(255,255,255,0.6)' }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs" style={{ color: '#FF6464', fontFamily: 'Inter', fontSize: 10 }}>Critical</span>
          <span className="text-xs font-bold"
            style={{ color: isOptimal ? '#00E38B' : isCritical ? '#FF6464' : '#B9CBBC', fontFamily: 'Inter', fontSize: 10 }}>
            {loading ? '…' : u.toFixed(1) + '%'}{' '}
            {isOptimal ? '· Optimal' : isCritical ? '· Circuit Breaker Zone' : '· Low Utilization'}
          </span>
          <span className="text-xs" style={{ color: '#00E38B', fontFamily: 'Inter', fontSize: 10 }}>Surplus</span>
        </div>
        {/* Circuit breaker label */}
        {!configLoading && cb > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <span className="w-2 h-px" style={{ background: '#FFB400' }} />
            <span className="text-xs" style={{ color: '#FFB400', fontFamily: 'Inter', fontSize: 9 }}>
              Circuit breaker at {cb.toFixed(0)}%
            </span>
          </div>
        )}
      </div>

      {/* Core metrics */}
      <div className="flex flex-col gap-2.5 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {[
          { label: 'Outstanding Exposure', value: loading ? '…' : fmtUsdc(totalExposure), color: '#E5E2E3' },
          { label: 'Max Drawdown Capability', value: loading ? '…' : maxDrawdownPct, color: isCritical ? '#FF6464' : '#00E38B' },
          { label: 'Reserve Ratio', value: loading ? '…' : reserveRatio, color: '#E5E2E3' },
          { label: 'Max IL Payout', value: configLoading ? '…' : maxPayoutPct.toFixed(0) + '% of position', color: '#B9CBBC' },
          { label: 'Staker Fee Share', value: configLoading ? '…' : stakerFeeSharePct.toFixed(0) + '%', color: '#B9CBBC' },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-sm" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{row.label}</span>
            <span className="text-sm font-bold" style={{ color: row.color, fontFamily: 'Inter' }}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* Cumulative trust stats */}
      <div className="grid grid-cols-2 gap-3 pt-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="rounded-lg p-3 flex flex-col gap-1"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter', fontSize: 10 }}>Total IL Paid Out</span>
          <span className="text-sm font-black font-headline" style={{ color: '#00FF9D' }}>
            {statsLoading ? '…' : fmtUsdc(totalPaidOut)}
          </span>
        </div>
        <div className="rounded-lg p-3 flex flex-col gap-1"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter', fontSize: 10 }}>Total Fees Received</span>
          <span className="text-sm font-black font-headline" style={{ color: '#568DFF' }}>
            {statsLoading ? '…' : fmtUsdc(totalFeesIn)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VaultHealth;
