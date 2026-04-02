import { useState } from 'react';
import { POOLS, type PoolTier } from './poolsData';
import TierBadge from './TierBadge';
import TokenPairLogos from './TokenPairLogos';
import PoolRowExpanded from './PoolRowExpanded';
import AddLiquidityModal from './AddLiquidityModal';
import RemoveLiquidityModal from './RemoveLiquidityModal';

type Filter = 'All' | PoolTier;
const FILTERS: Filter[] = ['All', 'Stable', 'Blue Chip', 'Volatile'];

const PoolsTable = () => {
  const [filter, setFilter] = useState<Filter>('All');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addModal, setAddModal] = useState<string | null>(null);
  const [removeModal, setRemoveModal] = useState<string | null>(null);

  const filtered = POOLS.filter((p) => {
    const matchesTier = filter === 'All' || p.tier === filter;
    const matchesSearch =
      search === '' ||
      p.token0.symbol.toLowerCase().includes(search.toLowerCase()) ||
      p.token1.symbol.toLowerCase().includes(search.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const addPool = POOLS.find((p) => p.id === addModal);
  const removePool = POOLS.find((p) => p.id === removeModal);

  return (
    <>
      {/* Filter / Search bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Filter pills */}
        <div className="flex items-center gap-2 p-1 rounded-lg" style={{ background: '#1C1B1C' }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded text-sm font-bold transition-all"
              style={{
                fontFamily: 'Space Grotesk',
                background: filter === f ? 'rgba(0,255,157,0.15)' : 'transparent',
                color: filter === f ? '#00FF9D' : '#B9CBBC',
                border: filter === f ? '1px solid rgba(0,255,157,0.25)' : '1px solid transparent',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.06)', minWidth: 220 }}
        >
          <span className="material-symbols-outlined text-base" style={{ color: '#B9CBBC', fontSize: 18 }}>search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pools..."
            className="bg-transparent border-none outline-none text-sm flex-1"
            style={{ color: '#E5E2E3', fontFamily: 'Inter' }}
          />
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Table header */}
        <div
          className="grid items-center px-6 py-3 text-xs font-bold uppercase tracking-widest"
          style={{
            gridTemplateColumns: '2fr 100px 110px 110px 90px 90px 100px 130px',
            background: '#1C1B1C',
            color: '#B9CBBC',
            fontFamily: 'Inter',
            letterSpacing: '0.08em',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span>Pool</span>
          <span>Tier</span>
          <span>TVL</span>
          <span>24h Volume</span>
          <span>7d Fees</span>
          <span>APR</span>
          <span>IL Coverage</span>
          <span />
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3" style={{ background: '#131314' }}>
            <span className="material-symbols-outlined text-4xl" style={{ color: '#3B4A3F' }}>search_off</span>
            <p className="text-sm" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>No pools match your search.</p>
          </div>
        ) : (
          filtered.map((pool, i) => {
            const isExpanded = expandedId === pool.id;
            const isLast = i === filtered.length - 1;
            return (
              <div
                key={pool.id}
                style={{
                  background: isExpanded ? 'rgba(0,255,157,0.02)' : i % 2 === 0 ? '#131314' : 'rgba(255,255,255,0.01)',
                  borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)',
                  transition: 'background 0.15s',
                }}
              >
                {/* Main row */}
                <div
                  className="grid items-center px-6 py-4 cursor-pointer group"
                  style={{ gridTemplateColumns: '2fr 100px 110px 110px 90px 90px 100px 130px' }}
                  onClick={() => setExpandedId(isExpanded ? null : pool.id)}
                >
                  <TokenPairLogos token0={pool.token0} token1={pool.token1} />

                  <TierBadge tier={pool.tier} />

                  <span className="text-sm font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>
                    {pool.tvl}
                  </span>

                  <span className="text-sm font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>
                    {pool.volume24h}
                  </span>

                  <span className="text-sm font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>
                    {pool.fees7d}
                  </span>

                  <span
                    className="text-sm font-bold"
                    style={{
                      color: pool.aprRaw > 15 ? '#00E38B' : pool.aprRaw > 8 ? '#56FFA8' : '#B9CBBC',
                      fontFamily: 'Inter',
                    }}
                  >
                    {pool.apr}
                  </span>

                  <span
                    className="text-sm font-bold"
                    style={{ color: '#00E38B', fontFamily: 'Inter' }}
                  >
                    {pool.ilCoverage}
                  </span>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setAddModal(pool.id); }}
                      className="px-3 py-1.5 rounded text-xs font-bold transition-all hover:shadow-[0_0_12px_rgba(0,255,157,0.2)]"
                      style={{
                        background: '#00FF9D',
                        color: '#007143',
                        fontFamily: 'Space Grotesk',
                        fontWeight: 700,
                      }}
                    >
                      + Add
                    </button>
                    <span
                      className="material-symbols-outlined text-base transition-transform"
                      style={{
                        color: '#B9CBBC',
                        fontSize: 18,
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    >
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Expanded row */}
                {isExpanded && (
                  <PoolRowExpanded
                    pool={pool}
                    onAddLiquidity={() => setAddModal(pool.id)}
                    onRemoveLiquidity={() => setRemoveModal(pool.id)}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      {addPool && <AddLiquidityModal pool={addPool} onClose={() => setAddModal(null)} />}
      {removePool && <RemoveLiquidityModal pool={removePool} onClose={() => setRemoveModal(null)} />}
    </>
  );
};

export default PoolsTable;
