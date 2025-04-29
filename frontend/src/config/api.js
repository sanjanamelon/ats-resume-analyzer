import axios from 'axios';

// Create an axios instance with common configurations
const api = axios.create({
    baseURL: 'http://localhost:8000/api/', // Django development server URL with API prefix
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000, // 5 second timeout
});

// Add a request interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Check if this is a network error
        if (!error.response) {
            throw new Error('Backend server is not running. Please start the Django development server with:\n\npython manage.py runserver 8000\n\nMake sure you are in the backend directory when running this command.');
        }
        // Handle different HTTP status codes
        if (error.response.status === 404) {
            throw new Error('API endpoint not found. Please check the backend configuration.');
        }
        if (error.response.status >= 500) {
            throw new Error('Backend server error. Please check the server logs.');
        }
        return Promise.reject(error);
    }
);

// Add a request interceptor to check server status
api.interceptors.request.use(
    (config) => {
        // Add a custom header to indicate this is a frontend request
        config.headers['X-Frontend-Request'] = 'true';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Function to check if backend is running
export const checkBackendStatus = async () => {
    try {
        // Try to connect to a simple endpoint
        const response = await api.get('health/');
        return response.status === 200;
    } catch (error) {
        return false;
    }
};

// Function to get backend status message
export const getBackendStatusMessage = async () => {
    try {
        // Try to connect to a simple endpoint
        const response = await api.get('health/');
        return {
            status: 'running',
            message: 'Backend server is running and ready to accept requests.'
        };
    } catch (error) {
        return {
            status: 'error',
            message: error.message || 'Backend server is not running. Please start the Django development server with:\n\npython manage.py runserver 8000\n\nMake sure you are in the backend directory when running this command.'
        };
    }
};

export default api;
