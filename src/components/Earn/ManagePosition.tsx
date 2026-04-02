import { useState } from 'react';
import type { Vault } from './earnData';

type Tab = 'stake' | 'unstake';

const ManagePosition = ({ vault }: { vault: Vault }) => {
  const [tab, setTab] = useState<Tab>('stake');
  const [amount, setAmount] = useState('');
  const [unstakeRequested, setUnstakeRequested] = useState(false);

  const hasPosition = parseFloat(vault.stakedUsdc.replace(',', '')) > 0;

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-5"
      style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Header + tabs */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}
        >
          Manage Position
        </span>
        <div className="flex items-center gap-1">
          {(['stake', 'unstake'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all"
              style={{
                fontFamily: 'Inter',
                letterSpacing: '0.08em',
                color: tab === t ? '#00FF9D' : '#B9CBBC',
                borderBottom: tab === t ? '2px solid #00FF9D' : '2px solid transparent',
                background: 'transparent',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Amount input */}
      <div
        className="rounded-lg px-4 pt-3 pb-4"
        style={{ background: 'rgba(14,14,15,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
            {tab === 'stake' ? 'Amount to Stake' : 'Amount to Unstake'}
          </span>
          <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
            {tab === 'stake' ? 'Balance: 24,500.00 USDC' : `Staked: ${vault.stakedUsdc} USDC`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="bg-transparent border-none outline-none font-bold flex-1 min-w-0"
            style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, color: amount ? '#E5E2E3' : '#3B4A3F' }}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAmount(tab === 'stake' ? '24500' : vault.stakedUsdc.replace(',', ''))}
              className="px-2 py-0.5 rounded text-xs font-bold"
              style={{ background: '#353436', color: '#E5E2E3', fontFamily: 'Inter' }}
            >
              MAX
            </button>
            <span className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: '#E5E2E3' }}>
              USDC
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          className="py-3.5 rounded-lg font-black uppercase tracking-tight text-sm transition-all hover:brightness-110 active:scale-[0.98]"
          style={{
            background: '#353436',
            color: '#E5E2E3',
            fontFamily: 'Space Grotesk',
            fontWeight: 900,
            fontSize: 13,
            letterSpacing: '-0.01em',
          }}
        >
          {tab === 'stake' ? 'Approve USDC' : 'Approve vLP'}
        </button>
        <button
          className="py-3.5 rounded-lg font-black uppercase tracking-tight text-sm transition-all active:scale-[0.98]"
          style={{
            background: amount ? '#00FF9D' : 'rgba(0,255,157,0.2)',
            color: amount ? '#007143' : '#00E38B',
            fontFamily: 'Space Grotesk',
            fontWeight: 900,
            fontSize: 13,
            letterSpacing: '-0.01em',
            boxShadow: amount ? '0 8px 24px -4px rgba(0,255,157,0.25)' : 'none',
            cursor: amount ? 'pointer' : 'not-allowed',
          }}
        >
          {tab === 'stake' ? 'Confirm Stake' : 'Confirm Unstake'}
        </button>
      </div>

      {/* Pending fees + unstake window */}
      <div
        className="flex items-center justify-between pt-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Pending fees */}
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest" style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em', fontSize: 10 }}>
            Pending Fees
          </span>
          <div className="flex items-center gap-2">
            <span className="font-black text-base font-headline" style={{ color: '#00FF9D' }}>
              {vault.pendingFees}
            </span>
            {hasPosition && (
              <button
                className="px-2.5 py-0.5 rounded text-xs font-black uppercase tracking-widest"
                style={{
                  background: 'rgba(86,141,255,0.15)',
                  color: '#568DFF',
                  border: '1px solid rgba(86,141,255,0.25)',
                  fontFamily: 'Inter',
                  fontSize: 10,
                  letterSpacing: '0.08em',
                }}
              >
                Harvest
              </button>
            )}
          </div>
        </div>

        {/* Unstake window */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs uppercase tracking-widest" style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em', fontSize: 10 }}>
            Unstake Window
          </span>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold"
              style={{ color: unstakeRequested ? '#00E38B' : '#FF6464', fontFamily: 'Inter' }}
            >
              {unstakeRequested ? 'Requested' : 'Not Requested'}
            </span>
            <button
              onClick={() => setUnstakeRequested((v) => !v)}
              className="px-3 py-1 rounded text-xs font-bold transition-all hover:brightness-110"
              style={{
                background: '#353436',
                color: '#E5E2E3',
                fontFamily: 'Inter',
                fontWeight: 700,
              }}
            >
              {unstakeRequested ? 'Cancel' : 'Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePosition;
