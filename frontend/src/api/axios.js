import axios from "axios";
import { store } from "../app/store";
import { logout } from "../features/auth/authSlice";

// ─── Axios Instance ────────────────────────────────────────────────────────────
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ───────────────────────────────────────────────────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
API.interceptors.response.use(
  (response) => response,

  (error) => {
    const status  = error.response?.status;
    const message = error.response?.data?.message;

    // ✅ 401 — Redux se logout dispatch karo (window.location nahi)
    if (status === 401) {
      store.dispatch(logout());          // token + state dono saaf
      window.location.replace("/login"); // replace taaki back button kaam na kare
    }

    if (status === 403) {
      console.warn("⛔ Access denied:", message);
    }

    if (status >= 500) {
      console.error("💥 Server error:", message);
    }

    return Promise.reject({
      status,
      message: message || "Something went wrong. Please try again.",
      raw: error,
    });
  }
);

export default API;