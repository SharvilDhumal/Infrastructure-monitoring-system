import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import './ModuleIssueVelocityChart.css';

const ModuleIssueVelocityChart = ({ data = [] }) => {
    return (
        <div className="velocity-chart-card">
            <div className="velocity-chart-header">
                <h2 className="velocity-chart-title">Issue Velocity – Module-wise</h2>
            </div>
            <div className="velocity-chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                        barGap={8}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                            domain={[0, 'auto']}
                            allowDecimals={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(0, 31, 63, 0.05)' }}
                            contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                fontFamily: 'Inter, sans-serif'
                            }}
                        />
                        <Bar
                            dataKey="value"
                            fill="#001f3f"
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                            isAnimationActive={true}
                            animationDuration={1500}
                            animationEasing="ease-out"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ModuleIssueVelocityChart;
