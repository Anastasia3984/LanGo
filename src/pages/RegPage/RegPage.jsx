import React from "react";
import styles from "./RegPage.module.css";
import AuthLayout from "../../layouts/AuthLayout";
import LogIn from "../../modals/Auth/LogIn";

const RegPage = () => {
  return (
    <div className={styles.regPageWrapper}>
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <h1 className={styles.logo}>LanGo</h1>
          <p className={styles.subheading}>
            Learn languages on the go, anytime, anywhere
          </p>
          <p className={styles.description}>
            Lango connects teachers and students
            <br />
            in one place.
            <br />
            Teachers assign homework, students
            <br />
            complete it and learning becomes
            <br />
            simple and comfortable.
          </p>
        </div>
        <div className={styles.rightColumn}>
          <AuthLayout>
            <LogIn />
          </AuthLayout>
        </div>
      </div>
    </div>
  );
};

export default RegPage;
