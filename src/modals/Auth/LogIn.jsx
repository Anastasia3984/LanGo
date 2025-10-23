import React from "react";
import styles from "./LogIn.module.css";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";

const LogIn = ({ onSwitchToSignUp }) => {
  return (
    <div className={styles.loginWrapper}>
      <h2 className={styles.title}>Log in</h2>

      <div className={styles.whiteBox}>
        <InputField type="email" placeholder="Email" />
        <InputField
          type="password"
          placeholder="Password"
          className={styles.passwordInput}
        />

        <Button type="submit" variant="orange" className={styles.submitButton}>
          Log in
        </Button>

        <div className={styles.signUpText}>
          <span className={styles.noAccount}>Don’t have an account?</span>
          <span className={styles.signUpLink} onClick={onSwitchToSignUp}>
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
