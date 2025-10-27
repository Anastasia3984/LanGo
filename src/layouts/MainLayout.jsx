import React, { useState } from "react";
import Header from "../components/layout/Header";
import styles from "./MainLayout.module.css";

const MainLayout = ({ children }) => {
  const [notification, setNotification] = useState("");

  return (
    <div className={styles.layoutWrapper}>
      <Header
        notificationMessage={notification}
        setNotification={setNotification}
      />
      <main className={styles.content}>
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { setNotification }),
        )}
      </main>
    </div>
  );
};

export default MainLayout;
