import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const GoogleSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [message, setMessage] = useState('Finalizing authentication...');

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        const role = searchParams.get('role');

        if (token) {
            // Save token
            sessionStorage.setItem('token', token);

            // Role-Based Redirection
            const roleRoutes = {
                'pothole_admin': '/pothole',
                'bridge_admin': '/bridge',
                'streetlight_admin': '/streetlights',
                'water_admin': '/water-leakage',
                'admin': '/main-dashboard'
            };

            setMessage('Authentication successful! Redirecting...');

            const timer = setTimeout(() => {
                if (roleRoutes[role]) {
                    navigate(roleRoutes[role], { replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            }, 1000); // 1s delay to show message

            return () => clearTimeout(timer);
        } else {
            // No token handling
            navigate('/login?error=auth_failed', { replace: true });
        }
    }, [location, navigate]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            {/* Loading Spinner */}
            <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #e2e8f0',
                borderTopColor: '#1a1a1a',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />

            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>

            <h2 style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1.125rem',
                color: '#1a1a1a',
                fontWeight: '500'
            }}>
                {message}
            </h2>
        </div>
    );
};

export default GoogleSuccess;
