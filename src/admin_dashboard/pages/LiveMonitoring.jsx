import React from 'react';
import { 
    AlertCircle, 
    Lightbulb, 
    Droplets, 
    Activity, 
    ArrowRight,
    Wifi,
    Zap,
    Cpu,
    Shield
} from 'lucide-react';

const monitoringModules = [
    {
        id: 'pothole',
        title: 'Pothole Monitoring',
        description: 'Real-time detection and analysis of road surface defects using vision-based AI telemetry.',
        icon: AlertCircle,
        path: '/main-dashboard/live-monitoring/pothole',
        color: 'text-rose-500',
        bg: 'bg-rose-500/10'
    },
    {
        id: 'streetlight',
        title: 'Streetlight Monitoring',
        description: 'Automated management and fault detection for smart city lighting and energy utilization.',
        icon: Lightbulb,
        path: '/main-dashboard/live-monitoring/streetlight',
        color: 'text-amber-500',
        bg: 'bg-amber-500/10'
    },
    {
        id: 'water-leakage',
        title: 'Water Leakage Monitoring',
        description: 'IoT-based hydraulic detection, moisture sensing and real-time flow analytics.',
        icon: Droplets,
        path: '/main-dashboard/live-monitoring/water-leakage',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
    },
    {
        id: 'bridge',
        title: 'Structural Health',
        description: 'Vibration analysis, load tracking and structural integrity monitoring for critical bridges.',
        icon: Activity,
        path: '/main-dashboard/live-monitoring/bridge',
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10'
    }
];

const LiveMonitoring = () => {
    return (
        <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto pt-16 pb-24 px-4 md:px-0">
            {/* Header Area */}
            <div className="mb-16 px-2 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 capitalize">Live <span className="text-blue-600 font-black">Sensory</span> Feed</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] max-w-lg leading-relaxed">
                        Select a specialized diagnostic module to view real-time infrastructure telemetry and neural health.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Live</span>
                    </div>
                </div>
            </div>

            {/* Module Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {monitoringModules.map((module) => (
                    <ModuleCard key={module.id} module={module} />
                ))}
            </div>

            {/* Footer Status */}
            <div className="mt-16 pt-8 border-t border-slate-100 flex flex-wrap justify-center gap-x-12 gap-y-6">
                <StatusIndicator icon={Wifi} label="Protocol" value="HTTP/3 (QUIC)" />
                <StatusIndicator icon={Zap} label="Latency" value="12ms" />
                <StatusIndicator icon={Cpu} label="Compute" value="Edge Optimized" />
                <StatusIndicator icon={Shield} label="Security" value="AES-256-GCM" />
            </div>
        </div>
    );
};

const ModuleCard = ({ module }) => {
    const Icon = module.icon;
    
    return (
        <div 
            onClick={() => window.open(module.path, '_blank')}
            className="group relative bg-white/80 backdrop-blur-3xl border border-white/50 rounded-[3rem] p-10 shadow-sm hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 cursor-pointer overflow-hidden flex flex-col min-h-[320px]"
        >
            {/* Abstract Background Accent */}
            <div className={`absolute -top-12 -right-12 w-48 h-48 ${module.bg} rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700`} />
            
            <div className="relative z-10 flex-1">
                <div className="flex items-center justify-between mb-8">
                    <div className={`w-16 h-16 ${module.bg} border border-white rounded-[1.5rem] flex items-center justify-center ${module.color} shadow-inner`}>
                        <Icon size={32} strokeWidth={2.5} />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm">
                        <div className={`w-1.5 h-1.5 rounded-full ${module.color.replace('text', 'bg')} animate-pulse`} />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Stream Ready</span>
                    </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-blue-600 transition-colors uppercase">{module.title}</h3>
                <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-[85%] mb-8 lowercase first-letter:uppercase">
                    {module.description}
                </p>
            </div>

            <div className="relative z-10 pt-6 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Launch Diagnostics</span>
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all">
                    <ArrowRight size={20} />
                </div>
            </div>
        </div>
    );
};

const StatusIndicator = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-50 rounded-xl text-slate-400 border border-slate-100">
            <Icon size={14} />
        </div>
        <div>
            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</div>
            <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic">{value}</div>
        </div>
    </div>
);

export default LiveMonitoring;
