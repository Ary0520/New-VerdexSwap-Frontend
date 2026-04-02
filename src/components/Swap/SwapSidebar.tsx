type NavItem = {
  label: string;
  icon: string;
  active?: boolean;
};

const navItems: NavItem[] = [
  { label: 'Swap', icon: 'swap_horiz', active: true },
  { label: 'Pools', icon: 'water' },
  { label: 'Earn', icon: 'savings' },
  { label: 'Portfolio', icon: 'account_balance_wallet' },
  { label: 'Analytics', icon: 'bar_chart' },
];

const SwapSidebar = () => {
  return (
    <aside
      className="fixed left-0 top-0 bottom-0 flex flex-col justify-between pt-24 pb-8"
      style={{
        width: 200,
        background: '#0E0E0F',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Nav links */}
      <nav className="flex flex-col gap-2 px-4">
        {navItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 px-4 py-3 rounded text-left w-full transition-colors"
            style={{
              background: item.active ? 'rgba(0,255,157,0.1)' : 'transparent',
              color: item.active ? '#00FF9D' : '#B9CBBC',
              fontFamily: 'Space Grotesk',
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Status badge */}
      <div className="px-4">
        <div
          className="rounded-lg p-4 flex flex-col gap-2"
          style={{
            background: '#1C1B1C',
            border: '1px solid rgba(59,74,63,0.2)',
          }}
        >
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}
          >
            Status
          </span>
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: '#56FFA8' }}
            />
            <span className="text-xs" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>
              Mainnet Syncing
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SwapSidebar;
