import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, User, LogOut } from 'lucide-react'
import './Navbar.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001'
const SEEN_KEY = 'admin_navbar_seen_issue_ids'
const POLL_INTERVAL = 20_000 // 20 seconds

const FAULT_LABELS = {
  'road-damage': 'Road Damage',
  'bridge-issue': 'Bridge Issue',
  'traffic-light': 'Traffic Light Malfunction',
  'street-light': 'Street Light Outage',
  'drainage': 'Drainage Problem',
  'sidewalk': 'Sidewalk Damage',
  'signage': 'Signage Issue',
  'other': 'Other',
}

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

const getSeenIds = () => {
  try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]')) }
  catch { return new Set() }
}

const saveSeenIds = (ids) => {
  localStorage.setItem(SEEN_KEY, JSON.stringify([...ids]))
}

const statusColor = (status) => {
  switch (status) {
    case 'Pending': return { bg: '#fef3c7', text: '#d97706', border: '#fde68a' }
    case 'Approved': return { bg: '#dbeafe', text: '#2563eb', border: '#bfdbfe' }
    case 'Resolved': return { bg: '#d1fae5', text: '#059669', border: '#a7f3d0' }
    case 'Rejected': return { bg: '#fee2e2', text: '#dc2626', border: '#fecaca' }
    default: return { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' }
  }
}

const Navbar = () => {
  const navigate = useNavigate()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef(null)
  const notificationRef = useRef(null)
  const seenIdsRef = useRef(getSeenIds())

  const fetchIssues = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/issues`)
      if (!res.ok) return
      const data = await res.json()
      if (!data.success || !Array.isArray(data.issues)) return

      // Newest first
      const sorted = [...data.issues].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )

      setNotifications(sorted)

      // Unread = any issue _id not in seenIds
      const unread = sorted.filter(issue => !seenIdsRef.current.has(issue._id))
      setUnreadCount(unread.length)
    } catch (err) {
      // Silently ignore — backend may not be running yet
    }
  }, [])

  // Initial fetch + polling every 20s
  useEffect(() => {
    fetchIssues()
    const timer = setInterval(fetchIssues, POLL_INTERVAL)
    return () => clearInterval(timer)
  }, [fetchIssues])

  // Re-fetch when user switches back to this tab
  useEffect(() => {
    const handleVisible = () => {
      if (document.visibilityState === 'visible') fetchIssues()
    }
    document.addEventListener('visibilitychange', handleVisible)
    return () => document.removeEventListener('visibilitychange', handleVisible)
  }, [fetchIssues])

  // Click-outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationDrawerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAllRead = () => {
    const allIds = new Set(notifications.map(n => n._id))
    seenIdsRef.current = allIds
    saveSeenIds(allIds)
    setUnreadCount(0)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <h2 className="navbar-title">
            Infrastructure Manager{' '}
            <span style={{ fontWeight: 400, color: '#64748b' }}>| Admin Ops</span>
          </h2>
        </div>
        <div className="navbar-right">

          {/* 🔔 Notification Bell */}
          <div className="navbar-notification" ref={notificationRef}>
            <button
              className="notification-btn"
              onClick={() => setIsNotificationDrawerOpen(prev => !prev)}
              aria-label="Notifications"
            >
              <Bell size={18} className="notification-icon" />
              {unreadCount > 0 && (
                <span className="notification-badge">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            <div className={`notification-drawer ${isNotificationDrawerOpen ? 'open' : ''}`}>
              <div className="drawer-header">
                <h3>
                  Citizen Reports
                  {unreadCount > 0 && (
                    <span style={{
                      marginLeft: '8px',
                      fontSize: '11px',
                      background: '#ef4444',
                      color: '#fff',
                      borderRadius: '999px',
                      padding: '2px 8px',
                      fontWeight: 700,
                      verticalAlign: 'middle'
                    }}>
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                <button
                  className="close-drawer-btn"
                  onClick={() => setIsNotificationDrawerOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="drawer-content">
                {notifications.length === 0 ? (
                  <div style={{
                    padding: '40px 16px',
                    textAlign: 'center',
                    color: '#9ca3af',
                    fontSize: '14px'
                  }}>
                    <div style={{ fontSize: '36px', marginBottom: '10px' }}>📭</div>
                    <p style={{ fontWeight: 600, marginBottom: '4px' }}>No reports yet</p>
                    <p style={{ fontSize: '12px' }}>New citizen issue reports will appear here</p>
                  </div>
                ) : (
                  notifications.map((issue) => {
                    const isUnread = !seenIdsRef.current.has(issue._id)
                    const label = FAULT_LABELS[issue.faultType] || issue.faultType || 'Unknown Issue'
                    const sc = statusColor(issue.status)
                    return (
                      <div
                        key={issue._id}
                        className={`notification-item ${isUnread ? 'unread' : ''}`}
                        style={{ alignItems: 'flex-start', gap: '10px' }}
                      >
                        {/* Unread dot */}
                        <div style={{ paddingTop: '6px', flexShrink: 0 }}>
                          {isUnread
                            ? <div className="notification-dot" />
                            : <div style={{ width: '8px', height: '8px' }} />
                          }
                        </div>

                        <div className="notification-text" style={{ flex: 1, minWidth: 0 }}>
                          {/* Title row */}
                          <p className="notification-title" style={{ marginBottom: '3px' }}>
                            🚨 {label}
                          </p>

                          {/* Location */}
                          <p style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            marginBottom: '5px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            📍 {issue.location}
                          </p>

                          {/* Description snippet */}
                          {issue.description && (
                            <p style={{
                              fontSize: '11px',
                              color: '#9ca3af',
                              marginBottom: '5px',
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}>
                              {issue.description}
                            </p>
                          )}

                          {/* Status + time row */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: '11px',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              background: sc.bg,
                              color: sc.text,
                              border: `1px solid ${sc.border}`,
                              fontWeight: 600
                            }}>
                              {issue.status}
                            </span>
                            <span className="notification-time">
                              {timeAgo(issue.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              <div className="drawer-footer">
                <button
                  className="mark-all-read-btn"
                  onClick={handleMarkAllRead}
                  disabled={unreadCount === 0}
                  style={{ opacity: unreadCount === 0 ? 0.5 : 1, cursor: unreadCount === 0 ? 'default' : 'pointer' }}
                >
                  ✓ Mark all as read
                </button>
              </div>
            </div>
          </div>

          {/* Profile */}
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
