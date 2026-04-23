import { useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useUserTransactions } from '../../hooks/useSubgraph';

type TxType = 'Swap' | 'Liquidity' | 'Staking' | 'IL Payout';
type Filter = TxType | 'All';
const ALL_FILTERS: Filter[] = ['All', 'Swap', 'Liquidity', 'Staking', 'IL Payout'];

const typeStyles: Record<TxType, { color: string; bg: string; border: string; icon: string }> = {
  'Swap':      { color: '#568DFF', bg: 'rgba(86,141,255,0.1)',  border: 'rgba(86,141,255,0.2)',  icon: 'swap_horiz'    },
  'Liquidity': { color: '#00E38B', bg: 'rgba(0,255,157,0.1)',   border: 'rgba(0,255,157,0.2)',   icon: 'water'         },
  'Staking':   { color: '#56FFA8', bg: 'rgba(86,255,168,0.1)',  border: 'rgba(86,255,168,0.2)',  icon: 'savings'       },
  'IL Payout': { color: '#FFB400', bg: 'rgba(255,180,0,0.1)',   border: 'rgba(255,180,0,0.2)',   icon: 'verified_user' },
};

function fmtTs(unix: string) {
  return new Date(parseInt(unix) * 1000).toISOString().replace('T', ' · ').slice(0, 16) + ' UTC';
}
function fmtHash(h: string) { return h.length > 14 ? h.slice(0, 8) + '…' + h.slice(-6) : h; }
function fmtUsd(n: number) {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000)     return '$' + (n / 1_000).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}

type Row = { id: string; date: string; type: TxType; tokens: string; amount: string; ilPayout: string; txHash: string };

const TransactionHistory = () => {
  const account = useActiveAccount();
  const [filter, setFilter] = useState<Filter>('All');
  const { data, loading } = useUserTransactions(account?.address);

  if (!account?.address) return null;

  const rows: Row[] = [];
  if (data) {
    data.swaps.forEach(s => rows.push({
      id: s.id, date: fmtTs(s.timestamp), type: 'Swap',
      tokens: `${s.pool.token0.symbol} → ${s.pool.token1.symbol}`,
      amount: fmtUsd(parseFloat(s.amountUSD)), ilPayout: '—', txHash: s.txHash as string,
    }));
    data.liquidityEvents.forEach(e => rows.push({
      id: e.id, date: fmtTs(e.timestamp), type: 'Liquidity',
      tokens: `${e.pool.token0.symbol} / ${e.pool.token1.symbol} (${e.type})`,
      amount: '—',
      ilPayout: parseFloat(e.ilPayout) > 0 ? fmtUsd(parseFloat(e.ilPayout)) : '—',
      txHash: e.txHash as string,
    }));
    data.stakingEvents.forEach(e => rows.push({
      id: e.id, date: fmtTs(e.timestamp), type: 'Staking',
      tokens: `USDC → Vault (${e.type})`,
      amount: fmtUsd(parseFloat(e.amountUSDC)), ilPayout: '—', txHash: e.txHash as string,
    }));
    data.ilPayouts.forEach(e => rows.push({
      id: e.id, date: fmtTs(e.timestamp), type: 'IL Payout',
      tokens: `${e.pool.token0.symbol} / ${e.pool.token1.symbol}`,
      amount: fmtUsd(parseFloat(e.amountUSDC)),
      ilPayout: fmtUsd(parseFloat(e.amountUSDC)), txHash: e.txHash as string,
    }));
    rows.sort((a, b) => b.date.localeCompare(a.date));
  }

  const filtered = filter === 'All' ? rows : rows.filter(r => r.type === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-black text-lg font-headline" style={{ color: '#E5E2E3', letterSpacing: '-0.01em' }}>Transaction History</h2>
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: '#1C1B1C' }}>
          {ALL_FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 rounded text-xs font-bold transition-all"
              style={{ fontFamily: 'Space Grotesk', background: filter === f ? 'rgba(0,255,157,0.15)' : 'transparent', color: filter === f ? '#00FF9D' : '#B9CBBC', border: filter === f ? '1px solid rgba(0,255,157,0.25)' : '1px solid transparent' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="grid items-center px-6 py-3 text-xs font-bold uppercase"
          style={{ gridTemplateColumns: '160px 120px 1fr 130px 110px 140px', background: '#1C1B1C', color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span>Date</span><span>Type</span><span>Tokens</span><span>Amount</span><span>IL Payout</span><span>Tx Hash</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 gap-3" style={{ background: '#131314' }}>
            <span className="material-symbols-outlined animate-spin" style={{ color: '#B9CBBC', fontSize: 20 }}>progress_activity</span>
            <span className="text-sm" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Loading transactions…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2" style={{ background: '#131314' }}>
            <span className="material-symbols-outlined text-3xl" style={{ color: '#3B4A3F' }}>receipt_long</span>
            <p className="text-sm" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
              {rows.length === 0 ? 'No transactions yet. Subgraph may still be syncing.' : 'No transactions match this filter.'}
            </p>
          </div>
        ) : filtered.map((tx, i) => {
          const s = typeStyles[tx.type];
          return (
            <div key={tx.id} className="grid items-center px-6 py-3.5"
              style={{ gridTemplateColumns: '160px 120px 1fr 130px 110px 140px', background: i % 2 === 0 ? '#131314' : 'rgba(255,255,255,0.01)', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{tx.date}</span>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ color: s.color, fontSize: 14, fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-sm" style={{ fontFamily: 'Inter', color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>{tx.type}</span>
              </div>
              <span className="text-sm font-medium" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>{tx.tokens}</span>
              <span className="text-sm font-bold" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>{tx.amount}</span>
              <span className="text-sm font-bold" style={{ color: tx.ilPayout !== '—' ? '#FFB400' : '#3B4A3F', fontFamily: 'Inter' }}>{tx.ilPayout}</span>
              <a href={`https://sepolia.arbiscan.io/tx/${tx.txHash}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs hover:text-[#568DFF]"
                style={{ color: '#B9CBBC', fontFamily: 'Inter', textDecoration: 'none' }}>
                <span className="font-mono">{fmtHash(tx.txHash)}</span>
                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>open_in_new</span>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionHistory;
