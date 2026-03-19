import React from 'react'

const KPICard = ({ type, title, value, subtext }) => {
    // Elegant color themes based on type
    const styles = type === 'resolved' 
      ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
      : 'bg-indigo-50 border-indigo-100 text-indigo-600';

    return (
        <div className={`p-6 md:p-8 rounded-[2rem] border ${styles} flex flex-col justify-center transition-transform hover:scale-[1.02] relative overflow-hidden h-full min-h-[140px]`}>
            {/* Decorative background circle */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-20 bg-current blur-2xl pointer-events-none" />
            
            <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-80 mb-2 relative z-10">{title}</h4>
            <div className="text-4xl lg:text-5xl font-black leading-none mb-2 relative z-10">{value}</div>
            {subtext && <div className="text-[11px] font-bold opacity-75 relative z-10">{subtext}</div>}
        </div>
    )
}

export default KPICard
