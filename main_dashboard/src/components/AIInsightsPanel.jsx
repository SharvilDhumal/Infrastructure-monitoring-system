import React from 'react'
import './AIInsightsPanel.css'

const AIInsightsPanel = () => {
  const insights = [
    {
      id: 2,
      type: 'risk',
      title: 'Elevated Risk: Bridge Infrastructure',
      description: 'Multiple sensors detecting unusual stress patterns on Highway Bridge #3. While within safety margins, AI recommends expedited structural assessment within 48 hours to prevent potential escalation.',
      confidence: 88,
      priority: 'critical',
      timestamp: '32 min ago'
    },
    {
      id: 3,
      type: 'optimization',
      title: 'Street Light Maintenance Optimization',
      description: 'Analysis of street light failure patterns suggests optimal maintenance window would reduce service disruptions by 34%. Current failure rate is 2.3% above predicted baseline.',
      confidence: 85,
      priority: 'medium',
      timestamp: '1 hour ago'
    }
  ]

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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'pattern':
        return '📊'
      case 'risk':
        return '⚠️'
      case 'optimization':
        return '⚡'
      default:
        return '💡'
    }
  }

  return (
    <div className="ai-insights-card">
      <div className="card-header">
        <div className="card-header-left">
          <span className="ai-icon">🤖</span>
          <h2 className="card-title">AI Insights</h2>
        </div>
        <span className="ai-status-badge">Active Analysis</span>
      </div>
      <div className="insights-list">
        {insights.map((insight) => (
          <InsightItem
            key={insight.id}
            insight={insight}
            getPriorityColor={getPriorityColor}
            getTypeIcon={getTypeIcon}
          />
        ))}
      </div>
    </div>
  )
}

const InsightItem = ({ insight, getPriorityColor, getTypeIcon }) => {
  const priorityColor = getPriorityColor(insight.priority)
  const typeIcon = getTypeIcon(insight.type)

  return (
    <div className="insight-item">
      <div className="insight-header">
        <div className="insight-type-icon">{typeIcon}</div>
        <div className="insight-header-content">
          <h3 className="insight-title">{insight.title}</h3>
          <div className="insight-meta">
            <span
              className="insight-priority"
              style={{
                backgroundColor: `${priorityColor}15`,
                color: priorityColor
              }}
            >
              {insight.priority}
            </span>
            <span className="insight-confidence">{insight.confidence}% confidence</span>
            <span className="insight-time">{insight.timestamp}</span>
          </div>
        </div>
      </div>
      <p className="insight-description">{insight.description}</p>
      <div className="insight-actions">
        <button className="insight-action-btn">View Analysis</button>
        <button className="insight-action-btn secondary">Dismiss</button>
      </div>
    </div>
  )
}

export default AIInsightsPanel































