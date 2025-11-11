import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useFetch } from "./useFetch";
import { apiDelete, apiPost } from "../services/api";

export const useStudents = () => {
  const { user } = useAuth();
  const endpoint = user ? `/users?role=student&teacherId=${user.id}` : null;
  const { data: fetchedStudents, loading, error } = useFetch(endpoint);
  const [students, setStudents] = useState(null);
  useEffect(() => {
    if (fetchedStudents) {
      setStudents(fetchedStudents);
    }
  }, [fetchedStudents]);
  const deleteStudent = async (studentId) => {
    try {
      await apiDelete(`/users/${studentId}`);
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== studentId),
      );
    } catch (err) {
      console.error("Failed to delete student:", err);
      throw err;
    }
  };
  const inviteStudent = async (email) => {
    if (!user) return;

    const inviteData = {
      id: `inv_${Date.now()}`,
      email: email,
      teacher_id: user.id,
      status: "pending",
      created_at: new Date().toISOString(),
      accepted_at: null,
      token: `token_${Math.random().toString(36).substr(2, 9)}`,
    };

    try {
      await apiPost("/invitations", inviteData);
      return inviteData;
    } catch (err) {
      console.error("Failed to invite student:", err);
      throw err;
    }
  };

  return {
    students,
    loading,
    error,
    deleteStudent,
    inviteStudent,
  };
};
