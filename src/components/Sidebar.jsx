import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut, User as UserIcon, ArrowLeft, ShieldCheck } from 'lucide-react';

const Sidebar = ({ user, activeTab, setActiveTab, onLogout }) => {
    const navigate = useNavigate();
    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="w-72 bg-[#0a0c10]/80 backdrop-blur-2xl border-r border-white/5 h-screen fixed left-0 top-0 flex flex-col z-50">
            {/* Logo Section */}
            <div className="p-8 pb-4">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-3 text-white font-bold text-xl hover:opacity-80 transition-opacity"
                >
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <ShieldCheck size={20} />
                    </div>
                    InfraVision
                </button>
            </div>

            {/* User Info Container */}
            <div className="px-6 py-8">
                <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                    <div className="flex flex-col items-center relative z-10">
                        <div className="w-20 h-20 rounded-full border-2 border-white/10 p-1 mb-4 group-hover:border-blue-500/50 transition-colors">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    getInitials(user?.name)
                                )}
                            </div>
                        </div>
                        <h2 className="text-lg font-bold text-white text-center leading-tight truncate w-full">{user?.name || 'User'}</h2>
                        <p className="text-xs text-gray-500 text-center mt-1 truncate w-full">{user?.email || 'email@example.com'}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-6 space-y-2">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] ml-4 mb-4">Main Menu</p>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${activeTab === item.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className={`w-5 h-5 transition-transform duration-300 ${activeTab === item.id ? '' : 'group-hover:scale-110'}`} />
                            <span className="font-semibold text-sm">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Logout Section */}
            <div className="p-6">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 border border-white/5 hover:border-red-500/20 transition-all duration-300 font-bold text-sm"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
