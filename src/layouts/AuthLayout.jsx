import React from "react";
import styles from "./AuthLayout.module.css";

const rings = [...Array(6)];
const AuthLayout = ({ children }) => {
  return (
    <div className={styles.authLayout}>
      <div className={styles.ringsContainer}>
        {rings.map((_, index) => (
          <div key={index} className={styles.ring}>
            <div className={styles.ringTab}></div>
            <div className={styles.ringCircle}></div>
          </div>
        ))}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default AuthLayout;
