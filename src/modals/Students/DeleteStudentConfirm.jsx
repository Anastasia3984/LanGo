import React from "react";
import styles from "./DeleteStudentConfirm.module.css";
import Button from "../../components/common/Button";

const DeleteStudentConfirm = ({
  closeModal,
  student,
  onDeleteStudent,
  onCancel,
}) => {
  const handleCancel = () => {
    console.log("Cancelled deletion");
    if (typeof onCancel === "function") {
      onCancel();
    }
  };

  const handleConfirm = () => {
    console.log("Confirmed deletion of:", student.name);
    if (typeof onDeleteStudent === "function") {
      onDeleteStudent(student.id, student.name);
    }
  };

  return (
    <div className={styles.deleteModal}>
      <h2 className={styles.title}>DELETE?</h2>

      <div className={styles.content}>
        <p className={styles.message}>
          Are you sure you want to delete this student?
        </p>
        <p className={styles.warning}>This action cannot be undone.</p>

        <div className={styles.buttonGroup}>
          <Button
            variant="green"
            className={styles.cancelButton}
            onClick={handleCancel}
          >
            CANCEL
          </Button>

          <Button
            variant="orange"
            className={styles.confirmButton}
            onClick={handleConfirm}
          >
            CONFIRM
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStudentConfirm;
