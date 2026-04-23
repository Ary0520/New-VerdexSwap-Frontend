import { useState } from 'react';
import { PAIRS, type PairKey } from '../../lib/contracts';
import { usePairData } from '../../hooks/usePools';
import { usePoolDayData } from '../../hooks/useSubgraph';
import TierBadge from './TierBadge';
import type { PoolTier } from '../../types/pool';
import PoolRowExpanded from './PoolRowExpanded';
import AddLiquidityModal from './AddLiquidityModal';
import RemoveLiquidityModal from './RemoveLiquidityModal';

const TOKEN_META: Record<string, { icon: string; color: string }> = {
  WETH: { icon: '/swap-icons/eth-icon-56586a.png', color: '#627EEA' },
  USDC: { icon: '/swap-icons/usdc-icon-56586a.png', color: '#2775CA' },
  WBTC: { icon: '', color: '#F7931A' },
  ARB:  { icon: '', color: '#12AAFF' },
  DAI:  { icon: '', color: '#F5AC37' },
};

const TokenIcon = ({ symbol, size = 24 }: { symbol: string; size?: number }) => {
  const m = TOKEN_META[symbol] ?? { icon: '', color: '#888' };
  if (m.icon) return <img src={m.icon} alt={symbol} className="rounded-full flex-shrink-0" style={{ width: size, height: size }} />;
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, background: m.color, fontSize: size * 0.32, fontFamily: 'Space Grotesk' }}>
      {symbol.slice(0, 2)}
    </div>
  );
};

function detectTier(lpFeeBps: number): PoolTier {
  if (lpFeeBps <= 5)  return 'Stable';
  if (lpFeeBps <= 20) return 'Blue Chip';
  return 'Volatile';
}

function fmtUsd(usd: number): string {
  if (usd === 0) return '—';
  if (usd >= 1_000_000_000) return '$' + (usd / 1_000_000_000).toFixed(2) + 'B';
  if (usd >= 1_000_000)     return '$' + (usd / 1_000_000).toFixed(2) + 'M';
  if (usd >= 1_000)         return '$' + (usd / 1_000).toFixed(1) + 'K';
  return '$' + usd.toFixed(0);
}

const PoolRow = ({
  pairKey, isExpanded, onToggle, onAdd, onRemove, index,
}: {
  pairKey: PairKey;
  isExpanded: boolean;
  onToggle: () => void;
  onAdd: () => void;
  onRemove: () => void;
  index: number;
}) => {
  const d    = usePairData(pairKey);
  const tier = detectTier(d.lpFeeBps);

  const isUsdQuote = d.t1.symbol === 'USDC' || d.t1.symbol === 'DAI';
  const tvlUsd     = isUsdQuote ? parseFloat(d.reserve1Fmt) * 2 : 0;
  const vaultUsd   = parseFloat(d.usdcReserveFmt);

  // 24h volume + APR from subgraph (last 2 days to get yesterday's volume)
  const pair = PAIRS[pairKey];
  const { data: dayData, loading: dayLoading } = usePoolDayData(pair.address.toLowerCase(), 2);

  // Most recent day's volume
  const vol24h = dayData.length > 0 ? parseFloat(dayData[dayData.length - 1].volumeUSD) : null;

  // Fee APR: (24h fees / TVL) * 365 * 100
  // 24h fees = vol24h * (lpFeeBps / 10000)
  const feeApr = vol24h !== null && tvlUsd > 0
    ? ((vol24h * (d.lpFeeBps / 10000)) / tvlUsd) * 365 * 100
    : null;

  return (
    <div style={{
      background: isExpanded ? 'rgba(0,255,157,0.02)' : index % 2 === 0 ? '#131314' : 'rgba(255,255,255,0.01)',
      transition: 'background 0.15s',
    }}>
      <div
        className="grid items-center px-6 py-4 cursor-pointer"
        style={{ gridTemplateColumns: '1.2fr 110px 90px 90px 80px 120px 150px 40px' }}
        onClick={onToggle}
      >
        {/* Pool */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <TokenIcon symbol={d.t0.symbol} size={24} />
            <div style={{ marginLeft: -8 }}><TokenIcon symbol={d.t1.symbol} size={24} /></div>
          </div>
          <div className="flex flex-col ml-1">
            <span className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: '#E5E2E3' }}>
              {d.t0.symbol}/{d.t1.symbol}
            </span>
            <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
              {(d.totalFeeBps / 100).toFixed(2)}% fee
            </span>
          </div>
        </div>

        <TierBadge tier={tier} />

        {/* TVL */}
        <span className="text-sm font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>
          {d.isLoading ? '…' : fmtUsd(tvlUsd)}
        </span>

        {/* 24h Volume — subgraph */}
        <span className="text-sm font-medium" style={{ color: '#568DFF', fontFamily: 'Inter' }}>
          {dayLoading ? '…' : vol24h !== null ? fmtUsd(vol24h) : '—'}
        </span>

        {/* Fee APR — derived from volume + TVL */}
        <span className="text-sm font-bold" style={{
          color: feeApr !== null ? (feeApr > 20 ? '#00FF9D' : feeApr > 5 ? '#56FFA8' : '#B9CBBC') : '#3B4A3F',
          fontFamily: 'Inter',
        }}>
          {dayLoading ? '…' : feeApr !== null ? feeApr.toFixed(1) + '%' : '—'}
        </span>

        {/* Vault Reserve */}
        <span className="text-sm font-medium" style={{ color: '#00E38B', fontFamily: 'Inter' }}>
          {d.isLoading ? '…' : fmtUsd(vaultUsd)}
        </span>

        {/* Utilization */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full" style={{
              width: Math.min(100, d.utilizationPct) + '%',
              background: d.utilizationPct > 75 ? '#FF6464' : d.utilizationPct > 50 ? '#FFB400' : '#00E38B',
            }} />
          </div>
          <span className="text-xs font-bold flex-shrink-0"
            style={{ color: d.utilizationPct > 75 ? '#FF6464' : d.utilizationPct > 50 ? '#FFB400' : '#00E38B', fontFamily: 'Inter' }}>
            {d.utilizationPct.toFixed(0)}%
          </span>
        </div>

        <div className="flex items-center justify-end">
          <span className="material-symbols-outlined"
            style={{ color: '#B9CBBC', fontSize: 18, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            expand_more
          </span>
        </div>
      </div>

      {isExpanded && (
        <PoolRowExpanded pairKey={pairKey} onAddLiquidity={onAdd} onRemoveLiquidity={onRemove} />
      )}
    </div>
  );
};

const PoolsTable = () => {
  const [search,       setSearch]       = useState('');
  const [expandedKey,  setExpandedKey]  = useState<PairKey | null>(null);
  const [addModal,     setAddModal]     = useState<PairKey | null>(null);
  const [removeModal,  setRemoveModal]  = useState<PairKey | null>(null);

  const allKeys  = Object.keys(PAIRS) as PairKey[];
  const filtered = allKeys.filter((k) =>
    search === '' || k.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="flex items-center justify-end mb-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.06)', minWidth: 220 }}>
          <span className="material-symbols-outlined" style={{ color: '#B9CBBC', fontSize: 18 }}>search</span>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pools..."
            className="bg-transparent border-none outline-none text-sm flex-1"
            style={{ color: '#E5E2E3', fontFamily: 'Inter' }} />
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="grid items-center px-6 py-3 text-xs font-bold uppercase"
          style={{
            gridTemplateColumns: '1.2fr 110px 90px 90px 80px 120px 150px 40px',
            background: '#1C1B1C', color: '#B9CBBC', fontFamily: 'Inter',
            letterSpacing: '0.08em', borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
          <span>Pool</span>
          <span>Tier</span>
          <span>TVL</span>
          <span>24h Vol</span>
          <span>APR</span>
          <span>Vault Reserve</span>
          <span>Utilization</span>
          <span />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3" style={{ background: '#131314' }}>
            <span className="material-symbols-outlined text-4xl" style={{ color: '#3B4A3F' }}>search_off</span>
            <p className="text-sm" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>No pools match your search.</p>
          </div>
        ) : (
          filtered.map((key, i) => (
            <div key={key} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <PoolRow
                pairKey={key} index={i}
                isExpanded={expandedKey === key}
                onToggle={() => setExpandedKey(expandedKey === key ? null : key)}
                onAdd={() => setAddModal(key)}
                onRemove={() => setRemoveModal(key)}
              />
            </div>
          ))
        )}
      </div>

      {addModal    && <AddLiquidityModal    pairKey={addModal}    onClose={() => setAddModal(null)} />}
      {removeModal && <RemoveLiquidityModal pairKey={removeModal} onClose={() => setRemoveModal(null)} />}
    </>
  );
};

export default PoolsTable;
