import type { Vault } from './earnData';

const tierColors: Record<string, { bg: string; color: string; border: string }> = {
  'BLUE CHIP': { bg: 'rgba(247,147,26,0.1)', color: '#F7931A', border: 'rgba(247,147,26,0.25)' },
  STABLE:      { bg: 'rgba(86,141,255,0.1)',  color: '#568DFF', border: 'rgba(86,141,255,0.25)' },
  VOLATILE:    { bg: 'rgba(0,255,157,0.1)',   color: '#00E38B', border: 'rgba(0,255,157,0.2)'  },
};

const VaultStatsStrip = ({ vault }: { vault: Vault }) => {
  const tier = tierColors[vault.utilizationTier];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {/* Total Staked */}
      <div
        className="rounded-xl p-4 flex flex-col gap-1"
        style={{ background: '#1C1B1C', border: '1px solid rgba(0,255,157,0.15)' }}
      >
        <span className="text-xs uppercase tracking-widest" style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}>
          Total Staked
        </span>
        <span className="text-2xl font-black font-headline" style={{ color: '#00FF9D' }}>
          {vault.totalStaked}
        </span>
        <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>stakerDeposits</span>
      </div>

      {/* Vault Reserve */}
      <div
        className="rounded-xl p-4 flex flex-col gap-1"
        style={{ background: '#1C1B1C', border: '1px solid rgba(86,141,255,0.15)' }}
      >
        <span className="text-xs uppercase tracking-widest" style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}>
          Vault Reserve
        </span>
        <span className="text-2xl font-black font-headline" style={{ color: '#568DFF' }}>
          {vault.vaultReserve}
        </span>
        <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>usdcReserve</span>
      </div>

      {/* Utilization */}
      <div
        className="rounded-xl p-4 flex flex-col gap-1"
        style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="text-xs uppercase tracking-widest" style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}>
          Utilization
        </span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black font-headline" style={{ color: '#E5E2E3' }}>
            {vault.utilization}%
          </span>
          <span
            className="text-xs font-black uppercase px-2 py-0.5 rounded-sm tracking-widest"
            style={{
              fontFamily: 'Inter',
              fontWeight: 900,
              fontSize: 9,
              letterSpacing: '0.08em',
              color: tier.color,
              background: tier.bg,
              border: `1px solid ${tier.border}`,
            }}
          >
            {vault.utilizationTier}
          </span>
        </div>
        <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{vault.utilizationLabel}</span>
      </div>
    </div>
  );
};

export default VaultStatsStrip;
