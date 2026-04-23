import { useActiveAccount } from 'thirdweb/react';
import { useNavigate } from 'react-router-dom';
import { PAIRS, type PairKey } from '../../lib/contracts';
import { useStakingPosition } from '../../hooks/usePortfolio';

const TOKEN_COLORS: Record<string, string> = {
  WETH: '#627EEA', USDC: '#2775CA', WBTC: '#F7931A', ARB: '#12AAFF', DAI: '#F5AC37',
};

const statusStyles: Record<string, { color: string; bg: string; border: string }> = {
  Active:    { color: '#00E38B', bg: 'rgba(0,255,157,0.1)',  border: 'rgba(0,255,157,0.2)'  },
  Requested: { color: '#FFB400', bg: 'rgba(255,180,0,0.1)',  border: 'rgba(255,180,0,0.2)'  },
  Unlocked:  { color: '#568DFF', bg: 'rgba(86,141,255,0.1)', border: 'rgba(86,141,255,0.2)' },
};

function StakingRow({ pairKey, index }: { pairKey: PairKey; index: number }) {
  const navigate = useNavigate();
  const d = useStakingPosition(pairKey);
  if (!d.hasPosition) return null;

  const pair = d.pair;
  const t0sym = pair.token0 as string;
  const t1sym = pair.token1 as string;
  const s = statusStyles[d.unstakeStatus];

  return (
    <div className="grid items-center px-6 py-4"
      style={{
        gridTemplateColumns: '2fr 130px 130px 110px 120px 120px',
        background: index % 2 === 0 ? '#131314' : 'rgba(255,255,255,0.01)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>

      {/* Vault name */}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[t0sym, t1sym].map((sym, ci) => (
            <div key={ci} className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
              style={{ width: 22, height: 22, background: TOKEN_COLORS[sym] ?? '#888', fontSize: 8, fontFamily: 'Space Grotesk', marginLeft: ci > 0 ? -6 : 0, zIndex: ci === 0 ? 1 : 0 }}>
              {sym.slice(0, 2)}
            </div>
          ))}
        </div>
        <span className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: '#E5E2E3' }}>
          {pairKey} Vault
        </span>
      </div>

      <span className="text-sm font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>{d.amountFmt}</span>
      {/* Current value = staked + pending (simplified — no share price appreciation yet) */}
      <span className="text-sm font-medium" style={{ color: '#00E38B', fontFamily: 'Inter' }}>
        {'$' + (d.amountUSD + d.pendingUSD).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
      <span className="text-sm font-bold" style={{ color: '#56FFA8', fontFamily: 'Inter' }}>{d.pendingFmt}</span>

      <span className="text-xs font-black uppercase px-2 py-0.5 rounded-sm tracking-widest w-fit"
        style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.08em', color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
        {d.unstakeStatus}
      </span>

      <div className="flex items-center justify-end">
        <button onClick={() => navigate('/earn')}
          className="px-3 py-1.5 rounded text-xs font-bold transition-all hover:brightness-110"
          style={{ background: '#353436', color: '#E5E2E3', fontFamily: 'Space Grotesk', fontWeight: 700 }}>
          Manage
        </button>
      </div>
    </div>
  );
}

function NoPositionsPlaceholder({ pairKeys }: { pairKeys: PairKey[] }) {
  // Read all positions — if any has a position, don't show placeholder
  const positions = pairKeys.map(k => useStakingPosition(k));
  const anyActive = positions.some(p => p.hasPosition);
  if (anyActive) return null;
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-2" style={{ background: '#131314' }}>
      <span className="material-symbols-outlined text-3xl" style={{ color: '#3B4A3F' }}>savings</span>
      <p className="text-sm" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>No staking positions yet.</p>
    </div>
  );
}

const StakingPositionsTable = () => {
  const account = useActiveAccount();
  const pairKeys = Object.keys(PAIRS) as PairKey[];

  if (!account?.address) return null;

  return (
    <div className="mb-8">
      <h2 className="font-black text-lg font-headline mb-4" style={{ color: '#E5E2E3', letterSpacing: '-0.01em' }}>
        Staking Positions
      </h2>
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="grid items-center px-6 py-3 text-xs font-bold uppercase"
          style={{
            gridTemplateColumns: '2fr 130px 130px 110px 120px 120px',
            background: '#1C1B1C', color: '#B9CBBC', fontFamily: 'Inter',
            letterSpacing: '0.08em', borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
          <span>Vault</span><span>Staked USDC</span><span>Current Value</span>
          <span>Pending Fees</span><span>Status</span><span />
        </div>

        {pairKeys.map((key, i) => <StakingRow key={key} pairKey={key} index={i} />)}

        <NoPositionsPlaceholder pairKeys={pairKeys} />
      </div>
    </div>
  );
};

export default StakingPositionsTable;
