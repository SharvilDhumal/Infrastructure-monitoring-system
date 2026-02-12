import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Bell, 
  Search, 
  ShieldCheck, 
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  LayoutDashboard
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import DashboardStats from '../components/DashboardStats';
import ResolutionChart from '../components/ResolutionChart';
import IssueCard from '../components/IssueCard';
import IssueFilter from '../components/IssueFilter';
import EmptyState from '../components/EmptyState';
import authService from '../features/auth/authService';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [filter, setFilter] = useState('all');
    const [issues, setIssues] = useState([]);
    const [stats, setStats] = useState({
        approved: 0,
        pending: 0,
        rejected: 0,
        resolved: 0,
        total: 0
    });
    const [loading, setLoading] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (!token || !storedUser) {
                navigate('/login');
                return;
            }

            setUser(JSON.parse(storedUser));
            fetchUserIssues(token);
        };

        checkAuth();
    }, [navigate]);

    const fetchUserIssues = async (token) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/issues/user';

            const response = await axios.get(API_URL, config);
            setIssues(response.data.issues);
            
            // Format stats to match DashboardStats requirements
            const s = response.data.stats;
            setStats({
                approved: s.approved || 0,
                pending: s.pending || 0,
                rejected: s.rejected || 0,
                resolved: s.resolved || 0,
                total: s.total || 0
            });
        } catch (error) {
            console.error('Error fetching issues:', error);
            if (error.response && error.response.status === 401) {
                authService.logout();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const filteredIssues = filter === 'all' 
        ? issues 
        : issues.filter(i => i.status === filter);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">Loading Your Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#05070a] flex font-inter selection:bg-blue-500/30">
            <Sidebar 
                user={user} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onLogout={handleLogout} 
            />

            <main className="flex-1 ml-72 p-10">
                {/* Header */}
                <header className="flex justify-between items-center mb-12 relative z-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                             Welcome back, <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">{user?.name?.split(' ')[0] || 'User'}</span>
                        </h1>
                        <p className="text-gray-500 font-medium">Here's the status of your reported infrastructure issues.</p>
                    </motion.div>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative group hidden lg:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search your reports..." 
                                className="bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-white w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-white/10 transition-all border-white/10"
                            />
                        </div>
                        <div className="relative">
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-3 bg-white/5 text-gray-400 rounded-2xl border border-white/10 hover:bg-white/10 hover:text-white transition-all relative"
                            >
                                <Bell size={20} />
                                <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#05070a]" />
                            </button>
                            
                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-4 w-80 bg-[#0f1218]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl py-6 z-50 overflow-hidden"
                                    >
                                        <div className="px-6 mb-4 flex justify-between items-center">
                                            <h3 className="font-bold text-white">Notifications</h3>
                                            <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">NEW</span>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto px-2">
                                            <div className="px-4 py-8 text-center">
                                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-gray-600 mx-auto mb-3">
                                                    <Bell size={20} />
                                                </div>
                                                <p className="text-gray-500 text-xs">No new notifications</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    <div className="xl:col-span-2">
                        {/* Stats Overview */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                    <ShieldCheck className="text-blue-500" size={20} />
                                    Account Stats
                                </h2>
                            </div>
                            <DashboardStats stats={stats} />
                        </div>

                        {/* Reported Issues */}
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-white tracking-tight">Your Reports</h2>
                                <button
                                    onClick={() => navigate('/report')}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-95"
                                >
                                    <Plus size={18} />
                                    New Issue
                                </button>
                            </div>

                            <IssueFilter currentFilter={filter} onFilterChange={setFilter} />

                            <div className="space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {filteredIssues.length > 0 ? (
                                        filteredIssues.map((issue) => (
                                            <motion.div
                                                key={issue._id}
                                                layout
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <IssueCard issue={issue} />
                                            </motion.div>
                                        ))
                                    ) : (
                                        <EmptyState />
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* Resolution Chart */}
                        <ResolutionChart stats={stats} />
                        
                        {/* City Alerts / Recent Activity Card */}
                        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                                <ShieldCheck size={120} />
                           </div>
                           <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Community Impact</h3>
                           <p className="text-blue-100 text-sm mb-6 relative z-10">
                               Your reports have helped resolve over <span className="font-bold">120+</span> infrastructure issues in Sector 7 this month.
                           </p>
                           <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl text-sm relative z-10 hover:bg-blue-50 transition-all hover:px-8 transition-all duration-300">
                               View Impact Map
                           </button>
                        </div>

                        {/* Settings Card */}
                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md">
                            <h3 className="text-lg font-bold text-white mb-4">Quick Settings</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                                    <span className="text-gray-400 text-sm font-medium">Notification Alerts</span>
                                    <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                                    <span className="text-gray-400 text-sm font-medium">Email Reports</span>
                                    <div className="w-10 h-5 bg-gray-700 rounded-full relative">
                                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
