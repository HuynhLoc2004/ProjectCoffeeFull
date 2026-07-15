import axios from "axios";
import { getAccessToken } from "./ManagerAccessToken/ManagerAccessToken";

export const getApiOrigin = () => {
  const configuredUrl = import.meta.env.VITE_API_URL;
  return configuredUrl
    ? new URL(configuredUrl, window.location.origin).origin
    : window.location.origin;
};

const axiosClient = axios.create({
  // Same-origin `/api` works locally and behind Nginx. Railway can override it
  // with the public backend URL at build time (for example https://api.example.com/api).
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  (config) => {
    const isRefreshEndpoint =
      config.url?.startsWith("/auth/refresh_token") ||
      config.url?.startsWith("/refresh_token");

    // The refresh endpoint must authenticate with the HttpOnly refresh cookie.
    // Sending an expired access token here makes Spring Security reject the
    // request before it can read the still-valid refresh cookie.
    if (isRefreshEndpoint) {
      config.withCredentials = true;
      if (config.headers) {
        delete config.headers.Authorization;
      }
      return config;
    }

    const publicEndpoints = [
      "/auth/login",
      "/user/registry",
      "/user/forgot-password",
      "/email/send-OTP-forgotPassword",
      "/email/verify-OTP-forgotPassword",
    ];
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.startsWith(endpoint),
    );

    // Public authentication flows must not carry stale access/refresh tokens.
    // Spring Security will try to validate any supplied token even when the
    // endpoint is permitAll, which can turn a public request into a 401/403.
    if (isPublicEndpoint) {
      config.withCredentials = false;
      if (config.headers) {
        delete config.headers.Authorization;
      }
      return config;
    }

    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle 401 errors
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, but don't auto-refresh here
      // Let individual components handle refresh if needed
      console.warn("401 Unauthorized - token might be expired");
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
