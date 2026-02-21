import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const ResolutionChart = ({ stats }) => {
  const resolved = stats?.resolved || 0;
  const approved = stats?.approved || 0;
  const pending = stats?.pending || 0;
  const rejected = stats?.rejected || 0;

  const data = [
    { name: 'Resolved', value: resolved, color: '#002147' },
    { name: 'Unresolved', value: (approved + pending + rejected), color: '#e5e7eb' },
  ];

  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const percentage = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return (
    <div className="bg-white border border-gray-200 rounded p-8 relative overflow-hidden shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-[#002147] tracking-tight">Resolution Overview</h3>
        <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-200">
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
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px', color: '#111827' }}
              itemStyle={{ color: '#111827', fontWeight: 600 }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-bold text-[#002147]">{percentage}%</span>
          <span className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Resolved</span>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-gray-700 text-base font-medium">{item.name}</span>
            </div>
            <span className="text-[#002147] text-lg font-bold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResolutionChart;
