import React from 'react'
import './ModuleBarChart.css'

const defaultModules = [
  { name: 'Roads', value: 92, color: 'var(--accent-green)' },
  { name: 'Street Lights', value: 78, color: 'var(--accent-amber)' },
  { name: 'Water Leakage', value: 88, color: 'var(--accent-blue, #3b82f6)' },
  { name: 'Bridges', value: 65, color: 'var(--accent-red)' }
]

const ModuleBarChart = ({ modules = defaultModules }) => {
  return (
    <div className="bar-card">
      <div className="bar-header">
        <h3>Issue Velocity – Module-wise</h3>
      </div>
      <div className="bar-grid">
        {modules.map((module) => (
          <div key={module.name} className="bar-item">
            <div className="bar-label">{module.name}</div>
            <div className="bar-wrapper">
              <div
                className="bar-fill"
                style={{
                  height: `${module.value}%`,
                  background: module.color
                }}
              />
            </div>
            <div className="bar-value">{module.value}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ModuleBarChart



























