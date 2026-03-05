import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../features/auth/layout/AuthLayout';
import Button from '../components/ui/Button';

const EmailVerified = () => {
    return (
        <AuthLayout title="" subtitle="">
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#e6f4ea',
                    borderRadius: '50%',
                    margin: '0 auto 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    color: '#1e8e3e'
                }}>
                    ✓
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>
                    Email Verified
                </h2>

                <p style={{ color: '#666', marginBottom: '2rem' }}>
                    Your email has been successfully verified. Welcome to the platform!
                </p>

                <Link to="/landing" style={{ textDecoration: 'none' }}>
                    <Button variant="primary">Get Started</Button>
                </Link>
            </div>
        </AuthLayout>
    );
};

export default EmailVerified;
