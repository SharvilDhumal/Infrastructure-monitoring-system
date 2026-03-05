import React from 'react'
import './InfrastructureHealthRing.css'

const InfrastructureHealthRing = () => {
  const infrastructure = [
    { name: 'Roads', health: 92, color: '#22C55E', icon: '🛣️' },
    { name: 'Street Lights', health: 78, color: '#F59E0B', icon: '💡' },
    { name: 'Water Leakage', health: 88, color: '#3B82F6', icon: '💧' },
    { name: 'Bridges', health: 65, color: '#EF4444', icon: '🌉' }
  ]

  const totalHealth = Math.round(
    infrastructure.reduce((sum, item) => sum + item.health, 0) / infrastructure.length
  )

  // Calculate angles for ring segments
  const circumference = 2 * Math.PI * 45 // radius = 45
  const totalAngle = 360
  let currentAngle = -90 // Start from top

  return (
    <div className="health-ring-container">
      <div className="health-ring-wrapper">
        <svg className="health-ring-svg" viewBox="0 0 100 100">
          <circle
            className="health-ring-background"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(0, 0, 0, 0.08)"
            strokeWidth="8"
          />
          {infrastructure.map((item, index) => {
            const segmentAngle = (item.health / 100) * totalAngle
            const strokeDasharray = (item.health / 100) * circumference
            const rotation = currentAngle

            currentAngle += segmentAngle

            return (
              <circle
                key={index}
                className="health-ring-segment"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={item.color}
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={circumference - strokeDasharray}
                transform={`rotate(${rotation} 50 50)`}
                strokeLinecap="round"
              />
            )
          })}
        </svg>
        <div className="health-ring-center">
          <div className="health-ring-value">{totalHealth}%</div>
          <div className="health-ring-label">Overall</div>
        </div>
      </div>
      <div className="health-ring-legend">
        {infrastructure.map((item, index) => (
          <div key={index} className="health-ring-legend-item">
            <div className="legend-color" style={{ backgroundColor: item.color }} />
            <div className="legend-content">
              <div className="legend-name">{item.name}</div>
              <div className="legend-health">{item.health}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InfrastructureHealthRing



