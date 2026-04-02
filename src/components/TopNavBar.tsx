

const TopNavBar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-container-low/60 backdrop-blur-xl border-b border-[#ffffff15] shadow-[0px_24px_48px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter text-[#00FF9D] font-headline">VerdexSwap</div>
        <div className="hidden md:flex gap-8 items-center">
          <a className="font-headline font-bold tracking-tight text-sm text-[#00FF9D] border-b-2 border-[#00FF9D] pb-1" href="#">Home<br /></a>
          <a className="font-headline font-bold tracking-tight text-sm text-[#B9CBBC] hover:text-[#00FF9D] transition-colors" href="#">How It Works</a>
          <a className="font-headline font-bold tracking-tight text-sm text-[#B9CBBC] hover:text-[#00FF9D] transition-colors" href="#">IL Shield</a>
          <a className="font-headline font-bold tracking-tight text-sm text-[#B9CBBC] hover:text-[#00FF9D] transition-colors" href="#">Pools</a>
          <a className="font-headline font-bold tracking-tight text-sm text-[#B9CBBC] hover:text-[#00FF9D] transition-colors" href="#">Blog</a>
        </div>
        <a
          href="/swap"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary-container text-on-primary-container px-6 py-2 font-headline font-bold text-sm rounded-md active:scale-95 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,157,0.4)]"
        >
          Launch App
        </a>
      </div>
    </nav>
  );
};

export default TopNavBar;
