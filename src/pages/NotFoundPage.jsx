import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import styles from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.notFoundWrapper}>
      <div className={styles.ringsContainer}>
        {[...Array(6)].map((_, index) => (
          <div key={index} className={styles.ring}>
            <div className={styles.ringTab}></div>
            <div className={styles.ringCircle}></div>
          </div>
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>Oops! Page not found</h1>
        <p className={styles.description}>
          Looks like you got lost in the language learning journey!
          <br />
          Don't worry, we'll help you find your way back.
        </p>

        <div className={styles.illustration}>
          <span className={styles.emoji}>🗺️</span>
          <span className={styles.emoji}>❓</span>
          <span className={styles.emoji}>🧭</span>
        </div>

        <div className={styles.buttonGroup}>
          <Button
            variant="orange"
            className={styles.homeButton}
            onClick={handleGoHome}
          >
            Go to home page
          </Button>
          <Button
            variant="orange"
            className={styles.backButton}
            onClick={handleGoBack}
          >
            Go back
          </Button>
        </div>

        <p className={styles.hint}>
          Or try searching for what you need in the navigation menu
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
