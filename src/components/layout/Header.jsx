import React from "react";
import styles from "./Header.module.css";

const Header = ({ notificationMessage }) => {
  return (
    <header className={styles.header}>
      <div className={styles.notification}>
        {notificationMessage && <span>{notificationMessage}</span>}
      </div>

      <div className={styles.rightSection}>
        <span className={styles.logo}>LanGo</span>
        <div className={styles.avatarCircle}></div>
      </div>
    </header>
  );
};

export default Header;
