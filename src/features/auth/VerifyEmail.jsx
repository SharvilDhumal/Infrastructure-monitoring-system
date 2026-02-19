import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from './authService';
import { toast } from 'react-hot-toast';

const VerifyEmail = () => {
    const { id, token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error

    useEffect(() => {
        const verify = async () => {
            try {
                await authService.verifyEmail(id, token);
                setStatus('success');
                toast.success('Email verified successfully');
                // Redirect to success page
                navigate('/email-verified', {
                    state: {
                        title: 'Email Verified!',
                        subtitle: 'Your email has been successfully verified. You can now access your account.',
                        buttonText: 'Login Now'
                    }
                });
            } catch (error) {
                console.error(error);
                setStatus('error');
                toast.error(error.message || 'Verification failed');
            }
        };

        if (id && token) {
            verify();
        }
    }, [id, token, navigate]);

    if (status === 'verifying') {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #f3f3f3',
                    borderTop: '3px solid #3498db',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p>Verifying your email...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                textAlign: 'center',
                padding: '1rem'
            }}>
                <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Verification Failed</h2>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>The link is invalid or has expired.</p>
                <button
                    onClick={() => navigate('/login')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#1a1a1a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    Back to Login
                </button>
            </div>
        );
    }

    return null; // Success handles redirect
};

export default VerifyEmail;
