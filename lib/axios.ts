import axios, {
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_BASE_URL } from './config';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
      const headers = new AxiosHeaders(config.headers);
      headers.set('Authorization', `Bearer ${token}`);
      config.headers = headers;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const { logout } = useAuthStore.getState();
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);

export default api;
