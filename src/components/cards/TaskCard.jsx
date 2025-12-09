import React from "react";
import styles from "./TaskCard.module.css";

const TaskCard = ({ task, type, onTitleClick, onActionClick, onEditClick }) => {
  let col2Style = "";
  if (type === "solved") {
    col2Style = task.isOverdue ? styles.overdue : styles.onTime;
  }

  let col3Style = "";
  if (type === "solved") {
    col3Style = task.col3 === "unchecked" ? styles.unchecked : styles.onTime;
  } else {
    col3Style = styles.actionLink;
  }

  const displayTitle =
    task.title || (task.assignment && task.assignment.title) || "Unnamed Task";

  return (
    <div className={styles.taskCard}>
      <span className={styles.title} onClick={onTitleClick}>
        {displayTitle}
      </span>

      <span className={`${col2Style} ${styles.cardColumnWithBorder}`}>
        {task.col2}
      </span>

      <span
        className={`${col3Style} ${styles.cardColumnWithBorder}`}
        onClick={onActionClick}
      >
        {task.col3}
      </span>
      {onEditClick && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEditClick(task);
          }}
          title="Edit Assignment"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.2rem",
            marginLeft: "10px",
            color: "#888",
          }}
          onMouseOver={(e) => (e.target.style.color = "#FF7F50")}
          onMouseOut={(e) => (e.target.style.color = "#888")}
        ></button>
      )}
    </div>
  );
};

export default TaskCard;
