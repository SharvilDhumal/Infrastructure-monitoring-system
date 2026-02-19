import React, { useState, useEffect } from 'react'
import './AssignTeamModal.css'

const teams = [
  'Road Maintenance Team Alpha',
  'Road Maintenance Team Beta',
  'Street Light Crew A',
  'Street Light Crew B',
  'Water Infrastructure Unit 1',
  'Water Infrastructure Unit 2',
  'Bridge Inspection Team',
  'Emergency Response Unit'
]

const AssignTeamModal = ({ issue, onAssign, onClose }) => {
  const [selectedTeam, setSelectedTeam] = useState('')
  const [notes, setNotes] = useState('')

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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedTeam) {
      onAssign(issue.id, selectedTeam, notes)
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Assign Team</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="assign-details">
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
          </div>

          <div className="form-group">
            <label htmlFor="team-select" className="form-label">
              Select Team <span className="required">*</span>
            </label>
            <select
              id="team-select"
              className="form-select"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              required
            >
              <option value="">Choose a team...</option>
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              className="form-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes or instructions..."
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-btn primary" disabled={!selectedTeam}>
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AssignTeamModal

























