import React, { useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import styles from "./StudPage.module.css";
import Button from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import ContactTeacher from "../../modals/Students/ContactTeacher";
import ClickTitleStud from "../../modals/Homework/ClickTitleStud";
import ViewSolvedHomework from "../../modals/Homework/ViewSolvedHomework";
import EditHW from "../../modals/Homework/EditHW";
import CheckHW from "../../modals/Homework/CheckHW";

const TASKS_PER_PAGE = 4;

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <nav className={styles.pagination}>
    <button
      className={styles.arrowButton}
      disabled={currentPage === 1}
      onClick={() => onPageChange(currentPage - 1)}
    >
      &larr;
    </button>
    <div className={styles.pageNumber}>{currentPage}</div>
    <button
      className={styles.arrowButton}
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(currentPage + 1)}
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
  let col3Style = "";
  if (type === "solved") {
    col3Style = task.col3 === "unchecked" ? styles.unchecked : styles.onTime;
  } else {
    col3Style = styles.actionLink;
  }

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

const initialSolvedTasks = [
  {
    id: 1,
    col1: "Present Simple",
    col2: "1h 24m",
    col3: "unchecked",
    isOverdue: false,
    title: "Present Simple",
    description:
      "Complete exercises on Present Simple tense. Practice positive, negative and question forms.",
    solution: "I completed all exercises from page 10 to 15.",
    comment: "",
    timeRemaining: "completed",
    dueDate: new Date("2024-12-15"),
    submittedDate: new Date("2024-12-14"),
  },
  {
    id: 3,
    col1: "Essay writing",
    col2: "1d 3h 46m",
    col3: "unchecked",
    isOverdue: true,
    title: "Essay writing",
    description: "Write an essay about your favorite book",
    solution: "My favorite book is 'Harry Potter'.",
    comment: "",
    timeRemaining: "completed",
    dueDate: new Date("2024-12-10"),
    submittedDate: new Date("2024-12-12"),
  },
  {
    id: 10,
    col1: "Grammar test",
    col2: "30m",
    col3: "checked",
    isOverdue: false,
    title: "Grammar test",
    description: "Complete grammar test",
    solution: "All answers completed",
    comment: "Excellent work! 95/100",
    timeRemaining: "completed",
    dueDate: new Date("2024-12-08"),
    submittedDate: new Date("2024-12-07"),
  },
  {
    id: 11,
    col1: "Speaking practice",
    col2: "2h",
    col3: "checked",
    isOverdue: false,
    title: "Speaking practice",
    description: "Record yourself speaking",
    solution: "Recorded 5 minute speech",
    comment: "Good pronunciation!",
    timeRemaining: "completed",
    dueDate: new Date("2024-12-05"),
    submittedDate: new Date("2024-12-04"),
  },
  {
    id: 12,
    col1: "Vocabulary quiz",
    col2: "5d 2h",
    col3: "unchecked",
    isOverdue: true,
    title: "Vocabulary quiz",
    description: "Complete vocabulary quiz",
    solution: "Finished all questions",
    comment: "",
    timeRemaining: "completed",
    dueDate: new Date("2024-11-20"),
    submittedDate: new Date("2024-11-25"),
  },
];

const initialUnsolvedTasks = [
  {
    id: 6,
    col1: "Vocabulary practice",
    col2: "1w 3d",
    col3: "edit",
    title: "Vocabulary practice",
    description: "Learn 50 new words and make sentences with them",
    solution: "",
    comment: "",
    timeRemaining: "1w 3d",
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: 7,
    col1: "Reading comprehension",
    col2: "4h",
    col3: "edit",
    title: "Reading comprehension",
    description: "Read the article and answer questions",
    solution: "",
    comment: "",
    timeRemaining: "4h",
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
  },
  {
    id: 8,
    col1: "Listening exercise",
    col2: "2d 5h",
    col3: "edit",
    title: "Listening exercise",
    description: "Listen to the podcast and write a summary",
    solution: "",
    comment: "",
    timeRemaining: "2d 5h",
    dueDate: new Date(Date.now() + 2.2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 13,
    col1: "Writing task",
    col2: "3d",
    col3: "edit",
    title: "Writing task",
    description: "Write a letter to your friend",
    solution: "",
    comment: "",
    timeRemaining: "3d",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 14,
    col1: "Pronunciation",
    col2: "5h",
    col3: "edit",
    title: "Pronunciation practice",
    description: "Practice difficult sounds",
    solution: "",
    comment: "",
    timeRemaining: "5h",
    dueDate: new Date(Date.now() + 5 * 60 * 60 * 1000),
  },
];

const StudPage = ({ userRole = "student" }) => {
  const { setNotification } = useOutletContext();
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [solvedTasks, setSolvedTasks] = useState(initialSolvedTasks);
  const [unsolvedTasks, setUnsolvedTasks] = useState(initialUnsolvedTasks);
  const [solvedPage, setSolvedPage] = useState(1);
  const [unsolvedPage, setUnsolvedPage] = useState(1);
  const { openModal } = useModal();

  const solvedTotalPages = Math.ceil(solvedTasks.length / TASKS_PER_PAGE);
  const solvedStartIndex = (solvedPage - 1) * TASKS_PER_PAGE;
  const solvedEndIndex = solvedStartIndex + TASKS_PER_PAGE;
  const currentSolvedTasks = solvedTasks.slice(
    solvedStartIndex,
    solvedEndIndex,
  );
  const unsolvedTotalPages = Math.ceil(unsolvedTasks.length / TASKS_PER_PAGE);
  const unsolvedStartIndex = (unsolvedPage - 1) * TASKS_PER_PAGE;
  const unsolvedEndIndex = unsolvedStartIndex + TASKS_PER_PAGE;
  const currentUnsolvedTasks = unsolvedTasks.slice(
    unsolvedStartIndex,
    unsolvedEndIndex,
  );

  const calculateSubmissionTime = (dueDate, submittedDate) => {
    const diffMs = submittedDate - dueDate;
    const diffHours = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    const remainingHours = diffHours % 24;

    if (diffDays > 0) {
      return `${diffDays}d ${remainingHours}h`;
    } else {
      return `${diffHours}h ${Math.floor(
        (Math.abs(diffMs) % (1000 * 60 * 60)) / (1000 * 60),
      )}m`;
    }
  };

  const handleContactTeacher = () => {
    openModal(
      <ContactTeacher
        studentName="Student name"
        studentEmail="student@gmail.com"
      />,
      { setNotification },
    );
  };

  const handleBackToTeacher = () => {
    navigate("/teacher");
  };

  const handleMarkAsSolved = (taskId, solution) => {
    const task = unsolvedTasks.find((t) => t.id === taskId);

    if (task) {
      const submittedDate = new Date();
      const isOverdue = submittedDate > task.dueDate;
      const timeDiff = calculateSubmissionTime(task.dueDate, submittedDate);

      const updatedTask = {
        ...task,
        solution,
        col2: timeDiff,
        col3: "unchecked",
        isOverdue: isOverdue,
        timeRemaining: "completed",
        submittedDate: submittedDate,
        comment: "",
      };

      setUnsolvedTasks((prev) => prev.filter((t) => t.id !== taskId));
      setSolvedTasks((prev) => [...prev, updatedTask]);

      console.log("Task moved to solved:", updatedTask);
    }
  };

  const handleSaveProgress = (taskId, solution) => {
    setUnsolvedTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, solution } : task)),
    );

    console.log("Progress saved for task:", taskId);
  };

  const handleUpdateTask = (updatedHomework) => {
    setUnsolvedTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedHomework.id ? updatedHomework : task,
      ),
    );
  };

  const handleDeleteTask = (taskIdToDelete) => {
    setUnsolvedTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskIdToDelete),
    );
  };

  const handleMarkAsChecked = (taskId, comment) => {
    setSolvedTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, col3: "checked", comment: comment }
          : task,
      ),
    );
  };

  const handleUnsolvedTaskClick = (task) => {
    if (userRole === "student") {
      openModal(
        <ClickTitleStud
          homework={task}
          onMarkAsSolved={handleMarkAsSolved}
          onSaveProgress={handleSaveProgress}
        />,
        { setNotification },
      );
    }
  };

  const handleEditTaskClick = (taskToEdit) => {
    if (userRole === "student") {
      openModal(
        <ClickTitleStud
          homework={taskToEdit}
          onMarkAsSolved={handleMarkAsSolved}
          onSaveProgress={handleSaveProgress}
          isEditMode={true}
        />,
        { setNotification },
      );
    } else {
      openModal(
        <EditHW
          homework={taskToEdit}
          onSave={handleUpdateTask}
          onDelete={handleDeleteTask}
        />,
        { setNotification },
      );
    }
  };

  const handleSolvedTaskClick = (task) => {
    openModal(<ViewSolvedHomework homework={task} />, { setNotification });
  };
  const handleCheckTaskClick = (task) => {
    if (userRole === "teacher" && task.col3 === "unchecked") {
      openModal(
        <CheckHW homework={task} onMarkAsChecked={handleMarkAsChecked} />,
        { setNotification },
      );
    }
  };

  const handleSolvedPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= solvedTotalPages) {
      setSolvedPage(newPage);
    }
  };

  const handleUnsolvedPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= unsolvedTotalPages) {
      setUnsolvedPage(newPage);
    }
  };

  return (
    <div className={styles.studPageFullHeightWrapper}>
      <div className={styles.pageWrapper}>
        <section className={styles.profileSection}>
          <div className={styles.avatarPlaceholder}></div>
          <div className={styles.profileInfo}>
            <h1 className={styles.profileTitle}>Student name</h1>
            <a href="mailto:student@gmail.com" className={styles.profileEmail}>
              student@gmail.com
            </a>
            {userRole === "student" && (
              <div className={styles.buttonGroup}>
                <Button
                  variant="orange"
                  className={styles.profileButton}
                  onClick={handleContactTeacher}
                >
                  Contact teacher
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className={styles.homeworkDashboard}>
        <div className={styles.taskColumnWrapper}>
          <div className={styles.taskHeader}>solved</div>
          <div className={styles.tasksContainerInner}>
            <div className={styles.cardList}>
              {currentSolvedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  type="solved"
                  onTitleClick={() => handleSolvedTaskClick(task)}
                  onActionClick={() => handleCheckTaskClick(task)}
                />
              ))}
            </div>
            <Pagination
              currentPage={solvedPage}
              totalPages={solvedTotalPages}
              onPageChange={handleSolvedPageChange}
            />
          </div>
        </div>

        <div className={styles.columnDivider}></div>

        <div className={styles.taskColumnWrapper}>
          <div className={styles.taskHeader}>unsolved</div>
          <div className={styles.tasksContainerInner}>
            <div className={styles.cardList}>
              {currentUnsolvedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  type="unsolved"
                  onTitleClick={() => handleUnsolvedTaskClick(task)}
                  onActionClick={() => handleEditTaskClick(task)}
                />
              ))}
            </div>
            <Pagination
              currentPage={unsolvedPage}
              totalPages={unsolvedTotalPages}
              onPageChange={handleUnsolvedPageChange}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudPage;
