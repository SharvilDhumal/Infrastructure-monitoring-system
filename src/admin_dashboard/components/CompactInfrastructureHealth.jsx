import React from 'react'
import './CompactInfrastructureHealth.css'

const CompactInfrastructureHealth = () => {
  const infrastructure = [
    {
      id: 1,
      name: 'Roads',
      status: 'healthy',
      health: 92,
      icon: '🛣️',
      issues: 3,
      total: 1247
    },
    {
      id: 2,
      name: 'Street Lights',
      status: 'warning',
      health: 78,
      icon: '💡',
      issues: 12,
      total: 3421
    },
    {
      id: 3,
      name: 'Water Systems',
      status: 'healthy',
      health: 88,
      icon: '💧',
      issues: 2,
      total: 856
    },
    {
      id: 4,
      name: 'Bridges',
      status: 'critical',
      health: 65,
      icon: '🌉',
      issues: 5,
      total: 47
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'var(--accent-green)'
      case 'warning':
        return 'var(--accent-amber)'
      case 'critical':
        return 'var(--accent-red)'
      default:
        return 'var(--text-secondary)'
    }
  }

  return (
    <div className="infrastructure-health-card">
      <div className="card-header">
        <h2 className="card-title">Infrastructure Health</h2>
      </div>
      <div className="infrastructure-list">
        {infrastructure.map((item) => (
          <InfrastructureItem 
            key={item.id} 
            item={item} 
            getStatusColor={getStatusColor}
          />
        ))}
      </div>
    </div>
  )
}

const InfrastructureItem = ({ item, getStatusColor }) => {
  const statusColor = getStatusColor(item.status)

  return (
    <div className="infrastructure-item">
      <div className="infrastructure-icon" style={{ backgroundColor: `${statusColor}15` }}>
        <span>{item.icon}</span>
      </div>
      <div className="infrastructure-content">
        <div className="infrastructure-header">
          <h3 className="infrastructure-name">{item.name}</h3>
          <span 
            className="infrastructure-status"
            style={{ 
              backgroundColor: `${statusColor}20`,
              color: statusColor
            }}
          >
            {item.status}
          </span>
        </div>
        <div className="infrastructure-health-bar">
          <div 
            className="health-bar-fill"
            style={{ 
              width: `${item.health}%`,
              backgroundColor: statusColor
            }}
          />
        </div>
        <div className="infrastructure-stats">
          <span className="health-percentage">{item.health}%</span>
          <span className="health-details">
            {item.issues} issues / {item.total} total
          </span>
        </div>
      </div>
    </div>
  )
}

export default CompactInfrastructureHealth































