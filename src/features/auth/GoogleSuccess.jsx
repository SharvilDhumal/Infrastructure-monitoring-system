import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const GoogleSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [message, setMessage] = useState('Finalizing authentication...');

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (token) {
            // Save token
            sessionStorage.setItem('token', token);

            // Optional: Store user type/flow if needed, but requirements say redirect to / and NOT /dashboard

            // Show success message briefly if desired, or just redirect
            setMessage('Authentication successful! Redirecting...');

            // Short delay or immediate redirect? User said "Show a short loading message"
            const timer = setTimeout(() => {
                navigate('/', { replace: true });
            }, 1000); // 1.5s delay to show message

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
