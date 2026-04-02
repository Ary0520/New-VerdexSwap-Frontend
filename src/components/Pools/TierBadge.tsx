import type { PoolTier } from './poolsData';

const tierStyles: Record<PoolTier, { bg: string; border: string; color: string }> = {
  Stable: {
    bg: 'rgba(86,141,255,0.1)',
    border: 'rgba(86,141,255,0.25)',
    color: '#568DFF',
  },
  'Blue Chip': {
    bg: 'rgba(247,147,26,0.1)',
    border: 'rgba(247,147,26,0.25)',
    color: '#F7931A',
  },
  Volatile: {
    bg: 'rgba(0,255,157,0.1)',
    border: 'rgba(0,255,157,0.2)',
    color: '#00E38B',
  },
};

const TierBadge = ({ tier }: { tier: PoolTier }) => {
  const s = tierStyles[tier];
  return (
    <span
      className="text-xs font-black uppercase px-2 py-0.5 rounded-sm tracking-widest"
      style={{
        fontFamily: 'Inter',
        fontWeight: 900,
        fontSize: 10,
        letterSpacing: '0.1em',
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
      }}
    >
      {tier}
    </span>
  );
};

export default TierBadge;
