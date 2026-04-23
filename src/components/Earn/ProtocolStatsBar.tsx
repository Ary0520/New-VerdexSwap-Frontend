import { useProtocolVaultStats } from '../../hooks/useVaultHealth';
import { usePoliciesActive, useLatestConversion, useVaultApy } from '../../hooks/useSubgraph';
import { formatUnits } from 'viem';

const ProtocolStatsBar = () => {
  const { tvlFormatted, tvlRaw } = useProtocolVaultStats();
  const tvlUsd = parseFloat(formatUnits(tvlRaw, 6));

  const { count: policiesActive, loading: policiesLoading } = usePoliciesActive();
  const { timeAgo, loading: conversionLoading } = useLatestConversion();
  const { apyFormatted, loading: apyLoading } = useVaultApy(tvlUsd);

  const stats = [
    {
      label: 'Vault TVL',
      value: tvlFormatted,
      color: '#00FF9D',
      // always real — from chain
      live: true,
    },
    {
      label: 'Avg. APY',
      value: apyLoading ? '…' : apyFormatted ?? '—',
      color: '#568DFF',
      live: !apyLoading && apyFormatted !== null,
    },
    {
      label: 'Policies Active',
      value: policiesLoading ? '…' : policiesActive !== null ? policiesActive.toLocaleString() : '—',
      color: '#E5E2E3',
      live: !policiesLoading && policiesActive !== null,
    },
    {
      label: 'Last Conversion',
      value: conversionLoading ? '…' : timeAgo ?? '—',
      color: '#E5E2E3',
      live: !conversionLoading && timeAgo !== null,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-px rounded-xl overflow-hidden mt-8"
      style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1 px-6 py-4"
          style={{ background: '#1C1B1C' }}>
          <div className="flex items-center gap-1.5">
            <span className="text-xs uppercase tracking-widest"
              style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}>
              {stat.label}
            </span>
            {/* Live indicator dot — green when real data, grey when subgraph pending */}
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: stat.live ? '#00FF9D' : '#3B4A3F' }} />
          </div>
          <span className="text-xl font-black font-headline" style={{ color: stat.color }}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProtocolStatsBar;
