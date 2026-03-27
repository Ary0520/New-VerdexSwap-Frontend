
import TopNavBar from './components/TopNavBar';
import Hero from './components/Hero';
import LiveStatsBar from './components/LiveStatsBar';
import ProblemSection from './components/ProblemSection';
import ILShieldSpotlight from './components/ILShieldSpotlight';
import ThreeTierPoolSystem from './components/ThreeTierPoolSystem';
import HowItWorks from './components/HowItWorks';
import TwapOracleSecurity from './components/TwapOracleSecurity';
import FeeConverterFlywheel from './components/FeeConverterFlywheel';
import IlVaultStaking from './components/IlVaultStaking';
import ProtocolFeeTransparency from './components/ProtocolFeeTransparency';
import CompetitorComparisonTable from './components/CompetitorComparisonTable';
import SocialProofTrust from './components/SocialProofTrust';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E5E2E3] font-body selection:bg-primary-container selection:text-on-primary-container">
      <TopNavBar />
      <main>
        <Hero />
        <LiveStatsBar />
        <ProblemSection />
        <ILShieldSpotlight />
        <ThreeTierPoolSystem />
        <HowItWorks />
        <TwapOracleSecurity />
        <FeeConverterFlywheel />
        <IlVaultStaking />
        <ProtocolFeeTransparency />
        <CompetitorComparisonTable />
        <SocialProofTrust />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

export default App;
