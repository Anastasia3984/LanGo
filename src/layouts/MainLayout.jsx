import React, { useState } from "react";
import Header from "../components/layout/Header";
import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.css";

const MainLayout = () => {
  const [notification, setNotification] = useState("");

  return (
    <div className={styles.layoutWrapper}>
      <Header notificationMessage={notification} />
      <main className={styles.content}>
        <Outlet context={{ setNotification }} />
      </main>
    </div>
  );
};

export default MainLayout;
