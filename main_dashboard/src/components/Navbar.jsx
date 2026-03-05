import React, { useState, useEffect, useRef, useCallback } from 'react'
import './Navbar.css'

const API_BASE = 'http://localhost:5001'
const SEEN_KEY = 'navbar_seen_issue_ids'
const POLL_INTERVAL = 30_000 // 30 seconds

// Fault type labels for display
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

// Format relative time
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

const Navbar = () => {
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

      // Sort newest first
      const sorted = [...data.issues].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )

      setNotifications(sorted)

      // Calculate unread = issues not in seenIds
      const unread = sorted.filter(issue => !seenIdsRef.current.has(issue._id))
      setUnreadCount(unread.length)
    } catch (err) {
      console.error('[Navbar] Failed to fetch issues:', err)
    }
  }, [])

  // Initial fetch + polling
  useEffect(() => {
    fetchIssues()
    const timer = setInterval(fetchIssues, POLL_INTERVAL)
    return () => clearInterval(timer)
  }, [fetchIssues])

  // When drawer opens, mark all currently visible as seen
  useEffect(() => {
    if (isNotificationDrawerOpen && notifications.length > 0) {
      // Don't auto-mark as read when opening — user clicks "Mark all as read"
    }
  }, [isNotificationDrawerOpen, notifications])

  // Re-fetch when tab becomes visible (handles case where user submitted on another tab)
  useEffect(() => {
    const handleVisible = () => {
      if (document.visibilityState === 'visible') fetchIssues()
    }
    document.addEventListener('visibilitychange', handleVisible)
    return () => document.removeEventListener('visibilitychange', handleVisible)
  }, [fetchIssues])

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
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

  const handleBellClick = () => {
    setIsNotificationDrawerOpen(prev => !prev)
  }

  const statusColor = (status) => {
    switch (status) {
      case 'Pending': return '#f59e0b'
      case 'Approved': return '#3b82f6'
      case 'Resolved': return '#10b981'
      case 'Rejected': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <h2 className="navbar-title">Infravision.AI Dashboard</h2>
        </div>
        <div className="navbar-right">
          <div className="navbar-notification" ref={notificationRef}>
            <button
              className="notification-btn"
              onClick={handleBellClick}
              aria-label="Notifications"
            >
              <span className="notification-icon">🔔</span>
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
                  Notifications
                  {unreadCount > 0 && (
                    <span style={{
                      marginLeft: '8px',
                      fontSize: '12px',
                      background: '#ef4444',
                      color: '#fff',
                      borderRadius: '999px',
                      padding: '1px 7px',
                      fontWeight: 700
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
                  <div style={{ padding: '32px 16px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔔</div>
                    <p>No issues reported yet</p>
                  </div>
                ) : (
                  notifications.map((issue) => {
                    const isUnread = !seenIdsRef.current.has(issue._id)
                    const label = FAULT_LABELS[issue.faultType] || issue.faultType || 'Issue'
                    return (
                      <div
                        key={issue._id}
                        className={`notification-item ${isUnread ? 'unread' : ''}`}
                      >
                        {isUnread && <div className="notification-dot" />}
                        <div className="notification-text" style={{ flex: 1 }}>
                          <p className="notification-title" style={{ marginBottom: '2px' }}>
                            🚨 New Report: <strong>{label}</strong>
                          </p>
                          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>
                            📍 {issue.location}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                            <span style={{
                              fontSize: '11px',
                              padding: '1px 7px',
                              borderRadius: '999px',
                              background: statusColor(issue.status) + '22',
                              color: statusColor(issue.status),
                              fontWeight: 600,
                              border: `1px solid ${statusColor(issue.status)}44`
                            }}>
                              {issue.status}
                            </span>
                            <p className="notification-time">{timeAgo(issue.createdAt)}</p>
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
                  style={{ opacity: unreadCount === 0 ? 0.5 : 1 }}
                >
                  Mark all as read
                </button>
              </div>
            </div>
          </div>

          <div className="navbar-profile" ref={dropdownRef}>
            <button
              className="profile-btn"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              aria-label="Profile"
            >
              <div className="profile-avatar">AD</div>
            </button>
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <button className="dropdown-item">
                  <span className="dropdown-icon">👤</span>
                  Profile
                </button>
                <button className="dropdown-item">
                  <span className="dropdown-icon">🚪</span>
                  Logout
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
