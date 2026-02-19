import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api',
});


// Add JWT to requests
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const adminService = {
    getDashboardData: () => api.get('/admin/analytics/dashboard'),
    updateIssueStatus: (id, status) => api.put(`/admin/issues/${id}/status`, { status }),
};


export default api;
