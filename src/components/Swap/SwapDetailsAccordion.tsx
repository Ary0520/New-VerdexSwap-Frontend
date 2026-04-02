type DetailRow = {
  label: string;
  value: string;
  valueColor?: string;
  isTag?: boolean;
};

const rows: DetailRow[] = [
  { label: 'Price Impact', value: '0.21%' },
  { label: 'Minimum Received', value: '2,328.80 USDC' },
  { label: 'Vault Fee (IL Shield)', value: '3.51 USDC (0.15%)' },
  { label: 'Treasury Fee', value: '2.34 USDC (0.10%)' },
  { label: 'LP Fee', value: '7.02 USDC (0.30%)' },
];

const SwapDetailsAccordion = () => {
  return (
    <div
      className="rounded-lg p-4 flex flex-col gap-3"
      style={{ background: 'rgba(255,255,255,0.05)' }}
    >
      {/* Rate row */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter', fontWeight: 400 }}>
          Rate
        </span>
        <span className="text-xs font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>
          1 ETH = 2,340.50 USDC
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

      {/* Detail rows */}
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter', fontWeight: 400 }}>
              {row.label}
            </span>
            {row.label === 'Price Impact' && (
              <span className="material-symbols-outlined text-xs" style={{ color: '#B9CBBC', fontSize: 12 }}>
                info
              </span>
            )}
          </div>
          <span className="text-xs font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>
            {row.value}
          </span>
        </div>
      ))}

      {/* Route row */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter', fontWeight: 400 }}>
          Route
        </span>
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>ETH</span>
          <span className="material-symbols-outlined text-xs" style={{ color: '#E5E2E3', fontSize: 12 }}>arrow_forward</span>
          <span className="text-xs font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>USDC</span>
        </div>
      </div>

      {/* Pool Tier row */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter', fontWeight: 400 }}>
          Pool Tier
        </span>
        <span
          className="text-xs font-black uppercase px-2 py-0.5 rounded-sm tracking-widest"
          style={{
            fontFamily: 'Inter',
            fontWeight: 900,
            fontSize: 10,
            letterSpacing: '0.1em',
            color: '#00E38B',
            background: 'rgba(0,255,157,0.1)',
            border: '1px solid rgba(0,255,157,0.2)',
            boxShadow: '0 0 10px 0 rgba(0,255,157,0.1)',
          }}
        >
          Volatile
        </span>
      </div>
    </div>
  );
};

export default SwapDetailsAccordion;
