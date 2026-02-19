import React, { useEffect } from 'react'
import './ViewDetailsModal.css'

const ViewDetailsModal = ({ issue, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  if (!issue) return null

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

  const severityColor = getSeverityColor(issue.severity)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Issue Details</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-content">
          <div className="modal-preview">
            <div className="preview-image" style={{ backgroundColor: `${severityColor}15` }}>
              <span className="preview-icon">{issue.image}</span>
            </div>
          </div>
          <div className="modal-details">
            <div className="detail-row">
              <span className="detail-label">Issue Name:</span>
              <span className="detail-value">{issue.title}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span 
                className="detail-value detail-status"
                style={{ color: severityColor }}
              >
                {issue.severity}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Location:</span>
              <span className="detail-value">{issue.location}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Exact Location:</span>
              <span className="detail-value">{issue.exactLocation}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Detection Time:</span>
              <span className="detail-value">{issue.detectionTime}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">AI Confidence:</span>
              <span className="detail-value">{issue.aiConfidence}%</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Coordinates:</span>
              <span className="detail-value">{issue.lat.toFixed(4)}, {issue.lng.toFixed(4)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewDetailsModal

























