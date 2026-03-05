import React from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts'
import './IssueDonutChart.css'

const IssueDonutChart = ({ data = { high: 0, medium: 0, low: 0 } }) => {
  // Ensure data exists and has the required properties
  const safeData = {
    high: data?.high || 0,
    medium: data?.medium || 0,
    low: data?.low || 0
  }

  const total = safeData.high + safeData.medium + safeData.low

  const chartData = [
    { name: 'High', value: safeData.high, color: 'var(--accent-red)' },
    { name: 'Medium', value: safeData.medium, color: 'var(--accent-amber)' },
    { name: 'Low', value: safeData.low, color: 'var(--accent-green)' }
  ]

  if (total === 0) {
    return null
  }

  return (
    <div className="severity-donut-card">
      <div className="donut-chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={60}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                backdropFilter: 'blur(8px)'
              }}
              itemStyle={{ color: '#E5E7EB' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-center-label">
          <div className="label-text" style={{ color: 'var(--text-secondary)' }}>Total Active</div>
          <div className="label-value" style={{ color: 'var(--text-primary)' }}>{total}</div>
        </div>
      </div>
      <div className="donut-legend">
        {chartData.map((s, i) => (
          <div key={i} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: s.color }}></span>
            <span className="legend-label" style={{ color: 'var(--text-secondary)' }}>{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IssueDonutChart
