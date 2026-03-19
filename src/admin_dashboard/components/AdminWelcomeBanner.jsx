import React from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

const AdminWelcomeBanner = ({ userName = "Admin Officer", alertCount = 0 }) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 rounded-[2.5rem] p-8 md:p-10 text-white shadow-xl shadow-indigo-500/20 mb-8 border border-white/10">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-10 w-40 h-40 bg-blue-400/20 blur-2xl rounded-full translate-y-1/2" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 text-white">
                        Welcome back, <span className="text-blue-200">{userName}</span>
                    </h1>
                    <p className="text-indigo-100 font-bold text-sm md:text-base opacity-90 uppercase tracking-widest mt-4">
                        System Operational Overview • {currentDate}
                    </p>
                </div>
                
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-2 pl-4 pr-6 rounded-2xl">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner bg-white/20">
                        {alertCount === 0 ? <CheckCircle2 className="text-emerald-300" size={24} /> : <ShieldAlert className="text-rose-300" size={24} />}
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-0.5">Global Status</p>
                        <p className="text-sm font-black text-white">
                            {alertCount === 0 ? 'SYSTEM HEALTHY' : `${alertCount} CRITICAL ALERT${alertCount > 1 ? 'S' : ''}`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminWelcomeBanner;
