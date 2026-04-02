import { STAKING_POSITIONS } from './portfolioData';
import { useNavigate } from 'react-router-dom';

const statusStyles: Record<string, { color: string; bg: string; border: string }> = {
  Active:    { color: '#00E38B', bg: 'rgba(0,255,157,0.1)',   border: 'rgba(0,255,157,0.2)'   },
  Requested: { color: '#FFB400', bg: 'rgba(255,180,0,0.1)',   border: 'rgba(255,180,0,0.2)'   },
  Unlocked:  { color: '#568DFF', bg: 'rgba(86,141,255,0.1)',  border: 'rgba(86,141,255,0.2)'  },
};

const StakingPositionsTable = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <h2 className="font-black text-lg font-headline mb-4" style={{ color: '#E5E2E3', letterSpacing: '-0.01em' }}>
        Staking Positions
      </h2>
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Header */}
        <div
          className="grid items-center px-6 py-3 text-xs font-bold uppercase"
          style={{
            gridTemplateColumns: '2fr 130px 130px 110px 80px 120px 120px',
            background: '#1C1B1C',
            color: '#B9CBBC',
            fontFamily: 'Inter',
            letterSpacing: '0.08em',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span>Vault</span>
          <span>Staked USDC</span>
          <span>Current Value</span>
          <span>Earned Fees</span>
          <span>APR</span>
          <span>Status</span>
          <span />
        </div>

        {STAKING_POSITIONS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2" style={{ background: '#131314' }}>
            <span className="material-symbols-outlined text-3xl" style={{ color: '#3B4A3F' }}>savings</span>
            <p className="text-sm" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>No staking positions yet.</p>
          </div>
        ) : (
          STAKING_POSITIONS.map((pos, i) => {
            const s = statusStyles[pos.unstakeStatus];
            const isLast = i === STAKING_POSITIONS.length - 1;
            return (
              <div
                key={pos.id}
                className="grid items-center px-6 py-4"
                style={{
                  gridTemplateColumns: '2fr 130px 130px 110px 80px 120px 120px',
                  background: i % 2 === 0 ? '#131314' : 'rgba(255,255,255,0.01)',
                  borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)',
                }}
              >
                {/* Vault */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[pos.token0Color, pos.token1Color].map((color, ci) => (
                      <div key={ci} className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                        style={{ width: 22, height: 22, background: color, fontSize: 8, fontFamily: 'Space Grotesk', marginLeft: ci > 0 ? -6 : 0, zIndex: ci === 0 ? 1 : 0 }}>
                        {ci === 0 ? pos.token0Symbol : pos.token1Symbol}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: '#E5E2E3' }}>{pos.vault}</span>
                </div>

                <span className="text-sm font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>{pos.stakedUsdc}</span>
                <span className="text-sm font-medium" style={{ color: '#00E38B', fontFamily: 'Inter' }}>{pos.currentValue}</span>
                <span className="text-sm font-bold" style={{ color: '#56FFA8', fontFamily: 'Inter' }}>{pos.earnedFees}</span>
                <span className="text-sm font-bold" style={{ color: '#568DFF', fontFamily: 'Inter' }}>{pos.apr}</span>

                {/* Status badge */}
                <span
                  className="text-xs font-black uppercase px-2 py-0.5 rounded-sm tracking-widest w-fit"
                  style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.08em', color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
                >
                  {pos.unstakeStatus}
                </span>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => navigate('/earn')}
                    className="px-3 py-1.5 rounded text-xs font-bold transition-all hover:brightness-110"
                    style={{ background: '#353436', color: '#E5E2E3', fontFamily: 'Space Grotesk', fontWeight: 700 }}
                  >
                    Manage
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StakingPositionsTable;
