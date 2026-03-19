import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'

const IssueDonutChart = ({ data = { high: 0, medium: 0, low: 0 } }) => {
  const safeData = {
    high: data?.high || 0,
    medium: data?.medium || 0,
    low: data?.low || 0
  }

  const total = safeData.high + safeData.medium + safeData.low
  const chartData = [
    { name: 'High', value: safeData.high, color: '#e11d48' }, // rose-600
    { name: 'Medium', value: safeData.medium, color: '#f59e0b' }, // amber-500
    { name: 'Low', value: safeData.low, color: '#10b981' } // emerald-500
  ].filter(d => d.value > 0);

  if (total === 0) {
    return <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-sm italic min-h-[160px]">No active issues detected.</div>
  }

  return (
    <div className="w-full h-full flex flex-col pt-4 min-h-[220px]">
      <div className="relative flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={6}
              dataKey="value"
              stroke="none"
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
                content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                        return (
                            <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-2 px-3 rounded-xl shadow-lg">
                                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{payload[0].name}</p>
                                <p className="text-sm font-black text-slate-900">{payload[0].value}</p>
                            </div>
                        );
                    }
                    return null;
                }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black text-slate-900 leading-none">{total}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Active</span>
        </div>
      </div>
      <div className="flex justify-center gap-6 mt-6 pb-2">
        {chartData.map((s, i) => (
          <div key={i} className="flex items-center gap-2 transition-transform hover:scale-110">
            <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: s.color }}></span>
            <span className="text-xs font-black text-slate-600 uppercase tracking-wider">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IssueDonutChart
