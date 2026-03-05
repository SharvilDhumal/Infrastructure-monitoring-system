import React from 'react'
import './OperationsPanel.css'

const OperationsPanel = ({ stats }) => {
  const workflowSteps = [
    { id: 1, label: 'Detected', count: stats?.detected || 0, status: 'active' },
    { id: 2, label: 'Verified', count: stats?.verified || 0, status: 'active' },
    { id: 3, label: 'Assigned', count: stats?.assigned || 0, status: 'active' },
    { id: 4, label: 'Fixed', count: stats?.fixed || 0, status: 'completed' }
  ]

  return (
    <div className="operations-card">
      <div className="card-header">
        <h2 className="card-title">Operations & Task Control</h2>
      </div>

      <div className="operations-stats">
        <StatBox label="Assigned" value={stats?.assigned || 0} color="var(--accent-green)" />
        <StatBox label="Unassigned" value={stats?.unassigned || 0} color="var(--accent-amber)" />
        <StatBox label="Fixed" value={stats?.fixed || 0} color="var(--accent-cyan)" />
      </div>

    </div>
  )
}

const StatBox = ({ label, value, color }) => {
  return (
    <div className="stat-box">
      <div className="stat-value" style={{ color }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

const WorkflowStep = ({ step }) => {
  const isCompleted = step.status === 'completed'
  const isActive = step.status === 'active'

  return (
    <div className="workflow-step">
      <div
        className={`workflow-step-circle ${isCompleted ? 'completed' : isActive ? 'active' : ''}`}
      >
        {isCompleted ? '✓' : step.count}
      </div>
      <div className="workflow-step-label">{step.label}</div>
    </div>
  )
}

export default OperationsPanel

