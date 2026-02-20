import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronDown, ChevronRight } from 'lucide-react'
import './Sidebar.css'

const Sidebar = () => {
  const [liveMenuOpen, setLiveMenuOpen] = useState(false);

  const toggleLiveMenu = (e) => {
    e.preventDefault();
    setLiveMenuOpen(!liveMenuOpen);
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">IMS Admin</h1>
        <p className="sidebar-tagline">Infrastructure Management</p>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/main-dashboard" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📊</span>
          <span>Dashboard Overview</span>
        </NavLink>
        <NavLink to="/main-dashboard/infrastructure" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🏗️</span>
          <span>Infrastructure Assets</span>
        </NavLink>

        <div className={`nav-group ${liveMenuOpen ? 'open' : ''}`}>
          <NavLink
            to="/main-dashboard/live-monitoring"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={(e) => {
              // Only toggle if clicking the main item, but NavLink behavior is still desired
              // Actually, user wants it to go to /live-monitoring which shows the cards
              // So we don't prevent default on the click, but we manage the toggle state
              setLiveMenuOpen(true);
            }}
          >
            <span className="nav-icon">👁️</span>
            <span>Live Monitoring</span>
            <span className="menu-arrow" onClick={toggleLiveMenu}>
              {liveMenuOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          </NavLink>

          {liveMenuOpen && (
            <div className="sub-menu">
              <NavLink to="/main-dashboard/live-monitoring/pothole" className={({ isActive }) => `sub-nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon-mini">🕳️</span>
                <span>Pothole</span>
              </NavLink>
              <NavLink to="/main-dashboard/live-monitoring/streetlight" className={({ isActive }) => `sub-nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon-mini">💡</span>
                <span>Streetlight</span>
              </NavLink>
              <NavLink to="/main-dashboard/live-monitoring/water-leakage" className={({ isActive }) => `sub-nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon-mini">💧</span>
                <span>Water Leakage</span>
              </NavLink>
              <NavLink to="/main-dashboard/live-monitoring/bridge" className={({ isActive }) => `sub-nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon-mini">🌉</span>
                <span>Bridge</span>
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/main-dashboard/incidents" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🔧</span>
          <span>Incidents & Maintenance</span>
        </NavLink>
        <NavLink to="/main-dashboard/user-issues" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📢</span>
          <span>Public Reports</span>
        </NavLink>
        <NavLink to="/main-dashboard/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📈</span>
          <span>Analytics & Reports</span>
        </NavLink>
        <NavLink to="/main-dashboard/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">⚙️</span>
          <span>System Settings</span>
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar

