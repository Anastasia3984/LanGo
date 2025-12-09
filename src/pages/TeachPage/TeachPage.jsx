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
import { useStudents } from "../../hooks/useStudents";
import { useAuth } from "../../context/AuthContext";
import { usePost } from "../../hooks/usePost";

const STUDENTS_PER_PAGE = 5;

const TeachPage = () => {
  const navigate = useNavigate();
  const { setNotification } = useOutletContext();
  const { openModal, closeModal } = useModal();
  const { user } = useAuth();
  const { post: createInvitation } = usePost("/invitations");

  const {
    students: allStudents,
    loading,
    error,
    inviteStudent,
    deleteStudent,
  } = useStudents();

  const [currentPage, setCurrentPage] = useState(1);
  const handleSendInvitation = async (email) => {
    const randomString = Math.random().toString(36).substring(2, 15);
    const token = `token_${Date.now()}_${randomString}`;
    const newInvitation = {
      id: `inv_${Date.now()}`,
      email: email,
      teacher_id: user.id,
      status: "pending",
      created_at: new Date().toISOString(),
      accepted_at: null,
      token: token,
    };
    await createInvitation(newInvitation);
    console.log(
      "Invitation Link Created:",
      `http://localhost:5173/register?token=${token}`,
    );
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    try {
      await deleteStudent(studentId);
      closeModal();
      setNotification(`Student ${studentName} has been deleted!`);
    } catch (err) {
      setNotification("Failed to delete student. Please try again.");
    } finally {
      setTimeout(() => {
        setNotification("");
      }, 5000);
    }
  };

  if (loading) {
    return <div className={styles.pageWrapper}>Loading students...</div>;
  }

  if (error) {
    return <div className={styles.pageWrapper}>Error: {error.message}</div>;
  }

  const totalPages = allStudents
    ? Math.ceil(allStudents.length / STUDENTS_PER_PAGE)
    : 0;
  const indexOfLastStudent = currentPage * STUDENTS_PER_PAGE;
  const indexOfFirstStudent = indexOfLastStudent - STUDENTS_PER_PAGE;

  const currentStudents = allStudents
    ? allStudents.slice(indexOfFirstStudent, indexOfLastStudent)
    : [];

  const handleNameClick = (studentId) => {
    const student = allStudents?.find((s) => s.id === studentId);
    if (!student) return;
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
    const student = allStudents?.find((s) => s.id === studentId);
    if (!student) return;

    openModal(
      <AddHomework
        closeModal={closeModal}
        setNotification={setNotification}
        allStudents={allStudents}
      />,
      { setNotification },
    );
  };

  const handleSolvedClick = (studentId) => {
    const student = allStudents?.find((s) => s.id === studentId);
    if (!student) return;

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
    openModal(
      <InviteStud closeModal={closeModal} setNotification={setNotification} />,
    );
  };

  const handleAddHomework = () => {
    openModal(
      <AddHomework
        closeModal={closeModal}
        setNotification={setNotification}
        allStudents={allStudents}
      />,
      { setNotification },
    );
  };

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.profileSection}>
        <div className={styles.avatarPlaceholder}></div>
        <div className={styles.profileInfo}>
          <h1 className={styles.profileTitle}>
            {user ? user.name : "Teacher"}
          </h1>
          <a
            href={user ? `mailto:${user.email}` : "#"}
            className={styles.profileEmail}
          >
            {user ? user.email : "teacher@gmail.com"}
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

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default TeachPage;
