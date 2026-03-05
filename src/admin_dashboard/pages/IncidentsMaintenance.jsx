import React, { useState } from 'react'
import './IncidentsMaintenance.css'
import { useIssues } from '../hooks/useIssues'
import IssueCard from '../components/IssueCard'
import AssignIssueModal from '../components/AssignIssueModal'
import ResolveIssueModal from '../components/ResolveIssueModal'
import IssueDetailsModal from '../components/IssueDetailsModal'

const IncidentsMaintenance = () => {
  const { allIssues, loading, error, assignIssue, resolveIssue, reopenIssue } = useIssues()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showResolveModal, setShowResolveModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const filteredIssues = allIssues.filter(issue => {
    if (selectedFilter === 'all') return true
    return issue.status === selectedFilter
  })

  // ... (rest of the state and handlers remain the same)
  const statusCounts = {
    all: allIssues.length,
    active: allIssues.filter(i => i.status === 'active').length,
    resolved: allIssues.filter(i => i.status === 'resolved').length
  }

  const handleAssignClick = (issue) => {
    setSelectedIssue(issue)
    setShowAssignModal(true)
  }

  const handleResolveClick = (issue) => {
    setSelectedIssue(issue)
    setShowResolveModal(true)
  }

  const handleViewDetails = (issue) => {
    setSelectedIssue(issue)
    setShowDetailsModal(true)
  }

  const handleAssignConfirm = async (issueId, team) => {
    await assignIssue(issueId, team)
    setShowAssignModal(false)
  }

  const handleResolveConfirm = (issueId, resolver) => {
    resolveIssue(issueId, resolver)
    setShowResolveModal(false)
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div style={{ fontSize: '40px' }}>⚠️</div>
        </div>
        <p>Loading incidents...</p>
      </div>
    )
  }
  if (error) return <div className="overview-error">{error}</div>

  return (
    <div className="incidents-maintenance">
      <div className="page-header">
        <h1 className="page-title">Incidents & Maintenance</h1>
        <p className="page-subtitle">Track and manage infrastructure incidents and maintenance tasks</p>
      </div>

      <div className="status-filters">
        {['all', 'active', 'resolved'].map((status) => (
          <button
            key={status}
            className={`status-filter ${selectedFilter === status ? 'active' : ''}`}
            onClick={() => setSelectedFilter(status)}
          >
            <span className="filter-label">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
            <span className="filter-count">{statusCounts[status]}</span>
          </button>
        ))}
      </div>

      <div className="incidents-list">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onAssign={handleAssignClick}
              onResolve={handleResolveClick}
              onViewDetails={handleViewDetails}
            />
          ))
        ) : (
          <div className="no-issues">No {selectedFilter} issues found.</div>
        )}
      </div>

      {showAssignModal && (
        <AssignIssueModal
          isOpen={showAssignModal}
          issue={selectedIssue}
          onClose={() => setShowAssignModal(false)}
          onConfirm={handleAssignConfirm}
        />
      )}

      {showResolveModal && (
        <ResolveIssueModal
          isOpen={showResolveModal}
          issue={selectedIssue}
          onClose={() => setShowResolveModal(false)}
          onConfirm={handleResolveConfirm}
        />
      )}

      {showDetailsModal && (
        <IssueDetailsModal
          issue={selectedIssue}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  )
}

export default IncidentsMaintenance
