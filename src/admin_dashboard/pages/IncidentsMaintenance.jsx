import React, { useState } from 'react'
import './IncidentsMaintenance.css'

const IncidentsMaintenance = () => {
  const [selectedFilter, setSelectedFilter] = useState('all')

  const incidents = [
    {
      id: 1,
      title: 'Pothole Detected - Main Street',
      type: 'road',
      severity: 'critical',
      status: 'assigned',
      assignedTo: 'Team Alpha',
      location: 'Main St & 5th Ave',
      detected: '2024-01-15 10:30',
      priority: 'high',
      description: 'Large pothole detected in northbound lane. Requires immediate attention.',
      aiConfidence: 94,
      estimatedResolution: '2 hours'
    },
    {
      id: 2,
      title: 'Street Light Malfunction',
      type: 'lighting',
      severity: 'warning',
      status: 'in-progress',
      assignedTo: 'Team Beta',
      location: 'Park Boulevard',
      detected: '2024-01-15 09:15',
      priority: 'medium',
      description: 'Street light #1247 not responding to remote commands.',
      aiConfidence: 87,
      estimatedResolution: '1 hour'
    },
    {
      id: 3,
      title: 'Water Leak Detected',
      type: 'water',
      severity: 'critical',
      status: 'detected',
      assignedTo: null,
      location: 'River Road',
      detected: '2024-01-15 08:45',
      priority: 'critical',
      description: 'Potential water main leak identified by AI analysis.',
      aiConfidence: 91,
      estimatedResolution: '4 hours'
    },
    {
      id: 4,
      title: 'Bridge Structural Anomaly',
      type: 'bridge',
      severity: 'critical',
      status: 'verified',
      assignedTo: null,
      location: 'Highway Bridge #3',
      detected: '2024-01-15 07:20',
      priority: 'critical',
      description: 'AI detected unusual stress patterns requiring structural assessment.',
      aiConfidence: 89,
      estimatedResolution: '8 hours'
    },
    {
      id: 5,
      title: 'Routine Maintenance - Street Cleaning',
      type: 'maintenance',
      severity: 'normal',
      status: 'scheduled',
      assignedTo: 'Team Gamma',
      location: 'Downtown District',
      detected: '2024-01-14 16:00',
      priority: 'low',
      description: 'Scheduled street cleaning maintenance.',
      aiConfidence: null,
      estimatedResolution: '3 hours'
    },
    {
      id: 6,
      title: 'Traffic Sign Replacement',
      type: 'road',
      severity: 'warning',
      status: 'completed',
      assignedTo: 'Team Alpha',
      location: 'Highway 101',
      detected: '2024-01-14 14:30',
      priority: 'medium',
      description: 'Traffic sign replacement completed successfully.',
      aiConfidence: null,
      estimatedResolution: 'Completed'
    }
  ]

  const filteredIncidents = selectedFilter === 'all' 
    ? incidents 
    : incidents.filter(incident => incident.status === selectedFilter)

  const statusCounts = {
    all: incidents.length,
    detected: incidents.filter(i => i.status === 'detected').length,
    verified: incidents.filter(i => i.status === 'verified').length,
    assigned: incidents.filter(i => i.status === 'assigned').length,
    'in-progress': incidents.filter(i => i.status === 'in-progress').length,
    completed: incidents.filter(i => i.status === 'completed').length,
    scheduled: incidents.filter(i => i.status === 'scheduled').length
  }

  return (
    <div className="incidents-maintenance">
      <div className="page-header">
        <h1 className="page-title">Incidents & Maintenance</h1>
        <p className="page-subtitle">Track and manage infrastructure incidents and maintenance tasks</p>
      </div>

      <div className="status-filters">
        {Object.keys(statusCounts).map((status) => (
          <button
            key={status}
            className={`status-filter ${selectedFilter === status ? 'active' : ''}`}
            onClick={() => setSelectedFilter(status)}
          >
            <span className="filter-label">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
            <span className="filter-count">{statusCounts[status]}</span>
          </button>
        ))}
      </div>

      <div className="incidents-list">
        {filteredIncidents.map((incident) => (
          <IncidentCard key={incident.id} incident={incident} />
        ))}
      </div>
    </div>
  )
}

const IncidentCard = ({ incident }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'var(--accent-red)'
      case 'warning':
        return 'var(--accent-amber)'
      case 'normal':
        return 'var(--accent-green)'
      default:
        return 'var(--text-secondary)'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'detected':
        return 'var(--accent-red)'
      case 'verified':
        return 'var(--accent-amber)'
      case 'assigned':
        return 'var(--accent-green)'
      case 'in-progress':
        return 'var(--accent-green)'
      case 'completed':
        return 'var(--accent-green)'
      case 'scheduled':
        return 'var(--text-secondary)'
      default:
        return 'var(--text-secondary)'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'road':
        return '🛣️'
      case 'lighting':
        return '💡'
      case 'water':
        return '💧'
      case 'bridge':
        return '🌉'
      case 'maintenance':
        return '🔧'
      default:
        return '📋'
    }
  }

  return (
    <div className="incident-card">
      <div className="incident-header">
        <div className="incident-title-section">
          <span className="incident-type-icon">{getTypeIcon(incident.type)}</span>
          <div>
            <h3 className="incident-title">{incident.title}</h3>
            <div className="incident-meta">
              <span className="incident-location">📍 {incident.location}</span>
              <span className="incident-time">🕐 {new Date(incident.detected).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="incident-badges">
          <span 
            className="severity-badge"
            style={{ 
              backgroundColor: `${getSeverityColor(incident.severity)}20`,
              color: getSeverityColor(incident.severity)
            }}
          >
            {incident.severity}
          </span>
          <span 
            className="status-badge"
            style={{ 
              backgroundColor: `${getStatusColor(incident.status)}20`,
              color: getStatusColor(incident.status)
            }}
          >
            {incident.status}
          </span>
        </div>
      </div>

      <p className="incident-description">{incident.description}</p>

      <div className="incident-details">
        <div className="detail-item">
          <span className="detail-label">Priority:</span>
          <span className="detail-value">{incident.priority}</span>
        </div>
        {incident.assignedTo && (
          <div className="detail-item">
            <span className="detail-label">Assigned To:</span>
            <span className="detail-value">{incident.assignedTo}</span>
          </div>
        )}
        {incident.aiConfidence && (
          <div className="detail-item">
            <span className="detail-label">AI Confidence:</span>
            <span className="detail-value">{incident.aiConfidence}%</span>
          </div>
        )}
        <div className="detail-item">
          <span className="detail-label">Est. Resolution:</span>
          <span className="detail-value">{incident.estimatedResolution}</span>
        </div>
      </div>

      <div className="incident-actions">
        {incident.status === 'detected' && (
          <>
            <button className="action-btn primary">Verify</button>
            <button className="action-btn secondary">Assign</button>
          </>
        )}
        {incident.status === 'verified' && (
          <>
            <button className="action-btn primary">Assign Team</button>
            <button className="action-btn secondary">View Details</button>
          </>
        )}
        {incident.status === 'assigned' && (
          <>
            <button className="action-btn primary">Start Work</button>
            <button className="action-btn secondary">Update</button>
          </>
        )}
        {incident.status === 'in-progress' && (
          <>
            <button className="action-btn primary">Complete</button>
            <button className="action-btn secondary">Update Progress</button>
          </>
        )}
        {incident.status === 'scheduled' && (
          <>
            <button className="action-btn primary">Start</button>
            <button className="action-btn secondary">Reschedule</button>
          </>
        )}
        {incident.status === 'completed' && (
          <>
            <button className="action-btn secondary">View Report</button>
            <button className="action-btn secondary">Archive</button>
          </>
        )}
        <button className="action-btn secondary">View Full Details</button>
      </div>
    </div>
  )
}

export default IncidentsMaintenance































