import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BrainCircuit, Zap, ChevronRight, TrendingUp } from 'lucide-react';

const AIInsightsCard = ({ loading = false }) => {
    const insights = [
        {
            id: 1,
            type: 'prediction',
            message: 'Highway Bridge #3 showing unusual vibration patterns. Maintenance suggested within 48h.',
            priority: 'high',
            icon: TrendingUp
        },
        {
            id: 2,
            type: 'optimization',
            message: 'Network load balanced across Sector 7 lighting nodes. Efficiency increased by 12%.',
            priority: 'medium',
            icon: Zap
        }
    ];

    return (
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_40px_rgba(34,211,238,0.1)] relative overflow-hidden group h-full">
            {/* Background Brain Animation Shell */}
            <div className="absolute -right-8 -top-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <BrainCircuit size={160} className="text-cyan-400" />
            </div>

            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 flex items-center justify-center border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.3)] relative">
                    <Sparkles size={24} className="text-cyan-400" />
                    {loading && (
                        <motion.div
                            className="absolute inset-0 rounded-2xl border-2 border-cyan-400"
                            animate={{ opacity: [0, 1, 0], scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">Neural <span className="text-cyan-400">Intelligence</span></h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-[.3em] font-black">Co-Processor Active</p>
                </div>
            </div>

            <div className="space-y-5">
                {loading ? (
                    <>
                        {[1, 2].map((i) => (
                            <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-3 relative overflow-hidden">
                                <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
                                <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse" />
                                <div className="flex gap-2">
                                    <div className="h-4 w-12 bg-white/5 rounded-full animate-pulse" />
                                    <div className="h-4 w-24 bg-white/5 rounded-full animate-pulse" />
                                </div>
                                <motion.div
                                    className="absolute inset-y-0 left-0 w-1 bg-cyan-400"
                                    animate={{ y: [-50, 150] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                        ))}
                    </>
                ) : (
                    insights.map((insight, index) => (
                        <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className={`p-5 rounded-2xl border ${insight.priority === 'high'
                                ? 'bg-rose-500/5 border-rose-500/20'
                                : 'bg-white/5 border-white/10 shadow-lg'
                                } relative overflow-hidden group/item cursor-pointer hover:bg-white/10 transition-colors border-l-4 ${insight.priority === 'high' ? 'border-l-rose-500' : 'border-l-indigo-500'}`}
                        >
                            <div className="flex gap-4">
                                <div className={`mt-0.5 p-2 rounded-lg bg-white/5 ${insight.priority === 'high' ? 'text-rose-400' : 'text-indigo-400'}`}>
                                    <insight.icon size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-200 leading-relaxed font-medium">
                                        {insight.message}
                                    </p>
                                    <div className="flex items-center gap-3 mt-4">
                                        <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-tighter ${insight.priority === 'high' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'
                                            }`}>
                                            {insight.type}
                                        </span>
                                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">v4.1 Neural Node</span>
                                    </div>
                                </div>
                                <div className="self-center">
                                    <ChevronRight size={18} className="text-gray-600 group-hover/item:text-cyan-400 transition-colors" />
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <button className="w-full mt-8 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-gray-500 hover:text-white hover:bg-white/10 transition-all uppercase tracking-[0.2em] relative overflow-hidden group">
                <span className="relative z-10 flex items-center justify-center gap-2">
                    Open Cognitive Report <ChevronRight size={14} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
        </div>
    );
};

export default AIInsightsCard;
