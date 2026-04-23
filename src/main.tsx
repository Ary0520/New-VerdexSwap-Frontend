import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThirdwebProvider } from 'thirdweb/react'
import './index.css'
import App from './App.tsx'
import SwapPage from './pages/SwapPage.tsx'
import PoolsPage from './pages/PoolsPage.tsx'
import EarnPage from './pages/EarnPage.tsx'
import PortfolioPage from './pages/PortfolioPage.tsx'
import AnalyticsPage from './pages/AnalyticsPage.tsx'
import WrongNetworkBanner from './components/shared/WrongNetworkBanner.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThirdwebProvider>
      <BrowserRouter>
        <WrongNetworkBanner />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/swap" element={<SwapPage />} />
          <Route path="/pools" element={<PoolsPage />} />
          <Route path="/earn" element={<EarnPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </BrowserRouter>
    </ThirdwebProvider>
  </StrictMode>,
)
