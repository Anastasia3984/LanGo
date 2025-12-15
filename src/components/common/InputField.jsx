import React from "react";
import styles from "./InputField.module.css";

const InputField = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  disabled = false, // 1. ПОВЕРНУТО пропс disabled
  "data-cy": dataCy, // 2. ПОВЕРНУТО пропс data-cy
}) => {
  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.input}
        // 3. ПЕРЕДАЄМО атрибути до DOM-елементу <input>
        disabled={disabled}
        data-cy={dataCy}
      />
    </div>
  );
};

export default InputField;
