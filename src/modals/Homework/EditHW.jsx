import React, { useState } from "react";
import styles from "./EditHW.module.css";
export default function EditHW({
  homework,
  closeModal,
  onSave,
  onDelete,
  setNotification,
}) {
  const getFormattedDate = (dateString) => {
    if (!dateString) return "";
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) return "";
      return dateObj.toISOString().split("T")[0];
    } catch (e) {
      console.error("Invalid date:", dateString);
      return "";
    }
  };

  const getFormattedTime = (dateString) => {
    if (!dateString) return "";
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) return "";

      const hours = String(dateObj.getHours()).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");

      return `${hours}:${minutes}`;
    } catch (e) {
      console.error("Invalid time:", dateString);
      return "";
    }
  };

  const [title, setTitle] = useState(homework.title || "");
  const [description, setDescription] = useState(homework.description || "");
  const [dueDate, setDueDate] = useState(getFormattedDate(homework.dueDate));
  const [dueTime, setDueTime] = useState(getFormattedTime(homework.dueDate));

  const handleSaveClick = () => {
    const combinedDateTime =
      dueDate && dueTime
        ? new Date(`${dueDate}T${dueTime}`).toISOString()
        : null;

    const updatedHomework = {
      ...homework,
      title,
      description,
      dueDate: combinedDateTime,
    };

    if (onSave) {
      onSave(updatedHomework);
    }
    if (typeof setNotification === "function") {
      setNotification("Homework has been saved!");
    }

    if (typeof closeModal === "function") {
      closeModal();
    }

    setTimeout(() => {
      if (typeof setNotification === "function") {
        setNotification("");
      }
    }, 3000);
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(homework.id);
    }
    if (typeof setNotification === "function") {
      setNotification("Homework has been deleted!");
    }
    if (typeof closeModal === "function") {
      closeModal();
    }
    setTimeout(() => {
      if (typeof setNotification === "function") {
        setNotification("");
      }
    }, 3000);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Homework</h2>

      <div className={styles.content}>
        <input
          type="text"
          className={styles.input}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={styles.textArea}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="time"
          className={styles.input}
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
        />

        <input
          type="date"
          className={styles.input}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div className={styles.buttonGroup}>
          <button className={styles.deleteBtn} onClick={handleDeleteClick}>
            Delete
          </button>
          <button className={styles.saveBtn} onClick={handleSaveClick}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
