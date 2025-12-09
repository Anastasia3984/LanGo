import React, { useState } from "react";
import styles from "./LogIn.module.css";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
const LogIn = ({ onSwitchToSignUp, onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("*Please fill in all fields");
      return;
    }

    try {
      const result = await login(email, password);

      if (result.success) {
        onAuthSuccess(result.user.role);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Login failed unexpectedly:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <h2 className={styles.title}>Log in</h2>
      <form className={styles.whiteBox} onSubmit={handleSubmit}>
        <InputField
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="Password"
          className={styles.passwordInput}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className={styles.errorText}>{error}</p>}

        <Button type="submit" variant="orange" className={styles.submitButton}>
          Log in
        </Button>

        <div className={styles.signUpText}>
          <span className={styles.noAccount}>Don’t have an account?</span>
          <span className={styles.signUpLink} onClick={onSwitchToSignUp}>
            Sign up
          </span>
        </div>
      </form>
    </div>
  );
};

export default LogIn;
