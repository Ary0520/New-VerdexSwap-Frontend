import { SUMMARY } from './portfolioData';

const cards = [
  { label: 'Total LP Value',             value: SUMMARY.totalLpValue,    color: '#00FF9D', icon: 'account_balance_wallet' },
  { label: 'Total IL Exposure',          value: SUMMARY.totalIlExposure, color: '#FF6464', icon: 'trending_down'          },
  { label: 'Total IL Payouts Received',  value: SUMMARY.totalIlPayouts,  color: '#568DFF', icon: 'verified_user'          },
  { label: 'Staking Rewards Earned',     value: SUMMARY.stakingRewards,  color: '#56FFA8', icon: 'savings'                },
];

const SummaryCards = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    {cards.map((c) => (
      <div
        key={c.label}
        className="rounded-xl p-5 flex flex-col gap-3"
        style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}
          >
            {c.label}
          </span>
          <span
            className="material-symbols-outlined"
            style={{ color: c.color, fontSize: 18, opacity: 0.7, fontVariationSettings: "'FILL' 1" }}
          >
            {c.icon}
          </span>
        </div>
        <span
          className="text-2xl font-black font-headline"
          style={{ color: c.color }}
        >
          {c.value}
        </span>
      </div>
    ))}
  </div>
);

export default SummaryCards;
