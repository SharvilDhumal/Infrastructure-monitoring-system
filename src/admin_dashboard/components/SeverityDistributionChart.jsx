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
        <div className="flex flex-col h-full w-full space-y-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Module Filter</span>
                <select
                    className="text-[11px] font-black bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 outline-none text-slate-600 hover:border-blue-500 transition-colors cursor-pointer capitalize"
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                >
                    {modules.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>

            <div className="relative flex-1 min-h-[180px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                            animationBegin={0}
                            animationDuration={1200}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-3 rounded-2xl shadow-xl">
                                            <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{payload[0].name}</p>
                                            <p className="text-sm font-black text-slate-900">{payload[0].value} <span className="text-slate-400">({payload[0].payload.percentage}%)</span></p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-slate-900 leading-none">{totalIssues}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Total</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
                {data.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2 group transition-opacity hover:opacity-100">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">{entry.name}</span>
                            <span className="text-[11px] font-black text-slate-900 leading-none">{entry.percentage}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeverityDistributionChart;
