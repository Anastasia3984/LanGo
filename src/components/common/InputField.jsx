import React from "react";
import styles from "./InputField.module.css";

const InputField = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  disabled = false,
  "data-cy": dataCy,
}) => {
  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.input}
        disabled={disabled}
        data-cy={dataCy}
      />
    </div>
  );
};

export default InputField;
