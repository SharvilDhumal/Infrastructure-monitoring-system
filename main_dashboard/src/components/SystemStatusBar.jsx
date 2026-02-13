import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, RefreshCw, Cpu, ShieldCheck } from 'lucide-react';

const SystemStatusBar = () => {
    const [syncTime, setSyncTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => {
            setSyncTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full bg-white/5 backdrop-blur-md border-b border-white/5 px-6 py-2 flex items-center justify-between z-50">
            <div className="flex items-center gap-6">
                {/* System Health */}
                <div className="flex items-center gap-2">
                    <Activity size={14} className="text-emerald-400" />
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">System Health:</span>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase">Optimal</span>
                    <div className="flex gap-1">
                        {[1, 2, 3].map(i => (
                            <motion.div
                                key={i}
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                className="h-1 w-1 rounded-full bg-emerald-400"
                            />
                        ))}
                    </div>
                </div>

                {/* AI Processing Status */}
                <div className="flex items-center gap-2">
                    <Cpu size={14} className="text-indigo-400" />
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Neural Engine:</span>
                    <span className="text-[11px] font-bold text-indigo-400 uppercase">Active</span>
                </div>

                <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-cyan-400" />
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Sentinel:</span>
                    <span className="text-[11px] font-bold text-cyan-400 uppercase">Armed</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <RefreshCw size={12} className="text-gray-500 animate-spin-slow" />
                    <span className="text-[10px] font-mono text-gray-500 tracking-tight">Last Sync: {syncTime}</span>
                </div>
                <div className="h-4 w-[1px] bg-white/10" />
                <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Live</span>
                </div>
            </div>
        </div>
    );
};

export default SystemStatusBar;
