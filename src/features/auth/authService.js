const API_URL = 'http://localhost:5000/api/auth/';

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
        const error = new Error(data.message || 'Something went wrong');
        error.response = {
            status: response.status,
            data: data
        };
        throw error;
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
        const error = new Error(data.message || 'Something went wrong');
        error.response = {
            status: response.status,
            data: data
        };
        throw error;
    }

    if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

const resetPassword = async (token, newPassword, id) => {
    const response = await fetch(API_URL + 'reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword, id }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
};

const verifyEmail = async (userId, token) => {
    const response = await fetch(API_URL + 'verify-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, token }),
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
    resetPassword,
    verifyEmail
};

export default authService;
