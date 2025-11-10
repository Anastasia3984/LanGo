import React, { useState } from "react";
import styles from "./CheckHW.module.css";
import Button from "../../components/common/Button";
import TextArea from "../../components/common/TextArea";

export default function CheckHW({
  homework,
  closeModal,
  onMarkAsChecked,
  setNotification,
}) {
  const [comment, setComment] = useState(homework.comment || "");

  const handleCheckClick = () => {
    if (onMarkAsChecked) {
      onMarkAsChecked(homework.id, comment);
    }
    if (typeof setNotification === "function") {
      setNotification("Homework marked as checked!");
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
      <h2 className={styles.mainTitle}>Homework</h2>
      <h3 className={styles.subTitle}>{homework.title}</h3>

      <div className={styles.content}>
        <div className={styles.readOnlySection}>
          <span className={styles.label}>Description</span>
          <div className={styles.readOnlyBox}>{homework.description}</div>
        </div>
        <div className={styles.readOnlySection}>
          <span className={styles.label}>Solution</span>
          <div className={styles.readOnlyBox}>{homework.solution}</div>
        </div>
        <div className={styles.commentSection}>
          <span className={styles.label}>Leave a comment</span>
          <TextArea
            className={styles.commentBox}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Your feedback..."
            rows={4}
          />
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <Button
          variant="lightGreen"
          onClick={handleCheckClick}
          className={styles.checkButton}
        >
          Mark as checked
        </Button>
      </div>
    </div>
  );
}
