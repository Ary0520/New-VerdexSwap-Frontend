import { useState } from 'react';

const SwapWidget = () => {
  const [payAmount, setPayAmount] = useState('1.0');
  const exchangeRate = 2340.50;
  
  const receiveAmount = payAmount 
    ? (parseFloat(payAmount) * exchangeRate).toFixed(2) 
    : '';

  return (
    <div className="relative group">
      <div className="absolute -inset-20 bg-primary-container/10 blur-[120px] rounded-full"></div>
      
      {/* Interactive Swap Widget */}
      <div className="glass-panel p-6 rounded-2xl relative border-primary-container/20 max-w-[420px] mx-auto monolith-shadow">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline font-bold text-xl text-primary">Swap</h3>
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </div>
        
        <div className="space-y-1">
          {/* Pay Section */}
          <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/30 hover:border-primary-container/50 transition-colors">
            <div className="flex justify-between text-xs font-bold text-on-surface-variant mb-2">
              <span>You Pay</span>
              <span>Balance: 1.24 ETH</span>
            </div>
            <div className="flex items-center gap-3">
              <input 
                className="bg-transparent border-none p-0 text-3xl font-headline font-bold text-primary w-full focus:ring-0 placeholder:text-surface-variant" 
                id="pay-amount" 
                placeholder="0.0" 
                type="number" 
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
              />
              <button className="flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded-full border border-outline-variant/30 hover:bg-surface-variant transition-colors group">
                <div className="w-6 h-6 bg-[#627EEA] rounded-full flex items-center justify-center text-[10px] font-bold">Ξ</div>
                <span className="font-headline font-bold text-sm">ETH</span>
                <span className="material-symbols-outlined text-lg group-hover:text-primary">expand_more</span>
              </button>
            </div>
          </div>
          
          {/* Swap Icon */}
          <div className="relative h-2 z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-container-low border-4 border-surface p-2 rounded-xl text-primary-container cursor-pointer hover:scale-110 transition-transform">
              <span className="material-symbols-outlined block text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>swap_vert</span>
            </div>
          </div>
          
          {/* Receive Section */}
          <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/30 hover:border-primary-container/50 transition-colors">
            <div className="flex justify-between text-xs font-bold text-on-surface-variant mb-2">
              <span>You Receive (Estimated)</span>
              <span>Balance: 450 USDC</span>
            </div>
            <div className="flex items-center gap-3">
              <input 
                className="bg-transparent border-none p-0 text-3xl font-headline font-bold text-on-surface-variant w-full focus:ring-0" 
                id="receive-amount" 
                placeholder="0.0" 
                readOnly 
                type="number" 
                value={receiveAmount}
              />
              <button className="flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded-full border border-outline-variant/30 hover:bg-surface-variant transition-colors group">
                <div className="w-6 h-6 bg-[#2775CA] rounded-full flex items-center justify-center text-[10px] font-bold text-white">$</div>
                <span className="font-headline font-bold text-sm">USDC</span>
                <span className="material-symbols-outlined text-lg group-hover:text-primary">expand_more</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 px-1 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs text-on-surface-variant">
            <span>Price</span>
            <span className="font-bold text-on-surface">1 ETH = 2,340.50 USDC</span>
          </div>
          <div className="flex justify-between items-center text-xs text-on-surface-variant">
            <span>Slippage Tolerance</span>
            <span className="text-primary-container font-bold">0.5%</span>
          </div>
        </div>
        
        <button className="w-full mt-6 bg-primary-container text-on-primary-container py-4 font-headline font-black text-lg rounded-xl hover:shadow-[0_0_30px_rgba(0,255,157,0.4)] active:scale-[0.98] transition-all">
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default SwapWidget;
