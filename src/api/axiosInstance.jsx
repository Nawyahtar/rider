// src/api/axiosInstance.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

let store = null;

export const setAuthStore = (contextValue) => {
  store = contextValue;
};

const axiosInstance = axios.create({
  baseURL: 'https://your-api.com', // 🔁 Replace with your real base URL
  timeout: 10000,
});

// Add token to all requests
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors without refreshing
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && store?.signOut) {
      // ⛔ Token invalid → Log out and go to login screen
      await AsyncStorage.removeItem('userToken');
      store.signOut(); // Triggers logout flow from AuthContext
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
