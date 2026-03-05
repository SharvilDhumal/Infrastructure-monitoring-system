import React from 'react'
import './InfrastructureBarChart.css'

const InfrastructureBarChart = ({ data = [] }) => {
    // data should be array of { asset, issues, resolved, health }
    const maxIssues = Math.max(...data.map(d => d.issues || 0), 1)

    return (
        <div className="infrastructure-bar-content">
            <h3 className="card-section-title">Issues by Infrastructure Type</h3>
            <div className="bar-list">
                {data.map((item, index) => (
                    <div key={index} className="bar-row">
                        <div className="bar-label">{item.asset}</div>
                        <div className="bar-track">
                            <div
                                className="bar-fill"
                                style={{
                                    width: `${((item.issues || 0) / maxIssues) * 100}%`,
                                    backgroundColor: 'var(--accent-indigo, #6366f1)'
                                }}
                            />
                        </div>
                        <div className="bar-value-text">{item.issues || 0}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default InfrastructureBarChart
