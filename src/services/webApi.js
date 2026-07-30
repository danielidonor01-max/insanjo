import axios from "axios";
import { ENV } from "../config/env";

const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
  timeoutErrorMessage: "Request timed out. Please check your connection.",
});

// Lightweight interceptor: no AsyncStorage needed for public pages
api.interceptors.request.use(
  (config) => {
    // Optionally read token from localStorage for authenticated public requests
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      const isNetworkError =
        error.code === "ERR_NETWORK" ||
        error.message?.includes("Network Error");

      error.userMessage = isNetworkError
        ? "Unable to connect. Please check your internet connection."
        : "Request timed out. Please try again.";

      return Promise.reject(error);
    }

    const status = error.response.status;

    if (status === 401) {
      localStorage.removeItem("authToken");
      error.userMessage = "Session expired. Please log in again.";
      return Promise.reject(error);
    }

    if (status === 403) {
      error.userMessage = "You don't have permission to perform this action.";
      return Promise.reject(error);
    }

    if (status === 404) {
      error.userMessage = "The requested resource was not found.";
      return Promise.reject(error);
    }

    if (status === 429) {
      error.userMessage = "Too many requests. Please slow down.";
      return Promise.reject(error);
    }

    if (status >= 500) {
      error.userMessage = "Server error. Please try again later.";
      return Promise.reject(error);
    }

    error.userMessage =
      error.response?.data?.message || "Something went wrong. Please try again.";
    return Promise.reject(error);
  },
);

export default api;