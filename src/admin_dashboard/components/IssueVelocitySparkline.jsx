import React from 'react'
import './IssueVelocitySparkline.css'

const IssueVelocitySparkline = () => {
  // Mock data for last 7 days
  const data = [
    { day: 'Mon', detected: 8, resolved: 6 },
    { day: 'Tue', detected: 12, resolved: 9 },
    { day: 'Wed', detected: 10, resolved: 11 },
    { day: 'Thu', detected: 15, resolved: 10 },
    { day: 'Fri', detected: 9, resolved: 12 },
    { day: 'Sat', detected: 6, resolved: 7 },
    { day: 'Sun', detected: 4, resolved: 5 }
  ]

  const maxValue = Math.max(
    ...data.flatMap(d => [d.detected, d.resolved])
  )

  const normalize = (value) => (value / maxValue) * 100

  // Generate SVG path for detected line
  const detectedPath = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100
      const y = 100 - normalize(d.detected)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  // Generate SVG path for resolved line
  const resolvedPath = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100
      const y = 100 - normalize(d.resolved)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  const todayDetected = data[data.length - 1].detected
  const todayResolved = data[data.length - 1].resolved
  const trend = todayDetected - todayResolved

  return (
    <div className="issue-velocity-container">
      <div className="velocity-header">
        <div className="velocity-title">Issue Velocity</div>
        <div className={`velocity-trend ${trend > 0 ? 'negative' : 'positive'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}
        </div>
      </div>
      <div className="velocity-sparkline">
        <svg viewBox="0 0 100 60" className="sparkline-svg">
          <defs>
            <linearGradient id="detectedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-red)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--accent-red)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="resolvedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Detected area */}
          <path
            d={`${detectedPath} L 100 100 L 0 100 Z`}
            fill="url(#detectedGradient)"
            className="sparkline-area detected"
          />
          {/* Resolved area */}
          <path
            d={`${resolvedPath} L 100 100 L 0 100 Z`}
            fill="url(#resolvedGradient)"
            className="sparkline-area resolved"
          />
          {/* Detected line */}
          <path
            d={detectedPath}
            fill="none"
            stroke="var(--accent-red)"
            strokeWidth="1.5"
            className="sparkline-line detected"
          />
          {/* Resolved line */}
          <path
            d={resolvedPath}
            fill="none"
            stroke="var(--accent-green)"
            strokeWidth="1.5"
            className="sparkline-line resolved"
          />
        </svg>
      </div>
      <div className="velocity-legend">
        <div className="velocity-legend-item">
          <div className="legend-dot detected" />
          <span>Detected</span>
        </div>
        <div className="velocity-legend-item">
          <div className="legend-dot resolved" />
          <span>Resolved</span>
        </div>
      </div>
    </div>
  )
}

export default IssueVelocitySparkline





























