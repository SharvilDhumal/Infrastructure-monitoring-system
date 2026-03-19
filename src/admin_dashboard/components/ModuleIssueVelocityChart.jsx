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
        <div className="w-full h-full min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    barGap={12}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
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
                        domain={[0, 'auto']}
                        allowDecimals={false}
                    />
                    <Tooltip
                        cursor={{ fill: '#f8fafc', radius: 12 }}
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-3 rounded-2xl shadow-xl">
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{label}</p>
                                        <p className="text-sm font-black text-slate-900">{payload[0].value} <span className="text-slate-400">Issues</span></p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar
                        dataKey="value"
                        fill="url(#barGradient)"
                        radius={[10, 10, 4, 4]}
                        barSize={32}
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationEasing="ease-out"
                    >
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#6366f1" />
                            </linearGradient>
                        </defs>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ModuleIssueVelocityChart;
