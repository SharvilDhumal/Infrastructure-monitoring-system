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

const IssueTrendChart = ({ issues = [], period = '7d', externalData = null }) => {
    // Generate data based on real issues
    const data = useMemo(() => {
        if (externalData && externalData.length > 0) {
            return externalData.map(item => ({
                name: item.date,
                detected: item.count,
                resolved: Math.floor(item.count * 0.8) // Mock resolved for now
            }));
        }

        const now = new Date();
        const result = [];

        if (period === '7d') {
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(now.getDate() - i);
                const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short' });
                const dayIssues = issues.filter(issue => {
                    const issueDate = new Date(issue.timestamp);
                    return issueDate.toDateString() === d.toDateString();
                });
                result.push({
                    name: dayLabel,
                    detected: dayIssues.length,
                    resolved: dayIssues.filter(i => i.status?.toLowerCase() === 'fixed' || i.status?.toLowerCase() === 'resolved').length
                });
            }
        } else if (period === '30d') {
            for (let i = 3; i >= 0; i--) {
                const weekLabel = `W${4 - i}`;
                const start = new Date();
                start.setDate(now.getDate() - (i + 1) * 7);
                const end = new Date();
                end.setDate(now.getDate() - i * 7);
                const weekIssues = issues.filter(issue => {
                    const issueDate = new Date(issue.timestamp);
                    return issueDate >= start && issueDate < end;
                });
                result.push({
                    name: weekLabel,
                    detected: weekIssues.length,
                    resolved: weekIssues.filter(i => i.status?.toLowerCase() === 'fixed' || i.status?.toLowerCase() === 'resolved').length
                });
            }
        } else {
            for (let i = 11; i >= 0; i--) {
                const d = new Date();
                d.setMonth(now.getMonth() - i);
                const monthLabel = d.toLocaleDateString(undefined, { month: 'short' });
                const monthIssues = issues.filter(issue => {
                    const issueDate = new Date(issue.timestamp);
                    return issueDate.getMonth() === d.getMonth() && issueDate.getFullYear() === d.getFullYear();
                });
                result.push({
                    name: monthLabel,
                    detected: monthIssues.length,
                    resolved: monthIssues.filter(i => i.status?.toLowerCase() === 'fixed' || i.status?.toLowerCase() === 'resolved').length
                });
            }
        }
        return result;
    }, [issues, period, externalData]);

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
