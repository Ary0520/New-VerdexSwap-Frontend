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
import { VAULTS } from '../components/Earn/earnData';

const EarnPage = () => {
  const [selectedVault, setSelectedVault] = useState(VAULTS[0]);

  return (
    <div className="min-h-screen font-body" style={{ background: '#131314', color: '#E5E2E3' }}>
      <SwapTopNav />
      <AppSidebar />

      <main style={{ marginLeft: 200, paddingTop: 65, minHeight: '100vh' }}>
        {/* Ambient glow */}
        <div
          className="pointer-events-none fixed"
          style={{
            width: 700,
            height: 700,
            background: 'rgba(0,255,157,0.03)',
            filter: 'blur(130px)',
            borderRadius: '50%',
            top: '10%',
            right: '5%',
            zIndex: 0,
          }}
        />

        <div className="relative z-10 px-8 py-8">

          {/* Page header row */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1
                className="font-black text-3xl font-headline"
                style={{ color: '#E5E2E3', letterSpacing: '-0.02em' }}
              >
                IL Vault Staking
              </h1>
              <p className="text-sm mt-1 max-w-sm leading-relaxed" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
                Earn yield by providing USDC liquidity to the Impermanent Loss Insurance vault. High utilization rewards with institutional-grade risk management.
              </p>
            </div>

            {/* Vault selector */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span
                className="text-xs uppercase tracking-widest"
                style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.1em' }}
              >
                Select Vault
              </span>
              <VaultSelector
                vaults={VAULTS}
                selected={selectedVault}
                onChange={setSelectedVault}
              />
            </div>
          </div>

          {/* Stats strip */}
          <VaultStatsStrip vault={selectedVault} />

          {/* Main two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

            {/* LEFT: Manage Position + Fee Converter */}
            <div className="flex flex-col">
              <ManagePosition vault={selectedVault} />
              <VaultFeeConverter vault={selectedVault} />
            </div>

            {/* RIGHT: stacked cards */}
            <div className="flex flex-col gap-4">
              <VaultHealth vault={selectedVault} />
              <CoverageScalingChart />
              <YourPosition vault={selectedVault} />
            </div>
          </div>

          {/* Protocol stats bar */}
          <ProtocolStatsBar />
        </div>
      </main>
    </div>
  );
};

export default EarnPage;
