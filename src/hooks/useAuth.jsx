import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth має використовуватися всередину AuthProvider");
  }

  const { login, logout, setLoading } = context;

  const register = async (email, password, name) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Date.now(),
          email,
          password,
          name,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Помилка реєстрації");

      const userData = await response.json();
      const token = btoa(`${email}:${password}`);
      login(userData, token);
      return userData;
    } catch (error) {
      console.error("Помилка реєстрації:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users?email=${email}`);
      const users = await response.json();

      if (!users.length || users[0].password !== password) {
        throw new Error("Невірна пошта або пароль");
      }

      const userData = users[0];
      const token = btoa(`${email}:${password}`);
      login(userData, token);
      return userData;
    } catch (error) {
      console.error("Помилка входу:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    ...context,
    register,
    loginUser,
  };
};
