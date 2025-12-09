import React from "react";
import { useNavigate, useMatch } from "react-router-dom";
import styles from "./Header.module.css";

const Header = ({ notificationMessage }) => {
  const navigate = useNavigate();
  const onStudentPage = useMatch("/teacher/student/:studentId");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    console.log("Logging out...");
    navigate("/");
  };

  const handleBackToTeacher = () => {
    navigate("/teacher");
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {onStudentPage && (
          <button className={styles.backButton} onClick={handleBackToTeacher}>
            ← Back to my profile
          </button>
        )}
        {notificationMessage && (
          <div className={styles.notification}>
            <span>{notificationMessage}</span>
          </div>
        )}
      </div>
      <div className={styles.rightSection}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Log out
        </button>
        <span className={styles.logo}>LanGo</span>
        <div className={styles.avatarCircle}></div>
      </div>
    </header>
  );
};

export default Header;
