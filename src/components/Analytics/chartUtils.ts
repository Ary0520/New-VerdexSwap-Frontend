export type ChartPad = { top: number; right: number; bottom: number; left: number };

export const DEFAULT_PAD: ChartPad = { top: 16, right: 8, bottom: 28, left: 40 };

/** Map data values to SVG coordinates */
export const toPoints = (
  data: number[],
  W: number,
  H: number,
  pad: ChartPad = DEFAULT_PAD,
): [number, number][] => {
  const cW = W - pad.left - pad.right;
  const cH = H - pad.top - pad.bottom;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  return data.map((v, i) => [
    pad.left + (i / (data.length - 1)) * cW,
    pad.top + cH - ((v - min) / range) * cH,
  ]);
};

export const pointsToPolyline = (pts: [number, number][]) =>
  pts.map((p) => p.join(',')).join(' ');

export const pointsToArea = (pts: [number, number][], H: number, pad: ChartPad = DEFAULT_PAD) =>
  [
    `M ${pts[0][0]},${pad.top + H - pad.top - pad.bottom}`,
    ...pts.map((p) => `L ${p[0]},${p[1]}`),
    `L ${pts[pts.length - 1][0]},${pad.top + H - pad.top - pad.bottom}`,
    'Z',
  ].join(' ');

/** Nice Y-axis tick values */
export const yTicks = (data: number[], count = 4): number[] => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  return Array.from({ length: count }, (_, i) =>
    parseFloat((min + (i / (count - 1)) * (max - min)).toFixed(1)),
  );
};

export const fmt = (v: number, unit: '$M' | '%' | 'x' | '$K' = '$M') => {
  if (unit === '$M') return `$${v.toFixed(1)}M`;
  if (unit === '$K') return `$${v.toFixed(1)}K`;
  if (unit === '%')  return `${v.toFixed(1)}%`;
  if (unit === 'x')  return `${v.toFixed(2)}x`;
  return String(v);
};
