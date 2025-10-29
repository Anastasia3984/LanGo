import React, { useState } from "react";
import Header from "../components/layout/Header";
import styles from "./MainLayout.module.css";

const MainLayout = ({ children }) => {
  const [notification, setNotification] = useState("");

  return (
    <div className={styles.layoutWrapper}>
      <Header notificationMessage={notification} />
      <main className={styles.content}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && typeof child.type === "function") {
            return React.cloneElement(child, { setNotification });
          }
          return child;
        })}
      </main>
    </div>
  );
};

export default MainLayout;
