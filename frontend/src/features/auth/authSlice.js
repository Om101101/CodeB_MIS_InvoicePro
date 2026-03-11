import { createSlice } from "@reduxjs/toolkit";

// Safe localStorage helper (private browsing mein crash nahi karega)
const safeStorage = {
  get: (key) => { try { return localStorage.getItem(key); } catch { return null; } },
  set: (key, val) => { try { localStorage.setItem(key, val); } catch { console.warn("Storage unavailable"); } },
  remove: (key) => { try { localStorage.removeItem(key); } catch {} },
};

const initialState = {
  user: null,
  token: safeStorage.get("token"),
  isAuthenticated: !!safeStorage.get("token"),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    // Login shuru hone par (API call se pehle)
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    // Login successful
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      safeStorage.set("token", action.payload.token);
    },

    // Login failed
    loginFailure: (state, action) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload || "Login failed";
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      safeStorage.remove("token");
    },

    // Error manually clear karne ke liye (form reset etc.)
    clearError: (state) => {
      state.error = null;
    },

  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } =
  authSlice.actions;

export default authSlice.reducer;