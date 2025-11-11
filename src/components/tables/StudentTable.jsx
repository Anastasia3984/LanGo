import React from "react";
import styles from "./StudentTable.module.css";

const StudentTable = ({
  students = [],
  onNameClick,
  onAddHomeworkClick,
  onSolvedClick,
}) => {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableTitle}>list of students</div>

      <table className={styles.studentTable}>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td
                className={styles.nameCell}
                onClick={() => onNameClick(student.id)}
              >
                {student.name}
              </td>
              <td className={styles.emailCell}>{student.email}</td>
              <td>{student.activity}</td>
              <td
                className={styles.solvedCell}
                onClick={() => onSolvedClick(student.id)}
              >
                0
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
