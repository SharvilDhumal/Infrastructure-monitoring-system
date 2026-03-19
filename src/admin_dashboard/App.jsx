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
import StreetlightDashboard from '../modules/streetlight/StreetlightDashboard'
import "leaflet/dist/leaflet.css";
import './App.css'
import './index.css'

import { Maximize2, Minimize2 } from 'lucide-react'

function AdminDashboard() {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`flex min-h-screen bg-slate-50 transition-colors duration-700 font-sans ${isFullscreen ? 'fixed inset-0 z-[100] bg-slate-50/95 backdrop-blur-3xl' : ''}`}>
      {!isFullscreen && <Sidebar collapsed={isSidebarCollapsed} />}
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {!isFullscreen && <Navbar />}

        <button
          className={`absolute z-50 p-3 bg-white/90 backdrop-blur border border-slate-200 text-slate-600 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group ${isFullscreen ? 'top-8 right-8' : 'bottom-6 right-6 lg:bottom-10 lg:right-10'}`}
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={22} className="group-hover:text-blue-600 transition-colors" /> : <Maximize2 size={22} className="group-hover:text-blue-600 transition-colors" />}
        </button>

        <main className={`flex-1 overflow-y-auto hide-scrollbar w-full max-w-[1600px] mx-auto transition-all duration-500 ${isFullscreen ? 'mt-20 w-full max-w-none' : isSidebarCollapsed ? 'pt-24 pb-12 px-8' : 'pt-24 pb-12 px-8 md:pl-[19rem]'}`}>
          <div className={`${isFullscreen ? 'h-full w-full' : 'animate-in fade-in slide-in-from-bottom-4 duration-500'}`}>
            <Routes>
              <Route path="/" element={<Overview hideLayout={isFullscreen} />} />
              <Route path="/infrastructure" element={<InfrastructureMonitoring hideLayout={isFullscreen} />} />

              <Route path="/incidents" element={<IncidentsMaintenance hideLayout={isFullscreen} />} />
              <Route path="/analytics" element={<Analytics hideLayout={isFullscreen} />} />
              <Route path="/settings" element={<Settings hideLayout={isFullscreen} />} />
              <Route path="/user-issues" element={<UserIssues hideLayout={isFullscreen} />} />
              <Route path="/live-monitoring" element={<LiveMonitoring />} />
              <Route path="/live-monitoring/pothole" element={<PotholeDetection hideLayout={isFullscreen} />} />
              <Route path="/live-monitoring/streetlight" element={<StreetlightDashboard hideLayout={isFullscreen} />} />
              <Route path="/live-monitoring/water-leakage" element={<WaterLeakage hideLayout={isFullscreen} />} />
              <Route path="/live-monitoring/bridge" element={<Bridge hideLayout={isFullscreen} />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
