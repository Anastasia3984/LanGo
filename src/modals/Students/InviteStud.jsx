import React, { useState } from "react";
import styles from "./InviteStud.module.css";
import InputField from "../../components/common/InputField";
import TextArea from "../../components/common/TextArea";
import Button from "../../components/common/Button";

const InviteStud = ({ closeModal, setNotification }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    "Hello! I'd like to invite you to join our learning platform.",
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.trim()) {
      console.log("Sending invitation to:", { email, message });

      setNotification("Invitation was sent to student's email!");
      closeModal();

      setTimeout(() => {
        setNotification("");
      }, 3000);
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
        />

        <TextArea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={styles.textArea}
          rows={3}
        />

        <Button type="submit" variant="orange" className={styles.submitButton}>
          Invite
        </Button>
      </form>
    </div>
  );
};

export default InviteStud;
