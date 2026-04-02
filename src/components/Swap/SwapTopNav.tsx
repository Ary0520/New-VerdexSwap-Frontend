const SwapTopNav = () => {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5"
      style={{ background: '#131314', backdropFilter: 'blur(24px)' }}
    >
      {/* Logo */}
      <div className="text-2xl font-black tracking-tighter font-headline" style={{ color: '#00FF9D', letterSpacing: '-0.05em' }}>
        VerdexSwap
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Network pill */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded"
          style={{ background: '#353436' }}
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: '#568DFF' }}
          />
          <span className="text-sm font-normal" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>
            Arbitrum
          </span>
        </div>

        {/* Connect Wallet */}
        <button
          className="px-6 py-2 rounded font-bold text-base transition-all hover:shadow-[0_0_20px_rgba(0,255,157,0.3)]"
          style={{
            background: '#00FF9D',
            color: '#007143',
            fontFamily: 'Space Grotesk',
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          Connect Wallet
        </button>
      </div>
    </header>
  );
};

export default SwapTopNav;
