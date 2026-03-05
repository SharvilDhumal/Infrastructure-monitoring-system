import React, { useState, useEffect } from 'react'
import axios from 'axios'
import KPICard from '../components/KPICard'
import IssueTrendChart from '../components/IssueTrendChart'
import IssueDonutChart from '../components/IssueDonutChart'
import InfrastructureBarChart from '../components/InfrastructureBarChart'
import './Analytics.css'

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const res = await axios.get('http://localhost:5001/api/admin/analytics')
        setAnalyticsData(res.data.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching analytics:', err)
        setError('Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner">Loading analytics...</div>
      </div>
    )
  }

  if (error) {
    return <div className="analytics-error">{error}</div>
  }

  if (!analyticsData) return null

  const metrics = {
    totalIssues: analyticsData.totalIssues || 0,
    resolvedIssues: analyticsData.resolvedIssues || 0,
    avgResolutionTime: analyticsData.avgResolutionTime || '4.2 hours',
    aiAccuracy: analyticsData.aiAccuracy || 94.2,
    costSavings: analyticsData.costSavings || '$124,500',
    preventiveActions: analyticsData.preventiveActions || 342,
    severity: analyticsData.severityCounts || { critical: 0, high: 0, medium: 0, low: 0 }
  }

  const assetBreakdown = analyticsData.assetHealth || []
  const topIssues = analyticsData.topIssueTypes || []

  return (
    <div className="analytics">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Comprehensive insights and performance metrics</p>
        </div>
      </div>

      <div className="analytics-issue-overview">
        {/* Section 1: KPI Cards */}
        <div className="analytics-section kpi-section">
          <KPICard
            type="total"
            title="Total Issues"
            value={metrics.totalIssues.toLocaleString()}
            subtext="+12% vs previous period"
          />
          <KPICard
            type="resolved"
            title="Resolved"
            value={metrics.resolvedIssues.toLocaleString()}
            subtext={`Resolution rate: ${Math.round((metrics.resolvedIssues / metrics.totalIssues) * 100)}%`}
          />
        </div>

        {/* Section 2: Trend Chart */}
        <div className="analytics-section chart-section full-width">
          <div className="chart-card-header">
            <h3 className="card-section-title">Issue Trends</h3>
            <div className="period-selector-mini">
              {['7d', '30d', '90d'].map((p) => (
                <button
                  key={p}
                  className={`period-btn-mini ${selectedPeriod === p ? 'active' : ''}`}
                  onClick={() => setSelectedPeriod(p)}
                >
                  {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
          </div>
          <div className="trend-chart-container">
            <IssueTrendChart period={selectedPeriod} externalData={analyticsData.issueTrends} />
          </div>
        </div>

        {/* Section 3: Severity Distribution & Infrastructure Types */}
        <div className="analytics-section charts-row">
          <div className="analytics-card-container">
            <h3 className="card-section-title centered-title">Severity Distribution</h3>
            <div className="donut-wrapper">
              <IssueDonutChart data={metrics.severity} />
            </div>
          </div>
          <div className="analytics-card-container">
            <InfrastructureBarChart data={assetBreakdown} />
          </div>
        </div>
      </div>

      <div className="analytics-secondary-grid">
        <div className="analytics-card asset-breakdown-card">
          <h2 className="card-section-title">Asset Health Breakdown</h2>
          <div className="asset-breakdown">
            {assetBreakdown.map((asset, index) => (
              <div key={index} className="breakdown-item">
                <div className="breakdown-header">
                  <span className="breakdown-asset">{asset.asset}</span>
                  <span className="breakdown-health">{asset.health}%</span>
                </div>
                <div className="breakdown-stats">
                  <span className="breakdown-stat">{asset.resolved}/{asset.issues} resolved</span>
                </div>
                <div className="breakdown-bar">
                  <div
                    className="breakdown-fill"
                    style={{
                      width: `${asset.health}%`,
                      backgroundColor: asset.health >= 80 ? 'var(--accent-green)' :
                        asset.health >= 60 ? 'var(--accent-amber)' : 'var(--accent-red)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card top-issues-card">
          <h2 className="card-section-title">Top Issue Types</h2>
          <div className="top-issues-list">
            {topIssues.map((issue, index) => (
              <div key={index} className="top-issue-item">
                <div className="issue-rank">#{index + 1}</div>
                <div className="issue-info">
                  <div className="issue-name">{issue.type}</div>
                  <div className="issue-count">{issue.count} occurrences</div>
                </div>
                <div className="issue-trend" style={{
                  color: issue.trend.startsWith('+') ? 'var(--accent-red)' : 'var(--accent-green)'
                }}>
                  {issue.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Analytics































