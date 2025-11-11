import React from "react";
import styles from "./StudentProfile.module.css";
import Button from "../../components/common/Button";
import DeleteStudentConfirm from "./DeleteStudentConfirm";
import { useTasks } from "../../hooks/useTasks";

const StudentProfile = ({
  closeModal,
  student,
  openModal,
  setNotification,
  onDeleteStudent,
  navigate,
}) => {
  const { tasks, loading, error } = useTasks(student.id);

  const uncheckedTasks = tasks
    ? tasks.filter(
        (t) => t.status === "unreviewed" || (t.status === "solved" && !t.grade),
      )
    : [];

  const handleVisitProfile = () => {
    if (closeModal) {
      closeModal();
    }
    navigate(`/teacher/student/${student.id}`);
  };

  const handleDeleteStudent = () => {
    const handleCancelDelete = () => {
      openModal(
        <StudentProfile
          student={student}
          openModal={openModal}
          setNotification={setNotification}
          onDeleteStudent={onDeleteStudent}
          navigate={navigate}
          closeModal={closeModal}
        />,
      );
    };

    openModal(
      <DeleteStudentConfirm
        student={student}
        onDeleteStudent={onDeleteStudent}
        onCancel={handleCancelDelete}
        setNotification={setNotification}
      />,
    );
  };

  const handleTaskClick = (task) => {
    console.log("Opening task details for:", task.assignment.title);
  };
  const renderTaskList = () => {
    if (loading) {
      return <p className={styles.noTasks}>Loading tasks...</p>;
    }
    if (error) {
      return <p className={styles.noTasks}>Failed to load tasks.</p>;
    }
    if (uncheckedTasks.length === 0) {
      return <p className={styles.noTasks}>No unchecked tasks</p>;
    }
    return uncheckedTasks.map((task) => (
      <div
        key={task.id}
        className={styles.taskItem}
        onClick={() => handleTaskClick(task)}
      >
        {task.assignment ? task.assignment.title : "Unnamed Task"}
      </div>
    ));
  };

  return (
    <div className={styles.profileModal}>
      {closeModal && (
        <button className={styles.closeButton} onClick={closeModal}>
          &times;
        </button>
      )}

      <h2 className={styles.title}>{student.name}</h2>

      <div className={styles.content}>
        <h3 className={styles.sectionTitle}>Unchecked tasks</h3>
        <div className={styles.tasksList}>{renderTaskList()}</div>

        <div className={styles.buttonGroup}>
          <Button
            variant="green"
            className={styles.profileButton}
            onClick={handleVisitProfile}
          >
            Visit student's profile
          </Button>

          <Button
            variant="orange"
            className={styles.deleteButton}
            onClick={handleDeleteStudent}
          >
            Delete student
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
