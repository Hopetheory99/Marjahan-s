/**
 * Centralized API client configuration
 * Handles authentication token injection, error mapping, and request/response interceptors
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';

let authContext: ReturnType<typeof useAuth> | null = null;

// This will be called from App.tsx to inject auth context
export const initializeApiClient = (auth: ReturnType<typeof useAuth>) => {
  authContext = auth;
};

const createApiClient = (): AxiosInstance => {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  const client = axios.create({
    baseURL: apiBase.replace(/\/$/, ''),
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Include cookies (refresh token)
  });

  // Request interceptor: Add access token
  client.interceptors.request.use(
    (config) => {
      if (authContext?.accessToken) {
        config.headers.Authorization = `Bearer ${authContext.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor: Handle token expiry and errors
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as Record<string, unknown>;

      // If 401 and we have a refresh token, try to refresh
      if (error.response?.status === 401 && !originalRequest._retry && authContext) {
        originalRequest._retry = true;

        try {
          const success = await authContext.refreshToken();
          if (success && authContext?.accessToken) {
            originalRequest.headers.Authorization = `Bearer ${authContext.accessToken}`;
            return client(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }

      return Promise.reject(error);
    },
  );

  return client;
};

export const apiClient = createApiClient();

export default apiClient;
