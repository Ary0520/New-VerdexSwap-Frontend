import { useActiveAccount, useActiveWalletChain, useSwitchActiveWalletChain } from 'thirdweb/react';
import { CHAIN_ID } from '../../lib/contracts';
import { arbitrumSepolia } from '../../lib/thirdweb';

const CHAIN_NAMES: Record<number, string> = {
  1:     'Ethereum Mainnet',
  8453:  'Base',
  137:   'Polygon',
  42161: 'Arbitrum One',
  10:    'Optimism',
  56:    'BNB Chain',
  43114: 'Avalanche',
};

const WrongNetworkBanner = () => {
  const account     = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();

  // Only show when wallet connected AND on wrong chain
  if (!account?.address || !activeChain || activeChain.id === CHAIN_ID) return null;

  const chainName = CHAIN_NAMES[activeChain.id] ?? `Chain ${activeChain.id}`;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-3"
      style={{
        background: 'rgba(255,100,100,0.12)',
        borderBottom: '1px solid rgba(255,100,100,0.3)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="material-symbols-outlined"
          style={{ color: '#FF6464', fontSize: 20, fontVariationSettings: "'FILL' 1" }}
        >
          warning
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold" style={{ color: '#FF6464', fontFamily: 'Inter' }}>
            Wrong Network
          </span>
          <span className="text-xs" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
            You're on {chainName}. VerdexSwap requires Arbitrum Sepolia (testnet).
          </span>
        </div>
      </div>
      <button
        onClick={() => switchChain(arbitrumSepolia)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:brightness-110 active:scale-[0.98] flex-shrink-0"
        style={{ background: '#FF6464', color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700 }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>swap_horiz</span>
        Switch to Arbitrum Sepolia
      </button>
    </div>
  );
};

export default WrongNetworkBanner;
