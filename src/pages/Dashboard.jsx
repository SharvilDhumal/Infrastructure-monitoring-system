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
    const [isChartDrawerOpen, setIsChartDrawerOpen] = useState(false);

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
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar
                user={user}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={handleLogout}
            />

            <main className="flex-1 md:ml-64 p-6 md:p-10 w-full max-w-7xl mx-auto">
                {activeTab === 'dashboard' ? (
                    <>
                        {/* Header */}
                        <header className="mb-8 border-b border-gray-200 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-[#002147] tracking-tight mb-2">
                                    Welcome, {user?.name?.split(' ')[0] || 'Citizen'}
                                </h1>
                                <p className="text-gray-600 font-medium text-lg">Manage and track your reported infrastructure issues.</p>
                            </div>
                            <button
                                onClick={() => setIsChartDrawerOpen(true)}
                                className="px-6 py-3 bg-white border border-gray-300 text-[#002147] hover:bg-gray-50 font-bold rounded-lg shadow-sm transition-colors"
                            >
                                View Resolution Stats
                            </button>
                        </header>

                        <div className="flex flex-col gap-8">
                            {/* Stats Overview */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold text-[#002147] mb-6 border-b border-gray-100 pb-3">Issue Status Overview</h2>
                                <DashboardStats stats={stats} />
                            </div>

                            {/* Reported Issues */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
                                    <h2 className="text-xl font-bold text-[#002147]">My Reported Issues</h2>
                                    <button
                                        onClick={() => navigate('/report')}
                                        className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-[#002147] hover:bg-blue-900 text-white text-base font-bold rounded-lg transition-colors shadow-sm"
                                        aria-label="Report a new infrastructure issue"
                                    >
                                        <Plus size={20} />
                                        REPORT NEW ISSUE
                                    </button>
                                </div>

                                <IssueFilter currentFilter={filter} onFilterChange={setFilter} />

                                <div className="space-y-4 mt-6">
                                    {filteredIssues.length > 0 ? (
                                        filteredIssues.map((issue) => (
                                            <IssueCard key={issue.id} issue={issue} />
                                        ))
                                    ) : (
                                        <EmptyState />
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-2xl mx-auto mt-8">
                        <h2 className="text-2xl font-bold text-[#002147] mb-6 border-b border-gray-200 pb-4">Account Settings</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue={user?.name || ''} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <input type="email" className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue={user?.email || ''} readOnly />
                                <p className="text-xs text-gray-500 mt-1">Email address cannot be changed currently.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                <input type="tel" className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="(555) 000-0000" />
                            </div>

                            <hr className="border-gray-200" />

                            <div className="flex justify-end pt-2">
                                <button className="px-8 py-3 bg-[#002147] text-white font-bold rounded-lg hover:bg-blue-900 transition-colors shadow-sm">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Resolution Chart Drawer */}
            <AnimatePresence>
                {isChartDrawerOpen && (
                    <div className="fixed inset-0 z-[100] flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsChartDrawerOpen(false)}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm cursor-pointer"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-gray-200 p-6 flex flex-col overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-[#002147]">Stats Overview</h3>
                                <button
                                    onClick={() => setIsChartDrawerOpen(false)}
                                    className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>
                            <ResolutionChart stats={stats} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
