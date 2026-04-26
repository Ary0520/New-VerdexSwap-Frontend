import { useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import SwapTopNav from '../components/Swap/SwapTopNav';
import AppSidebar from '../components/Swap/AppSidebar';
import ConnectPrompt from '../components/shared/ConnectPrompt';
import {
  useMintToken,
  useTokenBalance,
  getCooldownRemaining,
  formatCooldown,
  FAUCET_AMOUNTS,
  type FaucetStatus,
} from '../hooks/useFaucet';
import { TOKENS, type TokenSymbol } from '../lib/contracts';

const TOKEN_ICONS: Record<TokenSymbol, string> = {
  USDC: '💵',
  WETH: '⟠',
  WBTC: '₿',
  ARB:  '🔵',
  DAI:  '◈',
};

const TOKEN_COLORS: Record<TokenSymbol, string> = {
  USDC: '#2775CA',
  WETH: '#627EEA',
  WBTC: '#F7931A',
  ARB:  '#12AAFF',
  DAI:  '#F5AC37',
};

const SYMBOLS = Object.keys(TOKENS) as TokenSymbol[];

// ── Single token card ─────────────────────────────────────────────────────────
function TokenFaucetCard({ symbol }: { symbol: TokenSymbol }) {
  const account = useActiveAccount();
  const { mint, status, error, txHash, reset } = useMintToken(symbol);
  const { formatted: balance, refetch } = useTokenBalance(symbol);
  const [cooldownMs, setCooldownMs] = useState(0);

  // Tick cooldown every second
  useEffect(() => {
    if (!account?.address) return;
    const tick = () => setCooldownMs(getCooldownRemaining(account.address!, symbol));
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [account?.address, symbol, status]);

  // Refetch balance after success
  useEffect(() => {
    if (status === 'success') { refetch(); }
  }, [status, refetch]);

  const onCooldown = cooldownMs > 0;
  const isPending = status === 'pending';
  const color = TOKEN_COLORS[symbol];

  return (
    <div
      className="rounded-xl p-6 flex flex-col gap-4 transition-all duration-200"
      style={{ background: '#1C1B1C', border: `1px solid rgba(255,255,255,0.06)` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
            style={{ background: `${color}22`, border: `1px solid ${color}44` }}
          >
            {TOKEN_ICONS[symbol]}
          </div>
          <div>
            <div className="font-headline font-bold text-base" style={{ color: '#E5E2E3' }}>
              {TOKENS[symbol].name}
            </div>
            <div className="text-xs" style={{ color: '#B9CBBC' }}>{symbol}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs" style={{ color: '#B9CBBC' }}>Your balance</div>
          <div className="font-bold text-sm font-headline" style={{ color: '#E5E2E3' }}>
            {account ? balance : '—'}
          </div>
        </div>
      </div>

      {/* Claim amount */}
      <div
        className="rounded-lg px-4 py-3 flex items-center justify-between"
        style={{ background: '#131314' }}
      >
        <span className="text-xs" style={{ color: '#B9CBBC' }}>Claim amount</span>
        <span className="font-headline font-bold text-sm" style={{ color }}>
          {FAUCET_AMOUNTS[symbol]} {symbol}
        </span>
      </div>

      {/* Status feedback */}
      {status === 'success' && (
        <div className="rounded-lg px-4 py-2 flex items-center gap-2 text-xs" style={{ background: 'rgba(0,255,157,0.08)', color: '#00FF9D' }}>
          <span className="material-symbols-outlined text-base">check_circle</span>
          Minted! Check your wallet.
          {txHash && (
            <a
              href={`https://sepolia.arbiscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto underline opacity-70 hover:opacity-100"
            >
              Tx ↗
            </a>
          )}
        </div>
      )}
      {status === 'error' && error && (
        <div className="rounded-lg px-4 py-2 flex items-center gap-2 text-xs" style={{ background: 'rgba(255,80,80,0.08)', color: '#FF6B6B' }}>
          <span className="material-symbols-outlined text-base">error</span>
          {error}
        </div>
      )}

      {/* Claim button */}
      <button
        onClick={status === 'success' || status === 'error' ? reset : mint}
        disabled={isPending || onCooldown || !account}
        className="w-full py-3 rounded-lg font-headline font-bold text-sm transition-all duration-200 active:scale-95"
        style={{
          background: isPending || onCooldown
            ? 'rgba(255,255,255,0.05)'
            : `${color}22`,
          color: isPending || onCooldown ? '#B9CBBC' : color,
          border: `1px solid ${isPending || onCooldown ? 'rgba(255,255,255,0.08)' : `${color}44`}`,
          cursor: isPending || onCooldown || !account ? 'not-allowed' : 'pointer',
        }}
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
            Minting…
          </span>
        ) : onCooldown ? (
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base">schedule</span>
            {formatCooldown(cooldownMs)}
          </span>
        ) : status === 'success' ? (
          'Claim Again'
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base">water_drop</span>
            Claim {symbol}
          </span>
        )}
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
const FaucetPage = () => {
  const account = useActiveAccount();

  return (
    <div className="min-h-screen font-body" style={{ background: '#131314', color: '#E5E2E3' }}>
      <SwapTopNav />
      <AppSidebar />

      <main style={{ marginLeft: 200, paddingTop: 65, minHeight: '100vh' }}>
        {/* Ambient glow */}
        <div className="pointer-events-none fixed" style={{
          width: 600, height: 600,
          background: 'rgba(0,255,157,0.03)', filter: 'blur(120px)',
          borderRadius: '50%', top: '5%', right: '10%', zIndex: 0,
        }} />

        <div className="relative z-10 px-8 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-2xl" style={{ color: '#00FF9D' }}>water_drop</span>
              <h1 className="font-black text-3xl font-headline" style={{ color: '#E5E2E3', letterSpacing: '-0.02em' }}>
                Testnet Faucet
              </h1>
            </div>
            <p className="text-sm leading-relaxed max-w-lg" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
              Claim free testnet tokens to explore VerdexSwap. Each token has a 24-hour cooldown per wallet.
              You'll need ETH from the{' '}
              <a
                href="https://faucet.triangleplatform.com/arbitrum/sepolia"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#00FF9D] transition-colors"
              >
                Arbitrum Sepolia faucet
              </a>{' '}
              to pay gas.
            </p>
          </div>

          {/* Connect prompt */}
          {!account && (
            <div className="mb-8">
              <ConnectPrompt message="Connect your wallet to claim testnet tokens." />
            </div>
          )}

          {/* Token grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SYMBOLS.map(symbol => (
              <TokenFaucetCard key={symbol} symbol={symbol} />
            ))}
          </div>

          {/* Info footer */}
          <div
            className="mt-8 rounded-xl p-5 flex gap-4 items-start"
            style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="material-symbols-outlined text-xl flex-shrink-0 mt-0.5" style={{ color: '#B9CBBC' }}>info</span>
            <div className="text-xs leading-relaxed" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
              These are mock ERC-20 tokens deployed on Arbitrum Sepolia for testing purposes only. They have no real-world value.
              The faucet calls <code className="px-1 py-0.5 rounded text-xs" style={{ background: '#131314', color: '#00FF9D' }}>mint()</code> directly
              on each token contract — no backend required.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FaucetPage;
