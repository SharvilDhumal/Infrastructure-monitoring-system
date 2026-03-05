import React from 'react'
import { issuesData } from '../data/issuesData'
import './SeverityLadder.css'

const SeverityLadder = () => {
  const severityCounts = {
    critical: issuesData.filter(issue => issue.severity === 'critical').length,
    warning: issuesData.filter(issue => issue.severity === 'warning').length,
    normal: 0 // Assuming normal issues are resolved or not shown
  }

  const total = severityCounts.critical + severityCounts.warning + severityCounts.normal

  const severityData = [
    {
      level: 'Critical',
      count: severityCounts.critical,
      color: 'var(--accent-red)',
      icon: '🔴'
    },
    {
      level: 'Warning',
      count: severityCounts.warning,
      color: 'var(--accent-amber)',
      icon: '🟡'
    },
    {
      level: 'Normal',
      count: severityCounts.normal,
      color: 'var(--accent-green)',
      icon: '🟢'
    }
  ]

  return (
    <div className="severity-ladder-card">
      <div className="card-header">
        <h2 className="card-title">Severity Ladder</h2>
      </div>
      <div className="severity-ladder">
        {severityData.map((severity, index) => (
          <div key={index} className="severity-rung">
            <div className="severity-indicator" style={{ '--severity-color': severity.color }}>
              <span className="severity-icon">{severity.icon}</span>
              <div className="severity-bar" style={{ backgroundColor: severity.color }} />
            </div>
            <div className="severity-info">
              <div className="severity-level">{severity.level}</div>
              <div className="severity-count">{severity.count}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SeverityLadder





























