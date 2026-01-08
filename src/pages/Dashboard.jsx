import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../features/auth/authService';
import Button from '../components/ui/Button';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                borderBottom: '1px solid #eee',
                paddingBottom: '1rem'
            }}>
                <h1 style={{ margin: 0 }}>Dashboard</h1>
                <Button
                    onClick={handleLogout}
                    variant="secondary" // Assuming secondary exists or falls back to default styling, or I can use inline styling to be minimal
                    style={{ width: 'auto' }}
                >
                    Logout
                </Button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <h2>Welcome to the protected area.</h2>
                <p>You are now logged in.</p>
            </div>
        </div>
    );
};

export default Dashboard;
