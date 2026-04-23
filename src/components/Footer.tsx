const Footer = () => (
  <footer className="bg-[#0E0E0F] w-full pt-20 pb-10 px-8 border-t border-[#ffffff10]">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1">
        <div className="text-xl font-bold text-[#00FF9D] mb-4 font-headline">VerdexSwap</div>
        <p className="text-sm text-[#B9CBBC] mb-2">The first AMM with a self-sustaining Impermanent Loss Shield.</p>
        <p className="text-xs text-[#B9CBBC] opacity-50 mb-6">Currently on Arbitrum Sepolia testnet.</p>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-[#B9CBBC] hover:text-[#00FF9D] cursor-pointer">public</span>
          <span className="material-symbols-outlined text-[#B9CBBC] hover:text-[#00FF9D] cursor-pointer">forum</span>
          <span className="material-symbols-outlined text-[#B9CBBC] hover:text-[#00FF9D] cursor-pointer">mail</span>
        </div>
      </div>
      <div>
        <h5 className="text-white font-headline font-bold mb-6">Protocol</h5>
        <ul className="space-y-4 text-sm text-[#B9CBBC]">
          <li><a className="hover:text-[#568DFF] transition-colors" href="/swap">Launch App</a></li>
          <li><a className="hover:text-[#568DFF] transition-colors" href="#">Documentation</a></li>
          <li><a className="hover:text-[#568DFF] transition-colors" href="#">GitHub</a></li>
          <li><a className="hover:text-[#568DFF] transition-colors" href="#">Whitepaper</a></li>
        </ul>
      </div>
      <div>
        <h5 className="text-white font-headline font-bold mb-6">Resources</h5>
        <ul className="space-y-4 text-sm text-[#B9CBBC]">
          <li><a className="hover:text-[#568DFF] transition-colors" href="https://bridge.arbitrum.io" target="_blank" rel="noopener noreferrer">Arbitrum Bridge</a></li>
          <li><a className="hover:text-[#568DFF] transition-colors" href="https://sepolia.arbiscan.io" target="_blank" rel="noopener noreferrer">Arbiscan Explorer</a></li>
          <li><a className="hover:text-[#568DFF] transition-colors" href="#">Brand Assets</a></li>
        </ul>
      </div>
      <div>
        <h5 className="text-white font-headline font-bold mb-6">Legal</h5>
        <ul className="space-y-4 text-sm text-[#B9CBBC]">
          <li><a className="hover:text-[#568DFF] transition-colors" href="#">Terms of Service</a></li>
          <li><a className="hover:text-[#568DFF] transition-colors" href="#">Privacy Policy</a></li>
          <li><a className="hover:text-[#568DFF] transition-colors" href="#">Risk Disclaimer</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-[#ffffff10] flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-xs text-[#B9CBBC]">© {new Date().getFullYear()} VerdexSwap. All rights reserved.</p>
      <div className="flex gap-6">
        <span className="text-xs text-[#B9CBBC]/60">Arbitrum Sepolia Testnet</span>
        <span className="text-xs text-[#B9CBBC]/60">Pre-audit · Use at your own risk</span>
      </div>
    </div>
  </footer>
);

export default Footer;
