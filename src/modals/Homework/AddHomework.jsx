import React, { useState } from "react";
import styles from "./AddHomework.module.css";
import InputField from "../../components/common/InputField";
import LinkableTextArea from "../../components/common/LinkableTextArea";
import Button from "../../components/common/Button";
import { usePost } from "../../hooks/usePost";
import { useAuth } from "../../context/AuthContext";

const AddHomework = ({ closeModal, setNotification, allStudents = [] }) => {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [studentId, setStudentId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { post: createAssignment } = usePost("/assignments");

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "*add title";
    if (!description.trim()) newErrors.description = "*add description";
    if (!studentId) newErrors.studentId = "*select a student";
    if (!dueDate) newErrors.dueDate = "*select due date";
    if (!dueTime) newErrors.dueTime = "*select due time";

    if (dueDate && dueTime) {
      const selectedDateTime = new Date(`${dueDate}T${dueTime}`);
      if (selectedDateTime <= new Date()) {
        newErrors.dueDate = "date has to be in future";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const dueDateTimeString = new Date(`${dueDate}T${dueTime}`).toISOString();
      await createAssignment({
        title,
        description,
        dueDate: dueDateTimeString,
        teacherId: user.id,
        studentId: studentId,
      });

      if (setNotification) setNotification("Homework assigned successfully!");
      if (closeModal) closeModal();

      setTimeout(() => {
        if (setNotification) setNotification("");
      }, 5000);
    } catch (err) {
      console.error("Failed to add homework:", err);
      setErrors({ submit: "Failed to add homework. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.homeworkModal}>
      <h2 className={styles.title}>Homework</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <InputField
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.inputField}
            required
            disabled={isLoading}
          />
          {errors.title && <p className={styles.errorText}>{errors.title}</p>}
        </div>

        <div>
          <LinkableTextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            disabled={isLoading}
          />
          {errors.description && (
            <p className={styles.errorText}>{errors.description}</p>
          )}
        </div>

        <div>
          <select
            value={studentId}
            onChange={(e) => {
              setStudentId(e.target.value);
              if (errors.studentId) setErrors({ ...errors, studentId: "" });
            }}
            className={styles.selectField}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              marginBottom: "15px",
            }}
            required
            disabled={isLoading}
          >
            <option value="">-- Choose a student --</option>
            {allStudents &&
              allStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.email})
                </option>
              ))}
          </select>
          {errors.studentId && (
            <p className={styles.errorText}>{errors.studentId}</p>
          )}
        </div>

        <div className={styles.dateAndTimeGroup}>
          <div>
            <InputField
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                if (errors.dueDate) setErrors({ ...errors, dueDate: "" });
              }}
              className={styles.inputField}
              required
              disabled={isLoading}
            />
            {errors.dueDate && (
              <p className={styles.errorText}>{errors.dueDate}</p>
            )}
          </div>
          <div>
            <InputField
              type="time"
              value={dueTime}
              onChange={(e) => {
                setDueTime(e.target.value);
                if (errors.dueTime) setErrors({ ...errors, dueTime: "" });
              }}
              className={styles.inputField}
              required
              disabled={isLoading}
            />
            {errors.dueTime && (
              <p className={styles.errorText}>{errors.dueTime}</p>
            )}
          </div>
        </div>

        {errors.submit && <p className={styles.errorText}>{errors.submit}</p>}

        <Button
          type="submit"
          variant="orange"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Assigning..." : "Assign"}
        </Button>
      </form>
    </div>
  );
};

export default AddHomework;
