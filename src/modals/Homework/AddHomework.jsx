import React, { useState } from "react";
import styles from "./AddHomework.module.css";
import InputField from "../../components/common/InputField";
import LinkableTextArea from "../../components/common/LinkableTextArea";
import Button from "../../components/common/Button";

const AddHomework = ({
  closeModal,
  setNotification,
  studentName = "",
  allStudents = [],
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [student, setStudent] = useState(studentName);
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (student.trim()) {
      const studentExists = allStudents.some(
        (s) => s.name.toLowerCase() === student.trim().toLowerCase(),
      );
      if (!studentExists) {
        newErrors.student = "Student not found!";
      }
    }

    if (!dueDate) {
      newErrors.dueDate = "Please select due date";
    }

    if (!dueTime) {
      newErrors.dueTime = "Please select due time";
    }

    if (dueDate && dueTime) {
      const selectedDateTime = new Date(`${dueDate}T${dueTime}`);
      const now = new Date();

      if (selectedDateTime <= now) {
        newErrors.dueDate = "Due date must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim() && student.trim()) {
      if (validateForm()) {
        const dueDateTimeString = `${dueDate}T${dueTime}`;
        const dueDateTimeObject = new Date(dueDateTimeString);

        console.log("Adding homework:", {
          title,
          description,
          student,
          dueDate: dueDateTimeObject,
        });

        if (typeof setNotification === "function") {
          setNotification("Homework has been added!");
        }

        if (typeof closeModal === "function") {
          closeModal();
        }

        setTimeout(() => {
          if (typeof setNotification === "function") {
            setNotification("");
          }
        }, 5000);
      }
    }
  };

  return (
    <div className={styles.homeworkModal}>
      <h2 className={styles.title}>Homework</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <InputField
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.inputField}
          required
        />

        <LinkableTextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (select text and click 🔗 to add link)"
        />

        <div>
          <InputField
            type="text"
            placeholder="Student name"
            value={student}
            onChange={(e) => {
              setStudent(e.target.value);
              if (errors.student) {
                setErrors({ ...errors, student: "" });
              }
            }}
            className={styles.inputField}
            required
          />
          {errors.student && (
            <p
              style={{
                color: "#d00000",
                fontSize: "13px",
                marginTop: "5px",
                paddingLeft: "24px",
                fontFamily: "Literata, serif",
                fontWeight: "500",
              }}
            >
              {errors.student}
            </p>
          )}
        </div>

        <div>
          <InputField
            type="date"
            placeholder="Due date"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
              if (errors.dueDate) {
                setErrors({ ...errors, dueDate: "" });
              }
            }}
            className={styles.inputField}
            required
          />
          {errors.dueDate && (
            <p
              style={{
                color: "#d00000",
                fontSize: "13px",
                marginTop: "5px",
                paddingLeft: "24px",
                fontFamily: "Literata, serif",
                fontWeight: "500",
              }}
            >
              {errors.dueDate}
            </p>
          )}
        </div>

        <div>
          <InputField
            type="time"
            placeholder="Due time"
            value={dueTime}
            onChange={(e) => {
              setDueTime(e.target.value);
              if (errors.dueTime) {
                setErrors({ ...errors, dueTime: "" });
              }
            }}
            className={styles.inputField}
            required
          />
          {errors.dueTime && (
            <p
              style={{
                color: "#d00000",
                fontSize: "13px",
                marginTop: "5px",
                paddingLeft: "24px",
                fontFamily: "Literata, serif",
                fontWeight: "500",
              }}
            >
              {errors.dueTime}
            </p>
          )}
        </div>

        <Button type="submit" variant="orange" className={styles.submitButton}>
          Assign
        </Button>
      </form>
    </div>
  );
};

export default AddHomework;
