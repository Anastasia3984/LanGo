import React from "react";
import styles from "./CloseButton.module.css";

export const CloseButton = ({ onClick, className }) => {
  return (
    <button
      className={`${styles.closeButton} ${className || ""}`}
      onClick={onClick}
      aria-label="Close modal"
    >
      &times;
    </button>
  );
};
