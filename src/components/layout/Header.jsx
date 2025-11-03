import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const Header = ({ notificationMessage }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");

    console.log("Logging out...");
    navigate("/");
  };

  return (
    <header className={styles.header}>
      {notificationMessage && (
        <div className={styles.notification}>
          <span>{notificationMessage}</span>
        </div>
      )}

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
