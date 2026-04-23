import { useActiveAccount } from 'thirdweb/react';
import SwapTopNav from '../components/Swap/SwapTopNav';
import AppSidebar from '../components/Swap/AppSidebar';
import SummaryCards from '../components/Portfolio/SummaryCards';
import LpPositionsTable from '../components/Portfolio/LpPositionsTable';
import StakingPositionsTable from '../components/Portfolio/StakingPositionsTable';
import TransactionHistory from '../components/Portfolio/TransactionHistory';
import ConnectPrompt from '../components/shared/ConnectPrompt';

const PortfolioPage = () => {
  const account = useActiveAccount();

  return (
    <div className="min-h-screen font-body" style={{ background: '#131314', color: '#E5E2E3' }}>
      <SwapTopNav />
      <AppSidebar />

      <main style={{ marginLeft: 200, paddingTop: 65, minHeight: '100vh' }}>
        <div className="pointer-events-none fixed"
          style={{ width: 600, height: 600, background: 'rgba(86,141,255,0.03)', filter: 'blur(120px)', borderRadius: '50%', top: '15%', right: '5%', zIndex: 0 }} />

        <div className="relative z-10 px-8 py-8">
          <div className="mb-8">
            <h1 className="font-black text-3xl font-headline" style={{ color: '#E5E2E3', letterSpacing: '-0.02em' }}>
              Portfolio
            </h1>
            <p className="text-sm mt-1" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
              Track your LP positions, staking rewards, and IL coverage in one place.
            </p>
          </div>

          {!account?.address ? (
            <ConnectPrompt
              title="Connect to view your portfolio"
              description="Connect your wallet to see your LP positions, staking rewards, IL coverage, and transaction history."
              icon="account_balance_wallet"
            />
          ) : (
            <>
              <SummaryCards />
              <LpPositionsTable />
              <StakingPositionsTable />
              <TransactionHistory />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PortfolioPage;
