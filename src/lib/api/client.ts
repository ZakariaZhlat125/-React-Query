import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { fakeRefresh } from '../auth/fakeAuthApi';
import { clearTokens, getAccessToken, setTokens } from '../auth/tokens';
import { useAuthStore } from '../../store/authStore';
import { queryClient } from '../queryClient';

export const API_URL: string = import.meta.env.VITE_API_URL;

// API layer = the only place that knows about HTTP, tokens and global errors.
export const api = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// 1) REQUEST interceptor → attach the access token to EVERY request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 2) RESPONSE interceptor → on 401, get a new access token and replay the request ONCE
//    (jsonplaceholder never returns 401 — this is the real-world pattern to learn)
type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const req = error.config as RetryableRequest | undefined;

    if (error.response?.status === 401 && req && !req._retry) {
      req._retry = true; // retry only once → no infinite loop
      try {
        const { access_token } = await fakeRefresh(); // real app: axios.post('/auth/refresh', ...)
        setTokens(access_token);
        req.headers.Authorization = `Bearer ${access_token}`;
        return api(req); // replay the original request
      } catch {
        // refresh failed → full logout
        clearTokens();
        useAuthStore.getState().logout();
        queryClient.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
