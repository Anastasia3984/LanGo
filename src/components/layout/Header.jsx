import React from "react";
import styles from "./Header.module.css";

const Header = ({ notificationMessage }) => {
  console.log("📢 Header received notification:", notificationMessage);

  return (
    <header className={styles.header}>
      {notificationMessage && (
        <div className={styles.notification}>
          <span>{notificationMessage}</span>
        </div>
      )}

      <div className={styles.rightSection}>
        <span className={styles.logo}>LanGo</span>
        <div className={styles.avatarCircle}></div>
      </div>
    </header>
  );
};

export default Header;
