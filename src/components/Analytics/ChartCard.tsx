import type { ReactNode } from 'react';

type TimeRange = '24h' | '7d' | '30d';

type Props = {
  title: string;
  subtitle?: string;
  value?: string;
  change?: string;
  changePositive?: boolean;
  timeRange?: TimeRange;
  onTimeRange?: (r: TimeRange) => void;
  children: ReactNode;
};

const ChartCard = ({
  title,
  subtitle,
  value,
  change,
  changePositive,
  timeRange,
  onTimeRange,
  children,
}: Props) => (
  <div
    className="rounded-xl p-5 flex flex-col gap-3"
    style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.06)' }}
  >
    {/* Header */}
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}
        >
          {title}
        </span>
        {subtitle && (
          <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter', opacity: 0.6 }}>
            {subtitle}
          </span>
        )}
        {value && (
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black font-headline" style={{ color: '#E5E2E3' }}>
              {value}
            </span>
            {change && (
              <span
                className="text-xs font-bold"
                style={{ color: changePositive ? '#00E38B' : '#FF6464', fontFamily: 'Inter' }}
              >
                {change}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Time range toggle */}
      {onTimeRange && (
        <div
          className="flex items-center gap-0.5 p-0.5 rounded-lg flex-shrink-0"
          style={{ background: '#131314' }}
        >
          {(['24h', '7d', '30d'] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => onTimeRange(r)}
              className="px-2.5 py-1 rounded text-xs font-bold transition-all"
              style={{
                fontFamily: 'Inter',
                background: timeRange === r ? 'rgba(0,255,157,0.15)' : 'transparent',
                color: timeRange === r ? '#00FF9D' : '#B9CBBC',
                border: timeRange === r ? '1px solid rgba(0,255,157,0.25)' : '1px solid transparent',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>

    {children}
  </div>
);

export default ChartCard;
