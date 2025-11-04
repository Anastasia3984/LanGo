import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import { Outlet, useNavigate } from "react-router-dom";
import styles from "./MainLayout.module.css";
import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
  const [notification, setNotification] = useState("");
  const { user, logout, isAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);

  if (!isAuth) {
    return null;
  }

  return (
    <div className={styles.layoutWrapper}>
      <Header
        notificationMessage={notification}
        user={user}
        onLogout={logout}
      />
      <main className={styles.content}>
        <Outlet context={{ setNotification }} />
      </main>
    </div>
  );
};

export default MainLayout;
