import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Legend, CartesianGrid } from 'recharts';

const SeverityChart = ({ data, loading = false }) => {
    if (loading) {
        return (
            <div className="severity-chart-card loading">
                <div style={{ height: '24px', width: '200px', background: '#f1f5f9', marginBottom: '32px' }} />
                <div style={{ height: '250px', width: '100%', background: '#f8fafc' }} />
            </div>
        );
    }

    const formattedData = data?.map(item => ({
        name: item._id,
        count: item.count
    })) || [];

    const COLORS = {
        High: '#dc3545',
        Medium: '#f59e0b',
        Low: '#28a745'
    };

    return (
        <div
            className="severity-chart-card"
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
                Issue Severity Spectrum
            </h3>

            <ResponsiveContainer width="100%" height="80%">
                <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#64748b"
                        fontSize={12}
                        fontWeight="600"
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        fontWeight="600"
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '4px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                        {formattedData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[entry.name] || '#002147'}
                            />
                        ))}
                    </Bar>
                </BarChart>
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

export default SeverityChart;

