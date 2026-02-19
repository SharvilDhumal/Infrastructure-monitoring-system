import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const ResolutionChart = ({ counts, loading = false }) => {
    if (loading) {
        return (
            <div className="resolution-chart-card loading">
                <div style={{ height: '24px', width: '200px', background: '#f1f5f9', marginBottom: '32px' }} />
                <div style={{ height: '250px', width: '100%', background: '#f8fafc', borderRadius: '50%' }} />
            </div>
        );
    }

    const data = [
        { name: 'Pending', value: counts?.pendingCount || 0, color: '#f59e0b' },
        { name: 'Approved', value: counts?.approvedCount || 0, color: '#002147' },
        { name: 'Rejected', value: counts?.rejectedCount || 0, color: '#dc3545' },
        { name: 'Resolved', value: counts?.resolvedCount || 0, color: '#28a745' },
    ].filter(item => item.value > 0);

    return (
        <div
            className="resolution-chart-card"
            style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                padding: '32px',
                height: '400px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                position: 'relative'
            }}
        >
            <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#0f172a',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <span style={{ width: '4px', height: '20px', background: '#002147', borderRadius: '2px' }}></span>
                Resolution Analysis
            </h3>

            <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="#ffffff"
                        strokeWidth={2}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '4px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        iconType="circle"
                        formatter={(value) => <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'capitalize' }}>{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>

            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: '#002147',
                opacity: 0.8
            }} />
        </div>
    );
};

export default ResolutionChart;

