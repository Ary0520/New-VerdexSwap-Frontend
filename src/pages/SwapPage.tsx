import SwapTopNav from '../components/Swap/SwapTopNav';
import AppSidebar from '../components/Swap/AppSidebar';
import SwapCard from '../components/Swap/SwapCard';

const SwapPage = () => {
  return (
    <div
      className="min-h-screen font-body"
      style={{ background: '#131314', color: '#E5E2E3' }}
    >
      <SwapTopNav />
      <AppSidebar />

      {/* Main content area — offset for sidebar (200px) and top nav (~65px) */}
      <main
        className="flex items-center justify-center"
        style={{
          marginLeft: 200,
          paddingTop: 65,
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        {/* Ambient background glow effects matching Figma */}
        <div
          className="pointer-events-none absolute"
          style={{
            width: 800,
            height: 800,
            background: 'rgba(0,255,157,0.05)',
            filter: 'blur(120px)',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-30%, -50%)',
          }}
        />
        <div
          className="pointer-events-none absolute"
          style={{
            width: 400,
            height: 400,
            background: 'rgba(86,141,255,0.05)',
            filter: 'blur(100px)',
            borderRadius: '50%',
            top: '40%',
            right: '10%',
          }}
        />

        <SwapCard />
      </main>
    </div>
  );
};

export default SwapPage;
