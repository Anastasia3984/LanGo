import { createContext, useState, useContext, useEffect } from "react";
import { apiPost } from "../services/api";
export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiPost("/auth/login", { email, password });
      const { user, token } = response;

      localStorage.setItem("user", JSON.stringify(user));
      if (token) localStorage.setItem("token", token);

      setUser(user);
      return { success: true, user };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await apiPost("/auth/register", userData);
      const { user, token } = response;

      localStorage.setItem("user", JSON.stringify(user));
      if (token) localStorage.setItem("token", token);

      setUser(user);
      return { success: true, user };
    } catch (error) {
      console.error("Signup failed:", error);
      return { success: false, error: error.message || "Registration failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    isAuth: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
