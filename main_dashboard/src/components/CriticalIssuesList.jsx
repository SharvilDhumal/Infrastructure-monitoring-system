import React from 'react'
import './CriticalIssuesList.css'

const CriticalIssuesList = ({ issues = [], onViewDetails, onAssign }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'var(--accent-red)'
      case 'warning':
        return 'var(--accent-amber)'
      default:
        return 'var(--text-secondary)'
    }
  }

  if (issues.length === 0) {
    return (
      <div className="critical-issues-card">
        <div className="card-header">
          <h2 className="card-title">Critical Issues – Action Required</h2>
          <span className="card-badge">0 Active</span>
        </div>
        <div className="issues-list-empty">
          <p>No critical issues at this time.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="critical-issues-card">
      <div className="card-header">
        <h2 className="card-title">Critical Issues – Action Required</h2>
        <span className="card-badge">{issues.length} Active</span>
      </div>
      <div className="issues-list">
        {issues.map((issue) => (
          <IssueCard 
            key={issue.id} 
            issue={issue} 
            getSeverityColor={getSeverityColor}
            onViewDetails={onViewDetails}
            onAssign={onAssign}
          />
        ))}
      </div>
    </div>
  )
}

const IssueCard = ({ issue, getSeverityColor, onViewDetails, onAssign }) => {
  const severityColor = getSeverityColor(issue.severity)
  
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return '🔴'
      case 'warning':
        return '🟡'
      default:
        return '⚪'
    }
  }

  return (
    <div className="issue-card">
      <div className="issue-image" style={{ backgroundColor: `${severityColor}15` }}>
        <span className="issue-icon">{issue.image}</span>
      </div>
      <div className="issue-content">
        <div className="issue-header">
          <div className="issue-title-wrapper">
            <h3 className="issue-title">{issue.title}</h3>
          </div>
          <span 
            className="issue-severity" 
            style={{ 
              backgroundColor: `${severityColor}20`,
              color: severityColor,
              borderColor: severityColor
            }}
          >
            {issue.severity}
          </span>
        </div>
        <div className="issue-meta-compact">
          <div className="issue-meta-item-compact">
            <span className="meta-icon">📍</span>
            <span className="meta-value">{issue.exactLocation}</span>
          </div>
          <div className="issue-meta-item-compact">
            <span className="meta-icon">🤖</span>
            <span className="meta-value">{issue.aiConfidence}%</span>
          </div>
          <div className="issue-meta-item-compact">
            <span className="meta-icon">⏰</span>
            <span className="meta-value">{issue.timestamp}</span>
          </div>
        </div>
        <div className="issue-actions">
          <button 
            className="action-btn primary"
            onClick={() => onAssign && onAssign(issue)}
          >
            Assign
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => onViewDetails && onViewDetails(issue)}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default CriticalIssuesList

