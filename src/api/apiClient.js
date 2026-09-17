import axios from "axios";
import { API_BASE } from "../constants/endpoints";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Let the browser set multipart/form-data with boundary when data is FormData
  if (config.data instanceof FormData) {
    if (config.headers?.delete) {
      config.headers.delete("Content-Type");
      config.headers.delete("content-type");
    } else {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }
  } else if (!config.headers["Content-Type"] && !config.headers["content-type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("[api] 401 Unauthorized - invalid or expired admin session.");
      // If we are holding a demo token or expired token and got rejected by the live server
      const currentToken = localStorage.getItem("adminToken");
      if (currentToken) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("isAuthenticated");
        if (typeof window !== "undefined" && window.location.pathname !== "/" && window.location.pathname !== "/login") {
          window.location.href = "/?session=expired";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
