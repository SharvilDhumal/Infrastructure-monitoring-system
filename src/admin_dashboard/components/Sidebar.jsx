import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronDown, ChevronRight } from 'lucide-react'
import './Sidebar.css'

const Sidebar = ({ collapsed }) => {
  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-logo">IMS Admin</h1>
        <p className="sidebar-tagline">Infrastructure Management</p>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/main-dashboard" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span>Dashboard Overview</span>
        </NavLink>
        <NavLink to="/main-dashboard/infrastructure" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span>Infrastructure Assets</span>
        </NavLink>

        <NavLink to="/main-dashboard/live-monitoring" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span>Live Monitoring</span>
        </NavLink>

        <NavLink to="/main-dashboard/incidents" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span>Incidents & Maintenance</span>
        </NavLink>
        <NavLink to="/main-dashboard/user-issues" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span>Public Reports</span>
        </NavLink>
        <NavLink to="/main-dashboard/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span>Analytics & Reports</span>
        </NavLink>
        <NavLink to="/main-dashboard/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span>System Settings</span>
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar

