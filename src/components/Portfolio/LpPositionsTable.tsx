import { useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { PAIRS, type PairKey } from '../../lib/contracts';
import { useLpPosition } from '../../hooks/usePortfolio';

const TOKEN_ICONS: Record<string, string> = {
  WETH: '/swap-icons/eth-icon-56586a.png',
  USDC: '/swap-icons/usdc-icon-56586a.png',
};
const TOKEN_COLORS: Record<string, string> = {
  WETH: '#627EEA', USDC: '#2775CA', WBTC: '#F7931A', ARB: '#12AAFF', DAI: '#F5AC37',
};

const TokenIcon = ({ symbol, size = 22 }: { symbol: string; size?: number }) => {
  const icon = TOKEN_ICONS[symbol];
  if (icon) return <img src={icon} alt={symbol} className="rounded-full flex-shrink-0" style={{ width: size, height: size }} />;
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, background: TOKEN_COLORS[symbol] ?? '#888', fontSize: size * 0.36, fontFamily: 'Space Grotesk' }}>
      {symbol.slice(0, 2)}
    </div>
  );
};

const CoverageBar = ({ pct }: { pct: number }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)', minWidth: 60 }}>
      <div className="h-full rounded-full transition-all"
        style={{ width: `${Math.min(100, pct)}%`, background: pct >= 100 ? '#00FF9D' : pct >= 50 ? '#56FFA8' : '#568DFF' }} />
    </div>
    <span className="text-xs font-bold flex-shrink-0" style={{ color: '#00E38B', fontFamily: 'Inter' }}>
      {pct.toFixed(1)}%
    </span>
  </div>
);

const TIER_LABEL: Record<string, string> = {
  'WETH/USDC': 'Blue Chip', 'WBTC/USDC': 'Blue Chip',
  'ARB/USDC': 'Volatile', 'DAI/USDC': 'Stable', 'WETH/DAI': 'Blue Chip',
};

function LpRow({ pairKey, index }: { pairKey: PairKey; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const d = useLpPosition(pairKey);

  if (!d.hasLp && !d.hasIlPos) return null;

  return (
    <div style={{
      background: expanded ? 'rgba(0,255,157,0.02)' : index % 2 === 0 ? '#131314' : 'rgba(255,255,255,0.01)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div className="grid items-center px-6 py-4 cursor-pointer"
        style={{ gridTemplateColumns: '2fr 100px 100px 120px 60px 140px 100px 32px' }}
        onClick={() => setExpanded(e => !e)}>

        {/* Pool */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center flex-shrink-0">
            <TokenIcon symbol={d.t0.symbol} />
            <div style={{ marginLeft: -6 }}><TokenIcon symbol={d.t1.symbol} /></div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold truncate" style={{ fontFamily: 'Space Grotesk', color: '#E5E2E3' }}>
              {d.t0.symbol} / {d.t1.symbol}
            </span>
            <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{TIER_LABEL[pairKey] ?? 'Volatile'}</span>
          </div>
        </div>

        <span className="text-sm truncate" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{d.entryValueFmt}</span>
        <span className="text-sm font-medium truncate" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>{d.currentValueFmt}</span>

        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold truncate" style={{ color: d.ilIsLoss ? '#FF6464' : '#00E38B', fontFamily: 'Inter' }}>
            {d.ilFmt}
          </span>
          <span className="text-xs truncate" style={{ color: d.ilIsLoss ? '#FF6464' : '#00E38B', fontFamily: 'Inter', opacity: 0.8 }}>
            {d.ilPctFmt}
          </span>
        </div>

        <span className="text-sm" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{d.daysInPool}d</span>
        <CoverageBar pct={d.coveragePct} />
        <span className="text-sm font-bold truncate" style={{ color: '#00E38B', fontFamily: 'Inter' }}>{d.estPayoutFmt}</span>

        <div className="flex items-center justify-end">
          <span className="material-symbols-outlined"
            style={{ color: '#B9CBBC', fontSize: 18, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            expand_more
          </span>
        </div>
      </div>

      {expanded && (
        <div className="px-6 pb-5 grid grid-cols-2 md:grid-cols-4 gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {[
            { label: 'Entry Timestamp',        value: d.entryTimestamp },
            { label: 'Current TWAP Price',     value: d.currentTwapFmt },
            { label: 'LP Tokens',              value: d.lpFmt },
            { label: 'Days Until Full Coverage', value: `${d.daysToFull}d remaining` },
          ].map(item => (
            <div key={item.label} className="rounded-lg p-3 flex flex-col gap-1"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{item.label}</span>
              <span className="text-sm font-bold" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>{item.value}</span>
            </div>
          ))}

          {/* Coverage progress bar */}
          <div className="col-span-2 md:col-span-4 rounded-lg p-3 flex flex-col gap-2"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex justify-between">
              <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Coverage Schedule (0 → 240 days → 100%)</span>
              <span className="text-xs font-bold" style={{ color: '#00E38B', fontFamily: 'Inter' }}>{d.coveragePct.toFixed(1)}% unlocked</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full" style={{
                width: `${Math.min(100, (d.daysInPool / 240) * 100)}%`,
                background: 'linear-gradient(to right, #568DFF, #00FF9D)',
              }} />
            </div>
            <div className="flex justify-between text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
              <span>Day 0</span><span>Day 60</span><span>Day 120</span><span>Day 180</span><span>Day 240</span>
            </div>
          </div>

          {/* Token breakdown */}
          <div className="col-span-2 md:col-span-4 grid grid-cols-2 gap-3">
            {[
              { label: `${d.t0.symbol} in Pool`, value: d.token0Amt.toFixed(6) + ' ' + d.t0.symbol },
              { label: `${d.t1.symbol} in Pool`, value: d.token1Amt.toFixed(d.t1.decimals === 6 ? 2 : 6) + ' ' + d.t1.symbol },
            ].map(item => (
              <div key={item.label} className="rounded-lg p-3 flex flex-col gap-1"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{item.label}</span>
                <span className="text-sm font-bold" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const LpPositionsTable = () => {
  const account = useActiveAccount();
  const pairKeys = Object.keys(PAIRS) as PairKey[];

  if (!account?.address) return null;

  return (
    <div className="mb-8">
      <h2 className="font-black text-lg font-headline mb-4" style={{ color: '#E5E2E3', letterSpacing: '-0.01em' }}>
        LP Positions
      </h2>
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="grid items-center px-6 py-3 text-xs font-bold uppercase"
          style={{
            gridTemplateColumns: '2fr 100px 100px 120px 60px 140px 100px 32px',
            background: '#1C1B1C', color: '#B9CBBC', fontFamily: 'Inter',
            letterSpacing: '0.08em', borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
          <span>Pool</span><span>Entry</span><span>Current</span>
          <span>IL</span><span>Days</span><span>Coverage</span><span>Payout</span><span />
        </div>

        {pairKeys.map((key, i) => <LpRow key={key} pairKey={key} index={i} />)}

        {/* Empty state — rendered as a fallback row if all LpRows return null */}
        <div id="lp-empty-fallback" className="flex flex-col items-center justify-center py-12 gap-2"
          style={{ background: '#131314', display: 'none' }}>
          <span className="material-symbols-outlined text-3xl" style={{ color: '#3B4A3F' }}>water</span>
          <p className="text-sm" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>No LP positions found.</p>
        </div>
      </div>
    </div>
  );
};

export default LpPositionsTable;
