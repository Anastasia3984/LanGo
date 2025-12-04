import React, { useState } from "react";
import styles from "./InviteStud.module.css";
import InputField from "../../components/common/InputField";
import TextArea from "../../components/common/TextArea";
import Button from "../../components/common/Button";
import { usePost } from "../../hooks/usePost";
import { useAuth } from "../../context/AuthContext";

const InviteStud = ({ closeModal, setNotification }) => {
  const { user } = useAuth();
  const { post } = usePost("/invitations");

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    "Hello! I'd like to invite you to join our learning platform.",
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [testLink, setTestLink] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setTestLink(null);

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await post({
        email,
        message,
        teacherId: user.id,
      });

      if (response && response.link) {
        setTestLink(response.link);
        if (setNotification) setNotification("Test link generated! See below.");
      } else {
        if (setNotification) setNotification("Invitation sent successfully!");
        if (closeModal) closeModal();
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to send invitation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.inviteModal}>
      <h2 className={styles.title}>Invite</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <InputField
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.inputField}
          disabled={isLoading}
        />

        <TextArea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={styles.textArea}
          rows={3}
          disabled={isLoading}
        />
        {testLink && (
          <div className={styles.testLinkBox}>
            <span className={styles.linkLabel}>Link generated:</span>
            <a
              href={testLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkUrl}
            >
              Click to register
            </a>
          </div>
        )}

        {error && <p className={styles.errorText}>{error}</p>}

        <Button
          type="submit"
          variant="orange"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Invite"}
        </Button>
      </form>
    </div>
  );
};

export default InviteStud;
