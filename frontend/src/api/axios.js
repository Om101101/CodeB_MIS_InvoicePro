import axios from "axios";

// ─── Axios Instance ────────────────────────────────────────────────────────────
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,        // cookies automatically bhejo har request mein
  timeout: 10000,               // 10s se zyada hang nahi karega
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ───────────────────────────────────────────────────────
API.interceptors.request.use(
  (config) => {
    // Token localStorage mein hai to header mein lagao
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
  (response) => response, // 2xx — as it is return karo

  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    // Session expire — login page pe bhejo
    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // Permission nahi — quietly log karo
    if (status === 403) {
      console.warn("⛔ Access denied:", message);
    }

    // Server crash
    if (status >= 500) {
      console.error("💥 Server error:", message);
    }

    // Caller ko meaningful error do, raw axios error nahi
    return Promise.reject({
      status,
      message: message || "Something went wrong. Please try again.",
      raw: error,
    });
  }
);

export default API;