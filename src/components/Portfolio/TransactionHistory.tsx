import { useState } from 'react';
import { TRANSACTIONS, type TxType } from './portfolioData';

const ALL_FILTERS: (TxType | 'All')[] = ['All', 'Swap', 'Liquidity', 'Staking', 'IL Payout'];

const typeStyles: Record<TxType, { color: string; bg: string; border: string; icon: string }> = {
  Swap:       { color: '#568DFF', bg: 'rgba(86,141,255,0.1)',  border: 'rgba(86,141,255,0.2)',  icon: 'swap_horiz'    },
  Liquidity:  { color: '#00E38B', bg: 'rgba(0,255,157,0.1)',   border: 'rgba(0,255,157,0.2)',   icon: 'water'         },
  Staking:    { color: '#56FFA8', bg: 'rgba(86,255,168,0.1)',  border: 'rgba(86,255,168,0.2)',  icon: 'savings'       },
  'IL Payout':{ color: '#FFB400', bg: 'rgba(255,180,0,0.1)',   border: 'rgba(255,180,0,0.2)',   icon: 'verified_user' },
};

const TransactionHistory = () => {
  const [filter, setFilter] = useState<TxType | 'All'>('All');

  const filtered = filter === 'All' ? TRANSACTIONS : TRANSACTIONS.filter((t) => t.type === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-black text-lg font-headline" style={{ color: '#E5E2E3', letterSpacing: '-0.01em' }}>
          Transaction History
        </h2>
        {/* Filter pills */}
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: '#1C1B1C' }}>
          {ALL_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded text-xs font-bold transition-all"
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
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Header */}
        <div
          className="grid items-center px-6 py-3 text-xs font-bold uppercase"
          style={{
            gridTemplateColumns: '160px 120px 1fr 130px 110px 140px',
            background: '#1C1B1C',
            color: '#B9CBBC',
            fontFamily: 'Inter',
            letterSpacing: '0.08em',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span>Date</span>
          <span>Type</span>
          <span>Tokens</span>
          <span>Amount</span>
          <span>IL Payout</span>
          <span>Tx Hash</span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2" style={{ background: '#131314' }}>
            <span className="material-symbols-outlined text-3xl" style={{ color: '#3B4A3F' }}>receipt_long</span>
            <p className="text-sm" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>No transactions found.</p>
          </div>
        ) : (
          filtered.map((tx, i) => {
            const s = typeStyles[tx.type];
            const isLast = i === filtered.length - 1;
            return (
              <div
                key={tx.id}
                className="grid items-center px-6 py-3.5"
                style={{
                  gridTemplateColumns: '160px 120px 1fr 130px 110px 140px',
                  background: i % 2 === 0 ? '#131314' : 'rgba(255,255,255,0.01)',
                  borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{tx.date}</span>

                {/* Type badge */}
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined" style={{ color: s.color, fontSize: 14, fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-sm"
                    style={{ fontFamily: 'Inter', color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
                  >
                    {tx.type}
                  </span>
                </div>

                <span className="text-sm font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>{tx.tokens}</span>
                <span className="text-sm font-bold" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>{tx.amount}</span>

                <span
                  className="text-sm font-bold"
                  style={{ color: tx.ilPayout !== '—' ? '#FFB400' : '#3B4A3F', fontFamily: 'Inter' }}
                >
                  {tx.ilPayout}
                </span>

                {/* Tx hash */}
                <a
                  href="#"
                  className="flex items-center gap-1 text-xs transition-colors hover:text-[#568DFF]"
                  style={{ color: '#B9CBBC', fontFamily: 'Inter', textDecoration: 'none' }}
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="font-mono">{tx.txHash}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 12 }}>open_in_new</span>
                </a>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
