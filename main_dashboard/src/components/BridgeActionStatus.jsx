import React from 'react'
import './BridgeActionStatus.css'

const BridgeActionStatus = ({ actionItems, onViewDetails, onAssign }) => {
  if (!actionItems || actionItems.length === 0) {
    return null
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'var(--accent-red)'
      case 'Medium':
        return 'var(--accent-amber)'
      case 'Low':
        return 'var(--accent-green)'
      default:
        return 'var(--text-secondary)'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'var(--accent-green)'
      case 'In Progress':
        return 'var(--accent-blue, #3b82f6)'
      case 'Assigned':
        return 'var(--accent-amber)'
      case 'Unassigned':
        return 'var(--text-secondary)'
      default:
        return 'var(--text-secondary)'
    }
  }

  return (
    <div className="bridge-action-status-card recent-issues-card">
      <h3 className="card-section-title">Action Status</h3>
      <div className="action-status-table issues-table">
        <div className="table-header">
          <div className="table-col">Defect Type</div>
          <div className="table-col">Location</div>
          <div className="table-col">Priority</div>
          <div className="table-col">Status</div>
          <div className="table-col">Actions</div>
        </div>
        {actionItems.map((item) => (
          <div key={item.id} className="table-row">
            <div className="table-col">{item.defectType}</div>
            <div className="table-col">{item.location}</div>
            <div className="table-col">
              <span 
                className="severity-badge"
                style={{
                  backgroundColor: `${getPriorityColor(item.priority)}20`,
                  color: getPriorityColor(item.priority),
                  borderColor: getPriorityColor(item.priority)
                }}
              >
                {item.priority}
              </span>
            </div>
            <div className="table-col">
              <span 
                className="severity-badge"
                style={{
                  backgroundColor: `${getStatusColor(item.status)}20`,
                  color: getStatusColor(item.status),
                  borderColor: getStatusColor(item.status)
                }}
              >
                {item.status}
              </span>
            </div>
            <div className="table-col">
              <button 
                className="action-link"
                onClick={() => onViewDetails && onViewDetails(item)}
              >
                View
              </button>
              <button 
                className="action-link"
                onClick={() => onAssign && onAssign(item)}
              >
                Assign
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BridgeActionStatus
















