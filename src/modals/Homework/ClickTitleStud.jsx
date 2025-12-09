import React, { useState } from "react";
import styles from "./ClickTitleStud.module.css";
import Button from "../../components/common/Button";

const renderDescription = (text) => {
  if (!text) return "";
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const matches = [...text.matchAll(regex)];
  if (matches.length === 0) return text;

  const elements = [];
  let lastIndex = 0;

  matches.forEach((match, i) => {
    const [fullMatch, linkText, linkUrl] = match;
    const index = match.index;
    if (index > lastIndex) {
      elements.push(text.substring(lastIndex, index));
    }

    elements.push(
      <a
        href={linkUrl}
        key={i}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.descriptionLink}
      >
        {linkText}
      </a>,
    );

    lastIndex = index + fullMatch.length;
  });
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements;
};

const ClickTitleStud = ({
  closeModal,
  setNotification,
  homework,
  onMarkAsSolved,
  onSaveProgress,
}) => {
  const [solution, setSolution] = useState(homework?.solution || "");

  const handleMarkAsSolved = () => {
    if (!solution.trim()) {
      if (setNotification) {
        setNotification("Please provide a solution before marking as solved!");
        setTimeout(() => setNotification(""), 3000);
      }
      return;
    }

    if (onMarkAsSolved) {
      onMarkAsSolved(homework.id, solution);
    }

    if (setNotification) setNotification("Homework marked as solved!");
    if (closeModal) closeModal();

    setTimeout(() => {
      if (setNotification) setNotification("");
    }, 5000);
  };

  const handleSaveProgress = () => {
    if (onSaveProgress) {
      onSaveProgress(homework.id, solution);
    }
    if (setNotification) setNotification("Progress has been saved!");
    if (closeModal) closeModal();
    setTimeout(() => {
      if (setNotification) setNotification("");
    }, 3000);
  };

  return (
    <div className={styles.homeworkModal}>
      <h2 className={styles.title}>Homework</h2>
      <div className={styles.subtitle}>
        Time remaining: {homework?.timeRemainingDisplay || "Unknown"}
      </div>
      <h3 className={styles.taskTitle}>{homework?.title || "Title"}</h3>

      <div className={styles.content}>
        <div className={styles.section}>
          <label className={styles.label}>Description</label>
          <div className={styles.descriptionBox}>
            {homework?.description
              ? renderDescription(homework.description)
              : "No description provided"}
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
