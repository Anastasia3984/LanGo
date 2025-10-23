import React from "react";
import styles from "./LogIn.module.css";

const LogIn = () => {
  return (
    <div className={styles.loginWrapper}>
      <h2 className={styles.title}>Log in</h2>
      <div className={styles.whiteBox}>
        <p style={{ color: "var(--color-text-dark)" }}>
          Тут будуть поля вводу...
        </p>
      </div>
    </div>
  );
};

export default LogIn;
