import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, User, LogOut, Settings, Globe, Shield, X, CheckCheck, MapPin, Clock, AlertTriangle, CheckCircle2, XCircle, Loader2, Trash2, Check, ChevronRight, InboxIcon } from 'lucide-react'
import './Navbar.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001'
const SEEN_KEY = 'admin_navbar_seen_issue_ids'

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

const FAULT_ICONS = {
  'road-damage': '🛣️',
  'bridge-issue': '🌉',
  'traffic-light': '🚦',
  'street-light': '💡',
  'drainage': '🌊',
  'sidewalk': '🚶',
  'signage': '🪧',
  'other': '⚠️',
}

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

const isRecent = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  return diff < 24 * 60 * 60 * 1000 // within 24 hours
}

const getSeenIds = () => {
  try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]')) }
  catch { return new Set() }
}

const saveSeenIds = (ids) => {
  localStorage.setItem(SEEN_KEY, JSON.stringify([...ids]))
}

const STATUS_CONFIG = {
  'Pending':  { bg: 'rgba(245,158,11,0.1)', text: '#d97706', border: 'rgba(245,158,11,0.2)', icon: Loader2, label: 'Pending' },
  'Approved': { bg: 'rgba(37,99,235,0.08)', text: '#2563eb', border: 'rgba(37,99,235,0.15)', icon: CheckCircle2, label: 'Approved' },
  'Resolved': { bg: 'rgba(16,185,129,0.08)', text: '#059669', border: 'rgba(16,185,129,0.15)', icon: CheckCheck, label: 'Resolved' },
  'Rejected': { bg: 'rgba(239,68,68,0.08)', text: '#dc2626', border: 'rgba(239,68,68,0.15)', icon: XCircle, label: 'Rejected' },
}

const PRIORITY_CONFIG = {
  'road-damage': 'critical',
  'bridge-issue': 'critical',
  'traffic-light': 'high',
  'drainage': 'high',
  'street-light': 'medium',
  'sidewalk': 'medium',
  'signage': 'low',
  'other': 'low',
}

const Navbar = () => {
  const navigate = useNavigate()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [dismissedIds, setDismissedIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('dismissed_notif_ids') || '[]')) }
    catch { return new Set() }
  })
  const [unreadCount, setUnreadCount] = useState(0)
  const [activeFilter, setActiveFilter] = useState('all')
  const dropdownRef = useRef(null)
  const notificationRef = useRef(null)
  const seenIdsRef = useRef(getSeenIds())

  const isFetchingRef = useRef(false)
  const fetchIssues = useCallback(async () => {
    if (isFetchingRef.current) return
    isFetchingRef.current = true
    try {
      const res = await fetch(`${API_BASE}/api/issues`)
      if (!res.ok) return
      const data = await res.json()
      if (!data.success || !Array.isArray(data.issues)) return
      const sorted = [...data.issues].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      setNotifications(sorted)
      const unread = sorted.filter(issue => !seenIdsRef.current.has(issue._id) && !dismissedIds.has(issue._id))
      setUnreadCount(unread.length)
    } catch (err) { } finally {
      isFetchingRef.current = false
    }
  }, [dismissedIds])

  useEffect(() => {
    fetchIssues()
    const timer = setInterval(fetchIssues, 60_000)
    return () => clearInterval(timer)
  }, [fetchIssues])

  useEffect(() => {
    const handleVisible = () => {
      if (document.visibilityState === 'visible') fetchIssues()
    }
    document.addEventListener('visibilitychange', handleVisible)
    return () => document.removeEventListener('visibilitychange', handleVisible)
  }, [fetchIssues])

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

  const handleMarkOneRead = (id, e) => {
    e.stopPropagation()
    seenIdsRef.current.add(id)
    saveSeenIds(seenIdsRef.current)
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleDismiss = (id, e) => {
    e.stopPropagation()
    const newDismissed = new Set(dismissedIds)
    newDismissed.add(id)
    setDismissedIds(newDismissed)
    localStorage.setItem('dismissed_notif_ids', JSON.stringify([...newDismissed]))
    setUnreadCount(prev => {
      const wasUnread = !seenIdsRef.current.has(id)
      return wasUnread ? Math.max(0, prev - 1) : prev
    })
  }

  const handleClearAll = () => {
    const allIds = new Set(notifications.map(n => n._id))
    setDismissedIds(allIds)
    localStorage.setItem('dismissed_notif_ids', JSON.stringify([...allIds]))
    setUnreadCount(0)
  }

  const handleLogout = () => {
    sessionStorage.clear()
    localStorage.clear()
    navigate('/login')
  }

  // Filter + dismiss
  const visibleNotifications = notifications.filter(n => !dismissedIds.has(n._id))
  const filtered = activeFilter === 'all'
    ? visibleNotifications
    : activeFilter === 'unread'
      ? visibleNotifications.filter(n => !seenIdsRef.current.has(n._id))
      : visibleNotifications.filter(n => n.status === activeFilter)

  const recentItems = filtered.filter(n => isRecent(n.createdAt))
  const olderItems = filtered.filter(n => !isRecent(n.createdAt))

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <div className="navbar-logo-container">
            <div className="navbar-logo-icon">
              <Shield size={22} strokeWidth={2.5} />
            </div>
            <h2 className="navbar-title">
              Infra<span className="text-blue-600">Vision</span>
              <div className="navbar-badge">Admin Pro</div>
            </h2>
          </div>
        </div>

        <div className="navbar-right">
          <div className="navbar-status-indicator hidden lg:flex">
            <div className="status-dot-pulse" />
            <span className="status-text">Network Live</span>
          </div>

          {/* 🔔 Notification Bell */}
          <div className="navbar-notification" ref={notificationRef}>
            <button
              className={`notification-btn ${isNotificationDrawerOpen ? 'active' : ''}`}
              onClick={() => setIsNotificationDrawerOpen(prev => !prev)}
              aria-label="Notifications"
            >
              <Bell size={20} className="notification-icon" />
              {unreadCount > 0 && (
                <span className="notification-badge-new">{unreadCount > 99 ? '99+' : unreadCount}</span>
              )}
            </button>

            {/* ===== Redesigned Notification Drawer ===== */}
            <div className={`notification-drawer ${isNotificationDrawerOpen ? 'open' : ''}`}>
              {/* Header */}
              <div className="nd-header">
                <div>
                  <h3 className="nd-title">Citizen Reports</h3>
                  <p className="nd-subtitle">
                    {visibleNotifications.length} total · {unreadCount} unread
                  </p>
                </div>
                <div className="nd-header-actions">
                  {unreadCount > 0 && (
                    <button className="nd-action-btn" onClick={handleMarkAllRead} title="Mark all read">
                      <CheckCheck size={15} />
                    </button>
                  )}
                  {visibleNotifications.length > 0 && (
                    <button className="nd-action-btn danger" onClick={handleClearAll} title="Clear all">
                      <Trash2 size={15} />
                    </button>
                  )}
                  <button className="nd-action-btn" onClick={() => setIsNotificationDrawerOpen(false)}>
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="nd-filters">
                {['all', 'unread', 'Pending', 'Resolved'].map(f => (
                  <button
                    key={f}
                    className={`nd-filter-tab ${activeFilter === f ? 'active' : ''}`}
                    onClick={() => setActiveFilter(f)}
                  >
                    {f === 'all' ? 'All' : f === 'unread' ? `Unread (${unreadCount})` : f}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="nd-content">
                {filtered.length === 0 ? (
                  <div className="nd-empty">
                    <div className="nd-empty-icon">
                      <InboxIcon size={36} strokeWidth={1.2} />
                    </div>
                    <p className="nd-empty-title">All clear!</p>
                    <p className="nd-empty-sub">No matching reports found.</p>
                  </div>
                ) : (
                  <>
                    {recentItems.length > 0 && (
                      <div className="nd-section">
                        <div className="nd-section-label">Recent · Last 24h</div>
                        {recentItems.map(issue => (
                          <NotificationCard
                            key={issue._id}
                            issue={issue}
                            isUnread={!seenIdsRef.current.has(issue._id)}
                            onMarkRead={handleMarkOneRead}
                            onDismiss={handleDismiss}
                          />
                        ))}
                      </div>
                    )}
                    {olderItems.length > 0 && (
                      <div className="nd-section">
                        <div className="nd-section-label">Older</div>
                        {olderItems.map(issue => (
                          <NotificationCard
                            key={issue._id}
                            issue={issue}
                            isUnread={!seenIdsRef.current.has(issue._id)}
                            onMarkRead={handleMarkOneRead}
                            onDismiss={handleDismiss}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              {filtered.length > 0 && (
                <div className="nd-footer">
                  <span className="nd-footer-count">{filtered.length} report{filtered.length !== 1 ? 's' : ''}</span>
                  <button className="nd-view-all" onClick={() => { navigate('/main-dashboard/user-issues'); setIsNotificationDrawerOpen(false) }}>
                    View All Reports <ChevronRight size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile */}
          <div className="navbar-profile" ref={dropdownRef}>
            <button
              className={`profile-btn ${showProfileDropdown ? 'active' : ''}`}
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <div className="profile-info">
                <span className="profile-name hidden sm:block">Admin Officer</span>
                <div className="profile-avatar-container">
                  <div className="profile-avatar">AD</div>
                  <div className="profile-status-dot" />
                </div>
              </div>
            </button>
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <p className="dropdown-user-name">Admin Officer</p>
                  <p className="dropdown-user-role italic">High Authority</p>
                </div>
                <div className="dropdown-divider" />
                <button className="dropdown-item">
                  <User size={16} className="dropdown-icon" />
                  Account Profile
                </button>
                <button className="dropdown-item">
                  <Globe size={16} className="dropdown-icon" />
                  Region Settings
                </button>
                <button className="dropdown-item">
                  <Settings size={16} className="dropdown-icon" />
                  Global Config
                </button>
                <div className="dropdown-divider" />
                <button className="dropdown-item text-rose-500 font-bold" onClick={handleLogout}>
                  <LogOut size={16} className="dropdown-icon" />
                  Sign Out Protocol
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

/* ===== Individual Notification Card ===== */
const NotificationCard = ({ issue, isUnread, onMarkRead, onDismiss }) => {
  const label = FAULT_LABELS[issue.faultType] || issue.faultType || 'Unknown Issue'
  const icon = FAULT_ICONS[issue.faultType] || '⚠️'
  const priority = PRIORITY_CONFIG[issue.faultType] || 'low'
  const sc = STATUS_CONFIG[issue.status] || STATUS_CONFIG['Pending']
  const StatusIcon = sc.icon

  return (
    <div className={`nd-card ${isUnread ? 'unread' : ''} priority-${priority}`}>
      {isUnread && <div className="nd-unread-bar" />}

      <div className="nd-card-icon">{icon}</div>

      <div className="nd-card-body">
        <div className="nd-card-top">
          <div className="nd-card-title">{label}</div>
          <div className="nd-card-time"><Clock size={10} /> {timeAgo(issue.createdAt)}</div>
        </div>

        {issue.location && (
          <div className="nd-card-location"><MapPin size={10} /> {issue.location}</div>
        )}

        {issue.description && (
          <p className="nd-card-desc">{issue.description}</p>
        )}

        <div className="nd-card-footer">
          <span className="nd-status-pill" style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
            <StatusIcon size={10} />
            {sc.label}
          </span>
          <div className="nd-card-actions">
            {isUnread && (
              <button className="nd-card-action-btn read-btn" onClick={(e) => onMarkRead(issue._id, e)} title="Mark as read">
                <Check size={12} />
              </button>
            )}
            <button className="nd-card-action-btn dismiss-btn" onClick={(e) => onDismiss(issue._id, e)} title="Dismiss">
              <X size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
