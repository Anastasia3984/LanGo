import React, { useState } from "react";
import styles from "./RegPage.module.css";
import AuthLayout from "../../layouts/AuthLayout";
import LogIn from "../../modals/Auth/LogIn";
import SignUp from "../../modals/Auth/SignUp";
import { useNavigate } from "react-router-dom";

const RegPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const handleAuthSuccess = (role) => {
    if (role === "teacher") {
      navigate("/teacher");
    } else if (role === "student") {
      navigate("/student");
    } else {
      console.error("Unknown user role:", role);
      navigate("/");
    }
  };

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
            {isSignUp ? (
              <SignUp
                key="signup"
                onSwitchToLogIn={() => setIsSignUp(false)}
                onAuthSuccess={handleAuthSuccess}
              />
            ) : (
              <LogIn
                key="login"
                onSwitchToSignUp={() => setIsSignUp(true)}
                onAuthSuccess={handleAuthSuccess}
              />
            )}
          </AuthLayout>
        </div>
      </div>
    </div>
  );
};

export default RegPage;
