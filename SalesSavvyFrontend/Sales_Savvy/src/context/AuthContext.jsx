/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback } from "react";
import { loginUser as apiLogin, logoutUser as apiLogout, registerUser as apiRegister } from "../services/authApi";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [role, setRole] = useState(() => localStorage.getItem("role") || "");
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const res = await apiLogin(credentials);
      if (res.ok) {
        const userToken = res.data?.token || "";
        const userRole = res.data?.role || "";
        const uname = credentials.username || res.data?.username || "";

        if (userToken) {
          setToken(userToken);
          localStorage.setItem("token", userToken);
        }
        if (uname) {
          setUsername(uname);
          localStorage.setItem("username", uname);
        }
        if (userRole) {
          setRole(userRole);
          localStorage.setItem("role", userRole);
        }
        return { success: true, role: userRole, message: res.data?.message || "Login successful!" };
      } else {
        return { success: false, error: res.error || "Invalid credentials." };
      }
    } catch {
      return { success: false, error: "Unable to connect to server." };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    try {
      const res = await apiRegister(userData);
      if (res.ok) {
        return { success: true, message: res.data?.message || "User registered successfully!" };
      } else {
        return { success: false, error: res.error || "Registration failed." };
      }
    } catch {
      return { success: false, error: "Unable to connect to server." };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setToken("");
      setUsername("");
      setRole("");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
    }
  }, []);

  const value = {
    token,
    username,
    role,
    loading,
    isAuthenticated: Boolean(token || username),
    login,
    register,
    logout,
    setUsername,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { useAuth } from "../hooks/useAuth";
