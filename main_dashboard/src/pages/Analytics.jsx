import React, { useState } from 'react'
import KPICard from '../components/KPICard'
import IssueTrendChart from '../components/IssueTrendChart'
import IssueDonutChart from '../components/IssueDonutChart'
import './Analytics.css'

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d')

  const metrics = {
    totalIssues: 1247,
    resolvedIssues: 1158,
    avgResolutionTime: '4.2 hours',
    aiAccuracy: 94.2,
    costSavings: '$124,500',
    preventiveActions: 342,
    severity: { high: 145, medium: 412, low: 691 } // Aggregate severity for analytics
  }

  const assetBreakdown = [
    { asset: 'Roads', issues: 523, resolved: 485, health: 92 },
    { asset: 'Street Lights', issues: 342, resolved: 298, health: 78 },
    { asset: 'Water Systems', issues: 189, resolved: 167, health: 88 },
    { asset: 'Bridges', issues: 47, resolved: 31, health: 65 }
  ]

  const topIssues = [
    { type: 'Street Light Failures', count: 189, trend: '-8%' },
    { type: 'Water Leaks', count: 156, trend: '+5%' },
    { type: 'Surface Degradation', count: 134, trend: '-3%' },
    { type: 'Structural Anomalies', count: 98, trend: '+18%' }
  ]

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
            <IssueTrendChart period={selectedPeriod} />
          </div>
        </div>

        {/* Section 3: Severity Distribution */}
        <div className="analytics-section severity-section">
          <IssueDonutChart data={metrics.severity} />
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

      <div className="analytics-grid">
        <div className="analytics-card glass-card">
          <h2 className="card-section-title">Resolution Efficiency</h2>
          <div className="efficiency-metrics">
            <div className="efficiency-item">
              <div className="efficiency-label">Average Response Time</div>
              <div className="efficiency-value">1.2 hours</div>
            </div>
            <div className="efficiency-item">
              <div className="efficiency-label">Average Resolution Time</div>
              <div className="efficiency-value">{metrics.avgResolutionTime}</div>
            </div>
            <div className="efficiency-item">
              <div className="efficiency-label">First-Time Fix Rate</div>
              <div className="efficiency-value">87%</div>
            </div>
            <div className="efficiency-item">
              <div className="efficiency-label">Customer Satisfaction</div>
              <div className="efficiency-value">4.6/5.0</div>
            </div>
          </div>
        </div>

        <div className="analytics-card glass-card">
          <h2 className="card-section-title">AI Performance</h2>
          <div className="ai-performance">
            <div className="performance-item">
              <div className="performance-label">Detection Accuracy</div>
              <div className="performance-bar">
                <div className="performance-fill" style={{ width: `${metrics.aiAccuracy}%`, backgroundColor: 'var(--accent-green)' }} />
              </div>
              <div className="performance-value">{metrics.aiAccuracy}%</div>
            </div>
            <div className="performance-item">
              <div className="performance-label">Preventive Actions</div>
              <div className="performance-value">{metrics.preventiveActions}</div>
            </div>
            <div className="performance-item">
              <div className="performance-label">Cost Savings</div>
              <div className="performance-value text-green">{metrics.costSavings}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics































