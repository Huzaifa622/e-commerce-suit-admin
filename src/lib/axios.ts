import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  withCredentials: true, // Send cookies with requests
});

api.interceptors.request.use(
  (config) => {
    // In a real app, if you are not using HttpOnly cookies for the token,
    // you would attach the Authorization header here.
    // For HttpOnly cookies, the browser handles it automatically.
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Centralized error handling
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized, but only on the client side
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
