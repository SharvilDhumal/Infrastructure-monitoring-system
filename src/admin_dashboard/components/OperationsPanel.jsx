import React from 'react'
import './OperationsPanel.css'

const OperationsPanel = () => {
  const stats = {
    assigned: 24,
    unassigned: 8,
    overdue: 3
  }

  const workflowSteps = [
    { id: 1, label: 'Detected', count: 12, status: 'active' },
    { id: 2, label: 'Verified', count: 8, status: 'active' },
    { id: 3, label: 'Assigned', count: 6, status: 'active' },
    { id: 4, label: 'Fixed', count: 2, status: 'completed' }
  ]

  return (
    <div className="operations-card">
      <div className="card-header">
        <h2 className="card-title">Operations & Task Control</h2>
      </div>
      
      <div className="operations-stats">
        <StatBox label="Assigned" value={stats.assigned} color="var(--accent-green)" />
        <StatBox label="Unassigned" value={stats.unassigned} color="var(--accent-amber)" />
        <StatBox label="Overdue" value={stats.overdue} color="var(--accent-red)" />
      </div>

      <div className="workflow-section">
        <h3 className="workflow-title">Workflow Status</h3>
        <div className="workflow-indicator">
          {workflowSteps.map((step, index) => (
            <React.Fragment key={step.id}>
              <WorkflowStep step={step} />
              {index < workflowSteps.length - 1 && (
                <div className="workflow-connector" />
              )}
            </React.Fragment>
          ))}
        </div>
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

