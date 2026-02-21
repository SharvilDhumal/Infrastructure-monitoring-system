import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Overview from './pages/Overview'
import InfrastructureMonitoring from './pages/InfrastructureMonitoring'

import IncidentsMaintenance from './pages/IncidentsMaintenance'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import UserIssues from './pages/UserIssues'
import PotholeDashboard from './pages/PotholeDashboard'
import './App.css'

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Router>
      <div className={`app ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Navbar />
        <Sidebar collapsed={isSidebarCollapsed} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/infrastructure" element={<InfrastructureMonitoring />} />

            <Route path="/incidents" element={<IncidentsMaintenance />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/user-issues" element={<UserIssues />} />
            <Route path="/pothole" element={<PotholeDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

