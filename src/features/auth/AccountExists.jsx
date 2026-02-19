import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './layout/AuthLayout';
import Button from '../../components/ui/Button';

const AccountExists = () => {
    const navigate = useNavigate();

    return (
        <AuthLayout
            title="You already have an account"
            subtitle="It looks like you've already signed up with this email. Please log in to continue."
        >
            <div style={{ textAlign: 'center' }}>
                <Button
                    onClick={() => navigate('/login')}
                    variant="primary"
                    style={{ width: '100%', marginBottom: '1rem' }}
                >
                    Log In
                </Button>

                <Button
                    onClick={() => navigate('/signup')}
                    variant="outline"
                    style={{ width: '100%' }}
                >
                    Use a different account
                </Button>
            </div>
        </AuthLayout>
    );
};

export default AccountExists;
