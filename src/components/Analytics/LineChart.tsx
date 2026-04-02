import { useState } from 'react';
import { toPoints, pointsToPolyline, pointsToArea, yTicks, fmt, DEFAULT_PAD } from './chartUtils';
import type { ChartPad } from './chartUtils';

type Unit = '$M' | '%' | 'x' | '$K';

type Props = {
  data: number[];
  labels: string[];
  color: string;
  unit?: Unit;
  height?: number;
  pad?: ChartPad;
  gradientId: string;
  showDots?: boolean;
};

const W = 600;

const LineChart = ({
  data,
  labels,
  color,
  unit = '$M',
  height = 180,
  pad = DEFAULT_PAD,
  gradientId,
  showDots = false,
}: Props) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const pts = toPoints(data, W, height, pad);
  const polyline = pointsToPolyline(pts);
  const area = pointsToArea(pts, height, pad);
  const ticks = yTicks(data, 4);
  const cH = height - pad.top - pad.bottom;

  // X-axis: show ~6 evenly spaced labels
  const xStep = Math.floor(labels.length / 5);
  const xLabels = labels
    .map((l, i) => ({ l, i, x: pts[i]?.[0] ?? 0 }))
    .filter((_, i) => i % xStep === 0 || i === labels.length - 1);

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        viewBox={`0 0 ${W} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
        style={{ display: 'block', overflow: 'visible' }}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Y-axis grid lines + labels */}
        {ticks.map((tick, i) => {
          const y = pad.top + cH - (i / (ticks.length - 1)) * cH;
          return (
            <g key={tick}>
              <line x1={pad.left} x2={W - pad.right} y1={y} y2={y}
                stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <text x={pad.left - 4} y={y + 4} textAnchor="end"
                fill="#B9CBBC" fontSize="9" fontFamily="Inter" opacity="0.7">
                {fmt(tick, unit)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={area} fill={`url(#${gradientId})`} />

        {/* Line */}
        <polyline points={polyline} fill="none" stroke={color} strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" />

        {/* Hover vertical line */}
        {hoverIdx !== null && pts[hoverIdx] && (
          <line
            x1={pts[hoverIdx][0]} x2={pts[hoverIdx][0]}
            y1={pad.top} y2={pad.top + cH}
            stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,3"
          />
        )}

        {/* Dots */}
        {showDots && pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5"
            fill="#131314" stroke={color} strokeWidth="1.5" />
        ))}

        {/* Hover dot */}
        {hoverIdx !== null && pts[hoverIdx] && (
          <circle cx={pts[hoverIdx][0]} cy={pts[hoverIdx][1]} r="4"
            fill="#131314" stroke={color} strokeWidth="2" />
        )}

        {/* Invisible hover targets */}
        {pts.map(([x], i) => (
          <rect key={i}
            x={x - (W / data.length) / 2} y={pad.top}
            width={W / data.length} height={cH}
            fill="transparent"
            onMouseEnter={() => setHoverIdx(i)}
          />
        ))}

        {/* X-axis labels */}
        {xLabels.map(({ l, x }) => (
          <text key={l} x={x} y={height - 4} textAnchor="middle"
            fill="#B9CBBC" fontSize="9" fontFamily="Inter" opacity="0.6">
            {l}
          </text>
        ))}
      </svg>

      {/* Tooltip */}
      {hoverIdx !== null && (
        <div
          className="absolute pointer-events-none px-2.5 py-1.5 rounded-lg text-xs font-bold"
          style={{
            left: `${(pts[hoverIdx][0] / W) * 100}%`,
            top: `${pts[hoverIdx][1] / height * 100}%`,
            transform: 'translate(-50%, -130%)',
            background: '#1C1B1C',
            border: `1px solid ${color}40`,
            color,
            fontFamily: 'Inter',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          {fmt(data[hoverIdx], unit)}
          <span style={{ color: '#B9CBBC', fontWeight: 400 }}> · {labels[hoverIdx]}</span>
        </div>
      )}
    </div>
  );
};

export default LineChart;
