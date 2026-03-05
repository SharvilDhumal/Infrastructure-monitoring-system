import React, { useMemo } from 'react'
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts'
import './IssueTrendChart.css'

const IssueTrendChart = ({ period = '7d' }) => {
    // Generate dummy data based on period
    const data = useMemo(() => {
        const points = period === '7d' ? 7 : period === '30d' ? 10 : 12;
        const labels = period === '7d' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
            period === '30d' ? ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'] :
                ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return labels.map(label => ({
            name: label,
            detected: Math.floor(Math.random() * 50) + 20,
            resolved: Math.floor(Math.random() * 40) + 15
        }));
    }, [period]);

    return (
        <div className="trend-chart-card">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1E293B',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(8px)'
                        }}
                        itemStyle={{ fontSize: 13, fontWeight: 600, color: '#E5E7EB' }}
                    />
                    <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                    <Line
                        type="monotone"
                        dataKey="detected"
                        name="Issues Detected"
                        stroke="var(--accent-indigo)"
                        strokeWidth={3}
                        dot={{ r: 4, fill: 'var(--accent-indigo)', strokeWidth: 2 }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--accent-indigo)' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="resolved"
                        name="Issues Resolved"
                        stroke="var(--accent-cyan)"
                        strokeWidth={3}
                        dot={{ r: 4, fill: 'var(--accent-cyan)', strokeWidth: 2 }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--accent-cyan)' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default IssueTrendChart
