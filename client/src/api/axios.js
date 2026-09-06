import axios from 'axios';

const api = axios.create({
    baseURL: 'https://recipe-sharing-platfrom-using-ai-nu-pi.vercel.app/api', // Connects to our backend
});

// Interceptor to add JWT token to requests if it exists
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
