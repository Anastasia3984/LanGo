// src/pages/TeachPage/TeachPage.jsx
import React, { useState } from "react";
import styles from "./TeachPage.module.css";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/common/Button";
import StudentTable from "../../components/tables/StudentTable";
import Pagination from "../../components/layout/Pagination";

const allStudents = [
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
];

const STUDENTS_PER_PAGE = 5;

const TeachPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allStudents.length / STUDENTS_PER_PAGE);
  const indexOfLastStudent = currentPage * STUDENTS_PER_PAGE;
  const indexOfFirstStudent = indexOfLastStudent - STUDENTS_PER_PAGE;
  const currentStudents = allStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent,
  );

  const handleNameClick = (studentId) => {
    console.log("Open modal for student:", studentId);
  };

  const handleAddHomeworkClick = (studentId) => {
    console.log("Open 'Add HW' modal for student:", studentId);
  };

  const handleSolvedClick = (studentId, solvedCount) => {
    console.log(
      `Open 'Solved HW' modal for student ${studentId} (Solved: ${solvedCount})`,
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <MainLayout>
      <div className={styles.pageWrapper}>
        <section className={styles.profileSection}>
          <div className={styles.avatarPlaceholder}></div>
          <div className={styles.profileInfo}>
            <h1 className={styles.profileTitle}>Teacher</h1>
            <a href="mailto:teacher@gmail.com" className={styles.profileEmail}>
              teacher@gmail.com
            </a>
            <div className={styles.buttonGroup}>
              <Button variant="orange" className={styles.profileButton}>
                Invite student
              </Button>
              <Button variant="orange" className={styles.profileButton}>
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
    </MainLayout>
  );
};

export default TeachPage;
