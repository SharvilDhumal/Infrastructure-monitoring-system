import React, { useMemo } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

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
        <div className="w-full h-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                        allowDecimals={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '16px',
                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                            backdropFilter: 'blur(8px)'
                        }}
                        itemStyle={{ fontSize: 12, fontWeight: 800 }}
                        labelStyle={{ fontSize: 10, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}
                    />
                    <Legend verticalAlign="top" align="right" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: '800', color: '#64748b' }} />
                    <Line
                        type="monotone"
                        dataKey="detected"
                        name="Detected"
                        stroke="#3b82f6"
                        strokeWidth={4}
                        dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="resolved"
                        name="Resolved"
                        stroke="#10b981"
                        strokeWidth={4}
                        dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
export default IssueTrendChart;
