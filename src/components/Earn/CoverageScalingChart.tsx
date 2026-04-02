// SVG coverage curve: IL protection % vs Days in Pool
// Curve goes from ~0% at day 0, accelerating to 100% at day 30+
// Uses a cubic bezier approximated as a polyline for smooth rendering

const W = 340;
const H = 160;
const PAD = { top: 24, right: 16, bottom: 36, left: 8 };

const chartW = W - PAD.left - PAD.right;
const chartH = H - PAD.top - PAD.bottom;

// Generate points along a smooth ease-in-out curve (0 → 100% over 30 days)
const DAYS = 32;
const points: [number, number][] = Array.from({ length: DAYS }, (_, i) => {
  const t = i / (DAYS - 1); // 0..1
  // ease-in cubic: slow start, fast end
  const coverage = t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const x = PAD.left + t * chartW;
  const y = PAD.top + chartH - coverage * chartH;
  return [x, y];
});

const polyline = points.map((p) => p.join(',')).join(' ');

// Area fill path
const areaPath = [
  `M ${points[0][0]},${PAD.top + chartH}`,
  ...points.map((p) => `L ${p[0]},${p[1]}`),
  `L ${points[DAYS - 1][0]},${PAD.top + chartH}`,
  'Z',
].join(' ');

// Dot at ~day 15 (midpoint)
const midPoint = points[Math.floor(DAYS / 2)];

const CoverageScalingChart = () => {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Header */}
      <div>
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}
        >
          Coverage Scaling
        </span>
        <p className="text-xs mt-0.5" style={{ color: '#B9CBBC', fontFamily: 'Inter', opacity: 0.7 }}>
          IL protection % vs. Days in Pool
        </p>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full" style={{ height: H }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height={H}
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <defs>
            <linearGradient id="coverageGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00FF9D" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00FF9D" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path d={areaPath} fill="url(#coverageGrad)" />

          {/* Curve line */}
          <polyline
            points={polyline}
            fill="none"
            stroke="#00FF9D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Mid dot */}
          <circle cx={midPoint[0]} cy={midPoint[1]} r="4" fill="#131314" stroke="#00FF9D" strokeWidth="2" />

          {/* 100% label at end */}
          <rect
            x={points[DAYS - 1][0] - 62}
            y={PAD.top - 18}
            width={62}
            height={18}
            rx="3"
            fill="#00FF9D"
          />
          <text
            x={points[DAYS - 1][0] - 31}
            y={PAD.top - 5}
            textAnchor="middle"
            fill="#007143"
            fontSize="9"
            fontFamily="Inter"
            fontWeight="900"
            letterSpacing="0.08em"
          >
            100% COVERAGE
          </text>

          {/* X-axis labels */}
          {[
            { label: '0 DAYS', x: PAD.left },
            { label: '15 DAYS', x: PAD.left + chartW * 0.5 },
            { label: '30 DAYS+', x: PAD.left + chartW },
          ].map(({ label, x }) => (
            <text
              key={label}
              x={x}
              y={H - 4}
              textAnchor={x === PAD.left ? 'start' : x === PAD.left + chartW ? 'end' : 'middle'}
              fill="#B9CBBC"
              fontSize="9"
              fontFamily="Inter"
              opacity="0.7"
            >
              {label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default CoverageScalingChart;
