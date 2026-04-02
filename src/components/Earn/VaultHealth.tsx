import type { Vault } from './earnData';

const VaultHealth = ({ vault }: { vault: Vault }) => {
  const u = vault.utilization;

  // Gradient bar: red → blue → green based on utilization
  // Optimal range is roughly 40–80%
  const isOptimal = u >= 40 && u <= 80;
  const isCritical = u > 80;

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}
        >
          Vault Health
        </span>
        <span
          className="material-symbols-outlined"
          style={{
            color: isCritical ? '#FF6464' : '#00E38B',
            fontSize: 20,
            fontVariationSettings: "'FILL' 1",
          }}
        >
          {isCritical ? 'warning' : 'verified_user'}
        </span>
      </div>

      {/* Gradient utilization bar */}
      <div>
        <div
          className="relative h-3 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          {/* Full gradient track */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(to right, #FF6464 0%, #568DFF 45%, #00FF9D 100%)',
              opacity: 0.25,
            }}
          />
          {/* Filled portion */}
          <div
            className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-500"
            style={{
              width: `${u}%`,
              background: `linear-gradient(to right, #FF6464 0%, #568DFF 45%, #00FF9D 100%)`,
            }}
          />
          {/* Needle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 rounded-full"
            style={{
              left: `${u}%`,
              background: '#fff',
              boxShadow: '0 0 6px rgba(255,255,255,0.6)',
            }}
          />
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-1.5">
          <span className="text-xs" style={{ color: '#FF6464', fontFamily: 'Inter', fontSize: 10 }}>Critical</span>
          <span
            className="text-xs font-bold"
            style={{
              color: isOptimal ? '#00E38B' : '#B9CBBC',
              fontFamily: 'Inter',
              fontSize: 10,
            }}
          >
            {u}% {isOptimal ? '· Optimal Range' : isCritical ? '· High Utilization' : '· Low Utilization'}
          </span>
          <span className="text-xs" style={{ color: '#00E38B', fontFamily: 'Inter', fontSize: 10 }}>Surplus</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex flex-col gap-3 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {[
          { label: 'Outstanding Exposure', value: vault.outstandingExposure, color: '#E5E2E3' },
          { label: 'Max Drawdown Capability', value: vault.maxDrawdown, color: isCritical ? '#FF6464' : '#00E38B' },
          { label: 'Reserve Ratio', value: vault.reserveRatio, color: '#E5E2E3' },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-sm" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{row.label}</span>
            <span className="text-sm font-bold" style={{ color: row.color, fontFamily: 'Inter' }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VaultHealth;
