const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/auth/';

const register = async (userData) => {
    const response = await fetch(API_URL + 'signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
};

const login = async (userData) => {
    const response = await fetch(API_URL + 'login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    if (data.token) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
};

const forgotPassword = async (email) => {
    const response = await fetch(API_URL + 'forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
};

const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
};

const resetPassword = async (token, newPassword) => {
    const response = await fetch(API_URL + 'reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
};

const authService = {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword
};

export default authService;
