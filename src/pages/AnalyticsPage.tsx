import SwapTopNav from '../components/Swap/SwapTopNav';
import AppSidebar from '../components/Swap/AppSidebar';
import ProtocolKPIs from '../components/Analytics/ProtocolKPIs';
import ProtocolCharts from '../components/Analytics/ProtocolCharts';
import PoolAnalyticsSection from '../components/Analytics/PoolAnalyticsSection';
import FeeConverterCard from '../components/Analytics/FeeConverterCard';

const AnalyticsPage = () => (
  <div className="min-h-screen font-body" style={{ background: '#131314', color: '#E5E2E3' }}>
    <SwapTopNav />
    <AppSidebar />

    <main style={{ marginLeft: 200, paddingTop: 65, minHeight: '100vh' }}>
      {/* Ambient glows */}
      <div className="pointer-events-none fixed" style={{
        width: 600, height: 600,
        background: 'rgba(0,255,157,0.025)', filter: 'blur(130px)',
        borderRadius: '50%', top: '5%', right: '10%', zIndex: 0,
      }} />
      <div className="pointer-events-none fixed" style={{
        width: 400, height: 400,
        background: 'rgba(86,141,255,0.025)', filter: 'blur(100px)',
        borderRadius: '50%', bottom: '10%', left: '20%', zIndex: 0,
      }} />

      <div className="relative z-10 px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-black text-3xl font-headline" style={{ color: '#E5E2E3', letterSpacing: '-0.02em' }}>
            Analytics
          </h1>
          <p className="text-sm mt-1" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
            Protocol-wide metrics, per-pool performance, and FeeConverter activity.
          </p>
        </div>

        {/* KPI strip */}
        <ProtocolKPIs />

        {/* Protocol charts */}
        <ProtocolCharts />

        {/* Per-pool drilldown */}
        <PoolAnalyticsSection />

        {/* FeeConverter */}
        <FeeConverterCard />
      </div>
    </main>
  </div>
);

export default AnalyticsPage;
