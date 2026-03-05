import React from 'react'
import './AssignedIssuesList.css'

const AssignedIssuesList = ({ assignedIssues }) => {
  if (!assignedIssues || assignedIssues.length === 0) {
    return null
  }

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

  return (
    <div className="assigned-issues-card">
      <div className="card-header">
        <h2 className="card-title">Assigned Issues</h2>
        <span className="card-badge">{assignedIssues.length}</span>
      </div>
      <div className="issues-list">
        {assignedIssues.map((assigned) => {
          const severityColor = getSeverityColor(assigned.issue.severity)
          return (
            <div key={assigned.issue.id} className="assigned-issue-card">
              <div className="assigned-issue-image" style={{ backgroundColor: `${severityColor}15` }}>
                <span className="assigned-issue-icon">{assigned.issue.image}</span>
              </div>
              <div className="assigned-issue-content">
                <div className="assigned-issue-header">
                  <h3 className="assigned-issue-title">{assigned.issue.title}</h3>
                  <span 
                    className="assigned-issue-severity" 
                    style={{ 
                      backgroundColor: `${severityColor}20`,
                      color: severityColor,
                      borderColor: severityColor
                    }}
                  >
                    {assigned.issue.severity}
                  </span>
                </div>
                <div className="assigned-issue-meta">
                  <div className="assigned-meta-item">
                    <span className="assigned-meta-icon">📍</span>
                    <span className="assigned-meta-value">{assigned.issue.exactLocation}</span>
                  </div>
                  <div className="assigned-meta-item">
                    <span className="assigned-meta-icon">👥</span>
                    <span className="assigned-meta-value">{assigned.team}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AssignedIssuesList

























