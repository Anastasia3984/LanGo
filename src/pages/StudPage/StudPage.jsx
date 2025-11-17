import React, { useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import styles from "./StudPage.module.css";
import Button from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import ContactTeacher from "../../modals/Students/ContactTeacher";
import ClickTitleStud from "../../modals/Homework/ClickTitleStud";
import ViewSolvedHomework from "../../modals/Homework/ViewSolvedHomework";
import EditHW from "../../modals/Homework/EditHW";
import CheckHW from "../../modals/Homework/CheckHW";
import { useAuth } from "../../context/AuthContext";
import { useTasks } from "../../hooks/useTasks";
import { useFetch } from "../../hooks/useFetch";
import TaskCard from "../../components/cards/TaskCard";
import Pagination from "../../components/layout/Pagination";
import { apiPatch, apiDelete } from "../../services/api";

const TASKS_PER_PAGE = 4;

const StudPage = () => {
  const { setNotification } = useOutletContext();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { studentId } = useParams();
  const { user: loggedInUser } = useAuth();

  const {
    tasks: rawTasks,
    loading: tasksLoading,
    error: tasksError,
    updateTask,
    deleteTask,
  } = useTasks(studentId);

  const { data: studentProfile, loading: profileLoading } = useFetch(
    studentId ? `/users/${studentId}` : null,
  );

  const [solvedPage, setSolvedPage] = useState(1);
  const [unsolvedPage, setUnsolvedPage] = useState(1);

  const calculateTimeRemaining = (dueDateString) => {
    if (!dueDateString) return "No date";
    const now = new Date();
    const due = new Date(dueDateString);
    const diffMs = due - now;

    if (diffMs <= 0) return "Overdue";

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    const remainingHours = diffHours % 24;
    const remainingMinutes = Math.floor(
      (diffMs % (1000 * 60 * 60)) / (1000 * 60),
    );

    if (diffDays > 0) return `${diffDays}d ${remainingHours}h`;
    return `${remainingHours}h ${remainingMinutes}m`;
  };

  const tasks = rawTasks
    ? rawTasks.map((t) => {
        const timeStr = calculateTimeRemaining(t.dueDate);

        let col3Value = "";
        if (t.status === "unsolved") {
          col3Value = "edit";
        } else if (t.status === "unreviewed") {
          col3Value = "unchecked";
        } else if (t.status === "reviewed") {
          col3Value = "checked";
        }

        return {
          ...t,
          title: t.assignment?.title || "Untitled",
          description: t.assignment?.description || "",
          col3: col3Value,
          col2: timeStr,
          timeRemainingDisplay: timeStr,
        };
      })
    : [];

  if (tasksLoading || (studentId && profileLoading)) {
    return <div className={styles.studPageFullHeightWrapper}>Loading...</div>;
  }

  if (tasksError) {
    return (
      <div className={styles.studPageFullHeightWrapper}>
        Error: {tasksError.message}
      </div>
    );
  }

  const solvedTasks = tasks.filter(
    (t) => t.status === "reviewed" || t.status === "unreviewed",
  );
  const unsolvedTasks = tasks.filter(
    (t) => t.status !== "reviewed" && t.status !== "unreviewed",
  );

  const solvedTotalPages = Math.ceil(solvedTasks.length / TASKS_PER_PAGE);
  const solvedStartIndex = (solvedPage - 1) * TASKS_PER_PAGE;
  const currentSolvedTasks = solvedTasks.slice(
    solvedStartIndex,
    solvedStartIndex + TASKS_PER_PAGE,
  );

  const unsolvedTotalPages = Math.ceil(unsolvedTasks.length / TASKS_PER_PAGE);
  const unsolvedStartIndex = (unsolvedPage - 1) * TASKS_PER_PAGE;
  const currentUnsolvedTasks = unsolvedTasks.slice(
    unsolvedStartIndex,
    unsolvedStartIndex + TASKS_PER_PAGE,
  );

  const handleContactTeacher = () =>
    openModal(
      <ContactTeacher
        studentName={loggedInUser.name}
        studentEmail={loggedInUser.email}
      />,
      { setNotification },
    );

  const handleMarkAsSolved = async (taskId, solution) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    try {
      await updateTask(task.id, {
        solution: solution,
        status: "unreviewed",
        submittedDate: new Date().toISOString(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProgress = async (taskId, solution) => {
    try {
      await updateTask(taskId, { solution: solution });
    } catch (err) {}
  };
  const handleUpdateTask = async (updatedHomework) => {
    const { id, assignmentId, title, description, dueDate } = updatedHomework;

    try {
      if (assignmentId) {
        await apiPatch(`/assignments/${assignmentId}`, {
          title: title,
          description: description,
        });
      } else if (updatedHomework.assignment_id) {
        await apiPatch(`/assignments/${updatedHomework.assignment_id}`, {
          title: title,
          description: description,
        });
      }
      await updateTask(
        id,
        { dueDate: dueDate },
        { title: title, description: description },
      );
    } catch (err) {
      console.error("Failed to update homework:", err);
      setNotification("Failed to update. Please try again.");
    }
  };
  const handleDeleteTask = async (taskIdToDelete) => {
    const taskToDelete = tasks.find((t) => t.id === taskIdToDelete);
    const assignmentId =
      taskToDelete?.assignmentId || taskToDelete?.assignment?.id;

    try {
      await deleteTask(taskIdToDelete);
      if (assignmentId) {
        await apiDelete(`/assignments/${assignmentId}`);
      }

      setNotification("Homework has been deleted!");
    } catch (err) {
      console.error("Failed to delete task:", err);
      setNotification("Failed to delete task.");
    } finally {
      setTimeout(() => setNotification(""), 5000);
    }
  };

  const handleMarkAsChecked = async (taskId, comment) => {
    try {
      await updateTask(taskId, {
        comment: comment,
        status: "reviewed",
      });
    } catch (err) {}
  };

  const handleUnsolvedTaskClick = (task) => {
    if (!studentId) {
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
    if (!studentId) {
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

  const handleSolvedTaskClick = (task) =>
    openModal(<ViewSolvedHomework homework={task} />, { setNotification });

  const handleCheckTaskClick = (task) => {
    if (studentId && task.col3 === "unchecked") {
      openModal(
        <CheckHW homework={task} onMarkAsChecked={handleMarkAsChecked} />,
        { setNotification },
      );
    }
  };

  const handleSolvedPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= solvedTotalPages) setSolvedPage(newPage);
  };
  const handleUnsolvedPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= unsolvedTotalPages) setUnsolvedPage(newPage);
  };

  const userToDisplay = studentId ? studentProfile : loggedInUser;
  const profileName = userToDisplay ? userToDisplay.name : "Loading...";
  const profileEmail = userToDisplay ? userToDisplay.email : "Loading...";

  return (
    <div className={styles.studPageFullHeightWrapper}>
      <div className={styles.pageWrapper}>
        <section className={styles.profileSection}>
          <div className={styles.avatarPlaceholder}></div>
          <div className={styles.profileInfo}>
            <h1 className={styles.profileTitle}>{profileName}</h1>
            <a href={`mailto:${profileEmail}`} className={styles.profileEmail}>
              {profileEmail}
            </a>

            {!studentId && (
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
              {currentSolvedTasks.length === 0 ? (
                <p className={styles.noTasksMessage}>No solved tasks yet.</p>
              ) : (
                currentSolvedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    type="solved"
                    onTitleClick={() => handleSolvedTaskClick(task)}
                    onActionClick={() => handleCheckTaskClick(task)}
                  />
                ))
              )}
            </div>
            {solvedTotalPages > 1 && (
              <Pagination
                currentPage={solvedPage}
                totalPages={solvedTotalPages}
                onPageChange={handleSolvedPageChange}
              />
            )}
          </div>
        </div>
        <div className={styles.columnDivider}></div>
        <div className={styles.taskColumnWrapper}>
          <div className={styles.taskHeader}>unsolved</div>
          <div className={styles.tasksContainerInner}>
            <div className={styles.cardList}>
              {currentUnsolvedTasks.length === 0 ? (
                <p className={styles.noTasksMessage}>
                  No unsolved tasks. Good job!
                </p>
              ) : (
                currentUnsolvedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    type="unsolved"
                    onTitleClick={() => handleUnsolvedTaskClick(task)}
                    onActionClick={() => handleEditTaskClick(task)}
                  />
                ))
              )}
            </div>
            {unsolvedTotalPages > 1 && (
              <Pagination
                currentPage={unsolvedPage}
                totalPages={unsolvedTotalPages}
                onPageChange={handleUnsolvedPageChange}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudPage;
