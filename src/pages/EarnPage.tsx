import { useState } from 'react';
import SwapTopNav from '../components/Swap/SwapTopNav';
import AppSidebar from '../components/Swap/AppSidebar';
import VaultSelector from '../components/Earn/VaultSelector';
import VaultStatsStrip from '../components/Earn/VaultStatsStrip';
import ManagePosition from '../components/Earn/ManagePosition';
import VaultFeeConverter from '../components/Earn/VaultFeeConverter';
import VaultHealth from '../components/Earn/VaultHealth';
import CoverageScalingChart from '../components/Earn/CoverageScalingChart';
import YourPosition from '../components/Earn/YourPosition';
import ProtocolStatsBar from '../components/Earn/ProtocolStatsBar';
import { PAIRS, type PairKey } from '../lib/contracts';

const VAULT_PAIR_KEYS = Object.keys(PAIRS) as PairKey[];

const EarnPage = () => {
  const [selectedPair, setSelectedPair] = useState<PairKey>(VAULT_PAIR_KEYS[0]);

  return (
    <div className="min-h-screen font-body" style={{ background: '#131314', color: '#E5E2E3' }}>
      <SwapTopNav />
      <AppSidebar />

      <main style={{ marginLeft: 200, paddingTop: 65, minHeight: '100vh' }}>
        <div className="pointer-events-none fixed" style={{
          width: 700, height: 700,
          background: 'rgba(0,255,157,0.03)', filter: 'blur(130px)',
          borderRadius: '50%', top: '10%', right: '5%', zIndex: 0,
        }} />

        <div className="relative z-10 px-8 py-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-black text-3xl font-headline" style={{ color: '#E5E2E3', letterSpacing: '-0.02em' }}>
                IL Vault Staking
              </h1>
              <p className="text-sm mt-1 max-w-sm leading-relaxed" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
                Earn yield by providing USDC liquidity to the Impermanent Loss Insurance vault.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span className="text-xs uppercase tracking-widest" style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}>
                Select Vault
              </span>
              <VaultSelector
                pairKeys={VAULT_PAIR_KEYS}
                selected={selectedPair}
                onChange={setSelectedPair}
              />
            </div>
          </div>

          <VaultStatsStrip pairKey={selectedPair} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
            <div className="flex flex-col">
              <ManagePosition pairKey={selectedPair} />
              <VaultFeeConverter pairKey={selectedPair} />
            </div>
            <div className="flex flex-col gap-4">
              <VaultHealth pairKey={selectedPair} />
              <CoverageScalingChart pairKey={selectedPair} />
              <YourPosition pairKey={selectedPair} />
            </div>
          </div>

          <ProtocolStatsBar />
        </div>
      </main>
    </div>
  );
};

export default EarnPage;
