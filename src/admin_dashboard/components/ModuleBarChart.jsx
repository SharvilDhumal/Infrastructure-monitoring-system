import React from 'react'
import './ModuleBarChart.css'

const defaultModules = [
  { name: 'Roads', value: 92, color: 'var(--accent-green)' },
  { name: 'Street Lights', value: 78, color: 'var(--accent-amber)' },
  { name: 'Water Leakage', value: 88, color: 'var(--accent-blue, #3b82f6)' },
  { name: 'Bridges', value: 65, color: 'var(--accent-red)' }
]

const ModuleBarChart = ({ modules = [] }) => {
  const maxVal = Math.max(...modules.map(m => m.value || 0), 1);

  return (
    <div className="bar-card">
      <div className="bar-header">
        <h3>Issue Velocity – Module-wise</h3>
      </div>
      <div className="bar-list">
        {modules.map((module) => (
          <div key={module.name} className="bar-row">
            <div className="bar-label">{module.name}</div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${((module.value || 0) / maxVal) * 100}%`,
                  background: 'var(--primary-navy, #001f3f)'
                }}
              />
            </div>
            <div className="bar-value-text">{module.value || 0}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ModuleBarChart



























