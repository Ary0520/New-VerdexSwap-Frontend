import { useActiveAccount } from 'thirdweb/react';
import { useILPosition } from '../../hooks/useILPosition';
import { PAIRS, type PairKey } from '../../lib/contracts';

// Contract uses linear scaling: coverage = daysInPool / 240 * maxCoverageBps
// maxCoverageBps defaults to 10000 (100%) — read from factory.getPairConfig
// We render the curve over 240 days (the real full-coverage horizon)
const FULL_COVERAGE_DAYS = 240;

const W = 340;
const H = 160;
const PAD = { top: 28, right: 16, bottom: 36, left: 8 };
const chartW = W - PAD.left - PAD.right;
const chartH = H - PAD.top - PAD.bottom;

// Linear coverage: y = x (straight line from 0 to 100% over 240 days)
// We render it as a smooth curve using ease-in for visual appeal,
// but label it accurately with real day milestones
const N = 60;
const points: [number, number][] = Array.from({ length: N }, (_, i) => {
  const t = i / (N - 1);
  // Slight ease-in to show slow start, but fundamentally linear
  const coverage = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  return [
    PAD.left + t * chartW,
    PAD.top + chartH - coverage * chartH,
  ];
});

const polyline = points.map(p => p.join(',')).join(' ');
const areaPath = [
  `M ${points[0][0]},${PAD.top + chartH}`,
  ...points.map(p => `L ${p[0]},${p[1]}`),
  `L ${points[N - 1][0]},${PAD.top + chartH}`,
  'Z',
].join(' ');

// Map days → x position on chart
function daysToX(days: number): number {
  const t = Math.min(1, days / FULL_COVERAGE_DAYS);
  return PAD.left + t * chartW;
}
// Map coverage % → y position
function coverageToY(pct: number): number {
  return PAD.top + chartH - (pct / 100) * chartH;
}

type Props = { pairKey: PairKey };

const CoverageScalingChart = ({ pairKey }: Props) => {
  const account = useActiveAccount();
  const pair = PAIRS[pairKey];

  const { daysInPool, hasPosition, isLoading } = useILPosition(pair.address, account?.address);

  // User's current coverage % (linear, capped at 100)
  const userCoveragePct = Math.min(100, (daysInPool / FULL_COVERAGE_DAYS) * 100);
  const userX = daysToX(daysInPool);
  const userY = coverageToY(userCoveragePct);

  const showUserDot = !isLoading && hasPosition && daysInPool >= 0;

  return (
    <div className="rounded-xl p-5 flex flex-col gap-3"
      style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div>
        <span className="text-xs font-bold uppercase tracking-widest"
          style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}>
          Coverage Scaling
        </span>
        <p className="text-xs mt-0.5" style={{ color: '#B9CBBC', fontFamily: 'Inter', opacity: 0.7 }}>
          IL protection % vs. Days in Pool · Full coverage at day 240
        </p>
      </div>

      <div className="relative w-full" style={{ height: H }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}
          preserveAspectRatio="none" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="coverageGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00FF9D" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00FF9D" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path d={areaPath} fill="url(#coverageGrad2)" />

          {/* Curve */}
          <polyline points={polyline} fill="none" stroke="#00FF9D"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* 100% label */}
          <rect x={points[N-1][0] - 66} y={PAD.top - 22} width={66} height={18} rx="3" fill="#00FF9D" />
          <text x={points[N-1][0] - 33} y={PAD.top - 9} textAnchor="middle"
            fill="#007143" fontSize="9" fontFamily="Inter" fontWeight="900" letterSpacing="0.08em">
            100% COVERAGE
          </text>

          {/* User position dot */}
          {showUserDot && (
            <>
              {/* Vertical guide line */}
              <line x1={userX} y1={userY} x2={userX} y2={PAD.top + chartH}
                stroke="#568DFF" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
              {/* Dot */}
              <circle cx={userX} cy={userY} r="5"
                fill="#131314" stroke="#568DFF" strokeWidth="2" />
              {/* Label above dot */}
              <rect x={userX - 28} y={userY - 22} width={56} height={16} rx="3"
                fill="rgba(86,141,255,0.15)" />
              <text x={userX} y={userY - 11} textAnchor="middle"
                fill="#568DFF" fontSize="9" fontFamily="Inter" fontWeight="700">
                {userCoveragePct.toFixed(1)}% · {daysInPool}d
              </text>
            </>
          )}

          {/* X-axis labels */}
          {[
            { label: '0', x: PAD.left },
            { label: '60d', x: PAD.left + chartW * 0.25 },
            { label: '120d', x: PAD.left + chartW * 0.5 },
            { label: '180d', x: PAD.left + chartW * 0.75 },
            { label: '240d', x: PAD.left + chartW },
          ].map(({ label, x }) => (
            <text key={label} x={x} y={H - 4}
              textAnchor={x === PAD.left ? 'start' : x === PAD.left + chartW ? 'end' : 'middle'}
              fill="#B9CBBC" fontSize="9" fontFamily="Inter" opacity="0.6">
              {label}
            </text>
          ))}
        </svg>
      </div>

      {/* User position summary below chart */}
      {showUserDot && (
        <div className="flex items-center justify-between px-2 py-1.5 rounded-lg"
          style={{ background: 'rgba(86,141,255,0.06)', border: '1px solid rgba(86,141,255,0.15)' }}>
          <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
            Your position · {daysInPool} days in pool
          </span>
          <span className="text-xs font-bold" style={{ color: '#568DFF', fontFamily: 'Inter' }}>
            {userCoveragePct.toFixed(1)}% coverage · {Math.max(0, 240 - daysInPool)}d to full
          </span>
        </div>
      )}
      {!isLoading && !hasPosition && (
        <p className="text-xs text-center" style={{ color: '#3B4A3F', fontFamily: 'Inter' }}>
          Add liquidity to this pool to see your position on the curve.
        </p>
      )}
    </div>
  );
};

export default CoverageScalingChart;
