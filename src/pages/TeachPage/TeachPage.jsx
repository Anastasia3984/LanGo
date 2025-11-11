import React, { useState } from "react";
import styles from "./TeachPage.module.css";
import Button from "../../components/common/Button";
import StudentTable from "../../components/tables/StudentTable";
import Pagination from "../../components/layout/Pagination";
import { useModal } from "../../hooks/useModal";
import InviteStud from "../../modals/Students/InviteStud";
import AddHomework from "../../modals/Homework/AddHomework";
import StudentProfile from "../../modals/Students/StudentProfile";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const STUDENTS_PER_PAGE = 5;

const TeachPage = () => {
  const navigate = useNavigate();
  const { setNotification } = useOutletContext();
  const [allStudents, setAllStudents] = useState([
    {
      id: 1,
      name: "Name 1",
      email: "email@gmail.com",
      solved: 4,
      activity: "1 hour ago",
      addHomeworkText: "add homework",
    },
    {
      id: 2,
      name: "Name 2",
      email: "student2@gmail.com",
      solved: 2,
      activity: "3 days ago",
      addHomeworkText: "add homework",
    },
    {
      id: 3,
      name: "Name 3",
      email: "example@gmail.com",
      solved: 5,
      activity: "1 day ago",
      addHomeworkText: "add homework",
    },
    {
      id: 4,
      name: "Name 4",
      email: "test@gmail.com",
      solved: 0,
      activity: "1 week ago",
      addHomeworkText: "add homework",
    },
    {
      id: 5,
      name: "Name 5",
      email: "user5@gmail.com",
      solved: 3,
      activity: "5 hours ago",
      addHomeworkText: "add homework",
    },
    {
      id: 6,
      name: "Name 6",
      email: "new@gmail.com",
      solved: 1,
      activity: "2 days ago",
      addHomeworkText: "add homework",
    },
    {
      id: 7,
      name: "Name 7",
      email: "another@gmail.com",
      solved: 6,
      activity: "4 hours ago",
      addHomeworkText: "add homework",
    },
    {
      id: 8,
      name: "Name 8",
      email: "last@gmail.com",
      solved: 2,
      activity: "1 week ago",
      addHomeworkText: "add homework",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const { openModal, closeModal } = useModal();

  const totalPages = Math.ceil(allStudents.length / STUDENTS_PER_PAGE);
  const indexOfLastStudent = currentPage * STUDENTS_PER_PAGE;
  const indexOfFirstStudent = indexOfLastStudent - STUDENTS_PER_PAGE;
  const currentStudents = allStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent,
  );

  const handleDeleteStudent = (studentId, studentName) => {
    setAllStudents((prevStudents) =>
      prevStudents.filter((student) => student.id !== studentId),
    );
    closeModal();
    setNotification(`Student ${studentName} has been deleted!`);

    setTimeout(() => {
      setNotification("");
    }, 5000);
  };

  const handleNameClick = (studentId) => {
    const student = allStudents.find((s) => s.id === studentId);
    openModal(
      <StudentProfile
        student={student}
        openModal={openModal}
        setNotification={setNotification}
        onDeleteStudent={handleDeleteStudent}
        navigate={navigate}
      />,
      { setNotification },
    );
  };

  const handleAddHomeworkClick = (studentId) => {
    const student = allStudents.find((s) => s.id === studentId);
    openModal(
      <AddHomework
        studentName={student?.name || ""}
        allStudents={allStudents}
      />,
      { setNotification },
    );
  };

  const handleSolvedClick = (studentId, solvedCount) => {
    const student = allStudents.find((s) => s.id === studentId);
    openModal(
      <StudentProfile
        student={student}
        openModal={openModal}
        setNotification={setNotification}
        onDeleteStudent={handleDeleteStudent}
      />,
      { setNotification },
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleInviteStudent = () => {
    openModal(<InviteStud />, { setNotification });
  };

  const handleAddHomework = () => {
    openModal(<AddHomework allStudents={allStudents} />, { setNotification });
  };

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.profileSection}>
        <div className={styles.avatarPlaceholder}></div>
        <div className={styles.profileInfo}>
          <h1 className={styles.profileTitle}>Teacher</h1>
          <a href="mailto:teacher@gmail.com" className={styles.profileEmail}>
            teacher@gmail.com
          </a>
          <div className={styles.buttonGroup}>
            <Button
              variant="orange"
              className={styles.profileButton}
              onClick={handleInviteStudent}
            >
              Invite student
            </Button>
            <Button
              variant="orange"
              className={styles.profileButton}
              onClick={handleAddHomework}
            >
              Add homework
            </Button>
          </div>
        </div>
      </section>

      <StudentTable
        students={currentStudents}
        onNameClick={handleNameClick}
        onAddHomeworkClick={handleAddHomeworkClick}
        onSolvedClick={handleSolvedClick}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default TeachPage;
