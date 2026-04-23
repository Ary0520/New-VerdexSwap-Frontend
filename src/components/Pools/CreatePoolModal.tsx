import { useState } from 'react';
import { useActiveAccount, useReadContract, useSendTransaction } from 'thirdweb/react';
import { getContract, prepareContractCall } from 'thirdweb';
import { client, arbitrumSepolia } from '../../lib/thirdweb';
import { FACTORY_ABI } from '../../lib/abis/factory';
import { ADDRESSES, TOKENS, type TokenSymbol } from '../../lib/contracts';
import { TOKEN_LIST } from '../shared/tokens';

const factoryContract = getContract({
  client, chain: arbitrumSepolia,
  address: ADDRESSES.factory, abi: FACTORY_ABI,
});

const TIER_LABELS: Record<number, { label: string; color: string; bg: string; border: string; desc: string }> = {
  0: { label: 'Stable',    color: '#568DFF', bg: 'rgba(86,141,255,0.1)',  border: 'rgba(86,141,255,0.25)',  desc: '0.10% fee · 100% max IL coverage' },
  1: { label: 'Blue Chip', color: '#F7931A', bg: 'rgba(247,147,26,0.1)',  border: 'rgba(247,147,26,0.25)',  desc: '0.35% fee · 50% max IL coverage'  },
  2: { label: 'Volatile',  color: '#00E38B', bg: 'rgba(0,255,157,0.1)',   border: 'rgba(0,255,157,0.2)',    desc: '0.55% fee · 25% max IL coverage'  },
};

const TokenIcon = ({ symbol, size = 28 }: { symbol: string; size?: number }) => {
  const t = TOKEN_LIST.find(t => t.symbol === symbol);
  if (t?.icon) return <img src={t.icon} alt={symbol} className="rounded-full flex-shrink-0" style={{ width: size, height: size }} />;
  const color = t?.color ?? '#888';
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.36, fontFamily: 'Space Grotesk' }}>
      {symbol.slice(0, 2)}
    </div>
  );
};

type Props = { onClose: () => void };

const CreatePoolModal = ({ onClose }: Props) => {
  const account = useActiveAccount();
  const { mutateAsync: sendTx } = useSendTransaction();

  const [tokenA, setTokenA] = useState<TokenSymbol>('WETH');
  const [tokenB, setTokenB] = useState<TokenSymbol>('DAI');
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [newPairAddr, setNewPairAddr] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addrA = TOKENS[tokenA]?.address;
  const addrB = TOKENS[tokenB]?.address;
  const sameToken = tokenA === tokenB;

  // Check if pair already exists
  const { data: existingPair } = useReadContract({
    contract: factoryContract, method: 'getPair',
    params: [addrA ?? '0x0000000000000000000000000000000000000000', addrB ?? '0x0000000000000000000000000000000000000000'],
    queryOptions: { enabled: !!addrA && !!addrB && !sameToken },
  });
  const pairExists = existingPair && existingPair !== '0x0000000000000000000000000000000000000000';

  // Detect what tier this pair would be
  const { data: tierRaw } = useReadContract({
    contract: factoryContract, method: 'detectTier',
    params: [addrA ?? '0x0000000000000000000000000000000000000000', addrB ?? '0x0000000000000000000000000000000000000000'],
    queryOptions: { enabled: !!addrA && !!addrB && !sameToken && !pairExists },
  });
  const tier = TIER_LABELS[Number(tierRaw ?? 2)] ?? TIER_LABELS[2];

  const handleCreate = async () => {
    if (!account?.address || !addrA || !addrB || sameToken || pairExists) return;
    setStatus('pending');
    setError(null);
    try {
      const result = await sendTx(prepareContractCall({
        contract: factoryContract,
        method: 'createPair',
        params: [addrA, addrB],
      }));
      setTxHash(result.transactionHash);
      // Compute the pair address after creation
      setStatus('success');
    } catch (e: unknown) {
      setStatus('error');
      const msg = e instanceof Error ? e.message : 'Transaction failed';
      // Map known errors
      if (msg.includes('DEX__PairAlreadyExists')) setError('This pair already exists.');
      else if (msg.includes('DEX__IdenticalTokens')) setError('Cannot create a pair with the same token.');
      else if (msg.includes('DEX__ZeroAddress')) setError('Invalid token address.');
      else setError(msg.split('(')[0].trim().slice(0, 120));
    }
  };

  const canCreate = !!account?.address && !sameToken && !pairExists && status !== 'pending';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative rounded-2xl w-full max-w-md flex flex-col gap-5 p-6"
        style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 64px rgba(0,0,0,0.5)' }}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-black text-xl font-headline" style={{ color: '#E5E2E3', letterSpacing: '-0.02em' }}>
              Create New Pool
            </h2>
            <p className="text-xs mt-0.5" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
              Deploy a new trading pair on VerdexSwap
            </p>
          </div>
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-white/5">
            <span className="material-symbols-outlined" style={{ color: '#B9CBBC', fontSize: 20 }}>close</span>
          </button>
        </div>

        {/* Token selectors */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold uppercase tracking-widest" style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.08em' }}>
            Select Token Pair
          </label>

          <div className="grid grid-cols-2 gap-3">
            {(['A', 'B'] as const).map(side => {
              const current = side === 'A' ? tokenA : tokenB;
              const setCurrent = side === 'A' ? setTokenA : setTokenB;
              const other = side === 'A' ? tokenB : tokenA;
              return (
                <div key={side} className="flex flex-col gap-1.5">
                  <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>Token {side}</span>
                  <div className="relative">
                    <select
                      value={current}
                      onChange={e => setCurrent(e.target.value as TokenSymbol)}
                      className="w-full appearance-none rounded-lg px-3 py-2.5 pr-8 text-sm font-bold outline-none cursor-pointer"
                      style={{
                        background: '#131314', border: '1px solid rgba(255,255,255,0.08)',
                        color: '#E5E2E3', fontFamily: 'Space Grotesk',
                      }}>
                      {Object.keys(TOKENS).map(sym => (
                        <option key={sym} value={sym} disabled={sym === other}>{sym}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: '#B9CBBC', fontSize: 16 }}>expand_more</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pair preview */}
          {!sameToken && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center">
                <TokenIcon symbol={tokenA} size={28} />
                <div style={{ marginLeft: -8 }}><TokenIcon symbol={tokenB} size={28} /></div>
              </div>
              <span className="font-black text-base font-headline" style={{ color: '#E5E2E3' }}>
                {tokenA} / {tokenB}
              </span>
            </div>
          )}
        </div>

        {/* Tier detection */}
        {!sameToken && !pairExists && tierRaw !== undefined && (
          <div className="flex items-start gap-3 px-4 py-3 rounded-lg"
            style={{ background: tier.bg, border: `1px solid ${tier.border}` }}>
            <span className="material-symbols-outlined mt-0.5" style={{ color: tier.color, fontSize: 18, fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest"
                  style={{ color: tier.color, fontFamily: 'Inter', letterSpacing: '0.08em' }}>
                  {tier.label} Tier
                </span>
              </div>
              <span className="text-xs" style={{ color: tier.color, fontFamily: 'Inter', opacity: 0.8 }}>
                {tier.desc}
              </span>
              <span className="text-xs mt-1" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
                Tier is auto-detected based on token whitelist configuration.
              </span>
            </div>
          </div>
        )}

        {/* Pair already exists warning */}
        {pairExists && !sameToken && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg"
            style={{ background: 'rgba(255,180,0,0.08)', border: '1px solid rgba(255,180,0,0.2)' }}>
            <span className="material-symbols-outlined" style={{ color: '#FFB400', fontSize: 18, fontVariationSettings: "'FILL' 1" }}>warning</span>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold" style={{ color: '#FFB400', fontFamily: 'Inter' }}>
                Pool already exists
              </span>
              <a href={`https://sepolia.arbiscan.io/address/${existingPair}`}
                target="_blank" rel="noopener noreferrer"
                className="text-xs font-mono hover:text-[#568DFF]"
                style={{ color: '#B9CBBC', textDecoration: 'none' }}>
                {(existingPair as string).slice(0, 20)}…{(existingPair as string).slice(-6)} ↗
              </a>
            </div>
          </div>
        )}

        {/* Same token warning */}
        {sameToken && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg"
            style={{ background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.2)' }}>
            <span className="material-symbols-outlined" style={{ color: '#FF6464', fontSize: 16 }}>error</span>
            <span className="text-sm" style={{ color: '#FF6464', fontFamily: 'Inter' }}>Select two different tokens.</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-lg text-sm"
            style={{ background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.2)', color: '#FF6464', fontFamily: 'Inter' }}>
            {error}
          </div>
        )}

        {/* Success */}
        {status === 'success' && txHash && (
          <div className="flex flex-col gap-2 px-4 py-3 rounded-lg"
            style={{ background: 'rgba(0,255,157,0.06)', border: '1px solid rgba(0,255,157,0.2)' }}>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ color: '#00FF9D', fontSize: 18, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="text-sm font-bold" style={{ color: '#00E38B', fontFamily: 'Inter' }}>Pool created successfully!</span>
            </div>
            <a href={`https://sepolia.arbiscan.io/tx/${txHash}`}
              target="_blank" rel="noopener noreferrer"
              className="text-xs font-mono flex items-center gap-1 hover:text-[#568DFF]"
              style={{ color: '#B9CBBC', textDecoration: 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>open_in_new</span>
              {txHash.slice(0, 22)}…{txHash.slice(-6)}
            </a>
            <p className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
              The new pool will appear in the table once the page refreshes.
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button onClick={onClose}
            className="py-3 rounded-lg font-bold text-sm transition-all hover:brightness-110"
            style={{ background: '#353436', color: '#E5E2E3', fontFamily: 'Space Grotesk', fontWeight: 700 }}>
            {status === 'success' ? 'Close' : 'Cancel'}
          </button>
          <button
            onClick={handleCreate}
            disabled={!canCreate}
            className="py-3 rounded-lg font-black text-sm transition-all active:scale-[0.98]"
            style={{
              fontFamily: 'Space Grotesk', fontWeight: 900,
              background: !canCreate ? 'rgba(0,255,157,0.15)' : '#00FF9D',
              color: !canCreate ? '#00E38B' : '#007143',
              boxShadow: canCreate ? '0 8px 24px -4px rgba(0,255,157,0.25)' : 'none',
              cursor: !canCreate ? 'not-allowed' : 'pointer',
            }}>
            {status === 'pending' ? (
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>progress_activity</span>
                Creating…
              </span>
            ) : status === 'success' ? '✓ Created' : 'Create Pool'}
          </button>
        </div>

        {/* Info note */}
        {status === 'idle' && !pairExists && !sameToken && (
          <p className="text-xs text-center" style={{ color: '#3B4A3F', fontFamily: 'Inter' }}>
            Pool creation is permissionless. Anyone can create a pair for any two tokens.
          </p>
        )}
      </div>
    </div>
  );
};

export default CreatePoolModal;
