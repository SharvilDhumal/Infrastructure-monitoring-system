import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Overview from './pages/Overview'
import InfrastructureMonitoring from './pages/InfrastructureMonitoring'

import IncidentsMaintenance from './pages/IncidentsMaintenance'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import UserIssues from './pages/UserIssues'
import LiveMonitoring from './pages/LiveMonitoring'
import PotholeDetection from '../pages/PotholeDetection'
import WaterLeakage from '../pages/WaterLeakage'
import Bridge from '../pages/Bridge'
import StreetlightDashboard from '../components/StreetlightDashboard'
import "leaflet/dist/leaflet.css";
import './App.css'
import './index.css'

import { Maximize2, Minimize2 } from 'lucide-react'

function AdminDashboard() {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`app ${isFullscreen ? 'is-fullscreen' : ''}`}>
      {!isFullscreen && <Navbar />}
      {!isFullscreen && <Sidebar />}

      <button
        className="fullscreen-toggle-btn"
        onClick={toggleFullscreen}
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
      </button>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/infrastructure" element={<InfrastructureMonitoring />} />

          <Route path="/incidents" element={<IncidentsMaintenance />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/user-issues" element={<UserIssues />} />
          <Route path="/live-monitoring" element={<LiveMonitoring />} />
          <Route path="/live-monitoring/pothole" element={<PotholeDetection hideLayout={isFullscreen} />} />
          <Route path="/live-monitoring/streetlight" element={<StreetlightDashboard hideLayout={isFullscreen} />} />
          <Route path="/live-monitoring/water-leakage" element={<WaterLeakage hideLayout={isFullscreen} />} />
          <Route path="/live-monitoring/bridge" element={<Bridge hideLayout={isFullscreen} />} />
        </Routes>
      </main>
    </div>
  )
}

export default AdminDashboard

