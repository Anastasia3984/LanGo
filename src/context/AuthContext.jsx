import React, { createContext, useState, useContext, useEffect } from "react";
import { API_BASE_URL } from "../config/api";
import { apiGet, apiPost, apiPatch } from "../services/api";

export const AuthContext = createContext(null);

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
      const users = await apiGet(`/users?email=${email}&password=${password}`);
      if (users.length === 0) {
        throw new Error("Invalid email or password");
      }
      const foundUser = users[0];
      localStorage.setItem("user", JSON.stringify(foundUser));
      setUser(foundUser);
      return { success: true, user: foundUser };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      const existingUser = await apiGet(`/users?email=${userData.email}`);
      if (existingUser.length > 0) {
        throw new Error("Email already in use");
      }
      const newUser = await apiPost("/users", {
        ...userData,
        createdAt: new Date().toISOString(),
      });
      const invites = await apiGet(
        `/invitations?email=${userData.email}&status=pending`,
      );
      if (invites.length > 0 && newUser.role === "student") {
        const invite = invites[0];
        const updatedUser = await apiPatch(`/users/${newUser.id}`, {
          teacherId: invite.teacher_id,
        });
        await apiPatch(`/invitations/${invite.id}`, {
          status: "accepted",
          accepted_at: new Date().toISOString(),
        });
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      } else {
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
        return { success: true, user: newUser };
      }
    } catch (error) {
      console.error("Signup failed:", error);
      return { success: false, error: error.message };
    }
  };
  const logout = () => {
    localStorage.removeItem("user");
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
