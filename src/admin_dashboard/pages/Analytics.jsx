import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import KPICard from '../components/KPICard';
import IssueTrendChart from '../components/IssueTrendChart';
import IssueDonutChart from '../components/IssueDonutChart';
import InfrastructureBarChart from '../components/InfrastructureBarChart';
import { 
    Activity, 
    CheckCircle2, 
    Clock, 
    Zap, 
    TrendingUp, 
    BarChart3, 
    PieChart, 
    ShieldCheck, 
    DollarSign, 
    ArrowUpRight, 
    ArrowDownRight,
    Loader2,
    AlertCircle
} from 'lucide-react';

const BentoCard = ({ children, title, icon: Icon, spanClass = "col-span-1" }) => (
  <div className={`bg-white/80 backdrop-blur-3xl border border-white/50 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:scale-[1.015] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden flex flex-col ${spanClass}`}>
    {title && (
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-3">
          {Icon && (
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-2xl shadow-inner">
                <Icon className="text-blue-600" size={20} />
            </div>
          )}
          {title}
        </h2>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
            <TrendingUp size={14} />
        </div>
      </div>
    )}
    <div className="flex-1 w-full h-full relative">
      {children}
    </div>
  </div>
);

const Analytics = ({ hideLayout = false }) => {
    const [selectedPeriod, setSelectedPeriod] = useState('7d');
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_BASE_URL}/api/admin/analytics`);
                setAnalyticsData(res.data.data);
                setError(null);
            } catch (err) {
                setError('Failed to load performance telemetry');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-slate-500 space-y-4">
                <Loader2 size={48} className="animate-spin text-blue-500" />
                <p className="font-black tracking-widest uppercase text-[10px]">Processing Telemetry Streams...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`mt-8 p-8 bg-rose-50 border border-rose-200 text-rose-600 rounded-[2.5rem] font-black flex items-center justify-center shadow-lg transition-all animate-in zoom-in-95 mx-auto ${hideLayout ? 'max-w-none' : 'max-w-[1600px]'}`}>
                {error}
            </div>
        );
    }

    if (!analyticsData) return null;

    const metrics = {
        totalIssues: analyticsData.totalIssues || 0,
        resolvedIssues: analyticsData.resolvedIssues || 0,
        avgResolutionTime: analyticsData.avgResolutionTime || '4.2 hours',
        aiAccuracy: analyticsData.aiAccuracy || 94.2,
        costSavings: analyticsData.costSavings || '$124,500',
        preventiveActions: analyticsData.preventiveActions || 342,
        severity: analyticsData.severityCounts || { critical: 0, high: 0, medium: 0, low: 0 }
    };

    const assetHealth = analyticsData.assetHealth || [];
    const topIssues = analyticsData.topIssueTypes || [];

    return (
        <div className={`w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 mx-auto ${hideLayout ? 'max-w-none pt-4 px-10 pb-20' : 'max-w-[1600px] pt-16 pb-24 px-4 md:px-0'}`}>
            {/* Page Header */}
            <div className="mb-14 px-2">
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-3 capitalize">Global <span className="text-blue-600">Analytics</span></h1>
                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Real-time system health and performance intelligence</p>
            </div>

            {/* Performance Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 auto-rows-max">
                
                {/* Core KPIs */}
                <div className="col-span-1 lg:col-span-2 grid grid-cols-2 gap-6 h-full">
                    <MetricPill
                        title="Incident Volume"
                        value={metrics.totalIssues.toLocaleString()}
                        subtext="+12% (30d)"
                        icon={Activity}
                        color="text-blue-600"
                        bg="bg-blue-50"
                        trend="up"
                    />
                    <MetricPill
                        title="Resolution Rate"
                        value={`${Math.round((metrics.resolvedIssues / metrics.totalIssues) * 100)}%`}
                        subtext="Optimized"
                        icon={ShieldCheck}
                        color="text-emerald-600"
                        bg="bg-emerald-50"
                        trend="up"
                    />
                    <MetricPill
                        title="Avg Response"
                        value={metrics.avgResolutionTime}
                        subtext="Efficiency High"
                        icon={Clock}
                        color="text-amber-600"
                        bg="bg-amber-50"
                    />
                    <MetricPill
                        title="AI Accuracy"
                        value={`${metrics.aiAccuracy}%`}
                        subtext="Neural Confidence"
                        icon={Zap}
                        color="text-indigo-600"
                        bg="bg-indigo-50"
                        trend="up"
                    />
                </div>

                {/* Severity Splits */}
                <BentoCard title="Severity Matrix" icon={PieChart} spanClass="col-span-1 lg:col-span-2">
                    <div className="h-full min-h-[300px] flex items-center justify-center pt-2">
                        <IssueDonutChart data={metrics.severity} />
                    </div>
                </BentoCard>

                {/* Primary Trend Chart */}
                <BentoCard title="System Load Trends" icon={BarChart3} spanClass="col-span-1 lg:col-span-4 min-h-[450px]">
                    <div className="absolute top-0 right-0 flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
                        {['7d', '30d', '90d'].map((p) => (
                            <button
                                key={p}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                                    selectedPeriod === p 
                                    ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-100' 
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                                onClick={() => setSelectedPeriod(p)}
                            >
                                {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
                            </button>
                        ))}
                    </div>
                    <div className="h-full pt-10 -mx-4">
                        <IssueTrendChart period={selectedPeriod} externalData={analyticsData.issueTrends} />
                    </div>
                </BentoCard>

                {/* Secondary Insights Grid */}
                <BentoCard title="Asset Reliability Index" icon={ShieldCheck} spanClass="col-span-1 lg:col-span-2">
                    <div className="space-y-7 pt-4">
                        {assetHealth.map((asset, i) => (
                            <HealthRow key={i} asset={asset} />
                        ))}
                    </div>
                </BentoCard>

                <BentoCard title="Anomaly Distribution" icon={TrendingUp} spanClass="col-span-1 lg:col-span-2">
                    <div className="h-full pt-4">
                        <InfrastructureBarChart data={assetHealth} />
                    </div>
                </BentoCard>

                {/* Top Issues List */}
                <BentoCard title="Critical Anomalies" icon={AlertCircle} spanClass="col-span-1 lg:col-span-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                        {topIssues.map((issue, index) => (
                            <div key={index} className="group p-6 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:border-slate-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-500">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:bg-slate-50 transition-colors">
                                        #{index + 1}
                                    </div>
                                    <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                                        issue.trend.startsWith('+') ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                                    }`}>
                                        {issue.trend.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                        {issue.trend}
                                    </div>
                                </div>
                                <h4 className="text-lg font-black text-slate-800 tracking-tight leading-tight uppercase truncate">{issue.type}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{issue.count} Validated occurrences</p>
                            </div>
                        ))}
                   </div>
                </BentoCard>
            </div>
        </div>
    );
};

const MetricPill = ({ title, value, subtext, icon: Icon, color, bg, trend }) => (
    <div className={`p-8 ${bg} rounded-[2.5rem] border border-white/50 shadow-sm transition-all hover:scale-[1.03] group relative overflow-hidden flex flex-col justify-between`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="flex items-center gap-2.5 mb-6 relative">
            <div className={`p-2 bg-white rounded-xl shadow-sm ${color}`}>
                <Icon size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</span>
        </div>
        <div className="relative">
            <div className={`text-3xl font-black tracking-tighter ${color} leading-none mb-1.5`}>{value}</div>
            <div className="flex items-center gap-1.5">
                {trend && <div className={`p-0.5 rounded-full ${trend === 'up' ? 'text-emerald-500 bg-emerald-100' : 'text-rose-500 bg-rose-100'}`}><ArrowUpRight size={10} /></div>}
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{subtext}</span>
            </div>
        </div>
    </div>
);

const HealthRow = ({ asset }) => (
    <div className="group space-y-3">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{asset.asset}</span>
                <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">Operational</span>
            </div>
            <div className="text-sm font-black text-slate-900 tracking-tighter">{asset.health}%</div>
        </div>
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner ring-1 ring-slate-200/50">
            <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out shadow-lg ${
                    asset.health >= 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 
                    asset.health >= 60 ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 
                    'bg-gradient-to-r from-rose-400 to-rose-600'
                }`}
                style={{ width: `${asset.health}%` }}
            />
        </div>
        <div className="flex justify-between items-center px-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{asset.resolved} Resolved / {asset.issues} Reported</span>
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest group-hover:translate-x-1 transition-transform cursor-pointer">View Analysis →</span>
        </div>
    </div>
);

export default Analytics;































