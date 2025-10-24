import React from "react";
import styles from "./TaskCard.module.css";

const TaskCard = ({ task, type, onTitleClick, onActionClick }) => {
  const col2Style = task.isOverdue ? styles.overdue : styles.onTime;
  const col3Style = type === "unsolved" ? styles.actionLink : styles.statusText;

  return (
    <div className={styles.taskCard}>
      <span className={styles.title} onClick={onTitleClick}>
        {task.col1}
      </span>

      <span className={`${styles.col2} ${col2Style}`}>{task.col2}</span>

      <span className={`${styles.col3} ${col3Style}`} onClick={onActionClick}>
        {task.col3}
      </span>
    </div>
  );
};

export default TaskCard;
