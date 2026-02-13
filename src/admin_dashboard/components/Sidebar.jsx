import React from 'react'
import { NavLink } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">Infravision.AI</h1>
        <p className="sidebar-tagline">Infrastructure Monitoring</p>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/main-dashboard" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📊</span>
          <span>Overview</span>
        </NavLink>
        <NavLink to="/main-dashboard/infrastructure" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🏗️</span>
          <span>Infrastructure</span>
        </NavLink>

        <NavLink to="/main-dashboard/incidents" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🔧</span>
          <span>Incidents & Maintenance</span>
        </NavLink>
        <NavLink to="/main-dashboard/user-issues" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📢</span>
          <span>User Issues</span>
        </NavLink>
        <NavLink to="/main-dashboard/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📈</span>
          <span>Analytics</span>
        </NavLink>
        <NavLink to="/main-dashboard/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">⚙️</span>
          <span>Settings</span>
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar

