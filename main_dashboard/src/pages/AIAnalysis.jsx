import React, { useState } from 'react'
import './AIAnalysis.css'

const AIAnalysis = () => {
  const [selectedView, setSelectedView] = useState('insights')

  const aiInsights = [
    {
      id: 1,
      type: 'pattern',
      title: 'Recurring Pothole Pattern Detected',
      description: 'AI analysis has identified a recurring pattern of pothole formation along the Main Street corridor. The pattern correlates strongly with heavy traffic volume (peak hours) and recent weather patterns (freeze-thaw cycles). Historical data suggests this pattern has been consistent over the past 6 months.',
      confidence: 92,
      priority: 'high',
      recommendations: [
        'Schedule preventive maintenance for Main Street corridor',
        'Consider traffic management during peak hours',
        'Implement enhanced monitoring for this zone'
      ],
      affectedAssets: ['Roads: 12 segments', 'Traffic flow: High impact'],
      timestamp: '15 min ago'
    },
    {
      id: 2,
      type: 'risk',
      title: 'Elevated Risk: Bridge Infrastructure',
      description: 'Multiple sensors across Highway Bridge #3 are detecting unusual stress patterns. While all readings remain within safety margins, the AI model indicates a 34% increase in stress variance compared to baseline. The pattern suggests potential structural fatigue that may require expedited assessment.',
      confidence: 88,
      priority: 'critical',
      recommendations: [
        'Expedite structural assessment within 48 hours',
        'Implement temporary load restrictions',
        'Increase sensor monitoring frequency'
      ],
      affectedAssets: ['Bridges: Highway Bridge #3', 'Traffic: Moderate impact'],
      timestamp: '32 min ago'
    },
    {
      id: 3,
      type: 'optimization',
      title: 'Street Light Maintenance Optimization',
      description: 'Analysis of street light failure patterns reveals that 68% of failures occur within 30 days of scheduled maintenance windows. The AI model suggests that adjusting maintenance schedules by 15 days earlier could reduce unexpected failures by 34% and improve overall system reliability.',
      confidence: 85,
      priority: 'medium',
      recommendations: [
        'Adjust maintenance schedule by 15 days earlier',
        'Prioritize high-traffic areas',
        'Implement predictive maintenance alerts'
      ],
      affectedAssets: ['Street Lights: 3421 units', 'Maintenance efficiency: High impact'],
      timestamp: '1 hour ago'
    },
    {
      id: 4,
      type: 'anomaly',
      title: 'Unusual Water Pressure Pattern',
      description: 'The AI system has detected an anomalous water pressure pattern in the Downtown District that deviates from historical norms. While not immediately critical, the pattern suggests potential infrastructure aging or system inefficiency that warrants investigation.',
      confidence: 76,
      priority: 'medium',
      recommendations: [
        'Conduct detailed system inspection',
        'Review recent maintenance records',
        'Monitor pressure trends over next 48 hours'
      ],
      affectedAssets: ['Water Systems: Downtown District', 'Service quality: Low impact'],
      timestamp: '2 hours ago'
    }
  ]

  const modelPerformance = {
    accuracy: 94.2,
    precision: 91.8,
    recall: 93.5,
    falsePositiveRate: 2.3,
    totalAnalyses: 1247,
    lastTraining: '3 days ago'
  }

  return (
    <div className="ai-analysis">
      <div className="page-header">
        <h1 className="page-title">AI Analysis</h1>
        <p className="page-subtitle">Advanced AI insights and pattern recognition</p>
      </div>

      <div className="view-selector">
        <button
          className={`view-tab ${selectedView === 'insights' ? 'active' : ''}`}
          onClick={() => setSelectedView('insights')}
        >
          AI Insights
        </button>
        <button
          className={`view-tab ${selectedView === 'performance' ? 'active' : ''}`}
          onClick={() => setSelectedView('performance')}
        >
          Model Performance
        </button>
        <button
          className={`view-tab ${selectedView === 'history' ? 'active' : ''}`}
          onClick={() => setSelectedView('history')}
        >
          Analysis History
        </button>
      </div>

      {selectedView === 'insights' && (
        <div className="insights-container">
          {aiInsights.map((insight) => (
            <AIInsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}

      {selectedView === 'performance' && (
        <div className="performance-container">
          <div className="performance-card">
            <h2 className="card-section-title">Model Performance Metrics</h2>
            <div className="metrics-grid">
              <MetricCard label="Accuracy" value={`${modelPerformance.accuracy}%`} color="var(--accent-green)" />
              <MetricCard label="Precision" value={`${modelPerformance.precision}%`} color="var(--accent-green)" />
              <MetricCard label="Recall" value={`${modelPerformance.recall}%`} color="var(--accent-green)" />
              <MetricCard label="False Positive Rate" value={`${modelPerformance.falsePositiveRate}%`} color="var(--accent-amber)" />
            </div>
            <div className="performance-stats">
              <div className="stat-item">
                <span className="stat-label">Total Analyses:</span>
                <span className="stat-value">{modelPerformance.totalAnalyses.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Last Model Training:</span>
                <span className="stat-value">{modelPerformance.lastTraining}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'history' && (
        <div className="history-container">
          <div className="history-card">
            <h2 className="card-section-title">Recent Analysis History</h2>
            <div className="history-list">
              {aiInsights.map((insight) => (
                <div key={insight.id} className="history-item">
                  <div className="history-item-header">
                    <span className="history-type">{insight.type}</span>
                    <span className="history-time">{insight.timestamp}</span>
                  </div>
                  <div className="history-title">{insight.title}</div>
                  <div className="history-confidence">Confidence: {insight.confidence}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const AIInsightCard = ({ insight }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'pattern':
        return 'var(--accent-green)'
      case 'risk':
        return 'var(--accent-red)'
      case 'optimization':
        return 'var(--accent-amber)'
      case 'anomaly':
        return 'var(--accent-amber)'
      default:
        return 'var(--text-secondary)'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'var(--accent-red)'
      case 'high':
        return 'var(--accent-amber)'
      case 'medium':
        return 'var(--accent-green)'
      default:
        return 'var(--text-secondary)'
    }
  }

  return (
    <div className="ai-insight-card">
      <div className="insight-card-header">
        <div className="insight-type-badge" style={{ backgroundColor: `${getTypeColor(insight.type)}20`, color: getTypeColor(insight.type) }}>
          {insight.type}
        </div>
        <div className="insight-meta">
          <span className="insight-confidence-badge">{insight.confidence}% confidence</span>
          <span className="insight-priority-badge" style={{ backgroundColor: `${getPriorityColor(insight.priority)}20`, color: getPriorityColor(insight.priority) }}>
            {insight.priority}
          </span>
        </div>
      </div>
      <h3 className="insight-card-title">{insight.title}</h3>
      <p className="insight-card-description">{insight.description}</p>
      <div className="insight-details">
        <div className="insight-section">
          <h4 className="insight-section-title">Recommendations</h4>
          <ul className="insight-list">
            {insight.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
        <div className="insight-section">
          <h4 className="insight-section-title">Affected Assets</h4>
          <ul className="insight-list">
            {insight.affectedAssets.map((asset, index) => (
              <li key={index}>{asset}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="insight-footer">
        <span className="insight-timestamp">Analyzed {insight.timestamp}</span>
        <div className="insight-actions">
          <button className="insight-action-btn">Export Report</button>
          <button className="insight-action-btn secondary">Dismiss</button>
        </div>
      </div>
    </div>
  )
}

const MetricCard = ({ label, value, color }) => {
  return (
    <div className="metric-card">
      <div className="metric-value" style={{ color }}>{value}</div>
      <div className="metric-label">{label}</div>
    </div>
  )
}

export default AIAnalysis































