import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ LOGIN FUNCTION
  const login = async (data) => {
    try {
      const res = await API.post("/auth/login", data);

      // Save token in localStorage
      localStorage.setItem("token", res.data.token);

      // Set full user object
      setUser(res.data.user);
    } catch (error) {
      console.log("Login Error:", error);
      throw error;
    }
  };

  // ✅ LOGOUT FUNCTION
  const logout = async () => {
    try {
      await API.post("/auth/logout");

      // Remove token
      localStorage.removeItem("token");

      // Clear user
      setUser(null);
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  // ✅ CHECK AUTH ON PAGE LOAD
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await API.get("/auth/me");

        setUser(res.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
