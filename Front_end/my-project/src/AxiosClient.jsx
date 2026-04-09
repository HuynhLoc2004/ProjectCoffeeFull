import axios from "axios";
import { getAccessToken } from "./ManagerAccessToken/ManagerAccessToken";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  (config) => {
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
