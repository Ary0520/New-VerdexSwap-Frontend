import { ConnectButton } from 'thirdweb/react';
import { createWallet } from 'thirdweb/wallets';
import { client, arbitrumSepolia } from '../../lib/thirdweb';

const wallets = [
  createWallet('io.metamask'),
];

const SwapTopNav = () => {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 border-b border-white/5"
      style={{ background: '#131314', backdropFilter: 'blur(24px)' }}
    >
      {/* Logo */}
      <div
        className="text-2xl font-black tracking-tighter font-headline"
        style={{ color: '#00FF9D', letterSpacing: '-0.05em' }}
      >
        VerdexSwap
      </div>

      {/* Connect Wallet — MetaMask only, themed to match VerdexSwap */}
      <ConnectButton
        client={client}
        wallets={wallets}
        chain={arbitrumSepolia}
        connectButton={{
          label: 'Connect Wallet',
          style: {
            background: '#00FF9D',
            color: '#007143',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 14,
            borderRadius: 6,
            padding: '8px 20px',
            border: 'none',
            cursor: 'pointer',
          },
        }}
        detailsButton={{
          style: {
            background: '#1C1B1C',
            color: '#E5E2E3',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 600,
            fontSize: 13,
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.08)',
          },
        }}
        theme="dark"
      />
    </header>
  );
};

export default SwapTopNav;
