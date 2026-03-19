import React, { useState } from 'react';
import { 
    Shield, 
    Bell, 
    Zap, 
    Database, 
    Users, 
    Code, 
    Globe, 
    Lock, 
    Mail, 
    MessageSquare, 
    Cpu, 
    Settings as SettingsIcon,
    Save,
    RotateCcw,
    UserPlus,
    ExternalLink,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';

const Settings = ({ hideLayout = false }) => {
    const [settings, setSettings] = useState({
        aiEnabled: true,
        autoAssignment: true,
        emailNotifications: true,
        smsAlerts: false,
        scanFrequency: 'hourly',
        alertThreshold: 'medium',
        maintenanceMode: false
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSelectChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className={`w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 mx-auto ${hideLayout ? 'max-w-none pt-4 px-10 pb-20' : 'max-w-[1600px] pt-16 pb-24 px-4 md:px-0'}`}>
            {/* Header Area */}
            <div className="mb-14 px-2 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-3 capitalize">System <span className="text-blue-600">Preferences</span></h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Configure core monitoring logic and notification protocols</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-8 py-3.5 bg-white border border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        <RotateCcw size={14} /> Reset
                    </button>
                    <button className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-500/25 hover:scale-[1.05] transition-all flex items-center gap-2">
                        <Save size={14} /> Save Changes
                    </button>
                </div>
            </div>

            {/* Settings Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                {/* AI Configuration */}
                <SettingsCard title="Intelligence Engine" icon={Cpu} spanClass="md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        <SettingToggle
                            icon={Zap}
                            label="Neural Monitoring"
                            description="Enable AI-powered infrastructure analysis for anomaly detection"
                            checked={settings.aiEnabled}
                            onChange={() => handleToggle('aiEnabled')}
                        />
                        <SettingToggle
                            icon={CheckCircle2}
                            label="Auto-Registry"
                            description="Automatically assign verified issues to designated ops teams"
                            checked={settings.autoAssignment}
                            onChange={() => handleToggle('autoAssignment')}
                        />
                        <SettingSelect
                            icon={Database}
                            label="Scan Frequency"
                            value={settings.scanFrequency}
                            options={[
                                { value: 'realtime', label: 'Real-time (Stream)' },
                                { value: 'hourly', label: 'Hourly Cycle' },
                                { value: 'daily', label: 'Daily Summary' }
                            ]}
                            onChange={(v) => handleSelectChange('scanFrequency', v)}
                        />
                        <SettingSelect
                            icon={Shield}
                            label="Alert Threshold"
                            value={settings.alertThreshold}
                            options={[
                                { value: 'low', label: 'Low (All Events)' },
                                { value: 'medium', label: 'Medium (Warnings+)' },
                                { value: 'high', label: 'High (Critical Only)' }
                            ]}
                            onChange={(v) => handleSelectChange('alertThreshold', v)}
                        />
                    </div>
                </SettingsCard>

                {/* Notifications */}
                <SettingsCard title="Alert Channels" icon={Bell}>
                    <div className="space-y-8">
                        <SettingToggle
                            icon={Mail}
                            label="Email Digests"
                            checked={settings.emailNotifications}
                            onChange={() => handleToggle('emailNotifications')}
                        />
                        <SettingToggle
                            icon={MessageSquare}
                            label="SMS Protocols"
                            checked={settings.smsAlerts}
                            onChange={() => handleToggle('smsAlerts')}
                        />
                         <div className="p-5 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl text-amber-500 shadow-sm border border-slate-100">
                                <AlertTriangle size={16} />
                            </div>
                            <div className="text-[10px] font-bold text-slate-500 leading-relaxed italic">
                                Critical SMS alerts may incur cellular carrier data charges.
                            </div>
                        </div>
                    </div>
                </SettingsCard>

                {/* User Management */}
                <SettingsCard title="Administrative Registry" icon={Users} spanClass="md:col-span-2">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-2 px-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Authenticated Entities</span>
                            <button className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">
                                <UserPlus size={14} /> Invite New
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <UserItem name="Sharvil Dhumal" email="sharvil@pothole.ai" role="Administrator" />
                            <UserItem name="Jane Smith" email="jane.smith@infra.tech" role="Operations" />
                            <UserItem name="Mike Johnson" email="m.johnson@visual.org" role="Observer" />
                        </div>
                    </div>
                </SettingsCard>

                {/* API & System */}
                <SettingsCard title="Terminal & APIs" icon={Code}>
                    <div className="space-y-8">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Live Access Key</label>
                            <div className="relative group">
                                <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 font-mono text-xs text-slate-500 tracking-wider">
                                    sk_live_••••••••••••3a9f
                                </div>
                                <button className="absolute right-2 top-1.5 p-2 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-blue-600 hover:border-blue-200 transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                                    <RotateCcw size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="pt-2 space-y-4">
                             <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-3">
                                    <Globe size={16} className="text-slate-400" />
                                    <span className="text-xs font-black text-slate-700">Webhook Status</span>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                             </div>
                             <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-3">
                                    <Database size={16} className="text-slate-400" />
                                    <span className="text-xs font-black text-slate-700">Redundancy Link</span>
                                </div>
                                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Disconnected</div>
                             </div>
                        </div>
                        <button 
                            onClick={() => handleToggle('maintenanceMode')}
                            className={`w-full py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all border ${
                                settings.maintenanceMode 
                                ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-lg shadow-rose-500/10' 
                                : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                            }`}
                        >
                            {settings.maintenanceMode ? 'Exit System Maintenance' : 'Enter Maintenance Mode'}
                        </button>
                    </div>
                </SettingsCard>
            </div>
        </div>
    );
};

const SettingsCard = ({ title, icon: Icon, children, spanClass = "col-span-1" }) => (
    <div className={`bg-white/80 backdrop-blur-3xl border border-white/50 rounded-[3rem] p-10 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col ${spanClass}`}>
        <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                <Icon size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">{title}</h3>
        </div>
        <div className="flex-1">
            {children}
        </div>
    </div>
);

const SettingToggle = ({ icon: Icon, label, description, checked, onChange }) => (
    <div className="flex items-start justify-between gap-6 group">
        <div className="flex gap-4">
            <div className={`p-2.5 rounded-xl border transition-all ${checked ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                <Icon size={18} />
            </div>
            <div>
                <div className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1">{label}</div>
                {description && <div className="text-[10px] font-bold text-slate-400 leading-relaxed max-w-[200px]">{description}</div>}
            </div>
        </div>
        <button 
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const SettingSelect = ({ icon: Icon, label, value, options, onChange }) => (
    <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5 ml-1">
            <Icon size={14} className="text-slate-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
        </div>
        <select 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-xs font-black text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
        >
            {options.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>
    </div>
);

const UserItem = ({ name, email, role }) => (
    <div className="p-5 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between group hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-lg font-black text-slate-500 shadow-inner group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all">
                {name.charAt(0)}
            </div>
            <div>
                <div className="text-sm font-black text-slate-800 tracking-tight">{name}</div>
                <div className="text-[10px] font-bold text-slate-400">{email}</div>
            </div>
        </div>
        <div className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${
            role === 'Administrator' ? 'bg-rose-50 text-rose-600' : 
            role === 'Operations' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
        }`}>
            {role}
        </div>
    </div>
);

export default Settings;































