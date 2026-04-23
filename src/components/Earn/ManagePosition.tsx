import { useState, useEffect } from 'react';
import { useActiveAccount, useReadContract } from 'thirdweb/react';
import { getContract } from 'thirdweb';
import { formatUnits, parseUnits } from 'viem';
import { client, arbitrumSepolia } from '../../lib/thirdweb';
import { ERC20_ABI } from '../../lib/abis/erc20';
import { TOKENS, PAIRS, type PairKey } from '../../lib/contracts';
import {
  useStakerPosition, usePendingFees, useVaultConfig,
  useVaultGlobalPause, useCooldownRemaining,
} from '../../hooks/useVaultHealth';
import { useStake, useRequestUnstake, useUnstake, useHarvestFees } from '../../hooks/useVaultActions';

type Tab = 'stake' | 'unstake';

const usdcContract = getContract({
  client, chain: arbitrumSepolia,
  address: TOKENS.USDC.address, abi: ERC20_ABI,
});

// Live countdown that re-renders every second
function CooldownTimer({ secsRemaining, label }: { secsRemaining: number; label: string }) {
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    if (secsRemaining <= 0) return;
    const id = setInterval(() => forceUpdate(n => n + 1), 1000);
    return () => clearInterval(id);
  }, [secsRemaining]);

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
      style={{ background: 'rgba(255,180,0,0.08)', border: '1px solid rgba(255,180,0,0.2)' }}>
      <span className="material-symbols-outlined" style={{ color: '#FFB400', fontSize: 14 }}>timer</span>
      <span className="text-xs font-bold" style={{ color: '#FFB400', fontFamily: 'Inter' }}>{label}</span>
    </div>
  );
}

const ManagePosition = ({ pairKey }: { pairKey: PairKey }) => {
  const account = useActiveAccount();
  const pair = PAIRS[pairKey];
  const [tab, setTab] = useState<Tab>('stake');
  const [amount, setAmount] = useState('');

  // On-chain reads
  const { data: usdcBalRaw } = useReadContract({
    contract: usdcContract, method: 'balanceOf',
    params: [account?.address ?? '0x0000000000000000000000000000000000000000'],
    queryOptions: { enabled: !!account?.address, refetchInterval: 10_000 },
  });
  const usdcBal = (usdcBalRaw as bigint | undefined) ?? 0n;
  const usdcBalFmt = parseFloat(formatUnits(usdcBal, 6)).toLocaleString('en-US', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });

  const { amount: stakedRaw, shares, unstakeRequestTime } = useStakerPosition(pair.address, account?.address);
  const { raw: pendingRaw, formatted: pendingFmt } = usePendingFees(pair.address, account?.address);
  const { unstakeCooldownSecs, stakerFeeSharePct, isLoading: configLoading } = useVaultConfig();
  const { isPaused } = useVaultGlobalPause();

  const { secsRemaining, label: cooldownLabel, unlocked } = useCooldownRemaining(unstakeRequestTime, unstakeCooldownSecs);
  const unstakeRequested = unstakeRequestTime > 0n;

  const stakedFmt = parseFloat(formatUnits(stakedRaw, 6)).toLocaleString('en-US', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });
  const hasPosition = stakedRaw > 0n;

  // Actions
  const { stake, status: stakeStatus, txHash: stakeTx, error: stakeErr, reset: resetStake } = useStake();
  const { request, status: reqStatus, error: reqErr } = useRequestUnstake();
  const { unstake, status: unstakeStatus, txHash: unstakeTx, error: unstakeErr, reset: resetUnstake } = useUnstake();
  const { harvest, status: harvestStatus } = useHarvestFees();

  const isBusy = stakeStatus === 'approving' || stakeStatus === 'pending'
    || unstakeStatus === 'pending' || reqStatus === 'pending' || harvestStatus === 'pending';

  const handleMax = () => {
    if (tab === 'stake') setAmount(formatUnits(usdcBal, 6));
    else setAmount(formatUnits(stakedRaw, 6));
  };

  const handleAction = async () => {
    if (!account?.address || !amount || parseFloat(amount) <= 0) return;
    if (tab === 'stake') {
      if (stakeStatus === 'success' || stakeStatus === 'error') { resetStake(); return; }
      await stake(pair.address, amount);
      setAmount('');
    } else {
      if (unstakeStatus === 'success' || unstakeStatus === 'error') { resetUnstake(); return; }
      const parsedAmount = parseUnits(amount, 6);
      const sharesToBurn = stakedRaw > 0n ? (parsedAmount * shares) / stakedRaw : 0n;
      await unstake(pair.address, sharesToBurn);
      setAmount('');
    }
  };

  const getActionLabel = () => {
    if (isPaused) return 'Vault Paused';
    const s = tab === 'stake' ? stakeStatus : unstakeStatus;
    if (s === 'approving') return 'Approving USDC…';
    if (s === 'pending')   return 'Confirming…';
    if (s === 'success')   return '✓ Done';
    if (s === 'error')     return 'Try Again';
    return tab === 'stake' ? 'Confirm Stake' : 'Confirm Unstake';
  };

  const actionDisabled = isPaused || isBusy || !amount || parseFloat(amount) <= 0
    || (tab === 'unstake' && (!unstakeRequested || !unlocked));

  const txHash = tab === 'stake' ? stakeTx : unstakeTx;
  const error  = tab === 'stake' ? stakeErr : (unstakeErr ?? reqErr);

  return (
    <div className="rounded-xl p-5 flex flex-col gap-5"
      style={{ background: '#1C1B1C', border: `1px solid ${isPaused ? 'rgba(255,100,100,0.3)' : 'rgba(255,255,255,0.06)'}` }}>

      {/* Global pause banner */}
      {isPaused && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.25)' }}>
          <span className="material-symbols-outlined" style={{ color: '#FF6464', fontSize: 16, fontVariationSettings: "'FILL' 1" }}>pause_circle</span>
          <span className="text-xs font-bold" style={{ color: '#FF6464', fontFamily: 'Inter' }}>
            Vault is globally paused. All actions are temporarily disabled.
          </span>
        </div>
      )}

      {/* Header + tabs */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest"
          style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}>
          Manage Position
        </span>
        <div className="flex items-center gap-1">
          {(['stake', 'unstake'] as Tab[]).map(t => (
            <button key={t} onClick={() => { setTab(t); setAmount(''); }}
              className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all"
              style={{
                fontFamily: 'Inter', letterSpacing: '0.08em',
                color: tab === t ? '#00FF9D' : '#B9CBBC',
                borderBottom: tab === t ? '2px solid #00FF9D' : '2px solid transparent',
                background: 'transparent',
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Amount input */}
      <div className="rounded-lg px-4 pt-3 pb-4"
        style={{ background: 'rgba(14,14,15,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
            {tab === 'stake' ? 'Amount to Stake' : 'Amount to Unstake'}
          </span>
          <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
            {tab === 'stake' ? `Balance: ${usdcBalFmt} USDC` : `Staked: ${stakedFmt} USDC`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            placeholder="0.00" className="bg-transparent border-none outline-none font-bold flex-1 min-w-0"
            style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, color: amount ? '#E5E2E3' : '#3B4A3F' }} />
          <div className="flex items-center gap-2">
            <button onClick={handleMax} className="px-2 py-0.5 rounded text-xs font-bold"
              style={{ background: '#353436', color: '#E5E2E3', fontFamily: 'Inter' }}>
              MAX
            </button>
            <span className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk', color: '#E5E2E3' }}>USDC</span>
          </div>
        </div>
      </div>

      {/* Unstake flow guidance */}
      {tab === 'unstake' && (
        <>
          {!hasPosition && (
            <div className="px-3 py-2 rounded-lg text-xs"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#B9CBBC', fontFamily: 'Inter' }}>
              No staked position to unstake.
            </div>
          )}
          {hasPosition && !unstakeRequested && (
            <div className="px-3 py-2 rounded-lg text-xs"
              style={{ background: 'rgba(255,180,0,0.08)', border: '1px solid rgba(255,180,0,0.2)', color: '#FFB400', fontFamily: 'Inter' }}>
              Step 1: Request unstake below. You must wait{' '}
              <span className="font-bold">
                {unstakeCooldownSecs >= 3600
                  ? Math.floor(unstakeCooldownSecs / 3600) + 'h'
                  : Math.floor(unstakeCooldownSecs / 60) + 'm'}
              </span>{' '}
              cooldown before withdrawing.
            </div>
          )}
          {hasPosition && unstakeRequested && !unlocked && (
            <CooldownTimer secsRemaining={secsRemaining} label={cooldownLabel} />
          )}
          {hasPosition && unstakeRequested && unlocked && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: 'rgba(0,255,157,0.06)', border: '1px solid rgba(0,255,157,0.2)' }}>
              <span className="material-symbols-outlined" style={{ color: '#00FF9D', fontSize: 14, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="text-xs font-bold" style={{ color: '#00E38B', fontFamily: 'Inter' }}>
                Cooldown complete — enter amount and confirm unstake.
              </span>
            </div>
          )}
        </>
      )}

      {/* Action button */}
      <button onClick={handleAction} disabled={actionDisabled}
        className="w-full py-3.5 rounded-lg font-black uppercase tracking-tight text-sm transition-all active:scale-[0.98]"
        style={{
          fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 13, letterSpacing: '-0.01em',
          background: isPaused ? 'rgba(255,100,100,0.15)' : actionDisabled ? 'rgba(0,255,157,0.15)' : '#00FF9D',
          color: isPaused ? '#FF6464' : actionDisabled ? '#00E38B' : '#007143',
          boxShadow: actionDisabled ? 'none' : '0 8px 24px -4px rgba(0,255,157,0.25)',
          cursor: actionDisabled ? 'not-allowed' : 'pointer',
        }}>
        {getActionLabel()}
      </button>

      {/* Error */}
      {error && (
        <div className="px-3 py-2 rounded-lg text-xs"
          style={{ background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.2)', color: '#FF6464', fontFamily: 'Inter' }}>
          {error.length > 120 ? error.slice(0, 120) + '…' : error}
        </div>
      )}

      {/* Tx hash */}
      {txHash && (
        <a href={`https://sepolia.arbiscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
          style={{ background: 'rgba(0,255,157,0.05)', border: '1px solid rgba(0,255,157,0.15)', color: '#00E38B', fontFamily: 'Inter', textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
          {txHash.slice(0, 20)}…{txHash.slice(-6)}
          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>open_in_new</span>
        </a>
      )}

      {/* Bottom row: pending fees + unstake window */}
      <div className="flex items-start justify-between pt-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>

        {/* Pending fees */}
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest"
            style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em', fontSize: 10 }}>
            Pending Fees
          </span>
          <div className="flex items-center gap-2">
            <span className="font-black text-base font-headline" style={{ color: '#00FF9D' }}>
              {pendingFmt} USDC
            </span>
            {hasPosition && pendingRaw > 0n && (
              <button onClick={() => harvest(pair.address)} disabled={harvestStatus === 'pending' || isPaused}
                className="px-2.5 py-0.5 rounded text-xs font-black uppercase tracking-widest"
                style={{
                  background: 'rgba(86,141,255,0.15)', color: '#568DFF',
                  border: '1px solid rgba(86,141,255,0.25)', fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.08em',
                  cursor: harvestStatus === 'pending' || isPaused ? 'not-allowed' : 'pointer',
                }}>
                {harvestStatus === 'pending' ? '…' : 'Harvest'}
              </button>
            )}
          </div>
          {!configLoading && (
            <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter', opacity: 0.5, fontSize: 10 }}>
              {stakerFeeSharePct.toFixed(0)}% of fees go to stakers
            </span>
          )}
        </div>

        {/* Unstake window */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs uppercase tracking-widest"
            style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em', fontSize: 10 }}>
            Unstake Window
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold"
              style={{
                color: !unstakeRequested ? '#FF6464' : unlocked ? '#00E38B' : '#FFB400',
                fontFamily: 'Inter',
              }}>
              {!unstakeRequested ? 'Not Requested' : unlocked ? 'Unlocked' : 'Cooling Down'}
            </span>
            {!unstakeRequested && hasPosition && (
              <button onClick={() => request(pair.address)} disabled={reqStatus === 'pending' || isPaused}
                className="px-3 py-1 rounded text-xs font-bold transition-all hover:brightness-110"
                style={{ background: '#353436', color: '#E5E2E3', fontFamily: 'Inter', fontWeight: 700 }}>
                {reqStatus === 'pending' ? '…' : 'Request'}
              </button>
            )}
          </div>
          {!configLoading && unstakeCooldownSecs > 0 && (
            <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter', opacity: 0.5, fontSize: 10 }}>
              {unstakeCooldownSecs >= 3600
                ? Math.floor(unstakeCooldownSecs / 3600) + 'h cooldown'
                : Math.floor(unstakeCooldownSecs / 60) + 'm cooldown'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePosition;
