import { useActiveAccount } from 'thirdweb/react';
import { formatUnits } from 'viem';
import { useStakerPosition, usePendingFees } from '../../hooks/useVaultHealth';
import { PAIRS, type PairKey } from '../../lib/contracts';

const YourPosition = ({ pairKey }: { pairKey: PairKey }) => {
  const account = useActiveAccount();
  const pair = PAIRS[pairKey];

  const { amount, shares, isLoading } = useStakerPosition(pair.address, account?.address);
  const { formatted: pendingFeesFmt } = usePendingFees(pair.address, account?.address);

  const hasPosition = amount > 0n;
  const amountFmt = parseFloat(formatUnits(amount, 6)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const sharesFmt = parseFloat(formatUnits(shares, 18)).toFixed(6);

  return (
    <div className="rounded-xl p-5 flex flex-col gap-4"
      style={{ background: 'rgba(0,255,157,0.04)', border: '1px solid rgba(0,255,157,0.12)' }}>
      <span className="text-xs font-bold uppercase tracking-widest"
        style={{ color: '#00E38B', fontFamily: 'Inter', letterSpacing: '0.1em' }}>
        Your Position
      </span>

      {!account?.address ? (
        <div className="flex flex-col items-center justify-center py-6 gap-2">
          <span className="material-symbols-outlined text-3xl" style={{ color: '#3B4A3F' }}>account_balance_wallet</span>
          <p className="text-xs text-center" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Connect wallet to view your position.</p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-6">
          <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Loading…</span>
        </div>
      ) : hasPosition ? (
        <div className="flex flex-col gap-3">
          {[
            { label: 'Staked USDC',   value: amountFmt + ' USDC' },
            { label: 'Vault Shares',  value: sharesFmt + ' vLP'  },
            { label: 'Pending Fees',  value: pendingFeesFmt + ' USDC' },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-sm" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>{row.label}</span>
              <span className="text-sm font-bold" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>{row.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 gap-2">
          <span className="material-symbols-outlined text-3xl" style={{ color: '#3B4A3F' }}>savings</span>
          <p className="text-xs text-center" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>No position in this vault yet.</p>
        </div>
      )}
    </div>
  );
};

export default YourPosition;
