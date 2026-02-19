import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import authService from '../features/auth/authService';
import Sidebar from '../components/Sidebar';
import DashboardStats from '../components/DashboardStats';
import ResolutionChart from '../components/ResolutionChart';
import IssueCard from '../components/IssueCard';
import IssueFilter from '../components/IssueFilter';
import EmptyState from '../components/EmptyState';
import { Plus, Bell, Search } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [filter, setFilter] = useState('all');
    const [user, setUser] = useState(null);
    
    // Mock data - In a real app, this would come from an API
    const [issues, setIssues] = useState([
        { 
            id: 1, 
            title: 'Large Pothole on Main St', 
            location: 'Main St & 5th Ave', 
            status: 'Pending', 
            createdAt: '2024-02-10T10:00:00Z', 
            description: 'A large pothole that is causing traffic delays and potential damage to vehicles.',
            imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0ca60b0ec86?auto=format&fit=crop&q=80&w=200'
        },
        { 
            id: 2, 
            title: 'Broken Street Light', 
            location: 'Oak Avenue', 
            status: 'Resolved', 
            createdAt: '2024-02-08T15:30:00Z',
            description: 'Street light has been flickering and is now completely out.',
            imageUrl: 'https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&q=80&w=200'
        },
        { 
            id: 3, 
            title: 'Bridge Crack Detected', 
            location: 'East River Bridge', 
            status: 'Approved', 
            createdAt: '2024-02-11T09:15:00Z',
            description: 'Small structural crack visible on the pedestrian walkway.',
            imageUrl: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=200'
        },
        { 
            id: 4, 
            title: 'Traffic Signal Error', 
            location: 'Broadway', 
            status: 'Rejected', 
            createdAt: '2024-02-09T12:00:00Z',
            description: 'Lights are stuck on red in all directions.',
            imageUrl: 'https://images.unsplash.com/photo-1513366811225-248796678225?auto=format&fit=crop&q=80&w=200'
        }
    ]);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const stats = {
        approved: issues.filter(i => i.status === 'Approved').length,
        pending: issues.filter(i => i.status === 'Pending').length,
        rejected: issues.filter(i => i.status === 'Rejected').length,
        resolved: issues.filter(i => i.status === 'Resolved').length,
    };

    const filteredIssues = filter === 'all' 
        ? issues 
        : issues.filter(i => i.status === filter);

    return (
        <div className="min-h-screen bg-[#05070a] flex">
            <Sidebar 
                user={user} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onLogout={handleLogout} 
            />

            <main className="flex-1 ml-72 p-10">
                {/* Header */}
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                             Welcome back, <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">{user?.name?.split(' ')[0] || 'User'}</span>
                        </h1>
                        <p className="text-gray-500 font-medium">Here's what's happening with your reported issues.</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative group hidden lg:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search issues..." 
                                className="bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-white w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-white/10 transition-all"
                            />
                        </div>
                        <button className="p-3 bg-white/5 text-gray-400 rounded-2xl border border-white/5 hover:bg-white/10 hover:text-white transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#05070a]" />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    <div className="xl:col-span-2">
                        {/* Stats Overview */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white tracking-tight">Status Overview</h2>
                                <button className="text-blue-400 text-sm font-semibold hover:underline">View detailed analytics</button>
                            </div>
                            <DashboardStats stats={stats} />
                        </div>

                        {/* Reported Issues */}
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-white tracking-tight">My Reported Issues</h2>
                                <button
                                    onClick={() => navigate('/report')}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-95"
                                >
                                    <Plus size={18} />
                                    New Report
                                </button>
                            </div>

                            <IssueFilter currentFilter={filter} onFilterChange={setFilter} />

                            <div className="space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {filteredIssues.length > 0 ? (
                                        filteredIssues.map((issue) => (
                                            <motion.div
                                                key={issue.id}
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
                        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                                <ShieldCheck size={120} />
                           </div>
                           <h3 className="text-2xl font-bold text-white mb-2 relative z-10">InfraVision AI</h3>
                           <p className="text-blue-100 text-sm mb-6 relative z-10 max-w-[200px]">Our autonomous agents are currently analyzing City Sector 7 for drainage issues.</p>
                           <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl text-sm relative z-10 hover:bg-blue-50 transition-colors">
                               Learn More
                           </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
