import React from "react";
import styles from "./Button.module.css";

const Button = ({
  children,
  variant = "orange",
  type = "button",
  onClick,
  disabled = false,
  className = "",
}) => {
  const classNames = [styles.button, styles[variant], className];

  if (disabled) {
    classNames.push(styles.disabled);
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames.join(" ")}
    >
      {children}
    </button>
  );
};
export default Button;
