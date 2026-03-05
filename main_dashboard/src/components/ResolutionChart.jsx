import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const ResolutionChart = ({ counts, loading = false }) => {
    if (loading) {
        return (
            <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[400px] shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                <div className="h-6 w-48 skeleton mb-10" />
                <div className="flex items-center justify-center h-64">
                    <div className="w-48 h-48 rounded-full skeleton" />
                </div>
            </div>
        );
    }

    const data = [
        { name: 'Pending', value: counts?.pendingCount || 0, color: '#f59e0b' },
        { name: 'Approved', value: counts?.approvedCount || 0, color: '#6366F1' },
        { name: 'Rejected', value: counts?.rejectedCount || 0, color: '#F43F5E' },
        { name: 'Resolved', value: counts?.resolvedCount || 0, color: '#10B981' },
    ].filter(item => item.value > 0);

    return (
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.3)] h-[400px] relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

            <h3 className="text-xl font-black text-white mb-6 tracking-tighter uppercase italic flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse"></span>
                Resolution <span className="text-indigo-400">Analysis</span>
            </h3>

            <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                className="transition-all duration-300 hover:opacity-80"
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0F172A',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            color: '#FFFFFF',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                        }}
                        itemStyle={{ color: '#F3F4F6', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        formatter={(value) => <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ResolutionChart;

