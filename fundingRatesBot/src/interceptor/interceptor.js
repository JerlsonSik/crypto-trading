import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

// Automatically add base URL to axios instance, dont have to add manually
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Create an interceptor when every api called, to find JWT Token in local storage
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
