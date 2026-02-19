import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './layout/AuthLayout';
import Button from '../../components/ui/Button';

const NoAccountFound = () => {
    const navigate = useNavigate();

    return (
        <AuthLayout
            title="No account found"
            subtitle="We couldn't find an account associated with this Google email. Please sign up to create one."
        >
            <div style={{ textAlign: 'center' }}>
                <Button
                    onClick={() => navigate('/signup')}
                    variant="primary"
                    style={{ width: '100%', marginBottom: '1rem' }}
                >
                    Sign Up
                </Button>

                <Button
                    onClick={() => navigate('/login')}
                    variant="outline"
                    style={{ width: '100%' }}
                >
                    Use a different account
                </Button>
            </div>
        </AuthLayout>
    );
};

export default NoAccountFound;
