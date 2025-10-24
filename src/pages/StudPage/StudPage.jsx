import React from "react";
import styles from "./StudPage.module.css";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/common/Button";

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <nav className={styles.pagination}>
    <button className={styles.arrowButton} disabled={currentPage === 1}>
      &larr;
    </button>
    <div className={styles.pageNumber}>{currentPage}</div>
    <button
      className={styles.arrowButton}
      disabled={currentPage === totalPages}
    >
      &rarr;
    </button>
  </nav>
);

const TaskCard = ({ task, type, onTitleClick, onActionClick }) => {
  let col2Style = "";
  if (type === "solved") {
    col2Style = task.isOverdue ? styles.overdue : styles.onTime;
  }
  const col3Style = type === "unsolved" ? styles.actionLink : styles.statusText;

  return (
    <div className={styles.taskCard}>
      <span className={styles.title} onClick={onTitleClick}>
        {task.col1}
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
    </div>
  );
};

const solvedTasks = [
  {
    id: 1,
    col1: "Present Simple",
    col2: "1h 24m",
    col3: "checked",
    isOverdue: false,
  },
  {
    id: 3,
    col1: "title",
    col2: "1d 3h 46m",
    col3: "checked",
    isOverdue: true,
  },
  { id: 4, col1: "title", col2: "on time?", col3: "checked", isOverdue: false },
  {
    id: 5,
    col1: "new task, new tas...",
    col2: "2h 05m",
    col3: "checked",
    isOverdue: false,
  },
];

const unsolvedTasks = [
  { id: 6, col1: "title", col2: "1w 3d", col3: "edit" },
  { id: 7, col1: "title", col2: "4h", col3: "edit" },
  { id: 8, col1: "title", col2: "due date", col3: "edit" },
];

const StudPage = () => {
  return (
    <MainLayout>
      <div className={styles.studPageFullHeightWrapper}>
        <div className={styles.pageWrapper}>
          <section className={styles.profileSection}>
            <div className={styles.avatarPlaceholder}></div>
            <div className={styles.profileInfo}>
              <h1 className={styles.profileTitle}>Student name</h1>
              <a
                href="mailto:student@gmail.com"
                className={styles.profileEmail}
              >
                student@gmail.com
              </a>
              <div className={styles.buttonGroup}>
                <Button variant="orange" className={styles.profileButton}>
                  Contact teacher
                </Button>
              </div>
            </div>
          </section>
        </div>

        <section className={styles.homeworkDashboard}>
          <div className={styles.taskColumnWrapper}>
            <div className={styles.taskHeader}>solved</div>
            <div className={styles.tasksContainerInner}>
              <div className={styles.cardList}>
                {solvedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    type="solved"
                    onTitleClick={() =>
                      console.log("Open solved task", task.id)
                    }
                    onActionClick={() => console.log("Check solved", task.id)}
                  />
                ))}
              </div>
              <Pagination
                currentPage={1}
                totalPages={1}
                onPageChange={() => {}}
              />
            </div>
          </div>

          <div className={styles.columnDivider}></div>

          <div className={styles.taskColumnWrapper}>
            <div className={styles.taskHeader}>unsolved</div>
            <div className={styles.tasksContainerInner}>
              <div className={styles.cardList}>
                {unsolvedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    type="unsolved"
                    onTitleClick={() =>
                      console.log("Open unsolved task", task.id)
                    }
                    onActionClick={() => console.log("Edit unsolved", task.id)}
                  />
                ))}
              </div>
              <Pagination
                currentPage={1}
                totalPages={1}
                onPageChange={() => {}}
              />
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default StudPage;
