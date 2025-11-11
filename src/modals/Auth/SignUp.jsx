import React, { useState } from "react";
import styles from "./SignUp.module.css";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignUp = ({ onSwitchToLogIn }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(null);
  const [gender, setGender] = useState(null);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !role) {
      setError(
        "Please fill in all required fields (Name, Email, Password, Role)",
      );
      return;
    }
    if (password.length < 8) {
      setError("Password must contain at least 8 characters");
      return;
    }
    if (!role) {
      setError("Please select a role (student or teacher)");
      return;
    }

    try {
      const registrationData = { name, email, password, role, gender };
      console.log("Відправка на сервер:", registrationData);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const fakeUserData = {
        id: 2,
        name: name,
        email: email,
        role: role,
        gender: gender,
      };
      login(fakeUserData);
      if (fakeUserData.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/student");
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
          <p className={styles.passwordHint}>
            *password must contain at least 8 characters
          </p>
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
