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

  console.log("🔍 InviteStud props:", { closeModal, setNotification });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("✅ Form submitted!");
    console.log("📧 Email:", email);
    if (email.trim()) {
      console.log("🎉 Email is valid, proceeding...");
      if (typeof setNotification === "function") {
        console.log("✅ setNotification is a function, calling it...");
        setNotification("Invitation was sent to student's email!");
      } else {
        console.error("❌ setNotification is NOT a function:", setNotification);
      }

      if (typeof closeModal === "function") {
        console.log("✅ closeModal is a function, calling it...");
        closeModal();
      } else {
        console.error("❌ closeModal is NOT a function:", closeModal);
      }

      setTimeout(() => {
        if (typeof setNotification === "function") {
          setNotification("");
        }
      }, 5000);
    } else {
      console.log("❌ Email is empty!");
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
