import React, { useState, useEffect } from "react";
import { motion, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

const AnimatedNumber = ({ value }) => {
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span>{display}</motion.span>;
};

const StatCard = ({ title, value, unit, icon: Icon, trend, color = "indigo", isCritical = false }) => {
    const colorMap = {
        indigo: "from-indigo-600 to-indigo-400 text-indigo-400 shadow-indigo-500/20",
        cyan: "from-cyan-500 to-cyan-300 text-cyan-400 shadow-cyan-500/20",
        rose: "from-rose-600 to-rose-400 text-rose-400 shadow-rose-500/20",
        emerald: "from-emerald-500 to-emerald-300 text-emerald-400 shadow-emerald-500/20",
        amber: "from-amber-500 to-amber-300 text-amber-400 shadow-amber-500/20",
    };

    const selectedColor = colorMap[color] || colorMap.indigo;
    const gradientClasses = selectedColor.split(' ').slice(0, 2).join(' ');
    const textClasses = selectedColor.split(' ')[2];

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className={`relative group bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl transition-all duration-300
                 ${isCritical ? 'pulse-critical ring-1 ring-rose-500/50' : 'hover:border-white/20'}`}
        >
            {/* Background Glow */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${gradientClasses} opacity-5 blur-3xl group-hover:opacity-10 transition-opacity`} />

            <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${gradientClasses}/10 border border-white/10 shadow-lg`}>
                    {Icon && <Icon size={24} className={textClasses} />}
                </div>

                {trend && (
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border
                          ${trend > 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                        {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">
                    {title}
                </h3>

                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-white tracking-tighter">
                        <AnimatedNumber value={value} />
                    </span>
                    {unit && <span className="text-sm font-bold text-gray-500">{unit}</span>}
                </div>
            </div>

            {/* Decorative pulse line */}
            <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full w-full bg-gradient-to-r ${gradientClasses} shadow-[0_0_10px_rgba(99,102,241,0.5)]`}
                />
            </div>

            <AnimatePresence>
                {isCritical && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-2 right-2"
                    >
                        <Activity size={14} className="text-rose-500 animate-pulse" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default StatCard;

