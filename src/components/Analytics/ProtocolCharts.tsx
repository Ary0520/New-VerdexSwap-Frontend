import { useState } from 'react';
import ChartCard from './ChartCard';
import LineChart from './LineChart';
import BarChart from './BarChart';
import { useProtocolChartData } from '../../hooks/useAnalytics';

type TimeRange = '7d' | '30d';

const RANGE_DAYS: Record<TimeRange, number> = { '7d': 7, '30d': 30 };

const EmptyChart = ({ height = 160 }: { height?: number }) => (
  <div className="flex flex-col items-center justify-center gap-2"
    style={{ height, background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
    <span className="material-symbols-outlined" style={{ color: '#3B4A3F', fontSize: 24 }}>bar_chart</span>
    <span className="text-xs" style={{ color: '#3B4A3F', fontFamily: 'Inter' }}>
      Subgraph syncing — data will appear shortly
    </span>
  </div>
);

const ProtocolCharts = () => {
  const [range, setRange] = useState<TimeRange>('30d');
  const { labels, volumes, fees, cumulativeFees, loading, hasData } = useProtocolChartData(RANGE_DAYS[range]);

  const sliced = (arr: number[]) => arr.slice(-RANGE_DAYS[range]);
  const slicedLabels = labels.slice(-RANGE_DAYS[range]);

  const latestVol  = volumes.length > 0 ? volumes[volumes.length - 1] : 0;
  const latestFees = cumulativeFees.length > 0 ? cumulativeFees[cumulativeFees.length - 1] : 0;

  function fmtUsd(n: number) {
    if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
    if (n >= 1_000)     return '$' + (n / 1_000).toFixed(1) + 'K';
    return '$' + n.toFixed(2);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
      {/* Volume */}
      <ChartCard
        title="Daily Trading Volume"
        subtitle="Swap volume per day"
        value={hasData ? fmtUsd(latestVol) : undefined}
        timeRange={range as any}
        onTimeRange={r => setRange(r as TimeRange)}
      >
        {loading ? <EmptyChart /> : hasData
          ? <BarChart data={sliced(volumes)} labels={slicedLabels} color="#568DFF" unit="$M" height={160} />
          : <EmptyChart />}
      </ChartCard>

      {/* Cumulative Fees */}
      <ChartCard
        title="Cumulative Fees Generated"
        subtitle="All fee tiers combined"
        value={hasData ? fmtUsd(latestFees) : undefined}
        timeRange={range as any}
        onTimeRange={r => setRange(r as TimeRange)}
      >
        {loading ? <EmptyChart /> : hasData
          ? <LineChart data={sliced(cumulativeFees)} labels={slicedLabels} color="#56FFA8" unit="$M" height={160} gradientId="feeGrad" />
          : <EmptyChart />}
      </ChartCard>

      {/* Daily Fees */}
      <ChartCard
        title="Daily Fees"
        subtitle="Fee revenue per day"
        timeRange={range as any}
        onTimeRange={r => setRange(r as TimeRange)}
      >
        {loading ? <EmptyChart /> : hasData
          ? <BarChart data={sliced(fees)} labels={slicedLabels} color="#56FFA8" unit="$M" height={160} />
          : <EmptyChart />}
      </ChartCard>

      {/* Volume vs Fees ratio */}
      <ChartCard
        title="Fee Rate"
        subtitle="Daily fees as % of volume"
        timeRange={range as any}
        onTimeRange={r => setRange(r as TimeRange)}
      >
        {loading ? <EmptyChart /> : hasData ? (() => {
          const feeRate = volumes.map((v, i) => v > 0 ? (fees[i] / v) * 100 : 0);
          return <LineChart data={sliced(feeRate)} labels={slicedLabels} color="#FFB400" unit="%" height={160} gradientId="feeRateGrad" />;
        })() : <EmptyChart />}
      </ChartCard>
    </div>
  );
};

export default ProtocolCharts;
