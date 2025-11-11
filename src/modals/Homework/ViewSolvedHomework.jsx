import React from "react";
import styles from "./ViewSolvedHomework.module.css";

const ViewSolvedHomework = ({ closeModal, homework }) => {
  return (
    <div className={styles.viewModal}>
      <h2 className={styles.title}>Homework</h2>
      <h3 className={styles.taskTitle}>{homework?.title || "Title"}</h3>

      <div className={styles.content}>
        <div className={styles.section}>
          <label className={styles.label}>Description</label>
          <div className={styles.textBox}>
            {homework?.description || "No description provided"}
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Solution</label>
          <div className={styles.textBox}>
            {homework?.solution || "No solution provided"}
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Comment</label>
          <div className={styles.textBox}>
            {homework?.comment || "No comment from teacher yet"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSolvedHomework;
