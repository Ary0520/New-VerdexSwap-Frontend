import { NavLink } from 'react-router-dom';

type NavItem = {
  label: string;
  icon: string;
  to: string;
};

const navItems: NavItem[] = [
  { label: 'Swap', icon: 'swap_horiz', to: '/swap' },
  { label: 'Pools', icon: 'water', to: '/pools' },
  { label: 'Earn', icon: 'savings', to: '/earn' },
  { label: 'Portfolio', icon: 'account_balance_wallet', to: '/portfolio' },
  { label: 'Analytics', icon: 'bar_chart', to: '/analytics' },
];

const AppSidebar = () => {
  return (
    <aside
      className="fixed left-0 top-0 bottom-0 flex flex-col justify-between pt-24 pb-8"
      style={{
        width: 200,
        background: '#0E0E0F',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        zIndex: 40,
      }}
    >
      <nav className="flex flex-col gap-1 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === '/swap'}
            className={(_) =>
              `flex items-center gap-3 px-4 py-3 rounded w-full transition-colors`
            }
            style={({ isActive }) => ({
              background: isActive ? 'rgba(0,255,157,0.1)' : 'transparent',
              color: isActive ? '#00FF9D' : '#B9CBBC',
              fontFamily: 'Space Grotesk',
              fontWeight: 500,
              fontSize: 14,
              textDecoration: 'none',
            })}
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4">
        <div
          className="rounded-lg p-4 flex flex-col gap-2"
          style={{ background: '#1C1B1C', border: '1px solid rgba(59,74,63,0.2)' }}
        >
          <span className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}>
            Network
          </span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: '#56FFA8' }} />
            <span className="text-xs" style={{ color: '#E5E2E3', fontFamily: 'Inter' }}>
              Arbitrum Sepolia
            </span>
          </div>
          <span className="text-xs" style={{ color: '#3B4A3F', fontFamily: 'Inter', fontSize: 10 }}>
            Testnet · Chain 421614
          </span>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
