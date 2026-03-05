import React, { useState, useMemo } from 'react'
import IssueTable from '../components/IssueTable'
import AssignIssueModal from '../components/AssignIssueModal'
import ResolveIssueModal from '../components/ResolveIssueModal'
import IssueDetailsModal from '../components/IssueDetailsModal'
import KPICard from '../components/KPICard'
import IssueTrendChart from '../components/IssueTrendChart'
import SeverityDonutChart from '../components/IssueDonutChart'
import './InfrastructureMonitoring.css'
import { useIssues } from '../hooks/useIssues'

const InfrastructureMonitoring = () => {
  const { allIssues, loading, error, assignIssue, resolveIssue, reopenIssue } = useIssues()
  const [selectedAsset, setSelectedAsset] = useState('roads')
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showResolveModal, setShowResolveModal] = useState(false)
  const [timePeriod, setTimePeriod] = useState('7d')

  const assets = useMemo(() => {
    const assetTypes = {
      roads: { name: 'Roads', icon: '🛣️', types: ['Pothole'] },
      streetlights: { name: 'Street Lights', icon: '💡', types: ['Street Light Malfunction', 'Streetlight'] },
      water: { name: 'Water Systems', icon: '💧', types: ['Water Leak', 'Water Leakage'] },
      bridges: { name: 'Bridges', icon: '🌉', types: ['Bridge Structural Anomaly', 'Bridge'] }
    }

    const result = {}
    Object.keys(assetTypes).forEach(key => {
      const typeInfo = assetTypes[key]
      const filteredIssues = allIssues.filter(i =>
        typeInfo.types.some(t => i.issueType?.toLowerCase().includes(t.toLowerCase()) || i.title?.toLowerCase().includes(t.toLowerCase()))
      )

      result[key] = {
        name: typeInfo.name,
        icon: typeInfo.icon,
        detected: filteredIssues.length,
        resolved: filteredIssues.filter(i => i.status === 'resolved').length,
        severity: {
          high: filteredIssues.filter(i => (i.severity?.toLowerCase() === 'critical' || i.severity?.toLowerCase() === 'high') && i.status === 'active').length,
          medium: filteredIssues.filter(i => (i.severity?.toLowerCase() === 'medium' || i.severity?.toLowerCase() === 'warning') && i.status === 'active').length,
          low: filteredIssues.filter(i => i.severity?.toLowerCase() === 'low' && i.status === 'active').length
        },
        recentIssues: filteredIssues.slice(0, 10),
        allFilteredIssues: filteredIssues
      }
    })
    return result
  }, [allIssues])

  const currentAsset = assets[selectedAsset] || { name: 'Loading...', icon: '⌛', detected: 0, resolved: 0, severity: { high: 0, medium: 0, low: 0 }, recentIssues: [], allFilteredIssues: [] }

  const handleViewDetails = (issue) => {
    setSelectedIssue(issue)
    setShowDetailsModal(true)
  }

  const handleAssignClick = (issue) => {
    setSelectedIssue(issue)
    setShowAssignModal(true)
  }

  const handleResolveClick = (issue) => {
    setSelectedIssue(issue)
    setShowResolveModal(true)
  }

  const handleAssignConfirm = async (issueId, team) => {
    await assignIssue(issueId, team)
    setShowAssignModal(false)
  }

  const handleResolveConfirm = (issueId, resolver) => {
    resolveIssue(issueId, resolver)
    setShowResolveModal(false)
  }

  if (loading && allIssues.length === 0) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div style={{ fontSize: '40px' }}>🏗️</div>
        </div>
        <p>Loading asset data...</p>
      </div>
    )
  }

  if (error) {
    return <div className="overview-error">{error}</div>
  }

  return (
    <div className="infrastructure-monitoring">
      <div className="page-header">
        <h1 className="page-title">Infrastructure Monitoring</h1>
        <p className="page-subtitle">Asset-wise views and detailed monitoring</p>
      </div>

      <div className="asset-selector">
        {Object.keys(assets).map((key) => (
          <button
            key={key}
            className={`asset-tab ${selectedAsset === key ? 'active' : ''}`}
            onClick={() => setSelectedAsset(key)}
          >
            <span className="asset-tab-icon">{assets[key].icon}</span>
            <span>{assets[key].name}</span>
          </button>
        ))}
      </div>

      <div className="section-title-container">
        <h2 className="section-title">Issue Overview</h2>
      </div>

      <div className="issue-overview-section">
        <div className="overview-section kpi-section">
          <KPICard
            type="total"
            title="Total Issues"
            value={currentAsset.detected}
            subtext="Real-time count"
          />
          <KPICard
            type="resolved"
            title="Resolved"
            value={currentAsset.resolved}
            subtext={`Resolution rate: ${currentAsset.detected > 0 ? Math.round((currentAsset.resolved / currentAsset.detected) * 100) : 0}%`}
          />
        </div>

        <div className="charts-combined-row">
          <div className="overview-section chart-section trend-card">
            <div className="chart-card-header">
              <h3 className="card-section-title">Issue Trends</h3>
              <div className="period-selector-mini">
                {['7d', '30d', '90d'].map((p) => (
                  <button
                    key={p}
                    className={`period-btn-mini ${timePeriod === p ? 'active' : ''}`}
                    onClick={() => setTimePeriod(p)}
                  >
                    {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
                  </button>
                ))}
              </div>
            </div>
            <div className="trend-chart-container">
              <IssueTrendChart issues={currentAsset.allFilteredIssues} period={timePeriod} />
            </div>
          </div>

          <div className="overview-section severity-section secondary-card">
            <h3 className="card-section-title">Severity Distribution</h3>
            <SeverityDonutChart data={currentAsset.severity} />
          </div>
        </div>
      </div>

      <div className="recent-issues-container">
        <h3 className="card-section-title">Recent Issues</h3>
        <IssueTable
          issues={currentAsset.recentIssues}
          onAssign={handleAssignClick}
          onResolve={handleResolveClick}
          onViewDetails={handleViewDetails}
        />
      </div>

      {showDetailsModal && (
        <IssueDetailsModal
          issue={selectedIssue}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showAssignModal && (
        <AssignIssueModal
          isOpen={showAssignModal}
          issue={selectedIssue}
          onConfirm={handleAssignConfirm}
          onClose={() => setShowAssignModal(false)}
        />
      )}

      {showResolveModal && (
        <ResolveIssueModal
          isOpen={showResolveModal}
          issue={selectedIssue}
          onConfirm={handleResolveConfirm}
          onClose={() => setShowResolveModal(false)}
        />
      )}
    </div>
  )
}

export default InfrastructureMonitoring
