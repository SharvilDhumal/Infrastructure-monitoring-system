import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const LandingPage = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            padding: '2rem'
        }}>
            <h1 style={{ fontSize: '3rem', color: '#111827', marginBottom: '1rem' }}>
                Welcome to the App
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem' }}>
                This is the landing page.
            </p>
            <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="primary">Go to Login</Button>
            </Link>
        </div>
    );
};

export default LandingPage;
