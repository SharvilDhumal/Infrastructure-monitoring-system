import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BrainCircuit, Zap, ChevronRight, TrendingUp } from 'lucide-react';

const AIInsightsCard = ({ loading = false }) => {
    const insights = [
        {
            id: 1,
            type: 'Prediction',
            message: 'Highway Bridge #3 showing unusual vibration patterns. Maintenance suggested within 48h.',
            priority: 'high',
            icon: TrendingUp
        },
        {
            id: 2,
            type: 'Optimization',
            message: 'Network load balanced across Sector 7 lighting nodes. Efficiency increased by 12%.',
            priority: 'medium',
            icon: Zap
        }
    ];

    return (
        <div
            className="ai-insights-card-professional"
            style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                padding: '32px',
                height: '100%',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div className="flex items-center gap-4 mb-8">
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '4px',
                    background: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#002147',
                    border: '1px solid #e2e8f0'
                }}>
                    <Sparkles size={24} />
                </div>
                <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        AI Intelligence Results
                    </h2>
                    <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Neural Co-Processor Active
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {loading ? (
                    <div style={{ height: '200px', width: '100%', background: '#f8fafc', borderRadius: '4px' }} />
                ) : (
                    insights.map((insight) => (
                        <div
                            key={insight.id}
                            style={{
                                padding: '20px',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                borderLeft: `4px solid ${insight.priority === 'high' ? '#dc3545' : '#002147'}`,
                                display: 'flex',
                                gap: '16px'
                            }}
                        >
                            <div style={{
                                color: insight.priority === 'high' ? '#dc3545' : '#002147',
                                flexShrink: 0
                            }}>
                                <insight.icon size={20} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '14px', fontWeight: '500', color: '#334155', lineHeight: '1.5' }}>
                                    {insight.message}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                                    <span style={{
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        color: insight.priority === 'high' ? '#dc3545' : '#002147',
                                        textTransform: 'uppercase'
                                    }}>
                                        {insight.type}
                                    </span>
                                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>v4.1 System Node</span>
                                </div>
                            </div>
                            <ChevronRight size={18} style={{ alignSelf: 'center', color: '#cbd5e1' }} />
                        </div>
                    ))
                )}
            </div>

            <button style={{
                width: '100%',
                marginTop: '32px',
                padding: '12px',
                background: 'transparent',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '700',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer'
            }}>
                View Full Intelligence Report
            </button>

            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: '#002147',
                opacity: 0.8
            }} />
        </div>
    );
};

export default AIInsightsCard;
