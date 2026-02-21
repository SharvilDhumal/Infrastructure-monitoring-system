import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, User, LogOut } from 'lucide-react'
import './Navbar.css'

const Navbar = () => {
  const navigate = useNavigate()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false)
  const [unreadNotifications] = useState(3) // Mock unread count
  const dropdownRef = useRef(null)
  const notificationRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationDrawerOpen(false)
      }
    }

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileDropdown])

  const handleLogout = () => {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <h2 className="navbar-title">Infrastructure Manager <span style={{ fontWeight: 400, color: '#64748b' }}>| Admin Ops</span></h2>
        </div>
        <div className="navbar-right">
          <div className="navbar-notification" ref={notificationRef}>
            <button
              className="notification-btn"
              onClick={() => setIsNotificationDrawerOpen(!isNotificationDrawerOpen)}
              aria-label="Notifications"
            >
              <Bell size={18} className="notification-icon" />
              {unreadNotifications > 0 && (
                <span className="notification-badge">{unreadNotifications}</span>
              )}
            </button>
            {/* Notification Drawer */}
            <div className={`notification-drawer ${isNotificationDrawerOpen ? 'open' : ''}`}>
              <div className="drawer-header">
                <h3>Notifications</h3>
                <button
                  className="close-drawer-btn"
                  onClick={() => setIsNotificationDrawerOpen(false)}
                >
                  ✕
                </button>
              </div>
              <div className="drawer-content">
                <div className="notification-item unread">
                  <div className="notification-dot"></div>
                  <div className="notification-text">
                    <p className="notification-title">Critical Issue Detected</p>
                    <p className="notification-time">2 mins ago</p>
                  </div>
                </div>
                <div className="notification-item unread">
                  <div className="notification-dot"></div>
                  <div className="notification-text">
                    <p className="notification-title">Bridge Sensor Calibration</p>
                    <p className="notification-time">1 hour ago</p>
                  </div>
                </div>
                <div className="notification-item unread">
                  <div className="notification-dot"></div>
                  <div className="notification-text">
                    <p className="notification-title">Scheduled Maintenance</p>
                    <p className="notification-time">3 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="drawer-footer">
                <button className="mark-all-read-btn">Mark all as read</button>
              </div>
            </div>
          </div>
          <div className="navbar-profile" ref={dropdownRef}>
            <button
              className="profile-btn"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              aria-label="Profile"
            >
              <div className="profile-info">
                <span className="profile-name">Admin Officer</span>
                <div className="profile-avatar">AD</div>
              </div>
            </button>
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <button className="dropdown-item">
                  <User size={16} className="dropdown-icon" />
                  Profile Account
                </button>
                <button className="dropdown-item" onClick={handleLogout}>
                  <LogOut size={16} className="dropdown-icon text-red-500" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

