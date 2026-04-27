import { useState, useEffect } from 'react';
import { useActiveAccount, useActiveWalletChain, useSwitchActiveWalletChain } from 'thirdweb/react';
import SwapTopNav from '../components/Swap/SwapTopNav';
import AppSidebar from '../components/Swap/AppSidebar';
import ConnectPrompt from '../components/shared/ConnectPrompt';
import {
  useMintToken,
  useTokenBalance,
  getCooldownRemaining,
  formatCooldown,
  FAUCET_AMOUNTS,
} from '../hooks/useFaucet';
import { TOKENS, CHAIN_ID, type TokenSymbol } from '../lib/contracts';
import { arbitrumSepolia } from '../lib/thirdweb';

// ── Token metadata ────────────────────────────────────────────────────────────
const TOKEN_META: Record<TokenSymbol, { color: string; bg: string; icon: string }> = {
  USDC: { color: '#2775CA', bg: 'rgba(39,117,202,0.12)',  icon: '💵' },
  WETH: { color: '#627EEA', bg: 'rgba(98,126,234,0.12)',  icon: '⟠'  },
  WBTC: { color: '#F7931A', bg: 'rgba(247,147,26,0.12)',  icon: '₿'  },
  ARB:  { color: '#12AAFF', bg: 'rgba(18,170,255,0.12)',  icon: '🔵' },
  DAI:  { color: '#F5AC37', bg: 'rgba(245,172,55,0.12)',  icon: '◈'  },
};

const SYMBOLS = Object.keys(TOKENS) as TokenSymbol[];

// ── Token card ────────────────────────────────────────────────────────────────
function TokenCard({ symbol, disabled }: { symbol: TokenSymbol; disabled: boolean }) {
  const account = useActiveAccount();
  const { mint, status, error, txHash, reset } = useMintToken(symbol);
  const { formatted: balance, refetch } = useTokenBalance(symbol);
  const [cooldownMs, setCooldownMs] = useState(0);
  const meta = TOKEN_META[symbol];
  const token = TOKENS[symbol];

  useEffect(() => {
    if (!account?.address) return;
    const tick = () => setCooldownMs(getCooldownRemaining(account.address!, symbol));
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [account?.address, symbol, status]);

  useEffect(() => {
    if (status === 'success') refetch();
  }, [status, refetch]);

  const onCooldown = cooldownMs > 0;
  const isPending = status === 'pending';
  const isSuccess = status === 'success';
  const isError = status === 'error';
  const isDisabled = disabled || isPending || onCooldown;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: '#18181A',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: isSuccess ? `0 0 0 1px ${meta.color}44` : undefined,
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 3, background: meta.color, opacity: 0.7 }} />

      <div className="p-5 flex flex-col gap-4">
        {/* Token identity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: meta.bg, border: `1px solid ${meta.color}33` }}
            >
              {meta.icon}
            </div>
            <div>
              <div className="font-headline font-bold text-sm" style={{ color: '#E5E2E3' }}>
                {token.name}
              </div>
              <div className="text-xs font-mono" style={{ color: '#6B7A6E' }}>{symbol}</div>
            </div>
          </div>

          {/* Balance pill */}
          <div
            className="flex flex-col items-end gap-0.5 px-3 py-1.5 rounded-lg"
            style={{ background: '#0E0E0F' }}
          >
            <span className="text-xs" style={{ color: '#6B7A6E', fontFamily: 'Inter' }}>Balance</span>
            <span className="font-headline font-bold text-sm" style={{ color: '#E5E2E3' }}>
              {account ? balance : '—'}
            </span>
          </div>
        </div>

        {/* Claim amount row */}
        <div
          className="flex items-center justify-between px-4 py-2.5 rounded-xl"
          style={{ background: '#0E0E0F' }}
        >
          <span className="text-xs" style={{ color: '#6B7A6E', fontFamily: 'Inter' }}>Claim amount</span>
          <span className="font-headline font-bold text-sm" style={{ color: meta.color }}>
            {FAUCET_AMOUNTS[symbol]} {symbol}
          </span>
        </div>

        {/* Feedback */}
        {isSuccess && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
            style={{ background: 'rgba(0,255,157,0.07)', color: '#00FF9D', fontFamily: 'Inter' }}
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span>Tokens minted successfully</span>
            {txHash && (
              <a
                href={`https://sepolia.arbiscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
              >
                View tx
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>
            )}
          </div>
        )}
        {isError && error && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
            style={{ background: 'rgba(255,80,80,0.07)', color: '#FF6B6B', fontFamily: 'Inter' }}
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
            <span className="truncate">{error}</span>
          </div>
        )}

        {/* CTA button */}
        <button
          onClick={isSuccess || isError ? reset : mint}
          disabled={isDisabled}
          className="w-full py-2.5 rounded-xl font-headline font-bold text-sm flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98]"
          style={{
            background: isDisabled ? 'rgba(255,255,255,0.04)' : meta.bg,
            color: isDisabled ? '#4A5A4E' : meta.color,
            border: `1px solid ${isDisabled ? 'rgba(255,255,255,0.06)' : meta.color + '33'}`,
            cursor: isDisabled ? 'not-allowed' : 'pointer',
          }}
        >
          {isPending ? (
            <>
              <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
              Minting…
            </>
          ) : onCooldown ? (
            <>
              <span className="material-symbols-outlined text-base">schedule</span>
              {formatCooldown(cooldownMs)}
            </>
          ) : isSuccess ? (
            <>
              <span className="material-symbols-outlined text-base">refresh</span>
              Claim Again
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base">water_drop</span>
              Claim {symbol}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Network switch overlay ────────────────────────────────────────────────────
function WrongNetworkOverlay() {
  const switchChain = useSwitchActiveWalletChain();
  const [switching, setSwitching] = useState(false);

  const handleSwitch = async () => {
    setSwitching(true);
    try { await switchChain(arbitrumSepolia); } finally { setSwitching(false); }
  };

  return (
    <div
      className="rounded-2xl p-8 flex flex-col items-center gap-5 text-center"
      style={{ background: '#18181A', border: '1px solid rgba(255,100,100,0.2)' }}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(255,100,100,0.1)' }}
      >
        <span className="material-symbols-outlined text-3xl" style={{ color: '#FF6464', fontVariationSettings: "'FILL' 1" }}>
          wifi_off
        </span>
      </div>
      <div>
        <div className="font-headline font-bold text-lg mb-1" style={{ color: '#E5E2E3' }}>
          Wrong Network
        </div>
        <div className="text-sm" style={{ color: '#6B7A6E', fontFamily: 'Inter' }}>
          VerdexSwap runs on Arbitrum Sepolia. Switch your network to use the faucet.
        </div>
      </div>
      <button
        onClick={handleSwitch}
        disabled={switching}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-headline font-bold text-sm transition-all active:scale-[0.98] hover:brightness-110"
        style={{ background: '#FF6464', color: '#fff', cursor: switching ? 'wait' : 'pointer' }}
      >
        {switching ? (
          <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
        ) : (
          <span className="material-symbols-outlined text-base">swap_horiz</span>
        )}
        {switching ? 'Switching…' : 'Switch to Arbitrum Sepolia'}
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
const FaucetPage = () => {
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();

  const isConnected = !!account?.address;
  const isWrongNetwork = isConnected && !!activeChain && activeChain.id !== CHAIN_ID;
  const isReady = isConnected && activeChain?.id === CHAIN_ID;

  return (
    <div className="min-h-screen font-body" style={{ background: '#131314', color: '#E5E2E3' }}>
      <SwapTopNav />
      <AppSidebar />

      <main style={{ marginLeft: 200, paddingTop: 65, minHeight: '100vh' }}>
        {/* Ambient glow */}
        <div
          className="pointer-events-none fixed"
          style={{
            width: 500, height: 500,
            background: 'rgba(0,255,157,0.025)',
            filter: 'blur(120px)',
            borderRadius: '50%',
            top: '10%', right: '8%', zIndex: 0,
          }}
        />

        <div className="relative z-10 px-8 py-8" style={{ maxWidth: 860 }}>

          {/* Page header */}
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-2">
              <span
                className="material-symbols-outlined text-xl"
                style={{ color: '#00FF9D', fontVariationSettings: "'FILL' 1" }}
              >
                water_drop
              </span>
              <h1
                className="font-black text-2xl font-headline"
                style={{ color: '#E5E2E3', letterSpacing: '-0.02em' }}
              >
                Testnet Faucet
              </h1>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                style={{ background: 'rgba(0,255,157,0.1)', color: '#00FF9D', fontFamily: 'Inter' }}
              >
                Arbitrum Sepolia
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#6B7A6E', fontFamily: 'Inter', maxWidth: 480 }}>
              Claim free mock tokens to test VerdexSwap. Each token has a 24-hour cooldown per wallet.
              You'll also need{' '}
              <a
                href="https://faucet.triangleplatform.com/arbitrum/sepolia"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-dotted hover:text-[#00FF9D] transition-colors"
                style={{ color: '#B9CBBC' }}
              >
                Arbitrum Sepolia ETH
              </a>{' '}
              for gas.
            </p>
          </div>

          {/* States */}
          {!isConnected && (
            <ConnectPrompt message="Connect your wallet to claim testnet tokens." />
          )}

          {isWrongNetwork && <WrongNetworkOverlay />}

          {/* Token grid */}
          {(isReady || !isConnected) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SYMBOLS.map(symbol => (
                <TokenCard key={symbol} symbol={symbol} disabled={!isReady} />
              ))}
            </div>
          )}

          {/* Info note */}
          {isReady && (
            <div
              className="mt-6 flex items-start gap-3 px-5 py-4 rounded-xl"
              style={{ background: '#18181A', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="material-symbols-outlined text-base flex-shrink-0 mt-0.5" style={{ color: '#6B7A6E' }}>
                info
              </span>
              <p className="text-xs leading-relaxed" style={{ color: '#6B7A6E', fontFamily: 'Inter' }}>
                These are mock ERC-20 tokens on Arbitrum Sepolia with no real-world value. The faucet calls{' '}
                <code
                  className="px-1 py-0.5 rounded text-xs"
                  style={{ background: '#0E0E0F', color: '#00FF9D' }}
                >
                  mint()
                </code>{' '}
                directly on each contract — no backend or custodian required.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FaucetPage;
