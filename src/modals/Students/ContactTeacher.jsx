import React, { useState } from "react";
import styles from "./ContactTeacher.module.css";
import Button from "../../components/common/Button";
import { usePost } from "../../hooks/usePost";
import { useAuth } from "../../context/AuthContext";

const ContactTeacher = ({ closeModal, setNotification }) => {
  const { user } = useAuth();
  const { post } = usePost("/messages");

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (subject.trim() && message.trim()) {
      setIsLoading(true);
      const targetTeacherId = user.teacherId || user.teacher_id;

      if (!targetTeacherId) {
        if (setNotification)
          setNotification("Error: Teacher not assigned to this account.");
        setIsLoading(false);
        return;
      }

      try {
        await post({
          senderId: user.id,
          receiverId: targetTeacherId,
          subject: subject,
          body: message,
        });

        if (typeof setNotification === "function") {
          setNotification("Message has been sent to teacher!");
        }
        if (typeof closeModal === "function") {
          closeModal();
        }
      } catch (err) {
        console.error("Failed to send message:", err);
        if (typeof setNotification === "function") {
          setNotification("Error: Failed to send message.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.contactModal}>
      <h2 className={styles.title}>Send message</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={user?.name || ""}
          disabled
          className={`${styles.input} ${styles.disabledInput}`}
          placeholder="Your nickname"
        />

        <input
          type="email"
          value={user?.email || ""}
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
          disabled={isLoading}
        />

        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={styles.textarea}
          rows={4}
          required
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="orange"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
};

export default ContactTeacher;
