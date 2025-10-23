import React, { useState } from "react";
import styles from "./SignUp.module.css";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";

const SignUp = ({ onSwitchToLogIn }) => {
  const [role, setRole] = useState(null);

  return (
    <div className={styles.signupWrapper}>
      <h2 className={styles.title}>Sign up</h2>

      <div className={styles.whiteBox}>
        <InputField
          type="text"
          placeholder="Name"
          className={styles.firstInput}
        />
        <InputField
          type="email"
          placeholder="Email"
          className={styles.subsequentInput}
        />

        <div className={`${styles.passwordGroup} ${styles.subsequentInput}`}>
          <InputField type="password" placeholder="Password" />
          <p className={styles.passwordHint}>
            *password must contain at least 8 characters
          </p>
        </div>

        <div className={styles.roleButtons}>
          <Button
            className={`${styles.roleButton} ${styles.studentButton} ${
              role === "student" ? styles.active : ""
            }`}
            onClick={() => setRole("student")}
          >
            student
          </Button>
          <Button
            className={`${styles.roleButton} ${styles.teacherButton} ${
              role === "teacher" ? styles.active : ""
            }`}
            onClick={() => setRole("teacher")}
          >
            teacher
          </Button>
        </div>

        <Button type="submit" variant="orange" className={styles.submitButton}>
          Sign up
        </Button>
        <div className={styles.logInText}>
          <span className={styles.noAccount}>Already have an account?</span>
          <span className={styles.logInLink} onClick={onSwitchToLogIn}>
            Log in
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
