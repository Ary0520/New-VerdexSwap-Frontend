const NAV_LINKS = [
  { label: 'Home',         href: '#top'          },
  { label: 'How It Works', href: '#how-it-works'  },
  { label: 'IL Shield',    href: '#il-shield'     },
  { label: 'Pools',        href: '#pools'         },
  { label: 'Blog',         href: '#blog'          },
];

const TopNavBar = () => {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (href === '#blog') return; // placeholder — no section yet
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-container-low/60 backdrop-blur-xl border-b border-[#ffffff15] shadow-[0px_24px_48px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 text-2xl font-black tracking-tighter text-[#00FF9D] font-headline">
          <img src="/logo.jpg" alt="VerdexSwap" className="rounded-md" style={{ width: 32, height: 32, objectFit: 'cover' }} />
          VerdexSwap
        </button>
        <div className="hidden md:flex gap-8 items-center">
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={e => handleNav(e, link.href)}
              className="font-headline font-bold tracking-tight text-sm text-[#B9CBBC] hover:text-[#00FF9D] transition-colors"
              style={link.href === '#top' ? { color: '#00FF9D', borderBottom: '2px solid #00FF9D', paddingBottom: 4 } : undefined}>
              {link.label}
            </a>
          ))}
        </div>
        <a
          href="/swap"
          className="bg-primary-container text-on-primary-container px-6 py-2 font-headline font-bold text-sm rounded-md active:scale-95 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,157,0.4)]">
          Launch App
        </a>
      </div>
    </nav>
  );
};

export default TopNavBar;
