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
    if (dueDate.trim()) {
      const dateRegex = /^(\d{2})[\/\.](\d{2})[\/\.](\d{4})$/;
      if (!dateRegex.test(dueDate)) {
        newErrors.dueDate = "Format: DD/MM/YYYY or DD.MM.YYYY";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim() && student.trim()) {
      if (validateForm()) {
        console.log("Adding homework:", {
          title,
          description,
          student,
          dueDate,
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
            <div
              style={{
                color: "#d00000",
                fontSize: "12px",
                paddingLeft: "15px",
                fontFamily: "Literata, serif",
                fontWeight: "500",
              }}
            >
              {errors.student}
            </div>
          )}
        </div>

        <div>
          <InputField
            type="text"
            placeholder="Due date (DD/MM/YYYY)"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
              if (errors.dueDate) {
                setErrors({ ...errors, dueDate: "" });
              }
            }}
            className={styles.inputField}
          />
          {errors.dueDate && (
            <div
              style={{
                color: "#d00000",
                fontSize: "12px",
                paddingLeft: "15px",
                fontFamily: "Literata, serif",
                fontWeight: "500",
              }}
            >
              {errors.dueDate}
            </div>
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
