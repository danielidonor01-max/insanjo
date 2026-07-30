import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { ENV } from "../config/env";

export const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
  timeoutErrorMessage: "Request timed out. Please check your connection.",
});

// ============================
// TOKEN HANDLING
// ============================

const TOKEN_KEY = "authToken";

export const saveAuthToken = async (token) => {
  if (!token) return;
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const clearAuthToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch {
    // Silently fail; token clearing is best-effort
  }
};

// ============================
// RETRY CONFIG
// ============================

const MAX_RETRIES = 2;
const RETRYABLE_STATUSES = [408, 429, 500, 502, 503, 504];
const RETRYABLE_ERRORS = ["ECONNABORTED", "ERR_NETWORK", "NETWORK_ERROR"];

const shouldRetry = (error) => {
  if (error.code && RETRYABLE_ERRORS.includes(error.code)) return true;
  if (error.response?.status && RETRYABLE_STATUSES.includes(error.response.status)) return true;
  return false;
};

// ============================
// INTERCEPTORS
// ============================

api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (true) {
      console.log("➡️ API Request:", {
        url: config.url,
        method: config.method,
        data: config.data,
      });
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    if (true) {
      console.log("✅ API Response:", {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  async (error) => {
    // Network or timeout errors with no response
    if (!error.response) {
      const isNetworkError =
        error.code === "ERR_NETWORK" ||
        error.code === "NETWORK_ERROR" ||
        error.message?.includes("Network Error");

      if (ENV.isQA) {
        console.error("❌ Network Error:", {
          url: error?.config?.url,
          method: error?.config?.method,
          code: error.code,
          message: error.message,
        });
      }

      // Attach user-friendly message
      error.userMessage = isNetworkError
        ? "Unable to connect. Please check your internet connection."
        : "Request timed out. Please try again.";

      return Promise.reject(error);
    }

    if (ENV.isQA) {
      console.error("❌ API Error:", {
        url: error?.config?.url,
        method: error?.config?.method,
        status: error?.response?.status,
        data: error?.response?.data,
      });
    }

    const status = error.response.status;

    // Unauthorized — clear token
    if (status === 401) {
      await clearAuthToken();
      error.userMessage = "Session expired. Please log in again.";
      return Promise.reject(error);
    }

    // Forbidden
    if (status === 403) {
      error.userMessage = "You don't have permission to perform this action.";
      return Promise.reject(error);
    }

    // Not found
    if (status === 404) {
      error.userMessage = "The requested resource was not found.";
      return Promise.reject(error);
    }

    // Rate limiting
    if (status === 429) {
      error.userMessage = "Too many requests. Please slow down.";
      return Promise.reject(error);
    }

    // Server errors
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