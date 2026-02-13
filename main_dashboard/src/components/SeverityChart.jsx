import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Legend, CartesianGrid } from 'recharts';

const SeverityChart = ({ data, loading = false }) => {
    if (loading) {
        return (
            <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[400px] shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                <div className="h-6 w-48 skeleton mb-10" />
                <div className="h-64 h-full skeleton rounded-2xl" />
            </div>
        );
    }

    // Transformation logic if data is from aggregation _id/count
    const formattedData = data?.map(item => ({
        name: item._id,
        count: item.count
    })) || [];

    const COLORS = {
        High: '#F43F5E',
        Medium: '#f59e0b',
        Low: '#10B981'
    };

    return (
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.3)] h-[400px] relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>

            <h3 className="text-xl font-black text-white mb-6 tracking-tighter uppercase italic flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse"></span>
                Severity <span className="text-cyan-400">Spectrum</span>
            </h3>

            <ResponsiveContainer width="100%" height="85%">
                <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#FFFFFF"
                        fontSize={10}
                        fontWeight="900"
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                        tickFormatter={(val) => val.toUpperCase()}
                    />
                    <YAxis
                        stroke="#9CA3AF"
                        fontSize={10}
                        fontWeight="bold"
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
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
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={45}>
                        {formattedData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[entry.name] || '#6366F1'}
                                className="transition-all duration-300 hover:opacity-80"
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SeverityChart;

