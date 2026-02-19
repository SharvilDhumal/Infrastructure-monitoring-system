import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const ResolutionChart = ({ stats }) => {
  const resolved = stats?.resolved || 0;
  const approved = stats?.approved || 0;
  const pending = stats?.pending || 0;
  const rejected = stats?.rejected || 0;

  const data = [
    { name: 'Resolved', value: resolved, color: '#3b82f6' },
    { name: 'Unresolved', value: (approved + pending + rejected), color: '#1e293b' },
  ];

  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const percentage = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden group">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Resolution Overview</h3>
        <div className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold border border-blue-500/20">
          LIVE STATUS
        </div>
      </div>

      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              cornerRadius={10}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} className="transition-all duration-300 hover:opacity-80 cursor-pointer" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-bold text-white">{percentage}%</span>
          <span className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-1">Resolved</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-gray-400 text-sm font-medium">{item.name}</span>
            </div>
            <span className="text-white text-sm font-bold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResolutionChart;
