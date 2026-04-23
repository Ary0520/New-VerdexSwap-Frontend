import { useLpPosition, useStakingPosition, usePortfolioSummary } from '../../hooks/usePortfolio';
import { useActiveAccount } from 'thirdweb/react';

// Inner component that calls hooks for all pairs and aggregates
const SummaryCardsInner = () => {
  const lp0 = useLpPosition('WETH/USDC');
  const lp1 = useLpPosition('WBTC/USDC');
  const lp2 = useLpPosition('ARB/USDC');
  const lp3 = useLpPosition('DAI/USDC');
  const lp4 = useLpPosition('WETH/DAI');

  const st0 = useStakingPosition('WETH/USDC');
  const st1 = useStakingPosition('WBTC/USDC');
  const st2 = useStakingPosition('ARB/USDC');
  const st3 = useStakingPosition('DAI/USDC');
  const st4 = useStakingPosition('WETH/DAI');

  const { totalLpValue, totalIlExposure, totalStaking, totalEarned } = usePortfolioSummary(
    [lp0, lp1, lp2, lp3, lp4],
    [st0, st1, st2, st3, st4],
  );

  const cards = [
    { label: 'Total LP Value',            value: totalLpValue,    color: '#00FF9D', icon: 'account_balance_wallet' },
    { label: 'Total IL Exposure',         value: totalIlExposure, color: '#FF6464', icon: 'trending_down'          },
    { label: 'Total Staked USDC',         value: totalStaking,    color: '#568DFF', icon: 'verified_user'          },
    { label: 'Pending Staking Rewards',   value: totalEarned,     color: '#56FFA8', icon: 'savings'                },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map(c => (
        <div key={c.label} className="rounded-xl p-5 flex flex-col gap-3"
          style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest"
              style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}>
              {c.label}
            </span>
            <span className="material-symbols-outlined"
              style={{ color: c.color, fontSize: 18, opacity: 0.7, fontVariationSettings: "'FILL' 1" }}>
              {c.icon}
            </span>
          </div>
          <span className="text-2xl font-black font-headline" style={{ color: c.color }}>
            {c.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const SummaryCards = () => {
  const account = useActiveAccount();
  if (!account?.address) {
    return (
      <div className="rounded-xl p-8 mb-8 flex flex-col items-center gap-3"
        style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="material-symbols-outlined text-4xl" style={{ color: '#3B4A3F' }}>account_balance_wallet</span>
        <p className="text-sm" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Connect your wallet to view your portfolio.</p>
      </div>
    );
  }
  return <SummaryCardsInner />;
};

export default SummaryCards;
