import { useState, useEffect } from "react";
import { apiPatch, apiDelete } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useFetch } from "./useFetch";
export const useTasks = (studentId) => {
  const { user } = useAuth();
  const idToFetch = studentId || (user ? user.id : null);
  const endpoint = idToFetch
    ? `/submissions?student_id=${idToFetch}&_expand=assignment`
    : null;
  const { data: fetchedTasks, loading, error } = useFetch(endpoint);
  const [tasks, setTasks] = useState(null);

  useEffect(() => {
    if (fetchedTasks) {
      setTasks(fetchedTasks);
    }
  }, [fetchedTasks]);
  const updateTask = async (taskId, updatedData) => {
    try {
      const updatedSubmission = await apiPatch(
        `/submissions/${taskId}`,
        updatedData,
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? updatedSubmission : task,
        ),
      );
      return updatedSubmission;
    } catch (err) {
      console.error("Failed to update task:", err);
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await apiDelete(`/submissions/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    updateTask,
    deleteTask,
  };
};
