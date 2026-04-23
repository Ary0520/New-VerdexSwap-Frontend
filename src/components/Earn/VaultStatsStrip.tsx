import { useVaultHealth } from '../../hooks/useVaultHealth';
import { PAIRS, type PairKey } from '../../lib/contracts';

const TIER_LABEL: Record<number, { label: string; bg: string; color: string; border: string }> = {
  0: { label: 'STABLE',    bg: 'rgba(86,141,255,0.1)',  color: '#568DFF', border: 'rgba(86,141,255,0.25)' },
  1: { label: 'BLUE CHIP', bg: 'rgba(247,147,26,0.1)',  color: '#F7931A', border: 'rgba(247,147,26,0.25)' },
  2: { label: 'VOLATILE',  bg: 'rgba(0,255,157,0.1)',   color: '#00E38B', border: 'rgba(0,255,157,0.2)'  },
};

function fmtUsdc(raw: bigint): string {
  const n = Number(raw) / 1e6;
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000)     return '$' + (n / 1_000).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}

// Detect tier from lpFeeBps: ≤5 = Stable, ≤20 = BlueChip, else Volatile
function detectTierIndex(pairKey: PairKey): number {
  // We use the pair key naming convention as a proxy until we read from chain
  // Stable pairs: DAI/USDC
  if (pairKey === 'DAI/USDC') return 0;
  if (pairKey === 'WETH/USDC' || pairKey === 'WBTC/USDC') return 1;
  return 2;
}

const VaultStatsStrip = ({ pairKey }: { pairKey: PairKey }) => {
  const pair = PAIRS[pairKey];
  const { usdcReserve, stakerDeposits, utilization, isLoading } = useVaultHealth(pair.address);

  const tierIdx = detectTierIndex(pairKey);
  const tier = TIER_LABEL[tierIdx] ?? TIER_LABEL[2];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {/* Total Staked */}
      <div className="rounded-xl p-4 flex flex-col gap-1"
        style={{ background: '#1C1B1C', border: '1px solid rgba(0,255,157,0.15)' }}>
        <span className="text-xs uppercase tracking-widest" style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}>
          Total Staked
        </span>
        <span className="text-2xl font-black font-headline" style={{ color: '#00FF9D' }}>
          {isLoading ? '…' : fmtUsdc(stakerDeposits)}
        </span>
        <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>stakerDeposits</span>
      </div>

      {/* Vault Reserve */}
      <div className="rounded-xl p-4 flex flex-col gap-1"
        style={{ background: '#1C1B1C', border: '1px solid rgba(86,141,255,0.15)' }}>
        <span className="text-xs uppercase tracking-widest" style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}>
          Vault Reserve
        </span>
        <span className="text-2xl font-black font-headline" style={{ color: '#568DFF' }}>
          {isLoading ? '…' : fmtUsdc(usdcReserve)}
        </span>
        <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>usdcReserve</span>
      </div>

      {/* Utilization */}
      <div className="rounded-xl p-4 flex flex-col gap-1"
        style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-xs uppercase tracking-widest" style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}>
          Utilization
        </span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black font-headline" style={{ color: '#E5E2E3' }}>
            {isLoading ? '…' : utilization.toFixed(1) + '%'}
          </span>
          <span className="text-xs font-black uppercase px-2 py-0.5 rounded-sm tracking-widest"
            style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 9, letterSpacing: '0.08em', color: tier.color, background: tier.bg, border: `1px solid ${tier.border}` }}>
            {tier.label}
          </span>
        </div>
        <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Payouts / Received</span>
      </div>
    </div>
  );
};

export default VaultStatsStrip;
