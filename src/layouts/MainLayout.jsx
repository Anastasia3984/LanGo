import React, { useState } from "react";
import Header from "../components/layout/Header";
import styles from "./MainLayout.module.css";

const MainLayout = ({ children }) => {
  const [notification, setNotification] = useState("Homework has been added");

  return (
    <div className={styles.layoutWrapper}>
      <Header notificationMessage={notification} />
      <main className={styles.content}>{children}</main>
    </div>
  );
};

export default MainLayout;
