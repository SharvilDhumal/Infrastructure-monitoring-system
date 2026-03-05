import React from 'react'
import './KPICard.css'

const KPICard = ({ type, title, value, subtext }) => {
    return (
        <div className={`kpi-card ${type}`}>
            <div className="kpi-content">
                <h4 className="kpi-title">{title}</h4>
                <div className="kpi-value">{value}</div>
                {subtext && <div className="kpi-subtext">{subtext}</div>}
            </div>
        </div>
    )
}

export default KPICard
