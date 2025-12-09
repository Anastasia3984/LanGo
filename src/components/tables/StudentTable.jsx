import React from "react";
import styles from "./StudentTable.module.css";

const StudentTable = ({
  students = [],
  onNameClick,
  onAddHomeworkClick,
  onSolvedClick,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableTitle}>list of students</div>

      <table className={styles.studentTable}>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td
                className={styles.nameCell}
                onClick={() => onNameClick(student.id)}
              >
                {student.name}
              </td>
              <td className={styles.emailCell}>{student.email}</td>
              <td style={{ color: "black" }}>
                {formatDate(student.lastActivity)}
              </td>
              <td
                className={styles.solvedCell}
                onClick={() => onSolvedClick(student.id)}
                style={{
                  color: "black",
                  fontWeight: student.uncheckedCount > 0 ? "bold" : "normal",
                  cursor: "pointer",
                }}
              >
                {student.uncheckedCount || 0}
              </td>
              <td
                className={styles.addHomeworkCell}
                onClick={() => onAddHomeworkClick(student.id)}
              >
                Add homework
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
