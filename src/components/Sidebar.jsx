import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut, User as UserIcon, ArrowLeft } from 'lucide-react';

const Sidebar = ({ user, activeTab, setActiveTab, onLogout }) => {
    const navigate = useNavigate();
    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'settings', label: 'Settings / Edit Profile', icon: Settings },
    ];

    return (
        <div className="w-64 bg-gray-900 border-r border-gray-800 h-screen fixed left-0 top-0 flex flex-col">
            {/* Back Button */}
            <div className="p-4">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 text-white hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 stroke-[3]" />
                </button>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-gray-800">
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg shadow-blue-500/30">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            getInitials(user?.name)
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-white text-center">{user?.name || 'User'}</h2>
                    <p className="text-sm text-gray-400 text-center mt-1">{user?.email || 'email@example.com'}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
