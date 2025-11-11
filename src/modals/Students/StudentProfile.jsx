import React from "react";
import styles from "./StudentProfile.module.css";
import Button from "../../components/common/Button";
import DeleteStudentConfirm from "./DeleteStudentConfirm";

const StudentProfile = ({
  closeModal,
  student,
  openModal,
  setNotification,
  onDeleteStudent,
  navigate,
}) => {
  const handleVisitProfile = () => {
    console.log("Visiting profile of:", student.name);
    if (closeModal) {
      closeModal();
    }
    navigate(`/teacher/student/${student.id}`);
  };

  const handleDeleteStudent = () => {
    console.log("Opening delete confirmation modal for:", student.name);
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

  const handleTaskClick = (task, index) => {
    console.log("Opening task details for:", task);
  };

  const uncheckedTasks = [
    "Complete chapter 3 exercises",
    "Write an essay about climate change",
    "Prepare presentation on European history",
    "Read pages 45-60 and answer questions",
    "Solve algebraic equations worksheet",
    "Watch documentary and write summary",
    "Practice pronunciation exercises",
  ];

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

        <div className={styles.tasksList}>
          {uncheckedTasks.length > 0 ? (
            uncheckedTasks.map((task, index) => (
              <div
                key={index}
                className={styles.taskItem}
                onClick={() => handleTaskClick(task, index)}
              >
                {task}
              </div>
            ))
          ) : (
            <p className={styles.noTasks}>No unchecked tasks</p>
          )}
        </div>

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
