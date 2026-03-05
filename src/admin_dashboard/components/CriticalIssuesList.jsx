import React from 'react'
import './CriticalIssuesList.css'

const CriticalIssuesList = ({ issues = [], onViewDetails, onAssign }) => {
  const getSeverityStyle = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return { color: '#ffffff', bg: '#dc3545', label: 'Critical' };
      case 'high':
      case 'warning':
        return { color: '#ffffff', bg: '#fd7e14', label: 'High' };
      case 'medium':
        return { color: '#000000', bg: '#ffc107', label: 'Medium' };
      case 'low':
        return { color: '#ffffff', bg: '#28a745', label: 'Low' };
      default:
        return { color: '#ffffff', bg: '#6c757d', label: severity };
    }
  }

  if (issues.length === 0) {
    return (
      <div className="critical-issues-section">
        <div className="section-header">
          <h2 className="section-title">Critical Issues – Action Required</h2>
        </div>
        <div className="issues-empty">
          <p>No active issues reported at this time.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="critical-issues-section">
      <div className="section-header">
        <h2 className="section-title">Critical Issues – Action Required</h2>
        <span className="section-count">{issues.length} Issues Pending</span>
      </div>
      <div className="table-container">
        <table className="issues-table">
          <thead>
            <tr>
              <th>Issue Type</th>
              <th>Location</th>
              <th>Severity</th>
              <th>Reported Time</th>
              <th>Confidence</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => {
              const style = getSeverityStyle(issue.severity);
              return (
                <tr key={issue.id}>
                  <td>
                    <div className="issue-type-cell">
                      <span className="type-icon">{issue.image}</span>
                      <span className="type-text">{issue.title}</span>
                    </div>
                  </td>
                  <td>{issue.exactLocation}</td>
                  <td>
                    <span
                      className="severity-badge"
                      style={{ backgroundColor: style.bg, color: style.color }}
                    >
                      {style.label}
                    </span>
                  </td>
                  <td>{issue.timestamp}</td>
                  <td>
                    <div className="confidence-cell">
                      <div className="confidence-track">
                        <div
                          className="confidence-fill"
                          style={{ width: `${issue.aiConfidence}%` }}
                        />
                      </div>
                      <span className="confidence-text">{issue.aiConfidence}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn-table primary"
                        onClick={() => onAssign && onAssign(issue)}
                      >
                        Assign
                      </button>
                      <button
                        className="btn-table secondary"
                        onClick={() => onViewDetails && onViewDetails(issue)}
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CriticalIssuesList

