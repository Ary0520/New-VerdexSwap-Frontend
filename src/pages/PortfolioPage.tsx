import SwapTopNav from '../components/Swap/SwapTopNav';
import AppSidebar from '../components/Swap/AppSidebar';
import SummaryCards from '../components/Portfolio/SummaryCards';
import LpPositionsTable from '../components/Portfolio/LpPositionsTable';
import StakingPositionsTable from '../components/Portfolio/StakingPositionsTable';
import TransactionHistory from '../components/Portfolio/TransactionHistory';

const PortfolioPage = () => {
  return (
    <div className="min-h-screen font-body" style={{ background: '#131314', color: '#E5E2E3' }}>
      <SwapTopNav />
      <AppSidebar />

      <main style={{ marginLeft: 200, paddingTop: 65, minHeight: '100vh' }}>
        {/* Ambient glow */}
        <div
          className="pointer-events-none fixed"
          style={{
            width: 600,
            height: 600,
            background: 'rgba(86,141,255,0.03)',
            filter: 'blur(120px)',
            borderRadius: '50%',
            top: '15%',
            right: '5%',
            zIndex: 0,
          }}
        />

        <div className="relative z-10 px-8 py-8">
          {/* Page header */}
          <div className="mb-8">
            <h1
              className="font-black text-3xl font-headline"
              style={{ color: '#E5E2E3', letterSpacing: '-0.02em' }}
            >
              Portfolio
            </h1>
            <p className="text-sm mt-1" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
              Track your LP positions, staking rewards, and IL coverage in one place.
            </p>
          </div>

          {/* Summary cards */}
          <SummaryCards />

          {/* LP Positions */}
          <LpPositionsTable />

          {/* Staking Positions */}
          <StakingPositionsTable />

          {/* Transaction History */}
          <TransactionHistory />
        </div>
      </main>
    </div>
  );
};

export default PortfolioPage;
