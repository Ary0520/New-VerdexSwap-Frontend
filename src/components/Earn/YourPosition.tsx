import type { Vault } from './earnData';

const YourPosition = ({ vault }: { vault: Vault }) => {
  const hasPosition = parseFloat(vault.stakedUsdc.replace(',', '')) > 0;

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{
        background: 'rgba(0,255,157,0.04)',
        border: '1px solid rgba(0,255,157,0.12)',
      }}
    >
      <span
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: '#00E38B', fontFamily: 'Inter', letterSpacing: '0.1em' }}
      >
        Your Position
      </span>

      {hasPosition ? (
        <div className="flex flex-col gap-3">
          {[
            { label: 'Staked USDC', value: vault.stakedUsdc },
            { label: 'Vault Shares', value: vault.vaultShares },
            { label: 'Entry Price', value: vault.entryPrice },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-sm" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{row.label}</span>
              <span className="text-sm font-bold" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>{row.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 gap-2">
          <span className="material-symbols-outlined text-3xl" style={{ color: '#3B4A3F' }}>savings</span>
          <p className="text-xs text-center" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
            No position in this vault yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default YourPosition;
