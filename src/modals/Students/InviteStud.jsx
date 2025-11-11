import React, { useState } from "react";
import styles from "./InviteStud.module.css";
import InputField from "../../components/common/InputField";
import TextArea from "../../components/common/TextArea";
import Button from "../../components/common/Button";

const InviteStud = ({ onInvite, closeModal, setNotification }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    "Hello! I'd like to invite you to join our learning platform.",
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    setIsLoading(true);

    try {
      await onInvite(email);
      if (typeof setNotification === "function") {
        setNotification("Invitation was sent successfully!");
      }

      if (typeof closeModal === "function") {
        closeModal();
      }
      setTimeout(() => {
        if (typeof setNotification === "function") {
          setNotification("");
        }
      }, 5000);
    } catch (err) {
      setError(err.message || "Failed to send invitation. Please try again.");
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
