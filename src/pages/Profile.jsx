import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bell } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import IssueCard from '../components/IssueCard';
import PieChartComponent from '../components/PieChartComponent';
import authService from '../features/auth/authService';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [issues, setIssues] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        resolved: 0,
    });
    const [loading, setLoading] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const notifications = []; // Mock notifications

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

            // Ensure API URL matches backend
            const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/issues/user';

            const response = await axios.get(API_URL, config);
            setIssues(response.data.issues);
            setStats(response.data.stats);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <Sidebar
                user={user}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={handleLogout}
            />

            <div className="pl-64 transition-all duration-300">
                {/* Top Header */}
                <header className="h-20 border-b border-gray-800 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">

                        {/* Back button moved to Sidebar */}
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                {activeTab === 'dashboard' ? 'User Dashboard' : 'Settings'}
                            </h1>
                            {activeTab === 'dashboard' && (
                                <p className="text-sm text-gray-400">
                                    Monitoring active for {stats.total} reported issues
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                        >
                            <Bell className="w-5 h-5" />
                        </button>
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-72 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl py-2 z-50">
                                <div className="px-4 py-2 border-b border-gray-800">
                                    <h3 className="font-semibold text-white">Notifications</h3>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif, index) => (
                                            <div key={index} className="px-4 py-3 hover:bg-gray-800 cursor-pointer">
                                                <p className="text-sm text-gray-300">{notif.message}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-8 text-center text-gray-400 text-sm">
                                            No notifications yet
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-8">
                    {activeTab === 'dashboard' ? (
                        <div className="max-w-6xl mx-auto space-y-8">
                            {/* Stats & Pie Chart Section */}
                            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    <div>
                                        <h2 className="text-xl font-semibold mb-6">Issue Status Overview</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            {Object.entries(stats).map(([key, value]) => (
                                                key !== 'total' && (
                                                    <div key={key} className="bg-black/40 rounded-xl p-4 border border-gray-800">
                                                        <span className="text-gray-400 capitalize text-sm">{key}</span>
                                                        <div className="text-2xl font-bold mt-1">{value}</div>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                    <div className="h-64 flex items-center justify-center">
                                        <PieChartComponent stats={stats} />
                                    </div>
                                </div>
                            </div>

                            {/* Reported Issues List */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">My Reported Issues</h2>
                                    {issues.length > 0 && (
                                        <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                                            View All
                                        </button>
                                    )}
                                </div>

                                {issues.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-900/30 rounded-2xl border border-gray-800 border-dashed">
                                        <p className="text-gray-400">No issues reported yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {issues.map((issue) => (
                                            <IssueCard key={issue._id} issue={issue} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={user?.name || ''}
                                            disabled
                                            className="w-full bg-black/40 border border-gray-800 rounded-lg px-4 py-2 text-white opacity-50 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="w-full bg-black/40 border border-gray-800 rounded-lg px-4 py-2 text-white opacity-50 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <p className="text-sm text-gray-500">
                                            Edit functionality coming soon. To update your profile details, please contact support.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Profile;
