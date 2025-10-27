import React from "react";
import styles from "./TextArea.module.css";

const TextArea = ({ placeholder, className, ...rest }) => {
  return (
    <textarea
      className={`${styles.textArea} ${className || ""}`}
      placeholder={placeholder}
      {...rest}
    />
  );
};

export default TextArea;
