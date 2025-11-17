import React, { useState } from "react";
import styles from "./AddHomework.module.css";
import InputField from "../../components/common/InputField";
import LinkableTextArea from "../../components/common/LinkableTextArea";
import Button from "../../components/common/Button";
import { usePost } from "../../hooks/usePost";

const AddHomework = ({ closeModal, setNotification, allStudents = [] }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [studentId, setStudentId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { post: createAssignment } = usePost("/assignments");
  const { post: createSubmission } = usePost("/submissions");

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "*add title";
    if (!description.trim()) newErrors.description = "*add description";
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
      const newAssignment = await createAssignment({
        id: `assign_${Date.now()}`,
        title,
        description,
        created_at: new Date().toISOString(),
      });

      if (!newAssignment || !newAssignment.id) {
        throw new Error("Failed to create assignment template.");
      }
      await createSubmission({
        id: `sub_${Date.now()}`,
        assignmentId: newAssignment.id,
        student_id: studentId,
        status: "unsolved",
        solution: "",
        comment: "",
        grade: null,
        dueDate: dueDateTimeString,
        submittedDate: null,
      });

      if (setNotification) setNotification("Homework has been assigned!");
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
            placeholder="Description (select text and click 🔗 to add link)"
            disabled={isLoading}
          />
          {errors.description && (
            <p className={styles.errorText}>{errors.description}</p>
          )}
        </div>

        <div>
          <select
            id="student-select"
            value={studentId}
            onChange={(e) => {
              setStudentId(e.target.value);
              if (errors.studentId) setErrors({ ...errors, studentId: "" });
            }}
            className={styles.selectField}
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
