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
        indigo: { text: "#002147", bg: "#f0f4f8", accent: "#002147" },
        cyan: { text: "#004d40", bg: "#e6fffa", accent: "#004d40" },
        rose: { text: "#c53030", bg: "#fff5f5", accent: "#c53030" },
        emerald: { text: "#22543d", bg: "#f0fff4", accent: "#22543d" },
        amber: { text: "#744210", bg: "#fffaf0", accent: "#744210" },
    };

    const config = colorMap[color] || colorMap.indigo;

    return (
        <div
            className={`stat-card-formal ${isCritical ? 'critical-border' : ''}`}
            style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div
                    style={{
                        padding: '12px',
                        borderRadius: '4px',
                        background: config.bg,
                        color: config.accent,
                        border: `1px solid ${config.accent}15`
                    }}
                >
                    {Icon && <Icon size={20} />}
                </div>

                {trend && (
                    <div style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: trend > 0 ? '#10b981' : '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                    }}>
                        {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <div>
                <h3 style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '4px'
                }}>
                    {title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>
                        <AnimatedNumber value={value} />
                    </span>
                    {unit && <span style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>{unit}</span>}
                </div>
            </div>

            {/* Subtle accent bar at bottom */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '3px',
                background: config.accent,
                opacity: 0.8,
                borderRadius: '0 0 4px 4px'
            }} />
        </div>
    );
};

export default StatCard;

