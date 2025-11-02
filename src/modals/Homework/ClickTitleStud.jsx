import React, { useState } from "react";
import styles from "./ClickTitleStud.module.css";
import Button from "../../components/common/Button";

const ClickTitleStud = ({
  closeModal,
  setNotification,
  homework,
  onMarkAsSolved,
  onSaveProgress,
}) => {
  const [solution, setSolution] = useState(homework?.solution || "");
  const getTimeRemaining = () => {
    return homework?.timeRemaining || "1d 4h";
  };

  const handleMarkAsSolved = () => {
    if (!solution.trim()) {
      alert("Please provide a solution before marking as solved!");
      return;
    }

    console.log("Marking as solved:", { homework, solution });
    if (typeof onMarkAsSolved === "function") {
      onMarkAsSolved(homework.id, solution);
    }

    if (typeof setNotification === "function") {
      setNotification("Homework marked as solved!");
    }

    if (typeof closeModal === "function") {
      closeModal();
    }

    setTimeout(() => {
      if (typeof setNotification === "function") {
        setNotification("");
      }
    }, 5000);
  };

  const handleSaveProgress = () => {
    console.log("Saving progress:", { homework, solution });
    if (typeof onSaveProgress === "function") {
      onSaveProgress(homework.id, solution);
    }
    if (typeof setNotification === "function") {
      setNotification("Progress has been saved!");
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
    <div className={styles.homeworkModal}>
      <h2 className={styles.title}>Homework</h2>
      <div className={styles.subtitle}>{getTimeRemaining()}</div>
      <h3 className={styles.taskTitle}>{homework?.title || "Title"}</h3>

      <div className={styles.content}>
        <div className={styles.section}>
          <label className={styles.label}>Description</label>
          <div className={styles.descriptionBox}>
            {homework?.description || "No description provided"}
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Solution</label>
          <textarea
            placeholder="Write your solution here..."
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            className={styles.solutionBox}
            rows={4}
          />
        </div>

        <div className={styles.buttonGroup}>
          <Button
            variant="green"
            className={styles.solvedButton}
            onClick={handleMarkAsSolved}
          >
            Mark as solved
          </Button>

          <Button
            variant="orange"
            className={styles.saveButton}
            onClick={handleSaveProgress}
          >
            Save progress
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClickTitleStud;
