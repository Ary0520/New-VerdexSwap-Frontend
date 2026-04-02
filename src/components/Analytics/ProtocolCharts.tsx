import { useState } from 'react';
import ChartCard from './ChartCard';
import LineChart from './LineChart';
import BarChart from './BarChart';
import { DAYS_30, TVL_SERIES, VOLUME_SERIES, FEES_CUMULATIVE, IL_PAYOUT_CUMULATIVE } from './analyticsData';

type TimeRange = '24h' | '7d' | '30d';

const slice = (data: number[], range: TimeRange) => {
  if (range === '24h') return data.slice(-1);
  if (range === '7d')  return data.slice(-7);
  return data;
};
const sliceLabels = (labels: string[], range: TimeRange) => {
  if (range === '24h') return labels.slice(-1);
  if (range === '7d')  return labels.slice(-7);
  return labels;
};

const ProtocolCharts = () => {
  const [tvlRange,  setTvlRange]  = useState<TimeRange>('30d');
  const [volRange,  setVolRange]  = useState<TimeRange>('30d');
  const [feeRange,  setFeeRange]  = useState<TimeRange>('30d');
  const [ilRange,   setIlRange]   = useState<TimeRange>('30d');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
      {/* TVL */}
      <ChartCard
        title="Total Value Locked"
        value={`$${TVL_SERIES[TVL_SERIES.length - 1].toFixed(1)}M`}
        change="+3.4%"
        changePositive
        timeRange={tvlRange}
        onTimeRange={setTvlRange}
      >
        <LineChart
          data={slice(TVL_SERIES, tvlRange)}
          labels={sliceLabels(DAYS_30, tvlRange)}
          color="#00FF9D"
          unit="$M"
          height={160}
          gradientId="tvlGrad"
        />
      </ChartCard>

      {/* Volume */}
      <ChartCard
        title="Trading Volume"
        subtitle="Daily swap volume"
        value={`$${VOLUME_SERIES[VOLUME_SERIES.length - 1].toFixed(1)}M`}
        timeRange={volRange}
        onTimeRange={setVolRange}
      >
        <BarChart
          data={slice(VOLUME_SERIES, volRange)}
          labels={sliceLabels(DAYS_30, volRange)}
          color="#568DFF"
          unit="$M"
          height={160}
        />
      </ChartCard>

      {/* Cumulative Fees */}
      <ChartCard
        title="Cumulative Fees Generated"
        subtitle="All fee tiers combined"
        value={`$${FEES_CUMULATIVE[FEES_CUMULATIVE.length - 1].toFixed(2)}M`}
        timeRange={feeRange}
        onTimeRange={setFeeRange}
      >
        <LineChart
          data={slice(FEES_CUMULATIVE, feeRange)}
          labels={sliceLabels(DAYS_30, feeRange)}
          color="#56FFA8"
          unit="$M"
          height={160}
          gradientId="feeGrad"
        />
      </ChartCard>

      {/* IL Payouts */}
      <ChartCard
        title="Cumulative IL Payouts"
        subtitle="Total paid to LPs from IL Shield"
        value={`$${IL_PAYOUT_CUMULATIVE[IL_PAYOUT_CUMULATIVE.length - 1].toFixed(2)}M`}
        timeRange={ilRange}
        onTimeRange={setIlRange}
      >
        <LineChart
          data={slice(IL_PAYOUT_CUMULATIVE, ilRange)}
          labels={sliceLabels(DAYS_30, ilRange)}
          color="#FFB400"
          unit="$M"
          height={160}
          gradientId="ilGrad"
        />
      </ChartCard>
    </div>
  );
};

export default ProtocolCharts;
