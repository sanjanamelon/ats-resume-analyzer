import axios from 'axios';

// Create an axios instance with common configurations
const api = axios.create({
    baseURL: '/api/',  // Base URL that will be handled by Vite proxy
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
});

// Add a request interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            throw new Error('Backend server is not running. Please start the Django development server.');
        }
        if (error.response.status === 404) {
            throw new Error('API endpoint not found. Please check the backend configuration.');
        }
        if (error.response.status >= 500) {
            throw new Error('Backend server error. Please check the server logs.');
        }
        return Promise.reject(error);
    }
);

// Add a request interceptor for custom headers
api.interceptors.request.use(
    (config) => {
        config.headers['X-Frontend-Request'] = 'true';
        return config;
    },
    (error) => Promise.reject(error)
);

// Function to check if backend is running
export const checkBackendStatus = async () => {
    try {
        const response = await api.get('health/');
        return response.status === 200;
    } catch (error) {
        return false;
    }
};

// Function to get backend status message
export const getBackendStatusMessage = async () => {
    try {
        const response = await api.get('health/');
        return {
            status: 'running',
            message: 'Backend server is running and ready to accept requests.'
        };
    } catch (error) {
        return {
            status: 'error',
            message: error.message || 'Backend server is not running. Please start the Django development server.'
        };
    }
};

export default api;
