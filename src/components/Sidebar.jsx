import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';

const Sidebar = ({ user, activeTab, setActiveTab, onLogout }) => {
    const navigate = useNavigate();

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-50 shadow-sm">
            {/* Logo Section */}
            <div className="p-6 pb-4 border-b border-gray-100">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-3 text-[#002147] font-bold text-xl hover:opacity-80 transition-opacity"
                >
                    <div className="w-10 h-10 bg-[#002147] rounded-lg flex items-center justify-center">
                        <ShieldCheck size={24} className="text-white" />
                    </div>
                    InfraVision
                </button>
            </div>

            {/* User Info Container */}
            <div className="px-6 py-6 border-b border-gray-100 mb-2">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 border border-gray-200">
                        <UserIcon size={28} className="text-[#002147]" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 text-center w-full truncate">{user?.name || 'Citizen'}</h2>
                    <p className="text-xs text-gray-500 text-center mt-1 w-full truncate">{user?.email || 'citizen@city.gov'}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-4 mb-3">Menu</p>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.id
                                ? 'bg-[#002147] text-white font-bold shadow-md'
                                : 'text-gray-600 hover:text-[#002147] hover:bg-gray-50 font-medium border border-transparent'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-base">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Logout Section */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white text-gray-600 border border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors font-bold text-sm"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
