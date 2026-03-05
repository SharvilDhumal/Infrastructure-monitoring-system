import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { calculateSeverityBreakdownByModule } from '../services/issuesService';
import './IssueDonutChart.css'; // Reusing or extending the existing CSS

const SeverityDistributionChart = ({ issues }) => {
    const [selectedModule, setSelectedModule] = useState('Roads');

    const modules = ['Roads', 'Bridges', 'Water', 'Street Lights'];

    const data = useMemo(() => {
        return calculateSeverityBreakdownByModule(issues, selectedModule);
    }, [issues, selectedModule]);

    const totalIssues = useMemo(() => {
        return data.reduce((acc, curr) => acc + curr.value, 0);
    }, [data]);

    return (
        <div className="donut-card">
            <div className="donut-header">
                <h3>Severity Distribution</h3>
                <select
                    className="module-dropdown"
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                >
                    {modules.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>

            <div className="donut-container" style={{ position: 'relative', height: '240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={65}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            animationBegin={0}
                            animationDuration={800}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name, props) => [`${value} issues (${props.payload.percentage}%)`, name]}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="donut-center-text">
                    <span className="center-count">{totalIssues}</span>
                    <span className="center-label">Total</span>
                </div>
            </div>

            <div className="donut-legend">
                {data.map((entry) => (
                    <div key={entry.name} className="legend-item">
                        <span className="legend-dot" style={{ backgroundColor: entry.color }}></span>
                        <span className="legend-name">{entry.name}</span>
                        <span className="legend-value">{entry.percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeverityDistributionChart;
