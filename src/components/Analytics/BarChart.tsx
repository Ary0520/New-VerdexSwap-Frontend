import { useState } from 'react';
import { fmt } from './chartUtils';

type Unit = '$M' | '%' | 'x' | '$K';

type Props = {
  data: number[];
  labels: string[];
  color: string;
  unit?: Unit;
  height?: number;
};

const PAD = { top: 16, right: 8, bottom: 28, left: 40 };
const W = 600;

const BarChart = ({ data, labels, color, unit = '$M', height = 180 }: Props) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const cW = W - PAD.left - PAD.right;
  const cH = height - PAD.top - PAD.bottom;
  const max = Math.max(...data) || 1;
  const barW = (cW / data.length) * 0.6;
  const gap   = cW / data.length;

  const xStep = Math.floor(labels.length / 5);

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
        {/* Y grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = PAD.top + cH - t * cH;
          return (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y}
                stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <text x={PAD.left - 4} y={y + 4} textAnchor="end"
                fill="#B9CBBC" fontSize="9" fontFamily="Inter" opacity="0.7">
                {fmt(max * t, unit)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((v, i) => {
          const barH = (v / max) * cH;
          const x = PAD.left + i * gap + (gap - barW) / 2;
          const y = PAD.top + cH - barH;
          const isHover = hoverIdx === i;
          return (
            <g key={i}>
              <rect
                x={x} y={y} width={barW} height={barH}
                rx="2"
                fill={isHover ? color : `${color}99`}
                style={{ transition: 'fill 0.1s' }}
              />
              <rect
                x={PAD.left + i * gap} y={PAD.top}
                width={gap} height={cH}
                fill="transparent"
                onMouseEnter={() => setHoverIdx(i)}
              />
            </g>
          );
        })}

        {/* X labels */}
        {labels.map((l, i) => {
          if (i % xStep !== 0 && i !== labels.length - 1) return null;
          const x = PAD.left + i * gap + gap / 2;
          return (
            <text key={l} x={x} y={height - 4} textAnchor="middle"
              fill="#B9CBBC" fontSize="9" fontFamily="Inter" opacity="0.6">
              {l}
            </text>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoverIdx !== null && (() => {
        const i = hoverIdx;
        const x = PAD.left + i * gap + gap / 2;
        const barH = (data[i] / max) * cH;
        const y = PAD.top + cH - barH;
        return (
          <div
            className="absolute pointer-events-none px-2.5 py-1.5 rounded-lg text-xs font-bold"
            style={{
              left: `${(x / W) * 100}%`,
              top: `${(y / height) * 100}%`,
              transform: 'translate(-50%, -130%)',
              background: '#1C1B1C',
              border: `1px solid ${color}40`,
              color,
              fontFamily: 'Inter',
              whiteSpace: 'nowrap',
              zIndex: 10,
            }}
          >
            {fmt(data[i], unit)}
            <span style={{ color: '#B9CBBC', fontWeight: 400 }}> · {labels[i]}</span>
          </div>
        );
      })()}
    </div>
  );
};

export default BarChart;
