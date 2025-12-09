import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./SignUp.module.css";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";

const SignUp = ({ onSwitchToLogIn, onAuthSuccess, initialEmail = "" }) => {
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("token");

  const [name, setName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(inviteToken ? "student" : null);
  const [gender, setGender] = useState(null);
  const [error, setError] = useState("");

  const { signup } = useAuth();

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
    if (inviteToken) setRole("student");
  }, [initialEmail, inviteToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !role) {
      setError("*Please fill in all required fields");
      return;
    }
    if (password.length < 8) {
      setError("*Password must contain at least 8 characters");
      return;
    }

    try {
      const registrationData = {
        name,
        email,
        password,
        role,
        gender: gender || null,
        token: inviteToken || null,
      };

      const result = await signup(registrationData);

      if (result.success) {
        onAuthSuccess(result.user.role);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Failed to create account. Please try again.");
    }
  };

  return (
    <div className={styles.signupWrapper}>
      <h2 className={styles.title}>Sign up</h2>

      <form className={styles.whiteBox} onSubmit={handleSubmit}>
        {inviteToken && (
          <p
            style={{
              color: "green",
              fontSize: "0.9rem",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            You are accepting an invitation!
          </p>
        )}
        <InputField
          type="text"
          placeholder="Name"
          className={styles.firstInput}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputField
          type="email"
          placeholder="Email"
          className={styles.subsequentInput}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className={`${styles.passwordGroup} ${styles.subsequentInput}`}>
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={`${styles.genderButtons} ${styles.subsequentInput}`}>
          <button
            type="button"
            className={`${styles.genderButton} ${styles.maleButton} ${
              gender === "male" ? styles.genderActive : ""
            }`}
            onClick={() => setGender("male")}
          >
            Male
          </button>
          <button
            type="button"
            className={`${styles.genderButton} ${styles.femaleButton} ${
              gender === "female" ? styles.genderActive : ""
            }`}
            onClick={() => setGender("female")}
          >
            Female
          </button>
        </div>
        {!inviteToken && (
          <div className={styles.roleButtons}>
            <Button
              type="button"
              className={`${styles.roleButton} ${styles.studentButton} ${
                role === "student" ? styles.active : ""
              }`}
              onClick={() => setRole("student")}
            >
              student
            </Button>
            <Button
              type="button"
              className={`${styles.roleButton} ${styles.teacherButton} ${
                role === "teacher" ? styles.active : ""
              }`}
              onClick={() => setRole("teacher")}
            >
              teacher
            </Button>
          </div>
        )}

        {error && <p className={styles.errorText}>{error}</p>}

        <Button type="submit" variant="orange" className={styles.submitButton}>
          Sign up
        </Button>

        <div className={styles.logInText}>
          <span className={styles.noAccount}>Already have an account?</span>
          <span className={styles.logInLink} onClick={onSwitchToLogIn}>
            Log in
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
