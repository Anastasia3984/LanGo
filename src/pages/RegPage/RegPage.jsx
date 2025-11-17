import React, { useState, useEffect } from "react";
import styles from "./RegPage.module.css";
import AuthLayout from "../../layouts/AuthLayout";
import LogIn from "../../modals/Auth/LogIn";
import SignUp from "../../modals/Auth/SignUp";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

const RegPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [invitedEmail, setInvitedEmail] = useState("");
  const [invitedTeacherId, setInvitedTeacherId] = useState(null);
  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      setIsSignUp(true);
      fetch(`${API_BASE_URL}/invitations?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            const invitation = data[0];
            setInvitedEmail(invitation.email);
            setInvitedTeacherId(invitation.teacher_id);
            console.log(
              "Found invitation from teacher:",
              invitation.teacher_id,
            );
          }
        })
        .catch((err) => console.error("Error fetching invitation:", err));
    }
  }, [searchParams]);

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
                initialEmail={invitedEmail}
                linkedTeacherId={invitedTeacherId}
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
