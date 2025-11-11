import { useState } from "react";
import { API_BASE_URL } from "../config/api";

export const useDelete = (endpoint) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const remove = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
};
