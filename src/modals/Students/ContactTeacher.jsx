import React, { useState } from "react";
import styles from "./ContactTeacher.module.css";
import Button from "../../components/common/Button";

const ContactTeacher = ({
  closeModal,
  setNotification,
  studentName,
  studentEmail,
}) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (subject.trim() && message.trim()) {
      console.log("Sending message:", {
        studentName,
        studentEmail,
        subject,
        message,
      });

      if (typeof setNotification === "function") {
        setNotification("Message has been sent to teacher!");
      }
      if (typeof closeModal === "function") {
        closeModal();
      }
      setTimeout(() => {
        if (typeof setNotification === "function") {
          setNotification("");
        }
      }, 5000);
    }
  };

  return (
    <div className={styles.contactModal}>
      <h2 className={styles.title}>Send message</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={studentName}
          disabled
          className={`${styles.input} ${styles.disabledInput}`}
          placeholder="Your nickname"
        />

        <input
          type="email"
          value={studentEmail}
          disabled
          className={`${styles.input} ${styles.disabledInput}`}
          placeholder="Your email"
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={styles.input}
          required
        />

        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={styles.textarea}
          rows={4}
          required
        />

        <Button type="submit" variant="orange" className={styles.submitButton}>
          Send
        </Button>
      </form>
    </div>
  );
};

export default ContactTeacher;
