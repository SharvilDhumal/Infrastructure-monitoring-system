import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut, ShieldCheck, User as UserIcon, Menu, X } from 'lucide-react';

const Sidebar = ({ user, activeTab, setActiveTab, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    // Close sidebar on navigation/tab change
    useEffect(() => {
        setIsOpen(false);
    }, [activeTab, location.pathname]);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <>
            {/* Mobile Header (Visible only on sm, md) */}
            <div className="lg:hidden fixed top-0 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 z-40 px-4 py-3 flex justify-between items-center shadow-sm">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-[#002147] font-bold text-lg"
                >
                    <div className="w-8 h-8 bg-[#002147] rounded-lg flex items-center justify-center">
                        <ShieldCheck size={18} className="text-white" />
                    </div>
                    InfraVision
                </button>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 touch-target bg-slate-50 text-slate-700 rounded-lg border border-slate-200"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Content */}
            <div className={`w-72 md:w-80 lg:w-64 bg-white/95 backdrop-blur-xl border-r border-slate-200 fixed left-0 top-0 bottom-0 lg:left-6 lg:top-24 lg:bottom-12 lg:rounded-[2.5rem] flex flex-col z-50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-y-auto hide-scrollbar transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Logo Section - Desktop */}
                <div className="p-5 pb-3 border-b border-gray-100 hidden lg:block">
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

                {/* Header inside mobile sidebar - Mobile Only */}
                <div className="p-5 pb-3 border-b border-gray-100 lg:hidden flex justify-between items-center">
                    <div className="flex items-center gap-3 text-[#002147] font-bold w-full truncate text-lg">
                        <div className="w-8 h-8 bg-[#002147] rounded-lg flex items-center justify-center shrink-0">
                            <ShieldCheck size={18} className="text-white" />
                        </div>
                        InfraVision
                    </div>
                    <button className="touch-target p-2 text-slate-500 shrink-0" onClick={() => setIsOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                {/* User Info Container */}
                <div className="px-5 py-6 lg:py-4 border-b border-gray-100 mb-1">
                    <div className="flex flex-col items-center">
                        <div className="w-14 h-14 lg:w-12 lg:h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 lg:mb-2 border border-gray-200 mt-2 lg:mt-0">
                            <UserIcon size={32} className="text-[#002147] lg:w-7 lg:h-7" />
                        </div>
                        <h2 className="text-xl lg:text-lg font-bold text-gray-900 text-center w-full truncate">{user?.name || 'Citizen'}</h2>
                        <p className="text-sm lg:text-xs text-gray-500 text-center mt-1 w-full truncate">{user?.email || 'citizen@city.gov'}</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2 mt-4 lg:mt-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-4 mb-3">Menu</p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`touch-target w-full flex items-center space-x-4 lg:space-x-3 px-5 lg:px-4 py-3 lg:py-2.5 rounded-xl transition-all duration-200 ${
                                    activeTab === item.id
                                        ? 'bg-[#002147] text-white font-bold shadow-md'
                                        : 'text-gray-600 hover:text-[#002147] hover:bg-gray-50 font-medium border border-transparent'
                                }`}
                            >
                                <Icon className="w-6 h-6 lg:w-5 lg:h-5" />
                                <span className="text-lg lg:text-base">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Logout Section */}
                <div className="p-4 border-t border-gray-200 mt-auto">
                    <button
                        onClick={onLogout}
                        className="touch-target w-full flex items-center justify-center gap-2 px-4 py-4 lg:py-3 rounded-xl lg:rounded-lg bg-white text-gray-600 border border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors font-bold text-base lg:text-sm"
                    >
                        <LogOut className="w-6 h-6 lg:w-5 lg:h-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
