import React, { useState, useMemo } from 'react'
import BridgeAIVisualProof from '../components/BridgeAIVisualProof'
import BridgeDefectDistribution from '../components/BridgeDefectDistribution'
import BridgeActionStatus from '../components/BridgeActionStatus'
import ViewDetailsModal from '../components/ViewDetailsModal'
import AssignTeamModal from '../components/AssignTeamModal'
import KPICard from '../components/KPICard'
import IssueTrendChart from '../components/IssueTrendChart'
import SeverityDonutChart from '../components/IssueDonutChart' // Using extracted version
import './InfrastructureMonitoring.css'

const InfrastructureMonitoring = () => {
  const [selectedAsset, setSelectedAsset] = useState('roads')
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [timePeriod, setTimePeriod] = useState('7d')

  const assets = {
    roads: {
      name: 'Roads',
      icon: '🛣️',
      detected: 24,
      resolved: 18,
      severity: { high: 5, medium: 12, low: 7 },
      recentIssues: [
        { id: 2, location: 'Highway 101', issue: 'Crack formation', severity: 'warning', detected: '1 hour ago' },
        { id: 3, location: 'Park Boulevard', issue: 'Surface degradation', severity: 'warning', detected: '2 hours ago' }
      ]
    },
    streetlights: {
      name: 'Street Lights',
      icon: '💡',
      detected: 142,
      resolved: 116,
      severity: { high: 12, medium: 45, low: 85 },
      recentIssues: [
        { id: 1, location: 'Park Boulevard', issue: 'Light #1247 not responding', severity: 'critical', detected: '12 min ago' },
        { id: 2, location: 'River Road', issue: 'Dimming detected', severity: 'warning', detected: '45 min ago' },
        { id: 3, location: 'Main Street', issue: 'Scheduled maintenance', severity: 'warning', detected: '3 hours ago' }
      ]
    },
    water: {
      name: 'Water Systems',
      icon: '💧',
      detected: 56,
      resolved: 46,
      severity: { high: 8, medium: 14, low: 34 },
      recentIssues: [
        { id: 1, location: 'River Road', issue: 'Potential water main leak', severity: 'critical', detected: '18 min ago' },
        { id: 2, location: 'Downtown District', issue: 'Pressure fluctuation', severity: 'warning', detected: '1 hour ago' },
        { id: 3, location: 'Industrial Zone', issue: 'Valve maintenance due', severity: 'warning', detected: '4 hours ago' }
      ]
    },
    bridges: {
      name: 'Bridges',
      icon: '🌉',
      detected: 12,
      resolved: 7,
      severity: { high: 3, medium: 5, low: 4 },
      recentIssues: [
        { id: 1, location: 'Highway Bridge #3', issue: 'Structural anomaly detected', severity: 'critical', detected: '25 min ago' },
        { id: 2, location: 'River Crossing Bridge', issue: 'Sensor calibration needed', severity: 'warning', detected: '2 hours ago' },
        { id: 3, location: 'Railway Overpass', issue: 'Routine inspection due', severity: 'warning', detected: '1 day ago' }
      ],
      aiVisualProofs: [
        {
          id: 1,
          defectType: 'Crack',
          severity: 'High',
          confidence: 94,
          title: 'Crack Detected - Highway Bridge #3',
          location: 'Highway Bridge #3',
          exactLocation: 'South abutment, column B',
          detectionTime: '25 min ago',
          timestamp: '25 min ago',
          aiConfidence: 94,
          lat: 13.0827,
          lng: 80.2707,
          image: '🌉'
        },
        {
          id: 2,
          defectType: 'Corrosion',
          severity: 'Medium',
          confidence: 87,
          title: 'Corrosion Detected - River Crossing Bridge',
          location: 'River Crossing Bridge',
          exactLocation: 'North span, beam support',
          detectionTime: '2 hours ago',
          timestamp: '2 hours ago',
          aiConfidence: 87,
          lat: 12.9716,
          lng: 77.5946,
          image: '🌉'
        },
        {
          id: 3,
          defectType: 'Spalling',
          severity: 'Low',
          confidence: 82,
          title: 'Spalling Detected - Railway Overpass',
          location: 'Railway Overpass',
          exactLocation: 'East deck, section 4',
          detectionTime: '1 day ago',
          timestamp: '1 day ago',
          aiConfidence: 82,
          lat: 19.0760,
          lng: 72.8777,
          image: '🌉'
        }
      ],
      defectDistribution: [
        { type: 'Cracks', count: 12 },
        { type: 'Corrosion', count: 8 },
        { type: 'Spalling', count: 5 }
      ],
      actionStatus: [
        {
          id: 1,
          defectType: 'Crack',
          location: 'Highway Bridge #3 - Column B',
          priority: 'High',
          status: 'Unassigned',
          title: 'Crack Detected - Highway Bridge #3',
          exactLocation: 'South abutment, column B',
          detectionTime: '25 min ago',
          timestamp: '25 min ago',
          aiConfidence: 94,
          severity: 'critical',
          lat: 13.0827,
          lng: 80.2707,
          image: '🌉'
        }
      ]
    }
  }

  const currentAsset = assets[selectedAsset]

  const handleViewDetails = (issue) => {
    setSelectedIssue(issue)
    setShowDetailsModal(true)
  }

  const handleAssignClick = (issue) => {
    setSelectedIssue(issue)
    setShowAssignModal(true)
  }

  const handleAssignTeam = async (issueId, team, notes) => {
    console.log('Assigning team:', { issueId, team, notes })
    handleCloseModals()
  }

  const handleCloseModals = () => {
    setShowDetailsModal(false)
    setShowAssignModal(false)
    setSelectedIssue(null)
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
        {/* Section 1: KPI Cards */}
        <div className="overview-section kpi-section">
          <KPICard
            type="total"
            title="Total Issues"
            value={currentAsset.detected}
            subtext="+12% vs previous period"
          />
          <KPICard
            type="resolved"
            title="Resolved"
            value={currentAsset.resolved}
            subtext={`Resolution rate: ${Math.round((currentAsset.resolved / currentAsset.detected) * 100)}%`}
          />
        </div>

        {/* Section 2: Trend Chart */}
        <div className="overview-section chart-section full-width">
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
            <IssueTrendChart period={timePeriod} />
          </div>
        </div>

        {/* Section 3: Severity Distribution */}
        <div className="overview-section severity-section">
          <SeverityDonutChart data={currentAsset.severity} />
        </div>
      </div>

      {/* Bridge-specific sections - only show for Bridge tab */}
      {selectedAsset === 'bridges' && currentAsset.aiVisualProofs && (
        <>
          <BridgeAIVisualProof
            visualProofs={currentAsset.aiVisualProofs}
            onViewDetails={handleViewDetails}
            onAssign={handleAssignClick}
          />
          <div className="defect-distribution-recent-issues-container">
            <div className="defect-distribution-wrapper">
              <BridgeDefectDistribution defectData={currentAsset.defectDistribution} />
            </div>
            <div className="recent-issues-wrapper">
              <RecentIssuesTable
                issues={currentAsset.recentIssues}
                onView={handleViewDetails}
                onAssign={handleAssignClick}
                assetIcon={currentAsset.icon}
              />
            </div>
          </div>
          <BridgeActionStatus
            actionItems={currentAsset.actionStatus}
            onViewDetails={handleViewDetails}
            onAssign={handleAssignClick}
          />
        </>
      )}

      {/* Recent Issues - only show for non-Bridge tabs */}
      {selectedAsset !== 'bridges' && (
        <RecentIssuesTable
          issues={currentAsset.recentIssues}
          onView={handleViewDetails}
          onAssign={handleAssignClick}
          assetIcon={currentAsset.icon}
        />
      )}

      {/* Modals */}
      {showDetailsModal && (
        <ViewDetailsModal
          issue={selectedIssue}
          onClose={handleCloseModals}
        />
      )}

      {showAssignModal && (
        <AssignTeamModal
          issue={selectedIssue}
          onAssign={handleAssignTeam}
          onClose={handleCloseModals}
        />
      )}
    </div>
  )
}

const RecentIssuesTable = ({ issues, onView, onAssign, assetIcon }) => {
  return (
    <div className="recent-issues-card">
      <h3 className="card-section-title">Recent Issues</h3>
      <div className="issues-table">
        <div className="table-header">
          <div className="table-col">Location</div>
          <div className="table-col">Issue</div>
          <div className="table-col">Severity</div>
          <div className="table-col">Detected</div>
          <div className="table-col">Actions</div>
        </div>
        {issues.map((issue) => (
          <div key={issue.id} className="table-row">
            <div className="table-col">{issue.location}</div>
            <div className="table-col">{issue.issue}</div>
            <div className="table-col">
              <span
                className={`severity-badge ${issue.severity}`}
                style={{
                  backgroundColor: issue.severity === 'critical' ? 'var(--accent-red)' : 'var(--accent-amber)',
                  color: 'white'
                }}
              >
                {issue.severity}
              </span>
            </div>
            <div className="table-col">{issue.detected}</div>
            <div className="table-col actions-cell">
              <button
                className="action-link"
                onClick={() => onView({
                  ...issue,
                  title: issue.issue,
                  exactLocation: issue.location,
                  detectionTime: issue.detected,
                  timestamp: issue.detected,
                  aiConfidence: 85,
                  lat: 22.9734,
                  lng: 78.6569,
                  image: assetIcon
                })}
              >
                View
              </button>
              <button
                className="action-link"
                onClick={() => onAssign({
                  ...issue,
                  title: issue.issue,
                  exactLocation: issue.location,
                  detectionTime: issue.detected,
                  timestamp: issue.detected,
                  aiConfidence: 85,
                  lat: 22.9734,
                  lng: 78.6569,
                  image: assetIcon
                })}
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

export default InfrastructureMonitoring
















